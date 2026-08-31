import React from 'react'
import LewisLogo from '../../components/LewisLogo.jsx'
import ThemeToggle from '../../components/ThemeToggle.jsx'
import { useLewisStore } from '../../store/useLewisStore.js'
import { SCREEN_ORDER } from '../../shared/constants/screenOrder.js'

export default function DesktopHeader({ currentScreen, onBack }) {
  const { isAuthenticated, authUser, logout, setScreen } = useLewisStore()
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen)

  return (
    <header className="app-header" style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              color: 'var(--text-mute)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Nunito', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              transition: 'color 0.2s ease',
              outline: 'none',
              boxShadow: 'none',
            }}
            title="Go back to previous question"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--dawn, #00ae9d)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mute)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          <LewisLogo size={32} showText={true} animated={false} />
        </div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ThemeToggle />
        {isAuthenticated && authUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--panel-2)',
            padding: '4px 12px 4px 10px',
            borderRadius: '999px',
            border: '1px solid var(--panel-border)',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dawn)' }}>
              {authUser.name || authUser.email}
            </span>
            <button
              onClick={logout}
              title="Log Out"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-mute)',
                fontSize: '11px',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 600,
                marginLeft: '4px',
              }}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
