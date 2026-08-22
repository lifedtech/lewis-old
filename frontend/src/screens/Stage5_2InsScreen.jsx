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
  const r = 18
  const maxDistance = 42
  const distance = maxDistance - idx * (maxDistance / 6)
  const cxSelf = 50 - distance / 2
  const cxNature = 50 + distance / 2
  const cy = 26

  return (
    <svg
      width="100%"
      viewBox="0 0 100 52"
      style={{ overflow: 'visible', maxWidth: '78px', height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        <radialGradient id={`gradSelf-${idx}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFA494" stopOpacity={selected ? '0.85' : '0.55'} />
          <stop offset="100%" stopColor="#FF6363" stopOpacity={selected ? '0.7' : '0.4'} />
        </radialGradient>
        <radialGradient id={`gradNature-${idx}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity={selected ? '0.85' : '0.55'} />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity={selected ? '0.7' : '0.4'} />
        </radialGradient>
      </defs>

      {/* Self Circle */}
      <circle
        cx={cxSelf}
        cy={cy}
        r={r}
        fill={`url(#gradSelf-${idx})`}
        stroke={selected ? '#E11D48' : '#F43F5E'}
        strokeWidth={selected ? '1.8' : '1.2'}
        style={{ mixBlendMode: 'multiply', transition: 'all 0.25s ease' }}
      />

      {/* Nature Circle */}
      <circle
        cx={cxNature}
        cy={cy}
        r={r}
        fill={`url(#gradNature-${idx})`}
        stroke={selected ? '#0D9488' : '#14B8A6'}
        strokeWidth={selected ? '1.8' : '1.2'}
        style={{ mixBlendMode: 'multiply', transition: 'all 0.25s ease' }}
      />

      {/* Labels positioned cleanly inside circles */}
      {idx < 5 ? (
        <>
          <text
            x={cxSelf - (idx >= 2 ? 3 : 0)}
            y={cy}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="700"
            fontFamily="'Nunito', sans-serif"
            fill={selected ? '#9F1239' : '#BE123C'}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Self
          </text>
          <text
            x={cxNature + (idx >= 2 ? 3 : 0)}
            y={cy}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fontFamily="'Nunito', sans-serif"
            fill={selected ? '#065F46' : '#0D9488'}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Nature
          </text>
        </>
      ) : (
        <>
          <text
            x="50"
            y={cy - 7}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="700"
            fontFamily="'Nunito', sans-serif"
            fill={selected ? '#9F1239' : '#BE123C'}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Self
          </text>
          <text
            x="50"
            y={cy + 7}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fontFamily="'Nunito', sans-serif"
            fill={selected ? '#065F46' : '#0D9488'}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Nature
          </text>
        </>
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
              fontFamily: '"Nunito", sans-serif',
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
              fontSize: 'clamp(26px, 3.2vw, 38px)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
              whiteSpace: 'nowrap',
            }}>
              Connection to Nature
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
