import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

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
        <h1 className="headline">Financial Peace</h1>
        <div style={{ gridArea: 'sub', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <TopicLineIllustration topic="cfpb5" />
        </div>
        
        <div className="form-container" style={{ margin: '0 auto', width: '100%' }}>
          <div className="likert-container">
            {/* Step Counter & Progress Bar (Stationary) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--dawn)', textTransform: 'uppercase' }}>
                  FINANCIAL PEACE · {qIdx + 1} OF {CFPB_ITEMS.length}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-mute)' }}>
                  {Math.round(((qIdx + 1) / CFPB_ITEMS.length) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--dawn), #10b981)' }}
                  animate={{ width: `${((qIdx + 1) / CFPB_ITEMS.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* ONLY Question Prompt & Choices animate transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
              >
                <p className="likert-prompt">{currentItem.text}</p>
                
                <div className="scale-grid" style={{ marginTop: '8px' }}>
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

            <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontStyle: 'italic', margin: 0, textAlign: 'left' }}>
              {currentItem.prompt}
            </p>
          </div>
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
