import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_11IntellectualScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, intellectualPulse } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_12Cultural')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Intellectual Pulse</h1>
        <p className="sub">When did you last do something that genuinely stretched your mind or sparked your curiosity?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>

          <textarea className="input-field" placeholder="Type here..." 
            value={intellectualPulse || ''} 
            onChange={(e) => setProfileField('intellectualPulse', e.target.value)} 
          />
        
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
