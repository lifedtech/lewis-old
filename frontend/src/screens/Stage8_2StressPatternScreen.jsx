import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Stress-Pattern Clusters Vector Illustration with Motion ── */
const StressPatternClustersIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="patternAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="patternGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#patternAura)" />

    {/* Dynamic Stress Pattern Wave Frequency Line */}
    <motion.path
      d="M 45,95 Q 65,55 85,95 T 125,95 T 165,95 T 195,95"
      stroke="url(#patternGrad)" strokeWidth="2.8" strokeLinecap="round" fill="none"
      animate={{ d: [
        "M 45,95 Q 65,55 85,95 T 125,95 T 165,95 T 195,95",
        "M 45,95 Q 65,125 85,95 T 125,65 T 165,115 T 195,95",
        "M 45,95 Q 65,55 85,95 T 125,95 T 165,95 T 195,95"
      ] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Wave Cluster Nodes */}
    <circle cx="65" cy="75" r="5" fill="#FF9466" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="125" cy="95" r="5" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="165" cy="95" r="5" fill="#36D1DC" stroke="#FFF" strokeWidth="1.5" />

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

export default function Stage8_2StressPatternScreen() {
  const { setScreen, toggleArrayItem, stressPatternClusters } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_3Recovery')
  }

  const options = [
    { title: 'The Surge', desc: 'High intensity spikes of tension or panic when demands pile up.' },
    { title: 'The Flatline', desc: 'Feeling numb, unmotivated, or emotionless under chronic pressure.' },
    { title: 'The Fog', desc: 'Mental cloudiness, decision fatigue, or difficulty concentrating.' },
    { title: 'The Cycle', desc: 'Repeated loops of worry, overthinking, or late-night racing thoughts.' }
  ]

  const currentClusters = stressPatternClusters || []
  const isSelected = (title) => currentClusters.includes(title)
  const selectedCount = currentClusters.length

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
              color: '#16302b',
              textWrap: 'balance',
            }}>
              Stress-Pattern<br />Clusters
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Select any that feel true for you lately. Choose all that apply.
            </p>
          </div>
          <StressPatternClustersIllustration />
        </div>

        {/* RIGHT — STRESS PATTERNS Eyebrow + 4 Multi-select Checkbox Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 12px 0',
          }}>
            STRESS PATTERNS
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {options.map(opt => {
              const active = isSelected(opt.title)
              return (
                <button
                  key={opt.title}
                  onClick={() => toggleArrayItem('stressPatternClusters', opt.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '16px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #e2e8e5',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#044e43' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 4px 14px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Selection Circle Indicator with Checkmark */}
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
                    marginTop: '2px',
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '15.5px',
                      color: active ? '#044e43' : '#16302b',
                      marginBottom: '3px',
                    }}>
                      {opt.title}
                    </span>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: active ? '#1b4d43' : '#4a6b62',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.45,
                    }}>
                      {opt.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '16px', flexShrink: 0 }}>
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
