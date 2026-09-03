import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const MOOD_ZONES = [
  'Heavy & low',
  'A bit unsettled',
  'Steady & calm',
  'Good & energised'
]

export default function StreamlinedArrivalScreen() {
  const { arrivalMood, arrivalWord: storeWord, setProfileField, setScreen } = useLewisStore()
  const [word, setWord] = useState(storeWord || '')
  const currentMoodIndex = typeof arrivalMood === 'number' ? arrivalMood : 2

  const handleNext = () => {
    const trimmed = word.trim()
    if (trimmed) {
      setProfileField('arrivalWord', trimmed)
    }
    setScreen('sl_1_5Who5')
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
        ACT 2 · HOW LIFE FEELS
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
        Arriving here
      </h1>

      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        How are you feeling in this exact moment?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', width: '100%', alignItems: 'center' }}>
        
        {/* Mood Selection Pills */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            color: 'var(--text-main, #414242)',
            marginBottom: '12px',
          }}>
            Your general mood right now:
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            maxWidth: '500px',
          }}>
            {MOOD_ZONES.map((label, idx) => {
              const isSelected = currentMoodIndex === idx
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setProfileField('arrivalMood', idx)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
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
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Word Input */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            color: 'var(--text-main, #414242)',
            marginBottom: '10px',
          }}>
            In a single word, how would you describe how you are doing today?
          </label>
          <input
            type="text"
            maxLength={25}
            value={word}
            onChange={(e) => {
              setWord(e.target.value)
              setProfileField('arrivalWord', e.target.value)
            }}
            placeholder="e.g., steady, exhausted, curious"
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '12px 20px',
              fontSize: '15px',
              fontFamily: "'Nunito', sans-serif",
              borderRadius: '16px',
              border: '1px solid var(--card-border, #e5e7eb)',
              background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
              color: 'var(--text-main, #414242)',
              outline: 'none',
              textAlign: 'center',
              boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--dawn, #00ae9d)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--card-border, #e5e7eb)')}
          />
        </div>

        {/* Continue Button */}
        <div style={{ marginTop: '14px' }}>
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

      </div>
    </motion.div>
  )
}
