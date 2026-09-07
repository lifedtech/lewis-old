import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const RELATIONAL_CONTEXTS = [
  'Genuinely connected, I feel seen and supported',
  'I have people around me, but feel unseen',
  "Quite isolated, more alone than I'd like",
  'My relationships are a source of tension',
  'My life is closely woven with family, mostly a source of support',
  'My life is closely woven with family, mostly a source of pressure',
  'My connections are growing',
  "It's complicated"
]

const UCLA_ITEMS = [
  { id: 1, text: 'That you lack companionship?' },
  { id: 2, text: 'Left out?' },
  { id: 3, text: 'Isolated from others?' }
]

const UCLA_OPTIONS = [
  { label: 'Hardly ever', val: 1 },
  { label: 'Some of the time', val: 2 },
  { label: 'Often', val: 3 }
]

export default function StreamlinedRelationalScreen() {
  const { relationalContext, ucla3, setProfileField, setScaleAnswer, setScreen } = useLewisStore()
  
  // stage: 'context' | 'scale'
  const [stage, setStage] = useState(relationalContext ? 'scale' : 'context')
  const [uclaIndex, setUclaIndex] = useState(0)

  // Handle selecting the social world context
  const handleSelectContext = (ctx) => {
    setProfileField('relationalContext', ctx)
    setTimeout(() => {
      setStage('scale')
      setUclaIndex(0)
    }, 180)
  }

  // Handle UCLA item selection
  const handleSelectScale = (val) => {
    const currentItem = UCLA_ITEMS[uclaIndex]
    setScaleAnswer('ucla3', currentItem.id, val)
    if (uclaIndex < UCLA_ITEMS.length - 1) {
      setTimeout(() => setUclaIndex((prev) => prev + 1), 180)
    } else {
      setTimeout(() => setScreen('sl_5_2Gse'), 180)
    }
  }

  const handleBack = () => {
    if (stage === 'scale') {
      if (uclaIndex > 0) {
        setUclaIndex((prev) => prev - 1)
      } else {
        setStage('context')
      }
    } else {
      setScreen('sl_5_2Pss10')
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
        maxWidth: '740px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {/* ============================================================ */}
        {/* QUESTION 1: SOCIAL WORLD CONTEXT                             */}
        {/* ============================================================ */}
        {stage === 'context' && (
          <motion.div
            key="relational-context"
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
              CHOOSE ONE
            </p>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 3.6vw, 44px)',
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              margin: '0 0 8px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '680px',
            }}>
              How does your social world feel right now?
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: '0 0 32px 0',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Select the description closest to your current experience.
            </p>

            {/* 8 Context Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              maxWidth: '640px',
              marginBottom: '28px',
            }}>
              {RELATIONAL_CONTEXTS.map((ctx) => {
                const isSelected = relationalContext === ctx
                return (
                  <button
                    key={ctx}
                    type="button"
                    onClick={() => handleSelectContext(ctx)}
                    className={`option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '100px',
                      fontSize: '13.5px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 600,
                      border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                      background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                      color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = 'var(--card-border, #e5e7eb)'
                    }}
                  >
                    {ctx}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* QUESTION 2: UCLA-3 STEPPED QUESTIONS                         */}
        {/* ============================================================ */}
        {stage === 'scale' && (
          <motion.div
            key={`ucla-item-${uclaIndex}`}
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
              margin: '0 0 8px 0',
            }}>
              RELATIONSHIPS &amp; CONNECTION · {uclaIndex + 1} OF {UCLA_ITEMS.length}
            </p>

            {/* Subtitle context */}
            <p style={{
              margin: '0 0 24px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              How often do you feel...
            </p>

            {/* Question Text */}
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 3.6vw, 42px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: '0 0 32px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '620px',
              textAlign: 'center',
            }}>
              "{UCLA_ITEMS[uclaIndex].text}"
            </h1>

            {/* 3 Large Option Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '440px',
              marginBottom: '24px',
            }}>
              {UCLA_OPTIONS.map((opt) => {
                const currentVal = ucla3?.[UCLA_ITEMS[uclaIndex].id]
                const isSelected = currentVal === opt.val
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleSelectScale(opt.val)}
                    className={`option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '16px',
                      fontSize: '14.5px',
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
        )}
      </AnimatePresence>
    </motion.div>
  )
}
