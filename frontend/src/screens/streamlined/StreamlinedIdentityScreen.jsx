import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import { useDeviceViewport } from '../../shared/hooks/useDeviceViewport.js'

const ROLE_TILES = [
  {
    id: 'Student',
    label: 'Student',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    )
  },
  {
    id: 'Professional',
    label: 'Professional',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
      </svg>
    )
  },
  {
    id: 'Entrepreneur or self-employed',
    label: 'Entrepreneur or self-employed',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2" />
        <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5" />
      </svg>
    )
  },
  {
    id: 'Primary caregiver',
    label: 'Primary caregiver',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 12c-1.5-1.5-2.5-1.5-3.5-0.5" />
      </svg>
    )
  },
  {
    id: 'Homemaker',
    label: 'Homemaker',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    id: 'Retired',
    label: 'Retired',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
        <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
        <path d="M5 18v2M19 18v2" />
      </svg>
    )
  },
  {
    id: 'Between jobs or job-seeking',
    label: 'Between jobs or job-seeking',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    )
  },
  {
    id: 'In transition',
    label: 'In transition',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3 4 7l4 4" />
        <path d="M4 7h16" />
        <path d="m16 21 4-4-4-4" />
        <path d="M20 17H4" />
      </svg>
    )
  },
  {
    id: 'Taking time out',
    label: 'Taking time out',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    )
  },
  {
    id: 'Living with a health condition',
    label: 'Living with a health condition',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28" />
      </svg>
    )
  },
  {
    id: 'Wearing many hats',
    label: 'Wearing many hats',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 10 5-10 5L2 7l10-5z" />
        <path d="m2 12 10 5 10-5" />
        <path d="m2 17 10 5 10-5" />
      </svg>
    )
  }
]

export default function StreamlinedIdentityScreen() {
  const { identityRoles, setProfileField, setScreen, theme } = useLewisStore()
  const { isMobile } = useDeviceViewport()
  const isDark = theme === 'dark'

  const handleSelect = (roleId) => {
    setProfileField('identityRoles', [roleId])
    setTimeout(() => {
      setScreen('sl_1_2Stability')
    }, 180)
  }

  const handleNext = () => {
    setScreen('sl_1_2Stability')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        minHeight: isMobile ? 'auto' : '70vh',
        padding: isMobile ? '8px 12px 220px 12px' : '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 0 10px 0',
      }}>
        CHOOSE ONE
      </p>

      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(28px, 3.8vw, 48px)',
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
      }}>
        Which describes you right now?
      </h1>

      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Select one that best describes you right now.
      </p>

      {/* 2-Column Grid of Icon Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        width: '100%',
        maxWidth: '680px',
        marginBottom: isMobile ? '32px' : '0',
      }}>
        {ROLE_TILES.map((tile, index) => {
          const isSelected = (identityRoles || []).includes(tile.id)
          const isDangling = ROLE_TILES.length % 2 !== 0 && index === ROLE_TILES.length - 1
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleSelect(tile.id)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '14px',
                textAlign: 'left',
                padding: '14px 18px',
                borderRadius: '16px',
                ...(isDangling && !isMobile ? { gridColumn: '1 / -1', maxWidth: '334px', margin: '0 auto' } : {}),
                fontFamily: "'Nunito', sans-serif",
                border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                width: '100%',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--card-border, #e5e7eb)'
              }}
            >
              <div style={{
                color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #718096)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {tile.icon}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1.35,
              }}>
                {tile.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Explicit mobile bottom scroll spacer so flexbox parent cannot collapse scroll boundary */}
      {isMobile && (
        <div
          style={{
            height: '140px',
            width: '100%',
            flexShrink: 0,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}

      {/* Continue Button: Docked bottom bar on mobile with background gradient blur and pointer event passthrough, untouched inline layout on desktop */}
      {isMobile ? (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px calc(16px + env(safe-area-inset-bottom, 0px)) 68px',
            background: isDark
              ? 'linear-gradient(to top, rgba(12, 21, 20, 0.98) 70%, rgba(12, 21, 20, 0) 100%)'
              : 'linear-gradient(to top, rgba(246, 251, 249, 0.98) 70%, rgba(246, 251, 249, 0) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9980,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          <button
            type="button"
            onClick={handleNext}
            style={{
              width: '100%',
              maxWidth: '340px',
              minHeight: '44px',
              padding: '11px 24px',
              borderRadius: '100px',
              fontSize: '15px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.02em',
              border: 'none',
              background: 'var(--dawn, #00ae9d)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 174, 157, 0.35)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Continue
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '36px' }}>
          <button
            type="button"
            onClick={handleNext}
            style={{
              padding: '12px 38px',
              borderRadius: '100px',
              fontSize: '14.5px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.02em',
              border: 'none',
              background: 'var(--dawn, #00ae9d)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Continue
          </button>
        </div>
      )}
    </motion.div>
  )
}
