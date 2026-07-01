import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage5_2InsScreen() {
  const { setScreen, setProfileField, ins } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_2Swls')
  }

  const renderOverlapCircles = (idx) => {
    // idx: 0 to 6
    // overlap goes from index 0 (touching) to index 6 (almost nested)
    const distance = 26 - (idx * 4) // distance between circle centers
    return (
      <svg width="100" height="70" viewBox="0 0 100 70" style={{ overflow: 'visible' }}>
        {/* Left Circle (Self) */}
        <circle 
          cx={50 - distance/2} 
          cy="35" 
          r="22" 
          fill="rgba(255, 148, 102, 0.05)" 
          stroke={ins === idx + 1 ? 'var(--dawn)' : 'rgba(255,255,255,0.2)'} 
          strokeWidth={ins === idx + 1 ? '2' : '1.2'} 
          style={{ transition: 'all 0.2s ease' }}
        />
        {/* Right Circle (Nature) */}
        <circle 
          cx={50 + distance/2} 
          cy="35" 
          r="22" 
          fill="rgba(143, 191, 160, 0.05)" 
          stroke={ins === idx + 1 ? 'var(--green)' : 'rgba(255,255,255,0.2)'} 
          strokeWidth={ins === idx + 1 ? '2' : '1.2'} 
          style={{ transition: 'all 0.2s ease' }}
        />
        <text x={50 - distance/2} y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--text)" style={{ pointerEvents: 'none' }}>Self</text>
        <text x={50 + distance/2} y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--text)" style={{ pointerEvents: 'none' }}>Nature</text>
      </svg>
    )
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow">Environmental Connection</p>
        <h1 className="headline" style={{ fontSize: '22px' }}>Inclusion of Nature in Self</h1>
        <p className="sub" style={{ marginBottom: '2rem' }}>Select the drawing that best represents your relationship with the natural world.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
          gap: '12px', 
          margin: '2rem auto', 
          maxWidth: '800px',
          width: '100%'
        }}>
          {Array.from({ length: 7 }).map((_, idx) => {
            const val = idx + 1
            const selected = ins === val
            return (
              <button
                key={idx}
                onClick={() => setProfileField('ins', val)}
                className={`scale-opt ${selected ? 'selected' : ''}`}
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: selected ? 'var(--dawn-glow)' : 'var(--panel-2)',
                  borderRadius: '16px',
                  border: `1px solid ${selected ? 'var(--dawn)' : 'var(--panel-border)'}`,
                  cursor: 'pointer'
                }}
              >
                {renderOverlapCircles(idx)}
                <span style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, color: selected ? 'var(--dawn)' : 'var(--text-mute)' }}>Level {val}</span>
              </button>
            )
          })}
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext} disabled={ins === null}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
