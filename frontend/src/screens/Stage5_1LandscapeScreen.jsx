import React, { useState } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'

const DIMENSIONS = [
  {code:'PH', name:'Physical & Regeneration', score:58, insight:"Sleep and movement have been adequate, not abundant. There's room to rebuild reserve."},
  {code:'EM', name:'Emotional & Mental', score:41, insight:"Day-to-day strain is sitting close to the surface right now — closer than it usually does."},
  {code:'EN', name:'Engagement & Energy', score:52, insight:"Some days pull real interest. Others move past without much pulling at all."},
  {code:'RS', name:'Relationships & Social', score:81, insight:"The people nearby are a real source of steadiness right now — lean on that."},
  {code:'MS', name:'Meaning & Spiritual', score:63, insight:"A sense of what matters is mostly holding, even when the days get full."},
  {code:'AC', name:'Accomplishment & Agency', score:55, insight:"Capability feels intact, even where follow-through hasn't always matched it."},
  {code:'FW', name:'Financial Wellness', score:29, insight:"Money has been taking up more room than it should lately — this may be where the rest starts."},
  {code:'IG', name:'Intellectual & Growth', score:67, insight:"Curiosity is still finding its way in, even on the fuller weeks."},
  {code:'EC', name:'Environmental & Cultural', score:60, insight:"Surroundings and sense of belonging are mostly steady, quietly in the background."}
]

const ROOT = 'FW'
const BRIGHT = 'RS'

function getBand(score) {
  if(score < 40) return { cls: 'dep', label: 'Quietly depleted' }
  if(score <= 65) return { cls: 'mid', label: 'Finding its footing' }
  return { cls: 'res', label: 'Steadily resourced' }
}

export default function Stage5_1LandscapeScreen() {
  const { setScreen } = useLewisStore()
  const [selectedCode, setSelectedCode] = useState(null)

  const cx = 200
  const cy = 200
  const R = 145
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
    <motion.section 
      className="screen-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <div className="content-wrapper" style={{ alignItems: 'center', gap: '48px', padding: '0' }}>
        {/* Left Side: Header, Legend & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
          <p className="eyebrow" style={{ margin: '0 0 4px 0' }}>The Landscape</p>
          <h1 className="headline" style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'left' }}>Where you're resourced,<br/>and where depleted.</h1>
          <p className="sub" style={{ marginBottom: '24px', textAlign: 'left' }}>Tap a point to read more.</p>

          <div className="legend" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-mute)', marginBottom: '24px' }}>
            <span className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span className="legend-dot swatch-dep" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#c85250', display: 'inline-block' }}></span>Quietly depleted</span>
            <span className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span className="legend-dot swatch-mid" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#e6c229', display: 'inline-block' }}></span>Finding its footing</span>
            <span className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span className="legend-dot swatch-res" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6b8e23', display: 'inline-block' }}></span>Steadily resourced</span>
          </div>

          <div className="detail-panel" id="detailPanel" style={{ minHeight: '124px', padding: '20px', background: 'var(--panel)', borderRadius: '24px', border: '1px solid var(--panel-border)', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', width: '100%', maxWidth: '400px', marginBottom: '0' }}>
            {!selectedNode ? (
              <p className="detail-empty" style={{ margin: 0, color: 'var(--text-mute)', fontStyle: 'italic', textAlign: 'left' }}>Tap a point on the radar to read more.</p>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ textAlign: 'left' }}>
                <p className={`detail-band ${getBand(selectedNode.score).cls}`} style={{ color: getBand(selectedNode.score).cls === 'dep' ? '#c85250' : getBand(selectedNode.score).cls === 'mid' ? '#e6c229' : '#6b8e23', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedBand.label}{selectedTag}</p>
                <p className="detail-name" style={{ color: 'var(--text)', fontWeight: 800, margin: '0 0 8px 0', fontSize: '18px' }}>{selectedNode.name}</p>
                <p className="detail-text" style={{ color: 'var(--text-mute)', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{selectedNode.insight}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Map & Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', gap: '16px' }}>
          
          <div className="const-wrap" style={{ width: '100%', maxWidth: '400px', alignSelf: 'center' }}>
            <svg id="constellationSvg" viewBox="0 0 400 400" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {nodes.map(d => (
                <line 
                  key={`spoke-${d.code}`}
                  className={`spoke ${d.code === ROOT ? 'spoke-root' : ''}`} 
                  x1={cx} y1={cy} 
                  x2={d._x} y2={d._y} 
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="2"
                />
              ))}

              {fw && em && (
                <path 
                  className="cascade-path" 
                  d={`M ${fw._x} ${fw._y} Q ${cx} ${cy} ${em._x} ${em._y}`}
                  fill="none"
                  stroke="var(--dawn)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              )}

              <circle className="center-node" cx={cx} cy={cy} r="30" fill="var(--panel-2)" stroke="var(--panel-border)" strokeWidth="1" />
              <text className="center-label" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="var(--text)" fontSize="12" fontWeight="bold">YOU</text>

              {nodes.map(d => {
                const r = 16 + (d.score / 100) * 14
                const band = getBand(d.score)
                const colorMap = { dep: '#c85250', mid: '#e6c229', res: '#6b8e23' }
                return (
                  <g 
                    key={`node-${d.code}`}
                    className={`node-group ${selectedCode === d.code ? 'is-selected' : ''}`} 
                    tabIndex="0" 
                    role="button" 
                    aria-label={d.name}
                    onClick={() => setSelectedCode(d.code)}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    {d.code === ROOT && <circle className="root-ring" cx={d._x} cy={d._y} r={r + 9} fill="none" stroke="var(--dawn)" strokeWidth="1.5" strokeDasharray="3,3" />}
                    {d.code === BRIGHT && <circle className="bright-ring" cx={d._x} cy={d._y} r={r + 9} fill="none" stroke="#6b8e23" strokeWidth="1.5" strokeDasharray="3,3" />}
                    <circle className={`node ${band.cls}`} cx={d._x} cy={d._y} r={r} fill={colorMap[band.cls]} style={{ transition: 'all 0.3s ease', transform: selectedCode === d.code ? 'scale(1.1)' : 'scale(1)', transformOrigin: `${d._x}px ${d._y}px` }} />
                    <text className="node-label" x={d._x} y={d._y + r + 18} textAnchor="middle" fill="var(--text-mute)" fontSize="11" fontWeight="600">{d.code}</text>
                  </g>
                )
              })}
            </svg>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', maxWidth: '320px', marginTop: '24px' }}
            onClick={() => setScreen('stage5_2Pss10')}
          >
            Begin Assessments
          </button>
        </div>
      </div>
    </motion.section>
  )
}
