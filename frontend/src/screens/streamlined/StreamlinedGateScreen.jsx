import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import { useDeviceViewport } from '../../shared/hooks/useDeviceViewport.js'

export default function StreamlinedGateScreen() {
  const { setScreen, setProfileField } = useLewisStore()
  const { isMobile } = useDeviceViewport()

  const handleChoice = (isAdult) => {
    setProfileField('isOver18', isAdult)
    if (isAdult) {
      setScreen('sl_welcome')
    } else {
      setScreen('sl_gate_stop')
    }
  }

  return (
    <motion.div
      className="screen-container center-aligned"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: isMobile ? '24px 16px' : '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Eyebrow */}
      <p
        className="gate-eyebrow"
        style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'var(--dawn, #00ae9d)',
          textTransform: 'uppercase',
          margin: '0 auto 10px auto',
          textAlign: 'center',
          width: '100%',
        }}
      >
        WELCOME TO LEWIS
      </p>

      {/* Title */}
      <h1
        className="gate-title"
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          fontSize: isMobile ? '28px' : 'clamp(24px, 3.4vw, 42px)',
          lineHeight: 1.18,
          letterSpacing: '-0.035em',
          margin: '0 auto 12px auto',
          color: 'var(--text-main, #414242)',
          width: '100%',
          maxWidth: '780px',
          textAlign: 'center',
          whiteSpace: 'normal',
        }}
      >
        Before we begin, are you 18 or older?
      </h1>

      {/* Subtitle */}
      <p
        className="gate-subtitle"
        style={{
          margin: '0 auto 36px auto',
          fontSize: isMobile ? '15px' : 'clamp(14px, 1.6vw, 16px)',
          color: 'var(--text-sub, #657370)',
          fontFamily: "'Nunito', sans-serif",
          textAlign: 'center',
          width: '100%',
        }}
      >
        LEWIS is built and tested for adults.
      </p>

      {/* Choice Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          gap: '14px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: isMobile ? '320px' : '100%',
          margin: '0 auto',
        }}
      >
        <button
          type="button"
          onClick={() => handleChoice(true)}
          className="btn-primary"
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 32px',
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
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Yes, I am 18 or older
        </button>

        <button
          type="button"
          onClick={() => handleChoice(false)}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 28px',
            borderRadius: '100px',
            fontSize: '14.5px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            border: '1px solid var(--card-border, #e5e7eb)',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
            color: 'var(--text-main, #414242)',
            cursor: 'pointer',
            boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
            transition: 'all 0.2s ease',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          No, I am under 18
        </button>
      </div>
    </motion.div>
  )
}
