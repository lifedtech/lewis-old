import {  useState  } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Quick Choices Vector Line Art Illustration with Tilting Balance Motion ── */
const QuickChoicesIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '160px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="choiceAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="choiceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#choiceAura)" />

    {/* Balance Scale Central Pillar */}
    <line x1="120" y1="50" x2="120" y2="140" stroke="#00AE9D" strokeWidth="3" strokeLinecap="round" />
    <polygon points="105,140 135,140 120,125" fill="#00AE9D" />

    {/* Tilting Balance Beam Animation */}
    <motion.g
      animate={{ rotate: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 65px' }}
    >
      <line x1="60" y1="65" x2="180" y2="65" stroke="#00ae9d" strokeWidth="3" strokeLinecap="round" />

      {/* Left Pan (Instant Choice) */}
      <line x1="60" y1="65" x2="60" y2="95" stroke="#00AE9D" strokeWidth="1.5" />
      <path d="M 42,95 C 42,108 78,108 78,95 Z" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2" />
      <circle cx="60" cy="88" r="8" fill="#00ae9d" stroke="#FFF" strokeWidth="1.5" />

      {/* Right Pan (Delayed Choice - Double Stack) */}
      <line x1="180" y1="65" x2="180" y2="95" stroke="#00AE9D" strokeWidth="1.5" />
      <path d="M 162,95 C 162,108 198,108 198,95 Z" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2" />
      <circle cx="180" cy="86" r="8" fill="url(#choiceGrad)" stroke="#FFF" strokeWidth="1.5" />
      <circle cx="180" cy="76" r="8" fill="#00ae9d" stroke="#FFF" strokeWidth="1.5" />
    </motion.g>

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

export default function Stage9QuickChoicesScreen() {
  const { setScreen, updateObjectField } = useLewisStore()
  
  // Game state
  const [round, setRound] = useState(1)
  const maxRounds = 5
  
  const [lowerBound, setLowerBound] = useState(0)
  const [upperBound, setUpperBound] = useState(100)
  const [currentImmediate, setCurrentImmediate] = useState(50)
  
  const [gameOver, setGameOver] = useState(false)
  const [discountingTendency, setDiscountingTendency] = useState(null)

  const handleChoice = (choice) => {
    let newLower = lowerBound
    let newUpper = upperBound

    if (choice === 'immediate') {
      newUpper = currentImmediate
    } else {
      newLower = currentImmediate
    }

    setLowerBound(newLower)
    setUpperBound(newUpper)

    if (round >= maxRounds) {
      const indifferencePoint = (newLower + newUpper) / 2
      const tendency = (indifferencePoint / 100).toFixed(2)
      setDiscountingTendency(tendency)
      updateObjectField('quickChoices', 'discountingTendency', tendency)
      setGameOver(true)
    } else {
      setCurrentImmediate(Math.floor((newLower + newUpper) / 2))
      setRound(r => r + 1)
    }
  }

  const handleNext = () => {
    setScreen('stage10Generating')
  }

  return (
    <motion.div 
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
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
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
            }}>
              QUICK CHOICES (DELAY DISCOUNTING)
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Which would</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>you prefer?</span>
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Round {round} of {maxRounds}
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <QuickChoicesIllustration />
          </div>
        </div>

        {/* RIGHT — Questionnaire Card Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #f4f4f4',
              borderRadius: '20px',
              padding: '18px 22px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                DECISION CALIBRATION
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                ROUND {round} / {maxRounds}
              </span>
            </div>

            {!gameOver ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                {/* Option 1: Instant Reward */}
                <motion.button
                  onClick={() => handleChoice('immediate')}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid #00ae9d',
                    background: '#f2f9f6',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: '0 2px 8px rgba(0,174,157,0.1)',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: '22px',
                    color: '#414242',
                  }}>
                    ₹{(currentImmediate * 100).toLocaleString('en-IN')}
                  </span>
                  <span style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: '#414242',
                    background: '#e4f4ee',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid #00ae9d',
                  }}>
                    RIGHT NOW
                  </span>
                </motion.button>

                {/* Option 2: Delayed Reward */}
                <motion.button
                  onClick={() => handleChoice('later')}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid #00ae9d',
                    background: '#f2f9f6',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: '0 2px 8px rgba(0,174,157,0.1)',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: '22px',
                    color: '#414242',
                  }}>
                    ₹10,000
                  </span>
                  <span style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: '#414242',
                    background: '#e4f4ee',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid #00ae9d',
                  }}>
                    IN 1 MONTH
                  </span>
                </motion.button>

                {/* Indifference Calibration Progress Bar */}
                <div style={{ marginTop: '10px', width: '100%' }}>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '11.5px',
                    color: '#414242',
                    textAlign: 'center',
                    margin: '0 0 6px 0',
                    fontWeight: 600,
                  }}>
                    Indifference Calibration
                  </p>
                  <div style={{ height: '6px', background: '#f4f4f4', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <motion.div
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #00ae9d 0%, #00ae9d 100%)',
                        borderRadius: '3px',
                      }}
                      animate={{ width: `${(round / maxRounds) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  gap: '10px',
                  textAlign: 'center',
                  padding: '8px 0',
                }}
              >
                <h2 style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: '22px',
                  color: '#414242',
                  margin: 0,
                }}>
                  Calibration Complete
                </h2>

                <div style={{
                  background: '#f2f9f6',
                  border: '1.5px solid #00ae9d',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}>
                  <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#414242', fontFamily: "'Nunito', sans-serif" }}>
                    Computed Indifference Score:
                  </p>
                  <p style={{
                    fontSize: '36px',
                    fontWeight: 800,
                    color: '#00ae9d',
                    margin: '0 0 4px 0',
                    fontFamily: "'Manrope', sans-serif",
                  }}>
                    {discountingTendency}
                  </p>
                  <p style={{ fontSize: '12px', color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, margin: 0 }}>
                    {parseFloat(discountingTendency) > 0.5
                      ? "Your choices indicate a stronger preference for immediate gratification."
                      : "Your choices indicate a willingness to delay gratification for a larger reward."}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action button directly below card when Game Over */}
          {gameOver && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '14px', flexShrink: 0 }}>
              <button
                className="btn-primary"
                onClick={handleNext}
                style={{ padding: '9px 36px' }}
              >
                Continue Journey
              </button>
            </div>
          )}

        </div>

      </div>
    </motion.div>
  )
}

