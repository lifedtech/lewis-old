import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage3_2BodyMapScreen() {
  const { setScreen, toggleArrayItem, bodyMapZones } = useLewisStore()

  const handleNext = () => {
    setScreen('stage3_3DayRhythm')
  }

  const zones = [
    { id: 'head', label: 'Head & Jaw' },
    { id: 'neck', label: 'Neck & Shoulders' },
    { id: 'chest', label: 'Chest & Heart Center' },
    { id: 'back', label: 'Upper & Lower Back' },
    { id: 'gut', label: 'Stomach & Abdomen' },
    { id: 'limbs', label: 'Arms & Legs' }
  ]

  const isSelected = (id) => (bodyMapZones || []).includes(id)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <h1 className="headline">Body Tension Map</h1>
          <p className="sub" style={{ marginBottom: '2rem' }}>Where in your body do you feel physical tension or holding right now?</p>

          <div style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3rem',
            width: '100%',
            flexWrap: 'wrap-reverse'
          }}>
            {/* Left Side: Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '240px' }}>
              {zones.map(z => (
                <button
                  key={z.id}
                  onClick={() => toggleArrayItem('bodyMapZones', z.id)}
                  className={`scale-opt ${isSelected(z.id) ? 'selected' : ''}`}
                  style={{
                    padding: '10px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isSelected(z.id) ? 'var(--dawn-glow)' : 'var(--panel-2)'
                  }}
                >
                  <span>{z.label}</span>
                  {isSelected(z.id) && <span style={{ color: 'var(--dawn)', fontWeight: 600 }}>✦</span>}
                </button>
              ))}
            </div>

            {/* Right Side: Interactive SVG body map */}
            <div style={{ width: '200px', height: '320px', background: 'var(--panel)', borderRadius: '24px', border: '1px solid var(--panel-border)', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg viewBox="0 0 200 320" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.02)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
                  </linearGradient>
                  <linearGradient id="tensionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255, 148, 102, 0.4)" />
                    <stop offset="100%" stopColor="rgba(255, 148, 102, 0.8)" />
                  </linearGradient>
                </defs>

                {/* Head */}
                <circle
                  cx="100" cy="40" r="22"
                  fill={isSelected('head') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('head') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'head')}
                />

                {/* Neck & Shoulders */}
                <path
                  d="M 60,78 C 80,68 120,68 140,78 L 132,95 L 68,95 Z"
                  fill={isSelected('neck') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('neck') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'neck')}
                />

                {/* Chest */}
                <rect
                  x="65" y="100" width="70" height="50" rx="8"
                  fill={isSelected('chest') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('chest') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'chest')}
                />

                {/* Back (Upper & Lower) - Represented as a shadow behind the chest/gut outline */}
                <path
                  d="M 68,102 L 68,200 L 132,200 L 132,102 Z"
                  fill="none"
                  stroke={isSelected('back') ? 'var(--dawn)' : 'transparent'}
                  strokeDasharray="4,4"
                  strokeWidth="2.5"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Gut / Abdomen */}
                <rect
                  x="68" y="155" width="64" height="48" rx="8"
                  fill={isSelected('gut') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('gut') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'gut')}
                />

                {/* Arms & Legs (Limbs) */}
                {/* Left Arm */}
                <path
                  d="M 58,104 L 30,165 L 42,170 L 63,115 Z"
                  fill={isSelected('limbs') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('limbs') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
                />
                {/* Right Arm */}
                <path
                  d="M 142,104 L 170,165 L 158,170 L 137,115 Z"
                  fill={isSelected('limbs') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('limbs') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
                />

                {/* Left Leg */}
                <path
                  d="M 70,210 L 58,300 L 73,300 L 82,210 Z"
                  fill={isSelected('limbs') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('limbs') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
                />
                {/* Right Leg */}
                <path
                  d="M 130,210 L 142,300 L 127,300 L 118,210 Z"
                  fill={isSelected('limbs') ? 'url(#tensionGrad)' : 'url(#bodyGrad)'}
                  stroke={isSelected('limbs') ? 'var(--dawn)' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
                />
              </svg>
            </div>
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
