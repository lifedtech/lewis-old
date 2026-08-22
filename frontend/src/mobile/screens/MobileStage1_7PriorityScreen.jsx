import React from 'react'
import { motion, Reorder } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import MobileContinueButton from '../components/MobileContinueButton.jsx'

export default function MobileStage1_7PriorityScreen() {
  const {
    setScreen,
    setProfileField,
    priorities = [
      'Physical ease & recovery',
      'Emotional calm & mental health',
      'Energy & engagement',
      'Connection & relationships',
      'Meaning & purpose',
      'Progress & contribution',
      'Financial security & peace',
      'Intellectual growth & curiosity',
      'Environment & belonging',
    ],
  } = useLewisStore()

  return (
    <motion.div
      className="mobile-screen-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '10px 14px 20px 14px',
        boxSizing: 'border-box',
      }}
    >
      {/* Compact Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '7.5px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#7a8683',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              RANK YOUR PRIORITIES
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: '19px',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              margin: 0,
              color: '#414242',
            }}>
              Priority Ranking
            </h1>
          </div>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: '#7a8683',
            textTransform: 'uppercase',
            fontFamily: "'Nunito', sans-serif",
            paddingTop: '2px',
          }}>
            DRAG TO REORDER
          </span>
        </div>

        {/* Compact Reorder List */}
        <Reorder.Group
          axis="y"
          values={priorities}
          onReorder={(newOrder) => setProfileField('priorities', newOrder)}
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: '100%',
          }}
        >
          {priorities.map((item, index) => (
            <Reorder.Item
              key={item}
              value={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 10px',
                borderRadius: '11px',
                border: '1.2px solid rgba(0, 174, 157, 0.16)',
                background: '#f8fcfa',
                boxSizing: 'border-box',
                touchAction: 'none',
                cursor: 'grab',
              }}
              whileDrag={{
                scale: 1.02,
                boxShadow: '0 6px 18px rgba(0, 174, 157, 0.22)',
                background: '#e6f7f2',
                borderColor: '#00ae9d',
              }}
            >
              {/* Rank Number Pill */}
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '6px',
                background: '#e6f7f2',
                color: '#00ae9d',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: "'Nunito', sans-serif",
              }}>
                {index + 1}
              </span>

              {/* Text */}
              <span style={{
                flex: 1,
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#414242',
                fontFamily: "'Nunito', sans-serif",
                lineHeight: 1.25,
                overflowWrap: 'break-word',
              }}>
                {item}
              </span>

              {/* Handle Icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#85918e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.65 }}>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Action CTA Button */}
        <MobileContinueButton
          onClick={() => setScreen('stage1_8Arrival')}
          label="Continue"
          style={{ padding: '4px 0 0 0' }}
        />
    </motion.div>
  )
}
