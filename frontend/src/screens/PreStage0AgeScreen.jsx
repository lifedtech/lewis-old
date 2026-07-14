import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function PreStage0AgeScreen() {
  const { setScreen, setProfileField } = useLewisStore()

  const handleNext = (isOver18) => {
    setProfileField('isOver18', isOver18)
    // Under-18: hard stop. The assessment is designed and validated for
    // adults only — minors never proceed into data collection.
    setScreen(isOver18 ? 'stage1_0About' : 'ageStop')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline" style={{ marginBottom: '3rem' }}>Before we begin - please confirm: are you 18 or older?</h1>
        
        <div className="button-group" style={{ flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
          <button 
            className="btn-primary" 
            onClick={() => handleNext(true)}
            style={{ width: '100%' }}
          >
            Yes, I am 18 or older
          </button>
          <button 
            className="btn-ghost" 
            onClick={() => handleNext(false)}
            style={{ width: '100%', padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', borderRadius: '999px', fontSize: '15px' }}
          >
            No, I am under 18
          </button>
        </div>
      </div>
    </motion.div>
  )
}
