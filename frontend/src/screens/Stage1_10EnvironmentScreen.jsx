import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Environmental line illustration ── */
const EnvironmentIllustration = () => (
  <motion.svg
    viewBox="0 0 240 200"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="envAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#00ae9d" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Soft Aura */}
    <circle cx="120" cy="100" r="80" fill="url(#envAura)" />
    <circle cx="120" cy="100" r="72" stroke="#00ae9d" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.25" />

    {/* Gentle Hills / Landscape Waves */}
    <motion.path
      d="M 30,140 Q 80,105 130,135 T 210,125"
      stroke="#00ae9d"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
    <motion.path
      d="M 45,155 Q 100,125 160,150 T 205,145"
      stroke="#00AE9D"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      fill="none"
      opacity="0.6"
    />

    {/* Leaf / Sprout Icon */}
    <motion.path
      d="M 120,135 C 120,95 155,85 155,85 C 155,85 145,120 120,135 Z"
      fill="rgba(16, 185, 129, 0.2)"
      stroke="#00ae9d"
      strokeWidth="2"
      strokeLinejoin="round"
      initial={{ scale: 0, originX: '120px', originY: '135px' }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    />
    <motion.path
      d="M 120,135 C 120,105 95,98 95,98 C 95,98 102,125 120,135 Z"
      fill="rgba(0, 174, 157, 0.15)"
      stroke="#00AE9D"
      strokeWidth="1.8"
      strokeLinejoin="round"
      initial={{ scale: 0, originX: '120px', originY: '135px' }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    />

    {/* Sun Ray Dot */}
    <motion.circle
      cx="165" cy="65" r="7"
      fill="#5bbb46" opacity="0.8"
      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Ground baseline */}
    <line x1="30" y1="155" x2="210" y2="155" stroke="#00ae9d" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </motion.svg>
)

export default function Stage1_10EnvironmentScreen() {
  const { setScreen, updateObjectField, environmentalPulse } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_11Intellectual')
  }

  const selectedOpt = environmentalPulse?.natureAccess

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

        {/* LEFT — Eyebrow + Title + Subtitle + Line Illustration */}
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
              whiteSpace: 'nowrap',
            }}>
              Environmental Pulse
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How does your physical environment feel right now?
            </p>
          </div>
          <EnvironmentIllustration />
        </div>

        {/* RIGHT — PHYSICAL ENVIRONMENT Eyebrow + Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 14px 0',
            width: '100%',
          }}>
            PHYSICAL ENVIRONMENT
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
              Do you have regular access to nature or green spaces?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
              {['Yes, easily', 'Occasionally', 'Rarely'].map(opt => {
                const active = selectedOpt === opt
                return (
                  <button
                    key={opt}
                    onClick={() => updateObjectField('environmentalPulse', 'natureAccess', opt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 18px',
                      borderRadius: '14px',
                      border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                      background: active ? '#e4f4ee' : '#f2f9f6',
                      color: active ? '#414242' : '#3a3a3a',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
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
                      transition: 'all 0.2s ease',
                    }}>
                      {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                    </div>

                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: active ? 700 : 500,
                      fontSize: '14px',
                      color: active ? '#414242' : '#414242',
                    }}>
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!selectedOpt}
              style={{
                padding: '10px 36px',
                opacity: selectedOpt ? 1 : 0.5,
                cursor: selectedOpt ? 'pointer' : 'not-allowed',
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
