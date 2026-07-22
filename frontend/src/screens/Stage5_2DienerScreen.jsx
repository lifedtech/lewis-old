import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { AGREEMENT_5 } from '../constants/scales.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

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
        <div style={{ gridArea: 'sub', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <TopicLineIllustration topic="diener" />
        </div>
        
        <div className="form-container" style={{ margin: '0 auto', width: '100%' }}>
          <div className="likert-container">
            {/* Step Counter & Progress Bar (Stationary) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--dawn)', textTransform: 'uppercase' }}>
                  FLOURISHING & GROWTH · {step + 1} OF {questions.length}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-mute)' }}>
                  {Math.round(((step + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--dawn), #10b981)' }}
                  animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
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
                <p className="likert-prompt">{questions[step].prompt}</p>
                <div className="likert-options">
                  {AGREEMENT_5.map(opt => {
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
              </motion.div>
            </AnimatePresence>

            <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontStyle: 'italic', margin: 0, textAlign: 'left' }}>
              Select how strongly you agree with this reflection.
            </p>
          </div>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!diener?.[questions[step].id]}>
            {step < 7 ? 'Next' : 'Continue'}
          </button>

        </div>
      </div>
    </motion.div>
  )
}
