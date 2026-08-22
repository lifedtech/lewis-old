import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import MobileQuestionOption from '../components/MobileQuestionOption.jsx'
import MobileContinueButton from '../components/MobileContinueButton.jsx'

export default function MobileStage1_3PressuresScreen() {
  const { setScreen, toggleArrayItem, activePressures } = useLewisStore()

  const pressures = [
    'Workload',
    'Financial pressure',
    'Relationship strain',
    'Health concerns',
    'Caring responsibilities',
    'Housing issues',
    'Time scarcity',
    'World events',
    'Nothing specific',
  ]

  const isSelected = (val) => (activePressures || []).includes(val)

  return (
    <motion.div
      className="mobile-screen-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '12px 16px 24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Left-Aligned Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '7.5px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#7a8683',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          SELECT ALL THAT APPLY
        </p>
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: '21px',
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
          margin: 0,
          color: '#414242',
          whiteSpace: 'nowrap',
        }}>
          Active Life Pressures
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '13px',
          color: '#5e6060',
          lineHeight: 1.45,
          margin: '2px 0 0 0',
        }}>
          What's pressing on you most right now? Select all that apply.
        </p>
      </div>

      {/* Multi-Select Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', width: '100%' }}>
        {pressures.map((val) => {
          const active = isSelected(val)
          return (
            <MobileQuestionOption
              key={val}
              selected={active}
              multiSelect={true}
              onClick={() => toggleArrayItem('activePressures', val)}
              title={val}
              style={{
                minHeight: '44px',
                padding: '9px 12px',
                borderRadius: '12px',
              }}
            />
          )
        })}
      </div>

      {/* Standardized Continue Button */}
      <MobileContinueButton
        onClick={() => setScreen('stage1_4Body')}
        label="Continue"
        style={{ padding: '4px 0 0 0' }}
      />
    </motion.div>
  )
}
