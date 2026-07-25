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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: '0 clamp(16px, 3vw, 40px)',
        boxSizing: 'border-box',
      }}>

        {/* TOP HEADER */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(28px, 3.8vw, 48px)',
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            margin: 0,
            color: '#16302b',
          }}>
            Body Tension Map
          </h1>
          <p style={{
            margin: '6px 0 0 2px',
            fontSize: 'clamp(13px, 1.5vw, 15px)',
            color: '#4a6b62',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Where in your body do you feel physical tension or holding right now?
          </p>
        </div>

        {/* MAIN 2-COLUMN SECTION (Body figure card left, 6 stacked option rows right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 'clamp(16px, 3vw, 36px)',
          alignItems: 'center',
          flex: 1,
        }}>

          {/* LEFT — Interactive Body Figure SVG Card */}
          <div style={{
            height: '100%',
            maxHeight: '300px',
            background: '#fafcfb',
            borderRadius: '24px',
            border: '1.5px solid rgba(0,174,157,0.18)',
            padding: '16px',
            display: 'flex',
            justify: 'center',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            <svg viewBox="0 0 200 320" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="bodyDefault" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f3f6f5" />
                  <stop offset="100%" stopColor="#e2e8e5" />
                </linearGradient>
                <linearGradient id="bodySelected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e4f4ee" />
                  <stop offset="100%" stopColor="#00ae9d" />
                </linearGradient>
              </defs>

              {/* Head */}
              <circle
                cx="100" cy="40" r="22"
                fill={isSelected('head') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('head') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'head')}
              />

              {/* Neck & Shoulders */}
              <path
                d="M 60,78 C 80,68 120,68 140,78 L 132,95 L 68,95 Z"
                fill={isSelected('neck') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('neck') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'neck')}
              />

              {/* Chest */}
              <rect
                x="65" y="100" width="70" height="50" rx="8"
                fill={isSelected('chest') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('chest') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'chest')}
              />

              {/* Upper & Lower Back */}
              <path
                d="M 68,102 L 68,200 L 132,200 L 132,102 Z"
                fill="none"
                stroke={isSelected('back') ? '#00ae9d' : 'transparent'}
                strokeDasharray="4,4"
                strokeWidth="2.5"
                style={{ pointerEvents: 'none' }}
              />

              {/* Stomach & Abdomen */}
              <rect
                x="68" y="155" width="64" height="48" rx="8"
                fill={isSelected('gut') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('gut') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'gut')}
              />

              {/* Arms */}
              <path
                d="M 58,104 L 30,165 L 42,170 L 63,115 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />
              <path
                d="M 142,104 L 170,165 L 158,170 L 137,115 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />

              {/* Legs */}
              <path
                d="M 70,210 L 58,300 L 73,300 L 82,210 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />
              <path
                d="M 130,210 L 142,300 L 127,300 L 118,210 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#d2dad6'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />
            </svg>
          </div>

          {/* RIGHT — 6 Full-Width Vertical Option Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {zones.map(z => {
              const active = isSelected(z.id)
              return (
                <button
                  key={z.id}
                  onClick={() => toggleArrayItem('bodyMapZones', z.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    width: '100%',
                    padding: '10px 20px',
                    borderRadius: '16px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #e2e8e5',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#044e43' : '#3a3a3a',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '14px',
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: active ? '#00ae9d' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <span>{z.label}</span>
                </button>
              )
            })}
          </div>

        </div>

        {/* FOOTER — Pinned Continue Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '12px', flexShrink: 0 }}>
          <button className="btn-primary" onClick={handleNext} style={{ padding: '12px 36px' }}>
            Continue
          </button>
        </div>

      </div>
    </motion.div>
  )
}
