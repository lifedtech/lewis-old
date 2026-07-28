import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Sprouting Plant Star Blossom Vector Illustration with Motion ── */
const AspirationPlantIllustration = () => (
  <motion.svg
    viewBox="0 0 200 180"
    fill="none"
    style={{ width: '100%', maxWidth: '160px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="100" cy="42" r="35" fill="url(#starGlow)" />

    {/* Ground Base Line */}
    <line x1="60" y1="150" x2="140" y2="150" stroke="#D1E3DF" strokeWidth="2.5" strokeLinecap="round" />

    {/* Animated Swaying Stem & Leaves */}
    <motion.g
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 150px' }}
    >
      {/* Vertical Green Plant Stem */}
      <line x1="100" y1="150" x2="100" y2="60" stroke="#5bbb46" strokeWidth="3.8" strokeLinecap="round" />

      {/* Left Mint Leaf */}
      <path
        d="M 100,110 C 70,95 65,120 90,132 C 98,135 100,122 100,110 Z"
        fill="#DDF3D5"
        stroke="#5bbb46"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Right Mint Leaf */}
      <path
        d="M 100,90 C 130,75 135,100 110,112 C 102,115 100,102 100,90 Z"
        fill="#DDF3D5"
        stroke="#5bbb46"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </motion.g>

    {/* Top 4-Point Teal Star Blossom with Radiant Motion */}
    <motion.path
      d="M 100,20 Q 100,42 122,42 Q 100,42 100,64 Q 100,42 78,42 Q 100,42 100,20 Z"
      fill="#00AE9D"
      stroke="#00ae9d"
      strokeWidth="1.5"
      animate={{ scale: [0.92, 1.12, 0.92], rotate: [0, 90, 180, 270, 360] }}
      transition={{
        scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 16, repeat: Infinity, ease: 'linear' }
      }}
      style={{ transformOrigin: '100px 42px' }}
    />
  </motion.svg>
)

export default function Stage7_3AspirationScreen() {
  const { setScreen, setProfileField, aspirationLandscape } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_4Support')
  }

  const handleChange = (e) => {
    setProfileField('aspirationLandscape', e.target.value)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{
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
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
            }}>
              QUALITATIVE REFLECTION
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Wellbeing</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Aspirations</span>
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              What is your primary hope, vision, or goal for your well-being over the next three months?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <AspirationPlantIllustration />
          </div>
        </div>

        {/* RIGHT — Textarea Card Container + Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #f4f4f4',
              borderRadius: '20px',
              padding: '18px 22px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                SHARE YOUR REFLECTION
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                OPTIONAL
              </span>
            </div>

            <textarea
              value={aspirationLandscape || ''}
              onChange={handleChange}
              placeholder="Type your well-being goals and dreams..."
              style={{
                width: '100%',
                height: '180px',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid #d2e7e0',
                background: '#f2f9f6',
                color: '#414242',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '14.5px',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00ae9d'
                e.target.style.background = '#ffffff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d2e7e0'
                e.target.style.background = '#f2f9f6'
              }}
            />

            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#414242', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              Your reflection is saved to guide your personalized insights.
            </p>
          </div>

          {/* Action button directly below card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '14px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '10px 40px' }}
            >
              {aspirationLandscape && aspirationLandscape.trim() ? 'Continue' : 'Skip'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}

