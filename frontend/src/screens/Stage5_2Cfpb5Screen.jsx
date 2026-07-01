import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const CFPB5_1_SCALE = ['Describes me completely', 'Describes me very well', 'Describes me somewhat', 'Describes me very little', 'Not at all']
const CFPB5_2_SCALE = ['Always', 'Often', 'Sometimes', 'Rarely', 'Never']

const CFPB_ITEMS = [
  { id: 'c1', text: 'Because of my money situation, I feel like I will never have the things I want in life.', scale: CFPB5_1_SCALE, prompt: 'How well does this describe you?' },
  { id: 'c2', text: 'I am just getting by financially.', scale: CFPB5_1_SCALE, prompt: 'How well does this describe you?' },
  { id: 'c3', text: 'I am concerned that the money I have or will save won\'t last.', scale: CFPB5_1_SCALE, prompt: 'How well does this describe you?' },
  { id: 'c4', text: 'I have money left over at the end of the month.', scale: CFPB5_2_SCALE, prompt: 'How often is this true?' },
  { id: 'c5', text: 'My finances control my life.', scale: CFPB5_2_SCALE, prompt: 'How often is this true?' }
]

export default function Stage5_2Cfpb5Screen() {
  const { setScreen, setScaleAnswer, cfpb5 } = useLewisStore()
  const [qIdx, setQIdx] = useState(0)

  const currentItem = CFPB_ITEMS[qIdx]
  const currentAnswer = cfpb5?.[currentItem.id]

  const handleNext = () => {
    if (qIdx < CFPB_ITEMS.length - 1) {
      setQIdx(qIdx + 1)
    } else {
      setScreen('stage5_2Diener')
    }
  }

  const handleBack = () => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1)
    }
  }

  const handleSelect = (val) => {
    setScaleAnswer('cfpb5', currentItem.id, val)
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
        <p className="eyebrow">Financial Peace · {qIdx + 1} / {CFPB_ITEMS.length}</p>
        
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
              <p className="q-caption">{currentItem.prompt}</p>
              <h1 className="q-text">{currentItem.text}</h1>
              
              <div className="scale-grid" style={{ marginTop: '30px' }}>
                {currentItem.scale.map((opt, idx) => (
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
            {qIdx < CFPB_ITEMS.length - 1 ? 'Next' : 'Continue'}
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
