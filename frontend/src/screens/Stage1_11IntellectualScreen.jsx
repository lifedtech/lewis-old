import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Intellectual line illustration ── */
const IntellectualIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 200"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="intelAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Aura */}
    <circle cx="120" cy="100" r="80" fill="url(#intelAura)" />
    <circle cx="120" cy="100" r="72" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.25" />

    {/* Lightbulb / Curiosity Filament Line */}
    <motion.path
      d="M 120 50 C 95 50 85 70 85 90 C 85 105 95 115 102 125 L 138 125 C 145 115 155 105 155 90 C 155 70 145 50 120 50 Z"
      stroke="#00AE9D" strokeWidth="2" fill="rgba(0, 174, 157, 0.08)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    <path d="M 105 125 L 105 138 L 135 138 L 135 125" stroke="#00AE9D" strokeWidth="2" fill="none" />
    <line x1="112" y1="144" x2="128" y2="144" stroke="#00AE9D" strokeWidth="2" strokeLinecap="round" />

    {/* Sparking Idea Filament */}
    <motion.path
      d="M 110 85 Q 120 70 130 85"
      stroke="#00ae9d" strokeWidth="2.2" strokeLinecap="round" fill="none"
      animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
      style={{ transformOrigin: '120px 80px' }}
    />

    {/* Radiating Spark Rays */}
    {[{ x1: 120, y1: 34, x2: 120, y2: 42 }, { x1: 72, y1: 58, x2: 78, y2: 64 }, { x1: 168, y1: 58, x2: 162, y2: 64 }].map((r, i) => (
      <motion.line
        key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
        stroke="#00ae9d" strokeWidth="2" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}

    {/* Ground Baseline */}
    <line x1="30" y1="152" x2="210" y2="152" stroke="#00AE9D" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </motion.svg>
)

export default function Stage1_11IntellectualScreen() {
  const { setScreen, setProfileField, intellectualPulse } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_12Cultural')
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

        {/* LEFT — Eyebrow + Title + Subtitle + Line Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              OPEN REFLECTION
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
              Intellectual Pulse
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '360px',
            }}>
              When did you last do something that genuinely stretched your mind or sparked your curiosity?
            </p>
          </div>
          <IntellectualIllustration />
        </div>

        {/* RIGHT — YOUR CURIOSITY Eyebrow + Full-Height Textarea + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>

          <p style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: 0,
          }}>
            YOUR CURIOSITY
          </p>

          <textarea
            placeholder="Type here..."
            value={intellectualPulse || ''}
            onChange={(e) => setProfileField('intellectualPulse', e.target.value)}
            style={{
              flex: 1,
              width: '100%',
              minHeight: '160px',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1.5px solid #d2e7e0',
              background: '#f2f9f6',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00ae9d'
              e.target.style.background = '#ffffff'
              e.target.style.boxShadow = '0 4px 16px rgba(0,174,157,0.12)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d2e7e0'
              e.target.style.background = '#f2f9f6'
              e.target.style.boxShadow = 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button className="btn-primary" onClick={handleNext} style={{ padding: '10px 36px' }}>
              Continue
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
