import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage3_5NsStateScreen() {
  const { setScreen, setProfileField, nervousSystemState } = useLewisStore()

  const handleNext = () => {
    setScreen('stage3_6BodyAwareness')
  }

  const states = [
    {
      id: 'ventral',
      title: 'Safe & Social (Ventral Vagal)',
      desc: 'You feel calm, connected, grounded, and open to the environment and others around you.',
      tag: 'Calm & Present'
    },
    {
      id: 'sympathetic',
      title: 'Mobilized / Fight-or-Flight (Sympathetic)',
      desc: 'You feel anxious, hyper-alert, frustrated, or physically driven. Mind is racing, body is tense.',
      tag: 'Hyperactive / Active'
    },
    {
      id: 'dorsal',
      title: 'Shutdown / Immobilized (Dorsal Vagal)',
      desc: 'You feel numb, exhausted, flat, or socially checked out. Moving feels like pulling weights.',
      tag: 'Low Energy / Numb'
    }
  ]

  const handleSelect = (id) => {
    setProfileField('nervousSystemState', id)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Nervous System State</h1>
        <p className="sub">Select the autonomic baseline that feels most true to your experience right now.</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {states.map(s => {
            const selected = nervousSystemState === s.id
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={`scale-opt ${selected ? 'selected' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  padding: '18px 24px',
                  background: selected ? 'var(--dawn-glow)' : 'var(--panel-2)',
                  borderRadius: '16px'
                }}
              >
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px', color: selected ? 'var(--dawn)' : 'var(--text)' }}>{s.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-mute)', background: 'var(--panel-border)', padding: '2px 8px', borderRadius: '12px' }}>{s.tag}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-sub)', margin: 0, lineHeight: '1.4' }}>{s.desc}</p>
              </button>
            )
          })}
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!nervousSystemState}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
