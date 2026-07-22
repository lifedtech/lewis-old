import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import RhythmTimeIcon from '../components/RhythmTimeIcon.jsx'

export default function Stage3_3DayRhythmScreen() {
  const { setScreen, toggleArrayItem, dayRhythmMap } = useLewisStore()

  const handleNext = () => {
    setScreen('stage3_4Breathing')
  }

  const periods = [
    { id: 0, label: 'Late Night (12am - 6am)' },
    { id: 6, label: 'Early Morning (6am - 9am)' },
    { id: 9, label: 'Late Morning (9am - 12pm)' },
    { id: 12, label: 'Midday (12pm - 3pm)' },
    { id: 15, label: 'Late Afternoon (3pm - 6pm)' },
    { id: 18, label: 'Evening (6pm - 9pm)' },
    { id: 21, label: 'Night (9pm - 12am)' }
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
        
        <div className="form-container" style={{ margin: '1rem auto', maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {periods.map(p => {
              const active = isSelected(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleArrayItem('dayRhythmMap', p.id)}
                  className={`scale-opt ${active ? 'selected' : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    background: active ? 'rgba(255, 148, 102, 0.12)' : 'var(--panel-2)',
                    border: active ? '1.5px solid var(--dawn)' : '1px solid var(--panel-border)',
                    boxShadow: active ? '0 4px 20px rgba(255, 148, 102, 0.18)' : 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <RhythmTimeIcon periodId={p.id} isActive={active} size={36} />
                  <span style={{ flex: 1, textAlign: 'left', fontWeight: active ? 600 : 400, color: 'var(--text)' }}>{p.label}</span>
                  {active && (
                    <span style={{ 
                      color: 'var(--dawn)', 
                      fontWeight: 600, 
                      fontSize: '12px',
                      background: 'rgba(255, 148, 102, 0.2)',
                      padding: '4px 10px',
                      borderRadius: '12px'
                    }}>
                      Active Peak
                    </span>
                  )}
                </button>
              )
            })}
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
