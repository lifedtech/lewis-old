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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 52px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              SELECT ALL THAT APPLY
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#16302b',
              whiteSpace: 'nowrap',
            }}>
              Diurnal Energy Cycle
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Highlight the periods of the day when you typically feel your energy peaks or feel most productive.
            </p>
          </div>
        </div>

        {/* RIGHT — PEAK ENERGY PERIODS Eyebrow + 7 Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 14px 0',
            width: '100%',
          }}>
            PEAK ENERGY PERIODS
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', paddingRight: '4px', width: '100%' }}>
            {periods.map(p => {
              const active = isSelected(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleArrayItem('dayRhythmMap', p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: active ? '#e4f4ee' : '#f2f9f6',
                    color: active ? '#044e43' : '#3a3a3a',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '13.5px',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Selection Checkmark Circle Indicator */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                    background: active ? '#00ae9d' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  {/* Icon Badge */}
                  <RhythmTimeIcon periodId={p.id} isActive={active} size={28} />

                  {/* Label */}
                  <span style={{ flex: 1, textAlign: 'left' }}>{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button className="btn-primary" onClick={handleNext} style={{ padding: '10px 36px' }}>
              Continue
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
