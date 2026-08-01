// InsightReport.jsx — renders the backend's 25-page insight report JSON in
// the approved redesign (Rulebook v4.0 Part C), and prints it to PDF via
// the browser.
//
// The backend is the single source of every word on these pages (the
// deterministic spine, gate-checked). This component only lays blocks
// out; it never invents, reorders, or rewrites content. The visual system
// here is part of the contract, not decoration: one Nunito typeface, the
// Part C palette, the thin line icon family, rounded hairline cards, and
// data graphics that carry no numbers.

import React, { useEffect } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import Icon from './icons.jsx'
import './report.css'

/* ------------------------------------------------------------------ */
/* Band colours: one fixed hue per word (§20.3)                        */
/* ------------------------------------------------------------------ */

const BAND = {
  'Running on empty': { ink: '#d0574f', fill: '#f9e5e3', line: '#f2cdc9', text: '#b04740' },
  'Under pressure': { ink: '#e0a03a', fill: '#fbf0dc', line: '#f0ddc0', text: '#a8761f' },
  'Steady': { ink: '#01ad9c', fill: '#eaf7f5', line: '#d6edea', text: '#017a6f' },
  'Strong': { ink: '#5fba46', fill: '#eef7ea', line: '#dcefd3', text: '#3d7f2c' },
  'Not read': { ink: '#a4a5a5', fill: '#f6f6f6', line: '#ededed', text: '#757676' },
}
const band = (word) => BAND[word] || BAND['Not read']
const STEP = { 'Running on empty': 1, 'Under pressure': 2, 'Steady': 3, 'Strong': 4 }
const LEVEL_Y = { Low: 98, Med: 62, Medium: 62, High: 26 }
const LEVEL_TONE = { Low: '#d6edea', Med: '#6dc6ba', Medium: '#6dc6ba', High: '#01ad9c' }

function BandChip({ word }) {
  const c = band(word)
  return (
    <span className="ir-chip" style={{ background: c.fill, color: c.text, borderColor: c.line }}>
      {word}
    </span>
  )
}

function StepMeter({ word }) {
  const steps = STEP[word] || 0
  const c = band(word)
  return (
    <span className="ir-meter">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className="ir-meter-step"
          style={i <= steps ? { background: c.ink } : undefined} />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Data graphics (§23). Hand-built inline SVG, no numbers inside.      */
/* ------------------------------------------------------------------ */

// The nine-petal picture. Each petal reaches further out the steadier
// that area, in four discrete steps only.
function Petals({ block }) {
  const cover = block.variant === 'cover'
  const size = cover ? 900 : 660
  const cx = size / 2
  const cy = cover ? 272 : 235
  const hub = cover ? 52 : 40
  const rMin = cover ? 118 : 84
  const rMax = cover ? 205 : 146
  const width = cover ? 26 : 18
  const items = block.items

  const petals = items.map((item, i) => {
    const a = (-90 + i * (360 / items.length)) * (Math.PI / 180)
    const dir = [Math.cos(a), Math.sin(a)]
    const perp = [-Math.sin(a), Math.cos(a)]
    const step = item.step || 1
    const r = rMin + ((rMax - rMin) * (step - 1)) / 3
    const bx = cx + hub * dir[0]
    const by = cy + hub * dir[1]
    const tx = cx + r * dir[0]
    const ty = cy + r * dir[1]
    const m = (hub + r) / 2
    const c1 = [cx + m * dir[0] + width * perp[0], cy + m * dir[1] + width * perp[1]]
    const c2 = [cx + m * dir[0] - width * perp[0], cy + m * dir[1] - width * perp[1]]
    const lx = cx + (r + (cover ? 22 : 18)) * dir[0]
    const ly = cy + (r + (cover ? 22 : 18)) * dir[1]
    return {
      key: item.name,
      d: `M${bx.toFixed(1)} ${by.toFixed(1)} Q${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)} Q${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}Z`,
      spoke: [bx, by, tx, ty],
      tip: [tx, ty],
      label: [lx, ly],
      anchor: Math.abs(dir[0]) < 0.25 ? 'middle' : dir[0] > 0 ? 'start' : 'end',
      colour: band(item.band).ink,
      name: item.name,
      word: item.band || 'Not read',
    }
  })

  const nameFill = cover ? '#ffffff' : '#013e39'
  const box = cover ? '0 0 900 560' : '0 0 660 470'

  return (
    <div className={`ir-petals${cover ? ' cover' : ''}`}>
      <svg viewBox={box} role="img"
        aria-label="A nine-petal diagram of your wellbeing areas. Each petal reaches further the steadier that area is.">
        <g fill="none" stroke={cover ? '#a7dcd4' : '#d6edea'} strokeOpacity={cover ? '.16' : '.9'}
          strokeDasharray="1 5" strokeLinecap="round">
          {[0, 1, 2, 3].map((s) => (
            <circle key={s} cx={cx} cy={cy} r={rMin + ((rMax - rMin) * s) / 3} />
          ))}
        </g>
        {petals.map((p) => (
          <g key={p.key}>
            <path d={p.d} fill={p.colour} fillOpacity=".2" stroke={p.colour}
              strokeOpacity=".85" strokeWidth="1.4" />
            <path d={`M${p.spoke[0].toFixed(1)} ${p.spoke[1].toFixed(1)} L${p.spoke[2].toFixed(1)} ${p.spoke[3].toFixed(1)}`}
              stroke={p.colour} strokeOpacity=".4" strokeWidth="1" />
            <circle cx={p.tip[0]} cy={p.tip[1]} r="3.4" fill={p.colour} />
          </g>
        ))}
        <circle cx={cx} cy={cy} r={hub} fill={cover ? '#013e39' : '#ffffff'}
          stroke={cover ? '#a7dcd4' : '#d6edea'} strokeOpacity={cover ? '.45' : '1'} strokeWidth="1.2" />
        <text x={cx} y={cy + 2} textAnchor="middle" className="ir-petal-hub"
          fill={cover ? '#ffffff' : '#013e39'}>{block.overall}</text>
        <text x={cx} y={cy + 17} textAnchor="middle" className="ir-petal-hub-sub"
          fill={cover ? '#6dc6ba' : '#019386'}>{block.shape}</text>
        {petals.map((p) => (
          <text key={p.key} x={p.label[0]} y={p.label[1]} textAnchor={p.anchor}
            className="ir-petal-label" fill={nameFill}>
            {p.name}
            <tspan x={p.label[0]} dy="16" className="ir-petal-word" fill={p.colour}>{p.word}</tspan>
          </text>
        ))}
      </svg>
      {block.legend && (
        <div className="ir-petal-legend">
          <span className="ir-petal-legend-label">{block.legend_label}</span>
          <div className="ir-petal-legend-row">
            {block.legend.map((l) => (
              <span key={l.band} className="ir-petal-legend-item">
                <i style={{ background: band(l.band).ink }} />
                {l.count} {l.band.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BandLadder({ block }) {
  return (
    <div className="ir-ladder">
      <div className="ir-ladder-bars">
        {block.items.map((item) => {
          const c = band(item.band)
          return (
            <div className="ir-ladder-bar" key={item.band}>
              <span className="ir-ladder-word" style={{ color: c.text }}>{item.band}</span>
              <span className="ir-ladder-fill"
                style={{ background: c.ink, height: `${34 + (item.step - 1) * 50}px` }} />
            </div>
          )
        })}
      </div>
      <div className="ir-ladder-foot"><span>{block.left}</span><span>{block.right}</span></div>
    </div>
  )
}

function BandCards({ block }) {
  return (
    <div className="ir-bandcards">
      {block.items.map((item) => {
        const c = band(item.band)
        const icon = { 'Running on empty': 'moon', 'Under pressure': 'alert', 'Steady': 'waves', 'Strong': 'sparkles' }[item.band]
        return (
          <div className="ir-bandcard" key={item.band}
            style={{ background: c.fill, borderColor: c.line }}>
            <Icon name={icon} size={17} style={{ color: c.ink }} />
            <p className="ir-bandcard-word" style={{ color: c.text }}>{item.band}</p>
            <p className="ir-bandcard-gloss">{item.gloss}</p>
          </div>
        )
      })}
    </div>
  )
}

function Bands({ block }) {
  return (
    <div className="ir-bands">
      {block.title && <p className="ir-label">{block.title}</p>}
      {block.items.map((item) => (
        <div className="ir-band-row" key={item.name}>
          <span className="ir-band-name">{item.name}</span>
          <StepMeter word={item.band} />
          <span className="ir-band-word" style={{ color: band(item.band).text }}>{item.band}</span>
        </div>
      ))}
    </div>
  )
}

// Where you are: the ground, the centre, the area asking for care, what
// sits downstream, and the first step.
function MapDiagram({ block }) {
  const care = block.care
  const c = care ? band(care.band) : band('Not read')
  return (
    <div className="ir-map">
      <div className="ir-map-grid">
        <div className="ir-map-node ground">
          <p className="ir-label">{block.ground.label}</p>
          {block.ground.names.map((n) => <p className="ir-map-name" key={n}>{n}</p>)}
          <p className="ir-map-note">{block.ground.note}</p>
        </div>
        <div className="ir-map-arrow"><span>{block.here.up}</span><Icon name="arrow" size={16} /></div>
        <div className="ir-map-hub">
          <p className="ir-label">{block.here.label}</p>
          <p className="ir-map-hub-band">{block.here.title}</p>
          <p className="ir-map-hub-shape">{block.here.shape}</p>
        </div>
        <div className="ir-map-arrow"><span>{block.here.down}</span><Icon name="arrow" size={16} /></div>
        <div className="ir-map-node care" style={{ background: c.fill, borderColor: c.line }}>
          <p className="ir-label" style={{ color: c.text }}>{care ? care.label : 'ASKING FOR CARE'}</p>
          {care && <p className="ir-map-name">{care.name}</p>}
          {care && <BandChip word={care.band} />}
          {care && care.star && <p className="ir-map-star">Also what you said matters most</p>}
        </div>
      </div>
      {block.downstream.length > 0 && (
        <div className="ir-map-downstream">
          {block.downstream.map((d) => (
            <span className="ir-map-down" key={d.name}>
              <b>{d.name}</b> {d.note}
            </span>
          ))}
        </div>
      )}
      <div className="ir-map-step">
        <Icon name="target" size={16} />
        <span className="ir-label">{block.first_step.label}</span>
        <b>{block.first_step.title}</b>
        <span className="ir-map-note">{block.first_step.note}</span>
      </div>
      <p className="ir-map-read">{block.read}</p>
    </div>
  )
}

// The connections diagram: only the licensed links are drawn, solid for
// the clearest and dashed for the looser one. Company, never cause.
function Connections({ block }) {
  return (
    <div className="ir-connections">
      <div className="ir-conn-cols">
        <div className="ir-conn-col">
          <p className="ir-label">{block.strain_label}</p>
          {block.strain.map((node, i) => {
            const c = band(node.band)
            const link = block.links[i - 1]
            return (
              <div className="ir-conn-item" key={node.name}>
                {i > 0 && (
                  <span className={`ir-conn-link ${link ? link.style : 'none'}`}
                    style={{ borderColor: c.ink }} />
                )}
                <div className="ir-conn-node" style={{ background: c.fill, borderColor: c.line }}>
                  {node.role === 'start' && (
                    <span className="ir-conn-start">{block.start_label}</span>
                  )}
                  <span className="ir-conn-name">{node.name}</span>
                  <BandChip word={node.band} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="ir-conn-col ground">
          <p className="ir-label">{block.ground_label}</p>
          {block.ground.map((node) => {
            const c = band(node.band)
            return (
              <div className="ir-conn-node ground" key={node.name}
                style={{ borderColor: c.line }}>
                <span className="ir-conn-name">{node.name}</span>
                <BandChip word={node.band} />
              </div>
            )
          })}
          {block.ground_note && <p className="ir-conn-note">{block.ground_note}</p>}
        </div>
      </div>
      <p className="ir-conn-caption">{block.caption}</p>
      <div className="ir-conn-legend">
        {block.legend.map((l) => (
          <span key={l.style}><i className={l.style} />{l.text}</span>
        ))}
      </div>
    </div>
  )
}

function Reach({ block }) {
  return (
    <div className="ir-reach">
      {block.title && <p className="ir-label">{block.title}</p>}
      {block.items.map((item) => (
        <div className="ir-reach-row" key={item.name}>
          <span className="ir-reach-name">{item.name}</span>
          <span className="ir-reach-track">
            <span className="ir-reach-fill" style={{ width: `${Math.min(item.level, 3) * 33}%` }} />
          </span>
          <span className="ir-reach-label">{item.label}</span>
        </div>
      ))}
      {block.note && <p className="ir-viz-note">{block.note}</p>}
    </div>
  )
}

function DayRhythm({ block }) {
  const slots = block.slots || []
  if (!slots.length) return null
  const w = 640, padX = 62
  const stepX = slots.length > 1 ? (w - padX * 2) / (slots.length - 1) : 0
  return (
    <div className="ir-rhythm">
      {block.title && <p className="ir-label">{block.title}</p>}
      <svg viewBox="0 0 640 150" role="img" aria-label="Your energy across the day, as you described it">
        {[26, 62, 98].map((y) => (
          <line key={y} x1={padX - 10} y1={y} x2={w - padX + 10} y2={y}
            stroke="#ededed" strokeWidth="1" />
        ))}
        {['High', 'Med', 'Low'].map((label, i) => (
          <text key={label} x={padX - 18} y={[26, 62, 98][i] + 3} textAnchor="end"
            className="ir-axis">{label}</text>
        ))}
        {block.series.map((series) => {
          const coords = series.points.map((level, i) => ({
            x: padX + i * stepX, y: LEVEL_Y[level] ?? 62,
          }))
          const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
          return (
            <g key={series.label}>
              <path d={d} fill="none" stroke="#01ad9c" strokeWidth="2.4" strokeLinejoin="round" />
              {coords.map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r="4.4" fill="#01ad9c" stroke="#fff" strokeWidth="2" />
              ))}
            </g>
          )
        })}
        {slots.map((slot, i) => (
          <text key={slot} x={padX + i * stepX} y={128} textAnchor="middle"
            className="ir-axis-slot">{slot}</text>
        ))}
      </svg>
      <div className="ir-rhythm-key">
        {block.series.map((s) => <span key={s.label}><i />{s.label}</span>)}
      </div>
      {block.note && <p className="ir-viz-note">{block.note}</p>}
    </div>
  )
}

function Timeline({ block }) {
  return (
    <div className="ir-timeline">
      {block.title && <p className="ir-label">{block.title}</p>}
      <div className="ir-timeline-bar">
        {block.segments.map((s) => (
          <span className="ir-timeline-seg" key={s.label}
            style={{ background: LEVEL_TONE[s.level] || '#d6edea' }}>
            <b>{s.label}</b>
          </span>
        ))}
      </div>
      {block.note && <p className="ir-viz-note">{block.note}</p>}
    </div>
  )
}

function LoadBar({ block }) {
  const tones = ['#5fba46', '#e0a03a', '#d0574f']
  return (
    <div className="ir-load">
      {block.title && <p className="ir-label">{block.title}</p>}
      <div className="ir-load-track">
        {[1, 2, 3].map((i) => (
          <span key={i} className="ir-load-seg"
            style={i <= block.level ? { background: tones[block.level - 1] } : undefined} />
        ))}
      </div>
      <div className="ir-load-steps">
        {block.steps.map((s, i) => (
          <span key={s} className={block.level === i + 1 ? 'active' : ''}>{s}</span>
        ))}
      </div>
      {block.note && <p className="ir-viz-note">{block.note}</p>}
    </div>
  )
}

const ZONE_POINTS = {
  head: [[60, 26]], neck: [[60, 60]], chest: [[60, 96]],
  back: [[60, 128]], gut: [[60, 158]], limbs: [[24, 196], [96, 196]],
}

function BodyMap({ block }) {
  const marks = []
  ;(block.zones || []).forEach((zone) => {
    (ZONE_POINTS[zone] || []).forEach((p) => marks.push({ zone, p }))
  })
  return (
    <div className="ir-bodymap">
      {block.title && <p className="ir-label">{block.title}</p>}
      <div className="ir-bodymap-inner">
        <svg viewBox="0 0 120 250" role="img" aria-label="Where you noticed tension">
          <g fill="none" stroke="#d6edea" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="60" cy="26" r="17" />
            <path d="M60 43v6" />
            <path d="M42 55h36a6 6 0 0 1 6 6v58a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V61a6 6 0 0 1 6-6z" />
            <path d="M42 60 24 96v44M78 60l18 36v44" />
            <path d="M48 127v66M72 127v66" />
          </g>
          {marks.map((m, i) => (
            <circle key={i} cx={m.p[0]} cy={m.p[1]} r="8.5"
              fill="#d0574f" fillOpacity=".18" stroke="#d0574f" strokeWidth="1.4" />
          ))}
        </svg>
        <div className="ir-bodymap-words">
          {(block.words || []).map((w) => <span key={w}>{w}</span>)}
        </div>
      </div>
      {block.note && <p className="ir-viz-note">{block.note}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Content blocks                                                      */
/* ------------------------------------------------------------------ */

function Paragraph({ block }) {
  return (
    <p className="ir-para">
      {block.lead && <span className="ir-para-lead">{block.lead}</span>}
      {block.text}
    </p>
  )
}

function PullQuote({ block }) {
  if (block.variant === 'opening') {
    return (
      <div className="ir-quote opening">
        <Icon name={block.icon || 'quote'} size={22} />
        <p>{block.text}</p>
      </div>
    )
  }
  return <p className="ir-quote crux">{block.text}</p>
}

function Callout({ block }) {
  const variant = block.variant || 'info'
  return (
    <div className={`ir-callout ${variant}`}>
      {block.icon && <Icon name={block.icon} size={18} className="ir-callout-icon" />}
      <div>
        {block.label && <p className="ir-label">{block.label}</p>}
        {block.title && <p className="ir-card-title">{block.title}</p>}
        <p className="ir-callout-body">{block.body}</p>
      </div>
    </div>
  )
}

function Cards({ block }) {
  return (
    <div className={`ir-cards cols-${block.columns || 2}${block.numbered ? ' numbered' : ''}`}>
      {block.items.map((item, i) => (
        <div className={`ir-card${item.tone ? ' ' + item.tone : ''}`} key={i}>
          {(item.n || item.icon) && (
            <div className="ir-card-head">
              {item.n && <span className="ir-card-n">{item.n}</span>}
              {item.icon && <Icon name={item.icon} size={15} />}
            </div>
          )}
          {item.label && <p className="ir-label">{item.label}</p>}
          {item.title && <p className="ir-card-title">{item.title}</p>}
          <p className="ir-card-body">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

function Columns({ block }) {
  return (
    <div className="ir-columns">
      {block.items.map((col) => (
        <div className={`ir-column ${col.tone || ''}`} key={col.label}>
          <div className="ir-column-head">
            {col.icon && <Icon name={col.icon} size={16} />}
            <span className="ir-label">{col.label}</span>
          </div>
          {col.paras.map((p, i) => <p className="ir-column-para" key={i}>{p}</p>)}
        </div>
      ))}
    </div>
  )
}

function Checklist({ block }) {
  return (
    <div className="ir-checklist">
      {block.label && <p className="ir-label">{block.label}</p>}
      {block.items.map((item, i) => (
        <div className="ir-checklist-row" key={i}>
          <Icon name={item.tone === 'no' ? 'alert' : 'check'} size={15}
            style={{ color: item.tone === 'no' ? '#d0574f' : '#4ea038' }} />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

function ListBlock({ block }) {
  return (
    <div className={`ir-list${block.variant ? ' ' + block.variant : ''}`}>
      {block.label && <p className="ir-label">{block.label}</p>}
      {block.items.map((item, i) => (
        <div className="ir-list-row" key={i}>
          <Icon name={item.icon || 'check'} size={15} />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

function Table({ block }) {
  return (
    <div className="ir-table-wrap">
      {block.title && <p className="ir-label">{block.title}</p>}
      <table className="ir-table">
        <thead>
          <tr>{block.columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                if (cell && typeof cell === 'object') {
                  if (cell.band) {
                    return <td key={j}><BandChip word={cell.band} /></td>
                  }
                  return (
                    <td key={j}>
                      <span className="ir-table-area">
                        {cell.icon && <Icon name={cell.icon} size={14} />}
                        {cell.text}
                      </span>
                    </td>
                  )
                }
                return <td key={j}>{cell}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Certainty({ block }) {
  const cards = [block.plain, block.offered, block.unread].filter(Boolean)
  return (
    <div className="ir-certainty">
      <p className="ir-label">How confident this report is, area by area</p>
      <div className="ir-certainty-cards">
        {cards.map((c) => (
          <div className="ir-certainty-card" key={c.label}>
            <p className="ir-label">{c.label}</p>
            <p className="ir-certainty-count">{c.count} of {block.total} areas</p>
            <p className="ir-card-body">{c.body}</p>
          </div>
        ))}
      </div>
      <p className="ir-certainty-note">{block.note}</p>
    </div>
  )
}

function Flow({ block }) {
  return (
    <div className="ir-flow">
      <div className={`ir-flow-steps n${block.steps.length}`}>
        {block.steps.map((s, i) => (
          <React.Fragment key={s.tag}>
            {i > 0 && <Icon name="arrow" size={17} className="ir-flow-arrow" />}
            <div className="ir-flow-step">
              <div className="ir-card-head"><Icon name={s.icon || 'target'} size={15} /></div>
              <p className="ir-label">{s.tag}</p>
              <p className="ir-flow-area">{s.area}</p>
              <p className="ir-flow-text">{s.text}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="ir-flow-first">
        <span className="ir-label">{block.first_move_label}</span>
        <p>{block.first_move}</p>
      </div>
    </div>
  )
}

function AreaBlock({ block }) {
  const c = band(block.band)
  return (
    <div className="ir-area">
      <div className="ir-area-head">
        <span className="ir-area-tile" style={{ background: c.fill, color: c.ink, borderColor: c.line }}>
          <Icon name={block.icon || 'compass'} size={16} />
        </span>
        <span className="ir-area-name">{block.name}</span>
        <BandChip word={block.band} />
        <span className="ir-area-stance">{block.stance}</span>
      </div>
      {block.paras.map((p) => (
        <p className="ir-area-para" key={p.label}>
          <b>{p.label}</b> {p.text}
        </p>
      ))}
    </div>
  )
}

function Practice({ block }) {
  return (
    <div className="ir-practice">
      <div className="ir-practice-head">
        <p className="ir-practice-title">{block.title}</p>
        <span className="ir-practice-tag">{block.tag}</span>
      </div>
      <div className="ir-practice-cols">
        {block.cols.map((c) => (
          <div className="ir-practice-col" key={c.label}>
            <div className="ir-card-head"><Icon name={c.icon || 'clock'} size={15} /></div>
            <p className="ir-label">{c.label}</p>
            <p className="ir-practice-col-text">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Steps({ block }) {
  return (
    <div className="ir-steps">
      {block.title && <p className="ir-label">{block.title}</p>}
      <div className="ir-steps-row">
        {block.items.map((item, i) => (
          <React.Fragment key={item.title}>
            {i > 0 && <Icon name="arrow" size={15} className="ir-steps-arrow" />}
            <div className="ir-step">
              <span className="ir-step-n">{i + 1}</span>
              <p className="ir-step-title">{item.title}</p>
              <p className="ir-step-note">{item.note}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function SevenDays({ block }) {
  return (
    <div className="ir-sevendays">
      {block.title && <p className="ir-label">{block.title}</p>}
      {block.rows.map((r) => (
        <div className="ir-day" key={r.day}>
          <span className="ir-day-n">{r.day}</span>
          <span className="ir-day-focus">{r.focus}</span>
          <span className="ir-day-action">{r.action}</span>
        </div>
      ))}
    </div>
  )
}

function Supports({ block }) {
  return (
    <div className="ir-supports">
      {block.items.map((s) => (
        <div className="ir-support" key={s.title}>
          <p className="ir-support-tag">{s.tag}</p>
          <p className="ir-support-title">{s.title}</p>
          <p className="ir-support-body">{s.body}</p>
          <p className="ir-support-why">{s.why}</p>
        </div>
      ))}
    </div>
  )
}

function ProgramCase({ block }) {
  return (
    <div className="ir-case">
      <p className="ir-label">{block.label}</p>
      <div className="ir-case-items">
        {block.items.map((item) => (
          <div className="ir-case-item" key={item.title}>
            <Icon name={item.icon || 'check'} size={16} />
            <p><b>{item.title}.</b> {item.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Program({ block }) {
  return (
    <div className="ir-program">
      <p className="ir-program-tag">{block.tag}</p>
      <div className="ir-program-card">
        <img className="ir-program-image" src={`/report/imagery/${block.image}.png`} alt="" />
        <div className="ir-program-body">
          <p className="ir-program-title">{block.title}</p>
          <p className="ir-program-what">{block.what}</p>
          <div className="ir-program-chips">
            {block.chips.map((chip) => <span className="ir-placeholder" key={chip}>{chip}</span>)}
          </div>
          <p className="ir-program-section"><b>Why this is the one for you.</b> {block.why}</p>
          <p className="ir-program-section"><b>What you walk away with.</b> {block.walkaway}</p>
        </div>
      </div>
    </div>
  )
}

function Cta({ block }) {
  return (
    <div className="ir-cta">
      <p className="ir-label">{block.label}</p>
      <p>{block.body}</p>
    </div>
  )
}

function Contents({ block }) {
  return (
    <div className="ir-contents">
      {block.parts.map((part) => (
        <div className="ir-contents-part" key={part.name}>
          <div className="ir-contents-head">
            <Icon name={part.icon} size={16} />
            <span>{part.name}</span>
          </div>
          {part.items.map((item) => (
            <div className="ir-contents-row" key={item.page}>
              <span>{item.title}</span>
              <span className="ir-contents-page">{String(item.page).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function Profile({ block }) {
  const initials = (block.name || '')
    .split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="ir-profile">
      <p className="ir-label">{block.label}</p>
      <div className="ir-profile-row">
        <span className="ir-profile-avatar">{initials || 'YOU'}</span>
        <span className="ir-profile-info">
          <span className="ir-profile-name">{block.name}</span>
          {block.meta && <span className="ir-profile-meta">{block.meta}</span>}
        </span>
      </div>
      <p className="ir-profile-status">
        <Icon name="check" size={14} />
        <span>{block.status}</span>
      </p>
    </div>
  )
}

function Colophon({ block }) {
  return (
    <div className="ir-colophon">
      <p className="ir-colophon-title">{block.title}</p>
      <p className="ir-colophon-prepared">{block.prepared}</p>
      <p className="ir-colophon-line">{block.line}</p>
      <img src="/report/logo-lifed.png" alt="Lifed" className="ir-colophon-logo" />
    </div>
  )
}

function Row({ block }) {
  // The first child decides the column proportions, so the petal wheel
  // gets the room it needs beside the band list.
  const first = block.blocks[0] ? block.blocks[0].type : 'none'
  return (
    <div className={`ir-row first-${first}`}>
      {block.blocks.map((b, i) => <Block block={b} key={i} />)}
    </div>
  )
}

const BLOCKS = {
  paragraph: Paragraph,
  pullquote: PullQuote,
  callout: Callout,
  cards: Cards,
  columns: Columns,
  checklist: Checklist,
  list: ListBlock,
  table: Table,
  certainty: Certainty,
  petals: Petals,
  bandladder: BandLadder,
  bandcards: BandCards,
  bands: Bands,
  map: MapDiagram,
  connections: Connections,
  reach: Reach,
  dayrhythm: DayRhythm,
  timeline: Timeline,
  loadbar: LoadBar,
  bodymap: BodyMap,
  flow: Flow,
  area: AreaBlock,
  practice: Practice,
  steps: Steps,
  sevendays: SevenDays,
  supports: Supports,
  programcase: ProgramCase,
  program: Program,
  cta: Cta,
  contents: Contents,
  profile: Profile,
  colophon: Colophon,
  row: Row,
}

function Block({ block }) {
  const Renderer = BLOCKS[block.type]
  return Renderer ? <Renderer block={block} /> : null
}

/* ------------------------------------------------------------------ */
/* Page furniture (§21)                                                */
/* ------------------------------------------------------------------ */

function CoverPage({ page }) {
  const prepared = page.blocks.find((b) => b.type === 'prepared')
  const petals = page.blocks.find((b) => b.type === 'petals')
  const cards = page.blocks.find((b) => b.type === 'cards')
  const footer = page.blocks.find((b) => b.type === 'callout')
  return (
    <section className="ir-page ir-cover">
      <div className="ir-cover-top">
        <img src="/report/logo-lifed.png" alt="Lifed" className="ir-cover-logo" style={{ height: '36px', maxHeight: '36px', width: 'auto', maxWidth: '180px', objectFit: 'contain' }} />
        <span className="ir-cover-pill">Full reflection</span>
      </div>
      <div className="ir-cover-head">
        <div>
          <span className="ir-cover-kicker">{page.eyebrow}</span>
          <h1 className="ir-cover-title">{page.title}</h1>
          <span className="ir-cover-rule" />
          <p className="ir-cover-deck">{page.deck}</p>
        </div>
        {prepared && (
          <div className="ir-cover-prepared">
            <p className="ir-label">Prepared for</p>
            <p className="ir-cover-name">{prepared.name || 'You'}</p>
            <p className="ir-cover-meta">
              {[prepared.date, prepared.location].filter(Boolean).join('  ·  ')}
            </p>
            <p className="ir-cover-note">{prepared.note}</p>
          </div>
        )}
      </div>
      {petals && <Petals block={petals} />}
      {cards && <Cards block={cards} />}
      {footer && (
        <div className="ir-cover-foot">
          <Icon name="shield" size={14} />
          <p>{footer.body}</p>
        </div>
      )}
    </section>
  )
}

function ReportPage({ page, meta }) {
  if (page.number === 1) return <CoverPage page={page} />
  const isAppendix = page.number >= 24
  const headRight = isAppendix
    ? meta.appendix_header
    : [meta.name, meta.date].filter(Boolean).join(' · ')
  return (
    <section className="ir-page">
      <div className="ir-page-head">
        <span className="ir-page-brand">LIFED <span>/ Your LEWIS reflection</span></span>
        <span className="ir-page-headright">{headRight}</span>
      </div>
      <div className="ir-page-body">
        <p className="ir-eyebrow">{page.eyebrow}</p>
        <h2 className="ir-title">{page.title}</h2>
        {page.deck && <p className="ir-deck">{page.deck}</p>}
        {page.blocks.map((block, i) => <Block block={block} key={i} />)}
      </div>
      <div className="ir-page-foot">
        <span>{meta.footer}</span>
        <span className="ir-page-number">{String(page.number).padStart(2, '0')}</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export default function InsightReport({ report }) {
  const { isAuthenticated, authPendingDownload, setScreen } = useLewisStore()

  const handleDownload = () => {
    document.body.classList.add('ir-printing')
    const cleanup = () => {
      document.body.classList.remove('ir-printing')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)
    window.print()
  }

  useEffect(() => {
    if (authPendingDownload) {
      useLewisStore.setState({ authPendingDownload: false })
      // Slight delay to allow the full report to render before printing
      setTimeout(() => {
        handleDownload()
      }, 500)
    }
  }, [authPendingDownload])

  if (!report || !report.pages) return null

  const pagesToRender = report.pages

  return (
    <div className="ir-root">
      <div className="ir-toolbar">
        <span className="ir-toolbar-note">
          Your full insight report, ready below. Use the button to save it as a PDF.
        </span>
        <button className="ir-download-btn" onClick={handleDownload}>
          <Icon name="download" size={15} />
          Download as PDF
        </button>
      </div>
      {pagesToRender.map((page) => (
        <div key={page.number} style={{ position: 'relative' }}>
          <ReportPage page={page} meta={report.meta} />
        </div>
      ))}
    </div>
  )
}
