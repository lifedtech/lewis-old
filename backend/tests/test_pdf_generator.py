# test_pdf_generator.py — guards the exact prod outage this fixes: pdf_generator.py
# imports reportlab/pypdf, but they weren't in requirements.txt, so Railway
# never installed them and every PDF route/email attachment 500'd silently.
# This test fails loudly (in the same env requirements.txt provisions) if
# that ever regresses.
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from pdf_generator import build_insight_report_pdf, get_template_pdf_path


def test_template_pdf_resolves_and_builds():
    path = get_template_pdf_path()
    assert path and os.path.exists(path), "authentic Lewis-Insight-Report.pdf template not found on any candidate path"

    pdf_bytes = build_insight_report_pdf(report_data={"x": 1}, report_uuid="TEST", user_name="Test User")
    assert pdf_bytes.startswith(b"%PDF-"), "output is not a valid PDF"
    assert len(pdf_bytes) > 100000, "PDF suspiciously small — likely a stub/error page, not the real report"


if __name__ == "__main__":
    test_template_pdf_resolves_and_builds()
    print("ok")
