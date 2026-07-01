import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage8_1EnergyArcScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField,  } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_2StressPattern')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Energy Arc Mapping</h1>
        <p className="sub">Where's your energy, typically?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>

        {['morning', 'afternoon', 'evening', 'night'].map(timeOfDay => (
            <div key={timeOfDay} className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ textTransform: 'capitalize' }}>{timeOfDay}</label>
                <div className="chip-grid" style={{ justifyContent: 'flex-start' }}>
                    {['High', 'Medium', 'Low'].map(level => (
                        <button key={level} 
                            onClick={() => updateObjectField('energyArc', timeOfDay, level)} 
                            className={`chip ${useLewisStore.getState().energyArc?.[timeOfDay] === level ? 'selected' : ''}`}
                        >{level}</button>
                    ))}
                </div>
            </div>
        ))}
        
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
