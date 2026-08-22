import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Prior Attempts Stepping Vector Illustration ── */
const PriorAttemptsIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '170px', display: 'block', margin: '0 auto' }}
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
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
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
    <circle cx="120" cy="80" r="6" fill="#00ae9d" stroke="#FFF" strokeWidth="1.8" />
    <circle cx="190" cy="50" r="7.5" fill="#00ae9d" stroke="#FFF" strokeWidth="2" />

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

export default function Stage7_2PriorScreen() {
  const { setScreen, setProfileField, priorAttempts } = useLewisStore()

  const handleSelect = (title) => {
    setProfileField('priorAttempts', title)
    setTimeout(() => {
      setScreen('stage7_3Aspiration')
    }, 240)
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

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Vector Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#414242',
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
              textAlign: 'left',
            }}>
              Prior Attempts
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Have you tried to improve your wellbeing recently?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <PriorAttemptsIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '10px' }}>

          {/* 4 Stacked Option Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {options.map(opt => {
              const selected = priorAttempts === opt.title
              return (
                <motion.button
                  key={opt.title}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(opt.title)}
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
                      {opt.title}
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
            Select the option that best describes your recent experience.
          </p>
        </div>

      </div>
    </motion.div>
  )
}

