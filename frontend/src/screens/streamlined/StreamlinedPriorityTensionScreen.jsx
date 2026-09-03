import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

export default function StreamlinedPriorityTensionScreen() {
  const { priorityTop3, domainSort, setProfileField, setScreen } = useLewisStore()

  const depletedList = domainSort?.depleted || []
  const tensionDomain = (priorityTop3 || []).find((c) => depletedList.includes(c)) || priorityTop3?.[0] || 'Meaning & purpose'

  const handleSelect = (val) => {
    setProfileField('tensionConfirmed', val)
    setTimeout(() => {
      setScreen('sl_5_4BrightSpot')
    }, 180)
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
        maxWidth: '720px',
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
        A POINT OF TENSION
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(24px, 3.4vw, 40px)',
        lineHeight: 1.15,
        letterSpacing: '-0.035em',
        margin: '0 0 16px 0',
        color: 'var(--text-main, #414242)',
        maxWidth: '640px',
      }}>
        You noted <span style={{ color: 'var(--dawn, #00ae9d)' }}>{tensionDomain}</span> is a top priority, but also where energy is running thin.
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
        maxWidth: '520px',
      }}>
        Does that reflection feel true to how things are right now?
      </p>

      {/* Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '380px',
      }}>
        {['Yes, definitely', 'Partly true', 'Not quite'].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(opt.toLowerCase().replace(' ', '_'))}
            style={{
              padding: '14px 22px',
              borderRadius: '16px',
              fontSize: '14px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              border: '1px solid var(--card-border, #e5e7eb)',
              background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
              color: 'var(--text-main, #414242)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
              e.currentTarget.style.color = 'var(--dawn, #00ae9d)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--card-border, #e5e7eb)'
              e.currentTarget.style.color = 'var(--text-main, #414242)'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
