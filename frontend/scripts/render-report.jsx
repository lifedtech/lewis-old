// render-report.jsx — server-side entry point for the 24-page Insight Report.
//
// Renders the exact same component the app shows on-screen (InsightReport.jsx
// + report.css) to a static HTML document, so the PDF the backend generates
// can never drift from the approved on-screen design. Bundled to a single
// Node-runnable file with `npm run build:report` (see package.json).
//
// Two modes, both invoked by backend/report_full_html.py:
//   - one-shot (default): report JSON in on stdin, HTML document out on
//     stdout, process exits. Simple, but pays Node startup + module/bundle
//     load on every single PDF — the actual "report generation is slow"
//     cause alongside pdf_generator.py's old per-call Chromium launch.
//   - `--serve`: stays alive; report_full_html.py keeps one of these
//     running and sends it one newline-delimited JSON request per render
//     instead of spawning a fresh process each time (same fix as
//     pdf_generator.py's persistent Playwright worker, other language).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import InsightReport from '../src/report/InsightReport.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Print-only override: the on-screen `.ir-page` is a fixed-size preview
// card (840px, rounded corners, drop shadow) meant for scrolling, not a
// literal page. This reflows each `.ir-page` into a real print sheet for
// Playwright's print-to-PDF, without touching report.css (the live
// on-screen stylesheet stays exactly as designed).
//
// No page-break rules and no fixed page height here on purpose: the PDF
// this feeds is a single continuous page sized to the content's actual
// height (see pdf_generator.py), not a paginated A4 document — so
// nothing here should force a break or clip content to a page boundary.
// The 24 sections stay visually distinct via a hairline divider between
// them instead of a page turn.
const PRINT_CSS = `
@page { margin: 0; }
@media print {
  html, body { margin: 0; background: #ffffff; }
}
body { margin: 0; background: #ffffff; }
.ir-toolbar, .ir-fade-overlay, .ir-download-btn { display: none !important; }
.ir-faded-page-wrapper { mask-image: none !important; -webkit-mask-image: none !important; }
.ir-root { max-width: none; gap: 0; }
.ir-page {
  width: 210mm !important;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  border-radius: 0 !important;
  border: none !important;
  border-bottom: 1px solid #ededed !important;
  box-shadow: none !important;
  margin: 0 auto !important;
  break-after: auto;
  page-break-after: auto;
  overflow: visible;
}
.ir-page:last-child { border-bottom: none !important; }
`

// Read once, cached for both modes — serve mode must not re-read this
// file from disk on every request.
const REPORT_CSS = readFileSync(join(__dirname, '../src/report/report.css'), 'utf-8')

function buildHtml(report) {
  const markup = renderToStaticMarkup(React.createElement(InsightReport, { report }))
  const name = report?.meta?.name ? String(report.meta.name) : 'LEWIS Insight Report'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LEWIS Insight Report — ${name.replace(/</g, '&lt;')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
<style>${REPORT_CSS}</style>
<style>${PRINT_CSS}</style>
</head>
<body>
<div id="root">${markup}</div>
</body>
</html>`
}

function readStdin() {
  const chunks = []
  return new Promise((resolve, reject) => {
    process.stdin.on('data', (c) => chunks.push(c))
    process.stdin.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    process.stdin.on('error', reject)
  })
}

async function runOnce() {
  const raw = await readStdin()
  const report = JSON.parse(raw)
  process.stdout.write(buildHtml(report))
}

// One JSON request per line in, one JSON response per line out — framed as
// whole lines with the HTML JSON-encoded (so embedded newlines can't be
// mistaken for a frame boundary). Rendering is synchronous, so requests are
// naturally handled one at a time in the order they arrive; the Python side
// serializes calls the same way (see report_full_html.py), so no request ID
// is needed to match a response back to its caller.
function runServe() {
  const rl = createInterface({ input: process.stdin, terminal: false })
  rl.on('line', (line) => {
    if (!line.trim()) return
    let responseLine
    try {
      const report = JSON.parse(line)
      responseLine = JSON.stringify({ html: buildHtml(report) })
    } catch (err) {
      responseLine = JSON.stringify({ error: String(err?.stack || err) })
    }
    process.stdout.write(responseLine + '\n')
  })
}

async function main() {
  if (process.argv.includes('--serve')) {
    runServe()
  } else {
    await runOnce()
  }
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err) + '\n')
  process.exit(1)
})
