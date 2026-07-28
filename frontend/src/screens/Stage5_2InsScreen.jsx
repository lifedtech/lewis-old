import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

const LEVEL_DESCRIPTIONS = [
  'Separate',
  'Touching',
  'Connected',
  'Intertwined',
  'Integrated',
  'Merged',
  'Unified',
]

// Two overlapping circles whose distance encodes the felt Self–Nature overlap.
// idx 0 → fully separate, idx 6 → fully merged.
const renderOverlapCircles = (idx, selected) => {
  const distance = 54 - (idx * (54 / 6))
  const cxSelf = 60 - distance / 2
  const cxNature = 60 + distance / 2

  const selfY = distance < 15 ? 13 : 15
  const natureY = distance < 15 ? 65 : 63

  return (
    <svg width="100%" viewBox="0 0 120 74" style={{ overflow: 'visible', maxWidth: '84px', height: 'auto' }}>
      <defs>
        <radialGradient id={`gradSelf-${idx}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FF7E67" stopOpacity={selected ? '0.6' : '0.35'} />
          <stop offset="100%" stopColor="#FF4B4B" stopOpacity={selected ? '0.45' : '0.2'} />
        </radialGradient>
        <radialGradient id={`gradNature-${idx}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity={selected ? '0.6' : '0.35'} />
          <stop offset="100%" stopColor="#00ae9d" stopOpacity={selected ? '0.45' : '0.2'} />
        </radialGradient>
      </defs>

      {/* Self Circle */}
      <circle
        cx={cxSelf}
        cy="37"
        r="21"
        fill={`url(#gradSelf-${idx})`}
        stroke={selected ? '#FF4B4B' : 'rgba(255, 75, 75, 0.45)'}
        strokeWidth={selected ? '2' : '1.2'}
        style={{ transition: 'all 0.3s ease' }}
      />

      {/* Nature Circle */}
      <circle
        cx={cxNature}
        cy="37"
        r="21"
        fill={`url(#gradNature-${idx})`}
        stroke={selected ? '#00ae9d' : 'rgba(16, 185, 129, 0.45)'}
        strokeWidth={selected ? '2' : '1.2'}
        style={{ transition: 'all 0.3s ease' }}
      />

      {/* Labels at top & bottom to avoid overlap at any distance */}
      <text
        x={cxSelf}
        y={selfY}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={selected ? '#E11D48' : '#F43F5E'}
        style={{ pointerEvents: 'none', letterSpacing: '0.04em' }}
      >
        Self
      </text>
      <text
        x={cxNature}
        y={natureY}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={selected ? '#047857' : '#00ae9d'}
        style={{ pointerEvents: 'none', letterSpacing: '0.04em' }}
      >
        Nature
      </text>
    </svg>
  )
}

export default function Stage5_2InsScreen() {
  const { setScreen, setProfileField, ins } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_2Swls')
  }

  const answered = ins !== null && ins !== undefined

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

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Topic Line Art */}
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
              INCLUSION OF NATURE (INS)
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
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Connection to</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Nature</span>
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
              Select the diagram that best reflects how interconnected you feel with the natural world.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <TopicLineIllustration topic="ins" />
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
              padding: '16px 20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Progress Header Row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                  SELECT YOUR LEVEL · 1 OF 1
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                  {answered ? '100%' : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: '#00ae9d' }}
                  animate={{ width: answered ? '100%' : '0%' }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Question Statement */}
            <p style={{ margin: '2px 0 0 0', fontSize: '14.5px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
              "How connected do you feel with the natural world?"
            </p>

            {/* 7 Overlap-Diagram Options */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', justifyContent: 'center' }}>
              {Array.from({ length: 7 }).map((_, idx) => {
                const val = idx + 1
                const selected = ins === val
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setProfileField('ins', val)}
                    style={{
                      flex: '0 0 calc(25% - 6px)',
                      minWidth: 0,
                      padding: '10px 6px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      background: selected ? '#e4f4ee' : '#f2f9f6',
                      borderRadius: '14px',
                      border: `1.5px solid ${selected ? '#00ae9d' : '#d2e7e0'}`,
                      boxShadow: selected ? '0 2px 8px rgba(0,174,157,0.14)' : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {renderOverlapCircles(idx, selected)}

                    <span style={{
                      fontSize: '12px',
                      fontWeight: selected ? 700 : 600,
                      color: selected ? '#414242' : '#414242',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1,
                    }}>
                      Level {val}
                    </span>

                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: selected ? '#00ae9d' : '#414242',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.1,
                      textAlign: 'center',
                    }}>
                      {LEVEL_DESCRIPTIONS[idx]}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#414242', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              Pick the pair of circles that matches how intertwined you feel with nature.
            </p>
          </div>

          {/* Action Button directly below card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '12px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!answered}
              style={{
                padding: '9px 36px',
                opacity: answered ? 1 : 0.5,
                cursor: answered ? 'pointer' : 'not-allowed',
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
