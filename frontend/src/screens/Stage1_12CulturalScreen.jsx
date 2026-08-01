import {  useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Cultural & Community Line Illustration ── */
const CulturalIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="cultGlow" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#EBFBFA" stopOpacity="1" />
        <stop offset="70%" stopColor="#F0FAF7" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Circle Glow */}
    <circle cx="120" cy="90" r="78" fill="url(#cultGlow)" />

    {/* Dashed Connecting Arc */}
    <motion.path
      d="M 64,72 Q 120,42 176,72"
      stroke="#00ae9d"
      strokeWidth="2.2"
      strokeDasharray="4 4"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
    />

    {/* Left Figure */}
    <g>
      <path d="M 54,136 C 60,122 84,122 90,136" stroke="#00AE9D" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="72" cy="106" r="11" stroke="#00AE9D" strokeWidth="2.6" fill="#FFF" />
      <line x1="72" y1="95" x2="72" y2="76" stroke="#00AE9D" strokeWidth="2" />
      <circle cx="72" cy="72" r="3.5" fill="#00AE9D" />
    </g>

    {/* Right Figure */}
    <g>
      <path d="M 150,136 C 156,122 180,122 186,136" stroke="#00AE9D" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="168" cy="106" r="11" stroke="#00AE9D" strokeWidth="2.6" fill="#FFF" />
      <line x1="168" y1="95" x2="168" y2="76" stroke="#00AE9D" strokeWidth="2" />
      <circle cx="168" cy="72" r="3.5" fill="#00AE9D" />
    </g>

    {/* Middle Figure (with Gold Heart) */}
    <g>
      <path d="M 102,132 C 108,118 132,118 138,132" stroke="#00AE9D" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="120" cy="102" r="11" stroke="#00AE9D" strokeWidth="2.6" fill="#FFF" />
      <line x1="120" y1="91" x2="120" y2="72" stroke="#00AE9D" strokeWidth="2" />
      <motion.path
        d="M 120,73 C 120,73 111,66.5 111,61 C 111,57 114,54 117.5,54 C 119.2,54 120.6,55 121.5,56.5 C 122.4,55 123.8,54 125.5,54 C 129,54 132,57 132,61 C 132,66.5 123,73 123,73 Z"
        fill="#FBBF24"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
        style={{ transformOrigin: '121.5px 63px' }}
      />
    </g>

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

export default function Stage1_12CulturalScreen() {
  const { setScreen, updateObjectField, culturalBelonging } = useLewisStore()
  const [step, setStep] = useState(0)

  const questions = [
    { key: 'communityBelonging', prompt: 'Do you feel a strong sense of belonging to your current community or culture?' },
    { key: 'valuesAlignment', prompt: 'Are your daily activities aligned with your cultural or personal values?' }
  ]

  const options = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setScreen('stage1_13BodyRhythm')
    }
  }

  const handleSelect = (key, val) => {
    updateObjectField('culturalBelonging', key, val)
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const currentQ = questions[step]
  const currentAnswer = culturalBelonging?.[currentQ.key]

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

        {/* LEFT — Eyebrow + Title + Subtitle + Line Illustration */}
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
              CHOOSE ONE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              whiteSpace: 'nowrap',
            }}>
              Cultural &amp; Community
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              How connected do you feel to your community &amp; values?
            </p>
          </div>
          <CulturalIllustration />
        </div>

        {/* RIGHT — Nested Questionnaire Card Container matching Overall Wellbeing */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1.5px solid #f4f4f4',
                borderRadius: '20px',
                padding: '16px 20px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Progress Header Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                    CULTURAL CONNECTION · {step + 1} OF {questions.length}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                    {Math.round(((step + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: '#00ae9d' }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              {/* Question Statement */}
              <p style={{ margin: '2px 0 2px 0', fontSize: '14.5px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4 }}>
                "{currentQ.prompt}"
              </p>

              {/* 5 Stacked Option Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {options.map(opt => {
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
                        padding: '7px 13px',
                        borderRadius: '12px',
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
                        fontSize: '13px',
                        color: active ? '#414242' : '#414242',
                      }}>
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Footer Instruction Note */}
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#414242', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
                Select how strongly you agree or disagree with each statement.
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!currentAnswer}
              style={{
                padding: '10px 36px',
                opacity: currentAnswer ? 1 : 0.5,
                cursor: currentAnswer ? 'pointer' : 'not-allowed',
              }}
            >
              {step < questions.length - 1 ? 'Next' : 'Continue'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
