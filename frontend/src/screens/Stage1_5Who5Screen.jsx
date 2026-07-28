import {  useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { WHO5_SCALE } from '../constants/scales.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

export default function Stage1_5Who5Screen() {
  const { setScreen, setScaleAnswer, who5 } = useLewisStore()
  const [step, setStep] = useState(0)

  const questions = [
    'I have felt cheerful and in good spirits',
    'I have felt calm and relaxed',
    'I have felt active and vigorous',
    'I woke up feeling fresh and rested',
    'My daily life has been filled with things that interest me',
  ]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    else setScreen('stage1_6Relational')
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('who5', qId, val)
    if (step < 4) setTimeout(() => setStep(step + 1), 350)
  }

  const currentQId = `q${step}`
  const currentAnswer = who5?.[currentQId]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{
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

        {/* LEFT — Eyebrow + Title + Subtitle + Topic Line Art */}
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
              Overall Wellbeing
            </h1>
          </div>
          <TopicLineIllustration topic="who5" />
        </div>

        {/* RIGHT — Nested Card Container as in user reference image */}
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
                    LAST 2 WEEKS · {step + 1} OF 5
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                    {Math.round(((step + 1) / 5) * 100)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: '#00ae9d' }}
                    animate={{ width: `${((step + 1) / 5) * 100}%` }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              {/* Question Statement */}
              <p style={{ margin: '2px 0 2px 0', fontSize: '14.5px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4 }}>
                {questions[step]}
              </p>

              {/* 6 Stacked Option Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {WHO5_SCALE.map(opt => {
                  const active = currentAnswer === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(currentQId, opt)}
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
                Select how often you felt this way over the last two weeks.
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
              {step < 4 ? 'Next' : 'Continue'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
