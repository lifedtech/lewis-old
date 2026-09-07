import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const MEANING_STEPS = [
  {
    type: 'purpose',
    id: 1,
    eyebrow: 'MEANING & PURPOSE · 1 OF 5',
    subtitle: 'Thinking about the past 7 days, how true is this for you?',
    question: 'My life has meaning',
    options: [
      { label: 'Not at all', val: 0 },
      { label: 'A little', val: 1 },
      { label: 'Somewhat', val: 2 },
      { label: 'Quite a bit', val: 3 },
      { label: 'Very much', val: 4 }
    ]
  },
  {
    type: 'purpose',
    id: 2,
    eyebrow: 'MEANING & PURPOSE · 2 OF 5',
    subtitle: 'Thinking about the past 7 days, how true is this for you?',
    question: 'I have a sense of direction in my life',
    options: [
      { label: 'Not at all', val: 0 },
      { label: 'A little', val: 1 },
      { label: 'Somewhat', val: 2 },
      { label: 'Quite a bit', val: 3 },
      { label: 'Very much', val: 4 }
    ]
  },
  {
    type: 'purpose',
    id: 3,
    eyebrow: 'MEANING & PURPOSE · 3 OF 5',
    subtitle: 'Thinking about the past 7 days, how true is this for you?',
    question: 'My life has purpose',
    options: [
      { label: 'Not at all', val: 0 },
      { label: 'A little', val: 1 },
      { label: 'Somewhat', val: 2 },
      { label: 'Quite a bit', val: 3 },
      { label: 'Very much', val: 4 }
    ]
  },
  {
    type: 'purpose',
    id: 4,
    eyebrow: 'MEANING & PURPOSE · 4 OF 5',
    subtitle: 'Thinking about the past 7 days, how true is this for you?',
    question: 'The things I do in my life are worthwhile',
    options: [
      { label: 'Not at all', val: 0 },
      { label: 'A little', val: 1 },
      { label: 'Somewhat', val: 2 },
      { label: 'Quite a bit', val: 3 },
      { label: 'Very much', val: 4 }
    ]
  },
  {
    type: 'transcendent',
    id: 5,
    eyebrow: 'MEANING & PURPOSE · 5 OF 5',
    subtitle: 'Faith, nature, universe, lineage, or something beyond the everyday.',
    question: 'Do you feel connected to something larger than yourself?',
    options: [
      { label: 'Deeply connected', val: 'Deeply connected' },
      { label: 'Somewhat', val: 'Somewhat' },
      { label: 'A little', val: 'A little' },
      { label: 'Not at all', val: 'Not at all' },
      { label: 'This feels painful right now', val: 'This feels painful right now' }
    ]
  }
]

export default function StreamlinedMeaningScreen() {
  const { purpose, transcendentConnection, setScaleAnswer, setProfileField, setScreen } = useLewisStore()
  const [stepIndex, setStepIndex] = useState(0)

  const currentStep = MEANING_STEPS[stepIndex]

  const getCurrentVal = () => {
    if (currentStep.type === 'purpose') {
      return purpose?.[currentStep.id]
    }
    return transcendentConnection
  }

  const handleSelect = (val) => {
    if (currentStep.type === 'purpose') {
      setScaleAnswer('purpose', currentStep.id, val)
    } else {
      setProfileField('transcendentConnection', val)
    }

    if (stepIndex < MEANING_STEPS.length - 1) {
      setTimeout(() => setStepIndex((prev) => prev + 1), 180)
    } else {
      setTimeout(() => setScreen('sl_5_2Cfpb5'), 180)
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    } else {
      setScreen('sl_5_2Gse')
    }
  }

  const currentVal = getCurrentVal()

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
        {currentStep.eyebrow}
      </p>

      {/* Subtitle context */}
      <p style={{
        margin: '0 0 24px 0',
        fontSize: 'clamp(13px, 1.5vw, 15px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        {currentStep.subtitle}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
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
            "{currentStep.question}"
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
            {currentStep.options.map((opt) => {
              const isSelected = currentVal === opt.val
              return (
                <button
                  key={opt.label}
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
