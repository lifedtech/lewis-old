import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Somatic Connection Line Art Illustration ── */
const SomaticConnectionIllustration = () => (
  <motion.svg className="stage-illustration"
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

  const handleSelect = (label) => {
    setProfileField('bodyAwareness', label)
    setTimeout(() => {
      setScreen('stage4Maze')
    }, 200)
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
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Somatic Line Art Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              CHOOSE ONE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: 'var(--text-main, #414242)',
            }}>
              Somatic Connection
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How connected do you feel to your physical body right now?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <SomaticConnectionIllustration />
          </div>
        </div>

        {/* RIGHT — Option Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start', width: '100%' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {options.map(opt => {
              const selected = bodyAwareness === opt.label
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    border: selected ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-color, #d2e7e0)',
                    background: selected ? 'var(--teal-tint, #e4f4ee)' : 'var(--raised, #f2f9f6)',
                    color: selected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #3a3a3a)',
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
                    border: selected ? '2px solid var(--dawn, #00ae9d)' : '2px solid var(--border-strong, #c2ceca)',
                    background: selected ? 'var(--dawn, #00ae9d)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.2s ease',
                  }}>
                    {selected && <span style={{ color: 'var(--action-text, #ffffff)', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '14.5px',
                      color: selected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                    }}>
                      {opt.label}
                    </span>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 400,
                      fontSize: '12.5px',
                      color: selected ? 'var(--dawn, #0a5d50)' : 'var(--text-sub, #657370)',
                      lineHeight: 1.4,
                    }}>
                      {opt.desc}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

        </div>

      </div>
    </motion.div>
  )
}
