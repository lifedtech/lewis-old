import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const DOMAIN_CARDS = [
  'Body & recovery',
  'Emotional calm',
  'Energy & drive',
  'Relationships',
  'Meaning & purpose',
  'Progress & agency',
  'Money & security',
  'Curiosity & learning',
  'Surroundings & belonging'
]

const ZONES = [
  { id: 'depleted', label: 'Depleted right now', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.06)', border: 'rgba(239, 68, 68, 0.3)' },
  { id: 'okay', label: 'Doing okay', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.3)' },
  { id: 'strength', label: 'A real strength', color: '#10b981', bg: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.3)' }
]

export default function StreamlinedLandscapeScreen() {
  const { domainSort, setProfileField, setScreen } = useLewisStore()
  const [placements, setPlacements] = useState(
    domainSort?.depleted?.length || domainSort?.okay?.length || domainSort?.strength?.length
      ? domainSort
      : { depleted: [], okay: [], strength: [] }
  )
  const [selectedCard, setSelectedCard] = useState(null)
  const [dragOverZone, setDragOverZone] = useState(null)
  const zoneRefs = useRef({})

  const unplacedCards = DOMAIN_CARDS.filter(
    (card) =>
      !placements.depleted?.includes(card) &&
      !placements.okay?.includes(card) &&
      !placements.strength?.includes(card)
  )

  const placeCard = (card, zoneId) => {
    if (!card) return
    const updated = {
      depleted: (placements.depleted || []).filter((c) => c !== card),
      okay: (placements.okay || []).filter((c) => c !== card),
      strength: (placements.strength || []).filter((c) => c !== card)
    }
    updated[zoneId].push(card)
    setPlacements(updated)
    setProfileField('domainSort', updated)
    setSelectedCard(null)
    setDragOverZone(null)
  }

  const handleRemoveCard = (card) => {
    const updated = {
      depleted: (placements.depleted || []).filter((c) => c !== card),
      okay: (placements.okay || []).filter((c) => c !== card),
      strength: (placements.strength || []).filter((c) => c !== card)
    }
    setPlacements(updated)
    setProfileField('domainSort', updated)
  }

  // Check drop point against zone bounding rects for Mobile Touch + Desktop
  const detectZoneUnderPoint = (x, y) => {
    for (const zone of ZONES) {
      const el = zoneRefs.current[zone.id]
      if (el) {
        const rect = el.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return zone.id
        }
      }
    }
    return null
  }

  const handleDrag = (event, info) => {
    const found = detectZoneUnderPoint(info.point.x, info.point.y)
    if (found !== dragOverZone) {
      setDragOverZone(found)
    }
  }

  const handleDragEnd = (event, info, card) => {
    const targetZone = detectZoneUnderPoint(info.point.x, info.point.y)
    if (targetZone) {
      placeCard(card, targetZone)
    }
    setDragOverZone(null)
  }

  const handleNext = () => {
    setScreen('sl_5_1Priority')
  }

  return (
    <motion.div
      className="screen-container"
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
        padding: '0 16px',
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
        margin: '0 0 10px 0',
      }}>
        ACT 4 · THE SHAPE OF YOUR LIFE
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(26px, 3.6vw, 44px)',
        lineHeight: 1.1,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
      }}>
        Your life landscape
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 24px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Drag cards into the categories below, or tap to sort.
      </p>

      {/* Unplaced Cards Tray */}
      {unplacedCards.length > 0 ? (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          maxWidth: '680px',
          marginBottom: '24px',
          padding: '16px',
          borderRadius: '20px',
          background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
          border: '1px solid var(--card-border, #e5e7eb)',
          boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
          touchAction: 'none',
        }}>
          {unplacedCards.map((card) => {
            const isSelected = selectedCard === card
            return (
              <motion.div
                key={card}
                drag
                dragSnapToOrigin={true}
                whileDrag={{ scale: 1.08, zIndex: 999, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.18)' }}
                onDrag={handleDrag}
                onDragEnd={(e, info) => handleDragEnd(e, info, card)}
                onClick={() => setSelectedCard(isSelected ? null : card)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #cbd5e1)',
                  background: isSelected ? 'var(--dawn, #00ae9d)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main, #414242)',
                  cursor: 'grab',
                  userSelect: 'none',
                  touchAction: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {card}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <p style={{
          fontSize: '13px',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          color: 'var(--dawn, #00ae9d)',
          marginBottom: '20px',
        }}>
          ✓ All 9 areas placed! Drag or tap any card to reposition.
        </p>
      )}

      {/* 3 Drop Zones */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: '780px',
        marginBottom: '28px',
      }}>
        {ZONES.map((zone) => {
          const cardsInZone = placements[zone.id] || []
          const isOver = dragOverZone === zone.id
          const hasSelected = selectedCard !== null
          return (
            <div
              key={zone.id}
              ref={(el) => (zoneRefs.current[zone.id] = el)}
              onClick={() => selectedCard && placeCard(selectedCard, zone.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '18px 14px',
                borderRadius: '20px',
                border: isOver || hasSelected
                  ? `2px dashed ${zone.color}`
                  : `1px solid ${zone.border}`,
                background: isOver ? `${zone.color}18` : zone.bg,
                cursor: hasSelected ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                minHeight: '140px',
                transform: isOver ? 'scale(1.02)' : 'none',
              }}
            >
              <h3 style={{
                fontSize: '15px',
                fontWeight: 700,
                color: zone.color,
                margin: '0 0 12px 0',
                fontFamily: "'Nunito', sans-serif",
              }}>
                {zone.label}
              </h3>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center',
                width: '100%',
                touchAction: 'none',
              }}>
                {cardsInZone.map((card) => (
                  <motion.div
                    key={card}
                    drag
                    dragSnapToOrigin={true}
                    whileDrag={{ scale: 1.08, zIndex: 999, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.18)' }}
                    onDrag={handleDrag}
                    onDragEnd={(e, info) => handleDragEnd(e, info, card)}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveCard(card)
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 600,
                      background: '#ffffff',
                      border: '1px solid var(--card-border, #e5e7eb)',
                      color: 'var(--text-main, #414242)',
                      cursor: 'grab',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      userSelect: 'none',
                      touchAction: 'none',
                    }}
                    title="Drag to another category, or tap to remove"
                  >
                    {card} <span style={{ marginLeft: '4px', opacity: 0.5 }}>✕</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
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
