import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

export default function StreamlinedGateStopScreen() {
  const { setScreen } = useLewisStore()

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
        justifyContent: 'center',
        width: '100%',
        maxWidth: '580px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(217, 164, 74, 0.12)',
        color: '#d9a44a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 0 10px 0',
      }}>
        THANK YOU FOR YOUR HONESTY
      </p>

      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(28px, 3.8vw, 44px)',
        lineHeight: 1.1,
        letterSpacing: '-0.035em',
        margin: '0 0 16px 0',
        color: 'var(--text-main, #414242)',
      }}>
        LEWIS is designed for adults
      </h1>

      <div style={{
        background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
        border: '1px solid var(--card-border, #e5e7eb)',
        borderRadius: '20px',
        padding: '24px',
        textAlign: 'left',
        marginBottom: '28px',
        boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
      }}>
        <p style={{
          fontSize: '14px',
          fontFamily: "'Nunito', sans-serif",
          color: 'var(--text-main, #414242)',
          lineHeight: 1.6,
          margin: '0 0 12px 0',
        }}>
          The reflections here are built and tested for people 18 and older, so the journey stops here for now. Nothing you have entered has been saved. You will be very welcome back when you are 18.
        </p>
        <p style={{
          fontSize: '14px',
          fontFamily: "'Nunito', sans-serif",
          color: 'var(--text-sub, #657370)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Caring about your own wellbeing at your age is a genuine strength. If things ever feel heavy, please talk to someone you trust: a parent, a teacher, a school counsellor, or another adult in your corner.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setScreen('landing')}
        style={{
          padding: '12px 32px',
          borderRadius: '100px',
          fontSize: '14px',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.02em',
          border: '1px solid var(--card-border, #e5e7eb)',
          background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
          color: 'var(--text-main, #414242)',
          cursor: 'pointer',
          boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        Return to Homepage
      </button>
    </motion.div>
  )
}
