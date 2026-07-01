import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const PROMIS_ITEMS = [
  { id: 'pr1', text: 'My life has meaning.' },
  { id: 'pr2', text: 'I have a sense of direction in my life.' },
  { id: 'pr3', text: 'My life has purpose.' },
  { id: 'pr4', text: 'The things I do in my life are worthwhile.' }
]

const PROMIS_SCALE = ['Not at all', 'A little bit', 'Somewhat', 'Quite a bit', 'Very much']

export default function Stage5_2PromisScreen() {
  const { setScreen, setScaleAnswer, promis } = useLewisStore()
  const [qIdx, setQIdx] = useState(0)

  const currentItem = PROMIS_ITEMS[qIdx]
  const currentAnswer = promis?.[currentItem.id]

  const handleNext = () => {
    if (qIdx < PROMIS_ITEMS.length - 1) {
      setQIdx(qIdx + 1)
    } else {
      setScreen('stage5_2Cfpb5')
    }
  }

  const handleBack = () => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1)
    }
  }

  const handleSelect = (val) => {
    setScaleAnswer('promis', currentItem.id, val)
    setTimeout(() => {
      handleNext()
    }, 350)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Meaning & Purpose · {qIdx + 1} / {PROMIS_ITEMS.length}</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
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
              <p className="q-caption">Think about the past 7 days. How much do you agree?</p>
              <h1 className="q-text">{currentItem.text}</h1>
              
              <div className="scale-grid" style={{ marginTop: '30px' }}>
                {PROMIS_SCALE.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`scale-opt ${currentAnswer === opt ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!currentAnswer}>
            {qIdx < PROMIS_ITEMS.length - 1 ? 'Next' : 'Continue'}
          </button>
          {qIdx > 0 && (
            <button className="btn-ghost" onClick={handleBack}>
              Back
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
