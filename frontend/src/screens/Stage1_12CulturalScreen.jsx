import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_12CulturalScreen() {
  const { setScreen, updateObjectField, culturalBelonging } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1)
    } else {
      setScreen('stage1_13BodyRhythm')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelect = (key, val) => {
    updateObjectField('culturalBelonging', key, val)
    if (step < 1) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const questions = [
    { key: 'communityBelonging', prompt: 'Do you feel a strong sense of belonging to your current community or culture?' },
    { key: 'valuesAlignment', prompt: 'Are your daily activities aligned with your cultural or personal values?' }
  ]

  const options = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Cultural & Community Connection</h1>
        
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
                <p className="q-text">{`${step + 1}/2. ${questions[step].prompt}`}</p>
                <div className="scale-grid" style={{ marginTop: '20px' }}>
                  {options.map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => handleSelect(questions[step].key, opt)} 
                      className={`scale-opt ${culturalBelonging?.[questions[step].key] === opt ? 'selected' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleNext}>
            {step < 1 ? 'Next' : 'Continue'}
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
