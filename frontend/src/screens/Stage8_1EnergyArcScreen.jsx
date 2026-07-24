import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Energy Arc Vector Illustration with Sequential Energy Wave Motion ── */
const EnergyArcIllustration = () => (
  <motion.svg
    viewBox="0 0 200 170"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Pulsing Background Soft Glow */}
    <motion.circle
      cx="100" cy="95" r="65" fill="url(#arcGlow)"
      animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.75, 0.3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 95px' }}
    />

    {/* Horizontal Baseline */}
    <line x1="35" y1="145" x2="165" y2="145" stroke="#E2E8E5" strokeWidth="2.5" strokeLinecap="round" />

    {/* Arc Parabola Curve Line */}
    <motion.path
      d="M 40,135 Q 100,55 160,135"
      stroke="#00AE9D"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />

    {/* Node 1 (Morning Slope - Sequential Glow) */}
    <motion.circle
      cx="54" cy="116" r="7"
      fill="#00AE9D" stroke="#FFF" strokeWidth="1.5"
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      style={{ transformOrigin: '54px 116px' }}
    />

    {/* Node 2 (Apex Peak Green Dot - Vibrant Pulsing Glow) */}
    <motion.circle
      cx="90" cy="72" r="9"
      fill="#10B981" stroke="#FFF" strokeWidth="1.8"
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      style={{ transformOrigin: '90px 72px' }}
    />

    {/* Node 3 (Afternoon Slope - Sequential Glow) */}
    <motion.circle
      cx="124" cy="84" r="7"
      fill="#00AE9D" stroke="#FFF" strokeWidth="1.5"
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      style={{ transformOrigin: '124px 84px' }}
    />

    {/* Node 4 (Night Base - Sequential Glow) */}
    <motion.circle
      cx="154" cy="122" r="6"
      fill="#00AE9D" stroke="#FFF" strokeWidth="1.5"
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}
      style={{ transformOrigin: '154px 122px' }}
    />
  </motion.svg>
)

export default function Stage8_1EnergyArcScreen() {
  const { setScreen, updateObjectField, energyArc } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_2StressPattern')
  }

  const timesOfDay = [
    { key: 'morning', label: 'Morning', icon: '🌅' },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { key: 'evening', label: 'Evening', icon: '🌇' },
    { key: 'night', label: 'Night', icon: '🌙' }
  ]

  const levels = ['High', 'Medium', 'Low']

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

        {/* LEFT — Title + Subtitle + Animated Energy Arc Illustration */}
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
              Energy Arc<br />Mapping
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Map out how your energy rises and falls throughout a typical day.
            </p>
          </div>
          <EnergyArcIllustration />
        </div>

        {/* RIGHT — DAILY RHYTHMS Eyebrow + 4 Time-of-Day Rhythms + Pinned Button */}
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
            DAILY RHYTHMS
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timesOfDay.map(tod => {
              const currentVal = energyArc?.[tod.key]
              return (
                <div
                  key={tod.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    border: '1.5px solid #e2e8e5',
                    background: '#f7faf8',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{tod.icon}</span>
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '15px', color: '#16302b' }}>
                      {tod.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {levels.map(level => {
                      const selected = currentVal === level
                      return (
                        <button
                          key={level}
                          onClick={() => updateObjectField('energyArc', tod.key, level)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '10px',
                            border: selected ? '1.5px solid #00ae9d' : '1.5px solid #d1e3df',
                            background: selected ? '#e4f4ee' : '#ffffff',
                            color: selected ? '#044e43' : '#4a6b62',
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: selected ? 700 : 500,
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {level}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '16px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '12px 38px' }}
            >
              Continue
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
