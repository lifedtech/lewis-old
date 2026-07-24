import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { PSS10_SCALE } from '../constants/scales.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

// Full standard PSS-10. Item order is load-bearing: the backend
// reverse-scores items 4, 5, 7 and 8 (q3, q4, q6, q7) — the positively
// stated ones. Do not reorder or reword.
const QUESTIONS = [
  { id: 'q0', prompt: 'Been upset because of something that happened unexpectedly?' },
  { id: 'q1', prompt: 'Felt that you were unable to control the important things in your life?' },
  { id: 'q2', prompt: "Felt nervous and 'stressed'?" },
  { id: 'q3', prompt: 'Felt confident about your ability to handle your personal problems?' },
  { id: 'q4', prompt: 'Felt that things were going your way?' },
  { id: 'q5', prompt: 'Found that you could not cope with all the things that you had to do?' },
  { id: 'q6', prompt: 'Been able to control irritations in your life?' },
  { id: 'q7', prompt: 'Felt that you were on top of things?' },
  { id: 'q8', prompt: 'Been angered because of things that were outside of your control?' },
  { id: 'q9', prompt: 'Felt difficulties were piling up so high that you could not overcome them?' },
]

export default function Stage5_2Pss10Screen() {
  const { setScreen, setScaleAnswer, pss10 } = useLewisStore()
  const [step, setStep] = useState(0)

  const last = QUESTIONS.length - 1
  const currentQ = QUESTIONS[step]
  const currentAnswer = pss10?.[currentQ.id]

  const handleNext = () => {
    if (step < last) {
      setStep(step + 1)
    } else {
      setScreen('stage5_2Ucla3')
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('pss10', qId, val)
    if (step < last) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

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
              color: '#16302b',
              whiteSpace: 'nowrap',
            }}>
              Emotional &amp; Mental
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              In the last month, how often have you experienced these thoughts or feelings?
            </p>
          </div>
          <TopicLineIllustration topic="pss10" />
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
                border: '1.5px solid #e2e8e5',
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
                    IN THE LAST MONTH · {step + 1} OF {QUESTIONS.length}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                    {Math.round(((step + 1) / QUESTIONS.length) * 100)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: '#00ae9d' }}
                    animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              {/* Question Statement */}
              <p style={{ margin: '2px 0 2px 0', fontSize: '14.5px', fontWeight: 700, color: '#16302b', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4 }}>
                "{currentQ.prompt}"
              </p>

              {/* 5 Stacked Option Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {PSS10_SCALE.map(opt => {
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
                        padding: '7px 13px',
                        borderRadius: '12px',
                        border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                        background: active ? '#e4f4ee' : '#f2f9f6',
                        color: active ? '#044e43' : '#3a3a3a',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
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
                        transition: 'all 0.18s ease',
                      }}>
                        {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </div>

                      <span style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: active ? 700 : 500,
                        fontSize: '13.5px',
                        color: active ? '#044e43' : '#16302b',
                      }}>
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#8fa099', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
                Select how often you experienced this in the past month.
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action Button Pinned Outside Container */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '10px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!currentAnswer}
              style={{
                padding: '9px 36px',
                opacity: currentAnswer ? 1 : 0.5,
                cursor: currentAnswer ? 'pointer' : 'not-allowed',
              }}
            >
              {step < last ? 'Next' : 'Continue'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
