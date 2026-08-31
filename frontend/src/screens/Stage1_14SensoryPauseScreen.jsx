import {  useState, useEffect  } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Sensory Pause Clock Face Illustration with Dynamic Timer ── */
const ClockFaceIllustration = ({ timeLeft, done }) => {
  const radius = 65
  const circumference = 2 * Math.PI * radius
  const progress = (10 - timeLeft) / 10
  const strokeOffset = circumference * (1 - progress)
  const clockAngle = (10 - timeLeft) * 36

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '0 auto' }}
    >
      <defs>
        <radialGradient id="clockGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EBFBFA" stopOpacity="1" />
          <stop offset="70%" stopColor="#E0F7F3" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Soft Circle Glow */}
      <circle cx="100" cy="100" r="85" fill="url(#clockGlow)" />

      {/* Clock Face Base Ring */}
      <circle cx="100" cy="100" r={radius} stroke="#D1EAE4" strokeWidth="5" fill="none" />

      {/* Dynamic Teal Progress Ring */}
      <motion.circle
        cx="100" cy="100" r={radius}
        stroke="#00AE9D" strokeWidth="5.5" fill="none"
        strokeDasharray={circumference}
        animate={{ strokeDashoffset: strokeOffset }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        transform="rotate(-90 100 100)"
        strokeLinecap="round"
      />

      {/* 4 Clock Tick Marks */}
      <line x1="100" y1="28" x2="100" y2="38" stroke="#80C7B9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="100" y1="162" x2="100" y2="172" stroke="#80C7B9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="28" y1="100" x2="38" y2="100" stroke="#80C7B9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="162" y1="100" x2="172" y2="100" stroke="#80C7B9" strokeWidth="2.2" strokeLinecap="round" />

      {/* Ticking Clock Hand */}
      {!done && (
        <line
          x1="100" y1="100" x2="100" y2="48"
          stroke="#00AE9D" strokeWidth="2.5" strokeLinecap="round" opacity="0.65"
          transform={`rotate(${clockAngle} 100 100)`}
          style={{ transition: 'transform 1s linear' }}
        />
      )}

      {/* Serene Happy Face Features */}
      <path d="M 74,95 Q 83,82 92,95" stroke="#00ae9d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 108,95 Q 117,82 126,95" stroke="#00ae9d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 81,114 Q 100,132 119,114" stroke="#00ae9d" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Live Seconds Countdown inside Clock */}
      {!done && (
        <text
          x="100" y="148"
          textAnchor="middle" fill="#00ae9d"
          fontSize="12" fontWeight="800" fontFamily="Nunito, sans-serif"
        >
          {timeLeft}s
        </text>
      )}
    </svg>
  )
}

export default function Stage1_14SensoryPauseScreen() {
  const { setScreen, setProfileField } = useLewisStore()
  const [timeLeft, setTimeLeft] = useState(10)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setDone(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [done])

  const handleNext = () => {
    setProfileField('sensoryPauseDone', true)
    setScreen('stage2Attention')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Line Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              MINDFUL PAUSE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: 'var(--text-main, #414242)',
            }}>
              Sensory Pause
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Allow yourself a brief moment to reset. Just breathe slowly as the timer winds down.
            </p>
          </div>
        </div>

        {/* RIGHT — Clock Illustration + Timer + Pinned Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p className="stage-right-eyebrow" style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: 'var(--dawn, #00ae9d)',
            textTransform: 'uppercase',
            margin: '0 0 14px 0',
            width: '100%'
          }}>
            MINDFULNESS TIMER
          </p>

          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            boxSizing: 'border-box'
          }}>
            <ClockFaceIllustration timeLeft={timeLeft} done={done} />

            <p style={{
              margin: 0,
              fontSize: '13.5px',
              fontWeight: 700,
              color: done ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
              textAlign: 'center',
            }}>
              {done ? ' Reset Complete. Ready to proceed.' : `Calibrating your focus... ${timeLeft}s`}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '12px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!done}
              style={{
                padding: '10px 36px',
                opacity: done ? 1 : 0.5,
                cursor: done ? 'pointer' : 'not-allowed',
              }}
            >
              {done ? 'Continue' : 'Calibrating...'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
