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
        <p style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#00ae9d',
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
          color: '#414242',
        }}>
          Identity &amp; Life Roles
        </h1>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 'clamp(13px, 1.6vw, 16px)',
          color: '#414242',
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
          marginBottom: '32px',
        }}>
          {roles.map(val => {
            const active = isSelected(val)
            return (
              <button
                key={val}
                onClick={() => setProfileField('identityRoles', active ? [] : [val])}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 22px',
                  borderRadius: '999px',
                  border: active ? '1.5px solid #00ae9d' : '1px solid #c2ceca',
                  background: active ? '#e4f4ee' : 'rgba(255,255,255,0.6)',
                  color: active ? '#414242' : '#3a3a3a',
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
                  border: active ? '1.5px solid #00ae9d' : '1.5px solid #c2ceca',
                  background: active ? '#00ae9d' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}>
                  {active && <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                </div>

                <span>{val}</span>
              </button>
            )
          })}
        </div>

        {/* Action Button */}
        <div>
          <button
            className="btn-primary"
            onClick={() => setScreen('stage1_2Stability')}
            disabled={selectedCount === 0}
            style={{
              padding: '10px 48px',
              borderRadius: '12px',
              opacity: selectedCount > 0 ? 1 : 0.5,
              cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontSize: '13.5px',
              fontWeight: 700,
            }}
          >
            Continue
          </button>
        </div>

      </div>
    </motion.div>
  )
}

