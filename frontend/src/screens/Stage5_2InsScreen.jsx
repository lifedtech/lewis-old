import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_2InsScreen() {
  const { setScreen, setProfileField, ins } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_2Swls')
  }

  const LEVEL_DESCRIPTIONS = [
    'Separate',
    'Touching',
    'Connected',
    'Intertwined',
    'Integrated',
    'Merged',
    'Unified'
  ]

  const renderOverlapCircles = (idx, selected) => {
    // idx: 0 to 6
    // R = 21. Max distance (Level 1) = 54. Min distance (Level 7) = 0.
    const distance = 54 - (idx * (54 / 6))
    const cxSelf = 60 - distance / 2
    const cxNature = 60 + distance / 2

    // Position Self text towards top and Nature text towards bottom to prevent collision at any overlap
    const selfY = distance < 15 ? 13 : 15
    const natureY = distance < 15 ? 65 : 63

    return (
      <svg width="100%" viewBox="0 0 120 74" style={{ overflow: 'visible', maxWidth: '120px', height: 'auto' }}>
        <defs>
          <radialGradient id={`gradSelf-${idx}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FF7E67" stopOpacity={selected ? "0.6" : "0.35"} />
            <stop offset="100%" stopColor="#FF4B4B" stopOpacity={selected ? "0.45" : "0.2"} />
          </radialGradient>
          <radialGradient id={`gradNature-${idx}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity={selected ? "0.6" : "0.35"} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={selected ? "0.45" : "0.2"} />
          </radialGradient>
        </defs>

        {/* Self Circle */}
        <circle 
          cx={cxSelf} 
          cy="37" 
          r="21" 
          fill={`url(#gradSelf-${idx})`} 
          stroke={selected ? '#FF4B4B' : 'rgba(255, 75, 75, 0.45)'} 
          strokeWidth={selected ? '2' : '1.2'} 
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Nature Circle */}
        <circle 
          cx={cxNature} 
          cy="37" 
          r="21" 
          fill={`url(#gradNature-${idx})`} 
          stroke={selected ? '#10B981' : 'rgba(16, 185, 129, 0.45)'} 
          strokeWidth={selected ? '2' : '1.2'} 
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Labels positioned at top and bottom to eliminate text overlap */}
        <text 
          x={cxSelf} 
          y={selfY} 
          textAnchor="middle" 
          fontSize="10" 
          fontWeight="700" 
          fill={selected ? '#E11D48' : '#F43F5E'} 
          style={{ pointerEvents: 'none', letterSpacing: '0.04em' }}
        >
          Self
        </text>

        <text 
          x={cxNature} 
          y={natureY} 
          textAnchor="middle" 
          fontSize="10" 
          fontWeight="700" 
          fill={selected ? '#047857' : '#10B981'} 
          style={{ pointerEvents: 'none', letterSpacing: '0.04em' }}
        >
          Nature
        </text>
      </svg>
    )
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--dawn)', textTransform: 'uppercase' }}>
                INCLUSION OF NATURE · 1 OF 1
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-mute)' }}>
                {ins !== null ? '100%' : '0%'}
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--dawn), #10b981)' }}
                animate={{ width: ins !== null ? '100%' : '0%' }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>
          </div>
          <h1 className="headline" style={{ fontSize: '36px', margin: 0, textAlign: 'left' }}>
            Inclusion of Nature in Self
          </h1>
          <p className="sub" style={{ fontSize: '16px', margin: '8px 0 0 0', textAlign: 'left', color: 'var(--text-mute)' }}>
            Select the diagram that best reflects how interconnected you feel with the natural world.
          </p>
        </div>
        
        {/* Horizontal Venn Diagrams Grid */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          gap: '12px',
          width: '100%',
          marginBottom: '36px'
        }}>
          {Array.from({ length: 7 }).map((_, idx) => {
            const val = idx + 1
            const selected = ins === val
            return (
              <motion.button
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfileField('ins', val)}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  padding: '16px 8px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: selected ? 'rgba(255, 148, 102, 0.12)' : 'var(--panel-2)',
                  borderRadius: '20px',
                  border: `2px solid ${selected ? 'var(--dawn)' : 'var(--panel-border)'}`,
                  boxShadow: selected 
                    ? '0 8px 24px rgba(255, 148, 102, 0.25)' 
                    : '0 4px 12px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  outline: 'none'
                }}
              >
                {renderOverlapCircles(idx, selected)}
                
                <span style={{ 
                  marginTop: '12px', 
                  fontSize: '13px', 
                  fontWeight: selected ? 700 : 600, 
                  color: selected ? 'var(--dawn)' : 'var(--text)' 
                }}>
                  Level {val}
                </span>

                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 500, 
                  color: selected ? 'var(--dawn)' : 'var(--text-mute)', 
                  opacity: selected ? 1 : 0.7,
                  marginTop: '2px'
                }}>
                  {LEVEL_DESCRIPTIONS[idx]}
                </span>
              </motion.button>
            )
          })}
        </div>
        
        {/* Continue Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
          <button 
            className="btn-primary" 
            onClick={handleNext} 
            disabled={ins === null} 
            style={{ maxWidth: '240px', width: '100%' }}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}

