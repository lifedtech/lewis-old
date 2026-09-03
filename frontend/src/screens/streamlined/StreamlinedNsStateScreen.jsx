import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const STATES = [
  {
    id: 'Grounded',
    title: 'Grounded',
    desc: 'Present, connected, and open to what is around you.',
    dotColor: '#00ae9d'
  },
  {
    id: 'Activated',
    title: 'Activated',
    desc: 'Wired, alert, on edge. Mind racing, body tense.',
    dotColor: '#f97316'
  },
  {
    id: 'Collapsed',
    title: 'Collapsed',
    desc: 'Flat, withdrawn, checked out. Moving feels like pulling weights.',
    dotColor: '#6366f1'
  }
]

export default function StreamlinedNsStateScreen() {
  const { nsPortrait, setProfileField, setScreen } = useLewisStore()

  const handleSelect = (id) => {
    setProfileField('nsPortrait', id)
    setProfileField('nervousSystemState', id)
    setTimeout(() => {
      setScreen('sl_3_6BodyAwareness')
    }, 180)
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
        maxWidth: '840px',
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
        CHOOSE ONE
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(22px, 3.2vw, 38px)',
        lineHeight: 1.15,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
        width: '100%',
        maxWidth: '820px',
        textAlign: 'center',
        whiteSpace: 'normal',
      }}>
        Which feels closest to your inner state right now?
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 36px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        There is no better card here. Select one.
      </p>

      {/* 3 State Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: '780px',
      }}>
        {STATES.map((card) => {
          const isSelected = nsPortrait === card.id
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleSelect(card.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '22px 20px',
                borderRadius: '20px',
                fontFamily: "'Nunito', sans-serif",
                border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--card-border, #e5e7eb)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: card.dotColor,
                  display: 'inline-block'
                }} />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                  margin: 0,
                }}>
                  {card.title}
                </h3>
              </div>
              <p style={{
                fontSize: '13.5px',
                color: 'var(--text-sub, #657370)',
                lineHeight: 1.45,
                margin: 0,
              }}>
                {card.desc}
              </p>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
