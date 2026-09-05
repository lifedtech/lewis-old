import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import { useDeviceViewport } from '../../shared/hooks/useDeviceViewport.js'

const ZONES = [
  { id: 'Head and neck', label: 'Head and neck', zoneKey: 'head' },
  { id: 'Chest', label: 'Chest', zoneKey: 'chest' },
  { id: 'Stomach', label: 'Stomach', zoneKey: 'gut' },
  { id: 'Shoulders and back', label: 'Shoulders and back', zoneKey: 'back' },
  { id: 'Limbs', label: 'Limbs', zoneKey: 'limbs' }
]

export default function StreamlinedBodyMapScreen() {
  const { bodyMapZones, toggleArrayItem, setProfileField, setScreen } = useLewisStore()
  const { isMobile } = useDeviceViewport()
  const [hoveredZone, setHoveredZone] = useState(null)

  const isSelected = (id) => (bodyMapZones || []).includes(id)
  const isNoneSelected = (bodyMapZones || []).includes('none')

  const handleToggle = (id) => {
    let current = [...(bodyMapZones || [])]
    if (id === 'none') {
      current = current.includes('none') ? [] : ['none']
    } else {
      current = current.filter((item) => item !== 'none')
      if (current.includes(id)) {
        current = current.filter((item) => item !== id)
      } else {
        current.push(id)
      }
    }
    setProfileField('bodyMapZones', current)
  }

  const handleNext = () => {
    setScreen('sl_3_5NsState')
  }

  const getZoneFill = (id) => {
    if (isSelected(id)) return 'url(#somaticActiveGrad)'
    if (hoveredZone === id) return 'url(#somaticHoverGrad)'
    return 'var(--card-bg, #ffffff)'
  }

  const getZoneStroke = (id) => {
    if (isSelected(id)) return 'var(--dawn, #00ae9d)'
    if (hoveredZone === id) return 'var(--dawn, #00ae9d)'
    return 'var(--card-border, #cbd5e1)'
  }

  return (
    <motion.div
      className="screen-container center-aligned"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: isMobile ? '8px 16px 24px 16px' : '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 auto 10px auto',
        textAlign: 'center',
        width: '100%',
      }}>
        ACT 2 · HOW LIFE FEELS
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: isMobile ? '21px' : 'clamp(26px, 3.6vw, 44px)',
        lineHeight: 1.25,
        letterSpacing: '-0.025em',
        margin: '0 auto 8px auto',
        color: 'var(--text-main, #414242)',
        maxWidth: '720px',
        textAlign: 'center',
        width: '100%',
      }}>
        {isMobile ? (
          <>
            Tap anywhere in your body<br />
            that feels tense, heavy, or<br />
            uncomfortable right now.
          </>
        ) : (
          'Tap anywhere in your body that feels tense, heavy, or uncomfortable right now.'
        )}
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 auto 18px auto',
        fontSize: isMobile ? '13.5px' : 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'center',
        width: '100%',
      }}>
        Tap as many places as you need. Tap again to clear one.
      </p>

      {/* Interactive Silhouette Centerpiece */}
      <div style={{
        margin: isMobile ? '0 auto 18px auto' : '0 auto 24px auto',
        padding: isMobile ? '10px 18px' : '12px 24px',
        borderRadius: '24px',
        background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
        border: '1.5px solid var(--card-border, #d2e7e0)',
        boxShadow: 'var(--card-shadow, 0 8px 24px rgba(0, 174, 157, 0.08))',
      }}>
        <svg
          viewBox="0 0 200 320"
          style={{
            width: isMobile ? '115px' : '140px',
            height: isMobile ? '172px' : '210px',
            display: 'block',
            overflow: 'visible',
          }}
        >
          <defs>
            <linearGradient id="somaticActiveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#00ae9d" />
            </linearGradient>
            <linearGradient id="somaticHoverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
            <filter id="glowPulse" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00ae9d" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* 1. HEAD & NECK */}
          <g
            onClick={() => handleToggle('Head and neck')}
            onMouseEnter={() => setHoveredZone('Head and neck')}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ cursor: 'pointer' }}
          >
            <ellipse
              cx="100" cy="36" rx="18" ry="24"
              fill={getZoneFill('Head and neck')}
              stroke={getZoneStroke('Head and neck')}
              strokeWidth={isSelected('Head and neck') ? '2.2' : '1.5'}
              filter={isSelected('Head and neck') ? 'url(#glowPulse)' : 'none'}
              style={{ transition: 'all 0.2s ease' }}
            />
            <circle cx="100" cy="34" r="3" fill={isSelected('Head and neck') ? '#ffffff' : '#cbd5e1'} />
          </g>

          {/* 2. SHOULDERS & BACK */}
          <g
            onClick={() => handleToggle('Shoulders and back')}
            onMouseEnter={() => setHoveredZone('Shoulders and back')}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M 90,60 L 110,60 L 146,82 L 136,96 L 64,96 L 54,82 Z"
              fill={getZoneFill('Shoulders and back')}
              stroke={getZoneStroke('Shoulders and back')}
              strokeWidth={isSelected('Shoulders and back') ? '2.2' : '1.5'}
              filter={isSelected('Shoulders and back') ? 'url(#glowPulse)' : 'none'}
              style={{ transition: 'all 0.2s ease' }}
            />
            <line
              x1="100" y1="62" x2="100" y2="190"
              stroke={isSelected('Shoulders and back') ? '#00ae9d' : '#cbd5e1'}
              strokeWidth={isSelected('Shoulders and back') ? '3.5' : '1.5'}
              strokeDasharray="3 2"
              strokeLinecap="round"
            />
          </g>

          {/* 3. CHEST */}
          <g
            onClick={() => handleToggle('Chest')}
            onMouseEnter={() => setHoveredZone('Chest')}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M 64,96 L 136,96 C 134,136 126,146 100,148 C 74,146 66,136 64,96 Z"
              fill={getZoneFill('Chest')}
              stroke={getZoneStroke('Chest')}
              strokeWidth={isSelected('Chest') ? '2.2' : '1.5'}
              filter={isSelected('Chest') ? 'url(#glowPulse)' : 'none'}
              style={{ transition: 'all 0.2s ease' }}
            />
            <circle cx="100" cy="118" r="4" fill={isSelected('Chest') ? '#ffffff' : '#cbd5e1'} />
          </g>

          {/* 4. STOMACH */}
          <g
            onClick={() => handleToggle('Stomach')}
            onMouseEnter={() => setHoveredZone('Stomach')}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M 67,146 C 80,144 120,144 133,146 C 129,188 120,198 100,200 C 80,198 71,188 67,146 Z"
              fill={getZoneFill('Stomach')}
              stroke={getZoneStroke('Stomach')}
              strokeWidth={isSelected('Stomach') ? '2.2' : '1.5'}
              filter={isSelected('Stomach') ? 'url(#glowPulse)' : 'none'}
              style={{ transition: 'all 0.2s ease' }}
            />
            <circle cx="100" cy="172" r="3.5" fill={isSelected('Stomach') ? '#ffffff' : '#cbd5e1'} />
          </g>

          {/* 5. LIMBS (Arms & Legs) */}
          <g
            onClick={() => handleToggle('Limbs')}
            onMouseEnter={() => setHoveredZone('Limbs')}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Left Arm */}
            <path d="M 54,82 L 40,140 L 46,144 L 62,94 Z" fill={getZoneFill('Limbs')} stroke={getZoneStroke('Limbs')} strokeWidth="1.5" />
            {/* Right Arm */}
            <path d="M 146,82 L 160,140 L 154,144 L 138,94 Z" fill={getZoneFill('Limbs')} stroke={getZoneStroke('Limbs')} strokeWidth="1.5" />
            {/* Left Leg */}
            <path d="M 72,198 L 78,280 L 90,280 L 94,198 Z" fill={getZoneFill('Limbs')} stroke={getZoneStroke('Limbs')} strokeWidth="1.5" />
            {/* Right Leg */}
            <path d="M 128,198 L 122,280 L 110,280 L 106,198 Z" fill={getZoneFill('Limbs')} stroke={getZoneStroke('Limbs')} strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Pill Buttons for Zones */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        maxWidth: '560px',
        marginBottom: '12px',
      }}>
        {ZONES.map((zone) => {
          const selected = isSelected(zone.id)
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => handleToggle(zone.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '13px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                border: selected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                background: selected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                color: selected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
              }}
            >
              {zone.label}
            </button>
          )
        })}
      </div>

      {/* Nothing feels tense toggle */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => handleToggle('none')}
          style={{
            padding: '8px 18px',
            borderRadius: '24px',
            fontSize: '13px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            border: isNoneSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
            background: isNoneSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
            color: isNoneSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #657370)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
          }}
        >
          Nothing feels tense right now
        </button>
      </div>

      {/* Continue Button */}
      <div>
        <button
          type="button"
          onClick={handleNext}
          style={{
            padding: '12px 38px',
            borderRadius: '100px',
            fontSize: '14.5px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.02em',
            border: 'none',
            background: 'var(--dawn, #00ae9d)',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}
