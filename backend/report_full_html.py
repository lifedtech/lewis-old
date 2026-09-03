# report_full_html.py — renders the 24/25-page Insight Report to HTML by
# server-side rendering the SAME React component the app shows on-screen
# (frontend/src/report/InsightReport.jsx + report.css), instead of a
# hand-maintained Python duplicate. One renderer, no drift between what a
# user sees and what their PDF contains.
import json
import logging
import os
import subprocess

logger = logging.getLogger("lewis.report_full_html")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RENDER_SCRIPT = os.path.join(BASE_DIR, "..", "frontend", "dist-report", "render-report.mjs")


def render_full_report_html(insight_report: dict) -> str:
    """
    Runs the bundled Node SSR script (built via `npm run build:report` in
    frontend/) as a subprocess: the report JSON goes in on stdin, a
    self-contained HTML document comes back on stdout.
    """
    script_path = os.path.abspath(RENDER_SCRIPT)
    if not os.path.exists(script_path):
        raise RuntimeError(
            f"Report SSR bundle not found at {script_path}. "
            "Run `npm run build:report` in frontend/ (this must happen during "
            "deploy, same as any other frontend build step)."
        )

    payload = json.dumps(insight_report).encode("utf-8")
    try:
        result = subprocess.run(
            ["node", script_path],
            input=payload,
            capture_output=True,
            timeout=30,
            check=False,
        )
    except FileNotFoundError as exc:
        raise RuntimeError("Node.js is not available on PATH to render the full report") from exc

    if result.returncode != 0:
        stderr = result.stderr.decode("utf-8", errors="replace")
        logger.error("render-report.mjs failed (exit %d): %s", result.returncode, stderr)
        raise RuntimeError(f"Full report SSR render failed: {stderr[:2000]}")

    html_content = result.stdout.decode("utf-8")
    if "<div id=\"root\">" not in html_content:
        raise RuntimeError("Full report SSR render produced unexpected output")
    return html_content
