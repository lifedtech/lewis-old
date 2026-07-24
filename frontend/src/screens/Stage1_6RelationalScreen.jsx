import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Relational Context Connected Nodes Vector Line Art ── */
const RelationalContextIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="relAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="relGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#relAura)" />

    {/* Overlapping Connected Relational Circles Line Art */}
    <circle cx="95" cy="85" r="35" stroke="#00AE9D" strokeWidth="2" strokeDasharray="4 4" fill="rgba(0,174,157,0.06)" />
    <circle cx="145" cy="85" r="35" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" fill="rgba(16,185,129,0.06)" />

    {/* Connecting Node Pulse Animation */}
    <motion.line
      x1="95" y1="85" x2="145" y2="85" stroke="url(#relGrad)" strokeWidth="2.5"
      animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
    />
    <motion.circle cx="95" cy="85" r="7" fill="#00AE9D" stroke="#FFF" strokeWidth="1.5" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
    <motion.circle cx="145" cy="85" r="7" fill="#10B981" stroke="#FFF" strokeWidth="1.5" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />

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

export default function Stage1_6RelationalScreen() {
  const { setScreen, setProfileField, relationalContext } = useLewisStore()

  const options = [
    { title: 'Genuinely connected', desc: 'Rich, supportive relationships that nourish your energy.' },
    { title: 'Okay, but could be better', desc: 'Functional connections, though lacking deeper intimacy or presence.' },
    { title: 'A bit lonely', desc: 'Desiring more meaningful connection or understanding.' },
    { title: 'Quite isolated', desc: 'Feeling distant, unassisted, or detached from those around you.' },
    { title: 'Overwhelming/Too much', desc: 'Social demands and interactions feel draining or excessive.' }
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
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Vector Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              CHOOSE ONE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#16302b',
              textWrap: 'balance',
            }}>
              Relational<br />Context
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How does your social world feel right now?
            </p>
          </div>
          <RelationalContextIllustration />
        </div>

        {/* RIGHT — SOCIAL WORLD Eyebrow + 5 Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 8px 0',
          }}>
            SOCIAL WORLD
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map(opt => {
              const active = relationalContext === opt.title
              return (
                <button
                  key={opt.title}
                  onClick={() => setProfileField('relationalContext', opt.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    width: '100%',
                    padding: '9px 15px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #e2e8e5',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#044e43' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Selection Indicator Circle with Checkmark */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: active ? '#00ae9d' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '14.5px',
                      color: active ? '#044e43' : '#16302b',
                      lineHeight: 1.3,
                    }}>
                      {opt.title}
                    </span>
                    <p style={{
                      margin: '2px 0 0 0',
                      fontSize: '12px',
                      color: active ? '#1b4d43' : '#4a6b62',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.35,
                    }}>
                      {opt.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={() => setScreen('stage1_7Priority')}
              disabled={!relationalContext}
              style={{
                padding: '10px 36px',
                opacity: relationalContext ? 1 : 0.5,
                cursor: relationalContext ? 'pointer' : 'not-allowed',
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
