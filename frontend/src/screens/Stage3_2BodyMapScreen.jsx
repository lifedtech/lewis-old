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
        <div style={{ marginBottom: '12px' }}>
          <p style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#00ae9d',
            textTransform: 'uppercase',
            margin: '0 0 8px 0',
          }}>
            STAGE 3 — ANS &amp; SOMATIC
          </p>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(22px, 3.5vw, 40px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: 0,
            color: '#414242',
            whiteSpace: 'nowrap',
          }}>
            Body Tension Map
          </h1>
          <p style={{
            margin: '6px 0 0 2px',
            fontSize: 'clamp(12px, 1.4vw, 14.5px)',
            color: '#414242',
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1.4,
          }}>
            Where in your body do you feel physical tension or holding right now?
          </p>
        </div>

        {/* MAIN 2-COLUMN SECTION (Body figure card left, options grid right) */}
        <div className="stage-split" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(160px, 200px) 1fr',
          gap: 'clamp(12px, 2.5vw, 28px)',
          alignItems: 'center',
          flex: 1,
          width: '100%',
        }}>

          {/* LEFT — Interactive Body Figure SVG Card */}
          <div style={{
            width: '100%',
            maxWidth: '200px',
            background: '#f2f9f6',
            borderRadius: '20px',
            border: '1.5px solid #d2e7e0',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}>
            <svg
              viewBox="0 0 200 320"
              style={{
                width: '100%',
                maxWidth: '140px',
                height: '190px',
                display: 'block',
              }}
            >
              <defs>
                <linearGradient id="bodyDefault" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f0f5f3" />
                </linearGradient>
                <linearGradient id="bodySelected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e4f4ee" />
                  <stop offset="100%" stopColor="#00ae9d" />
                </linearGradient>
              </defs>

              {/* Upper & Lower Back (Back Layer Contour behind Torso) */}
              <rect
                x="56" y="95" width="88" height="110" rx="14"
                fill={isSelected('back') ? 'url(#bodySelected)' : '#ffffff'}
                stroke={isSelected('back') ? '#00ae9d' : '#cbd5e1'}
                strokeWidth={isSelected('back') ? '2.2' : '1.8'}
                strokeDasharray={isSelected('back') ? 'none' : '4 3'}
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'back')}
              />

              {/* Head */}
              <circle
                cx="100" cy="38" r="22"
                fill={isSelected('head') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('head') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'head')}
              />

              {/* Neck & Shoulders */}
              <path
                d="M 60,76 C 80,66 120,66 140,76 L 132,93 L 68,93 Z"
                fill={isSelected('neck') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('neck') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'neck')}
              />

              {/* Chest (Front Layer) */}
              <rect
                x="66" y="99" width="68" height="48" rx="8"
                fill={isSelected('chest') ? 'url(#bodySelected)' : '#ffffff'}
                stroke={isSelected('chest') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'chest')}
              />

              {/* Stomach & Abdomen (Front Layer) */}
              <rect
                x="69" y="152" width="62" height="46" rx="8"
                fill={isSelected('gut') ? 'url(#bodySelected)' : '#ffffff'}
                stroke={isSelected('gut') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'gut')}
              />

              {/* Arms (Limbs) */}
              <path
                d="M 54,100 L 26,161 L 38,166 L 59,111 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />
              <path
                d="M 146,100 L 174,161 L 162,166 L 141,111 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />

              {/* Legs (Limbs) */}
              <path
                d="M 70,210 L 58,296 L 73,296 L 82,210 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />
              <path
                d="M 130,210 L 142,296 L 127,296 L 118,210 Z"
                fill={isSelected('limbs') ? 'url(#bodySelected)' : 'url(#bodyDefault)'}
                stroke={isSelected('limbs') ? '#00ae9d' : '#94a3b8'}
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              />
            </svg>
          </div>

          {/* RIGHT — Responsive Option Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            width: '100%',
          }}>
            {zones.map(z => {
              const active = isSelected(z.id)
              return (
                <button
                  key={z.id}
                  onClick={() => toggleArrayItem('bodyMapZones', z.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: active ? '#e4f4ee' : '#f2f9f6',
                    color: active ? '#1b4d43' : '#414242',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '12.5px',
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: active ? '#00ae9d' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.18s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '9.5px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{ lineHeight: 1.25, overflowWrap: 'break-word' }}>{z.label}</span>
                </button>
              )
            })}
          </div>

        </div>

        {/* FOOTER — Pinned Continue Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '10px', flexShrink: 0 }}>
          <button className="btn-primary" onClick={handleNext} style={{ padding: '10px 36px' }}>
            Continue
          </button>
        </div>

      </div>
    </motion.div>
  )
}
