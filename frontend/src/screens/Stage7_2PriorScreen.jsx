import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Prior Attempts Stepping Vector Illustration ── */
const PriorAttemptsIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="priorAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="priorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#priorAura)" />

    {/* Stepping Path Curved Line */}
    <motion.path
      d="M 50,130 C 80,130 90,80 120,80 C 150,80 160,50 190,50"
      stroke="url(#priorGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="5 4"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.4 }}
    />

    {/* Step Nodes */}
    <circle cx="50" cy="130" r="6" fill="#00AE9D" stroke="#FFF" strokeWidth="1.8" />
    <circle cx="120" cy="80" r="6" fill="#36D1DC" stroke="#FFF" strokeWidth="1.8" />
    <circle cx="190" cy="50" r="7.5" fill="#10B981" stroke="#FFF" strokeWidth="2" />

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

export default function Stage7_2PriorScreen() {
  const { setScreen, setProfileField, priorAttempts } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_3Aspiration')
  }

  const options = [
    { title: 'Yes, actively', desc: 'Consistently taking steps towards mental and physical health.' },
    { title: 'On and off', desc: 'Making efforts occasionally when time and energy allow.' },
    { title: 'Not really', desc: "Haven't made focused efforts in recent months." },
    { title: 'It feels too overwhelming', desc: 'Tried before, but finding it hard to know where to begin.' }
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

        {/* LEFT — Eyebrow + Title + Subtitle + Vector Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'center' }}>
          <div>
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
              Prior<br />Attempts
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Have you tried to improve your wellbeing recently?
            </p>
          </div>
          <PriorAttemptsIllustration />
        </div>

        {/* RIGHT — Standardized 4 Full-Width Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {options.map(opt => {
              const selected = priorAttempts === opt.title
              return (
                <button
                  key={opt.title}
                  onClick={() => setProfileField('priorAttempts', opt.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '16px',
                    border: selected ? '1.5px solid #00ae9d' : '1.5px solid #e2e8e5',
                    background: selected ? '#e4f4ee' : '#f7faf8',
                    color: selected ? '#044e43' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selected ? '0 4px 14px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Selection Circle Radio Indicator */}
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

                  {/* Content Container */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '15.5px',
                      color: selected ? '#044e43' : '#16302b',
                      marginBottom: '3px',
                    }}>
                      {opt.title}
                    </span>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: selected ? '#1b4d43' : '#4a6b62',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.45,
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
              disabled={!priorAttempts}
              style={{
                padding: '12px 38px',
                opacity: priorAttempts ? 1 : 0.5,
                cursor: priorAttempts ? 'pointer' : 'not-allowed',
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
