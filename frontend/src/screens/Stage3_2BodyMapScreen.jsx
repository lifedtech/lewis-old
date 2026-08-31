import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage3_2BodyMapScreen() {
  const { setScreen, toggleArrayItem, bodyMapZones } = useLewisStore()
  const [hoveredZone, setHoveredZone] = useState(null)

  const handleNext = () => {
    setScreen('stage3_3DayRhythm')
  }

  const zones = [
    { id: 'head', label: 'Head & Jaw', subtitle: 'Forehead, temples, jaw tension' },
    { id: 'neck', label: 'Neck & Shoulders', subtitle: 'Trapezius, cervical spine' },
    { id: 'chest', label: 'Chest & Heart Center', subtitle: 'Sternum, constriction, breath' },
    { id: 'back', label: 'Upper & Lower Back', subtitle: 'Spinal column, lumbar load' },
    { id: 'gut', label: 'Stomach & Abdomen', subtitle: 'Solar plexus, visceral bracing' },
    { id: 'limbs', label: 'Arms & Legs', subtitle: 'Hands, shoulders, legs & feet' }
  ]

  const isSelected = (id) => (bodyMapZones || []).includes(id)

  const getZoneFill = (id) => {
    if (isSelected(id)) return 'url(#somaticActiveGrad)'
    if (hoveredZone === id) return 'url(#somaticHoverGrad)'
    return '#ffffff'
  }

  const getZoneStroke = (id) => {
    if (isSelected(id)) return '#00ae9d'
    if (hoveredZone === id) return '#00ae9d'
    return '#94a3b8'
  }

  const getZoneStrokeWidth = (id) => {
    if (isSelected(id)) return '2.2'
    if (hoveredZone === id) return '2'
    return '1.5'
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT COLUMN: Eyebrow + Title + Subtitle + Interactive Somatic Silhouette */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#414242',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              STAGE 3 - ANS &amp; SOMATIC
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
            }}>
              Body Tension Map
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Where in your body do you feel physical tension or holding right now?
            </p>
          </div>

          {/* Interactive Somatic Silhouette Centerpiece */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '12px',
          }}>
            <div style={{
              background: '#f2f9f6',
              borderRadius: '24px',
              border: '1.5px solid #d2e7e0',
              padding: '16px 28px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 6px 24px rgba(0, 174, 157, 0.08)',
              position: 'relative',
            }}>
              <svg
                viewBox="0 0 200 340"
                style={{
                  width: '150px',
                  height: '235px',
                  display: 'block',
                  overflow: 'visible',
                }}
              >
                <defs>
                  {/* Vibrant Teal Somatic Glow */}
                  <linearGradient id="somaticActiveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#00ae9d" />
                  </linearGradient>

                  {/* Soft Radiant Hover Glow */}
                  <linearGradient id="somaticHoverGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d1fae5" />
                    <stop offset="100%" stopColor="#a7f3d0" />
                  </linearGradient>

                  <filter id="glowPulse" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00ae9d" floodOpacity="0.35" />
                  </filter>
                </defs>

                {/* --- 1. HEAD & JAW --- */}
                <g
                  onClick={() => toggleArrayItem('bodyMapZones', 'head')}
                  onMouseEnter={() => setHoveredZone('head')}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <ellipse
                    cx="100" cy="38" rx="20" ry="26"
                    fill={getZoneFill('head')}
                    stroke={getZoneStroke('head')}
                    strokeWidth={getZoneStrokeWidth('head')}
                    filter={isSelected('head') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Subtle Facial Line */}
                  <circle cx="100" cy="35" r="3.5" fill={isSelected('head') ? '#ffffff' : (hoveredZone === 'head' ? '#00ae9d' : '#cbd5e1')} />
                </g>

                {/* --- 2. NECK & SHOULDERS --- */}
                <g
                  onClick={() => toggleArrayItem('bodyMapZones', 'neck')}
                  onMouseEnter={() => setHoveredZone('neck')}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d="M 90,62 L 110,62 L 148,84 L 138,98 L 62,98 L 52,84 Z"
                    fill={getZoneFill('neck')}
                    stroke={getZoneStroke('neck')}
                    strokeWidth={getZoneStrokeWidth('neck')}
                    filter={isSelected('neck') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Clavicle Accent */}
                  <path
                    d="M 76,92 Q 100,96 124,92"
                    fill="none"
                    stroke={isSelected('neck') ? '#ffffff' : (hoveredZone === 'neck' ? '#00ae9d' : '#cbd5e1')}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* --- 3. UPPER & LOWER BACK (Spine Column) --- */}
                <g
                  onClick={() => toggleArrayItem('bodyMapZones', 'back')}
                  onMouseEnter={() => setHoveredZone('back')}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <line
                    x1="100" y1="64" x2="100" y2="204"
                    stroke={isSelected('back') ? '#00ae9d' : (hoveredZone === 'back' ? '#00ae9d' : '#cbd5e1')}
                    strokeWidth={isSelected('back') ? '4' : '2'}
                    strokeDasharray={isSelected('back') ? 'none' : '3 2'}
                    strokeLinecap="round"
                    filter={isSelected('back') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                </g>

                {/* --- 4. CHEST & HEART CENTER --- */}
                <g
                  onClick={() => toggleArrayItem('bodyMapZones', 'chest')}
                  onMouseEnter={() => setHoveredZone('chest')}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d="M 62,98 L 138,98 C 136,142 128,154 100,156 C 72,154 64,142 62,98 Z"
                    fill={getZoneFill('chest')}
                    stroke={getZoneStroke('chest')}
                    strokeWidth={getZoneStrokeWidth('chest')}
                    filter={isSelected('chest') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Heart / Sternum Pulse Node */}
                  <circle cx="100" cy="122" r="5" fill={isSelected('chest') ? '#ffffff' : (hoveredZone === 'chest' ? '#00ae9d' : '#cbd5e1')} />
                </g>

                {/* --- 5. STOMACH & ABDOMEN --- */}
                <g
                  onClick={() => toggleArrayItem('bodyMapZones', 'gut')}
                  onMouseEnter={() => setHoveredZone('gut')}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d="M 65,154 C 80,152 120,152 135,154 C 131,198 122,210 100,212 C 78,210 69,198 65,154 Z"
                    fill={getZoneFill('gut')}
                    stroke={getZoneStroke('gut')}
                    strokeWidth={getZoneStrokeWidth('gut')}
                    filter={isSelected('gut') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Solar Plexus Node */}
                  <circle cx="100" cy="180" r="4" fill={isSelected('gut') ? '#ffffff' : (hoveredZone === 'gut' ? '#00ae9d' : '#cbd5e1')} />
                </g>

                {/* --- 6. ARMS & LEGS (Single clean set of limbs) --- */}
                <g
                  onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
                  onMouseEnter={() => setHoveredZone('limbs')}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Left Arm */}
                  <path
                    d="M 52,84 L 30,174 C 30,180 40,182 44,176 L 62,98 Z"
                    fill={getZoneFill('limbs')}
                    stroke={getZoneStroke('limbs')}
                    strokeWidth={getZoneStrokeWidth('limbs')}
                    filter={isSelected('limbs') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Right Arm */}
                  <path
                    d="M 148,84 L 170,174 C 170,180 160,182 156,176 L 138,98 Z"
                    fill={getZoneFill('limbs')}
                    stroke={getZoneStroke('limbs')}
                    strokeWidth={getZoneStrokeWidth('limbs')}
                    filter={isSelected('limbs') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Left Leg */}
                  <path
                    d="M 74,210 L 66,316 C 66,322 80,322 82,316 L 96,212 Z"
                    fill={getZoneFill('limbs')}
                    stroke={getZoneStroke('limbs')}
                    strokeWidth={getZoneStrokeWidth('limbs')}
                    filter={isSelected('limbs') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Right Leg */}
                  <path
                    d="M 126,210 L 134,316 C 134,322 120,322 118,316 L 104,212 Z"
                    fill={getZoneFill('limbs')}
                    stroke={getZoneStroke('limbs')}
                    strokeWidth={getZoneStrokeWidth('limbs')}
                    filter={isSelected('limbs') ? 'url(#glowPulse)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Options & Action Button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: '14px',
        }}>
          {/* 6 Selectable Options Grid (2 Cols x 3 Rows) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            width: '100%',
          }}>
            {(zones || []).filter(Boolean).map(z => {
              if (!z?.id) return null
              const active = isSelected(z.id)
              const hovered = hoveredZone === z.id
              return (
                <button
                  key={z.id}
                  onClick={() => toggleArrayItem('bodyMapZones', z.id)}
                  onMouseEnter={() => setHoveredZone(z.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : (hovered ? '1.5px solid #a7f3d0' : '1.5px solid #d2e7e0'),
                    background: active ? '#e4f4ee' : (hovered ? '#f4faf7' : '#ffffff'),
                    color: active ? '#1b4d43' : '#414242',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '14px',
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: active ? '0 3px 10px rgba(0,174,157,0.16)' : '0 1px 4px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: active ? '#00ae9d' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.18s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ lineHeight: 1.25, fontWeight: active ? 800 : 700, fontSize: '13.5px' }}>{z.label}</span>
                    <span style={{ fontSize: '11px', color: active ? '#017a6f' : '#64748b', fontWeight: 600 }}>{z.subtitle}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* FOOTER ACTION BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '12px' }}>
            <button className="btn-primary" onClick={handleNext} style={{ padding: '12px 40px', fontSize: '15px' }}>
              Continue
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
