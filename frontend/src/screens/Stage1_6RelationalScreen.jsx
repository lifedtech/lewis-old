import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_6RelationalScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, relationalContext } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_7Priority')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Relational Context</h1>
        <p className="sub">How does your social world feel right now?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <div className="chip-grid">
            <button onClick={() => setProfileField('relationalContext', "Genuinely connected")} className={`chip ${relationalContext === "Genuinely connected" ? 'selected' : ''}`}>Genuinely connected</button>
            <button onClick={() => setProfileField('relationalContext', "Okay, but could be better")} className={`chip ${relationalContext === "Okay, but could be better" ? 'selected' : ''}`}>Okay, but could be better</button>
            <button onClick={() => setProfileField('relationalContext', "A bit lonely")} className={`chip ${relationalContext === "A bit lonely" ? 'selected' : ''}`}>A bit lonely</button>
            <button onClick={() => setProfileField('relationalContext', "Quite isolated")} className={`chip ${relationalContext === "Quite isolated" ? 'selected' : ''}`}>Quite isolated</button>
            <button onClick={() => setProfileField('relationalContext', "Overwhelming/Too much")} className={`chip ${relationalContext === "Overwhelming/Too much" ? 'selected' : ''}`}>Overwhelming/Too much</button>
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
