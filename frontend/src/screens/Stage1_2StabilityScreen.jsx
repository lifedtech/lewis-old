import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const LABELS = [
  { max: 15,  text: 'Very turbulent',   emoji: '🌊', color: '#e05c5c' },
  { max: 30,  text: 'Quite turbulent',  emoji: '⛈️',  color: '#e07a3a' },
  { max: 45,  text: 'A bit unsettled',  emoji: '🌦️',  color: '#d4a017' },
  { max: 55,  text: 'In between',       emoji: '🌤️',  color: '#8fad52' },
  { max: 70,  text: 'Mostly stable',    emoji: '☀️',  color: '#3aad8e' },
  { max: 85,  text: 'Quite steady',     emoji: '🌿',  color: '#1a9e7a' },
  { max: 101, text: 'Very steady',      emoji: '⚓',  color: '#00ae9d' },
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
              <span style={{ fontSize: '20px' }}>{label.emoji}</span>
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

          {/* Custom Slider Track */}
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={e => setProfileField('lifeStability', Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#00ae9d',
                cursor: 'pointer',
                height: '8px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', fontWeight: 700, color: '#414242', fontFamily: '"IBM Plex Mono", monospace' }}>
              <span>TURBULENT</span>
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

