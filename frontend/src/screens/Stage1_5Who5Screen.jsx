import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { WHO5_SCALE } from '../constants/scales.js'

export default function Stage1_5Who5Screen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, who5 } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setScreen('stage1_6Relational')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('who5', qId, val)
    // Auto-advance after a brief delay for a smooth experience
    if (step < 4) {
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
        <h1 className="headline">Overall Wellbeing (WHO-5)</h1>
        
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
              <div className="q-card" style={{ textAlign: 'left' }}>
                <p className="q-text">
                  {[
                    "1/5. I have felt cheerful and in good spirits",
                    "2/5. I have felt calm and relaxed",
                    "3/5. I have felt active and vigorous",
                    "4/5. I woke up feeling fresh and rested",
                    "5/5. My daily life has been filled with things that interest me"
                  ][step]}
                </p>
                <p className="q-caption">Over the last two weeks...</p>
                <div className="scale-grid">
                  {WHO5_SCALE.map(opt => {
                    const qId = `q${step}`
                    return (
                      <button 
                        key={opt} 
                        onClick={() => handleSelect(qId, opt)} 
                        className={`scale-opt ${who5?.[qId] === opt ? 'selected' : ''}`}
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
          <button className="btn-primary" onClick={handleNext} disabled={!who5?.[`q${step}`]}>
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
