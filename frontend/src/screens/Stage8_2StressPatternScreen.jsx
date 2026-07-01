import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage8_2StressPatternScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, stressPatternClusters } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_3Recovery')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Stress-Pattern Clusters</h1>
        <p className="sub">Select any that feel true for you lately.</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <div className="chip-grid">
            <button onClick={() => toggleArrayItem('stressPatternClusters', "The Surge")} className={`chip ${(stressPatternClusters || []).includes("The Surge") ? 'selected' : ''}`}>The Surge</button>
            <button onClick={() => toggleArrayItem('stressPatternClusters', "The Flatline")} className={`chip ${(stressPatternClusters || []).includes("The Flatline") ? 'selected' : ''}`}>The Flatline</button>
            <button onClick={() => toggleArrayItem('stressPatternClusters', "The Fog")} className={`chip ${(stressPatternClusters || []).includes("The Fog") ? 'selected' : ''}`}>The Fog</button>
            <button onClick={() => toggleArrayItem('stressPatternClusters', "The Cycle")} className={`chip ${(stressPatternClusters || []).includes("The Cycle") ? 'selected' : ''}`}>The Cycle</button>
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
