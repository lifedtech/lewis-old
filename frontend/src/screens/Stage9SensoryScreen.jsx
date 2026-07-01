import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage9SensoryScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, soundPreference } = useLewisStore()

  const handleNext = () => {
    setScreen('stage9QuickChoices')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Sound & Sensory Check-in</h1>
        <p className="sub">Listen for a moment. Which feels best to you?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <div className="chip-grid">
            <button onClick={() => setProfileField('soundPreference', "Forest ambience")} className={`chip ${soundPreference === "Forest ambience" ? 'selected' : ''}`}>Forest ambience</button>
            <button onClick={() => setProfileField('soundPreference', "Ocean waves")} className={`chip ${soundPreference === "Ocean waves" ? 'selected' : ''}`}>Ocean waves</button>
            <button onClick={() => setProfileField('soundPreference', "Binaural beats / White noise")} className={`chip ${soundPreference === "Binaural beats / White noise" ? 'selected' : ''}`}>Binaural beats / White noise</button>
            <button onClick={() => setProfileField('soundPreference', "Silence")} className={`chip ${soundPreference === "Silence" ? 'selected' : ''}`}>Silence</button>
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
