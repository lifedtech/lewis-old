import React from 'react'
import LewisLogo from '../../components/LewisLogo.jsx'
import ThemeToggle from '../../components/ThemeToggle.jsx'
import { useLewisStore } from '../../store/useLewisStore.js'
import { SCREEN_ORDER, getStageInfo } from '../../shared/constants/screenOrder.js'

export default function MobileHeader({ currentScreen, onBack }) {
  const { isAuthenticated, authUser, logout, setScreen } = useLewisStore()
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen)
  const percent = currentIndex > 0 ? Math.round((currentIndex / (SCREEN_ORDER.length - 1)) * 100) : 0

  return (
    <header className="mobile-app-header" style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      paddingTop: 'max(8px, env(safe-area-inset-top))',
      background: 'var(--panel-2, rgba(246, 251, 249, 0.75))',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--panel-border, rgba(0, 174, 157, 0.08))',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {currentIndex > 0 && (
          <button
            onClick={() => {
              if (onBack) {
                onBack()
                return
              }
              if (currentScreen === 'billing') {
                setScreen('mirror')
                return
              }
              if (currentScreen === 'reportReview') {
                setScreen('billing')
                return
              }
              if (currentScreen === 'paymentConfirm') {
                setScreen('mirror')
                return
              }
              const idx = SCREEN_ORDER.indexOf(currentScreen)
              if (idx > 0 && SCREEN_ORDER[idx - 1]) {
                setScreen(SCREEN_ORDER[idx - 1])
              } else {
                setScreen('landing')
              }
            }}
            className="header-back-btn"
            aria-label="Go back"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '6px 8px 6px 0',
              color: 'var(--text-main, #414242)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation',
              outline: 'none',
              boxShadow: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}
        <div
          onClick={() => setScreen('landing')}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
          role="button"
          tabIndex={0}
          title="Go to Home"
          aria-label="Go to Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setScreen('landing')
            }
          }}
        >
          <LewisLogo size={28} showText={true} animated={false} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ThemeToggle compact={true} />
        {currentIndex > 0 && (
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--dawn, #00ae9d)',
            fontFamily: "'Nunito', sans-serif",
            background: 'var(--dawn-soft, #e6f7f2)',
            padding: '3px 10px',
            borderRadius: '999px',
            letterSpacing: '0.02em',
          }}>
            {percent}%
          </span>
        )}
        {isAuthenticated && authUser && (
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-mute, #85918e)',
              fontSize: '11px',
              cursor: 'pointer',
              padding: '4px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
