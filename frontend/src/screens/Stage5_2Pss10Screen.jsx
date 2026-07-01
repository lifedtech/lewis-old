import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_2Pss10Screen() {
  const { setScreen, setScaleAnswer, pss10 } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 5) {
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
    if (step < 5) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const questions = [
    { id: 'q0', prompt: 'Been upset because of something that happened unexpectedly?' },
    { id: 'q1', prompt: 'Felt that you were unable to control the important things in your life?' },
    { id: 'q2', prompt: "Felt nervous and 'stressed'?" },
    { id: 'q3', prompt: 'Found that you could not cope with all the things that you had to do?' },
    { id: 'q4', prompt: 'Been angered because of things that were outside of your control?' },
    { id: 'q5', prompt: 'Found yourself thinking about things that you have to accomplish?' }
  ]

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
                <p className="likert-prompt">{`${step + 1}/6. ${questions[step].prompt}`}</p>
                <div className="likert-options">
                  {["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"].map(opt => {
                    const qId = questions[step].id
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
          <button className="btn-primary" onClick={handleNext}>
            {step < 5 ? 'Next' : 'Continue'}
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
