import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLewisStore } from './store/useLewisStore.js'
import { useDeviceViewport } from './shared/hooks/useDeviceViewport.js'
import { useAdaptiveScreenBrain } from './hooks/useAdaptiveScreenBrain.js'
import { SCREEN_ORDER } from './shared/constants/screenOrder.js'
import LewisLoadingScreen from './components/LewisLoadingScreen.jsx'
import SupportWidget from './components/SupportWidget.jsx'

// Dedicated UI Layers
import MobileApp from './mobile/MobileApp.jsx'
import DesktopApp from './desktop/DesktopApp.jsx'

export default function App() {
  const { isMobile } = useDeviceViewport()
  useAdaptiveScreenBrain()

  const { currentScreen, theme } = useLewisStore()
  const [bootLoading, setBootLoading] = useState(true)

  // Sync Theme ('light' | 'dark') to document root
  useEffect(() => {
    const currentTheme = theme || 'light'
    document.documentElement.setAttribute('data-theme', currentTheme)
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // Early warmup ping to wake up backend container from cold start
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    fetch(`${API_BASE}/`, { method: 'GET' }).catch(() => {})

    const timer = setTimeout(() => {
      setBootLoading(false)
    }, 1400)
    return () => clearTimeout(timer)
  }, [])

  // Sync state with URL hash & support browser back/forward.
  // A hash can carry a query string (e.g. an emailed review link:
  // #report-review?report_id=...&email=...) — split it off before using the
  // hash as a screen key (SCREENS lookups are exact-match, so the raw hash
  // never matches and silently falls back to 'landing'), but keep the query
  // string in the URL itself so ReportReviewScreen's own hash parsing still
  // finds report_id/email/name/order_id.
  useEffect(() => {
    const rawHash = window.location.hash.replace('#', '')
    const [hashScreen, hashQuery] = rawHash.split('?')
    const initialScreen = hashScreen || useLewisStore.getState().currentScreen || 'landing'
    useLewisStore.getState().setScreen(initialScreen, { skipHistory: true })

    const newUrl = initialScreen === 'landing'
      ? (window.location.pathname + window.location.search)
      : `#${initialScreen}${hashQuery ? `?${hashQuery}` : ''}`

    if (!window.history.state?.screen || (initialScreen === 'landing' && window.location.hash)) {
      window.history.replaceState({ screen: initialScreen }, '', newUrl)
    }

    const handlePopState = (event) => {
      const popHash = window.location.hash ? window.location.hash.replace('#', '').split('?')[0] : 'landing'
      const targetScreen = event.state?.screen || popHash
      if (targetScreen) {
        useLewisStore.getState().setScreen(targetScreen, { skipHistory: true })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Background Telemetry & Inactivity Heartbeat
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const sendPing = () => {
      const store = useLewisStore.getState()
      if (!store.journeySessionId) return
      const idx = SCREEN_ORDER.indexOf(currentScreen)
      const pct = idx >= 0 ? Number(((idx / (SCREEN_ORDER.length - 1)) * 100).toFixed(1)) : 0.0
      const durationSec = store.getJourneyDurationSeconds ? store.getJourneyDurationSeconds() : 0

      if (currentScreen === 'mirror') {
        fetch(`${API_BASE}/journey/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: store.journeySessionId, duration_seconds: durationSec }),
        }).catch(() => {})
        return
      }

      fetch(`${API_BASE}/journey/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: store.journeySessionId,
          user_name: store.name || store.authUser?.name || null,
          user_email: store.email || store.authUser?.email || null,
          age_category: store.ageCategory || null,
          gender: store.gender || null,
          current_stage: idx >= 0 ? Math.min(10, Math.floor(idx / 5)) : 0,
          current_screen: currentScreen,
          progress_percent: pct,
          duration_seconds: durationSec,
        }),
      }).catch(() => {})
    }

    sendPing()
    const interval = setInterval(sendPing, 45000)
    return () => clearInterval(interval)
  }, [currentScreen])

  return (
    <>
      <AnimatePresence mode="wait">
        {bootLoading && (
          <LewisLoadingScreen
            key="boot-loader"
            onComplete={() => {
              // Was: setScreen('landing') here unconditionally, on every
              // boot — including a refresh mid-screen. The hash-sync effect
              // above already resolves the correct screen (from the URL,
              // or the persisted store) before this fires; forcing
              // 'landing' here clobbered that every single time.
              setBootLoading(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Responsive Viewport Switcher */}
      {isMobile ? <MobileApp /> : <DesktopApp />}

      {/* Global Bottom-Left Support / Help Widget */}
      <SupportWidget />
    </>
  )
}
