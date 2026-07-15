import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage7_8FrictionScreen() {
  const { setScreen, toggleArrayItem, flags } = useLewisStore()

  const handleNext = () => {
    setScreen('stage8_1EnergyArc')
  }

  const options = [
    { id: 'money_friction', label: 'Money or financial stress' },
    { id: 'chronic_pain', label: 'Chronic pain or physical discomfort' },
    { id: 'feel_stuck', label: 'Feeling stuck in a rut' },
    { id: 'cant_follow_through', label: 'Trouble following through on plans' },
    { id: 'not_in_control', label: 'Feeling out of control of my time' },
    { id: 'too_drained', label: 'Too drained for anything new' },
    { id: 'standing_still', label: 'Just standing still right now' },
    { id: 'none', label: 'None of the above' }
  ]

  const currentFlags = flags || []
  
  const handleToggle = (id) => {
    if (id === 'none') {
      if (!currentFlags.includes('none')) {
        currentFlags.forEach(f => toggleArrayItem('flags', f))
        toggleArrayItem('flags', 'none')
      } else {
        toggleArrayItem('flags', 'none')
      }
    } else {
      if (currentFlags.includes('none')) {
        toggleArrayItem('flags', 'none')
      }
      toggleArrayItem('flags', id)
    }
  }

  const isSelected = (id) => currentFlags.includes(id)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Action & Support</p>
        <h1 className="headline">Friction & Barriers</h1>
        <p className="sub">What feels like the biggest point of friction when it comes to making changes? Select any that apply.</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleToggle(opt.id)}
                className={`scale-opt ${isSelected(opt.id) ? 'selected' : ''}`}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isSelected(opt.id) ? 'var(--dawn-glow)' : 'var(--panel-2)'
                }}
              >
                <span>{opt.label}</span>
                {isSelected(opt.id) && <span style={{ color: 'var(--dawn)' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button 
            className="btn-primary" 
            onClick={handleNext} 
            disabled={currentFlags.length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
