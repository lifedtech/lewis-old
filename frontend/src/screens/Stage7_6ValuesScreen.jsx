import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage7_6ValuesScreen() {
  const { setScreen, toggleArrayItem, valuesCheck } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_7FinancialAsp')
  }

  const values = [
    'Freedom & Autonomy',
    'Connection & Community',
    'Stability & Security',
    'Growth & Learning',
    'Health & Vitality',
    'Contribution & Impact',
    'Creativity & Flow',
    'Mindfulness & Peace'
  ]

  const isSelected = (val) => (valuesCheck || []).includes(val)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Action & Support</p>
        <h1 className="headline">Core Values</h1>
        <p className="sub">Select the values that are most essential to how you define a well-lived, healthy life. Choose all that apply.</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '600px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '12px' 
          }}>
            {values.map(val => (
              <button
                key={val}
                onClick={() => toggleArrayItem('valuesCheck', val)}
                className={`scale-opt ${isSelected(val) ? 'selected' : ''}`}
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isSelected(val) ? 'var(--dawn-glow)' : 'var(--panel-2)',
                  fontSize: '14px'
                }}
              >
                <span>{val}</span>
                {isSelected(val) && <span style={{ color: 'var(--dawn)' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button 
            className="btn-primary" 
            onClick={handleNext} 
            disabled={(valuesCheck || []).length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
