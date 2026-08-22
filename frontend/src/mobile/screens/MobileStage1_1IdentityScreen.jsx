import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import MobileQuestionOption from '../components/MobileQuestionOption.jsx'
import MobileContinueButton from '../components/MobileContinueButton.jsx'

export default function MobileStage1_1IdentityScreen() {
  const { setScreen, setProfileField, identityRoles } = useLewisStore()

  const roles = [
    'Parent / Caregiver',
    'Founder / Entrepreneur',
    'Corporate Leader / Executive',
    'Creative / Artist',
    'Student / Academic',
    'Freelancer / Consultant',
    'Athlete / Performer',
    'Other',
  ]

  const isSelected = (val) => (identityRoles || []).includes(val)
  const selectedCount = (identityRoles || []).length

  const handleSelect = (val) => {
    setProfileField('identityRoles', [val])
    setTimeout(() => {
      setScreen('stage1_2Stability')
    }, 180)
  }

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
        <p className="mobile-eyebrow" style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '6px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: '#7a8683',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          CHOOSE ONE
        </p>
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: '22px',
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
          margin: 0,
          color: '#414242',
        }}>
          Identity &amp; Life Roles
        </h1>
        <p className="mobile-subtitle" style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '15px',
          fontWeight: 700,
          color: '#5e6060',
          lineHeight: 1.45,
          margin: '2px 0 0 0',
        }}>
          Which of these describes you right now? Select one.
        </p>
      </div>

      {/* Standardized Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', width: '100%' }}>
        {roles.map((val) => {
          const active = isSelected(val)
          return (
            <MobileQuestionOption
              key={val}
              selected={active}
              onClick={() => handleSelect(val)}
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
    </motion.div>
  )
}
