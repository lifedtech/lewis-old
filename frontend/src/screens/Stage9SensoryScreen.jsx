import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Sound & Sensory Equalizer Vector Illustration with Motion ── */
const SoundSensoryIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="sndAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="sndGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#sndAura)" />

    {/* Concentric Soundwave Pulse Rings */}
    <motion.circle
      cx="120" cy="85" r="45" stroke="rgba(0,174,157,0.3)" strokeWidth="1.5" strokeDasharray="4 4" fill="none"
      animate={{ scale: [0.95, 1.12, 0.95] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 85px' }}
    />

    {/* Animated Equalizer Sound Bars */}
    <g>
      <motion.line x1="85" y1="85" x2="85" y2="70" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" animate={{ y1: [95, 65, 95] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <motion.line x1="100" y1="85" x2="100" y2="55" stroke="url(#sndGrad)" strokeWidth="4" strokeLinecap="round" animate={{ y1: [100, 50, 100] }} transition={{ duration: 2.2, repeat: Infinity }} />
      <motion.line x1="120" y1="85" x2="120" y2="40" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" animate={{ y1: [105, 35, 105] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <motion.line x1="140" y1="85" x2="140" y2="55" stroke="url(#sndGrad)" strokeWidth="4" strokeLinecap="round" animate={{ y1: [100, 52, 100] }} transition={{ duration: 2.4, repeat: Infinity }} />
      <motion.line x1="155" y1="85" x2="155" y2="70" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" animate={{ y1: [95, 68, 95] }} transition={{ duration: 2.0, repeat: Infinity }} />
    </g>

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

export default function Stage9SensoryScreen() {
  const { setScreen, setProfileField, soundPreference } = useLewisStore()

  const handleNext = () => {
    setScreen('stage9QuickChoices')
  }

  const options = [
    { title: 'Forest ambience', icon: '🌲', desc: 'Natural woodland sounds, gentle leaves, and birdsong.' },
    { title: 'Ocean waves', icon: '🌊', desc: 'Calming rhythmic ocean tides and soft water surges.' },
    { title: 'Binaural beats / White noise', icon: '🎧', desc: 'Steady frequency hums for deep focus and relaxation.' },
    { title: 'Silence', icon: '🤫', desc: 'Pure stillness without background audio.' }
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

        {/* LEFT — Title + Subtitle + Vector Line Art */}
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
              SENSORY & SOUND
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
              Sound & Sensory<br />Check-in
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Listen for a moment. Which soundscape feels most restoring for you right now?
            </p>
          </div>
          <SoundSensoryIllustration />
        </div>

        {/* RIGHT — SOUNDSCAPES Eyebrow + 4 Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 10px 0',
          }}>
            SOUNDSCAPES
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map(opt => {
              const active = soundPreference === opt.title
              return (
                <button
                  key={opt.title}
                  onClick={() => setProfileField('soundPreference', opt.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    width: '100%',
                    padding: '12px 18px',
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
                  {/* Selection Indicator Circle with Checkmark */}
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
                    marginTop: '2px',
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '16px' }}>{opt.icon}</span>
                      <span style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: '15.5px',
                        color: active ? '#044e43' : '#16302b',
                      }}>
                        {opt.title}
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: active ? '#1b4d43' : '#4a6b62',
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '12px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!soundPreference}
              style={{
                padding: '12px 38px',
                opacity: soundPreference ? 1 : 0.5,
                cursor: soundPreference ? 'pointer' : 'not-allowed',
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
