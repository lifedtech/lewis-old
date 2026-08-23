// exportPdf.js — standard A4 canvas-accurate PDF export for the Insight Report.
//
// Renders every .ir-page at uniform desktop A4 dimensions (794px × 1123px)
// regardless of device viewport (mobile / tablet / desktop), so no page is
// ever squished, cropped, or misaligned in mobile PDF viewers.

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export const A4_PAGE_WIDTH = 794
export const A4_PAGE_HEIGHT = 1123

export async function exportReportPdf(filename = 'Lewis-Insight-Report.pdf') {
  await document.fonts?.ready // Avoid font fallback flash
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  const scrollX = window.scrollX
  const scrollY = window.scrollY
  const pages = Array.from(document.querySelectorAll('.ir-page'))
  if (!pages.length) return

  // High-DPI capture (2x device scale) ensures razor-sharp text, curves and vector graphics
  const scale = 2
  const btn = document.querySelector('.ir-cover-download-btn')
  const prevVisibility = btn?.style.visibility

  let pdf = null
  try {
    for (let i = 0; i < pages.length; i++) {
      const el = pages[i]
      if (i === 0 && btn) btn.style.visibility = 'hidden'

      const pageBackground = el.classList.contains('ir-cover') 
        ? '#013e39' 
        : (getComputedStyle(el).backgroundColor || '#ffffff')

      let canvas
      try {
        canvas = await html2canvas(el, {
          scale,
          width: A4_PAGE_WIDTH,
          height: A4_PAGE_HEIGHT,
          windowWidth: 1200, // Forces desktop layout rules inside html2canvas
          windowHeight: 1600,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: null,
          useCORS: true,
          allowTaint: false,
          imageTimeout: 0,
          logging: false,
          onclone: (clonedDoc, clonedEl) => {
            // 1. Force cloned viewport to desktop width
            if (clonedDoc.documentElement) {
              clonedDoc.documentElement.style.width = '1200px'
            }
            if (clonedDoc.body) {
              clonedDoc.body.style.width = '1200px'
            }

            // 2. Hide download button in cover page
            const clonedBtn = clonedDoc.querySelector('.ir-cover-download-btn')
            if (clonedBtn) {
              clonedBtn.style.display = 'none'
            }

            // 3. Force cloned page to exact standard A4 document box
            if (clonedEl) {
              clonedEl.style.setProperty('width', `${A4_PAGE_WIDTH}px`, 'important')
              clonedEl.style.setProperty('min-width', `${A4_PAGE_WIDTH}px`, 'important')
              clonedEl.style.setProperty('max-width', `${A4_PAGE_WIDTH}px`, 'important')
              clonedEl.style.setProperty('height', `${A4_PAGE_HEIGHT}px`, 'important')
              clonedEl.style.setProperty('min-height', `${A4_PAGE_HEIGHT}px`, 'important')
              clonedEl.style.setProperty('max-height', `${A4_PAGE_HEIGHT}px`, 'important')
              clonedEl.style.setProperty('box-sizing', 'border-box', 'important')
              clonedEl.style.setProperty('margin', '0 auto', 'important')
              clonedEl.style.setProperty('border-radius', '0px', 'important')
              clonedEl.style.setProperty('box-shadow', 'none', 'important')
              clonedEl.style.setProperty('border', 'none', 'important')
              clonedEl.style.setProperty('overflow', 'hidden', 'important')
              clonedEl.style.setProperty('background-color', pageBackground, 'important')

              // If inner cover container exists, fix its height
              const coverInner = clonedEl.querySelector('div[style*="height"]')
              if (coverInner) {
                coverInner.style.height = `${A4_PAGE_HEIGHT}px`
                coverInner.style.minHeight = `${A4_PAGE_HEIGHT}px`
                coverInner.style.maxHeight = `${A4_PAGE_HEIGHT}px`
              }
            }
          },
        })
      } finally {
        if (i === 0 && btn) btn.style.visibility = prevVisibility || ''
      }

      const imgData = canvas.toDataURL('image/png')

      if (!pdf) {
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [A4_PAGE_WIDTH, A4_PAGE_HEIGHT],
          hotfixes: ['px_scaling'],
          compress: true,
        })
      } else {
        pdf.addPage([A4_PAGE_WIDTH, A4_PAGE_HEIGHT], 'portrait')
      }

      pdf.addImage(imgData, 'PNG', 0, 0, A4_PAGE_WIDTH, A4_PAGE_HEIGHT, undefined, 'FAST')
    }

    pdf.save(filename)
  } finally {
    if (btn) btn.style.visibility = prevVisibility || ''
    window.scrollTo(scrollX, scrollY)
  }
}
