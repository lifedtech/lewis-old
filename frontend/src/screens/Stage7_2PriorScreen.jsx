import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage7_2PriorScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, priorAttempts } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_3Aspiration')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Prior Attempts</h1>
        <p className="sub">Have you tried to improve your wellbeing recently?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <div className="chip-grid">
            <button onClick={() => setProfileField('priorAttempts', "Yes, actively")} className={`chip ${priorAttempts === "Yes, actively" ? 'selected' : ''}`}>Yes, actively</button>
            <button onClick={() => setProfileField('priorAttempts', "On and off")} className={`chip ${priorAttempts === "On and off" ? 'selected' : ''}`}>On and off</button>
            <button onClick={() => setProfileField('priorAttempts', "Not really")} className={`chip ${priorAttempts === "Not really" ? 'selected' : ''}`}>Not really</button>
            <button onClick={() => setProfileField('priorAttempts', "It feels too overwhelming")} className={`chip ${priorAttempts === "It feels too overwhelming" ? 'selected' : ''}`}>It feels too overwhelming</button>
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
