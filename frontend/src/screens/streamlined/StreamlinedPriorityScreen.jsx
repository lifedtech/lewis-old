import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const DOMAIN_CARDS = [
  'Body & recovery',
  'Emotional calm',
  'Energy & drive',
  'Relationships',
  'Meaning & purpose',
  'Progress & agency',
  'Money & security',
  'Curiosity & learning',
  'Surroundings & belonging'
]

export default function StreamlinedPriorityScreen() {
  const { priorityTop3, setProfileField, setScreen } = useLewisStore()
  const [selected, setSelected] = useState(priorityTop3 || [])

  const handleToggle = (card) => {
    if (selected.includes(card)) {
      setSelected(selected.filter((c) => c !== card))
    } else {
      if (selected.length < 3) {
        setSelected([...selected, card])
      }
    }
  }

  const handleNext = () => {
    setProfileField('priorityTop3', selected)
    const store = useLewisStore.getState()
    const depletedList = store.domainSort?.depleted || []
    const hasTension = selected.some((c) => depletedList.includes(c))

    if (hasTension) {
      setScreen('sl_5_5PriorityTension')
    } else {
      setScreen('sl_5_4BrightSpot')
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
        CHOOSE UP TO THREE · {selected.length} / 3 SELECTED
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
        maxWidth: '680px',
      }}>
        Which three matter most to you right now?
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Not which are going well. Which you care about most.
      </p>

      {/* 9 Domain Pills Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        width: '100%',
        maxWidth: '660px',
        marginBottom: '32px',
      }}>
        {DOMAIN_CARDS.map((card) => {
          const isSelected = selected.includes(card)
          return (
            <button
              key={card}
              type="button"
              onClick={() => handleToggle(card)}
              style={{
                padding: '14px 18px',
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
              {card}
            </button>
          )
        })}
      </div>

      {/* Continue Button */}
      <div>
        <button
          type="button"
          onClick={handleNext}
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
      </div>
    </motion.div>
  )
}
