import { useEffect, useState, useCallback } from 'react'

/**
 * Adaptive Browser Screen-Ratio Brain
 * Continuously measures real-time browser window dimensions, viewport height/width,
 * aspect ratio (W:H and H:W), and vertical density index.
 * Injects dynamic CSS variables directly into document.documentElement (:root) so all
 * cards, typography, margins, gaps, and buttons auto-align and prevent container outburst.
 */

function calculateBrowserMetrics() {
  if (typeof window === 'undefined') {
    return {
      width: 390,
      height: 844,
      ratio: 0.462,
      invRatio: 2.164,
      orientation: 'portrait',
      screenClass: 'modern',
      heightClass: 'standard',
      scaleFactor: 1.0,
    }
  }

  // Use visualViewport if supported for high-precision mobile browser sizing (handles virtual keyboards & URL bars)
  const vv = window.visualViewport
  const width = Math.round(vv ? vv.width : window.innerWidth)
  const height = Math.round(vv ? vv.height : window.innerHeight)

  const ratio = width / Math.max(height, 1)
  const invRatio = height / Math.max(width, 1)
  const orientation = width >= height ? 'landscape' : 'portrait'

  // Screen ratio classification based on real browser viewport
  let screenClass = 'modern'
  if (orientation === 'landscape') {
    screenClass = width >= 1024 ? 'desktop-landscape' : 'mobile-landscape'
  } else {
    if (invRatio >= 2.15) {
      screenClass = 'ultra-tall' // 20:9, 21:9, 22:9 (Sony Xperia, Galaxy S24 Ultra, Fold outer)
    } else if (invRatio >= 1.90) {
      screenClass = 'modern' // 19.5:9, 19:9 (iPhone 13/14/15/16 Pro, Pixel, Galaxy S23)
    } else if (invRatio >= 1.60) {
      screenClass = 'classic' // 16:9, 18:9 (iPhone SE, 8 Plus, classic mobile)
    } else {
      screenClass = 'foldable' // 4:3, 3:4, 1:1, tablets / unfolded foldables
    }
  }

  // Height classification for vertical compression
  let heightClass = 'standard'
  if (height < 600) {
    heightClass = 'compact-tight' // Mobile virtual keyboard or very short screen
  } else if (height < 720) {
    heightClass = 'compact' // iPhone SE, small phones
  } else if (height > 950) {
    heightClass = 'tall'
  }

  // Proportional fluid scale factor (0.82 to 1.15)
  // Combines horizontal width constraint with vertical headroom
  let scaleFactor = 1.0
  if (orientation === 'portrait') {
    const widthFactor = Math.min(1.15, Math.max(0.85, width / 390))
    const heightFactor = Math.min(1.15, Math.max(0.82, height / 844))
    scaleFactor = Math.min(widthFactor, heightFactor)
  } else {
    scaleFactor = Math.min(1.15, Math.max(0.85, height / 700))
  }
  scaleFactor = Number(scaleFactor.toFixed(3))

  return {
    width,
    height,
    ratio: Number(ratio.toFixed(4)),
    invRatio: Number(invRatio.toFixed(4)),
    orientation,
    screenClass,
    heightClass,
    scaleFactor,
  }
}

export function useAdaptiveScreenBrain() {
  const [metrics, setMetrics] = useState(calculateBrowserMetrics)

  const syncToDOM = useCallback((m) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    // Raw Dimension & Ratio Variables
    root.style.setProperty('--bw-w', `${m.width}px`)
    root.style.setProperty('--bw-h', `${m.height}px`)
    root.style.setProperty('--bw-ratio', String(m.ratio))
    root.style.setProperty('--bw-ratio-inv', String(m.invRatio))
    root.style.setProperty('--scale-factor', String(m.scaleFactor))

    // Fluid Typography Variables (Guaranteed zero text clipping)
    const h1Size = Math.max(20, Math.min(38, Math.round(26 * m.scaleFactor)))
    const subSize = Math.max(12, Math.min(15.5, Number((14 * m.scaleFactor).toFixed(1))))
    const optPadV = Math.max(7, Math.min(15, Math.round(12 * m.scaleFactor)))
    const optPadH = Math.max(12, Math.min(22, Math.round(18 * m.scaleFactor)))
    const cardPadV = Math.max(12, Math.min(28, Math.round(20 * m.scaleFactor)))
    const cardPadH = Math.max(14, Math.min(32, Math.round(22 * m.scaleFactor)))
    const optGap = Math.max(6, Math.min(12, Math.round(9 * m.scaleFactor)))

    root.style.setProperty('--fluid-h1', `${h1Size}px`)
    root.style.setProperty('--fluid-sub', `${subSize}px`)
    root.style.setProperty('--fluid-opt-pad-v', `${optPadV}px`)
    root.style.setProperty('--fluid-opt-pad-h', `${optPadH}px`)
    root.style.setProperty('--fluid-card-pad-v', `${cardPadV}px`)
    root.style.setProperty('--fluid-card-pad-h', `${cardPadH}px`)
    root.style.setProperty('--fluid-gap', `${optGap}px`)

    // Safe Header / Nav Allocation
    const headerHeight = m.heightClass.startsWith('compact') ? 48 : 64
    root.style.setProperty('--header-safe-space', `${headerHeight}px`)

    // Data attributes for selective CSS overrides
    root.setAttribute('data-browser-ratio', m.screenClass)
    root.setAttribute('data-browser-orientation', m.orientation)
    root.setAttribute('data-height-class', m.heightClass)
  }, [])

  useEffect(() => {
    let rafId = null

    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const next = calculateBrowserMetrics()
        setMetrics(next)
        syncToDOM(next)
      })
    }

    // Initial sync
    const initial = calculateBrowserMetrics()
    setMetrics(initial)
    syncToDOM(initial)

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleResize, { passive: true })

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize, { passive: true })
      window.visualViewport.addEventListener('scroll', handleResize, { passive: true })
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize)
      }
    }
  }, [syncToDOM])

  return metrics
}

export default useAdaptiveScreenBrain
