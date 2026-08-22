import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import MobileContinueButton from '../components/MobileContinueButton.jsx'

export default function MobileStage3_2BodyMapScreen() {
  const { setScreen, toggleArrayItem, bodyMapZones } = useLewisStore()
  const [hoveredZone, setHoveredZone] = useState(null)

  const handleNext = () => {
    setScreen('stage3_3DayRhythm')
  }

  const zones = [
    { id: 'head', label: 'Head & Jaw' },
    { id: 'neck', label: 'Neck & Shoulders' },
    { id: 'chest', label: 'Chest & Heart' },
    { id: 'back', label: 'Upper & Lower Back' },
    { id: 'gut', label: 'Stomach & Abdomen' },
    { id: 'limbs', label: 'Arms & Legs' }
  ]

  const isSelected = (id) => (bodyMapZones || []).includes(id)

  const getZoneFill = (id) => {
    if (isSelected(id)) return 'url(#somaticActiveGradMob)'
    if (hoveredZone === id) return 'url(#somaticHoverGradMob)'
    return '#ffffff'
  }

  const getZoneStroke = (id) => {
    if (isSelected(id)) return '#00ae9d'
    if (hoveredZone === id) return '#00ae9d'
    return '#94a3b8'
  }

  return (
    <motion.div
      className="mobile-screen-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '6px 12px 14px 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
        <p className="mobile-eyebrow" style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '7px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#414242',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          STAGE 3 — ANS &amp; SOMATIC
        </p>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: '20px',
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
          margin: 0,
          color: '#414242',
        }}>
          Body Tension Map
        </h1>
        <p className="mobile-subtitle" style={{
          margin: '2px 0 0 0',
          fontSize: '12px',
          fontWeight: 700,
          color: '#414242',
          fontFamily: "'Nunito', sans-serif",
          lineHeight: 1.35,
        }}>
          Where in your body do you feel physical tension or holding right now?
        </p>
      </div>

      {/* Main Side-by-Side Content Area (Compact, No Overflow) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '115px 1fr',
        gap: '10px',
        alignItems: 'center',
        margin: '6px 0',
        flex: 1,
        minHeight: 0,
      }}>
        {/* LEFT — Compact Interactive Somatic Silhouette */}
        <div style={{
          background: '#f2f9f6',
          borderRadius: '16px',
          border: '1.5px solid #d2e7e0',
          padding: '8px 4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          maxHeight: '230px',
          boxSizing: 'border-box',
        }}>
          <svg
            viewBox="0 0 200 340"
            style={{
              width: '100%',
              maxHeight: '215px',
              display: 'block',
              overflow: 'visible',
            }}
          >
            <defs>
              <linearGradient id="somaticActiveGradMob" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00AE9D" />
                <stop offset="100%" stopColor="#008a7c" />
              </linearGradient>
              <linearGradient id="somaticHoverGradMob" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e4f4ee" />
                <stop offset="100%" stopColor="#c8ebe2" />
              </linearGradient>
            </defs>

            {/* Back Tension Contour (Shared Anchor) */}
            <motion.path
              d="M 64,88 C 64,88 100,74 136,88 C 146,128 144,198 134,228 C 100,240 100,240 66,228 C 56,198 54,128 64,88 Z"
              fill={isSelected('back') ? 'rgba(0, 174, 157, 0.12)' : 'none'}
              stroke={isSelected('back') ? '#00ae9d' : '#cbd5e1'}
              strokeWidth={isSelected('back') ? '2' : '1.2'}
              strokeDasharray={isSelected('back') ? 'none' : '3 2'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'back')}
              onMouseEnter={() => setHoveredZone('back')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Arms (Limbs) */}
            <g style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              onMouseEnter={() => setHoveredZone('limbs')}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <path
                d="M 54,92 L 24,180 L 38,184 L 66,104 Z"
                fill={getZoneFill('limbs')}
                stroke={getZoneStroke('limbs')}
                strokeWidth={isSelected('limbs') ? '2' : '1.4'}
                strokeLinejoin="round"
              />
              <path
                d="M 146,92 L 176,180 L 162,184 L 134,104 Z"
                fill={getZoneFill('limbs')}
                stroke={getZoneStroke('limbs')}
                strokeWidth={isSelected('limbs') ? '2' : '1.4'}
                strokeLinejoin="round"
              />
            </g>

            {/* Legs (Limbs) */}
            <g style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'limbs')}
              onMouseEnter={() => setHoveredZone('limbs')}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <path
                d="M 72,216 L 60,318 L 76,318 L 86,216 Z"
                fill={getZoneFill('limbs')}
                stroke={getZoneStroke('limbs')}
                strokeWidth={isSelected('limbs') ? '2' : '1.4'}
                strokeLinejoin="round"
              />
              <path
                d="M 128,216 L 140,318 L 124,318 L 114,216 Z"
                fill={getZoneFill('limbs')}
                stroke={getZoneStroke('limbs')}
                strokeWidth={isSelected('limbs') ? '2' : '1.4'}
                strokeLinejoin="round"
              />
            </g>

            {/* Pelvis / Abdomen Lower */}
            <path
              d="M 66,186 C 66,186 100,182 134,186 C 138,206 130,222 100,222 C 70,222 62,206 66,186 Z"
              fill={getZoneFill('gut')}
              stroke={getZoneStroke('gut')}
              strokeWidth={isSelected('gut') ? '2' : '1.4'}
              strokeLinejoin="round"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'gut')}
              onMouseEnter={() => setHoveredZone('gut')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Stomach / Solar Plexus Mid-Torso */}
            <path
              d="M 62,142 C 62,142 100,138 138,142 C 140,166 138,186 134,186 C 100,182 100,182 66,186 C 62,186 60,166 62,142 Z"
              fill={getZoneFill('gut')}
              stroke={getZoneStroke('gut')}
              strokeWidth={isSelected('gut') ? '2' : '1.4'}
              strokeLinejoin="round"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'gut')}
              onMouseEnter={() => setHoveredZone('gut')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Chest & Heart Upper Torso */}
            <path
              d="M 54,92 C 70,82 130,82 146,92 C 146,92 142,126 138,142 C 100,138 100,138 62,142 C 58,126 54,92 54,92 Z"
              fill={getZoneFill('chest')}
              stroke={getZoneStroke('chest')}
              strokeWidth={isSelected('chest') ? '2' : '1.4'}
              strokeLinejoin="round"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'chest')}
              onMouseEnter={() => setHoveredZone('chest')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Neck & Shoulders */}
            <path
              d="M 88,68 L 112,68 L 126,88 C 100,84 100,84 74,88 Z"
              fill={getZoneFill('neck')}
              stroke={getZoneStroke('neck')}
              strokeWidth={isSelected('neck') ? '2' : '1.4'}
              strokeLinejoin="round"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'neck')}
              onMouseEnter={() => setHoveredZone('neck')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Head & Jaw Oval */}
            <ellipse
              cx="100" cy="42" rx="20" ry="24"
              fill={getZoneFill('head')}
              stroke={getZoneStroke('head')}
              strokeWidth={isSelected('head') ? '2' : '1.4'}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleArrayItem('bodyMapZones', 'head')}
              onMouseEnter={() => setHoveredZone('head')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Glowing Focal Chakra/Aura Nodes */}
            <circle cx="100" cy="42" r={isSelected('head') ? '4' : '2.5'} fill={isSelected('head') ? '#ffffff' : '#00ae9d'} />
            <circle cx="100" cy="116" r={isSelected('chest') ? '4' : '2.5'} fill={isSelected('chest') ? '#ffffff' : '#00ae9d'} />
            <circle cx="100" cy="164" r={isSelected('gut') ? '4' : '2.5'} fill={isSelected('gut') ? '#ffffff' : '#00ae9d'} />
          </svg>
        </div>

        {/* RIGHT — 6 Compact Option Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {zones.map((z) => {
            const active = isSelected(z.id)
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => toggleArrayItem('bodyMapZones', z.id)}
                onMouseEnter={() => setHoveredZone(z.id)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '10px',
                  border: active ? '1.5px solid #00ae9d' : '1px solid #d2dad6',
                  background: active ? '#eaf7f4' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                {/* Checkbox Icon */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: active ? '1.5px solid #00ae9d' : '1.5px solid #a0b2ac',
                  background: active ? '#00ae9d' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {active && <span style={{ color: '#ffffff', fontSize: '9px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                </div>

                <span style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '12.5px',
                  fontWeight: active ? 800 : 700,
                  color: active ? '#008a7c' : '#334155',
                  lineHeight: 1.2,
                }}>
                  {z.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Pinned Mobile Continue Button */}
      <MobileContinueButton onClick={handleNext} disabled={false} />
    </motion.div>
  )
}
