import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Nervous System Line Art Illustration ── */
const NervousSystemIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '220px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="neuralAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="neuralSpine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="50%" stopColor="#FF9466" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>

    {/* Background Soft Aura */}
    <circle cx="120" cy="90" r="78" fill="url(#neuralAura)" />

    {/* Neural Pathway Axis Line */}
    <path d="M 120,32 L 120,148" stroke="url(#neuralSpine)" strokeWidth="2.8" strokeDasharray="4 4" />

    {/* 3 Autonomic State Nodes */}
    <g>
      <path d="M 120,48 Q 80,38 58,54 M 120,48 Q 160,38 182,54" stroke="#00ae9d" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="120" cy="48" r="6.5" fill="#00ae9d" stroke="#FFF" strokeWidth="2" />
    </g>
    <g>
      <path d="M 120,90 Q 75,78 48,94 M 120,90 Q 165,78 192,94" stroke="#FF9466" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="120" cy="90" r="6.5" fill="#FF9466" stroke="#FFF" strokeWidth="2" />
    </g>
    <g>
      <path d="M 120,132 Q 85,120 68,136 M 120,132 Q 155,120 172,136" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="120" cy="132" r="6.5" fill="#6366F1" stroke="#FFF" strokeWidth="2" />
    </g>

    {/* Wavy Horizon Lines */}
    <motion.path
      d="M 24,156 Q 85,146 135,160 T 226,152"
      stroke="#00AE9D" strokeWidth="3.2" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 34,172 Q 95,162 145,176 T 216,168"
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage3_5NsStateScreen() {
  const { setScreen, setProfileField, nervousSystemState } = useLewisStore()

  const handleNext = () => {
    setScreen('stage3_6BodyAwareness')
  }

  const states = [
    {
      id: 'ventral',
      title: 'Safe & Social',
      desc: 'You feel calm, connected, grounded, and open to the environment and others around you.',
      tag: 'Calm & Present'
    },
    {
      id: 'sympathetic',
      title: 'Mobilized / Fight-or-Flight',
      desc: 'You feel anxious, hyper-alert, frustrated, or physically driven. Mind is racing, body is tense.',
      tag: 'Hyperactive / Active'
    },
    {
      id: 'dorsal',
      title: 'Shutdown / Immobilized',
      desc: 'You feel numb, exhausted, flat, or socially checked out. Moving feels like pulling weights.',
      tag: 'Low Energy / Numb'
    }
  ]

  const handleSelect = (id) => {
    setProfileField('nervousSystemState', id)
  }

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

        {/* LEFT — Eyebrow + Title + Subtitle + Line Art */}
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
              Nervous System State
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Select the autonomic baseline that feels most true to your experience right now.
            </p>
          </div>
          <NervousSystemIllustration />
        </div>

        {/* RIGHT — AUTONOMIC BASELINE Eyebrow + 3 Option Cards + Pinned Button */}
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
            AUTONOMIC BASELINE
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {states.map(s => {
              const active = nervousSystemState === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: active ? '#e4f4ee' : '#f2f9f6',
                    color: active ? '#414242' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: active ? '0 4px 14px rgba(0,174,157,0.14)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: '14.5px',
                        color: active ? '#414242' : '#414242',
                      }}>
                        {s.title}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 400,
                      fontSize: '12.5px',
                      color: active ? '#0a5d50' : '#414242',
                      lineHeight: 1.4,
                    }}>
                      {s.desc}
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
              disabled={!nervousSystemState}
              style={{
                padding: '10px 36px',
                opacity: nervousSystemState ? 1 : 0.5,
                cursor: nervousSystemState ? 'pointer' : 'not-allowed',
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
