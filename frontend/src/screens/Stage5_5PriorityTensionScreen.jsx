import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Seesaw Priority Tension Animated Vector Illustration ── */
const SeesawTensionIllustration = () => (
  <motion.svg
    viewBox="0 0 200 180"
    fill="none"
    style={{ width: '100%', maxWidth: '160px', display: 'block', margin: '0' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="seesawGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="100" cy="110" r="70" fill="url(#seesawGlow)" />

    {/* Ground Base Line */}
    <line x1="40" y1="145" x2="160" y2="145" stroke="#D1E3DF" strokeWidth="2.5" strokeLinecap="round" />

    {/* Dashed Balance Center Axis Line */}
    <line x1="100" y1="105" x2="100" y2="75" stroke="#80E8DD" strokeWidth="2" strokeDasharray="4 4" />

    {/* Fulcrum Triangle Stand */}
    <path
      d="M 86,145 L 114,145 L 100,105 Z"
      fill="#E6F7F5"
      stroke="#00856A"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />

    {/* Animated Tilting Seesaw Beam & Weight Spheres */}
    <motion.g
      animate={{ rotate: [-14, 12, -14] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 105px' }}
    >
      {/* Seesaw Lever Beam */}
      <line x1="38" y1="105" x2="162" y2="105" stroke="#00856A" strokeWidth="4.5" strokeLinecap="round" />

      {/* Left Heavy Teal Sphere (Priority) */}
      <circle cx="36" cy="105" r="18" fill="#00AE9D" stroke="#FFF" strokeWidth="1.8" />

      {/* Right Smaller Gold Sphere (Energy) */}
      <circle cx="164" cy="105" r="12" fill="#F59E0B" stroke="#FFF" strokeWidth="1.8" />
    </motion.g>
  </motion.svg>
)

export default function Stage5_5PriorityTensionScreen() {
  const { setScreen, setProfileField, priorityTensionCheck } = useLewisStore()

  const handleNext = () => {
    setScreen('stage6Sharing')
  }

  const handleChange = (e) => {
    setProfileField('priorityTensionCheck', e.target.value)
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
        gap: 'clamp(24px, 4vw, 52px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Vector Graphic */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
            }}>
              QUALITATIVE REFLECTION
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#16302b',
              textAlign: 'left',
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Priority</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Tension</span>
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Where do you experience the biggest friction or "gap" between your listed priorities and where your daily energy actually goes?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <SeesawTensionIllustration />
          </div>
        </div>

        {/* RIGHT — Textarea Card Container + Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #e2e8e5',
              borderRadius: '20px',
              padding: '18px 22px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                SHARE YOUR REFLECTION
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                OPTIONAL
              </span>
            </div>

            <textarea
              value={priorityTensionCheck || ''}
              onChange={handleChange}
              placeholder="Describe the tension or imbalance you feel..."
              style={{
                width: '100%',
                height: '180px',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid #d2e7e0',
                background: '#f2f9f6',
                color: '#16302b',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '14.5px',
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
                e.target.style.borderColor = '#d2e7e0'
                e.target.style.background = '#f2f9f6'
              }}
            />

            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#8fa099', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              Your reflection is saved to guide your personalized insights.
            </p>
          </div>

          {/* Action button directly below card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '14px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '10px 40px' }}
            >
              {priorityTensionCheck && priorityTensionCheck.trim() ? 'Continue' : 'Skip'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}

