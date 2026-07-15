import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage7_7FinancialAspScreen() {
  const { setScreen, setProfileField, financialAspiration } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_8Friction')
  }

  const handleChange = (e) => {
    setProfileField('financialAspiration', e.target.value)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Financial Wellbeing</p>
        <h1 className="headline">Financial Aspirations</h1>
        <p className="sub">What is your primary financial goal or concern right now? How does this impact your day-to-day choices?</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <textarea
            value={financialAspiration}
            onChange={handleChange}
            placeholder="Describe your financial goals, plans, or concerns..."
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
          <button className="btn-primary" onClick={handleNext} disabled={!financialAspiration || !financialAspiration.trim()}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
