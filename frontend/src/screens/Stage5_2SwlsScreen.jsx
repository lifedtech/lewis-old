import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_2SwlsScreen() {
  const { setScreen, setScaleAnswer, swls } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setScreen('stage5_3DeepDives')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('swls', qId, val)
    if (step < 4) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const questions = [
    { id: 'q0', prompt: 'In most ways my life is close to my ideal.' },
    { id: 'q1', prompt: 'The conditions of my life are excellent.' },
    { id: 'q2', prompt: 'I am satisfied with my life.' },
    { id: 'q3', prompt: 'So far I have gotten the important things I want in life.' },
    { id: 'q4', prompt: 'If I could live my life over, I would change almost nothing.' }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Global Life Satisfaction</h1>
        
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
                <p className="likert-prompt">{`${step + 1}/5. ${questions[step].prompt}`}</p>
                <div className="likert-options">
                  {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map(opt => {
                    const qId = questions[step].id
                    return (
                      <button 
                        key={opt} 
                        onClick={() => handleSelect(qId, opt)} 
                        className={`likert-btn ${swls?.[qId] === opt ? 'selected' : ''}`}
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
            {step < 4 ? 'Next' : 'Continue'}
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
