import React from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'

export default function PathSelectionScreen() {
  const { door, setDoor, setScreen } = useLewisStore()

  const handleBegin = () => {
    setScreen('scales')
  }

  return (
    <motion.section
      className="screen active"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>Step 3</p>
      <h1 className="headline" style={{ textAlign: 'center' }}>Choose your path</h1>
      <p className="sub" style={{ textAlign: 'center' }}>How deep would you like to go today?</p>

      <div className="choice-stack">
        <button
          className={`choice-card ${door === 'pulse' ? 'selected' : ''}`}
          onClick={() => setDoor('pulse')}
        >
          <div className="choice-top">
            <span className="choice-title">The Pulse</span>
            <span className="choice-meta">3–4 MIN</span>
          </div>
          <p className="choice-desc">A first reading — not the full picture.</p>
        </button>
        <button
          className={`choice-card ${door === 'full' ? 'selected' : ''}`}
          onClick={() => setDoor('full')}
        >
          <div className="choice-top">
            <span className="choice-title">Full LEWIS</span>
            <span className="choice-meta">18–20 MIN</span>
          </div>
          <p className="choice-desc">The complete landscape, at your pace.</p>
        </button>
      </div>

      <div className="spacer"></div>
      <button
        className="btn-primary"
        disabled={!door}
        onClick={handleBegin}
        style={{ alignSelf: 'center' }}
      >
        {door === 'pulse' ? 'Begin the Pulse' : door === 'full' ? 'Begin full LEWIS' : 'Choose a path to begin'}
      </button>
    </motion.section>
  )
}
