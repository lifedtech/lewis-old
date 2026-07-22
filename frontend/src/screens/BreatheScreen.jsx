import React, { useState, useEffect, useCallback } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'
import BreathingFluidBlob from '../components/BreathingFluidBlob.jsx'

const TOTAL = 24
const CYCLE = 8
const CIRCUMFERENCE = 615.75

export default function BreatheScreen() {
  const { setScreen, settled, setSettled } = useLewisStore()
  
  const [remaining, setRemaining] = useState(TOTAL)
  const [isFinished, setIsFinished] = useState(false)

  const finishBreathing = useCallback(() => {
    setIsFinished(true)
  }, [])

  useEffect(() => {
    if (remaining <= 0) {
      finishBreathing()
      return
    }

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          finishBreathing()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [remaining, finishBreathing])

  const elapsed = TOTAL - remaining
  const phase = elapsed % CYCLE
  const breatheText = isFinished ? 'Settled' : (phase < CYCLE / 2 ? 'Breathe in' : 'Breathe out')
  
  const cycleNum = Math.min(3, Math.floor(elapsed / CYCLE) + 1)
  const offset = CIRCUMFERENCE * (1 - remaining / TOTAL)

  const handleSkip = () => {
    setRemaining(0)
    finishBreathing()
  }

  const handleContinue = () => {
    setScreen('landscape')
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ display: 'flex' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>A minute to settle</p>
      
      <div className="breathe-stage">
        <div className="ring-wrap">
          <svg className="ring-svg" viewBox="0 0 208 208">
            <circle className="ring-track" cx="104" cy="104" r="98"></circle>
            <circle 
              className="ring-progress" 
              cx="104" cy="104" r="98"
              strokeDasharray={CIRCUMFERENCE} 
              strokeDashoffset={offset}
            ></circle>
          </svg>
          <div style={{ position: 'absolute', inset: 0, margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BreathingFluidBlob size={120} />
          </div>
        </div>
        
        <div className="breathe-label">{breatheText}</div>
        {!isFinished && <div className="cycle-label">Cycle {cycleNum} of 3</div>}
        
        <p className="sub" style={{ marginTop: '18px' }}>
          This isn't measuring you. It's just a minute to settle.
        </p>

        <div className={`settled-block ${isFinished ? 'active' : ''}`}>
          <p className="q-text" style={{ textAlign: 'center' }}>How settled do you feel now?</p>
          <div className="settled-row">
            {[
              { id: 'more', label: 'More settled' },
              { id: 'same', label: 'About the same' },
              { id: 'less', label: 'Less settled' },
            ].map(opt => (
              <button 
                key={opt.id}
                className={`settled-opt ${settled === opt.id ? 'selected' : ''}`}
                onClick={() => setSettled(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isFinished && (
        <button className="btn-ghost" onClick={handleSkip}>Skip ahead</button>
      )}
      
      <button 
        className="btn-primary" 
        style={{ marginTop: '10px' }} 
        disabled={!isFinished || !settled}
        onClick={handleContinue}
      >
        Continue
      </button>
    </motion.section>
  )
}
