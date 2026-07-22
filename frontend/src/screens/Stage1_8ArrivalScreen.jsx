import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_8ArrivalScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, arrivalState } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_9Financial')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Arrival State</h1>
        <p className="sub">Before we go deeper - how would you describe arriving here today? One word, if you like.</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>

          <textarea className="input-field" placeholder="Type here..." 
            value={arrivalState || ''} 
            onChange={(e) => setProfileField('arrivalState', e.target.value)} 
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
