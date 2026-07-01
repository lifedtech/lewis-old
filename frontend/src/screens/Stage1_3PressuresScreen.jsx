import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_3PressuresScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, activePressures } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_4Body')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Active Life Pressures</h1>
        <p className="sub">What's pressing on you most right now? Select all that apply.</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <div className="chip-grid">
            <button onClick={() => toggleArrayItem('activePressures', "Workload")} className={`chip ${(activePressures || []).includes("Workload") ? 'selected' : ''}`}>Workload</button>
            <button onClick={() => toggleArrayItem('activePressures', "Financial pressure")} className={`chip ${(activePressures || []).includes("Financial pressure") ? 'selected' : ''}`}>Financial pressure</button>
            <button onClick={() => toggleArrayItem('activePressures', "Relationship strain")} className={`chip ${(activePressures || []).includes("Relationship strain") ? 'selected' : ''}`}>Relationship strain</button>
            <button onClick={() => toggleArrayItem('activePressures', "Health concerns")} className={`chip ${(activePressures || []).includes("Health concerns") ? 'selected' : ''}`}>Health concerns</button>
            <button onClick={() => toggleArrayItem('activePressures', "Caring responsibilities")} className={`chip ${(activePressures || []).includes("Caring responsibilities") ? 'selected' : ''}`}>Caring responsibilities</button>
            <button onClick={() => toggleArrayItem('activePressures', "Housing issues")} className={`chip ${(activePressures || []).includes("Housing issues") ? 'selected' : ''}`}>Housing issues</button>
            <button onClick={() => toggleArrayItem('activePressures', "Time scarcity")} className={`chip ${(activePressures || []).includes("Time scarcity") ? 'selected' : ''}`}>Time scarcity</button>
            <button onClick={() => toggleArrayItem('activePressures', "World events")} className={`chip ${(activePressures || []).includes("World events") ? 'selected' : ''}`}>World events</button>
            <button onClick={() => toggleArrayItem('activePressures', "Nothing specific")} className={`chip ${(activePressures || []).includes("Nothing specific") ? 'selected' : ''}`}>Nothing specific</button>
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
