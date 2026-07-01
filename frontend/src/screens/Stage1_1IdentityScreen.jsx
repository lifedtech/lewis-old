import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_1IdentityScreen() {
  const { setScreen, setProfileField, toggleArrayItem, setScaleAnswer, updateObjectField, identityRoles } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_2Stability')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Identity & Life Roles</h1>
        <p className="sub">Which of these describes you right now?</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <div className="chip-grid">
            <button onClick={() => toggleArrayItem('identityRoles', "Student")} className={`chip ${(identityRoles || []).includes("Student") ? 'selected' : ''}`}>Student</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Professional")} className={`chip ${(identityRoles || []).includes("Professional") ? 'selected' : ''}`}>Professional</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Entrepreneur / self-employed")} className={`chip ${(identityRoles || []).includes("Entrepreneur / self-employed") ? 'selected' : ''}`}>Entrepreneur / self-employed</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Primary caregiver")} className={`chip ${(identityRoles || []).includes("Primary caregiver") ? 'selected' : ''}`}>Primary caregiver</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Homemaker")} className={`chip ${(identityRoles || []).includes("Homemaker") ? 'selected' : ''}`}>Homemaker</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Retired")} className={`chip ${(identityRoles || []).includes("Retired") ? 'selected' : ''}`}>Retired</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Between jobs")} className={`chip ${(identityRoles || []).includes("Between jobs") ? 'selected' : ''}`}>Between jobs</button>
            <button onClick={() => toggleArrayItem('identityRoles', "In transition")} className={`chip ${(identityRoles || []).includes("In transition") ? 'selected' : ''}`}>In transition</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Taking time out")} className={`chip ${(identityRoles || []).includes("Taking time out") ? 'selected' : ''}`}>Taking time out</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Living with a health condition")} className={`chip ${(identityRoles || []).includes("Living with a health condition") ? 'selected' : ''}`}>Living with a health condition</button>
            <button onClick={() => toggleArrayItem('identityRoles', "Wearing many hats")} className={`chip ${(identityRoles || []).includes("Wearing many hats") ? 'selected' : ''}`}>Wearing many hats</button>
          </div>

        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
