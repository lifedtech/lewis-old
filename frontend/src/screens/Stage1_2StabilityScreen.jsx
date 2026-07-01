import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_2StabilityScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, lifeStability } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_3Pressures')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Life Stability Spectrum</h1>
        <p className="sub">How would you describe where life feels right now?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-mute)' }}>Very turbulent</span>
            <input type="range" min="0" max="100" 
              value={lifeStability || 50} 
              onChange={(e) => setProfileField('lifeStability', parseInt(e.target.value))} 
              style={{ flex: 1, accentColor: 'var(--dawn)' }} 
            />
            <span style={{ fontSize: '13px', color: 'var(--text-mute)' }}>Very steady</span>
          </div>
        
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
