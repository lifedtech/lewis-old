import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const GSE_ITEMS = [
  { id: 'g1', text: 'I can always manage to solve difficult problems if I try hard enough.' },
  { id: 'g2', text: 'If someone opposes me, I can find the means and ways to get what I want.' },
  { id: 'g3', text: 'It is easy for me to stick to my aims and accomplish my goals.' },
  { id: 'g4', text: 'I am confident that I could deal efficiently with unexpected events.' },
  { id: 'g5', text: 'Thanks to my resourcefulness, I know how to handle unforeseen situations.' },
  { id: 'g6', text: 'I can solve most problems if I invest the necessary effort.' },
  { id: 'g7', text: 'I can remain calm when facing difficulties because I can rely on my coping abilities.' },
  { id: 'g8', text: 'When I am confronted with a problem, I can usually find several solutions.' },
  { id: 'g9', text: 'If I am in trouble, I can usually think of a solution.' },
  { id: 'g10', text: 'I can usually handle whatever comes my way.' }
]

const GSE_SCALE = ['Not at all true', 'Hardly true', 'Moderately true', 'Exactly true']

export default function Stage5_2GseScreen() {
  const { setScreen, setScaleAnswer, gse } = useLewisStore()
  const [qIdx, setQIdx] = useState(0)

  const currentItem = GSE_ITEMS[qIdx]
  const currentAnswer = gse?.[currentItem.id]

  const handleNext = () => {
    if (qIdx < GSE_ITEMS.length - 1) {
      setQIdx(qIdx + 1)
    } else {
      setScreen('stage5_2Promis')
    }
  }

  const handleBack = () => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1)
    }
  }

  const handleSelect = (val) => {
    setScaleAnswer('gse', currentItem.id, val)
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
        <p className="eyebrow">Accomplishment & Agency · {qIdx + 1} / {GSE_ITEMS.length}</p>
        
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
              <p className="q-caption">How true is this for you?</p>
              <h1 className="q-text">{currentItem.text}</h1>
              
              <div className="scale-grid" style={{ marginTop: '30px' }}>
                {GSE_SCALE.map((opt, idx) => (
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
            {qIdx < GSE_ITEMS.length - 1 ? 'Next' : 'Continue'}
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
