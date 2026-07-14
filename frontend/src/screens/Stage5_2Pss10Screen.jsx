import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { PSS10_SCALE } from '../constants/scales.js'

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
        <p className="sub">In the last month, how often have you...</p>

        <div className="form-container" style={{ margin: '2rem auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ width: '100%' }}
            >
              <div className="likert-container">
                <p className="likert-prompt">{`${step + 1}/${QUESTIONS.length}. ${QUESTIONS[step].prompt}`}</p>
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
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="button-group" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!currentAnswer}>
            {step < last ? 'Next' : 'Continue'}
          </button>
          {step > 0 && (
            <button className="btn-ghost" onClick={handleBack}>
              Back
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
