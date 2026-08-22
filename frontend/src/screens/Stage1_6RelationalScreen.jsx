import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Relational Context Connected Nodes Vector Line Art ── */
const RelationalContextIllustration = () => (
  <motion.svg className="stage-illustration"
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
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#relAura)" />

    {/* Overlapping Connected Relational Circles Line Art */}
    <circle cx="95" cy="85" r="35" stroke="#00AE9D" strokeWidth="2" strokeDasharray="4 4" fill="rgba(0,174,157,0.06)" />
    <circle cx="145" cy="85" r="35" stroke="#00ae9d" strokeWidth="2" strokeDasharray="4 4" fill="rgba(16,185,129,0.06)" />

    {/* Connecting Node Pulse Animation */}
    <motion.line
      x1="95" y1="85" x2="145" y2="85" stroke="url(#relGrad)" strokeWidth="2.5"
      animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
    />
    <motion.circle cx="95" cy="85" r="7" fill="#00AE9D" stroke="#FFF" strokeWidth="1.5" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
    <motion.circle cx="145" cy="85" r="7" fill="#00ae9d" stroke="#FFF" strokeWidth="1.5" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />

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

export default function Stage1_6RelationalScreen() {
  const { setScreen, setProfileField, relationalContext } = useLewisStore()

  const options = [
    { title: 'Genuinely connected', desc: 'Rich, supportive relationships that nourish your energy.' },
    { title: 'Okay, but could be better', desc: 'Functional connections, though lacking deeper intimacy or presence.' },
    { title: 'A bit lonely', desc: 'Desiring more meaningful connection or understanding.' },
    { title: 'Quite isolated', desc: 'Feeling distant, unassisted, or detached from those around you.' },
    { title: 'Overwhelming/Too much', desc: 'Social demands and interactions feel draining or excessive.' }
  ]

  const handleSelect = (title) => {
    setProfileField('relationalContext', title)
    setTimeout(() => {
      setScreen('stage1_7Priority')
    }, 200)
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
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Vector Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
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
              color: '#414242',
            }}>
              Relational Context
            </h1>
            <p style={{
              margin: '10px 0 0 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How does your social world feel right now?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <RelationalContextIllustration />
          </div>
        </div>

        {/* RIGHT — SOCIAL WORLD Eyebrow + 5 Option Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p className="stage-right-eyebrow" style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            margin: '0 0 8px 0'
          }}>
            SOCIAL WORLD
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map(opt => {
              const active = relationalContext === opt.title
              return (
                <button
                  key={opt.title}
                  onClick={() => handleSelect(opt.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    width: '100%',
                    padding: '9px 15px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: active ? '#e4f4ee' : '#f2f9f6',
                    color: active ? '#414242' : '#3a3a3a',
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
                      color: active ? '#414242' : '#414242',
                      lineHeight: 1.3,
                    }}>
                      {opt.title}
                    </span>
                    <p style={{
                      margin: '2px 0 0 0',
                      fontSize: '12px',
                      color: active ? '#1b4d43' : '#414242',
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

        </div>

      </div>
    </motion.div>
  )
}
