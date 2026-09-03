import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const ACTIVITY_OPTIONS = [
  'Very active, daily movement',
  'Moderately active, a few times a week',
  'Mostly sedentary, desk or screen most of the day',
  'My movement has dropped recently'
]

const SLEEP_OPTIONS = [
  'Consistently good',
  'Variable, some good and some bad',
  'Generally poor, difficulty falling or staying asleep',
  "I haven't been tracking it"
]

export default function StreamlinedBodyScreen() {
  const { bodyMovement, sleepQuality, setProfileField, setScreen } = useLewisStore()
  // step: 0 for activity, 1 for sleep
  const [step, setStep] = useState(bodyMovement && !sleepQuality ? 1 : 0)

  const handleSelectMovement = (opt) => {
    setProfileField('bodyMovement', opt)
    setTimeout(() => {
      setStep(1)
    }, 180)
  }

  const handleSelectSleep = (opt) => {
    setProfileField('sleepQuality', opt)
    setTimeout(() => {
      setScreen('sl_5_2Pss10')
    }, 180)
  }

  const handleBack = () => {
    if (step === 1) {
      setStep(0)
    } else {
      setScreen('sl_3_6BodyAwareness')
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
        maxWidth: '680px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {/* ============================================================ */}
        {/* QUESTION 1: BODY & MOVEMENT                                  */}
        {/* ============================================================ */}
        {step === 0 && (
          <motion.div
            key="activity-question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
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
              ACT 3 · THE MEASURED CORE
            </p>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 3.6vw, 44px)',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              margin: '0 0 8px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '620px',
            }}>
              How active has your body been lately?
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: '0 0 32px 0',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Answer for the last two weeks, not for your best week.
            </p>

            {/* Options */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
              maxWidth: '460px',
            }}>
              {ACTIVITY_OPTIONS.map((opt) => {
                const isSelected = bodyMovement === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectMovement(opt)}
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
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* QUESTION 2: SLEEP QUALITY                                    */}
        {/* ============================================================ */}
        {step === 1 && (
          <motion.div
            key="sleep-question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
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
              ACT 3 · THE MEASURED CORE
            </p>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 3.6vw, 44px)',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              margin: '0 0 8px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '620px',
            }}>
              How has your sleep quality been?
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: '0 0 32px 0',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Thinking about your rest over recent weeks.
            </p>

            {/* Options */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
              maxWidth: '460px',
              marginBottom: '24px',
            }}>
              {SLEEP_OPTIONS.map((opt) => {
                const isSelected = sleepQuality === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectSleep(opt)}
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
                    {opt}
                  </button>
                )
              })}
            </div>

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
        )}
      </AnimatePresence>
    </motion.div>
  )
}
