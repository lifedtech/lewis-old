import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage7_5PlannerScreen() {
  const { setScreen, setProfileField, plannerReadiness } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_6Values')
  }

  const options = [
    { id: 'ready', label: 'Ready to start today', desc: 'I am motivated and have immediate capacity to build new routines.' },
    { id: 'reflect', label: 'Need time to reflect', desc: 'I want to plan first and clear some space before taking active steps.' },
    { id: 'exploring', label: 'Just exploring', desc: 'I am gathering information and checking my baseline, but not ready to commit.' }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Readiness for Action</h1>
        <p className="sub">How prepared do you feel to integrate small wellness habits or changes into your calendar starting this week?</p>
        
        <div className="form-container" style={{ margin: '0 auto', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p className="eyebrow" style={{ textAlign: 'left', marginBottom: '4px' }}>Action & Support</p>
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setProfileField('plannerReadiness', opt.id)}
              className={`scale-opt ${plannerReadiness === opt.id ? 'selected' : ''}`}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
                background: plannerReadiness === opt.id ? 'var(--dawn-glow)' : 'var(--panel-2)'
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '15px' }}>{opt.label}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-mute)' }}>{opt.desc}</span>
            </button>
          ))}
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!plannerReadiness}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
