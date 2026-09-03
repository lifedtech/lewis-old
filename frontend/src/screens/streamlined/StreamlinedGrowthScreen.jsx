import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import ActTransitionCard from './ActTransitionCard.jsx'

const GROWTH_STEPS = [
  {
    type: 'scale',
    id: 1,
    eyebrow: 'CURIOSITY & GROWTH · 1 OF 4',
    subtitle: 'Thinking about recent weeks, how true is this for you?',
    question: 'Lately I have had the chance to learn or get better at something.',
    options: [
      { label: 'Strongly disagree', val: 1 },
      { label: 'Disagree', val: 2 },
      { label: 'Neither', val: 3 },
      { label: 'Agree', val: 4 },
      { label: 'Strongly agree', val: 5 }
    ]
  },
  {
    type: 'scale',
    id: 2,
    eyebrow: 'CURIOSITY & GROWTH · 2 OF 4',
    subtitle: 'Thinking about recent weeks, how true is this for you?',
    question: 'My days give me something that stretches me in a good way.',
    options: [
      { label: 'Strongly disagree', val: 1 },
      { label: 'Disagree', val: 2 },
      { label: 'Neither', val: 3 },
      { label: 'Agree', val: 4 },
      { label: 'Strongly agree', val: 5 }
    ]
  },
  {
    type: 'scale',
    id: 3,
    eyebrow: 'CURIOSITY & GROWTH · 3 OF 4',
    subtitle: 'Thinking about recent weeks, how true is this for you?',
    question: 'I have the space and appetite to be curious right now.',
    options: [
      { label: 'Strongly disagree', val: 1 },
      { label: 'Disagree', val: 2 },
      { label: 'Neither', val: 3 },
      { label: 'Agree', val: 4 },
      { label: 'Strongly agree', val: 5 }
    ]
  },
  {
    type: 'recency',
    id: 4,
    eyebrow: 'CURIOSITY & GROWTH · 4 OF 4',
    subtitle: 'Deep focus, craft, problem-solving, or flow.',
    question: 'When was the last time you were completely absorbed in learning or making something?',
    options: [
      { label: 'This week', val: 'This week' },
      { label: 'In the past month', val: 'In the past month' },
      { label: 'A few months ago', val: 'A few months ago' },
      { label: "I honestly can't remember", val: "I honestly can't remember" },
      { label: "I don't have space for that right now", val: "I don't have space for that right now" }
    ]
  }
]

export default function StreamlinedGrowthScreen() {
  const { growth, growthRecency, setScaleAnswer, setProfileField, setScreen } = useLewisStore()
  const [stepIndex, setStepIndex] = useState(0)
  const [showAct4, setShowAct4] = useState(false)

  const currentStep = GROWTH_STEPS[stepIndex]

  const getCurrentVal = () => {
    if (currentStep.type === 'scale') {
      return growth?.[currentStep.id]
    }
    return growthRecency
  }

  const handleSelect = (val) => {
    if (currentStep.type === 'scale') {
      setScaleAnswer('growth', currentStep.id, val)
    } else {
      setProfileField('growthRecency', val)
    }

    if (stepIndex < GROWTH_STEPS.length - 1) {
      setTimeout(() => setStepIndex((prev) => prev + 1), 180)
    } else {
      setTimeout(() => setShowAct4(true), 180)
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    } else {
      setScreen('sl_5_2Ins')
    }
  }

  const handleAct4Dismiss = () => {
    setScreen('sl_5_1Landscape')
  }

  if (showAct4) {
    return (
      <ActTransitionCard
        actNumber={4}
        title="The shape of your life"
        subtitle="Putting the pieces together"
        onDismiss={handleAct4Dismiss}
      />
    )
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
        style={{
          background: 'transparent',
          border: 'none',
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
