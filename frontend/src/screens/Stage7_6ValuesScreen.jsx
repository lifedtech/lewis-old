import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Core Values Vector Illustration ── */
const CoreValuesIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="valuesAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="valuesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#valuesAura)" />

    {/* Compass Diamond Star Core Values Line Art */}
    <polygon points="120,40 135,80 175,95 135,110 120,150 105,110 65,95 105,80" fill="rgba(0,174,157,0.06)" stroke="url(#valuesGrad)" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="120" cy="95" r="7" fill="#00ae9d" stroke="#FFF" strokeWidth="1.8" />

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

export default function Stage7_6ValuesScreen() {
  const { setScreen, toggleArrayItem, valuesCheck } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_7FinancialAsp')
  }

  const values = [
    'Freedom & Autonomy',
    'Connection & Community',
    'Stability & Security',
    'Growth & Learning',
    'Health & Vitality',
    'Contribution & Impact',
    'Creativity & Flow',
    'Mindfulness & Peace'
  ]

  const isSelected = (val) => (valuesCheck || []).includes(val)
  const selectedCount = (valuesCheck || []).length

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

        {/* LEFT — Eyebrow + Title + Subtitle + Vector Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
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
              textWrap: 'balance',
            }}>
              Core<br />Values
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Select the values that are most essential to how you define a well-lived, healthy life.
            </p>
          </div>
          <CoreValuesIllustration />
        </div>

        {/* RIGHT — ACTION & SUPPORT Eyebrow + 8 Multi-select Checkbox Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 10px 0',
          }}>
            ACTION & SUPPORT
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {values.map(val => {
              const active = isSelected(val)
              return (
                <button
                  key={val}
                  onClick={() => toggleArrayItem('valuesCheck', val)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #f4f4f4',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#414242' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Selection Indicator Circle with Checkmark */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: active ? '#00ae9d' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: active ? 700 : 500,
                    fontSize: '14px',
                    color: active ? '#414242' : '#414242',
                    lineHeight: 1.4,
                  }}>
                    {val}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '12px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={selectedCount === 0}
              style={{
                padding: '12px 38px',
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
