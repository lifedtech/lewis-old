import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_2DienerScreen() {
  const { setScreen, setScaleAnswer, diener } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1)
    } else {
      setScreen('stage5_2Ins')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('diener', qId, val)
    if (step < 7) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const questions = [
    { id: 'q0', prompt: 'I lead a purposeful and meaningful life' },
    { id: 'q1', prompt: 'My social relationships are supportive and rewarding' },
    { id: 'q2', prompt: 'I am engaged and interested in my daily activities' },
    { id: 'q3', prompt: 'I actively contribute to the happiness and well-being of others' },
    { id: 'q4', prompt: 'I am competent and capable in the activities that are important to me' },
    { id: 'q5', prompt: 'I am a good person and live a good life' },
    { id: 'q6', prompt: 'I am optimistic about my future' },
    { id: 'q7', prompt: 'People respect me' }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Intellectual & Growth</h1>
        
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
                <p className="likert-prompt">{`${step + 1}/8. ${questions[step].prompt}`}</p>
                <div className="likert-options">
                  {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map(opt => {
                    const qId = questions[step].id
                    return (
                      <button 
                        key={opt} 
                        onClick={() => handleSelect(qId, opt)} 
                        className={`likert-btn ${diener?.[qId] === opt ? 'selected' : ''}`}
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
          <button className="btn-primary" onClick={handleNext}>
            {step < 7 ? 'Next' : 'Continue'}
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
