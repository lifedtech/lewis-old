import {  useState  } from 'react';
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'

const DIMENSIONS = [
  { code: 'PH', name: 'Physical & Regeneration', score: 58, insight: "Sleep and movement have been adequate, not abundant. There's room to rebuild reserve." },
  { code: 'EM', name: 'Emotional & Mental', score: 41, insight: "Day-to-day strain is sitting close to the surface right now — closer than it usually does." },
  { code: 'EN', name: 'Engagement & Energy', score: 52, insight: "Some days pull real interest. Others move past without much pulling at all." },
  { code: 'RS', name: 'Relationships & Social', score: 81, insight: "The people nearby are a real source of steadiness right now — lean on that." },
  { code: 'MS', name: 'Meaning & Spiritual', score: 63, insight: "A sense of what matters is mostly holding, even when the days get full." },
  { code: 'AC', name: 'Accomplishment & Agency', score: 55, insight: "Capability feels intact, even where follow-through hasn't always matched it." },
  { code: 'FW', name: 'Financial Wellness', score: 29, insight: "Money has been taking up more room than it should lately — this may be where the rest starts." },
  { code: 'IG', name: 'Intellectual & Growth', score: 67, insight: "Curiosity is still finding its way in, even on the fuller weeks." },
  { code: 'EC', name: 'Environmental & Cultural', score: 60, insight: "Surroundings and sense of belonging are mostly steady, quietly in the background." }
]

const ROOT = 'FW'
const BRIGHT = 'RS'

function getBand(score) {
  if (score < 40) return { cls: 'dep', label: 'Quietly depleted' }
  if (score <= 65) return { cls: 'mid', label: 'Finding its footing' }
  return { cls: 'res', label: 'Steadily resourced' }
}

export default function Stage5_1LandscapeScreen() {
  const { setScreen } = useLewisStore()
  const [selectedCode, setSelectedCode] = useState(null)

  const cx = 200
  const cy = 200
  const R = 135
  const n = DIMENSIONS.length

  const nodes = DIMENSIONS.map((d, i) => {
    const angle = (-90 + i * (360 / n)) * Math.PI / 180
    return {
      ...d,
      _x: cx + R * Math.cos(angle),
      _y: cy + R * Math.sin(angle)
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

        {/* LEFT — Eyebrow + Title + Subtitle + Legend + Detail Card */}
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
              THE LANDSCAPE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(20px, 2.4vw, 30px)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Where you're</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>resourced, and</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>where depleted.</span>
            </h1>
            <p style={{
              margin: '8px 0 0 2px',
              fontSize: 'clamp(12.5px, 1.4vw, 14.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.4,
              maxWidth: '350px',
            }}>
              Tap a point on the radar to inspect details.
            </p>
          </div>

          {/* Color Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#414242', fontFamily: "'Nunito', sans-serif" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ae9d', display: 'inline-block' }}></span>
              <span>Quietly depleted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#5fbb46', display: 'inline-block' }}></span>
              <span>Finding its footing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ae9d', display: 'inline-block' }}></span>
              <span>Steadily resourced</span>
            </div>
          </div>

          {/* Detail Card Panel */}
          <div style={{
            minHeight: '100px',
            padding: '14px 18px',
            background: '#f2f9f6',
            borderRadius: '16px',
            border: '1.5px solid #d2e7e0',
            width: '100%',
            maxWidth: '350px',
            boxSizing: 'border-box',
          }}>
            {!selectedNode ? (
              <p style={{ margin: 0, color: '#414242', fontStyle: 'italic', fontSize: '13px', textAlign: 'left', fontFamily: "'Nunito', sans-serif" }}>
                Tap a point on the radar to read more.
              </p>
            ) : (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ textAlign: 'left' }}>
                <p style={{ color: getBand(selectedNode.score).cls === 'dep' ? '#00ae9d' : getBand(selectedNode.score).cls === 'mid' ? '#5fbb46' : '#00ae9d', margin: '0 0 4px 0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"IBM Plex Mono", monospace' }}>
                  {selectedBand.label}{selectedTag}
                </p>
                <p style={{ color: '#414242', fontWeight: 700, margin: '0 0 4px 0', fontSize: '15px', fontFamily: "'Manrope', sans-serif" }}>
                  {selectedNode.name}
                </p>
                <p style={{ color: '#414242', margin: 0, fontSize: '12.5px', lineHeight: 1.4, fontFamily: "'Nunito', sans-serif" }}>
                  {selectedNode.insight}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT — RESOURCED RADAR Eyebrow + Radar Chart + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 14px 0',
            width: '100%',
          }}>
            RESOURCED RADAR
          </p>

          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}>
            <div style={{ width: '100%', maxWidth: '320px', aspectRatio: '1/1', marginLeft: '28px' }}>
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {nodes.map(d => (
                  <line
                    key={`spoke-${d.code}`}
                    x1={cx} y1={cy}
                    x2={d._x} y2={d._y}
                    stroke="rgba(65, 66, 66, 0.12)"
                    strokeWidth="1.5"
                  />
                ))}

                {fw && em && (
                  <path
                    d={`M ${fw._x} ${fw._y} Q ${cx} ${cy} ${em._x} ${em._y}`}
                    fill="none"
                    stroke="#00ae9d"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                )}

                <circle cx={cx} cy={cy} r="26" fill="#f2f9f6" stroke="#d2e7e0" strokeWidth="1.5" />
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#414242" fontSize="11" fontWeight="800" fontFamily='"IBM Plex Mono", monospace'>YOU</text>

                {nodes.map(d => {
                  const r = 14 + (d.score / 100) * 12
                  const band = getBand(d.score)
                  const colorMap = { dep: '#00ae9d', mid: '#5fbb46', res: '#00ae9d' }
                  return (
                    <g
                      key={`node-${d.code}`}
                      onClick={() => setSelectedCode(d.code)}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    >
                      {d.code === ROOT && <circle cx={d._x} cy={d._y} r={r + 8} fill="none" stroke="#00ae9d" strokeWidth="1.5" strokeDasharray="3,3" />}
                      {d.code === BRIGHT && <circle cx={d._x} cy={d._y} r={r + 8} fill="none" stroke="#00ae9d" strokeWidth="1.5" strokeDasharray="3,3" />}
                      <circle cx={d._x} cy={d._y} r={r} fill={colorMap[band.cls]} style={{ transition: 'all 0.3s ease', transform: selectedCode === d.code ? 'scale(1.15)' : 'scale(1)', transformOrigin: `${d._x}px ${d._y}px` }} />
                      <text x={d._x} y={d._y + r + 16} textAnchor="middle" fill="#414242" fontSize="10" fontWeight="700" fontFamily='"IBM Plex Mono", monospace'>{d.code}</text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              style={{ padding: '10px 36px' }}
              onClick={() => setScreen('stage5_2Pss10')}
            >
              Begin Assessments
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
