import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage6SharingScreen() {
  const { setScreen, setScaleAnswer, everydaySharing } = useLewisStore()
  const [step, setStep] = useState(0)

  const questions = [
    { id: 'q0', label: 'Time', prompt: 'How much of your personal time do you share with others?' },
    { id: 'q1', label: 'Help & Energy', prompt: 'How much of your support and energy do you share?' },
    { id: 'q2', label: 'Trust', prompt: 'How much of your personal trust do you share?' },
    { id: 'q3', label: 'Recognition', prompt: 'How much recognition or praise do you share?' },
    { id: 'q4', label: 'Knowledge', prompt: 'How much of your knowledge and expertise do you share?' }
  ]

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setScreen('stage7_1External')
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('everydaySharing', qId, val)
    setTimeout(() => {
      handleNext()
    }, 350)
  }

  const currentItem = questions[step]
  const currentAnswer = everydaySharing?.[currentItem.id]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Everyday Sharing · {step + 1} / {questions.length}</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="q-card"
              style={{ textAlign: 'left' }}
            >
              <p className="q-caption">Sharing resource: {currentItem.label}</p>
              <h1 className="q-text" style={{ marginBottom: '24px' }}>{currentItem.prompt}</h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {["Keep it to myself", "Share a little", "Share fully"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(currentItem.id, opt)}
                    className={`scale-opt ${currentAnswer === opt ? 'selected' : ''}`}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: currentAnswer === opt ? 'var(--dawn-glow)' : 'var(--panel-2)'
                    }}
                  >
                    <span>{opt}</span>
                    {currentAnswer === opt && <span style={{ color: 'var(--dawn)' }}>✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!currentAnswer}>
            {step < questions.length - 1 ? 'Next' : 'Continue'}
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
