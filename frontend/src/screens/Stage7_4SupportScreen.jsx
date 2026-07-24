import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Support Preferences Vector Illustration ── */
const SupportPreferencesIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="suppAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="suppGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#suppAura)" />

    {/* Supporting Arc Hands / Beacon Line Art */}
    <path
      d="M 60,115 C 75,135 110,135 120,115 C 130,135 165,135 180,115"
      stroke="#00AE9D" strokeWidth="2.5" strokeLinecap="round" fill="none"
    />

    {/* Guiding Light Beacon Circle */}
    <motion.circle
      cx="120" cy="65" r="16"
      fill="rgba(0,174,157,0.12)" stroke="url(#suppGrad)" strokeWidth="2.2"
      animate={{ scale: [0.95, 1.08, 0.95] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 65px' }}
    />
    <circle cx="120" cy="65" r="5" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />

    {/* Connecting Support Rays */}
    <line x1="120" y1="81" x2="120" y2="115" stroke="#36D1DC" strokeWidth="1.8" strokeDasharray="3 3" />

    {/* Wavy Horizon Lines */}
    <motion.path
      d="M 28,154 Q 85,145 135,158 T 222,150"
      stroke="#00AE9D" strokeWidth="3.2" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 38,170 Q 95,161 145,174 T 212,166"
      stroke="#99E2D8" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage7_4SupportScreen() {
  const { setScreen, toggleArrayItem, supportPreferences } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_5Planner')
  }

  const options = [
    { id: 'coaching', label: 'Coaching & Professional guidance' },
    { id: 'selfGuided', label: 'Self-guided tools & Digital trackers' },
    { id: 'community', label: 'Community & Peer groups' },
    { id: 'therapy', label: 'Clinical support or Therapy' }
  ]

  const isSelected = (id) => (supportPreferences || []).includes(id)
  const selectedCount = (supportPreferences || []).length

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
        padding: '0 clamp(16px, 3vw, 40px)',
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Vector Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'center' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 6px 0',
            }}>
              SELECT ALL THAT APPLY
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(34px, 4.4vw, 56px)',
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              margin: 0,
              color: '#16302b',
              textWrap: 'balance',
            }}>
              Support<br />Preferences
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              What kind of support is most helpful to you when adopting new health behaviors or stress management habits?
            </p>
          </div>
          <SupportPreferencesIllustration />
        </div>

        {/* RIGHT — ACTION & SUPPORT Eyebrow + 4 Multi-select Checkbox Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 12px 0',
          }}>
            ACTION & SUPPORT
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {options.map(opt => {
              const active = isSelected(opt.id)
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleArrayItem('supportPreferences', opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #e2e8e5',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#044e43' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 4px 14px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Selection Circle Indicator with Checkmark */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: active ? '#00ae9d' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: active ? 700 : 500,
                    fontSize: '14.5px',
                    color: active ? '#044e43' : '#16302b',
                    lineHeight: 1.4,
                  }}>
                    {opt.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '16px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={selectedCount === 0}
              style={{
                padding: '12px 38px',
                opacity: selectedCount > 0 ? 1 : 0.5,
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
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
