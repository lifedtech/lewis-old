// exportPdf.js — canvas-accurate PDF export for the Insight Report.
//
// Each .ir-page DOM node is rasterized at its natural standard rendered size
// (html2canvas) and placed on a PDF page sized to match exactly (jsPDF), so
// no page is ever cropped, misaligned, or distorted.

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function exportReportPdf(filename = 'LEWIS-Insight-Report.pdf') {
  await document.fonts?.ready // Avoid fallback font flash
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
          backgroundColor: null,
          useCORS: true,
          allowTaint: false,
          imageTimeout: 0,
          logging: false,
          onclone: (clonedDocument) => {
            const clonedPage = clonedDocument.querySelector('.ir-page')
            clonedPage?.style.setProperty('background-color', pageBackground, 'important')
          },
        })
      } finally {
        if (i === 0 && btn) btn.style.visibility = prevVisibility || ''
      }

      const imgData = canvas.toDataURL('image/png')

      if (!pdf) {
        pdf = new jsPDF({ unit: 'px', format: [width, height], compress: true })
      } else {
        pdf.addPage([width, height])
      }
      pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST')
    }
    pdf.save(filename)
  } finally {
    if (btn) btn.style.visibility = prevVisibility || ''
    window.scrollTo(scrollX, scrollY)
  }
}
