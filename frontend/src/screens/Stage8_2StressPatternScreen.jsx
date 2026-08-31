import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Stress-Pattern Clusters Vector Illustration with Motion ── */
const StressPatternClustersIllustration = () => (
  <motion.svg className="stage-illustration"
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
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
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
    <circle cx="125" cy="95" r="5" fill="#00ae9d" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="165" cy="95" r="5" fill="#00ae9d" stroke="#FFF" strokeWidth="1.5" />

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
              color: 'var(--dawn, #00ae9d)',
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
              color: 'var(--text-main, #414242)',
            }}>
              Stress-Pattern Clusters
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
              Select any that feel true for you lately. Choose all that apply.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <StressPatternClustersIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '10px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {options.map(opt => {
              const active = isSelected(opt.title)
              return (
                <motion.button
                  key={opt.title}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleArrayItem('stressPatternClusters', opt.title)}
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
                  {/* Selection Circle Indicator with Checkmark */}
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
                    {active && <span style={{ color: 'var(--action-text, #ffffff)', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: selectedCount ? 700 : 600,
                      fontSize: '14.5px',
                      color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      marginBottom: '3px',
                      textAlign: 'left',
                      lineHeight: 1.3,
                    }}>
                      {opt.title}
                    </span>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 400,
                      fontSize: '12.5px',
                      color: active ? 'var(--dawn, #0a5d50)' : 'var(--text-sub, #64748b)',
                      lineHeight: 1.45,
                      textAlign: 'left',
                    }}>
                      {opt.desc}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Select all that feel true for you lately.
          </p>

          {/* Action button directly below */}
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
