import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function PreStage0SensoryScreen() {
  const { setScreen } = useLewisStore()
  const [audioPlaying, setAudioPlaying] = useState(false)

  const handleNext = () => {
    setScreen('stage1_0About')
  }

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying)
    // Normally you'd trigger an actual audio file here
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        background: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.8), var(--bg-main))',
      }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            width: '120px', height: '120px', 
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(230,123,94,0.3) 0%, transparent 70%)',
            marginBottom: '2rem',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          {/* Mock nature element / breathing indicator */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--dawn)' }}
          />
        </motion.div>

        <h2 className="question-text" style={{ fontSize: '2rem', fontWeight: 300, lineHeight: 1.4, marginBottom: '3rem' }}>
          Let's take an honest look at how life feels for you right now.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '4rem', textAlign: 'left', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}/>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Non-clinical</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}/>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Private & Secure</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}/>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Adaptive</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}/>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Science-backed</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
          <button 
            className="btn-secondary" 
            onClick={toggleAudio}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '1.2rem' }}>{audioPlaying ? '⏸' : '▶️'}</span>
            {audioPlaying ? 'Playing Calibration Tone...' : 'Play 10s Calibration Tone'}
          </button>
          
          <button className="btn-primary" onClick={handleNext}>
            Begin Assessment
          </button>
        </div>
      </div>
    </motion.div>
  )
}
