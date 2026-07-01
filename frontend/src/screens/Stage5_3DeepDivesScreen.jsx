import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_3DeepDivesScreen() {
  const { setScreen, updateObjectField, adaptiveDeepDives } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_4BrightSpot')
  }

  const areas = [
    { key: 'physical', label: 'Physical Ease & Sleep' },
    { key: 'emotional', label: 'Emotional & Stress Regulation' },
    { key: 'relationships', label: 'Relationships & Social Support' },
    { key: 'meaning', label: 'Meaning & Purpose' },
    { key: 'financial', label: 'Financial Security & Peace' }
  ]

  const handleToggle = (key) => {
    const currentVal = adaptiveDeepDives?.[key] || false
    updateObjectField('adaptiveDeepDives', key, !currentVal)
  }

  const selectedCount = Object.values(adaptiveDeepDives || {}).filter(Boolean).length

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Adaptive Deep Dives</h1>
        <p className="sub">Select the core areas you feel are most critical to examine and improve right now.</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {areas.map(a => {
              const active = adaptiveDeepDives?.[a.key] || false
              return (
                <button
                  key={a.key}
                  onClick={() => handleToggle(a.key)}
                  className={`scale-opt ${active ? 'selected' : ''}`}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: active ? 'var(--dawn-glow)' : 'var(--panel-2)'
                  }}
                >
                  <span>{a.label}</span>
                  {active && <span style={{ color: 'var(--dawn)' }}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={selectedCount === 0}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
