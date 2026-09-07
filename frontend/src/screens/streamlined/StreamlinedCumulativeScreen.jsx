import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const CUMULATIVE_ITEMS = [
  { id: 1, text: "Feeling tired even after a full night's sleep" },
  { id: 2, text: 'Finding it hard to wind down or switch off' },
  { id: 3, text: 'Tension showing up in your body (jaw, shoulders, neck, or gut)' },
  { id: 4, text: 'Getting sick more easily, or taking longer to bounce back' },
  { id: 5, text: 'A sense of running on empty, even on quieter days' }
]

const CUMULATIVE_OPTIONS = [
  { label: 'Not at all', val: 0 },
  { label: 'Occasionally', val: 1 },
  { label: 'Often', val: 2 },
  { label: 'Almost always', val: 3 }
]

export default function StreamlinedCumulativeScreen() {
  const { cumulativeLoad5, setScaleAnswer, setScreen } = useLewisStore()
  const [stepIndex, setStepIndex] = useState(0)

  const currentItem = CUMULATIVE_ITEMS[stepIndex]
  const currentVal = cumulativeLoad5?.[currentItem.id]

  const handleSelect = (val) => {
    setScaleAnswer('cumulativeLoad5', currentItem.id, val)
    if (stepIndex < CUMULATIVE_ITEMS.length - 1) {
      setTimeout(() => setStepIndex((prev) => prev + 1), 180)
    } else {
      setTimeout(() => setScreen('sl_3_4Breathing'), 180)
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    } else {
      setScreen('sl_8_2StressPattern')
    }
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
        margin: '0 0 8px 0',
      }}>
        CUMULATIVE LOAD · {stepIndex + 1} OF {CUMULATIVE_ITEMS.length}
      </p>

      {/* Subtitle context */}
      <p style={{
        margin: '0 0 24px 0',
        fontSize: 'clamp(13px, 1.5vw, 15px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Over the past few months, how often have you noticed...
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Question Text */}
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(24px, 3.4vw, 40px)',
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            margin: '0 0 32px 0',
            color: 'var(--text-main, #414242)',
            maxWidth: '620px',
            textAlign: 'center',
          }}>
            "{currentItem.text}"
          </h1>

          {/* Vertical Stacked Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            maxWidth: '440px',
            marginBottom: '20px',
          }}>
            {CUMULATIVE_OPTIONS.map((opt) => {
              const isSelected = currentVal === opt.val
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleSelect(opt.val)}
                  className={`option-pill ${isSelected ? 'selected active' : ''}`}
                  aria-pressed={isSelected}
                  style={{
                    padding: '13px 20px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                    background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                    color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
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
                  {opt.label}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="nav-prev-btn btn-ghost"
        style={{
          background: 'transparent',
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          color: 'var(--text-mute, #9ca3af)',
          fontSize: '13px',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 600,
          cursor: 'pointer',
          padding: '8px 16px',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--dawn, #00ae9d)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mute, #9ca3af)')}
      >
        ← Previous
      </button>
    </motion.div>
  )
}
