# pdf_generator.py — Authoritative Lewis Insight Report PDF Service
#
# Two distinct reports, two distinct renderers — they must never alias
# each other again (that was the bug: every "full report" download used
# to silently serve the 12-page streamlined HTML):
#   - build_insight_report_pdf()    -> the 24/25-page full report, server-
#                                       rendered from the same React
#                                       component (report_full_html.py)
#                                       the app shows on-screen.
#   - build_streamlined_report_pdf() -> the 12-page streamlined report
#                                       (report_streamlined_html.py).
import json
import os
import logging
from typing import Dict, Any, Optional
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
SAMPLE_FULL_REPORT_PATH = os.path.join(BASE_DIR, "tests", "fixtures", "sample_insight_report_25page.json")

_sample_full_report_cache: Optional[Dict[str, Any]] = None


def _load_sample_full_report() -> Dict[str, Any]:
    """The public/no-data 24-page report: a real, complete generated
    report kept as a fixture, not a hand-authored stub."""
    global _sample_full_report_cache
    if _sample_full_report_cache is None:
        with open(SAMPLE_FULL_REPORT_PATH, "r", encoding="utf-8") as f:
            _sample_full_report_cache = json.load(f)
    return _sample_full_report_cache


def _generate_pdf_sync(html_content: str) -> bytes:
    """
    Synchronously renders HTML with Playwright Headless Chromium to A4 PDF.
    """
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content, wait_until="load", timeout=15000)
        page.wait_for_timeout(300)
        page.emulate_media(media="print")
        pdf_bytes = page.pdf(
            format="A4",
            print_background=True,
            prefer_css_page_size=True
        )
        browser.close()
        return pdf_bytes


def _generate_single_page_pdf_sync(html_content: str) -> bytes:
    """
    Renders HTML to Playwright/Chromium as ONE continuous PDF page sized
    to the content's real height — no A4 pagination, no page breaks
    (both render-report.jsx and report_streamlined_html.py already drop
    break-after rules for this reason). Used for both the full report
    (25 sections) and the streamlined report (12 sections): each reads
    top-to-bottom as one long page instead of paginated sheets.
    """
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
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
        pdf_bytes = page.pdf(
            width="210mm",
            height=f"{content_height_px}px",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        browser.close()
        return pdf_bytes


def build_insight_report_pdf(
    report_data: Optional[Dict[str, Any]] = None,
    report_uuid: Optional[str] = None,
    user_name: Optional[str] = None,
    order_id: Optional[str] = None,
    allow_generic_fallback: bool = True
) -> bytes:
    """
    Generates the authoritative 24/25-page full Insight Report PDF,
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
    caller is the delivery email, the in-app download, or Lewis OS —
    'streamlined_report' (₹349) gets the 12-page report, everything else
    ('personal_report', 'bundle', unknown) gets the 25-page one. Never
    falls back to generic/sample content — a real customer only ever
    receives a report built from their own submitted answers.
    """
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
