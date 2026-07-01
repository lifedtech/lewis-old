import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_4BodyScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, bodyMovement, sleepQuality } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_5Who5')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Body & Movement Context</h1>
        <p className="sub">How has your body been lately?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>

          <div className="likert-container" style={{ marginBottom: '16px' }}>
              <p className="likert-prompt">How active has your body been lately?</p>
              <div className="likert-options">
                  <button 
                    className={`likert-btn ${bodyMovement === 'very_active' ? 'selected' : ''}`}
                    onClick={() => setProfileField('bodyMovement', 'very_active')}
                  >Very active</button>
                  <button 
                    className={`likert-btn ${bodyMovement === 'moderate' ? 'selected' : ''}`}
                    onClick={() => setProfileField('bodyMovement', 'moderate')}
                  >Moderately active</button>
                  <button 
                    className={`likert-btn ${bodyMovement === 'sedentary' ? 'selected' : ''}`}
                    onClick={() => setProfileField('bodyMovement', 'sedentary')}
                  >Mostly sedentary</button>
              </div>
          </div>

          <div className="likert-container">
              <p className="likert-prompt">How has your sleep been?</p>
              <div className="likert-options">
                  <button 
                    className={`likert-btn ${sleepQuality === 'good' ? 'selected' : ''}`}
                    onClick={() => setProfileField('sleepQuality', 'good')}
                  >Consistently good</button>
                  <button 
                    className={`likert-btn ${sleepQuality === 'mixed' ? 'selected' : ''}`}
                    onClick={() => setProfileField('sleepQuality', 'mixed')}
                  >Mixed/Okay</button>
                  <button 
                    className={`likert-btn ${sleepQuality === 'poor' ? 'selected' : ''}`}
                    onClick={() => setProfileField('sleepQuality', 'poor')}
                  >Struggling</button>
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
