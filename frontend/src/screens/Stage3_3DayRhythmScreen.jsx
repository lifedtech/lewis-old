import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage3_3DayRhythmScreen() {
  const { setScreen, toggleArrayItem, dayRhythmMap } = useLewisStore()

  const handleNext = () => {
    setScreen('stage3_4Breathing')
  }

  const periods = [
    { id: 0, label: 'Late Night (12am - 6am)', icon: '🌙' },
    { id: 6, label: 'Early Morning (6am - 9am)', icon: '🌅' },
    { id: 9, label: 'Late Morning (9am - 12pm)', icon: '☀️' },
    { id: 12, label: 'Midday (12pm - 3pm)', icon: '☀️' },
    { id: 15, label: 'Late Afternoon (3pm - 6pm)', icon: '🌇' },
    { id: 18, label: 'Evening (6pm - 9pm)', icon: '🌆' },
    { id: 21, label: 'Night (9pm - 12am)', icon: '🌌' }
  ]

  const isSelected = (id) => (dayRhythmMap || []).includes(id)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Diurnal Energy Cycle</h1>
        <p className="sub">Highlight the periods of the day when you typically feel your energy peaks or feel most productive.</p>
        
        <div className="form-container" style={{ margin: '2rem auto', maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => toggleArrayItem('dayRhythmMap', p.id)}
                className={`scale-opt ${isSelected(p.id) ? 'selected' : ''}`}
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: isSelected(p.id) ? 'var(--dawn-glow)' : 'var(--panel-2)'
                }}
              >
                <span style={{ fontSize: '18px' }}>{p.icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{p.label}</span>
                {isSelected(p.id) && <span style={{ color: 'var(--dawn)', fontWeight: 600 }}>Active Peak</span>}
              </button>
            ))}
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
