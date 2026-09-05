# pdf_generator.py — Authoritative Lewis Insight Report PDF Service
#
# Two distinct reports, two distinct renderers — they must never alias
# each other again (that was the bug: every "full report" download used
# to silently serve the 12-page streamlined HTML):
#   - build_insight_report_pdf()    -> the 24-page full report, server-
#                                       rendered from the same React
#                                       component (report_full_html.py)
#                                       the app shows on-screen.
#   - build_streamlined_report_pdf() -> the 12-page streamlined report
#                                       (report_streamlined_html.py).
import json
import os
import logging
import queue
import threading
from typing import Dict, Any, Callable, Optional
from datetime import datetime, timezone

from report_streamlined_html import render_streamlined_report_html
from report_full_html import render_full_report_html

logger = logging.getLogger("lewis.pdf_generator")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSET_PDF_PATHS = [
    os.path.join(BASE_DIR, "assets", "Lewis-Insight-Report.pdf"),
    os.path.join(BASE_DIR, "..", "frontend", "public", "Lewis-Insight-Report.pdf"),
    os.path.join(BASE_DIR, "..", "frontend", "Lewis-Insight-Report.pdf"),
]
SAMPLE_FULL_REPORT_PATH = os.path.join(BASE_DIR, "tests", "fixtures", "sample_insight_report_24page.json")

_sample_full_report_cache: Optional[Dict[str, Any]] = None


def _load_sample_full_report() -> Dict[str, Any]:
    """The public/no-data 24-page report: a real, complete generated
    report kept as a fixture, not a hand-authored stub."""
    global _sample_full_report_cache
    if _sample_full_report_cache is None:
        with open(SAMPLE_FULL_REPORT_PATH, "r", encoding="utf-8") as f:
            _sample_full_report_cache = json.load(f)
    return _sample_full_report_cache


# --- Persistent Playwright worker ------------------------------------------
#
# The actual "25-page report is slow" cause: every PDF used to launch a
# fresh headless Chromium and tear it down again per call — on top of the
# Node SSR subprocess render_full_report_html already spawns per call (see
# report_full_html.py). Cold Chromium launch/close was ~1s of the ~4-5s
# total per report on this machine, and worse (~10s+) the first time after
# a deploy/restart. Playwright's sync API is confined to the thread that
# created it, and PDF generation here is already called from multiple
# threads (request threadpool, mail_queue's worker/reconciliation threads),
# so one browser is kept alive in one dedicated worker thread for the life
# of the process, and every caller submits render jobs to it through a
# queue instead of launching its own.
#
# ponytail: jobs are serialized through a single browser/thread (no
# parallel rendering). Fine for this app's actual load — reports are
# generated once per order and then cached (see save_report_pdf) — and it
# avoids running N simultaneous Chromium processes on a memory-constrained
# host. If concurrent generation ever becomes the bottleneck, add more
# worker threads (one browser each) behind the same queue.
_pdf_job_queue: "queue.Queue" = queue.Queue()
_pdf_worker_thread: Optional[threading.Thread] = None
_pdf_worker_lock = threading.Lock()


def _pdf_worker_loop() -> None:
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            while True:
                render_fn, html_content, result_queue = _pdf_job_queue.get()
                try:
                    result_queue.put((True, render_fn(browser, html_content)))
                except Exception as e:
                    result_queue.put((False, e))
        finally:
            browser.close()


def _ensure_pdf_worker() -> None:
    global _pdf_worker_thread
    with _pdf_worker_lock:
        if _pdf_worker_thread is None or not _pdf_worker_thread.is_alive():
            _pdf_worker_thread = threading.Thread(
                target=_pdf_worker_loop, daemon=True, name="pdf-render-worker"
            )
            _pdf_worker_thread.start()


def _render_on_worker(render_fn: Callable[[Any, str], bytes], html_content: str) -> bytes:
    """Run `render_fn(browser, html_content)` on the persistent worker
    thread/browser and block for its result. Restarts the worker (paying
    the launch cost once, not per call) if a prior crash left it dead."""
    _ensure_pdf_worker()
    result_queue: "queue.Queue" = queue.Queue(maxsize=1)
    _pdf_job_queue.put((render_fn, html_content, result_queue))
    ok, result = result_queue.get()
    if not ok:
        raise result
    return result


def _render_a4_page(browser, html_content: str) -> bytes:
    page = browser.new_page()
    try:
        page.set_content(html_content, wait_until="load", timeout=15000)
        page.wait_for_timeout(300)
        page.emulate_media(media="print")
        return page.pdf(format="A4", print_background=True, prefer_css_page_size=True)
    finally:
        page.close()


def _render_single_page(browser, html_content: str) -> bytes:
    page = browser.new_page()
    try:
        page.set_content(html_content, wait_until="load", timeout=15000)
        # Wait for web fonts to actually finish loading before measuring
        # height — Nunito swaps in after `load` fires, reflows the text,
        # and can change scrollHeight. Measuring too early under-counts
        # it, which used to spill a couple of lines onto a silent second
        # page. document.fonts.ready is the real signal, not a timeout.
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(300)
        page.emulate_media(media="print")
        content_height_px = page.evaluate("document.documentElement.scrollHeight")
        return page.pdf(
            width="210mm",
            height=f"{content_height_px}px",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
    finally:
        page.close()


def _generate_pdf_sync(html_content: str) -> bytes:
    """Synchronously renders HTML with the persistent Playwright worker to A4 PDF."""
    return _render_on_worker(_render_a4_page, html_content)


def _generate_single_page_pdf_sync(html_content: str) -> bytes:
    """
    Renders HTML via the persistent Playwright worker as ONE continuous PDF
    page sized to the content's real height — no A4 pagination, no page
    breaks (both render-report.jsx and report_streamlined_html.py already
    drop break-after rules for this reason). Used for both the full report
    (25 sections) and the streamlined report (12 sections): each reads
    top-to-bottom as one long page instead of paginated sheets.
    """
    return _render_on_worker(_render_single_page, html_content)


def build_insight_report_pdf(
    report_data: Optional[Dict[str, Any]] = None,
    report_uuid: Optional[str] = None,
    user_name: Optional[str] = None,
    order_id: Optional[str] = None,
    allow_generic_fallback: bool = True
) -> bytes:
    """
    Generates the authoritative 24-page full Insight Report PDF,
    server-rendering the exact same React report the app shows on-screen
    (frontend/src/report/InsightReport.jsx + report.css).

    `report_data` may be the raw `insight_report` dict itself (has a
    "pages" list), or the wider assessment record that nests it under an
    "insight_report" key (both shapes are stored in different tables —
    accept both rather than guess which call site has which).

    `allow_generic_fallback` controls what happens when there is no real,
    answer-derived report to render (missing data, or the SSR render
    itself fails): True substitutes the generic no-data sample report —
    correct for the public unauthenticated /download sample. A real
    customer's report must NEVER go out generic or stale, so any caller
    sending a specific person their report (email delivery, their
    logged-in download) must pass False, which raises instead of quietly
    substituting sample/static content.
    """
    insight_report: Optional[Dict[str, Any]] = None
    if isinstance(report_data, dict):
        candidate = report_data.get("insight_report", report_data)
        if isinstance(candidate, dict) and candidate.get("pages"):
            insight_report = candidate

    if not insight_report:
        if not allow_generic_fallback:
            raise RuntimeError(
                f"No answer-derived report data available for report_uuid={report_uuid} "
                f"order_id={order_id} — refusing to substitute the generic sample report."
            )
        insight_report = _load_sample_full_report()

    name = insight_report.get("meta", {}).get("name") or user_name or "Client"
    rep_id = report_uuid or "LSR2026"

    try:
        html_content = render_full_report_html(insight_report)
        pdf_bytes = _generate_single_page_pdf_sync(html_content)
        logger.info(
            "Generated full Insight Report PDF for '%s' (ID: %s, Order: %s, Size: %d bytes)",
            name, rep_id, order_id or "-", len(pdf_bytes)
        )
        return pdf_bytes
    except Exception as e:
        logger.error("Error generating full Insight Report PDF: %s", e, exc_info=True)
        if not allow_generic_fallback:
            raise
        tpl_path = get_template_pdf_path()
        if tpl_path and os.path.exists(tpl_path):
            with open(tpl_path, "rb") as f:
                return f.read()
        raise


def detect_report_shape(report_data: Optional[Dict[str, Any]]) -> Optional[str]:
    """
    Which of the two report shapes `report_data` actually is, independent of
    any (possibly wrong) plan_id label — 'full', 'streamlined', or None if
    there's no usable data either way. See build_report_pdf_for_plan.
    """
    candidate = report_data.get("insight_report", report_data) if isinstance(report_data, dict) else None
    if isinstance(candidate, dict) and candidate.get("pages"):
        return "full"
    if isinstance(report_data, dict) and report_data.get("dimensions"):
        return "streamlined"
    return None


def build_report_pdf_for_plan(
    plan_id: Optional[str],
    report_data: Optional[Dict[str, Any]] = None,
    report_uuid: Optional[str] = None,
    user_name: Optional[str] = None,
    order_id: Optional[str] = None
) -> bytes:
    """
    Single dispatch point: which of the two renderers a paying customer's
    report goes through must always be decided the same way, whether the
    caller is the delivery email, the in-app download, or Lewis OS. Never
    falls back to generic/sample content — a real customer only ever
    receives a report built from their own submitted answers.

    The two report shapes are structurally distinguishable (a streamlined
    RRO has "dimensions" as a scored-area list and no "pages"/"insight_report"
    key; a full report has "pages"), so real data is routed by its actual
    shape first — plan_id decides only when there's no usable data either
    way (then it just picks which "no data" error to raise). This is
    deliberate: plan_id can drift out of sync with which assessment the
    customer actually completed (client-side state bugs, coupon/admin
    testing that bypasses the normal checkout form), and when that happens
    we still have their real report — better to serve it correctly than to
    trust a mislabeled tag and refuse a report we could actually send.
    """
    shape = detect_report_shape(report_data)

    if shape == "full":
        return build_insight_report_pdf(
            report_data=report_data, report_uuid=report_uuid, user_name=user_name,
            order_id=order_id, allow_generic_fallback=False
        )
    if shape == "streamlined":
        return build_streamlined_report_pdf(
            rro=report_data, report_uuid=report_uuid, user_name=user_name,
            order_id=order_id, allow_generic_fallback=False
        )

    # No usable data either way — plan_id just picks which "no real report
    # data" error to raise (still refuses; still never sends anything generic).
    if plan_id == "streamlined_report":
        return build_streamlined_report_pdf(
            rro=report_data, report_uuid=report_uuid, user_name=user_name,
            order_id=order_id, allow_generic_fallback=False
        )
    return build_insight_report_pdf(
        report_data=report_data, report_uuid=report_uuid, user_name=user_name,
        order_id=order_id, allow_generic_fallback=False
    )


def build_streamlined_report_pdf(
    rro: Optional[Dict[str, Any]] = None,
    report_uuid: Optional[str] = None,
    user_name: Optional[str] = None,
    order_id: Optional[str] = None,
    allow_generic_fallback: bool = True
) -> bytes:
    """
    Generates the 12-page Streamlined Insight Report PDF, matching
    "LEWIS Insight Report.dc.html" section-for-section.

    `allow_generic_fallback` mirrors build_insight_report_pdf: False (what
    the plan dispatcher above always passes) raises instead of silently
    rendering a name/date shell with no real scored content when `rro`
    wasn't actually found/generated — the exact gap that let a customer's
    report email go out built from nothing but placeholder defaults.
    """
    if not (isinstance(rro, dict) and rro.get("dimensions")):
        if not allow_generic_fallback:
            raise RuntimeError(
                f"No answer-derived streamlined report data available for report_uuid={report_uuid} "
                f"order_id={order_id} — refusing to substitute a generic/placeholder report."
            )

    rep_id = report_uuid or "LSR2026"
    name = (user_name or (rro or {}).get("meta", {}).get("name") or "Client").strip()
    if not name or name == "Friend":
        name = "Client"

    rro = dict(rro or {})
    meta = dict(rro.get("meta") or {})
    meta.setdefault("name", name)
    meta.setdefault("rro_id", rep_id)
    meta.setdefault("date_display", datetime.now(timezone.utc).strftime("%d %B %Y"))
    meta.setdefault("order_id", order_id)
    rro["meta"] = meta

    html_content = render_streamlined_report_html(rro)
    pdf_bytes = _generate_single_page_pdf_sync(html_content)
    logger.info(
        "Generated streamlined Insight Report PDF for '%s' (ID: %s, Size: %d bytes)",
        name, rep_id, len(pdf_bytes)
    )
    return pdf_bytes


def get_template_pdf_path() -> Optional[str]:
    """Find the authentic 24-page Lewis Insight Report PDF (last-resort
    fallback if live rendering fails)."""
    for path in ASSET_PDF_PATHS:
        if os.path.exists(path) and os.path.getsize(path) > 10000:
            return path
    return None
