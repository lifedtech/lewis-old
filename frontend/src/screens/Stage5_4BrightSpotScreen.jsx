import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Bright Spot Animated Glowing Sunburst Vector Illustration ── */
const BrightSpotIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 200 200"
    fill="none"
    style={{ width: '100%', maxWidth: '160px', display: 'block', margin: '0' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="brightOrbGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#80E8DD" />
        <stop offset="45%" stopColor="#00ae9d" />
        <stop offset="85%" stopColor="#00AE9D" />
        <stop offset="100%" stopColor="#00ae9d" />
      </radialGradient>
      <radialGradient id="brightGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Pulsing Background Aura */}
    <motion.circle
      cx="100" cy="100" r="75" fill="url(#brightGlow)"
      animate={{ scale: [0.9, 1.18, 0.9], opacity: [0.3, 0.75, 0.3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 100px' }}
    />

    {/* Rotating Sunburst Ray Lines */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '100px 100px' }}
    >
      {/* 8 Sunburst Rays */}
      <line x1="100" y1="32" x2="100" y2="48" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="137" y1="63" x2="148" y2="52" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="152" y1="100" x2="168" y2="100" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="137" y1="137" x2="148" y2="148" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="100" y1="152" x2="100" y2="168" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="63" y1="137" x2="52" y2="148" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="48" y1="100" x2="32" y2="100" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="63" y1="63" x2="52" y2="52" stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" />
    </motion.g>

    {/* Gently Pulsing 3D Mint/Teal Glowing Sphere */}
    <motion.g
      animate={{ scale: [0.95, 1.06, 0.95] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 100px' }}
    >
      <circle cx="100" cy="100" r="42" fill="url(#brightOrbGrad)" />
      <circle cx="86" cy="84" r="7.5" fill="#FFFFFF" opacity="0.9" />
    </motion.g>
  </motion.svg>
)

export default function Stage5_4BrightSpotScreen() {
  const { setScreen, setProfileField, brightSpotCheck } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_5PriorityTension')
  }

  const handleChange = (e) => {
    setProfileField('brightSpotCheck', e.target.value)
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

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Vector Graphic */}
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
              QUALITATIVE REFLECTION
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
              Your Bright Spot
            </h1>
            <p style={{
              margin: '12px 0 0 0',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              What is currently your greatest source of resilience, calm, or strength? How does it protect you during difficult weeks?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '-10px' }}>
            <BrightSpotIllustration />
          </div>
        </div>

        {/* RIGHT — Textarea Container + Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '14px', marginTop: '4px' }}>

          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
              SHARE YOUR REFLECTION
            </span>
          </div>

          <textarea
            value={brightSpotCheck || ''}
            onChange={handleChange}
            placeholder="Write your thoughts here..."
            style={{
              width: '100%',
              height: '180px',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1.5px solid #d2e7e0',
              background: '#ffffff',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '14.5px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00ae9d'
              e.target.style.boxShadow = '0 0 0 3px rgba(0,174,157,0.12)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d2e7e0'
              e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'
            }}
          />

          <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Your reflection is saved to guide your personalized insights.
          </p>

          {/* Action button directly below */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '10px 40px' }}
            >
              {brightSpotCheck && brightSpotCheck.trim() ? 'Continue' : 'Skip'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}

