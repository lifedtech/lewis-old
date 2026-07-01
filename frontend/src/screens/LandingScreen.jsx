import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function LandingScreen() {
  const { setScreen } = useLewisStore()

  const handleNext = () => {
    setScreen('preStage0Age')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.8), var(--bg-main))'
      }}
    >
      <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="orb-wrap"
          style={{ marginBottom: '2rem' }}
        >
          <div className="orb orb--lg" style={{ boxShadow: '0 0 80px rgba(230,123,94,0.3)' }}></div>
        </motion.div>

        <h1 className="headline" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 400 }}>
          Welcome to LEWIS
        </h1>
        
        <p className="sub" style={{ fontSize: '1.4rem', marginBottom: '3rem', maxWidth: '600px', color: 'var(--text-main)', opacity: 0.9 }}>
          Let's take an honest look at how life feels for you right now.
        </p>

        <div className="trust-row" style={{ marginBottom: '4rem', maxWidth: '500px' }}>
          <span className="trust-pill">✨ Non-clinical</span>
          <span className="trust-pill">🔒 Private & Secure</span>
          <span className="trust-pill">🧠 Adaptive</span>
          <span className="trust-pill">🔬 Science-backed</span>
        </div>

        <div style={{ width: '100%', maxWidth: '320px' }}>
          <button 
            className="btn-primary" 
            onClick={handleNext}
            style={{ width: '100%' }}
          >
            Let's begin
          </button>
        </div>
      </div>
    </motion.div>
  )
}
