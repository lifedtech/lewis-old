import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function PreStage0AgeScreen() {
  const { setScreen, setProfileField } = useLewisStore()

  const handleNext = (isOver18) => {
    setProfileField('isOver18', isOver18)
    // Under-18: hard stop. The assessment is designed and validated for
    // adults only — minors never proceed into data collection.
    setScreen(isOver18 ? 'stage1_0About' : 'ageStop')
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
        maxWidth: '620px',
        margin: '0 auto',
        height: '100%',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <p style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#00ae9d',
          textTransform: 'uppercase',
          margin: '0 0 10px 0',
        }}>
          CONFIRM ELIGIBILITY
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
          Before We Begin
        </h1>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 'clamp(13px, 1.6vw, 16px)',
          color: '#414242',
          fontFamily: "'Nunito', sans-serif",
        }}>
          Please confirm your age eligibility to continue.
        </p>

        {/* Question & Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', width: '100%', alignItems: 'center' }}>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{
              display: 'block',
              textAlign: 'center',
              color: '#414242',
              fontSize: 'clamp(14px, 1.7vw, 17px)',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '20px',
              fontWeight: 600,
            }}>
              Are you 18 or older?
            </label>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '340px',
            }}>
              <button
                onClick={() => handleNext(true)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '999px',
                  border: '1.5px solid #00ae9d',
                  background: '#00ae9d',
                  color: '#ffffff',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                }}
              >
                Yes, I am 18 or older
              </button>

              <button
                onClick={() => handleNext(false)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '999px',
                  border: '1.5px solid #c2ceca',
                  background: 'rgba(255, 255, 255, 0.6)',
                  color: '#414242',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00ae9d'
                  e.currentTarget.style.color = '#414242'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#c2ceca'
                  e.currentTarget.style.color = '#414242'
                }}
              >
                No, I am under 18
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

