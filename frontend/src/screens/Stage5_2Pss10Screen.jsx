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
  const currentAnswer = pss10?.[QUESTIONS[step].id]

  const handleNext = () => {
    if (step < last) {
      setStep(step + 1)
    } else {
      setScreen('stage5_2Ucla3')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
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
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Emotional & Mental</h1>
        <div style={{ gridArea: 'sub', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <TopicLineIllustration topic="pss10" />
        </div>

        <div className="form-container" style={{ margin: '0 auto', width: '100%' }}>
          <div className="likert-container">
            {/* Step Counter & Progress Bar (Fixed stationary) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--dawn)', textTransform: 'uppercase' }}>
                  IN THE LAST MONTH · {step + 1} OF {QUESTIONS.length}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-mute)' }}>
                  {Math.round(((step + 1) / QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--dawn), #10b981)' }}
                  animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* ONLY Question Prompt & Choices animate transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
              >
                <p className="likert-prompt">{QUESTIONS[step].prompt}</p>

                <div className="likert-options">
                  {PSS10_SCALE.map(opt => {
                    const qId = QUESTIONS[step].id
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(qId, opt)}
                        className={`likert-btn ${pss10?.[qId] === opt ? 'selected' : ''}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontStyle: 'italic', margin: 0, textAlign: 'left' }}>
              Select the option that best reflects how often you felt or thought this way.
            </p>
          </div>
        </div>

        <div className="button-group" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!currentAnswer}>
            {step < last ? 'Next' : 'Continue'}
          </button>

        </div>
      </div>
    </motion.div>
  )
}
