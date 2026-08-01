import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Somatic Connection Line Art Illustration ── */
const SomaticConnectionIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="somaticAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="somaticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#somaticAura)" />

    {/* Somatic Resonance Rings */}
    <motion.circle
      cx="120" cy="90" r="68"
      stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="5 5" fill="none" opacity="0.3"
      animate={{ scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 90px' }}
    />
    <motion.circle
      cx="120" cy="90" r="50"
      stroke="url(#somaticGrad)" strokeWidth="1.8" fill="rgba(0, 174, 157, 0.06)"
      animate={{ scale: [0.92, 1.08, 0.92] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 90px' }}
    />

    {/* Heartbeat / Pulse Wave Line */}
    <path
      d="M 65,90 L 95,90 L 105,70 L 115,110 L 125,75 L 135,98 L 145,90 L 175,90"
      stroke="#00ae9d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />

    {/* Central Core Pulse Dot */}
    <motion.circle
      cx="120" cy="90" r="6.5" fill="#00ae9d" stroke="#FFF" strokeWidth="2"
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage3_6BodyAwarenessScreen() {
  const { setScreen, setProfileField, bodyAwareness } = useLewisStore()

  const handleNext = () => {
    setScreen('stage4Maze')
  }

  const options = [
    { label: 'Disconnected', desc: 'You feel detached from physical sensations, or mostly in your head.' },
    { label: 'Slightly aware', desc: 'You feel some tension or physical signals, but they are easy to ignore.' },
    { label: 'Fully present', desc: 'You feel highly connected to somatic sensations, heartbeats, and tension shifts.' }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
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

        {/* LEFT — Eyebrow + Title + Subtitle + Somatic Line Art Illustration */}
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
              color: '#414242',
              whiteSpace: 'nowrap',
            }}>
              Somatic Connection
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How connected do you feel to your physical body right now?
            </p>
          </div>
          <SomaticConnectionIllustration />
        </div>

        {/* RIGHT — SOMATIC AWARENESS Eyebrow + Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 14px 0',
            width: '100%',
          }}>
            SOMATIC AWARENESS
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {options.map(opt => {
              const selected = bodyAwareness === opt.label
              return (
                <button
                  key={opt.label}
                  onClick={() => setProfileField('bodyAwareness', opt.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    border: selected ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: selected ? '#e4f4ee' : '#f2f9f6',
                    color: selected ? '#414242' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: selected ? '0 4px 14px rgba(0,174,157,0.14)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
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
                    {selected && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '14.5px',
                      color: selected ? '#414242' : '#414242',
                    }}>
                      {opt.label}
                    </span>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 400,
                      fontSize: '12.5px',
                      color: selected ? '#0a5d50' : '#414242',
                      lineHeight: 1.4,
                    }}>
                      {opt.desc}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!bodyAwareness}
              style={{
                padding: '10px 36px',
                opacity: bodyAwareness ? 1 : 0.5,
                cursor: bodyAwareness ? 'pointer' : 'not-allowed',
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
