import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_14SensoryPauseScreen() {
  const { setScreen, setProfileField } = useLewisStore()
  const [timeLeft, setTimeLeft] = useState(10)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setDone(true)
      return
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleNext = () => {
    setProfileField('sensoryPauseDone', true)
    setScreen('stage2Attention')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Sensory Pause</h1>
        <p className="sub">Allow yourself a brief moment to reset. Just breathe in sync with the pulsing orb.</p>
        
        <div className="form-container" style={{ margin: '3rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="ring-wrap" style={{ margin: '2rem 0' }}>
            <motion.div 
              className="orb orb--lg"
              animate={{ 
                scale: [1, 1.3, 1],
                boxShadow: ['0 0 20px rgba(255,148,102,0.4)', '0 0 40px rgba(255,148,102,0.8)', '0 0 20px rgba(255,148,102,0.4)']
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <p className="sub" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--dawn)' }}>
            {timeLeft > 0 ? `Settle in... ${timeLeft}s` : 'Pause complete'}
          </p>

        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!done}>
            {done ? 'Continue Journey' : 'Calibrating...'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
