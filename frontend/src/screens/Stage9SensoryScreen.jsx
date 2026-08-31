import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Sound & Sensory Equalizer Vector Illustration with Motion ── */
const SoundSensoryIllustration = () => (
  <motion.svg className="stage-illustration"
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
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
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
      <motion.line x1="120" y1="85" x2="120" y2="40" stroke="#00ae9d" strokeWidth="4.5" strokeLinecap="round" animate={{ y1: [105, 35, 105] }} transition={{ duration: 1.6, repeat: Infinity }} />
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
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage9SensoryScreen() {
  const { setScreen, setProfileField, soundPreference } = useLewisStore()

  const handleNext = () => {
    useLewisStore.setState({ analysisData: null, analysisError: null, analysisMissing: null })
    setScreen('stage10Generating')
  }

  const options = [
    { title: 'Forest ambience', desc: 'Natural woodland sounds, gentle leaves, and birdsong.' },
    { title: 'Ocean waves', desc: 'Calming rhythmic ocean tides and soft water surges.' },
    { title: 'Binaural beats / White noise', desc: 'Steady frequency hums for deep focus and relaxation.' },
    { title: 'Silence', desc: 'Pure stillness without background audio.' }
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

        {/* LEFT — Title + Subtitle + Vector Line Art */}
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
              SENSORY &amp; SOUND
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
              Sound &amp; Sensory Check-in
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Listen for a moment. Which soundscape feels most restoring for you right now?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <SoundSensoryIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '10px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {options.map(opt => {
              const active = soundPreference === opt.title
              return (
                <motion.button
                  key={opt.title}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setProfileField('soundPreference', opt.title)
                    setTimeout(() => {
                      useLewisStore.setState({ analysisData: null, analysisError: null, analysisMissing: null })
                      setScreen('stage10Generating')
                    }, 240)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-color, #d2e7e0)',
                    background: active ? 'var(--teal-tint, #e4f4ee)' : 'var(--raised, #ffffff)',
                    color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #3a3a3a)',
                    cursor: 'pointer',
                    transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                    boxShadow: active ? '0 3px 10px rgba(0,174,157,0.16)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    outline: 'none',
                  }}
                >
                  {/* Selection Indicator Circle with Radio */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: active ? '2px solid var(--dawn, #00ae9d)' : '2px solid var(--border-strong, #c2ceca)',
                    background: active ? 'var(--dawn, #00ae9d)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.18s ease',
                  }}>
                    {active && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--action-text, #fff)' }} />}
                  </div>

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: active ? 700 : 600,
                      fontSize: '14.5px',
                      color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      marginBottom: '3px',
                      lineHeight: 1.3,
                    }}>
                      {opt.title}
                    </span>
                    <p style={{
                      margin: 0,
                      fontSize: '12.5px',
                      fontWeight: 400,
                      color: active ? 'var(--dawn, #0a5d50)' : 'var(--text-sub, #64748b)',
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
