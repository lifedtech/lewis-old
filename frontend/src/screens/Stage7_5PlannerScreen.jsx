import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Readiness for Action Vector Illustration ── */
const ReadinessActionIllustration = () => (
  <motion.svg
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
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
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
      stroke="#99E2D8" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage7_5PlannerScreen() {
  const { setScreen, setProfileField, plannerReadiness } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_6Values')
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
              ACTION READINESS
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#16302b',
              textAlign: 'left',
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Readiness for</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Action</span>
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              How prepared do you feel to integrate small wellness habits or changes into your calendar starting this week?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <ReadinessActionIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Card Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #e2e8e5',
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
                ACTION READINESS
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                {plannerReadiness ? 'SELECTED' : 'CHOOSE ONE'}
              </span>
            </div>

            {/* 3 Stacked Option Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {options.map(opt => {
                const selected = plannerReadiness === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setProfileField('plannerReadiness', opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '14px',
                      border: selected ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                      background: selected ? '#e4f4ee' : '#f2f9f6',
                      color: selected ? '#044e43' : '#3a3a3a',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: selected ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                      boxSizing: 'border-box',
                      textAlign: 'left',
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
                        color: selected ? '#044e43' : '#16302b',
                        marginBottom: '2px',
                        textAlign: 'left',
                      }}>
                        {opt.label}
                      </span>
                      <p style={{
                        margin: 0,
                        fontSize: '12.5px',
                        color: selected ? '#1b4d43' : '#4a6b62',
                        fontFamily: "'Nunito', sans-serif",
                        lineHeight: 1.4,
                        textAlign: 'left',
                      }}>
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#8fa099', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              Select the statement that best reflects your current mindset.
            </p>
          </div>

          {/* Action Button directly below card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '14px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!plannerReadiness}
              style={{
                padding: '9px 36px',
                opacity: plannerReadiness ? 1 : 0.5,
                cursor: plannerReadiness ? 'pointer' : 'not-allowed',
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

