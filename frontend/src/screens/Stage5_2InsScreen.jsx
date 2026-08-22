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
// idx 0 → fully separate, idx 6 → fully merged/unified.
const renderOverlapCircles = (idx, selected) => {
  const r = 16.5
  // Distances: 0: separate (38), 1: touching (33), 2: connected (24), 3: intertwined (16), 4: integrated (9), 5: merged (4), 6: unified (0)
  const distances = [38, 33, 24, 16, 9, 4, 0]
  const distance = distances[idx]
  const cxSelf = 54 - distance / 2
  const cxNature = 54 + distance / 2
  const cy = 26

  return (
    <svg
      width="100%"
      viewBox="0 0 108 52"
      style={{ overflow: 'visible', maxWidth: '84px', height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        {/* Self Gradient — Warm Rose/Coral */}
        <linearGradient id={`gradSelf-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" stopOpacity={selected ? '0.9' : '0.75'} />
          <stop offset="100%" stopColor="#F43F5E" stopOpacity={selected ? '0.85' : '0.65'} />
        </linearGradient>

        {/* Nature Gradient — Fresh Teal/Emerald */}
        <linearGradient id={`gradNature-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity={selected ? '0.9' : '0.75'} />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity={selected ? '0.85' : '0.65'} />
        </linearGradient>

        {/* Unified Gradient for Level 7 */}
        <linearGradient id={`gradUnified-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#A7F3D0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity="0.85" />
        </linearGradient>

        {/* Soft Drop Shadow */}
        <filter id={`shadow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor={selected ? 'rgba(0,174,157,0.25)' : 'rgba(0,0,0,0.06)'} />
        </filter>
      </defs>

      {idx === 6 ? (
        // Level 7: Harmonious Unified Concentric Sphere
        <g filter={`url(#shadow-${idx})`}>
          {/* Outer Ambient Ring */}
          <circle
            cx={54}
            cy={cy}
            r={r + 3}
            fill="none"
            stroke="#00AE9D"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            opacity={selected ? 0.9 : 0.6}
          />
          {/* Unified Sphere */}
          <circle
            cx={54}
            cy={cy}
            r={r}
            fill={`url(#gradUnified-${idx})`}
            stroke={selected ? '#00AE9D' : '#0D9488'}
            strokeWidth={selected ? '2' : '1.5'}
          />
          {/* Central Harmonious Badge */}
          <text
            x={54}
            y={cy - 3}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="800"
            fontFamily="'Nunito', sans-serif"
            fill="#881337"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Self
          </text>
          <text
            x={54}
            y={cy + 4.5}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="6"
            fontWeight="800"
            fontFamily="'Nunito', sans-serif"
            fill="#064E3B"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Nature
          </text>
        </g>
      ) : (
        <g filter={`url(#shadow-${idx})`}>
          {/* Self Circle (Left) */}
          <circle
            cx={cxSelf}
            cy={cy}
            r={r}
            fill={`url(#gradSelf-${idx})`}
            stroke={selected ? '#BE123C' : '#E11D48'}
            strokeWidth={selected ? '1.8' : '1.3'}
            style={{ transition: 'all 0.25s ease' }}
          />

          {/* Nature Circle (Right) */}
          <circle
            cx={cxNature}
            cy={cy}
            r={r}
            fill={`url(#gradNature-${idx})`}
            stroke={selected ? '#008375' : '#0D9488'}
            strokeWidth={selected ? '1.8' : '1.3'}
            style={{ transition: 'all 0.25s ease' }}
          />

          {/* Clean Legible Text Overlays */}
          {idx < 4 ? (
            <>
              <text
                x={cxSelf - (idx >= 2 ? 3.5 : 0)}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="7"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#881337"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Self
              </text>
              <text
                x={cxNature + (idx >= 2 ? 3.5 : 0)}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6.8"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#064E3B"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Nature
              </text>
            </>
          ) : idx === 4 ? (
            <>
              <text
                x={cxSelf - 5.5}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6.2"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#881337"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Self
              </text>
              <text
                x={cxNature + 5.5}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#064E3B"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Nature
              </text>
            </>
          ) : (
            // idx === 5 (Merged)
            <>
              <text
                x={54}
                y={cy - 3.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6.2"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#881337"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Self
              </text>
              <text
                x={54}
                y={cy + 4.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#064E3B"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Nature
              </text>
            </>
          )}
        </g>
      )}
    </svg>
  )
}

export default function Stage5_2InsScreen() {
  const { setScreen, setProfileField, ins } = useLewisStore()

  const handleSelect = (val) => {
    setProfileField('ins', val)
    setTimeout(() => {
      setScreen('stage5_2Swls')
    }, 220)
  }

  const answered = ins !== null && ins !== undefined

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

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Topic Line Art */}
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
              INCLUSION OF NATURE (INS)
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
              Connection to Nature
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
              Select the diagram that best reflects how interconnected you feel with the natural world.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <TopicLineIllustration topic="ins" />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          gap: '14px',
          padding: 0,
        }}>
          {/* Progress Header Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
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
          <p style={{ margin: '2px 0 0 0', fontSize: 'clamp(14px, 1.6vw, 16px)', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
            "How connected do you feel with the natural world?"
          </p>

          {/* 7 Overlap-Diagram Options in 2-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            {Array.from({ length: 7 }).map((_, idx) => {
              const val = idx + 1
              const selected = ins === val
              const isLast = idx === 6
              return (
                <motion.button
                  key={idx}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(val)}
                  style={{
                    gridColumn: isLast ? '1 / -1' : 'auto',
                    minWidth: 0,
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: isLast ? 'center' : 'flex-start',
                    gap: '12px',
                    background: selected ? '#e4f4ee' : '#ffffff',
                    borderRadius: '14px',
                    border: `1.5px solid ${selected ? '#00ae9d' : '#d2e7e0'}`,
                    boxShadow: selected ? '0 3px 12px rgba(0,174,157,0.18)' : '0 1px 4px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ width: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderOverlapCircles(idx, selected)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                    <span style={{
                      fontSize: '12.5px',
                      fontWeight: selected ? 700 : 600,
                      color: selected ? '#00ae9d' : '#414242',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.2,
                    }}>
                      Level {val}
                    </span>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: selected ? '#00ae9d' : '#64748b',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.2,
                    }}>
                      {LEVEL_DESCRIPTIONS[idx]}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Pick the pair of circles that matches how intertwined you feel with nature.
          </p>
        </div>

      </div>
    </motion.div>
  )
}
