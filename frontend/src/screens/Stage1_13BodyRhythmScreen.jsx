import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_13BodyRhythmScreen() {
  const { setScreen, updateObjectField, bodyRhythm } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1)
    } else {
      setScreen('stage1_14SensoryPause')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelect = (key, val) => {
    updateObjectField('bodyRhythm', key, val)
    if (step < 1) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const questions = [
    { 
      key: 'sleepWake', 
      prompt: 'What is your typical sleep-wake preference?', 
      options: ['Morning lark (early rise)', 'Night owl (late sleep)', 'Flexible/Variable'] 
    },
    { 
      key: 'mealRegularity', 
      prompt: 'How regular are your daily meal times?', 
      options: ['Very regular', 'Somewhat regular', 'Highly irregular'] 
    }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Body & Circadian Rhythms</h1>
        
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
                <p className="q-text">{questions[step].prompt}</p>
                <div className="scale-grid" style={{ marginTop: '20px' }}>
                  {questions[step].options.map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => handleSelect(questions[step].key, opt)} 
                      className={`scale-opt ${bodyRhythm?.[questions[step].key] === opt ? 'selected' : ''}`}
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

        </div>
      </div>
    </motion.div>
  )
}
