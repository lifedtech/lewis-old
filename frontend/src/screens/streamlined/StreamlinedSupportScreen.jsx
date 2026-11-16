import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const SUPPORT_STYLES = [
  'I prefer to work through things alone',
  'I like structure and clear steps',
  'I learn best through stories and ideas',
  "I need something gentle, I'm fragile right now",
  'I want to be challenged'
]

const CONTENT_FORMATS = [
  'Reading',
  'Watching short video',
  'Listening',
  'A mix'
]

export default function StreamlinedSupportScreen() {
  const { supportPreference, contentPreference, setProfileField, setScreen } = useLewisStore()
  const [stepIndex, setStepIndex] = useState(0)

  const handleSelectSupport = (opt) => {
    setProfileField('supportPreference', opt)
    setTimeout(() => setStepIndex(1), 180)
  }

  const handleSelectFormat = (opt) => {
    setProfileField('contentPreference', opt)
    setTimeout(() => setScreen('sl_7_2Prior'), 180)
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(0)
    } else {
      setScreen('sl_5_3DeepDives')
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
        {/* STEP 1: GUIDANCE STYLE */}
        {stepIndex === 0 && (
          <motion.div
            key="support-style-step"
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
              margin: '0 0 8px 0',
            }}>
              SUPPORT &amp; GUIDANCE · 1 OF 2
            </p>

            <p style={{
              margin: '0 0 24px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              What style of guidance fits where you are right now?
            </p>

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
              When it comes to support, what works best for you?
            </h1>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '460px',
              marginBottom: '20px',
            }}>
              {SUPPORT_STYLES.map((opt) => {
                const isSelected = supportPreference === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectSupport(opt)}
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
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: CONTENT FORMAT */}
        {stepIndex === 1 && (
          <motion.div
            key="content-format-step"
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
              margin: '0 0 8px 0',
            }}>
              SUPPORT &amp; GUIDANCE · 2 OF 2
            </p>

            <p style={{
              margin: '0 0 24px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              How you best absorb recommendations and tools.
            </p>

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
              How do you prefer taking in new ideas?
            </h1>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '440px',
              marginBottom: '20px',
            }}>
              {CONTENT_FORMATS.map((opt) => {
                const isSelected = contentPreference === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectFormat(opt)}
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
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
