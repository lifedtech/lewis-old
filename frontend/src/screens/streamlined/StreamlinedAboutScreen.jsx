import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const AGE_BANDS = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+'
]

const SEX_OPTIONS = [
  'Female',
  'Male',
  'Another answer',
  'Prefer not to say'
]

export default function StreamlinedAboutScreen() {
  const { name: storeName, ageCategory, sexAtBirth, setProfileField, setScreen } = useLewisStore()
  const [name, setName] = useState(storeName || '')

  const handleNext = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setProfileField('name', trimmed)
    setScreen('sl_1_1Identity')
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
        fontSize: 'clamp(36px, 4.8vw, 56px)',
        lineHeight: 1.05,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
      }}>
        About You
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 32px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Let's set up your profile.
      </p>

      {/* Form Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', width: '100%', alignItems: 'center' }}>
        
        {/* Field A: Name */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            color: 'var(--text-main, #414242)',
            marginBottom: '10px',
          }}>
            What would you like to be called?
          </label>
          <input
            type="text"
            maxLength={40}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setProfileField('name', e.target.value)
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleNext() } }}
            placeholder="Your name"
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

        {/* Field B: Age Band */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            color: 'var(--text-main, #414242)',
            marginBottom: '12px',
          }}>
            Which age group are you in? <span style={{ color: 'var(--text-mute, #9ca3af)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            maxWidth: '440px',
          }}>
            {AGE_BANDS.map((band) => {
              const isSelected = ageCategory === band
              return (
                <button
                  key={band}
                  type="button"
                  onClick={() => setProfileField('ageCategory', band)}
                  className={`option-pill ${isSelected ? 'selected active' : ''}`}
                  aria-pressed={isSelected}
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
                  {band}
                </button>
              )
            })}
          </div>
        </div>

        {/* Field C: Sex Recorded at Birth */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            color: 'var(--text-main, #414242)',
            marginBottom: '12px',
          }}>
            What is your sex? <span style={{ color: 'var(--text-mute, #9ca3af)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            maxWidth: '440px',
          }}>
            {SEX_OPTIONS.map((opt) => {
              const isSelected = sexAtBirth === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setProfileField('sexAtBirth', opt)
                    setProfileField('gender', opt)
                  }}
                  className={`option-pill ${isSelected ? 'selected active' : ''}`}
                  aria-pressed={isSelected}
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
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            onClick={handleNext}
            disabled={!name.trim()}
            className="btn-primary"
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
              opacity: !name.trim() ? 0.5 : 1,
              cursor: !name.trim() ? 'not-allowed' : 'pointer',
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
