# report_full_html.py — renders the 24-page Insight Report to HTML by
# server-side rendering the SAME React component the app shows on-screen
# (frontend/src/report/InsightReport.jsx + report.css), instead of a
# hand-maintained Python duplicate. One renderer, no drift between what a
# user sees and what their PDF contains.
#
# Talks to a persistent Node subprocess (render-report.mjs --serve) kept
# alive for the life of the backend process, instead of spawning a fresh
# Node process per render — same fix, same reason, as pdf_generator.py's
# persistent Playwright worker: a cold Node start + bundle load was costing
# ~1s of every report's generation time. One JSON line in, one JSON line
# out per render, serialized behind a lock (a single pipe pair to one Node
# process — no dedicated worker thread needed here, unlike Playwright,
# since a subprocess pipe isn't thread-affinal).
import atexit
import json
import logging
import os
import subprocess
import threading
from typing import Any, Dict, Optional

logger = logging.getLogger("lewis.report_full_html")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RENDER_SCRIPT = os.path.join(BASE_DIR, "..", "frontend", "dist-report", "render-report.mjs")
RENDER_TIMEOUT_SECONDS = 30

_node_process: Optional[subprocess.Popen] = None
_node_lock = threading.Lock()


def _spawn_node_process() -> subprocess.Popen:
    script_path = os.path.abspath(RENDER_SCRIPT)
    if not os.path.exists(script_path):
        raise RuntimeError(
            f"Report SSR bundle not found at {script_path}. "
            "Run `npm run build:report` in frontend/ (this must happen during "
            "deploy, same as any other frontend build step)."
        )
    try:
        return subprocess.Popen(
            ["node", script_path, "--serve"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except FileNotFoundError as exc:
        raise RuntimeError("Node.js is not available on PATH to render the full report") from exc


def _ensure_node_process() -> subprocess.Popen:
    global _node_process
    if _node_process is None or _node_process.poll() is not None:
        _node_process = _spawn_node_process()
    return _node_process


def _kill_node_process(proc: subprocess.Popen) -> None:
    global _node_process
    if _node_process is proc:
        _node_process = None
    try:
        proc.kill()
    except Exception:
        pass


@atexit.register
def _cleanup_node_process() -> None:
    if _node_process is not None:
        _kill_node_process(_node_process)


def _readline_with_timeout(proc: subprocess.Popen, timeout: float) -> bytes:
    """proc.stdout.readline() has no timeout of its own — a wedged Node
    process would otherwise hang this call (and, since callers hold
    _node_lock for the round-trip, every future render) forever. Read on a
    helper thread and kill the process if it doesn't answer in time; the
    original one-shot subprocess.run had the same 30s ceiling."""
    result: Dict[str, Any] = {}

    def _reader():
        try:
            result["line"] = proc.stdout.readline()
        except Exception as e:
            result["exc"] = e

    t = threading.Thread(target=_reader, daemon=True)
    t.start()
    t.join(timeout)
    if t.is_alive():
        _kill_node_process(proc)
        raise RuntimeError(f"Node SSR render timed out after {timeout}s")
    if "exc" in result:
        raise result["exc"]
    return result.get("line", b"")


def render_full_report_html(insight_report: dict) -> str:
    """
    Sends the report JSON to the persistent Node SSR subprocess (one line
    in on stdin, one line out on stdout) and returns the HTML document it
    renders. Self-heals like pdf_generator.py's Playwright worker: if the
    process has died or wedged, it's killed/restarted and the render is
    retried once — a second failure is a real render error and is raised.
    """
    payload_line = (json.dumps(insight_report) + "\n").encode("utf-8")

    with _node_lock:
        last_error: Optional[Exception] = None
        for attempt in (1, 2):
            proc = _ensure_node_process()
            try:
                proc.stdin.write(payload_line)
                proc.stdin.flush()
                response_line = _readline_with_timeout(proc, RENDER_TIMEOUT_SECONDS)
                if not response_line:
                    raise RuntimeError(f"Node SSR process produced no output (exited: {proc.poll()})")
                response = json.loads(response_line)
            except Exception as e:
                # Pipe broken / process dead / wedged / garbled output —
                # kill it so the next attempt (or next call) spawns a fresh
                # process instead of talking to a half-dead one.
                stderr = b""
                try:
                    if proc.stderr:
                        stderr = proc.stderr.read(4096)
                except Exception:
                    pass
                _kill_node_process(proc)
                last_error = RuntimeError(
                    f"Full report SSR render failed: {e} {stderr.decode('utf-8', errors='replace')[:2000]}"
                )
                logger.warning("Node SSR process failed mid-render (attempt %d/2): %s", attempt, e)
                continue

            if "error" in response:
                raise RuntimeError(f"Full report SSR render failed: {str(response['error'])[:2000]}")
            html_content = response.get("html", "")
            if "<div id=\"root\">" not in html_content:
                raise RuntimeError("Full report SSR render produced unexpected output")
            return html_content

        raise last_error
