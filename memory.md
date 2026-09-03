# Lewis PDF Generator — Terminal Commands Reference

Commands used while building/fixing the two Lewis Insight Report PDF generators
(12-page streamlined, 24/25-page full). Run from the paths noted; `../.venv/Scripts/python.exe`
assumes you're in `backend/` with the repo's venv at the project root.

## Setup / build

```bash
# One-time / after editing frontend/scripts/render-report.jsx or InsightReport.jsx:
# rebuild the Node SSR bundle the full-report PDF renders from.
cd frontend
npm run build:report
# -> esbuild scripts/render-report.jsx --bundle --platform=node --format=esm
#    --jsx=automatic --loader:.css=empty --external:react --external:react-dom
#    --outfile=dist-report/render-report.mjs
```

```bash
# Confirm Playwright + its Chromium binary are actually usable in the venv.
cd backend
../.venv/Scripts/python.exe -c "
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    print('chromium launched ok')
    b.close()
"
```

## Generate reports

```bash
cd backend

# Both demo PDFs, through the real pipeline (real scoring, real Road B
# narration, real SSR/HTML render, real Playwright print) -> generated_reports/
../.venv/Scripts/python.exe scripts/generate_demo_reports.py

# Regenerate the public "no data" sample assets (the ones served at
# /download/Lewis-Insight-Report.pdf and mirrored into frontend/):
../.venv/Scripts/python.exe scripts/regenerate_static_assets.py
```

## Tests

```bash
cd backend

# Just the PDF-generator regression tests
../.venv/Scripts/python.exe -m pytest tests/test_pdf_generator.py -v

# Streamlined scoring / band-grouping regression tests
../.venv/Scripts/python.exe -m pytest tests/test_streamlined_scoring.py -v

# Full backend suite
../.venv/Scripts/python.exe -m pytest tests/ -q
```

## Verification / inspection

```bash
cd backend

# Page count + physical height of any generated PDF
../.venv/Scripts/python.exe -c "
from pypdf import PdfReader
r = PdfReader('generated_reports/LEWIS-Insight-Report-FULL-25page-DEMO.pdf')
print(len(r.pages), 'page(s),', round(float(r.pages[0].mediabox.height)/72,1), 'inches tall')
"

# Screenshot every section of the streamlined report for a visual check
# (swap render_streamlined_report_html/rro for the full report + InsightReport as needed)
../.venv/Scripts/python.exe -c "
import json
from report_streamlined_html import render_streamlined_report_html
rro = json.load(open('generated_reports/LEWIS-Insight-Report-STREAMLINED-12page-DEMO.rro.json', encoding='utf-8'))
html = render_streamlined_report_html(rro)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width':900,'height':1300})
    page.set_content(html, wait_until='load', timeout=15000)
    page.wait_for_timeout(300)
    secs = page.query_selector_all('.report-section')
    for i in range(len(secs)):
        secs[i].screenshot(path=f'qa_sec{i:02d}.png')
    b.close()
"
```

## One-off recovery commands used during the fix

```bash
# Restored the 3 Lewis-Insight-Report.pdf copies after they'd been
# accidentally overwritten with the wrong (12-page) report.
git checkout HEAD -- frontend/Lewis-Insight-Report.pdf backend/assets/Lewis-Insight-Report.pdf frontend/public/Lewis-Insight-Report.pdf
```

## Key files touched

- `frontend/scripts/render-report.jsx` — Node SSR entry for the full report; print CSS (single continuous page, no breaks)
- `backend/pdf_generator.py` — dispatches to the right renderer per report type; `_generate_single_page_pdf_sync` for the full report
- `backend/report_full_html.py` — shells out to the built SSR bundle
- `backend/report_streamlined_html.py` — 12-page HTML generator
- `backend/scoring_streamlined.py` — streamlined scoring/link-graph/narration pipeline
- `backend/scripts/generate_demo_reports.py`, `backend/scripts/regenerate_static_assets.py`
- `backend/tests/test_pdf_generator.py`, `backend/tests/test_streamlined_scoring.py`
