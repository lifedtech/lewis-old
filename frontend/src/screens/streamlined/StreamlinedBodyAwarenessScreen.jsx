import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import ActTransitionCard from './ActTransitionCard.jsx'

const AWARENESS_OPTIONS = [
  'Very tuned in',
  'Somewhat',
  'Not very',
  'I rarely notice these signals'
]

export default function StreamlinedBodyAwarenessScreen() {
  const { bodyAwareness, setProfileField, setScreen } = useLewisStore()
  const [showAct3, setShowAct3] = useState(false)

  const handleSelect = (opt) => {
    setProfileField('bodyAwareness', opt)
    setTimeout(() => {
      setShowAct3(true)
    }, 180)
  }

  const handleAct3Dismiss = () => {
    setScreen('sl_1_4Body')
  }

  if (showAct3) {
    return (
      <ActTransitionCard
        actNumber={3}
        title="The measured core"
        subtitle="Nine areas of your life"
        onDismiss={handleAct3Dismiss}
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
        fontSize: 'clamp(26px, 3.6vw, 44px)',
        lineHeight: 1.15,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
        maxWidth: '580px',
      }}>
        How tuned in to your body do you feel right now?
      </h1>

      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Its tension, hunger, tiredness, comfort.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '460px',
      }}>
        {AWARENESS_OPTIONS.map((opt) => {
          const isSelected = bodyAwareness === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              style={{
                padding: '14px 22px',
                borderRadius: '16px',
                fontSize: '14px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--card-border, #e5e7eb)'
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
