import React, { useState } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion, AnimatePresence } from 'framer-motion'
import MultiSelectGrid from '../components/MultiSelectGrid.jsx'
import DraggableList from '../components/DraggableList.jsx'

const ROLES_OPTIONS = ['Student', 'Professional', 'Entrepreneur', 'Primary caregiver', 'Homemaker', 'Retired', 'Between jobs', 'In transition', 'Taking time out', 'Living with a health condition', 'Wearing many hats']
const PRESSURES_OPTIONS = ['Workload', 'Financial pressure', 'Relationship strain', 'Health concerns', 'Life change or transition', 'Mental load', 'Digital overwhelm', 'Feeling lost or without direction', 'Sleep depletion', 'Nothing major right now']

export default function ProfileScreen() {
  const { 
    name, ageCategory, gender, profession, setProfileField, 
    roles, lifePressures, toggleArrayItem,
    priorities,
    setScreen 
  } = useLewisStore()

  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else setScreen('pathSelection')
  }

  const isDemoComplete = name.trim() !== ''
  const isRolesComplete = roles.length > 0
  const isPressuresComplete = lifePressures.length > 0

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={step} 
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          exit={{opacity:0}} 
          className="split-layout"
        >
          <div className="split-left">
            <div className="orb orb--hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#6B7280" />
                <path d="M33 24L18 32.6603L18 15.3397L33 24Z" fill="white" />
              </svg>
            </div>
          </div>
          
          <div className="split-right">
            {step === 0 && (
              <div className="form-content">
                <h1 className="hero-text">Hey Bud !<br/>What should I call you ?</h1>
                <input 
                  type="text" 
                  className="hero-input" 
                  placeholder="type your name" 
                  value={name} 
                  onChange={(e) => setProfileField('name', e.target.value)} 
                />
                <button className="btn-hero" disabled={!isDemoComplete} onClick={handleNext}>NEXT</button>
              </div>
            )}

            {step === 1 && (
              <div className="form-content">
                <h1 className="hero-text" style={{fontSize: '32px'}}>Which of these describes you right now?</h1>
                <p className="q-caption" style={{textAlign:'left'}}>Select all that apply.</p>
                <div style={{ marginTop: '16px' }}>
                  <MultiSelectGrid options={ROLES_OPTIONS} selected={roles} onChange={(opt) => toggleArrayItem('roles', opt)} />
                </div>
                <button className="btn-hero" disabled={!isRolesComplete} onClick={handleNext} style={{marginTop: '24px'}}>NEXT</button>
              </div>
            )}

            {step === 2 && (
              <div className="form-content">
                <h1 className="hero-text" style={{fontSize: '32px'}}>What's pressing on you most right now?</h1>
                <p className="q-caption" style={{textAlign:'left'}}>Select all that apply.</p>
                <div style={{ marginTop: '16px' }}>
                  <MultiSelectGrid options={PRESSURES_OPTIONS} selected={lifePressures} onChange={(opt) => toggleArrayItem('lifePressures', opt)} />
                </div>
                <button className="btn-hero" disabled={!isPressuresComplete} onClick={handleNext} style={{marginTop: '24px'}}>NEXT</button>
              </div>
            )}

            {step === 3 && (
              <div className="form-content">
                <h1 className="hero-text" style={{fontSize: '32px'}}>Drag these into the order that matters most.</h1>
                <p className="q-caption" style={{textAlign:'left'}}>1 = Most important, 9 = Least important</p>
                <div style={{ marginTop: '16px' }}>
                  <DraggableList items={priorities} setItems={(newOrder) => setProfileField('priorities', newOrder)} />
                </div>
                <button className="btn-hero" onClick={handleNext} style={{marginTop: '24px'}}>NEXT</button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}
