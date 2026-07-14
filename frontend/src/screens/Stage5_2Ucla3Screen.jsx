import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { UCLA3_SCALE } from '../constants/scales.js'

export default function Stage5_2Ucla3Screen() {
  const { setScreen, setScaleAnswer, ucla3 } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      setScreen('stage5_2Gse')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('ucla3', qId, val)
    if (step < 2) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const questions = [
    { id: 'q0', prompt: 'That you lack companionship?' },
    { id: 'q1', prompt: 'Left out?' },
    { id: 'q2', prompt: 'Isolated from others?' }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Relationships & Social</h1>
        <p className="sub">How often do you feel...</p>
        
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
                <p className="likert-prompt">{`${step + 1}/3. ${questions[step].prompt}`}</p>
                <div className="likert-options">
                  {UCLA3_SCALE.map(opt => {
                    const qId = questions[step].id
                    return (
                      <button 
                        key={opt} 
                        onClick={() => handleSelect(qId, opt)} 
                        className={`likert-btn ${ucla3?.[qId] === opt ? 'selected' : ''}`}
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
          <button className="btn-primary" onClick={handleNext} disabled={!ucla3?.[questions[step].id]}>
            {step < 2 ? 'Next' : 'Continue'}
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
