import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_1IdentityScreen() {
  const { setScreen, setProfileField, identityRoles } = useLewisStore()

  const roles = [
    'Parent / Caregiver',
    'Founder / Entrepreneur',
    'Corporate Leader / Executive',
    'Creative / Artist',
    'Student / Academic',
    'Freelancer / Consultant',
    'Athlete / Performer',
    'Other',
  ]

  const isSelected = (val) => (identityRoles || []).includes(val)
  const selectedCount = (identityRoles || []).length

  const handleSelect = (val) => {
    setProfileField('identityRoles', [val])
    setTimeout(() => {
      setScreen('stage1_2Stability')
    }, 180)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        height: '100%',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <p className="stage-eyebrow" style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '6px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: 'var(--dawn, #00ae9d)',
          textTransform: 'uppercase',
          margin: '0 0 10px 0',
        }}>
          SELECT ONE
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px, 4.8vw, 64px)',
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          margin: '0 0 8px 0',
          color: 'var(--text-main, #414242)',
        }}>
          Identity &amp; Life Roles
        </h1>

        {/* Subtitle */}
        <p className="stage-subtitle" style={{
          margin: '0 0 32px 0',
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--text-sub, #657370)',
          fontFamily: "'Nunito', sans-serif",
        }}>
          Which of these describes you right now? Select one.
        </p>

        {/* Options Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          maxWidth: '640px',
          marginBottom: '16px',
        }}>
          {roles.map(val => {
            const active = isSelected(val)
            return (
              <button
                key={val}
                onClick={() => handleSelect(val)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 22px',
                  borderRadius: '999px',
                  border: active ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--border-color, #c2ceca)',
                  background: active ? 'var(--teal-tint, #e4f4ee)' : 'var(--raised, rgba(255,255,255,0.6))',
                  color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #3a3a3a)',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '14px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: active ? '0 2px 8px rgba(0,174,157,0.15)' : 'none',
                }}
              >
                {/* Selection indicator checkmark dot */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: active ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-strong, #c2ceca)',
                  background: active ? 'var(--dawn, #00ae9d)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}>
                  {active && <span style={{ color: 'var(--action-text, #ffffff)', fontSize: '10px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                </div>

                <span>{val}</span>
              </button>
            )
          })}
        </div>

      </div>
    </motion.div>
  )
}

