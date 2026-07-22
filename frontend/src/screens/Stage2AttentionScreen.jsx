import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import BreathingFluidBlob from '../components/BreathingFluidBlob.jsx'

export default function Stage2AttentionScreen() {
  const { setScreen, setProfileField } = useLewisStore()
  const [hits, setHits] = useState(0)
  const [color, setColor] = useState('white') // 'white' or 'orange'
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('Watch closely...')

  useEffect(() => {
    if (done) return

    // Loop to change color randomly
    const interval = setInterval(() => {
      const isOrange = Math.random() > 0.5
      setColor(isOrange ? 'orange' : 'white')
    }, 1200)

    return () => clearInterval(interval)
  }, [done])

  const handleOrbClick = () => {
    if (done) return
    if (color === 'orange') {
      const nextHits = hits + 1
      setHits(nextHits)
      setMessage('Nice hit!')
      if (nextHits >= 3) {
        setDone(true)
        setMessage('Focus calibrated successfully!')
      }
    } else {
      setHits(0)
      setMessage('Ooops! Click only on Orange!')
    }
  }

  const handleNext = () => {
    setProfileField('attentionDriftDone', true)
    setScreen('stage3_1Affect')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Attention Calibration</h1>
        <p className="sub">This calibrates your cognitive presence. Tap the fluid blob ONLY when it turns <span style={{ color: 'var(--dawn)' }}>Orange</span>.</p>
        
        <div className="form-container" style={{ margin: '3rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-mute)', marginBottom: '1rem' }}>
            Score: {hits} / 3
          </div>

          <div className="ring-wrap" style={{ margin: '1rem 0', cursor: 'pointer' }} onClick={handleOrbClick}>
            <BreathingFluidBlob 
              size={150} 
              scaleOverride={color === 'orange' ? 1.25 : 1.0}
              customColor={color === 'orange' ? '#FF9466' : null}
              interactive={true}
            />
          </div>

          <p className="sub" style={{ fontSize: '16px', color: done ? 'var(--dawn)' : 'var(--text-mute)', minHeight: '24px', marginTop: '1.5rem' }}>
            {message}
          </p>

        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!done}>
            {done ? 'Continue to Affect Canvas' : 'Calibrating Focus...'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
