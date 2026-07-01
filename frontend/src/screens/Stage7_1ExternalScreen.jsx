import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage7_1ExternalScreen() {
  const { setScreen, updateObjectField, externalConditions } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_2Prior')
  }

  const conditions = [
    { key: 'noise', label: 'High Noise Pollution (traffic, construction, neighbors)' },
    { key: 'space', label: 'Cramped, dark, or cluttered living/work space' },
    { key: 'weather', label: 'Extreme weather/temperature stress (heat, cold)' },
    { key: 'commute', label: 'Long, chaotic, or exhausting daily commute' },
    { key: 'safety', label: 'Lack of neighborhood safety or personal privacy' },
    { key: 'none', label: 'None of the above - my surroundings are steady' }
  ]

  const handleToggle = (key) => {
    if (key === 'none') {
      // Clear other fields if "none" is clicked
      setProfileField('externalConditions', { none: true })
      return
    }
    const currentVal = externalConditions?.[key] || false
    const newConditions = { ...externalConditions, none: false, [key]: !currentVal }
    setProfileField('externalConditions', newConditions)
  }

  // Helper to read setProfileField
  const { setProfileField } = useLewisStore()

  const isActive = (key) => externalConditions?.[key] || false

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Environmental Context</p>
        <h1 className="headline">External Conditions</h1>
        <p className="sub">Select any environmental factors in your physical surroundings that actively contribute to your stress load.</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conditions.map(c => {
              const active = isActive(c.key)
              return (
                <button
                  key={c.key}
                  onClick={() => handleToggle(c.key)}
                  className={`scale-opt ${active ? 'selected' : ''}`}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: active ? 'var(--dawn-glow)' : 'var(--panel-2)'
                  }}
                >
                  <span style={{ textAlign: 'left', fontSize: '14px' }}>{c.label}</span>
                  {active && <span style={{ color: 'var(--dawn)' }}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button 
            className="btn-primary" 
            onClick={handleNext} 
            disabled={Object.values(externalConditions || {}).filter(Boolean).length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
