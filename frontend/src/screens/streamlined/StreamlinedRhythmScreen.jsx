import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const PERIODS = ['Morning', 'Afternoon', 'Evening', 'Night']
const LEVELS = [
  { label: 'Low', val: 1 },
  { label: 'Medium', val: 2 },
  { label: 'High', val: 3 }
]

const SLEEP_ONSET_OPTIONS = [
  'Easily',
  'It takes time',
  'Difficult',
  'Very disrupted'
]

const STRESS_RESPONSES = [
  'I get activated and wired',
  'I go flat and exhausted',
  'A mix of both',
  'I shut down'
]

export default function StreamlinedRhythmScreen() {
  const { energyArcPattern, sleepOnset, stressResponseStyle, setProfileField, setScreen } = useLewisStore()
  // step: 0 for energy arc, 1 for sleep onset, 2 for stress response
  const [step, setStep] = useState(0)
  const [arcMap, setArcMap] = useState(
    energyArcPattern || [
      { k: 'Morning', v: 2 },
      { k: 'Afternoon', v: 2 },
      { k: 'Evening', v: 2 },
      { k: 'Night', v: 1 }
    ]
  )

  const handlePeriodChange = (period, val) => {
    const updated = arcMap.map((p) => (p.k === period ? { ...p, v: val } : p))
    setArcMap(updated)
    setProfileField('energyArcPattern', updated)
  }

  const handleSelectSleepOnset = (opt) => {
    setProfileField('sleepOnset', opt)
    setTimeout(() => {
      setStep(2)
    }, 180)
  }

  const handleSelectStressResponse = (opt) => {
    setProfileField('stressResponseStyle', opt)
    setTimeout(() => {
      setScreen('sl_8_3Recovery')
    }, 180)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 1) {
      setStep(0)
    } else {
      setScreen('sl_7_5Planner')
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
      <AnimatePresence mode="wait">
        {/* ============================================================ */}
        {/* STEP 0: ENERGY ARC ACROSS THE DAY                            */}
        {/* ============================================================ */}
        {step === 0 && (
          <motion.div
            key="energy-arc-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
              ACT 6 · HOW TO HELP YOU (1 OF 3)
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
              Your daily rhythm
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: '0 0 32px 0',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              How your energy shifts across an ordinary day.
            </p>

            {/* 4 Period Cards */}
            <div style={{
              width: '100%',
              maxWidth: '580px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '10px',
              marginBottom: '32px',
            }}>
              {PERIODS.map((period) => {
                const currentVal = arcMap.find((p) => p.k === period)?.v || 2
                return (
                  <div
                    key={period}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '16px 8px',
                      borderRadius: '18px',
                      background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                      border: '1px solid var(--card-border, #e5e7eb)',
                      boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                    }}
                  >
                    <span style={{
                      fontSize: '13.5px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      color: 'var(--text-main, #414242)',
                      marginBottom: '12px',
                    }}>
                      {period}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', padding: '0 4px', boxSizing: 'border-box' }}>
                      {LEVELS.map((lvl) => {
                        const isSelected = currentVal === lvl.val
                        return (
                          <button
                            key={lvl.val}
                            type="button"
                            onClick={() => handlePeriodChange(period, lvl.val)}
                            style={{
                              width: '100%',
                              padding: '8px 0',
                              borderRadius: '100px',
                              fontSize: '12px',
                              fontFamily: "'Nunito', sans-serif",
                              fontWeight: 600,
                              border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                              background: isSelected ? 'var(--dawn, #00ae9d)' : '#ffffff',
                              color: isSelected ? '#ffffff' : 'var(--text-main, #414242)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              textAlign: 'center',
                            }}
                          >
                            {lvl.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={() => {
                setProfileField('energyArcPattern', arcMap)
                setStep(1)
              }}
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
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STEP 1: SLEEP ONSET                                          */}
        {/* ============================================================ */}
        {step === 1 && (
          <motion.div
            key="sleep-onset-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
              ACT 6 · HOW TO HELP YOU (2 OF 3)
            </p>

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
              How easily do you usually fall asleep?
            </h1>

            <p style={{
              margin: '0 0 32px 0',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Thinking about your usual bedtime experience.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
              maxWidth: '460px',
              marginBottom: '24px',
            }}>
              {SLEEP_ONSET_OPTIONS.map((opt) => {
                const isSelected = sleepOnset === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectSleepOnset(opt)}
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
        {/* STEP 2: STRESS RESPONSE STYLE                                */}
        {/* ============================================================ */}
        {step === 2 && (
          <motion.div
            key="stress-response-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
              ACT 6 · HOW TO HELP YOU (3 OF 3)
            </p>

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
              When under acute stress, which pattern tends to take over?
            </h1>

            <p style={{
              margin: '0 0 32px 0',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Your default nervous system reaction to high pressure.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
              maxWidth: '460px',
              marginBottom: '24px',
            }}>
              {STRESS_RESPONSES.map((opt) => {
                const isSelected = stressResponseStyle === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectStressResponse(opt)}
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
