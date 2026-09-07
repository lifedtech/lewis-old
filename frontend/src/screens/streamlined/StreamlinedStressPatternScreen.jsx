import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const CLUSTERS = [
  {
    id: 'The Surge',
    title: 'The Surge',
    subtitle: 'Wired & Alert',
    desc: 'Racing thoughts, jaw or neck tension, hard to switch off, wired but exhausted.'
  },
  {
    id: 'The Flatline',
    title: 'The Flatline',
    subtitle: 'Depleted & Flat',
    desc: 'Persistent fatigue, low motivation, flat affect, long recovery times.'
  },
  {
    id: 'The Fog',
    title: 'The Fog',
    subtitle: 'Scattered & Foggy',
    desc: 'Brain fog, midday energy crashes, difficulty concentrating, feeling disconnected.'
  },
  {
    id: 'The Cycle',
    title: 'The Cycle',
    subtitle: 'Rhythm-Linked',
    desc: 'Mood and energy tied closely to monthly hormonal rhythms and cycle shifts.'
  }
]

export default function StreamlinedStressPatternScreen() {
  const { stressCluster, setProfileField, setScreen } = useLewisStore()

  const handleSelect = (clusterId) => {
    setProfileField('stressCluster', clusterId)
    setTimeout(() => {
      setScreen('sl_8_4Cumulative')
    }, 180)
  }

  const handleBack = () => {
    setScreen('sl_8_3Recovery')
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
        CHOOSE ONE
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
        How stress shows up
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Select the pattern that feels closest to what happens in your body.
      </p>

      {/* 2x2 Grid of Stress Pattern Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: '680px',
        marginBottom: '28px',
      }}>
        {CLUSTERS.map((item) => {
          const isSelected = stressCluster === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`choice-card ${isSelected ? 'selected active' : ''}`}
              aria-pressed={isSelected}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '22px 24px',
                borderRadius: '20px',
                border: isSelected ? '2px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.75))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected
                  ? '0 6px 20px rgba(0, 174, 157, 0.18)'
                  : 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                transform: isSelected ? 'scale(1.02)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--card-border, #e5e7eb)'
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >
              {/* Header row: Title + Subtitle Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '10px',
                gap: '8px',
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  fontFamily: "'Manrope', sans-serif",
                  color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                }}>
                  {item.title}
                </h3>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #657370)',
                  background: isSelected ? 'rgba(0, 174, 157, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                  padding: '3px 9px',
                  borderRadius: '100px',
                  whiteSpace: 'nowrap',
                }}>
                  {item.subtitle}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                fontFamily: "'Nunito', sans-serif",
                color: 'var(--text-sub, #657370)',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {item.desc}
              </p>
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
  )
}
