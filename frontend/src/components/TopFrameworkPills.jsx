import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TEAL = '#00ae9d'
const INK = '#252626'

const FRAMEWORKS = [
  {
    id: 'who5',
    short: 'WHO-5',
    full: 'WHO-5 Well-Being Index',
    category: 'Overall Wellbeing',
    icon: 'gauge',
    desc: 'World Health Organization validated 5-item scale measuring vitality, positive mood, and general psychological wellbeing.'
  },
  {
    id: 'pss10',
    short: 'PSS-10',
    full: 'Perceived Stress Scale (PSS-10)',
    category: 'Emotional & Mental',
    icon: 'brain',
    desc: 'Classic psychometric instrument measuring how unpredictable, uncontrollable, and overloaded life events feel.'
  },
  {
    id: 'ucla3',
    short: 'UCLA-3',
    full: 'UCLA 3-Item Loneliness Scale',
    category: 'Relationships & Social',
    icon: 'users',
    desc: 'Peer-reviewed standard assessing relational connectedness, companionship, and perceived social isolation.'
  },
  {
    id: 'promis4',
    short: 'PROMIS-4',
    full: 'PROMIS Meaning & Purpose (4-Item)',
    category: 'Meaning & Spiritual',
    icon: 'compass',
    desc: 'NIH-validated self-report metric measuring personal direction, core values, and life significance.'
  },
  {
    id: 'cfpb5',
    short: 'CFPB-5',
    full: 'CFPB Financial Well-Being Scale',
    category: 'Financial Wellness',
    icon: 'wallet',
    desc: 'Standardized consumer finance benchmark measuring perceived financial security and resilience against unexpected expenses.'
  },
  {
    id: 'flourishing',
    short: 'Flourishing',
    full: 'Diener Flourishing Scale (8-Item)',
    category: 'Intellectual & Growth',
    icon: 'sprout',
    desc: 'Comprehensive psychological scale covering self-esteem, competence, optimism, and continuous curiosity.'
  },
  {
    id: 'ins',
    short: 'INS',
    full: 'Inclusion of Nature in Self (INS)',
    category: 'Environmental & Cultural',
    icon: 'mountain',
    desc: 'Validated graphical scale assessing personal belonging, ecological connection, and spatial harmony.'
  },
  {
    id: 'somatic',
    short: 'Somatic',
    full: 'Composite Somatic Inventory',
    category: 'Physical & Regeneration',
    icon: 'refresh',
    desc: 'Multidimensional assessment of sleep architecture, restoration depth, physical vitality, and recovery cycles.'
  },
  {
    id: 'circumplex',
    short: 'Circumplex',
    full: 'Circumplex Model of Affect',
    category: 'Emotional State',
    icon: 'circle-dot',
    desc: 'Russell dimensional model mapping momentary emotional valence (pleasantness) and physiological activation.'
  },
  {
    id: 'bodymap',
    short: 'Body Map',
    full: 'Interactive Somatic Body Mapping',
    category: 'Body Somatics',
    icon: 'person',
    desc: 'Topographical mapping of localized muscular holding patterns, tension, and physical sensations.'
  },
  {
    id: 'ans',
    short: 'ANS State',
    full: 'Autonomic Nervous System State',
    category: 'Nervous System',
    icon: 'activity',
    desc: 'Polyvagal-informed reflection classifying ventral vagal (safety), sympathetic (fight/flight), and dorsal vagal (freeze).'
  },
  {
    id: 'breathing',
    short: 'Breathing',
    full: 'Paced Slow Resonant Breathing',
    category: 'Regulation Practice',
    icon: 'wind',
    desc: 'Guided 6 breaths-per-minute interactive pacing task measuring real-time parasympathetic vagal activation.'
  },
  {
    id: 'discounting',
    short: 'Discounting',
    full: 'Delay Discounting & Agency Choice',
    category: 'Motivation & Agency',
    icon: 'clock',
    desc: 'Behavioural economics paradigm measuring present versus future trade-offs and capacity for follow-through.'
  }
]

function PillIcon({ name, size = 14, color = 'currentColor' }) {
  switch (name) {
    case 'gauge':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
      )
    case 'brain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M12 5v13" />
        </svg>
      )
    case 'users':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'compass':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    case 'wallet':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      )
    case 'sprout':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-13" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        </svg>
      )
    case 'mountain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      )
    case 'refresh':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
        </svg>
      )
    case 'circle-dot':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" />
        </svg>
      )
    case 'person':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" /><path d="m9 20 3-6 3 6" /><path d="m6 8 6 2 6-2" /><path d="M12 10v4" />
        </svg>
      )
    case 'activity':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    case 'wind':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        </svg>
      )
    case 'clock':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      )
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

export default function TopFrameworkPills({ onExploreMethodology }) {
  const [selectedId, setSelectedId] = useState(null)
  const selectedItem = FRAMEWORKS.find((f) => f.id === selectedId)

  const handleToggle = (id) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      background: 'rgba(255, 255, 255, 0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 174, 157, 0.14)',
      padding: '8px 0',
      position: 'relative',
      zIndex: 20,
      boxShadow: '0 2px 12px rgba(0, 174, 157, 0.05)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 clamp(16px, 3.5vw, 44px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxSizing: 'border-box',
      }}>
        {/* Full-Screen Single-Line Compact Framework Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          gap: 'clamp(4px, 0.6vw, 8px)',
          width: '100%',
          padding: '2px 0',
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: TEAL,
            fontFamily: "'Nunito', sans-serif",
            marginRight: '4px',
            flexShrink: 0,
          }}>
            Research Informed:
          </span>

          {FRAMEWORKS.map((item) => {
            const isSelected = selectedId === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => handleToggle(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`${item.full} · ${item.category}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '24px',
                  padding: '0 clamp(6px, 0.7vw, 10px)',
                  borderRadius: '999px',
                  border: isSelected ? `1.5px solid ${TEAL}` : '1px solid rgba(0, 174, 157, 0.22)',
                  background: isSelected ? 'rgba(0, 174, 157, 0.12)' : '#ffffff',
                  color: isSelected ? TEAL : INK,
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '11px',
                  fontWeight: isSelected ? 800 : 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isSelected ? '0 2px 8px rgba(0, 174, 157, 0.18)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.18s ease',
                }}
              >
                <PillIcon name={item.icon} size={11} color={isSelected ? TEAL : '#00ae9d'} />
                <span>{item.short}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected Item Description Popup / Accordion */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              overflow: 'hidden',
              background: '#f4faf8',
              borderTop: '1px solid rgba(0, 174, 157, 0.15)',
              marginTop: '6px',
              width: '100%',
            }}
          >
            <div style={{
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto',
              padding: '12px clamp(16px, 3.5vw, 44px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              boxSizing: 'border-box',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(0, 174, 157, 0.15)',
                  color: TEAL,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <PillIcon name={selectedItem.icon} size={16} color={TEAL} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: INK, fontFamily: "'Nunito', sans-serif" }}>
                      {selectedItem.full}
                    </h4>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: TEAL,
                      background: '#e1f5f2',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}>
                      {selectedItem.category}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#556563', lineHeight: 1.4, fontFamily: "'Nunito', sans-serif" }}>
                    {selectedItem.desc}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setSelectedId(null)}
                  aria-label="Close"
                  style={{
                    background: 'rgba(0, 0, 0, 0.05)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#657370',
                    fontSize: '12px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
