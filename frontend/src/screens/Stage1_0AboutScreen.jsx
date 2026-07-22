import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_0AboutScreen() {
  const { setScreen, setProfileField, ageCategory, gender } = useLewisStore()
  const [name, setName] = useState('')

  const handleNext = () => {
    if (!name.trim()) return
    setProfileField('name', name.trim())
    setScreen('stage1_1Identity')
  }

  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
  const sexes = ['Female', 'Male', 'Intersex', 'Prefer not to say']

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline" style={{ marginBottom: '4px' }}>About You</h1>
        <p className="sub" style={{ marginBottom: '10px' }}>Let's set up your profile.</p>
        
        <div className="form-container" style={{ margin: '0.5rem auto', gap: '12px' }}>
          <div className="form-group" style={{ textAlign: 'center' }}>
            <label>What would you like to be called?</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNext();
                }
              }}
              className="input-field" 
              placeholder="Your name"
            />
          </div>

          <div className="form-group" style={{ textAlign: 'center' }}>
            <label>Which age group are you in? (Optional)</label>
            <div className="chip-grid" style={{ gap: '8px' }}>
              {ageGroups.map(group => (
                <button
                  key={group}
                  onClick={() => setProfileField('ageCategory', group)}
                  className={`chip ${ageCategory === group ? 'selected' : ''}`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'center' }}>
            <label>What is your sex? (Optional)</label>
            <div className="chip-grid" style={{ gap: '8px' }}>
              {sexes.map(sex => (
                <button
                  key={sex}
                  onClick={() => setProfileField('gender', sex)}
                  className={`chip ${gender === sex ? 'selected' : ''}`}
                >
                  {sex}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="button-group" style={{ marginTop: '1rem' }}>
          <button 
            className="btn-primary" 
            onClick={handleNext}
            disabled={!name.trim()}
            style={{ opacity: !name.trim() ? 0.5 : 1, cursor: !name.trim() ? 'not-allowed' : 'pointer' }}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
