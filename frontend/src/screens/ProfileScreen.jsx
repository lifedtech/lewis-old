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
      style={{ display: 'flex' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>Step {step + 2}</p>
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="q-card">
            <h1 className="q-text" style={{textAlign:'center', marginBottom:'16px'}}>A little about you</h1>
            <p className="q-caption" style={{textAlign:'center'}}>This helps LEWIS personalize your reflection.</p>
            <div className="form-container">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="input-field" placeholder="How should we call you?" value={name} onChange={(e) => setProfileField('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Which age group are you in? (Optional)</label>
                <select className="input-field" value={ageCategory} onChange={(e) => setProfileField('ageCategory', e.target.value)}>
                  <option value="" disabled>Select your age group</option>
                  <option value="18-24">18 - 24</option>
                  <option value="25-34">25 - 34</option>
                  <option value="35-44">35 - 44</option>
                  <option value="45-54">45 - 54</option>
                  <option value="55-64">55 - 64</option>
                  <option value="65+">65+</option>
                </select>
              </div>
              <div className="form-group">
                <label>What is your sex? (Optional)</label>
                <select className="input-field" value={gender} onChange={(e) => setProfileField('gender', e.target.value)}>
                  <option value="" disabled>Select your sex</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Intersex">Intersex</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" disabled={!isDemoComplete} onClick={handleNext} style={{marginTop: '24px', display: 'block', margin: '24px auto 0'}}>Continue</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="q-card">
            <h1 className="q-text" style={{textAlign:'center', marginBottom:'16px'}}>Which of these describes you right now?</h1>
            <p className="q-caption" style={{textAlign:'center'}}>Select all that apply.</p>
            <MultiSelectGrid options={ROLES_OPTIONS} selected={roles} onChange={(opt) => toggleArrayItem('roles', opt)} />
            <button className="btn-primary" disabled={!isRolesComplete} onClick={handleNext} style={{marginTop: '24px', display: 'block', margin: '24px auto 0'}}>Continue</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="q-card">
            <h1 className="q-text" style={{textAlign:'center', marginBottom:'16px'}}>What's pressing on you most right now?</h1>
            <p className="q-caption" style={{textAlign:'center'}}>Select all that apply.</p>
            <MultiSelectGrid options={PRESSURES_OPTIONS} selected={lifePressures} onChange={(opt) => toggleArrayItem('lifePressures', opt)} />
            <button className="btn-primary" disabled={!isPressuresComplete} onClick={handleNext} style={{marginTop: '24px', display: 'block', margin: '24px auto 0'}}>Continue</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="q-card">
            <h1 className="q-text" style={{textAlign:'center', marginBottom:'16px'}}>Drag these into the order that matters most to you right now.</h1>
            <p className="q-caption" style={{textAlign:'center'}}>1 = Most important, 9 = Least important</p>
            <DraggableList items={priorities} setItems={(newOrder) => setProfileField('priorities', newOrder)} />
            <button className="btn-primary" onClick={handleNext} style={{marginTop: '24px', display: 'block', margin: '24px auto 0'}}>Continue</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
