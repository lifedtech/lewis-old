import { useState } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion, AnimatePresence } from 'framer-motion'

const DIMENSIONS = [
  { code: 'PH', label: 'Physical', name: 'Physical & Regeneration', score: 58, insight: "Sleep and movement have been adequate, not abundant. There's room to rebuild reserve." },
  { code: 'EM', label: 'Emotional', name: 'Emotional & Mental', score: 41, insight: "Day-to-day strain is sitting close to the surface right now — closer than it usually does." },
  { code: 'EN', label: 'Energy', name: 'Engagement & Energy', score: 52, insight: "Some days pull real interest. Others move past without much pulling at all." },
  { code: 'RS', label: 'Social', name: 'Relationships & Social', score: 81, insight: "The people nearby are a real source of steadiness right now — lean on that." },
  { code: 'MS', label: 'Meaning', name: 'Meaning & Spiritual', score: 63, insight: "A sense of what matters is mostly holding, even when the days get full." },
  { code: 'AC', label: 'Agency', name: 'Accomplishment & Agency', score: 55, insight: "Capability feels intact, even where follow-through hasn't always matched it." },
  { code: 'FW', label: 'Finance', name: 'Financial Wellness', score: 29, insight: "Money has been taking up more room than it should lately — this may be where the rest starts." },
  { code: 'IG', label: 'Growth', name: 'Intellectual & Growth', score: 67, insight: "Curiosity is still finding its way in, even on the fuller weeks." },
  { code: 'EC', label: 'Culture', name: 'Environmental & Cultural', score: 60, insight: "Surroundings and sense of belonging are mostly steady, quietly in the background." }
]

const ROOT = 'FW'
const BRIGHT = 'RS'

function getBand(score) {
  if (score < 40) return { cls: 'dep', label: 'Quietly depleted', color: '#d0574f', bg: '#fdf2f2', border: '#fca5a5' }
  if (score <= 65) return { cls: 'mid', label: 'Finding footing', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' }
  return { cls: 'res', label: 'Steadily resourced', color: '#00ae9d', bg: '#f0fdfa', border: '#99f6e4' }
}

export default function Stage5_1LandscapeScreen() {
  const { setScreen } = useLewisStore()
  const [selectedCode, setSelectedCode] = useState('FW')

  const cx = 230
  const cy = 205
  const R = 118
  const n = DIMENSIONS.length

  const nodes = DIMENSIONS.map((d, i) => {
    const angle = (-90 + i * (360 / n)) * (Math.PI / 180)
    return {
      ...d,
      _x: cx + R * Math.cos(angle),
      _y: cy + R * Math.sin(angle),
      angle
    }
  })

  const fw = nodes.find(n => n.code === 'FW')
  const em = nodes.find(n => n.code === 'EM')

  const selectedNode = selectedCode ? nodes.find(n => n.code === selectedCode) : null
  const selectedBand = selectedNode ? getBand(selectedNode.score) : null
  const selectedTag = selectedNode?.code === ROOT ? ' · root driver' : (selectedNode?.code === BRIGHT ? ' · bright spot' : '')

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

        {/* LEFT COLUMN: Header, Legend & Detail Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
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
              THE LANDSCAPE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.015em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
            }}>
              Where you're resourced, and where depleted.
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
              Tap any point on the radar to inspect details and baseline drivers.
            </p>

            {/* COLOR LEGEND */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '11.5px',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              marginTop: '16px',
              fontWeight: 600,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d0574f', display: 'inline-block' }} />
                <span>Quietly depleted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                <span>Finding footing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ae9d', display: 'inline-block' }} />
                <span>Steadily resourced</span>
              </div>
            </div>
          </div>

          {/* INSPECTOR CARD PANEL */}
          <div style={{
            minHeight: '100px',
            padding: '16px 20px',
            background: selectedBand ? selectedBand.bg : '#f2f9f6',
            borderRadius: '18px',
            border: `1.5px solid ${selectedBand ? selectedBand.border : '#d2e7e0'}`,
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'left',
            transition: 'all 0.25s ease',
          }}>
            {!selectedNode ? (
              <p style={{ margin: '8px 0', color: '#414242', fontStyle: 'italic', fontSize: '13.5px', textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>
                Tap a point on the radar to read more.
              </p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedNode.code}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ color: selectedBand.color, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"Nunito", sans-serif' }}>
                      {selectedBand.label}{selectedTag}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#414242', fontFamily: '"Nunito", sans-serif' }}>
                      Score: {selectedNode.score}/100
                    </span>
                  </div>
                  <h4 style={{ color: '#1e293b', fontWeight: 800, margin: '0 0 4px 0', fontSize: '15px', fontFamily: "'Manrope', sans-serif" }}>
                    {selectedNode.name}
                  </h4>
                  <p style={{ color: '#414242', margin: 0, fontSize: '13px', lineHeight: 1.45, fontFamily: "'Nunito', sans-serif" }}>
                    {selectedNode.insight}
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Constellation Radar SVG */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            aspectRatio: '460/420',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
            <svg viewBox="0 0 460 420" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <radialGradient id="radarAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#00ae9d" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Ambient Ring */}
              <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(0, 174, 157, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={cx} cy={cy} r={R * 0.6} fill="none" stroke="rgba(0, 174, 157, 0.08)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r={R + 35} fill="url(#radarAura)" />

              {/* Spoke Lines */}
              {nodes.map(d => (
                <line
                  key={`spoke-${d.code}`}
                  x1={cx}
                  y1={cy}
                  x2={d._x}
                  y2={d._y}
                  stroke={selectedCode === d.code ? '#00ae9d' : 'rgba(65, 66, 66, 0.15)'}
                  strokeWidth={selectedCode === d.code ? '2' : '1.2'}
                  strokeDasharray={selectedCode === d.code ? 'none' : '3 2'}
                  style={{ transition: 'all 0.2s ease' }}
                />
              ))}

              {/* Driver Connection Flow */}
              {fw && em && (
                <path
                  d={`M ${fw._x} ${fw._y} Q ${cx} ${cy} ${em._x} ${em._y}`}
                  fill="none"
                  stroke="#d0574f"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />
              )}

              {/* Center "YOU" Core */}
              <circle cx={cx} cy={cy} r="24" fill="#ffffff" stroke="#00ae9d" strokeWidth="2" filter="drop-shadow(0 2px 6px rgba(0,174,157,0.18))" />
              <circle cx={cx} cy={cy} r="18" fill="#e4f4ee" />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#017a6f" fontSize="11" fontWeight="800" fontFamily='"Nunito", sans-serif'>
                YOU
              </text>

              {/* Interactive Node Anchors */}
              {nodes.map(d => {
                const r = 16
                const band = getBand(d.score)
                const isSelected = selectedCode === d.code

                // Intelligently calculate text anchor & position to prevent circle collisions
                const cos = Math.cos(d.angle)
                const sin = Math.sin(d.angle)

                let textAnchor = 'middle'
                let textX = d._x
                let textY = d._y

                if (cos > 0.35) {
                  textAnchor = 'start'
                  textX = d._x + r + 12
                  textY = d._y + sin * 4
                } else if (cos < -0.35) {
                  textAnchor = 'end'
                  textX = d._x - r - 12
                  textY = d._y + sin * 4
                } else if (sin < 0) {
                  textAnchor = 'middle'
                  textX = d._x
                  textY = d._y - r - 10
                } else {
                  textAnchor = 'middle'
                  textX = d._x
                  textY = d._y + r + 16
                }

                return (
                  <g
                    key={`node-${d.code}`}
                    onClick={() => setSelectedCode(d.code)}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    {/* Root Driver Indicator */}
                    {d.code === ROOT && (
                      <circle cx={d._x} cy={d._y} r={r + 7} fill="none" stroke="#d0574f" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.9" />
                    )}

                    {/* Bright Spot Indicator */}
                    {d.code === BRIGHT && (
                      <circle cx={d._x} cy={d._y} r={r + 7} fill="none" stroke="#00ae9d" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.9" />
                    )}

                    {/* Selected Active Ring */}
                    {isSelected && (
                      <circle cx={d._x} cy={d._y} r={r + 4} fill="none" stroke={band.color} strokeWidth="2.5" />
                    )}

                    {/* Node Sphere */}
                    <circle
                      cx={d._x}
                      cy={d._y}
                      r={isSelected ? r + 2 : r}
                      fill={band.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        filter: isSelected ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }}
                    />

                    {/* Score inside node */}
                    <text
                      x={d._x}
                      y={d._y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="800"
                      fontFamily='"Nunito", sans-serif'
                      style={{ pointerEvents: 'none' }}
                    >
                      {d.score}
                    </text>

                    {/* Label outside circle */}
                    <text
                      x={textX}
                      y={textY}
                      textAnchor={textAnchor}
                      dominantBaseline="central"
                      fill={isSelected ? '#00ae9d' : '#414242'}
                      fontSize="11.5"
                      fontWeight={isSelected ? '800' : '700'}
                      fontFamily='"Nunito", sans-serif'
                      style={{ pointerEvents: 'none' }}
                    >
                      {d.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* FOOTER ACTION BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '12px' }}>
            <button
              className="btn-primary"
              style={{ padding: '12px 40px', fontSize: '15px' }}
              onClick={() => setScreen('stage5_0Email')}
            >
              Continue
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
