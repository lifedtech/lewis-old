import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Friction & Barriers Vector Illustration ── */
const FrictionBarriersIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="fricAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="fricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#fricAura)" />

    {/* Obstacle Hurdle / Friction Arch Line Art */}
    <path
      d="M 60,135 L 60,85 C 60,65 180,65 180,85 L 180,135"
      stroke="#00AE9D" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 4" fill="none"
    />
    <motion.circle
      cx="120" cy="70" r="8" fill="#10B981" stroke="#FFF" strokeWidth="2"
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />

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

export default function Stage7_8FrictionScreen() {
  const { setScreen, toggleArrayItem, flags } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_1EnergyArc')
  }

  const options = [
    { id: 'money_friction', label: 'Money or financial stress' },
    { id: 'chronic_pain', label: 'Chronic pain or physical discomfort' },
    { id: 'feel_stuck', label: 'Feeling stuck in a rut' },
    { id: 'cant_follow_through', label: 'Trouble following through on plans' },
    { id: 'not_in_control', label: 'Feeling out of control of my time' },
    { id: 'too_drained', label: 'Too drained for anything new' },
    { id: 'standing_still', label: 'Just standing still right now' },
    { id: 'none', label: 'None of the above' }
  ]

  const currentFlags = flags || []

  const handleToggle = (id) => {
    if (id === 'none') {
      if (!currentFlags.includes('none')) {
        currentFlags.forEach(f => toggleArrayItem('flags', f))
        toggleArrayItem('flags', 'none')
      } else {
        toggleArrayItem('flags', 'none')
      }
    } else {
      if (currentFlags.includes('none')) {
        toggleArrayItem('flags', 'none')
      }
      toggleArrayItem('flags', id)
    }
  }

  const isSelected = (id) => currentFlags.includes(id)
  const selectedCount = currentFlags.length

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
              Friction &<br />Barriers
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              What feels like the biggest point of friction when it comes to making changes? Select any that apply.
            </p>
          </div>
          <FrictionBarriersIllustration />
        </div>

        {/* RIGHT — BARRIERS & FRICTION Eyebrow + 8 Multi-select Checkbox Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 10px 0',
          }}>
            BARRIERS & FRICTION
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map(opt => {
              const active = isSelected(opt.id)
              return (
                <button
                  key={opt.id}
                  onClick={() => handleToggle(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #e2e8e5',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#044e43' : '#3a3a3a',
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
                    color: active ? '#044e43' : '#16302b',
                    lineHeight: 1.4,
                  }}>
                    {opt.label}
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
