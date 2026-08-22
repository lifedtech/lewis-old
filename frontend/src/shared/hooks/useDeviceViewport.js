import { useState, useEffect } from 'react'

/**
 * useDeviceViewport
 * High-precision viewport listener using window.matchMedia('(max-width: 767px)').
 * Dynamically switches between mobile (<768px) and desktop/tablet (>=768px).
 */
export function useDeviceViewport() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 767px)').matches
  })

  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === 'undefined') return { width: 1200, height: 800 }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia('(max-width: 767px)')

    const updateState = () => {
      setIsMobile(mql.matches)
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Modern API with fallback
    if (mql.addEventListener) {
      mql.addEventListener('change', updateState)
    } else {
      mql.addListener(updateState)
    }

    window.addEventListener('resize', updateState, { passive: true })
    window.addEventListener('orientationchange', updateState, { passive: true })

    // Initial check
    updateState()

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', updateState)
      } else {
        mql.removeListener(updateState)
      }
      window.removeEventListener('resize', updateState)
      window.removeEventListener('orientationchange', updateState)
    }
  }, [])

  return {
    isMobile,
    isDesktop: !isMobile,
    width: dimensions.width,
    height: dimensions.height,
  }
}

export default useDeviceViewport
