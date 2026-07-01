import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage3_6BodyAwarenessScreen() {
  const { setScreen, setProfileField, bodyAwareness } = useLewisStore()

  const handleNext = () => {
    setScreen('stage4Maze')
  }

  const options = [
    { label: 'Disconnected', desc: 'You feel detached from physical sensations, or mostly in your head.' },
    { label: 'Slightly aware', desc: 'You feel some tension or physical signals, but they are easy to ignore.' },
    { label: 'Fully present', desc: 'You feel highly connected to somatic sensations, heartbeats, and tension shifts.' }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Somatic Connection</h1>
        <p className="sub">How connected do you feel to your physical body right now?</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {options.map(opt => (
            <button
              key={opt.label}
              onClick={() => setProfileField('bodyAwareness', opt.label)}
              className={`scale-opt ${bodyAwareness === opt.label ? 'selected' : ''}`}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
                background: bodyAwareness === opt.label ? 'var(--dawn-glow)' : 'var(--panel-2)'
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '15px' }}>{opt.label}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-mute)' }}>{opt.desc}</span>
            </button>
          ))}
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={!bodyAwareness}>
            Continue to Maze
          </button>
        </div>
      </div>
    </motion.div>
  )
}
