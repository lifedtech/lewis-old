import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import MobileQuestionOption from '../components/MobileQuestionOption.jsx'

export default function MobilePreStage0AgeScreen() {
  const { setScreen, setProfileField } = useLewisStore()

  const handleSelect = (isOver18) => {
    setProfileField('isOver18', isOver18)
    // Small feedback delay before navigation
    setTimeout(() => {
      setScreen(isOver18 ? 'stage1_0About' : 'ageStop')
    }, 150)
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
        padding: '12px 16px 20px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Left-Aligned Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
        <p className="mobile-eyebrow" style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#7a8683',
          textTransform: 'uppercase',
          margin: '0 0 2px 0',
        }}>
          CONFIRM ELIGIBILITY
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
          Before We Begin
        </h1>
        <p className="mobile-subtitle" style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '15px',
          fontWeight: 700,
          color: '#5e6060',
          lineHeight: 1.45,
          margin: '2px 0 0 0',
        }}>
          Please confirm your age eligibility to continue.
        </p>
      </div>

      {/* Question Prompt */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
        <p style={{
          margin: 0,
          fontSize: '14.5px',
          fontWeight: 700,
          color: '#414242',
          fontFamily: "'Nunito', sans-serif",
          textAlign: 'left',
        }}>
          Are you 18 or older?
        </p>

        {/* Standardized Option Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <MobileQuestionOption
            selected={false}
            onClick={() => handleSelect(true)}
            title="Yes, I am 18 or older"
            subtitle="Adult participant (full assessment)"
          />

          <MobileQuestionOption
            selected={false}
            onClick={() => handleSelect(false)}
            title="No, I am under 18"
            subtitle="Minors cannot proceed"
          />
        </div>
      </div>

      {/* Informational Subtext */}
      <p style={{
        margin: '4px 0 0 0',
        fontSize: '11px',
        color: '#85918e',
        fontFamily: "'Nunito', sans-serif",
        lineHeight: 1.4,
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Lewis is validated for adults 18 and over. No data is stored for minors.
      </p>
    </motion.div>
  )
}
