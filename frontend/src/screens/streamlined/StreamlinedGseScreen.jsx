import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const GSE_ITEMS = [
  'I can always manage to solve difficult problems if I try hard enough.',
  'If someone opposes me, I can find the means and ways to get what I want.',
  'It is easy for me to stick to my aims and accomplish my goals.',
  'I am confident that I could deal efficiently with unexpected events.',
  'Thanks to my resourcefulness, I know how to handle unforeseen situations.',
  'I can remain calm when facing difficulties because I can rely on my coping abilities.'
]

const GSE_OPTIONS = [
  { label: 'Not at all true', val: 1 },
  { label: 'Hardly true', val: 2 },
  { label: 'Moderately true', val: 3 },
  { label: 'Exactly true', val: 4 }
]

export default function StreamlinedGseScreen() {
  const { gse6, setScaleAnswer, setScreen } = useLewisStore()
  const [itemIndex, setItemIndex] = useState(0)

  const currentVal = gse6?.[itemIndex + 1]

  const handleSelect = (val) => {
    setScaleAnswer('gse6', itemIndex + 1, val)
    if (itemIndex < GSE_ITEMS.length - 1) {
      setTimeout(() => setItemIndex((prev) => prev + 1), 180)
    } else {
      setTimeout(() => setScreen('sl_5_2Promis'), 180)
    }
  }

  const handleBack = () => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1)
    } else {
      setScreen('sl_5_2Ucla3')
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
        PROGRESS & AGENCY · {itemIndex + 1} OF {GSE_ITEMS.length}
      </p>

      {/* Subtitle context */}
      <p style={{
        margin: '0 0 24px 0',
        fontSize: 'clamp(13px, 1.5vw, 15px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        How true is each of these for you?
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={itemIndex}
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
            "{GSE_ITEMS[itemIndex]}"
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
            {GSE_OPTIONS.map((opt) => {
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
    </motion.div>
  )
}
