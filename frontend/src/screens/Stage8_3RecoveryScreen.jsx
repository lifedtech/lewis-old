import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage8_3RecoveryScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, recoveryResponsiveness } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_4Cumulative')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Recovery Responsiveness</h1>
        <p className="sub">When you rest or take time out, how do you feel?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <div className="chip-grid">
            <button onClick={() => setProfileField('recoveryResponsiveness', "Refreshed quickly")} className={`chip ${recoveryResponsiveness === "Refreshed quickly" ? 'selected' : ''}`}>Refreshed quickly</button>
            <button onClick={() => setProfileField('recoveryResponsiveness', "Takes a while to wind down")} className={`chip ${recoveryResponsiveness === "Takes a while to wind down" ? 'selected' : ''}`}>Takes a while to wind down</button>
            <button onClick={() => setProfileField('recoveryResponsiveness', "Never really feel rested")} className={`chip ${recoveryResponsiveness === "Never really feel rested" ? 'selected' : ''}`}>Never really feel rested</button>
            <button onClick={() => setProfileField('recoveryResponsiveness', "Guilty for resting")} className={`chip ${recoveryResponsiveness === "Guilty for resting" ? 'selected' : ''}`}>Guilty for resting</button>
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
