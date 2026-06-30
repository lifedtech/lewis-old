import React from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'

export default function WelcomeScreen() {
  const { setScreen } = useLewisStore()

  const handleBegin = () => {
    setScreen('ageGate')
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ display: 'flex' }}
    >
      <h1 className="headline" style={{ marginTop: '32px' }}>Welcome to LEWIS</h1>
      <p className="sub">Understanding yourself is the first step to feel better.</p>

      <div className="spacer"></div>

      <div className="orb-wrap" style={{ margin: '0 auto' }}>
        <div className="orb orb--xl" style={{ boxShadow: '0 0 80px rgba(230,123,94,0.3)' }}></div>
      </div>
      
      <div className="spacer"></div>

      <div className="trust-row" style={{ marginBottom: '24px', justifyContent: 'center' }}>
        <span className="trust-pill">🔬 Science-backed</span>
        <span className="trust-pill">🔒 Private</span>
        <span className="trust-pill">🧠 Adaptive</span>
        <span className="trust-pill">✨ Non-clinical</span>
      </div>

      <button 
        className="btn-primary" 
        onClick={handleBegin}
        style={{ marginBottom: '16px', alignSelf: 'center', width: '100%', maxWidth: '300px' }}
      >
        Let's begin
      </button>

      <p className="sub" style={{ fontStyle: 'italic', opacity: 0.6, fontSize: '13px', marginTop: 0, textAlign: 'center' }}>
        This is your space. Everything here is private and completely yours.
      </p>
    </motion.section>
  )
}
