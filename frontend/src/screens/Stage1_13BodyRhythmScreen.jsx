import {  useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Circadian Arc Traveling Sun & Moon Illustration ── */
const CircadianIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 25 240 155"
    fill="none"
    style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '-18px auto 0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="circadianGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.22" />
        <stop offset="60%" stopColor="#00AE9D" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#00ae9d" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Dome Glow */}
    <circle cx="120" cy="95" r="75" fill="url(#circadianGlow)" />

    {/* Dotted Parabolic Circadian Trajectory Arc */}
    <motion.path
      d="M 40,135 Q 120,40 200,135"
      stroke="#00ae9d"
      strokeWidth="2.2"
      strokeDasharray="4 4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Floating Green Particles along the Arc */}
    <motion.circle
      cx="120" cy="70" r="3.5" fill="#00ae9d"
      animate={{ y: [-3, 3, -3], scale: [0.9, 1.25, 0.9] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="160" cy="80" r="3" fill="#34D399"
      animate={{ y: [2, -4, 2], scale: [1.1, 0.8, 1.1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    />

    {/* 1. Animated Traveling SUN along the Arc (0s to 3.5s) */}
    <motion.g
      animate={{
        x: [0, 40, 80, 120, 160],
        y: [0, -50, -68, -50, 0],
        opacity: [0, 1, 1, 1, 0]
      }}
      transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
      style={{ transformOrigin: '40px 135px' }}
    >
      <circle cx="40" cy="135" r="14" fill="#FBBF24" stroke="#5fbb46" strokeWidth="2" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '40px 135px' }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <line
            key={deg}
            x1="40" y1="117" x2="40" y2="112"
            stroke="#5fbb46" strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${deg} 40 135)`}
          />
        ))}
      </motion.g>
    </motion.g>

    {/* 2. Animated Traveling MOON along the Arc (3.5s to 7s) */}
    <motion.g
      animate={{
        x: [0, 40, 80, 120, 160],
        y: [0, -50, -68, -50, 0],
        opacity: [0, 1, 1, 1, 0]
      }}
      transition={{ duration: 3.5, delay: 3.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
      style={{ transformOrigin: '40px 135px' }}
    >
      <path
        d="M 48,123 C 39,123 32,130 32,139 C 32,148 39,155 48,155 C 42,152 39,146 39,139 C 39,132 42,126 48,123 Z"
        fill="#38BDF8"
        stroke="#0284C7"
        strokeWidth="1.5"
      />
      <circle cx="26" cy="128" r="2" fill="#38BDF8" />
      <circle cx="22" cy="142" r="1.5" fill="#38BDF8" />
    </motion.g>

    {/* Wavy Horizon Lines */}
    <motion.path
      d="M 28,152 Q 85,143 135,156 T 222,148"
      stroke="#00AE9D"
      strokeWidth="3.2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 38,168 Q 95,159 145,172 T 212,164"
      stroke="#d6edea"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage1_13BodyRhythmScreen() {
  const { setScreen, updateObjectField, bodyRhythm } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleSelect = (key, val) => {
    updateObjectField('bodyRhythm', key, val)
    if (step < 1) {
      setTimeout(() => setStep(step + 1), 220)
    } else {
      setTimeout(() => setScreen('stage1_14SensoryPause'), 220)
    }
  }

  const questions = [
    { 
      key: 'sleepWake', 
      prompt: 'What is your typical sleep-wake preference?', 
      options: ['Morning lark (early rise)', 'Night owl (late sleep)', 'Flexible/Variable'] 
    },
    { 
      key: 'mealRegularity', 
      prompt: 'How regular are your daily meal times?', 
      options: ['Very regular', 'Somewhat regular', 'Highly irregular'] 
    }
  ]

  const currentQ = questions[step]
  const currentAnswer = bodyRhythm?.[currentQ.key]

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
              color: '#414242',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              CHOOSE ONE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
            }}>
              Body &amp; Circadian Rhythms
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Understanding your natural internal clock.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <CircadianIllustration />
          </div>
        </div>

        {/* RIGHT — CIRCADIAN RHYTHMS Eyebrow + Questions + Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          {/* Progress Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#414242', textTransform: 'uppercase' }}>
                CIRCADIAN RHYTHMS · {step + 1} OF {questions.length}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                {Math.round(((step + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'linear-gradient(90deg, #00ae9d, #00ae9d)' }}
                animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Question & Option Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start', width: '100%' }}
            >
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
                {currentQ.prompt}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                {currentQ.options.map(opt => {
                  const active = currentAnswer === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(currentQ.key, opt)}
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
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </motion.div>
  )
}
