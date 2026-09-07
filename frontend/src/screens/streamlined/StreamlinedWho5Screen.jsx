import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const WHO5_ITEMS = [
  { id: 1, text: 'I have felt cheerful and in good spirits' },
  { id: 2, text: 'I have felt calm and relaxed' },
  { id: 3, text: 'I have felt active and vigorous' },
  { id: 4, text: 'I woke up feeling fresh and rested' },
  { id: 5, text: 'My daily life has been filled with things that interest me' }
]

const WHO5_OPTIONS = [
  { label: 'All of the time', val: 5 },
  { label: 'Most of the time', val: 4 },
  { label: 'More than half the time', val: 3 },
  { label: 'Less than half the time', val: 2 },
  { label: 'Some of the time', val: 1 },
  { label: 'At no time', val: 0 }
]

export default function StreamlinedWho5Screen() {
  const { who5, setScaleAnswer, setScreen } = useLewisStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentItem = WHO5_ITEMS[currentIndex]
  const currentVal = who5?.[currentItem.id]

  const handleSelect = (val) => {
    setScaleAnswer('who5', currentItem.id, val)
    if (currentIndex < WHO5_ITEMS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 150)
    } else {
      setScreen('sl_3_1Affect')
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
        maxWidth: '620px',
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
        OVER THE PAST TWO WEEKS · {currentIndex + 1} OF {WHO5_ITEMS.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(28px, 3.8vw, 44px)',
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            margin: '0 0 32px 0',
            color: 'var(--text-main, #414242)',
            maxWidth: '560px',
          }}>
            "{currentItem.text}"
          </h1>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            maxWidth: '420px',
          }}>
            {WHO5_OPTIONS.map((opt) => {
              const isSelected = currentVal === opt.val
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleSelect(opt.val)}
                  className={`option-pill ${isSelected ? 'selected active' : ''}`}
                  aria-pressed={isSelected}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                    background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                    color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center',
                    boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
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
