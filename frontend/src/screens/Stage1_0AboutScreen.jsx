import {  useState  } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_0AboutScreen() {
  const { setScreen, setProfileField, ageCategory, gender, name: storeName, journeySessionId, getJourneyDurationSeconds } = useLewisStore()
  const [name, setName] = useState(storeName || '')

  const handleNext = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setProfileField('name', trimmed)

    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const durationSec = getJourneyDurationSeconds ? getJourneyDurationSeconds() : 0
    fetch(`${API_BASE}/journey/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: journeySessionId,
        user_name: trimmed,
        age_category: ageCategory || null,
        gender: gender || null,
        current_stage: 1,
        current_screen: 'stage1_0About',
        progress_percent: 5.0,
        duration_seconds: durationSec,
      }),
    }).catch(() => {})

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
          fontSize: 'clamp(36px, 4.8vw, 64px)',
          lineHeight: 1.02,
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
          
          {/* Name Field */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              display: 'block',
              textAlign: 'center',
              color: 'var(--text-main, #414242)',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '12px',
              fontWeight: 600,
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
                maxWidth: '420px',
                textAlign: 'center',
                padding: '13px 20px',
                background: 'var(--raised, #ffffff)',
                border: '1.5px solid var(--border-strong, #dcdcdc)',
                borderRadius: '14px',
                outline: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                fontWeight: 600,
                color: 'var(--text-main, #414242)',
                boxShadow: 'var(--shadow-soft, 0 2px 8px rgba(0, 0, 0, 0.03))',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--dawn, #00ae9d)'
                e.target.style.boxShadow = '0 0 0 3px var(--teal-tint, rgba(0, 174, 157, 0.15))'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-strong, #dcdcdc)'
                e.target.style.boxShadow = 'var(--shadow-soft, 0 2px 8px rgba(0, 0, 0, 0.03))'
              }}
            />
          </div>

          {/* Age Group Field */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              display: 'block',
              textAlign: 'center',
              color: 'var(--text-main, #414242)',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '14px',
              fontWeight: 600,
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
                      border: active ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--border-color, #c2ceca)',
                      background: active ? 'var(--teal-tint, #e4f4ee)' : 'var(--raised, rgba(255,255,255,0.6))',
                      color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #3a3a3a)',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '14px',
                      fontWeight: active ? 700 : 600,
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
              color: 'var(--text-main, #414242)',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '14px',
              fontWeight: 600,
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
                      border: active ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--border-color, #c2ceca)',
                      background: active ? 'var(--teal-tint, #e4f4ee)' : 'var(--raised, rgba(255,255,255,0.6))',
                      color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #3a3a3a)',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '14px',
                      fontWeight: active ? 700 : 600,
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

