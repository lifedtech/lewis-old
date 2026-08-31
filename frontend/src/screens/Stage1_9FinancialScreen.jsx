import {  useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Financial Pulse Vector Line Art ── */
const FinancialIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="finAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#finAura)" />

    {/* Financial Growth Pulse Chart */}
    <path d="M 60,125 L 95,100 L 130,115 L 180,65" stroke="url(#finGrad)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <motion.circle cx="180" cy="65" r="6" fill="#00ae9d" stroke="#FFF" strokeWidth="1.8" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2, repeat: Infinity }} />

    {/* Coin Stack Line Art */}
    <ellipse cx="75" cy="135" rx="14" ry="4" stroke="#00AE9D" strokeWidth="1.8" fill="rgba(0,174,157,0.1)" />
    <ellipse cx="75" cy="129" rx="14" ry="4" stroke="#00AE9D" strokeWidth="1.8" fill="rgba(0,174,157,0.1)" />
    <ellipse cx="75" cy="123" rx="14" ry="4" stroke="#00AE9D" strokeWidth="1.8" fill="rgba(0,174,157,0.1)" />

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

const questions = [
  { id: 'finAnxiety', prompt: 'How often do financial thoughts feel heavy or stressful?' },
  { id: 'finBuffer', prompt: 'Do you feel comfortable with your current financial buffer or savings?' },
  { id: 'finControl', prompt: 'Do you feel in control of your monthly spending and commitments?' },
  { id: 'finFuture', prompt: 'How confident do you feel about your long-term financial path?' },
]

export default function Stage1_9FinancialScreen() {
  const { setScreen, setProfileField, financialState = {} } = useLewisStore()
  const [step, setStep] = useState(0)

  const safeStep = Math.max(0, Math.min(step, questions.length - 1))
  const currentQ = questions[safeStep] || questions[0]
  const currentAnswer = currentQ?.id ? financialState[currentQ.id] : undefined

  const handleSelect = (qId, val) => {
    setProfileField('financialState', { ...financialState, [qId]: val })
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 220)
    } else {
      setTimeout(() => setScreen('stage1_10Environment'), 220)
    }
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
              FINANCIAL WELLBEING
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
              Financial Wellness Pulse
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
              Let's tune into your financial state.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <FinancialIllustration />
          </div>
        </div>

        {/* RIGHT — FINANCIAL PULSE Eyebrow + Questions + Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start', width: '100%' }}>

          {/* Progress Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--dawn, #00ae9d)', textTransform: 'uppercase' }}>
                FINANCIAL PULSE · {step + 1} OF {questions.length}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-sub, #85918e)' }}>
                {Math.round(((step + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--panel-border, rgba(22, 36, 31, 0.08))', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'var(--dawn, #00ae9d)' }}
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
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #414242)', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
                {currentQ.prompt}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                {['Rarely', 'Sometimes', 'Often'].map(opt => {
                  const active = currentAnswer === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(currentQ.id, opt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '10px 18px',
                        borderRadius: '14px',
                        border: active ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-color, #d2e7e0)',
                        background: active ? 'var(--teal-tint, #e4f4ee)' : 'var(--raised, #f2f9f6)',
                        color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #3a3a3a)',
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
                        border: active ? '2px solid var(--dawn, #00ae9d)' : '2px solid var(--border-strong, #c2ceca)',
                        background: active ? 'var(--dawn, #00ae9d)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}>
                        {active && <span style={{ color: 'var(--action-text, #ffffff)', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </div>

                      <span style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: active ? 700 : 500,
                        fontSize: '13.5px',
                        color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
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
