import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Sprouting Plant Star Blossom Vector Illustration with Motion ── */
const AspirationPlantIllustration = () => (
  <motion.svg
    viewBox="0 0 200 180"
    fill="none"
    style={{ width: '100%', maxWidth: '180px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="100" cy="42" r="35" fill="url(#starGlow)" />

    {/* Ground Base Line */}
    <line x1="60" y1="150" x2="140" y2="150" stroke="#D1E3DF" strokeWidth="2.5" strokeLinecap="round" />

    {/* Animated Swaying Stem & Leaves */}
    <motion.g
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 150px' }}
    >
      {/* Vertical Green Plant Stem */}
      <line x1="100" y1="150" x2="100" y2="60" stroke="#5FBB46" strokeWidth="3.8" strokeLinecap="round" />

      {/* Left Mint Leaf */}
      <path
        d="M 100,110 C 70,95 65,120 90,132 C 98,135 100,122 100,110 Z"
        fill="#DDF3D5"
        stroke="#5FBB46"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Right Mint Leaf */}
      <path
        d="M 100,90 C 130,75 135,100 110,112 C 102,115 100,102 100,90 Z"
        fill="#DDF3D5"
        stroke="#5FBB46"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </motion.g>

    {/* Top 4-Point Teal Star Blossom with Radiant Motion */}
    <motion.path
      d="M 100,20 Q 100,42 122,42 Q 100,42 100,64 Q 100,42 78,42 Q 100,42 100,20 Z"
      fill="#00AE9D"
      stroke="#00856A"
      strokeWidth="1.5"
      animate={{ scale: [0.92, 1.12, 0.92], rotate: [0, 90, 180, 270, 360] }}
      transition={{
        scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 16, repeat: Infinity, ease: 'linear' }
      }}
      style={{ transformOrigin: '100px 42px' }}
    />
  </motion.svg>
)

export default function Stage7_3AspirationScreen() {
  const { setScreen, setProfileField, aspirationLandscape } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_4Support')
  }

  const handleChange = (e) => {
    setProfileField('aspirationLandscape', e.target.value)
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

        {/* LEFT — Title + Subtitle + Animated Sprouting Star Blossom Illustration */}
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
              Wellbeing<br />Aspirations
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '360px',
            }}>
              What is your primary hope, vision, or goal for your well-being over the next three months?
            </p>
          </div>
          <AspirationPlantIllustration />
        </div>

        {/* RIGHT — Full-Height Textarea + Pinned Action Button */}
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
            value={aspirationLandscape || ''}
            onChange={handleChange}
            placeholder="Type your well-being goals and dreams..."
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
              disabled={!aspirationLandscape || !aspirationLandscape.trim()}
              style={{
                padding: '12px 38px',
                opacity: aspirationLandscape && aspirationLandscape.trim() ? 1 : 0.5,
                cursor: aspirationLandscape && aspirationLandscape.trim() ? 'pointer' : 'not-allowed',
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
