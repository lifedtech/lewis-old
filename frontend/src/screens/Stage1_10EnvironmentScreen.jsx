import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_10EnvironmentScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField,  } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_11Intellectual')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Environmental Pulse</h1>
        <p className="sub">How does your physical environment feel right now?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>

        <div className="form-group">
            <label>Do you have regular access to nature or green spaces?</label>
            <div className="chip-grid" style={{ justifyContent: 'flex-start' }}>
                {['Yes, easily', 'Occasionally', 'Rarely'].map(opt => (
                    <button key={opt} onClick={() => updateObjectField('environmentalPulse', 'natureAccess', opt)} className={`chip ${useLewisStore.getState().environmentalPulse?.natureAccess === opt ? 'selected' : ''}`}>{opt}</button>
                ))}
            </div>
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
