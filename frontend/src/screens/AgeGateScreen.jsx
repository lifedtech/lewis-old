import React, { useState } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion, AnimatePresence } from 'framer-motion'

export default function AgeGateScreen() {
  const { setProfileField, setScreen } = useLewisStore()
  const [showError, setShowError] = useState(false)

  const handleSelect = (value) => {
    setProfileField('isOver18', value)
    if (value === false) {
      setShowError(true)
    } else {
      setShowError(false)
      setScreen('profile')
    }
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>Step 1</p>
      <h1 className="headline" style={{ textAlign: 'center' }}>Are you 18 or older?</h1>
      <p className="sub" style={{ textAlign: 'center', marginBottom: '40px' }}>We need to verify your age before proceeding.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
        <button 
          className="btn-primary" 
          onClick={() => handleSelect(true)}
        >
          Yes, I'm 18+
        </button>
        <button 
          className="btn-ghost" 
          onClick={() => handleSelect(false)}
        >
          No, I'm under 18
        </button>
      </div>

      <AnimatePresence>
        {showError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ textAlign: 'center', color: '#c85250', fontSize: '14px', marginTop: '24px' }}
          >
            Sorry, LEWIS is currently only available for adults.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="spacer"></div>
    </motion.section>
  )
}
