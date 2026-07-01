import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage10GeneratingScreen() {
  const { setScreen } = useLewisStore()
  const [stepIdx, setStepIdx] = useState(0)

  const steps = [
    "Scoring emotional well-being (WHO-5)...",
    "Normalizing perceived stress load (PSS-10)...",
    "Running systemic cascade matrix...",
    "Drafting personalized AI recommendations...",
    "Polishing narrative insights...",
    "Preparing the Mirror..."
  ]

  useEffect(() => {
    if (stepIdx < steps.length - 1) {
      const timer = setTimeout(() => {
        setStepIdx(stepIdx + 1)
      }, 600)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setScreen('mirror')
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [stepIdx])

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}
    >
      <div className="content-wrapper" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Pulsing Orb loader */}
        <div className="ring-wrap" style={{ marginBottom: '3rem', position: 'relative' }}>
          <motion.div 
            className="orb"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
              boxShadow: ['0 0 20px rgba(255,148,102,0.4)', '0 0 45px rgba(255,148,102,0.9)', '0 0 20px rgba(255,148,102,0.4)']
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '80px', height: '80px' }}
          />
        </div>

        <h1 className="headline" style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)' }}>
          Synthesizing your Mirror
        </h1>

        <div style={{ height: '24px', marginTop: '16px', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ fontSize: '14px', color: 'var(--dawn)', fontWeight: 500, margin: 0 }}
            >
              {steps[stepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="sub" style={{ fontSize: '12px', color: 'var(--text-mute)', marginTop: '40px', maxWidth: '300px' }}>
          LEWIS is compiling your psychological metrics and qualitative reflections.
        </p>
      </div>
    </motion.div>
  )
}
