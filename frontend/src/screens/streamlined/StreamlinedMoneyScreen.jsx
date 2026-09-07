import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const MONEY_STEPS = [
  {
    type: 'context',
    key: 'financialStress',
    eyebrow: 'MONEY & SECURITY · 1 OF 7',
    subtitle: 'How financial thoughts feel in your everyday life.',
    question: 'How does thinking about your finances feel right now?',
    options: [
      { label: 'Calm and in control', val: 'Calm and in control' },
      { label: 'Some pressure, but manageable', val: 'Some pressure, but manageable' },
      { label: "High anxiety, it's affecting my daily life", val: "High anxiety, it's affecting my daily life" },
      { label: "I've been avoiding thinking about it", val: "I've been avoiding thinking about it" },
      { label: 'Not relevant to me right now', val: 'Not relevant to me right now' }
    ]
  },
  {
    type: 'context',
    key: 'incomeRegularity',
    eyebrow: 'MONEY & SECURITY · 2 OF 7',
    subtitle: 'Looking across an ordinary year.',
    question: 'How steady is your income, month to month?',
    options: [
      { label: 'Very steady', val: 'Very steady' },
      { label: 'Mostly steady', val: 'Mostly steady' },
      { label: 'It varies a lot', val: 'It varies a lot' },
      { label: 'Irregular or seasonal', val: 'Irregular or seasonal' },
      { label: 'No personal income right now', val: 'No personal income right now' }
    ]
  },
  {
    type: 'scale',
    id: 1,
    eyebrow: 'FINANCIAL REFLECTION · 3 OF 7',
    subtitle: 'How well does this describe your situation?',
    question: 'Because of my money situation, I feel like I will never have the things I want in life.',
    options: [
      { label: 'Describes me completely', val: 0 },
      { label: 'Very well', val: 1 },
      { label: 'Somewhat', val: 2 },
      { label: 'Very little', val: 3 },
      { label: 'Not at all', val: 4 }
    ]
  },
  {
    type: 'scale',
    id: 2,
    eyebrow: 'FINANCIAL REFLECTION · 4 OF 7',
    subtitle: 'How well does this describe your situation?',
    question: 'I am just getting by financially.',
    options: [
      { label: 'Describes me completely', val: 0 },
      { label: 'Very well', val: 1 },
      { label: 'Somewhat', val: 2 },
      { label: 'Very little', val: 3 },
      { label: 'Not at all', val: 4 }
    ]
  },
  {
    type: 'scale',
    id: 3,
    eyebrow: 'FINANCIAL REFLECTION · 5 OF 7',
    subtitle: 'How well does this describe your situation?',
    question: 'I am concerned that the money I have or will save will not last.',
    options: [
      { label: 'Describes me completely', val: 0 },
      { label: 'Very well', val: 1 },
      { label: 'Somewhat', val: 2 },
      { label: 'Very little', val: 3 },
      { label: 'Not at all', val: 4 }
    ]
  },
  {
    type: 'scale',
    id: 4,
    eyebrow: 'FINANCIAL REFLECTION · 6 OF 7',
    subtitle: 'How often is this true for you?',
    question: 'I have money left over at the end of the month.',
    options: [
      { label: 'Always', val: 4 },
      { label: 'Often', val: 3 },
      { label: 'Sometimes', val: 2 },
      { label: 'Rarely', val: 1 },
      { label: 'Never', val: 0 }
    ]
  },
  {
    type: 'scale',
    id: 5,
    eyebrow: 'FINANCIAL REFLECTION · 7 OF 7',
    subtitle: 'How often is this true for you?',
    question: 'My finances control my life.',
    options: [
      { label: 'Always', val: 4 },
      { label: 'Often', val: 3 },
      { label: 'Sometimes', val: 2 },
      { label: 'Rarely', val: 1 },
      { label: 'Never', val: 0 }
    ]
  }
]

export default function StreamlinedMoneyScreen() {
  const { cfpb5, financialStress, incomeRegularity, setScaleAnswer, setProfileField, setScreen } = useLewisStore()
  const [stepIndex, setStepIndex] = useState(0)

  const currentStep = MONEY_STEPS[stepIndex]

  const getCurrentVal = () => {
    if (currentStep.type === 'context') {
      return currentStep.key === 'financialStress' ? financialStress : incomeRegularity
    }
    return cfpb5?.[currentStep.id]
  }

  const handleSelect = (val) => {
    if (currentStep.type === 'context') {
      setProfileField(currentStep.key, val)
    } else {
      setScaleAnswer('cfpb5', currentStep.id, val)
    }

    if (stepIndex < MONEY_STEPS.length - 1) {
      setTimeout(() => setStepIndex((prev) => prev + 1), 180)
    } else {
      setTimeout(() => setScreen('sl_5_2Ins'), 180)
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    } else {
      setScreen('sl_5_2Promis')
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
          key={stepIndex}
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
            maxWidth: '640px',
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
