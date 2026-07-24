import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Bright Spot Animated Glowing Sunburst Vector Illustration ── */
const BrightSpotIllustration = () => (
  <motion.svg
    viewBox="0 0 200 200"
    fill="none"
    style={{ width: '100%', maxWidth: '180px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="brightOrbGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#80E8DD" />
        <stop offset="45%" stopColor="#36D1DC" />
        <stop offset="85%" stopColor="#00AE9D" />
        <stop offset="100%" stopColor="#00856A" />
      </radialGradient>
      <radialGradient id="brightGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Pulsing Background Aura */}
    <motion.circle
      cx="100" cy="100" r="75" fill="url(#brightGlow)"
      animate={{ scale: [0.9, 1.18, 0.9], opacity: [0.3, 0.75, 0.3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 100px' }}
    />

    {/* Rotating Sunburst Ray Lines */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '100px 100px' }}
    >
      {/* 8 Sunburst Rays */}
      <line x1="100" y1="32" x2="100" y2="48" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="137" y1="63" x2="148" y2="52" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="152" y1="100" x2="168" y2="100" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="137" y1="137" x2="148" y2="148" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="100" y1="152" x2="100" y2="168" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="63" y1="137" x2="52" y2="148" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="48" y1="100" x2="32" y2="100" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="63" y1="63" x2="52" y2="52" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
    </motion.g>

    {/* Gently Pulsing 3D Mint/Teal Glowing Sphere */}
    <motion.g
      animate={{ scale: [0.95, 1.06, 0.95] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 100px' }}
    >
      <circle cx="100" cy="100" r="42" fill="url(#brightOrbGrad)" />
      <circle cx="86" cy="84" r="7.5" fill="#FFFFFF" opacity="0.9" />
    </motion.g>
  </motion.svg>
)

export default function Stage5_4BrightSpotScreen() {
  const { setScreen, setProfileField, brightSpotCheck } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_5PriorityTension')
  }

  const handleChange = (e) => {
    setProfileField('brightSpotCheck', e.target.value)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 56px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: '0 clamp(16px, 3vw, 40px)',
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Title + Subtitle + Animated Glowing Sunburst Vector Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'center' }}>
          <div>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(34px, 4.4vw, 58px)',
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              margin: 0,
              color: '#16302b',
              textWrap: 'balance',
            }}>
              Your Bright<br />Spot
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '360px',
            }}>
              What is currently your greatest source of resilience, calm, or strength? How does it protect you during difficult weeks?
            </p>
          </div>
          <BrightSpotIllustration />
        </div>

        {/* RIGHT — Full-Height Textarea + Action Button (No Dead Space) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#00ae9d',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Qualitative Reflection
          </p>

          <textarea
            value={brightSpotCheck || ''}
            onChange={handleChange}
            placeholder="Write your thoughts here..."
            style={{
              width: '100%',
              flex: 1,
              minHeight: '200px',
              padding: '18px',
              borderRadius: '20px',
              border: '1.5px solid rgba(0, 174, 157, 0.2)',
              background: '#f7faf8',
              color: '#16302b',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00ae9d'
              e.target.style.background = '#ffffff'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 174, 157, 0.2)'
              e.target.style.background = '#f7faf8'
            }}
          />

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '12px 38px' }}
            >
              {brightSpotCheck && brightSpotCheck.trim() ? 'Continue' : 'Skip'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
