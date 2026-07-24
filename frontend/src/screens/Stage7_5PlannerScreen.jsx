import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Readiness for Action Vector Illustration ── */
const ReadinessActionIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="readyAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="readyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#readyAura)" />

    {/* Target Compass Outer Ring */}
    <circle cx="120" cy="85" r="55" stroke="rgba(0,174,157,0.2)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

    {/* Upward Action Rocket / Arrow Line Art */}
    <motion.path
      d="M 120,40 L 140,80 L 125,75 L 125,120 L 115,120 L 115,75 L 100,80 Z"
      fill="url(#readyGrad)" stroke="#FFF" strokeWidth="1.5"
      animate={{ y: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />

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

export default function Stage7_5PlannerScreen() {
  const { setScreen, setProfileField, plannerReadiness } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_6Values')
  }

  const options = [
    { id: 'ready', label: 'Ready to start today', desc: 'I am motivated and have immediate capacity to build new routines.' },
    { id: 'reflect', label: 'Need time to reflect', desc: 'I want to plan first and clear some space before taking active steps.' },
    { id: 'exploring', label: 'Just exploring', desc: 'I am gathering information and checking my baseline, but not ready to commit.' }
  ]

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

        {/* LEFT — Title + Subtitle + Vector Line Art Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'center' }}>
          <div>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              margin: 0,
              color: '#16302b',
              textWrap: 'balance',
            }}>
              Readiness for<br />Action
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How prepared do you feel to integrate small wellness habits or changes into your calendar starting this week?
            </p>
          </div>
          <ReadinessActionIllustration />
        </div>

        {/* RIGHT — ACTION & SUPPORT Eyebrow + 3 Unclipped Option Cards + Pinned Button */}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {options.map(opt => {
              const selected = plannerReadiness === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setProfileField('plannerReadiness', opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    width: '100%',
                    padding: '16px 22px',
                    borderRadius: '18px',
                    border: selected ? '1.5px solid #00ae9d' : '1.5px solid #e2e8e5',
                    background: selected ? '#e4f4ee' : '#f7faf8',
                    color: selected ? '#044e43' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: selected ? '0 4px 14px rgba(0,174,157,0.14)' : '0 2px 6px rgba(0,0,0,0.02)',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Selection Radio Circle Indicator (Non-overlapping flex child) */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: selected ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: selected ? '#00ae9d' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.2s ease',
                  }}>
                    {selected && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />}
                  </div>

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '16px',
                      color: selected ? '#044e43' : '#16302b',
                      marginBottom: '4px',
                    }}>
                      {opt.label}
                    </span>
                    <p style={{
                      margin: 0,
                      fontSize: '13.5px',
                      color: selected ? '#1b4d43' : '#4a6b62',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.5
                    }}>
                      {opt.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '16px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!plannerReadiness}
              style={{
                padding: '12px 38px',
                opacity: plannerReadiness ? 1 : 0.5,
                cursor: plannerReadiness ? 'pointer' : 'not-allowed',
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
