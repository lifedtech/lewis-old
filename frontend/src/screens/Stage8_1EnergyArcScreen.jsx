import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Energy Arc Vector Illustration with Sequential Energy Wave Motion ── */
const EnergyArcIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 200 170"
    fill="none"
    style={{ width: '100%', maxWidth: '170px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Pulsing Background Soft Glow */}
    <motion.circle
      cx="100" cy="95" r="65" fill="url(#arcGlow)"
      animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.75, 0.3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 95px' }}
    />

    {/* Horizontal Baseline */}
    <line x1="35" y1="145" x2="165" y2="145" stroke="#f4f4f4" strokeWidth="2.5" strokeLinecap="round" />

    {/* Arc Parabola Curve Line */}
    <motion.path
      d="M 40,135 Q 100,55 160,135"
      stroke="#00AE9D"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />

    {/* Node 1 (Morning Slope - Sequential Glow) */}
    <motion.circle
      cx="54" cy="116" r="7"
      fill="#00AE9D" stroke="#FFF" strokeWidth="1.5"
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      style={{ transformOrigin: '54px 116px' }}
    />

    {/* Node 2 (Apex Peak Green Dot - Vibrant Pulsing Glow) */}
    <motion.circle
      cx="90" cy="72" r="9"
      fill="#00ae9d" stroke="#FFF" strokeWidth="1.8"
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      style={{ transformOrigin: '90px 72px' }}
    />

    {/* Node 3 (Afternoon Slope - Sequential Glow) */}
    <motion.circle
      cx="124" cy="84" r="7"
      fill="#00AE9D" stroke="#FFF" strokeWidth="1.5"
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      style={{ transformOrigin: '124px 84px' }}
    />

    {/* Node 4 (Night Base - Sequential Glow) */}
    <motion.circle
      cx="154" cy="122" r="6"
      fill="#00AE9D" stroke="#FFF" strokeWidth="1.5"
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}
      style={{ transformOrigin: '154px 122px' }}
    />
  </motion.svg>
)

export default function Stage8_1EnergyArcScreen() {
  const { setScreen, updateObjectField, energyArc } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_2StressPattern')
  }

  const timesOfDay = [
    { key: 'morning', label: 'Morning' },
    { key: 'afternoon', label: 'Afternoon' },
    { key: 'evening', label: 'Evening' },
    { key: 'night', label: 'Night' }
  ]

  const levels = ['High', 'Medium', 'Low']
  const allFilled = timesOfDay.every(tod => !!energyArc?.[tod.key])

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

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Vector Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              DAILY RHYTHMS
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
              Energy Arc Mapping
            </h1>
            <p style={{
              margin: '8px 0 14px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.45,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Map out how your energy rises and falls throughout a typical day.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <EnergyArcIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '14px' }}>

          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
              CIRCADIAN ENERGY
            </span>
          </div>

          {/* 4 Time of Day Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {timesOfDay.map(tod => {
              const currentVal = energyArc?.[tod.key]
              return (
                <div
                  key={tod.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1.5px solid #d2e7e0',
                    background: '#ffffff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '14.5px', color: '#414242' }}>
                    {tod.label}
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {levels.map(level => {
                      const selected = currentVal === level
                      return (
                        <motion.button
                          key={level}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => updateObjectField('energyArc', tod.key, level)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '10px',
                            border: selected ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                            background: selected ? '#00ae9d' : '#f2f9f6',
                            color: selected ? '#ffffff' : '#414242',
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: selected ? 700 : 600,
                            fontSize: '12.5px',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            boxShadow: selected ? '0 2px 8px rgba(0,174,157,0.22)' : 'none',
                            outline: 'none',
                          }}
                        >
                          {level}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Select your typical energy level for each phase of the day.
          </p>

          {/* Action Button directly below */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!allFilled}
              style={{
                padding: '10px 40px',
                opacity: allFilled ? 1 : 0.5,
                cursor: allFilled ? 'pointer' : 'not-allowed',
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
