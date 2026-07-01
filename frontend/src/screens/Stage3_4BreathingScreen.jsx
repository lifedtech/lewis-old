import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const TOTAL = 24
const CYCLE = 8
const CIRCUMFERENCE = 615.75

export default function Stage3_4BreathingScreen() {
  const { setScreen, setProfileField, breathingBefore, breathingAfter } = useLewisStore()
  
  const [step, setStep] = useState('before') // 'before' | 'exercise' | 'after'
  const [remaining, setRemaining] = useState(TOTAL)
  const [isFinished, setIsFinished] = useState(false)

  const finishBreathing = useCallback(() => {
    setIsFinished(true)
    setStep('after')
  }, [])

  useEffect(() => {
    if (step !== 'exercise') return
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
  }, [remaining, finishBreathing, step])

  const elapsed = TOTAL - remaining
  const phase = elapsed % CYCLE
  const breatheText = phase < CYCLE / 2 ? 'Breathe in' : 'Breathe out'
  const cycleNum = Math.min(3, Math.floor(elapsed / CYCLE) + 1)
  const offset = CIRCUMFERENCE * (1 - remaining / TOTAL)

  const handleSkip = () => {
    setRemaining(0)
    finishBreathing()
  }

  const handleNext = () => {
    setScreen('stage3_5NsState')
  }

  const handleBeforeSelect = (val) => {
    setProfileField('breathingBefore', val)
    setStep('exercise')
  }

  const handleAfterSelect = (val) => {
    setProfileField('breathingAfter', val)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Mindful Breathing</h1>
        
        {step === 'before' && (
          <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
            <p className="sub" style={{ marginBottom: '2rem' }}>Let's check in. How would you describe your breathing right now?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Shallow & Fast', 'Normal / Average', 'Deep & Calm'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleBeforeSelect(opt)}
                  className={`scale-opt ${breathingBefore === opt ? 'selected' : ''}`}
                  style={{ padding: '16px 20px', background: 'var(--panel-2)' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'exercise' && (
          <div className="breathe-stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem auto' }}>
            <div className="ring-wrap" style={{ position: 'relative' }}>
              <svg className="ring-svg" viewBox="0 0 208 208" style={{ width: '208px', height: '208px' }}>
                <circle className="ring-track" cx="104" cy="104" r="98" fill="none" stroke="var(--panel-border)" strokeWidth="6"></circle>
                <circle 
                  className="ring-progress" 
                  cx="104" cy="104" r="98"
                  fill="none"
                  stroke="var(--dawn)"
                  strokeWidth="6"
                  strokeDasharray={CIRCUMFERENCE} 
                  strokeDashoffset={offset}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                ></circle>
              </svg>
              <motion.div 
                className="orb orb--lg"
                animate={{ 
                  scale: phase < CYCLE / 2 ? [1, 1.25] : [1.25, 1],
                }}
                transition={{ duration: CYCLE / 2, ease: "easeInOut" }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </div>
            
            <div className="breathe-label" style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginTop: '20px' }}>{breatheText}</div>
            <div className="cycle-label" style={{ fontSize: '14px', color: 'var(--text-mute)', marginTop: '8px' }}>Cycle {cycleNum} of 3</div>
            
            <button className="btn-ghost" onClick={handleSkip} style={{ marginTop: '2rem' }}>Skip Exercise</button>
          </div>
        )}

        {step === 'after' && (
          <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
            <p className="sub" style={{ marginBottom: '2rem' }}>Exercise complete. How settled do you feel now compared to before?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['More settled', 'About the same', 'Less settled'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAfterSelect(opt)}
                  className={`scale-opt ${breathingAfter === opt ? 'selected' : ''}`}
                  style={{ padding: '16px 20px', background: 'var(--panel-2)' }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="button-group" style={{ marginTop: '3rem' }}>
              <button className="btn-primary" onClick={handleNext} disabled={!breathingAfter}>
                Continue Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
