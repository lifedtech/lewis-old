import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import MobileContinueButton from '../components/MobileContinueButton.jsx'

export default function MobileStage1_0AboutScreen() {
  const { setScreen, setProfileField, ageCategory, gender, name: storeName } = useLewisStore()
  const [name, setName] = useState(storeName || '')

  const handleNext = () => {
    if (!name.trim()) return
    setProfileField('name', name.trim())
    setScreen('stage1_1Identity')
  }

  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
  const sexes = ['Female', 'Male', 'Intersex', 'Prefer not to say']

  return (
    <motion.div
      className="mobile-screen-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '12px 16px 24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header — Left Aligned */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
          <p className="mobile-eyebrow" style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '6px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: '#7a8683',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            SETUP PROFILE
          </p>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: '22px',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            margin: 0,
            color: '#414242',
          }}>
            About You
          </h1>
          <p className="mobile-subtitle" style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            color: '#5e6060',
            lineHeight: 1.45,
            margin: '2px 0 0 0',
          }}>
            Let's set up your profile details.
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          
          {/* Name Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
            }}>
              What would you like to be called?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setProfileField('name', e.target.value)
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleNext() } }}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '11px 14px',
                background: '#f8fcfa',
                border: '1.5px solid rgba(0, 174, 157, 0.25)',
                borderRadius: '12px',
                outline: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '14px',
                color: '#414242',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00ae9d')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 174, 157, 0.25)')}
            />
          </div>

          {/* Age Group Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Which age group are you in? <span style={{ fontWeight: 400, color: '#85918e', fontSize: '11.5px' }}>(Optional)</span>
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              width: '100%',
            }}>
              {ageGroups.map((group) => {
                const active = ageCategory === group
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setProfileField('ageCategory', group)}
                    style={{
                      minHeight: '38px',
                      padding: '8px 4px',
                      borderRadius: '12px',
                      border: active ? '1.5px solid #00ae9d' : '1.2px solid rgba(0, 174, 157, 0.18)',
                      background: active ? '#e6f7f2' : '#ffffff',
                      color: active ? '#1b4d43' : '#414242',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '13px',
                      fontWeight: active ? 700 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {group}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sex Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
            }}>
              What is your sex? <span style={{ fontWeight: 400, color: '#85918e', fontSize: '11.5px' }}>(Optional)</span>
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              width: '100%',
            }}>
              {sexes.map((item) => {
                const active = gender === item
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setProfileField('gender', item)}
                    style={{
                      minHeight: '38px',
                      padding: '8px 8px',
                      borderRadius: '12px',
                      border: active ? '1.5px solid #00ae9d' : '1.2px solid rgba(0, 174, 157, 0.18)',
                      background: active ? '#e6f7f2' : '#ffffff',
                      color: active ? '#1b4d43' : '#414242',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '12.5px',
                      fontWeight: active ? 700 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Continue Button */}
        <MobileContinueButton
          onClick={handleNext}
          disabled={!name.trim()}
          label="Continue"
          style={{ padding: '4px 0 0 0' }}
        />
    </motion.div>
  )
}
