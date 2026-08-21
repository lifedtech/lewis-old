import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Body & Movement Context Vector Line Art ── */
const BodyIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="bodyAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#bodyAura)" />

    {/* Human Body Alignment Line Art */}
    <circle cx="120" cy="55" r="14" stroke="#00AE9D" strokeWidth="2.5" fill="rgba(0,174,157,0.08)" />
    <path d="M 120,69 L 120,125 M 95,90 L 145,90 M 102,145 L 120,125 L 138,145" stroke="url(#bodyGrad)" strokeWidth="2.5" strokeLinecap="round" />

    {/* Energy Pulse Ring */}
    <motion.circle
      cx="120" cy="90" r="32" stroke="#00ae9d" strokeWidth="1.8" strokeDasharray="4 4" fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
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
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage1_4BodyScreen() {
  const { setScreen, setProfileField, bodyMovement, sleepQuality } = useLewisStore()

  const activityOptions = [
    { val: 'very_active', label: 'Very active' },
    { val: 'moderate', label: 'Moderately active' },
    { val: 'sedentary', label: 'Mostly sedentary' },
  ]

  const sleepOptions = [
    { val: 'good', label: 'Consistently good' },
    { val: 'mixed', label: 'Mixed/Okay' },
    { val: 'poor', label: 'Struggling' },
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              PHYSICAL WELLBEING
            </p>
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
              Body &amp; Movement<br />Context
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How has your body been lately?
            </p>
          </div>
          <BodyIllustration />
        </div>

        {/* RIGHT — BODY MOVEMENT Eyebrow + Question Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p className="stage-right-eyebrow" style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            
            margin: '0 0 8px 0',
            width: '100%'
          }}>
            BODY MOVEMENT &amp; SLEEP
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start', width: '100%' }}>

            {/* Activity Level */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
              <p style={{ margin: '0 0 8px', fontSize: '13.5px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", textAlign: 'left' }}>
                How active has your body been lately?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', width: '100%' }}>
                {activityOptions.map(({ val, label }) => {
                  const active = bodyMovement === val
                  return (
                    <button
                      key={val}
                      onClick={() => setProfileField('bodyMovement', val)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '9px 16px',
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
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: active ? 700 : 500, fontSize: '13.5px', color: active ? '#414242' : '#414242' }}>
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sleep Quality */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
              <p style={{ margin: '0 0 8px', fontSize: '13.5px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", textAlign: 'left' }}>
                How has your sleep been?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', width: '100%' }}>
                {sleepOptions.map(({ val, label }) => {
                  const active = sleepQuality === val
                  return (
                    <button
                      key={val}
                      onClick={() => setProfileField('sleepQuality', val)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '9px 16px',
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
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: active ? 700 : 500, fontSize: '13.5px', color: active ? '#414242' : '#414242' }}>
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={() => setScreen('stage1_5Who5')}
              style={{ padding: '10px 36px' }}
            >
              Continue
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
