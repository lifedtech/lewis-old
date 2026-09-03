# regenerate_static_assets.py — regenerates the public sample
# Lewis-Insight-Report.pdf (the 24/25-page report, no personal data) from
# the real pipeline, and writes it to every place the app serves it from.
#
# Run this instead of ever hand-copying a PDF over these paths again —
# that's exactly how they got silently replaced with the 12-page
# streamlined report before. `python scripts/regenerate_static_assets.py`
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pdf_generator import build_insight_report_pdf, ASSET_PDF_PATHS


def main():
    pdf_bytes = build_insight_report_pdf()  # no report_data -> the real sample fixture
    for path in ASSET_PDF_PATHS:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(pdf_bytes)
        print(f"wrote {len(pdf_bytes)} bytes -> {os.path.abspath(path)}")


if __name__ == "__main__":
    main()
