import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

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
        <h1 className="headline">Accomplishment & Agency</h1>
        <div style={{ gridArea: 'sub', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <TopicLineIllustration topic="gse" />
        </div>
        
        <div className="form-container" style={{ margin: '0 auto', width: '100%' }}>
          <div className="likert-container">
            {/* Step Counter & Progress Bar (Stationary) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--dawn)', textTransform: 'uppercase' }}>
                  AGENCY & CAPABILITY · {qIdx + 1} OF {GSE_ITEMS.length}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-mute)' }}>
                  {Math.round(((qIdx + 1) / GSE_ITEMS.length) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--dawn), #10b981)' }}
                  animate={{ width: `${((qIdx + 1) / GSE_ITEMS.length) * 100}%` }}
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

            <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontStyle: 'italic', margin: 0, textAlign: 'left' }}>
              Select how accurately this statement describes your general outlook.
            </p>
          </div>
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
