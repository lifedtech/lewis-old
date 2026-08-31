import {  useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

export default function Stage6SharingScreen() {
  const { setScreen, setScaleAnswer, everydaySharing } = useLewisStore()
  const [step, setStep] = useState(0)

  const questions = [
    { id: 'q0', label: 'Time', prompt: 'How much of your personal time do you share with others?' },
    { id: 'q1', label: 'Help & Energy', prompt: 'How much of your support and energy do you share?' },
    { id: 'q2', label: 'Trust', prompt: 'How much of your personal trust do you share?' },
    { id: 'q3', label: 'Recognition', prompt: 'How much recognition or praise do you share?' },
    { id: 'q4', label: 'Knowledge', prompt: 'How much of your knowledge and expertise do you share?' }
  ]

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setScreen('stage7_1External')
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('everydaySharing', qId, val)
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1)
      } else {
        setScreen('stage7_1External')
      }
    }, 240)
  }

  const safeStep = Math.max(0, Math.min(step, questions.length - 1))
  const currentItem = questions[safeStep] || questions[0]
  const currentAnswer = currentItem?.id ? everydaySharing?.[currentItem.id] : undefined

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

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Topic Line Art */}
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
              RELATIONAL GENEROSITY
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
            }}>
              Everyday Sharing
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Reflecting on how you distribute your key personal resources and energy.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <TopicLineIllustration topic="sharing" />
          </div>
        </div>

        {/* RIGHT — Questionnaire Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '14px' }}>

          {/* Progress Header Row (Stationary) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#414242', textTransform: 'uppercase' }}>
                EVERYDAY SHARING · {step + 1} OF {questions.length}
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

          {/* Question Text & Options Transition (Container stays still) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <p className="stage-subtitle mobile-subtitle" style={{ margin: '2px 0 0 0', fontSize: '15px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.45, textAlign: 'left' }}>
                  {currentItem.prompt}
                </p>
              </div>

              {/* 3 Stacked Option Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '2px' }}>
                {["Keep it to myself", "Share a little", "Share fully"].map(opt => {
                  const active = currentAnswer === opt
                  return (
                    <motion.button
                      key={opt}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(currentItem.id, opt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        width: '100%',
                        padding: '13px 18px',
                        borderRadius: '14px',
                        border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                        background: active ? '#e4f4ee' : '#ffffff',
                        color: active ? '#414242' : '#3a3a3a',
                        cursor: 'pointer',
                        transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                        boxShadow: active ? '0 3px 10px rgba(0,174,157,0.16)' : '0 1px 4px rgba(0,0,0,0.03)',
                        boxSizing: 'border-box',
                        textAlign: 'left',
                        outline: 'none',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                        background: active ? '#00ae9d' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                      }}>
                        {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </div>

                      <span style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: active ? 700 : 500,
                        fontSize: '14.5px',
                        color: active ? '#414242' : '#414242',
                      }}>
                        {opt}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Select the option that best reflects your pattern.
          </p>
        </div>

      </div>
    </motion.div>
  )
}
