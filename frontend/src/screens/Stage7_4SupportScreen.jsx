import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Support Preferences Vector Illustration (Guiding Lighthouse Beacon) ── */
const SupportPreferencesIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="beaconAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.28" />
        <stop offset="60%" stopColor="#00ae9d" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="lightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#5fbb46" stopOpacity="0.55" />
        <stop offset="40%" stopColor="#00ae9d" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#00ae9d" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f0fdf9" />
        <stop offset="100%" stopColor="#e6f7f2" />
      </linearGradient>
    </defs>

    {/* Background Soft Breathing Glow */}
    <motion.circle
      cx="120" cy="75" r="75"
      fill="url(#beaconAura)"
      animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 75px' }}
    />

    {/* Dynamic Sweeping Light Beams (Rotating across the night sky) */}
    <motion.g
      animate={{ rotate: [-32, 32, -32] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 52px' }}
    >
      {/* Right Primary Sweeping Beam */}
      <path
        d="M 120,52 L 238,12 L 234,92 Z"
        fill="url(#lightBeam)"
      />
      {/* Left Opposing Beam */}
      <path
        d="M 120,52 L 2,92 L 6,12 Z"
        fill="url(#lightBeam)"
        opacity="0.45"
      />
    </motion.g>

    {/* Lighthouse Tower Architecture */}
    <g>
      {/* Lantern Roof Dome */}
      <path
        d="M 108,46 C 108,35 132,35 132,46 Z"
        fill="#e4f4ee"
        stroke="#00AE9D"
        strokeWidth="2"
      />
      {/* Lantern Gallery & Balcony */}
      <rect x="110" y="46" width="20" height="12" rx="2" fill="#ffffff" stroke="#00ae9d" strokeWidth="1.8" />
      <line x1="104" y1="58" x2="136" y2="58" stroke="#00ae9d" strokeWidth="2.2" strokeLinecap="round" />

      {/* Main Tapered Tower Body */}
      <path
        d="M 112,58 L 104,142 L 136,142 L 128,58 Z"
        fill="url(#towerGrad)"
        stroke="#00AE9D"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Tower Stripes */}
      <path d="M 110,84 L 130,84" stroke="#00ae9d" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 107,112 L 133,112" stroke="#5fbb46" strokeWidth="1.8" strokeLinecap="round" />

      {/* Tower Windows */}
      <circle cx="120" cy="72" r="2.5" fill="#00ae9d" />
      <circle cx="120" cy="98" r="2.5" fill="#00ae9d" />
      <rect x="117" y="124" width="6" height="12" rx="3" fill="#00ae9d" />
    </g>

    {/* Pulsing Beacon Lantern Core & Rotating Spark */}
    <motion.g
      animate={{ scale: [1, 1.35, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 52px' }}
    >
      <circle cx="120" cy="52" r="10" fill="rgba(95, 187, 70, 0.35)" />
      <circle cx="120" cy="52" r="5" fill="#5fbb46" />
      <circle cx="120" cy="52" r="2" fill="#ffffff" />
    </motion.g>

    {/* Guiding Sparkles in the Night Air */}
    <motion.circle
      cx="205" cy="40" r="3.2"
      fill="#5fbb46"
      animate={{ y: [-4, 4, -4], opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="35" cy="48" r="2.8"
      fill="#00ae9d"
      animate={{ y: [4, -4, 4], opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    />
    <motion.circle
      cx="185" cy="90" r="2.2"
      fill="#34d399"
      animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1.2, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    />

    {/* Animated Living Ocean Waves */}
    <motion.path
      stroke="#00AE9D"
      strokeWidth="2.8"
      strokeLinecap="round"
      fill="none"
      animate={{
        d: [
          "M 28,152 Q 85,142 120,148 T 212,146",
          "M 28,149 Q 85,155 120,145 T 212,150",
          "M 28,152 Q 85,142 120,148 T 212,146"
        ]
      }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.path
      stroke="#d6edea"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
      animate={{
        d: [
          "M 38,165 Q 95,156 130,162 T 202,160",
          "M 38,162 Q 95,168 130,158 T 202,164",
          "M 38,165 Q 95,156 130,162 T 202,160"
        ]
      }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </motion.svg>
)

export default function Stage7_4SupportScreen() {
  const { setScreen, toggleArrayItem, supportPreferences } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_5Planner')
  }

  const options = [
    { id: 'coaching', label: 'Coaching & Professional guidance' },
    { id: 'selfGuided', label: 'Self-guided tools & Digital trackers' },
    { id: 'community', label: 'Community & Peer groups' },
    { id: 'therapy', label: 'Clinical support or Therapy' }
  ]

  const isSelected = (id) => (supportPreferences || []).includes(id)
  const selectedCount = (supportPreferences || []).length

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
              SELECT ALL THAT APPLY
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
              Support Preferences
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
              What kind of support is most helpful to you when adopting new health behaviors or stress management habits?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <SupportPreferencesIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '10px' }}>

          {/* 4 Stacked Checkbox Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {options.map(opt => {
              const active = isSelected(opt.id)
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleArrayItem('supportPreferences', opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: active ? '#e4f4ee' : '#ffffff',
                    color: active ? '#414242' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                    boxShadow: active ? '0 3px 10px rgba(0,174,157,0.16)' : '0 1px 4px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    outline: 'none',
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
                    transition: 'all 0.18s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: active ? 700 : 500,
                    fontSize: '14px',
                    color: active ? '#414242' : '#414242',
                    lineHeight: 1.4,
                    textAlign: 'left',
                  }}>
                    {opt.label}
                  </span>
                </motion.button>
              )
            })}
          </div>

          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Select all types of support you would find helpful.
          </p>

          {/* Action Button directly below */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={selectedCount === 0}
              style={{
                padding: '10px 40px',
                opacity: selectedCount > 0 ? 1 : 0.5,
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
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

