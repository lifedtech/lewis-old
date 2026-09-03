import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import ActTransitionCard from './ActTransitionCard.jsx'

const PRESSURES = [
  'Work, career or workload',
  'Money, expenses or debt',
  'A relationship or family situation',
  'Caregiving responsibilities',
  'A health situation, mine or someone close to me',
  'Studies or exams',
  'A major life transition or move',
  'A feeling of being stuck or lost',
  'Nothing major right now'
]

export default function StreamlinedPressuresScreen() {
  const { activePressures, setProfileField, setScreen } = useLewisStore()
  const [showAct2, setShowAct2] = useState(false)

  const handleToggle = (pressure) => {
    let current = [...(activePressures || [])]
    if (pressure === 'Nothing major right now') {
      current = current.includes(pressure) ? [] : [pressure]
    } else {
      current = current.filter((p) => p !== 'Nothing major right now')
      if (current.includes(pressure)) {
        current = current.filter((p) => p !== pressure)
      } else {
        current.push(pressure)
      }
    }
    setProfileField('activePressures', current)
  }

  const handleNext = () => {
    setShowAct2(true)
  }

  const handleAct2Dismiss = () => {
    setScreen('sl_1_8Arrival')
  }

  if (showAct2) {
    return (
      <ActTransitionCard
        actNumber={2}
        title="How life feels"
        subtitle="Moving inward"
        onDismiss={handleAct2Dismiss}
      />
    )
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
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 0 10px 0',
      }}>
        CHOOSE MULTIPLE
      </p>

      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(32px, 4.2vw, 52px)',
        lineHeight: 1.05,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
      }}>
        Active pressures
      </h1>

      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Is anything taking up significant energy right now?
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '620px',
      }}>
        {PRESSURES.map((p) => {
          const isSelected = (activePressures || []).includes(p)
          return (
            <button
              key={p}
              type="button"
              onClick={() => handleToggle(p)}
              style={{
                padding: '10px 20px',
                borderRadius: '100px',
                fontSize: '13px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
              }}
            >
              {p}
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: '36px' }}>
        <button
          type="button"
          onClick={handleNext}
          style={{
            padding: '12px 36px',
            borderRadius: '100px',
            fontSize: '14px',
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
