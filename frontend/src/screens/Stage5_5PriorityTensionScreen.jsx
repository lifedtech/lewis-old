import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_5PriorityTensionScreen() {
  const { setScreen, setProfileField, priorityTensionCheck } = useLewisStore()

  const handleNext = () => {
    setScreen('stage6Sharing')
  }

  const handleChange = (e) => {
    setProfileField('priorityTensionCheck', e.target.value)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Qualitative Reflection</p>
        <h1 className="headline">Priority Tension</h1>
        <p className="sub">Where do you experience the biggest friction or "gap" between your listed priorities and where your daily energy actually goes?</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <textarea
            value={priorityTensionCheck}
            onChange={handleChange}
            placeholder="Describe the tension or imbalance you feel..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--panel-border)',
              background: 'var(--panel-2)',
              color: 'var(--text)',
              fontSize: '15px',
              lineHeight: '1.6',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--dawn)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--panel-border)'}
          />
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!priorityTensionCheck || !priorityTensionCheck.trim()}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
