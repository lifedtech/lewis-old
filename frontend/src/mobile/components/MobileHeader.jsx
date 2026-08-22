import React from 'react'
import LewisLogo from '../../components/LewisLogo.jsx'
import { useLewisStore } from '../../store/useLewisStore.js'
import { SCREEN_ORDER, getStageInfo } from '../../shared/constants/screenOrder.js'

export default function MobileHeader({ currentScreen, onBack }) {
  const { isAuthenticated, authUser, logout, setScreen } = useLewisStore()
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen)
  const percent = currentIndex > 0 ? Math.round((currentIndex / (SCREEN_ORDER.length - 1)) * 100) : 0
  const stageInfo = getStageInfo(currentScreen)

  return (
    <header className="mobile-app-header" style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      paddingTop: 'max(8px, env(safe-area-inset-top))',
      background: 'rgba(246, 251, 249, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0, 174, 157, 0.08)',
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
              } else if (typeof window !== 'undefined' && window.history.state?.screen) {
                window.history.back()
              } else if (currentIndex > 0 && SCREEN_ORDER[currentIndex - 1]) {
                setScreen(SCREEN_ORDER[currentIndex - 1])
              } else {
                setScreen('landing')
              }
            }}
            aria-label="Go back"
            style={{
              background: 'none',
              border: 'none',
              padding: '6px 8px 6px 0',
              color: '#414242',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}
        <LewisLogo size={28} showText={true} animated={false} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {currentIndex > 0 && (
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#00ae9d',
            fontFamily: "'Nunito', sans-serif",
            background: '#e6f7f2',
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
              color: '#85918e',
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
