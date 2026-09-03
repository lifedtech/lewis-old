# test_pdf_generator.py — guards the exact prod outage this fixes: pdf_generator.py
# imports reportlab/pypdf, but they weren't in requirements.txt, so Railway
# never installed them and every PDF route/email attachment 500'd silently.
# This test fails loudly (in the same env requirements.txt provisions) if
# that ever regresses.
#
# Also guards the second outage found alongside it: the 24-page "full"
# report and the 12-page "streamlined" report were silently aliased to the
# same renderer, and the dedicated 24-page Python renderer that existed
# was missing about half the block types the data builder emits. Both are
# now structurally impossible to regress quietly: build_insight_report_pdf
# and build_streamlined_report_pdf are independent renderers, and the
# 24-page path server-renders the same InsightReport.jsx the app shows
# on-screen — one renderer, so a missing block type is a missing block
# type everywhere, not a silent PDF-only gap.
import io
import os
import re
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from pypdf import PdfReader

from pdf_generator import (
    build_insight_report_pdf,
    build_streamlined_report_pdf,
    build_report_pdf_for_plan,
    get_template_pdf_path,
)


def test_template_pdf_resolves_and_builds():
    path = get_template_pdf_path()
    assert path and os.path.exists(path), "authentic Lewis-Insight-Report.pdf template not found on any candidate path"

    pdf_bytes = build_insight_report_pdf(report_data={"x": 1}, report_uuid="TEST", user_name="Test User")
    assert pdf_bytes.startswith(b"%PDF-"), "output is not a valid PDF"
    assert len(pdf_bytes) > 100000, "PDF suspiciously small — likely a stub/error page, not the real report"


def test_full_report_pdf_is_the_full_report_not_the_streamlined_one():
    """The bug: every 'full report' download used to silently stream the
    12-page streamlined HTML. Assert the two builders are independent.

    Both reports are deliberately ONE continuous PDF page sized to their
    real content height (no A4 pagination — see
    pdf_generator._generate_single_page_pdf_sync), so each is asserted
    by a tall single page sized to its own content, not a page count."""
    full_pdf = build_insight_report_pdf()  # no data -> falls back to the real sample fixture
    full_reader = PdfReader(io.BytesIO(full_pdf))
    assert len(full_reader.pages) == 1, "full report should be a single continuous page, not paginated"
    full_height_pt = float(full_reader.pages[0].mediabox.height)
    assert full_height_pt > 15000, (
        f"full report page height ({full_height_pt}pt) looks too short for a real ~25-section "
        "report — likely truncated or rendered from the wrong (short) source"
    )

    streamlined_pdf = build_streamlined_report_pdf()
    streamlined_reader = PdfReader(io.BytesIO(streamlined_pdf))
    assert len(streamlined_reader.pages) == 1, "streamlined report should be a single continuous page, not paginated"
    streamlined_height_pt = float(streamlined_reader.pages[0].mediabox.height)
    assert streamlined_height_pt > 4000, (
        f"streamlined report page height ({streamlined_height_pt}pt) looks too short for a real "
        "12-section report — likely truncated or rendered from the wrong (short) source"
    )
    # The full report has roughly double the sections (25 vs 12), so its
    # single page should be substantially taller than the streamlined one.
    assert full_height_pt > streamlined_height_pt, "full report should be taller than the streamlined report"

    assert full_pdf != streamlined_pdf, "full and streamlined PDFs must never be byte-identical again"


def test_react_report_component_covers_every_block_type_the_data_builder_emits():
    """The other half of the bug: report_full_25page_generator.py (now
    retired) only handled 16 of the 33 block types insight_report.py
    emits — content silently vanished. The renderer in production is now
    frontend/src/report/InsightReport.jsx's BLOCKS registry; assert it
    stays a superset of whatever insight_report.py's page builders emit,
    so a newly-added block type can't go unrendered again."""
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    insight_report_src = open(os.path.join(backend_dir, "insight_report.py"), encoding="utf-8").read()
    emitted_types = set(re.findall(r'"type":\s*"([a-z_]+)"', insight_report_src))
    assert emitted_types, "regex found no block types in insight_report.py — check the pattern still matches"

    jsx_path = os.path.join(backend_dir, "..", "frontend", "src", "report", "InsightReport.jsx")
    jsx_src = open(jsx_path, encoding="utf-8").read()
    blocks_match = re.search(r"const BLOCKS = \{(.*?)\n\}", jsx_src, re.DOTALL)
    assert blocks_match, "BLOCKS registry not found in InsightReport.jsx — did it get renamed/restructured?"
    rendered_types = set(re.findall(r"^\s*([a-z_]+):", blocks_match.group(1), re.MULTILINE))
    # Handled outside the generic BLOCKS dispatcher: CoverPage reads a
    # "prepared" block directly for the cover's "Prepared for" box.
    rendered_types.add("prepared")

    missing = emitted_types - rendered_types
    assert not missing, f"insight_report.py emits block type(s) InsightReport.jsx cannot render: {sorted(missing)}"


def test_strict_mode_refuses_to_substitute_a_generic_report():
    """A real customer's email/download must never go out generic or stale.
    allow_generic_fallback=False (what mailer.py and the in-app download
    endpoint now always pass) must raise instead of silently returning the
    sample report when there's no real, answer-derived data to render."""
    try:
        build_insight_report_pdf(report_data={"x": 1}, allow_generic_fallback=False)
        assert False, "expected a RuntimeError, no exception was raised"
    except RuntimeError:
        pass


def test_plan_dispatch_picks_the_paid_for_report():
    """build_report_pdf_for_plan is the single place mailer.py and the
    download/Lewis-OS endpoints decide which renderer runs — it must route
    'streamlined_report' orders to the 12-page report and everything else
    to the 25-page one, and it must never substitute generic content."""
    sample_rro = {
        "meta": {"name": "Test User", "rro_id": "T1", "date_display": "1 January 2026"},
        "dimensions": [{"code": "who5", "score": 70}],
    }
    streamlined_pdf = build_report_pdf_for_plan("streamlined_report", report_data=sample_rro, report_uuid="T1")
    assert streamlined_pdf.startswith(b"%PDF-")

    # A 'personal_report' order with no real report data must refuse to
    # send, not fall back to the generic sample.
    try:
        build_report_pdf_for_plan("personal_report", report_data=None, report_uuid="T2")
        assert False, "expected a RuntimeError, no exception was raised"
    except RuntimeError:
        pass

    # Same for 'streamlined_report' with no real RRO — this is the exact
    # gap that let a report with nothing but placeholder name/date go out:
    # the checkout flow's report_uuid pointed at nothing real, and this
    # dispatcher used to build a shell PDF anyway instead of refusing.
    try:
        build_report_pdf_for_plan("streamlined_report", report_data=None, report_uuid="T3")
        assert False, "expected a RuntimeError, no exception was raised"
    except RuntimeError:
        pass


if __name__ == "__main__":
    test_template_pdf_resolves_and_builds()
    test_full_report_pdf_is_the_full_report_not_the_streamlined_one()
    test_react_report_component_covers_every_block_type_the_data_builder_emits()
    test_strict_mode_refuses_to_substitute_a_generic_report()
    test_plan_dispatch_picks_the_paid_for_report()
    print("ok")
