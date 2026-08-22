import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Cumulative Allostatic Load Vector Illustration ── */
const CumulativeLoadIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="cumAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#cumAura)" />

    {/* Hourglass Vector Line Art */}
    <path
      d="M 80,45 L 160,45 L 120,90 L 160,135 L 80,135 L 120,90 Z"
      stroke="#00AE9D" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(0,174,157,0.06)"
    />
    <line x1="75" y1="45" x2="165" y2="45" stroke="#00ae9d" strokeWidth="3" strokeLinecap="round" />
    <line x1="75" y1="135" x2="165" y2="135" stroke="#00ae9d" strokeWidth="3" strokeLinecap="round" />

    {/* Falling Time Sand Grains Animation */}
    <motion.line
      x1="120" y1="90" x2="120" y2="130"
      stroke="url(#cumGrad)" strokeWidth="2" strokeDasharray="3 3"
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
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

export default function Stage8_4CumulativeScreen() {
  const { setScreen, setProfileField, cumulativeLoad } = useLewisStore()

  const handleNext = () => {
    setScreen('stage9Sensory')
  }

  const options = [
    { title: 'Less than 3 months', desc: 'Recent increase in demands or temporary acute stress phase.' },
    { title: '3-6 months', desc: 'Sustained stress load stretching across multiple seasons.' },
    { title: '6-12 months', desc: 'Prolonged pressure taking a continuous toll on reserves.' },
    { title: 'More than a year / Chronic', desc: 'Long-term baseline state of high stress or exhaustion.' }
  ]

  const selectedValue = typeof cumulativeLoad === 'string' ? cumulativeLoad : cumulativeLoad?.durationTimeline

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
              DAILY RHYTHMS
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
              Cumulative Allostatic Load
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
              How long have you been operating under your current level of stress or demand?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <CumulativeLoadIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '10px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {options.map(opt => {
              const selected = selectedValue === opt.title
              return (
                <motion.button
                  key={opt.title}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setProfileField('cumulativeLoad', opt.title)
                    setTimeout(() => {
                      setScreen('stage9Sensory')
                    }, 240)
                  }}
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

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: selected ? 700 : 600,
                      fontSize: '14.5px',
                      color: selected ? '#00ae9d' : '#414242',
                      marginBottom: '3px',
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
                    }}>
                      {opt.desc}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>

        </div>

      </div>
    </motion.div>
  )
}
