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

export default function LandscapeScreen() {
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
      className="screen active"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ display: 'flex' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>The landscape</p>
      <h1 className="headline" style={{ fontSize: '22px' }}>Where you're resourced, and where depleted.</h1>
      <p className="sub" style={{ marginBottom: '6px' }}>Tap a point to read more.</p>

      <div className="legend">
        <span className="legend-item"><span className="legend-dot swatch-dep"></span>Quietly depleted</span>
        <span className="legend-item"><span className="legend-dot swatch-mid"></span>Finding its footing</span>
        <span className="legend-item"><span className="legend-dot swatch-res"></span>Steadily resourced</span>
      </div>

      <div className="const-wrap">
        <svg id="constellationSvg" viewBox="0 0 400 400" style={{ width: '100%', height: 'auto' }}>
          {nodes.map(d => (
            <line 
              key={`spoke-${d.code}`}
              className={`spoke ${d.code === ROOT ? 'spoke-root' : ''}`} 
              x1={cx} y1={cy} 
              x2={d._x} y2={d._y} 
            />
          ))}

          {fw && em && (
            <path 
              className="cascade-path" 
              d={`M ${fw._x} ${fw._y} Q ${cx} ${cy} ${em._x} ${em._y}`}
            />
          )}

          <circle className="center-node" cx={cx} cy={cy} r="30" />
          <text className="center-label" x={cx} y={cy}>YOU</text>

          {nodes.map(d => {
            const r = 16 + (d.score / 100) * 14
            const band = getBand(d.score)
            return (
              <g 
                key={`node-${d.code}`}
                className={`node-group ${selectedCode === d.code ? 'is-selected' : ''}`} 
                tabIndex="0" 
                role="button" 
                aria-label={d.name}
                onClick={() => setSelectedCode(d.code)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedCode(d.code)
                  }
                }}
              >
                {d.code === ROOT && <circle className="root-ring" cx={d._x} cy={d._y} r={r + 9} />}
                {d.code === BRIGHT && <circle className="bright-ring" cx={d._x} cy={d._y} r={r + 9} />}
                <circle className={`node ${band.cls}`} cx={d._x} cy={d._y} r={r} />
                <text className="node-label" x={d._x} y={d._y + r + 15}>{d.code}</text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="detail-panel" id="detailPanel">
        {!selectedNode ? (
          <p className="detail-empty">Tap a point above.</p>
        ) : (
          <>
            <p className={`detail-band ${selectedBand.cls}`}>{selectedBand.label}{selectedTag}</p>
            <p className="detail-name">{selectedNode.name}</p>
            <p className="detail-text">{selectedNode.insight}</p>
          </>
        )}
      </div>

      <div className="spacer"></div>
      <button 
        className="btn-primary" 
        style={{ marginTop: '18px' }}
        onClick={() => setScreen('maze')}
      >
        Enter the Maze
      </button>
    </motion.section>
  )
}
