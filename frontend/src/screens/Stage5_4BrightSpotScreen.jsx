import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_4BrightSpotScreen() {
  const { setScreen, setProfileField, brightSpotCheck } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_5PriorityTension')
  }

  const handleChange = (e) => {
    setProfileField('brightSpotCheck', e.target.value)
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
        <h1 className="headline">Your Bright Spot</h1>
        <p className="sub">What is currently your greatest source of resilience, calm, or strength? How does it protect you during difficult weeks?</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <textarea
            value={brightSpotCheck}
            onChange={handleChange}
            placeholder="Write your thoughts here..."
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
          <button className="btn-primary" onClick={handleNext}>
            {brightSpotCheck && brightSpotCheck.trim() ? 'Continue' : 'Skip'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
