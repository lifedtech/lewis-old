import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const LABELS = [
  { max: 15, text: 'Very turbulent', color: '#e05c5c' },
  { max: 30, text: 'Quite turbulent', color: '#e07a3a' },
  { max: 45, text: 'A bit unsettled', color: '#d4a017' },
  { max: 55, text: 'In between', color: '#8fad52' },
  { max: 70, text: 'Mostly stable', color: '#3aad8e' },
  { max: 85, text: 'Quite steady', color: '#1a9e7a' },
  { max: 101, text: 'Very steady', color: '#00ae9d' },
]

function getLabel(v) {
  return LABELS.find(l => v < l.max) || LABELS[LABELS.length - 1]
}

export default function Stage1_2StabilityScreen() {
  const { setScreen, setProfileField, lifeStability } = useLewisStore()
  const value = lifeStability ?? 50
  const label = getLabel(value)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* TOP — Eyebrow + Title + Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
            }}>
              CHOOSE ONE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
            }}>
              Life Stability Spectrum
            </h1>
            <p style={{
              margin: '10px 0 0 0',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '520px',
            }}>
              Where does your life feel right now? Slide to indicate your baseline stability.
            </p>
          </div>
        </div>

        {/* MIDDLE — Stability Slider (No background container) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          margin: '24px 0',
          width: '100%',
        }}>
          {/* Dynamic Label Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={label.text}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                border: `1.5px solid ${label.color}`,
                borderRadius: '24px',
                padding: '8px 24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <span style={{
                fontSize: '15px',
                fontWeight: 700,
                color: label.color,
                fontFamily: "'Nunito', sans-serif",
              }}>
                {label.text}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Classy Luxury Slider Component */}
          <div style={{ width: '100%', maxWidth: '520px', position: 'relative', padding: '12px 0 6px' }}>
            {/* Dynamic Floating Value Pill */}
            <div style={{
              position: 'relative',
              width: '100%',
              marginBottom: '16px',
              height: '32px'
            }}>
              <div style={{
                position: 'absolute',
                left: `${value}%`,
                transform: 'translateX(-50%)',
                background: '#414242',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                fontFamily: '"IBM Plex Mono", monospace',
                padding: '4px 14px',
                borderRadius: '999px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                whiteSpace: 'nowrap',
                transition: 'left 0.1s ease-out',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: label.color, display: 'inline-block' }} />
                {value}%
              </div>
            </div>

            {/* Custom Styled Range Input */}
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={e => setProfileField('lifeStability', Number(e.target.value))}
              className="classy-range-input"
              style={{
                background: `linear-gradient(90deg, ${label.color} 0%, ${label.color} ${value}%, #e2ece8 ${value}%, #e2ece8 100%)`
              }}
            />

            {/* Milestone Tick Dots */}
            <div style={{
              position: 'absolute',
              top: '61px',
              left: '14px',
              right: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none'
            }}>
              {[0, 25, 50, 75, 100].map((step) => (
                <div
                  key={step}
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: value >= step ? '#ffffff' : 'rgba(65, 66, 66, 0.25)',
                    boxShadow: '0 0 2px rgba(0,0,0,0.2)'
                  }}
                />
              ))}
            </div>

            {/* End & Mid Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '11.5px', fontWeight: 800, color: '#414242', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.08em' }}>
              <span>TURBULENT</span>
              <span style={{ opacity: 0.45 }}>BALANCED</span>
              <span>STEADY</span>
            </div>
          </div>
        </div>

        {/* BOTTOM — Pinned Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '12px', flexShrink: 0 }}>
          <button className="btn-primary" onClick={() => setScreen('stage1_3Pressures')} style={{ padding: '10px 36px' }}>
            Continue
          </button>
        </div>

      </div>
    </motion.div>
  )
}

