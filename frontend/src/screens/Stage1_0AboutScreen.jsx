import {  useState  } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_0AboutScreen() {
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
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '620px',
        margin: '0 auto',
        height: '100%',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <p style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#00ae9d',
          textTransform: 'uppercase',
          margin: '0 0 10px 0',
        }}>
          CHOOSE ONE
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px, 4.8vw, 64px)',
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          margin: '0 0 8px 0',
          color: '#414242',
        }}>
          About You
        </h1>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 'clamp(13px, 1.6vw, 16px)',
          color: '#414242',
          fontFamily: "'Nunito', sans-serif",
        }}>
          Let's set up your profile.
        </p>

        {/* Form Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', width: '100%', alignItems: 'center' }}>
          
          {/* Name Field */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              display: 'block',
              textAlign: 'center',
              color: '#414242',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '12px',
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
                maxWidth: '440px',
                textAlign: 'center',
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid #c2ceca',
                outline: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: '#414242',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#00ae9d'}
              onBlur={(e) => e.target.style.borderColor = '#c2ceca'}
            />
          </div>

          {/* Age Group Field */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              display: 'block',
              textAlign: 'center',
              color: '#414242',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '14px',
            }}>
              Which age group are you in? (Optional)
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              maxWidth: '520px',
            }}>
              {ageGroups.map(group => {
                const active = ageCategory === group
                return (
                  <button
                    key={group}
                    onClick={() => setProfileField('ageCategory', group)}
                    style={{
                      padding: '8px 22px',
                      borderRadius: '999px',
                      border: active ? '1.5px solid #00ae9d' : '1px solid #c2ceca',
                      background: active ? '#e4f4ee' : 'rgba(255,255,255,0.6)',
                      color: active ? '#414242' : '#3a3a3a',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '14px',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: active ? '0 2px 8px rgba(0,174,157,0.15)' : 'none',
                    }}
                  >
                    {group}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sex Field */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              display: 'block',
              textAlign: 'center',
              color: '#414242',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '14px',
            }}>
              What is your sex? (Optional)
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              maxWidth: '560px',
            }}>
              {sexes.map(sex => {
                const active = gender === sex
                return (
                  <button
                    key={sex}
                    onClick={() => setProfileField('gender', sex)}
                    style={{
                      padding: '8px 22px',
                      borderRadius: '999px',
                      border: active ? '1.5px solid #00ae9d' : '1px solid #c2ceca',
                      background: active ? '#e4f4ee' : 'rgba(255,255,255,0.6)',
                      color: active ? '#414242' : '#3a3a3a',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '14px',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: active ? '0 2px 8px rgba(0,174,157,0.15)' : 'none',
                    }}
                  >
                    {sex}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '10px' }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!name.trim()}
              style={{
                padding: '10px 48px',
                borderRadius: '12px',
                opacity: !name.trim() ? 0.5 : 1,
                cursor: !name.trim() ? 'not-allowed' : 'pointer',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '13.5px',
                fontWeight: 700,
              }}
            >
              Continue
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

