import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const PSS_ITEMS = [
  { id: 1, text: 'Been upset because of something that happened unexpectedly?' },
  { id: 2, text: 'Felt that you were unable to control the important things in your life?' },
  { id: 3, text: 'Felt nervous and stressed?' },
  { id: 4, text: 'Felt confident about your ability to handle your personal problems?' },
  { id: 5, text: 'Felt that things were going your way?' },
  { id: 6, text: 'Found that you could not cope with all the things that you had to do?' },
  { id: 7, text: 'Been able to control irritations in your life?' },
  { id: 8, text: 'Felt that you were on top of things?' },
  { id: 9, text: 'Been angered because of things that happened that were outside of your control?' },
  { id: 10, text: 'Felt difficulties were piling up so high that you could not overcome them?' }
]

const PSS_OPTIONS = [
  { label: 'Never', val: 0 },
  { label: 'Almost never', val: 1 },
  { label: 'Sometimes', val: 2 },
  { label: 'Fairly often', val: 3 },
  { label: 'Very often', val: 4 }
]

export default function StreamlinedPss10Screen() {
  const { pss10, setScaleAnswer, setScreen } = useLewisStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentItem = PSS_ITEMS[currentIndex]
  const currentVal = pss10?.[currentItem.id]

  const handleSelect = (val) => {
    setScaleAnswer('pss10', currentItem.id, val)
    if (currentIndex < PSS_ITEMS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 180)
    } else {
      setTimeout(() => {
        setScreen('sl_5_2Ucla3')
      }, 180)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
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
        IN THE LAST MONTH · {currentIndex + 1} OF {PSS_ITEMS.length}
      </p>

      {/* Subtitle context */}
      <p style={{
        margin: '0 0 24px 0',
        fontSize: 'clamp(13px, 1.5vw, 15px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        In the last month, how often have you...
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
            {PSS_OPTIONS.map((opt) => {
              const isSelected = currentVal === opt.val
              return (
                <button
                  key={opt.val}
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

      {/* Previous item button */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handlePrev}
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
          ← Previous item
        </button>
      )}
    </motion.div>
  )
}
