// exportPdf.js — canvas-accurate PDF export for the Insight Report.
//
// Replaces the old window.print()/@media print A4 pagination: each .ir-page
// DOM node is rasterized at its own natural rendered size (html2canvas) and
// placed on a PDF page sized to match exactly (jsPDF), so no page is ever
// forced into a fixed A4 box, cropped, or misaligned.

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function exportReportPdf(filename = 'LEWIS-Insight-Report.pdf') {
  await document.fonts?.ready       // avoid a fallback-font flash in the capture
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  const scrollX = window.scrollX
  const scrollY = window.scrollY
  const pages = Array.from(document.querySelectorAll('.ir-page'))
  if (!pages.length) return

  // Two device pixels per CSS pixel keeps text and inline SVGs sharp without
  // creating canvases large enough to be cropped by the browser.
  const scale = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2)
  const btn = document.querySelector('.ir-cover-download-btn')
  const prevVisibility = btn?.style.visibility

  let pdf = null
  try {
    for (let i = 0; i < pages.length; i++) {
      const el = pages[i]
      if (i === 0 && btn) btn.style.visibility = 'hidden'

      const bounds = el.getBoundingClientRect()
      const width = Math.ceil(bounds.width)
      const height = Math.ceil(bounds.height)
      const pageBackground = getComputedStyle(el).backgroundColor || '#ffffff'

      let canvas
      try {
        canvas = await html2canvas(el, {
          scale,
          width,
          height,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          // Let the page paint its own background. The clone override below
          // also protects the cover from html2canvas's transparent-root path.
          backgroundColor: null,
          useCORS: true,
          allowTaint: false,
          imageTimeout: 0,
          logging: false,
          onclone: (clonedDocument) => {
            // html2canvas clones the page being captured, so it is the first
            // report page in the cloned document on every iteration.
            const clonedPage = clonedDocument.querySelector('.ir-page')
            clonedPage?.style.setProperty('background-color', pageBackground, 'important')
          },
        })
      } finally {
        if (i === 0 && btn) btn.style.visibility = prevVisibility || ''
      }

      // PNG preserves the report's exact colours, alpha edges, text, and SVG
      // diagrams. JPEG introduced visible halos and flattened the cover.
      const imgData = canvas.toDataURL('image/png')

      if (!pdf) pdf = new jsPDF({ unit: 'px', format: [width, height], compress: true })
      else pdf.addPage([width, height])
      pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST')
    }
    pdf.save(filename)
  } finally {
    if (btn) btn.style.visibility = prevVisibility || ''
    window.scrollTo(scrollX, scrollY)
  }
}

// Note: do NOT pass `hotfixes: ['px_scaling']` to the jsPDF constructor above.
// That flag reinstates jsPDF's legacy unit:'px' behavior (1px == 1pt); the
// current default already treats 'px' as a real CSS pixel (1/96 inch), which
// is what makes el.offsetWidth/offsetHeight a correct page size.
