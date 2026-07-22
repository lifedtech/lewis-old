import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage7_4SupportScreen() {
  const { setScreen, toggleArrayItem, supportPreferences } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_5Planner')
  }

  const options = [
    { id: 'coaching', label: 'Coaching & Professional guidance' },
    { id: 'selfGuided', label: 'Self-guided tools & Digital trackers' },
    { id: 'community', label: 'Community & Peer groups' },
    { id: 'therapy', label: 'Clinical support or Therapy' }
  ]

  const isSelected = (id) => (supportPreferences || []).includes(id)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <style>{`.main-card .content-wrapper h1.headline::before { content: "SELECT ALL THAT APPLY" !important; }`}</style>
        <h1 className="headline">Support Preferences</h1>
        <p className="sub">What kind of support is most helpful to you when adopting new health behaviors or stress management habits?</p>
        
        <div className="form-container" style={{ margin: '0 auto', maxWidth: '500px', width: '100%' }}>
          <p className="eyebrow" style={{ textAlign: 'left', marginBottom: '16px' }}>Action & Support</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleArrayItem('supportPreferences', opt.id)}
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
            disabled={(supportPreferences || []).length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
