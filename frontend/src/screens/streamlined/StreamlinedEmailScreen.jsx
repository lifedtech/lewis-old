import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import ActTransitionCard from './ActTransitionCard.jsx'

export default function StreamlinedEmailScreen() {
  const { email, setProfileField, setScreen } = useLewisStore()
  const [userEmail, setUserEmail] = useState(email || '')
  const [optin, setOptin] = useState(true)
  const [showAct5, setShowAct5] = useState(false)

  const handleNext = () => {
    if (userEmail.trim()) {
      setProfileField('email', userEmail.trim())
    }
    setProfileField('subscribeNewsletter', optin)
    setShowAct5(true)
  }

  const handleAct5Dismiss = () => {
    setScreen('sl_5_3DeepDives')
  }

  if (showAct5) {
    return (
      <ActTransitionCard
        actNumber={5}
        title="Deeper look"
        subtitle="Exploring what sits beneath"
        onDismiss={handleAct5Dismiss}
      />
    )
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
        justifyContent: 'center',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 0 10px 0',
      }}>
        SAVE YOUR PROGRESS
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(28px, 3.8vw, 48px)',
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
      }}>
        Hold your reflection safely
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
        maxWidth: '480px',
      }}>
        Add your email so you can step away and return at any time. Your insight summary will also be delivered here.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '440px',
      }}>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="your.email@example.com"
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: '16px',
            fontSize: '15px',
            fontFamily: "'Nunito', sans-serif",
            border: '1px solid var(--card-border, #e5e7eb)',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
            color: 'var(--text-main, #414242)',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
            textAlign: 'center',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--dawn, #00ae9d)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--card-border, #e5e7eb)')}
        />

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontFamily: "'Nunito', sans-serif",
          color: 'var(--text-sub, #657370)',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={optin}
            onChange={(e) => setOptin(e.target.checked)}
            style={{ accentColor: 'var(--dawn, #00ae9d)' }}
          />
          Keep me updated on my reflection journey
        </label>

        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary"
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
      </div>
    </motion.div>
  )
}
