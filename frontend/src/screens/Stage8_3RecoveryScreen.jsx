import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Recovery Responsiveness Vector Illustration ── */
const RecoveryResponsivenessIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '190px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="recAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="recGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#recAura)" />

    {/* Recharge Battery Outer Shell */}
    <rect x="70" y="60" width="100" height="55" rx="14" stroke="#00AE9D" strokeWidth="2.5" fill="rgba(0,174,157,0.06)" />
    <rect x="170" y="78" width="6" height="18" rx="3" fill="#00AE9D" />

    {/* Animated Recharge Level Fill */}
    <motion.rect
      x="78" y="68" width="84" height="39" rx="8" fill="url(#recGrad)"
      animate={{ opacity: [0.4, 0.95, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Serene Pulse Glow Node */}
    <circle cx="120" cy="87.5" r="5" fill="#FFF" opacity="0.9" />

    {/* Wavy Horizon Lines */}
    <motion.path
      d="M 28,154 Q 85,145 135,158 T 222,150"
      stroke="#00AE9D" strokeWidth="3.2" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 38,170 Q 95,161 145,174 T 212,166"
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage8_3RecoveryScreen() {
  const { setScreen, setProfileField, recoveryResponsiveness } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_4Cumulative')
  }

  const options = [
    { title: 'Refreshed quickly', desc: 'Rest restores your vitality easily and leaves you feeling recharged.' },
    { title: 'Takes a while to wind down', desc: 'Mind and body take significant time to transition into relaxation.' },
    { title: 'Never really feel rested', desc: 'Even after time off, exhaustion and fatigue remain present.' },
    { title: 'Guilty for resting', desc: 'Resting creates anxiety or feelings that you should be productive instead.' }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.8fr',
        gap: 'clamp(20px, 3vw, 36px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Title + Subtitle + Vector Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px', alignSelf: 'center' }}>
          <div>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textWrap: 'balance',
            }}>
              Recovery<br />Responsiveness
            </h1>
            <p style={{
              margin: '10px 0 0 2px',
              fontSize: 'clamp(13px, 1.4vw, 15px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.45,
              maxWidth: '340px',
            }}>
              When you rest or take time out, how do you feel?
            </p>
          </div>
          <RecoveryResponsivenessIllustration />
        </div>

        {/* RIGHT — RECOVERY & REST Eyebrow + 4 Sleek Compact Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p className="stage-right-eyebrow" style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            
            margin: '0 0 8px 0'
          }}>
            RECOVERY & REST
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map(opt => {
              const active = recoveryResponsiveness === opt.title
              return (
                <button
                  key={opt.title}
                  onClick={() => setProfileField('recoveryResponsiveness', opt.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #f4f4f4',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#414242' : '#3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Selection Indicator Circle with Checkmark */}
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

                  {/* Content Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '14.5px',
                      color: active ? '#414242' : '#414242',
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
                    }}>
                      {opt.title}
                    </span>
                    <p style={{
                      margin: '2px 0 0 0',
                      fontSize: '12px',
                      color: active ? '#1b4d43' : '#414242',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.35,
                    }}>
                      {opt.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right with plenty of breathing room */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!recoveryResponsiveness}
              style={{
                padding: '10px 36px',
                opacity: recoveryResponsiveness ? 1 : 0.5,
                cursor: recoveryResponsiveness ? 'pointer' : 'not-allowed',
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
