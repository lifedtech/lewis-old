import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── External Conditions Vector Illustration ── */
const ExternalConditionsIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '170px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="envAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#envAura)" />

    {/* House / Shelter Outline */}
    <path
      d="M 120,40 L 65,85 L 75,85 L 75,135 L 165,135 L 165,85 L 175,85 Z"
      stroke="#00AE9D" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(0,174,157,0.05)"
    />
    <rect x="105" y="100" width="30" height="35" rx="4" stroke="#00ae9d" strokeWidth="1.8" fill="none" />

    {/* Wind / Noise Stream Waves */}
    <motion.path
      d="M 40,65 Q 70,55 100,68 T 160,58"
      stroke="url(#envGrad)" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="6 4"
      animate={{ x: [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.path
      d="M 50,115 Q 85,125 120,110 T 190,120"
      stroke="#00ae9d" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6"
      animate={{ x: [5, -5, 5] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
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

export default function Stage7_1ExternalScreen() {
  const { setScreen, setProfileField, externalConditions } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_2Prior')
  }

  const conditions = [
    { key: 'noise', label: 'High Noise Pollution (traffic, construction, neighbors)' },
    { key: 'space', label: 'Cramped, dark, or cluttered living/work space' },
    { key: 'weather', label: 'Extreme weather/temperature stress (heat, cold)' },
    { key: 'commute', label: 'Long, chaotic, or exhausting daily commute' },
    { key: 'safety', label: 'Lack of neighborhood safety or personal privacy' },
    { key: 'none', label: 'None of the above - my surroundings are steady' }
  ]

  const handleToggle = (key) => {
    if (key === 'none') {
      setProfileField('externalConditions', { none: true })
      return
    }
    const currentVal = externalConditions?.[key] || false
    const newConditions = { ...externalConditions, none: false, [key]: !currentVal }
    setProfileField('externalConditions', newConditions)
  }

  const isActive = (key) => externalConditions?.[key] || false
  const selectedCount = Object.values(externalConditions || {}).filter(Boolean).length

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
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
            }}>
              SELECT ALL THAT APPLY
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
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>External</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Conditions</span>
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
              Select any environmental factors in your physical surroundings that actively contribute to your stress load.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <ExternalConditionsIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Card Container */}
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
              gap: '10px',
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                ENVIRONMENTAL CONTEXT
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                {selectedCount} SELECTED
              </span>
            </div>

            {/* 6 Checkbox Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              {conditions.map(c => {
                const active = isActive(c.key)
                return (
                  <button
                    key={c.key}
                    onClick={() => handleToggle(c.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                      background: active ? '#e4f4ee' : '#f2f9f6',
                      color: active ? '#414242' : '#3a3a3a',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
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
                      transition: 'all 0.18s ease',
                    }}>
                      {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                    </div>

                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: active ? 700 : 500,
                      fontSize: '13px',
                      color: active ? '#414242' : '#414242',
                      lineHeight: 1.35,
                      textAlign: 'left',
                    }}>
                      {c.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#414242', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              Select all that apply to your current living or work environment.
            </p>
          </div>

          {/* Action Button directly below card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '14px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={selectedCount === 0}
              style={{
                padding: '9px 36px',
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

