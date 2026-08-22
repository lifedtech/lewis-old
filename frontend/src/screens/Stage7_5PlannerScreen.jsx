import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Readiness for Action Vector Illustration ── */
const ReadinessActionIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '170px', display: 'block', margin: '0 auto' }}
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
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
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
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage7_5PlannerScreen() {
  const { setScreen, setProfileField, plannerReadiness } = useLewisStore()

  const handleSelect = (id) => {
    setProfileField('plannerReadiness', id)
    setTimeout(() => {
      setScreen('stage7_6Values')
    }, 240)
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

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Vector Line Art */}
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
              ACTION READINESS
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 38px)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
              whiteSpace: 'nowrap',
            }}>
              Readiness for Action
            </h1>
            <p style={{
              margin: '8px 0 14px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.45,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              How prepared do you feel to integrate small wellness habits or changes into your calendar starting this week?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <ReadinessActionIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '14px' }}>

          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
              ACTION READINESS
            </span>
          </div>

          {/* 3 Stacked Option Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {options.map(opt => {
              const selected = plannerReadiness === opt.id
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: selected ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: selected ? '#e4f4ee' : '#ffffff',
                    color: selected ? '#414242' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                    boxShadow: selected ? '0 3px 10px rgba(0,174,157,0.16)' : '0 1px 4px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    outline: 'none',
                  }}
                >
                  {/* Selection Circle Radio Indicator */}
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
                    transition: 'all 0.18s ease',
                  }}>
                    {selected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                  </div>

                  {/* Content Container */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: selected ? 700 : 600,
                      fontSize: '14.5px',
                      color: selected ? '#00ae9d' : '#414242',
                      marginBottom: '3px',
                      textAlign: 'left',
                      lineHeight: 1.3,
                    }}>
                      {opt.label}
                    </span>
                    <p style={{
                      margin: 0,
                      fontSize: '12.5px',
                      color: selected ? '#1b4d43' : '#64748b',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.45,
                      textAlign: 'left',
                    }}>
                      {opt.desc}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Select the statement that best reflects your current mindset.
          </p>
        </div>

      </div>
    </motion.div>
  )
}

