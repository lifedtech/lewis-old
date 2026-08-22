import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import MobileContinueButton from '../components/MobileContinueButton.jsx'

export default function MobileStage1_2StabilityScreen() {
  const { lifeStability, setProfileField, setScreen } = useLewisStore()
  const value = lifeStability ?? 50

  const getStabilityLabel = (val) => {
    if (val <= 15) return { text: 'Deeply turbulent', color: '#f05d5e' }
    if (val <= 35) return { text: 'Unsteady', color: '#FF9466' }
    if (val <= 65) return { text: 'Balanced / Flowing', color: '#5fbb46' }
    if (val <= 85) return { text: 'Steady', color: '#00ae9d' }
    return { text: 'Very steady', color: '#008a7c' }
  }

  const label = getStabilityLabel(value)

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
        gap: '16px',
        padding: '12px 16px 24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header — Eyebrow + Title + Subtitle (Decreased font sizes) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
          <p className="mobile-eyebrow" style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '6px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: '#7a8683',
            textTransform: 'uppercase',
            margin: '0 0 2px 0',
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
            wordBreak: 'break-word',
          }}>
            Life Stability Spectrum
          </h1>
          <p className="mobile-subtitle" style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            color: '#5e6060',
            lineHeight: 1.45,
            margin: '2px 0 0 0',
          }}>
            How stable, balanced, and supported does your life feel currently?
          </p>
        </div>

        {/* Middle — Stability Slider Component */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          padding: '6px 0 2px 0',
        }}>
          {/* Dynamic State Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={label.text}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: `1.5px solid ${label.color}`,
                borderRadius: '20px',
                padding: '6px 18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <span style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: label.color,
                fontFamily: "'Nunito', sans-serif",
              }}>
                {label.text}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Slider & Floating Pill Container */}
          <div style={{ width: '100%', position: 'relative', padding: '6px 0' }}>
            {/* Dynamic Value Pill */}
            <div style={{ position: 'relative', width: '100%', height: '26px', marginBottom: '10px' }}>
              <div style={{
                position: 'absolute',
                left: `clamp(26px, calc(${value}% + ${(50 - value) * 0.26}px), calc(100% - 26px))`,
                transform: 'translateX(-50%)',
                background: '#414242',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: "'Nunito', sans-serif",
                padding: '3px 10px',
                borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: label.color, display: 'inline-block' }} />
                {value}%
              </div>
            </div>

            {/* Slider Range Track */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => setProfileField('lifeStability', Number(e.target.value))}
                className="classy-range-input"
                style={{
                  width: '100%',
                  background: `linear-gradient(90deg, ${label.color} 0%, ${label.color} ${value}%, #e2ece8 ${value}%, #e2ece8 100%)`,
                }}
              />

              {/* Step dots */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                right: '12px',
                transform: 'translateY(-50%)',
                display: 'flex',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                zIndex: 1,
              }}>
                {[0, 25, 50, 75, 100].map((step) => (
                  <div
                    key={step}
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: value >= step ? 'rgba(255, 255, 255, 0.9)' : 'rgba(65, 66, 66, 0.25)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* End & Mid Labels */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              padding: '0 2px',
              fontSize: '9.5px',
              fontWeight: 800,
              color: '#5e6060',
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: '0.08em',
            }}>
              <span>TURBULENT</span>
              <span style={{ opacity: 0.6 }}>BALANCED</span>
              <span>STEADY</span>
            </div>
          </div>
        </div>

        {/* Standardized Bottom Continue CTA */}
        <MobileContinueButton
          onClick={() => setScreen('stage1_3Pressures')}
          label="Continue"
          style={{ padding: '4px 0 0 0' }}
        />
    </motion.div>
  )
}
