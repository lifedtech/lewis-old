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
    <span className="ir-chip" style={{ background: c.fill, color: c.text, borderColor: c.line, fontWeight: 700 }}>
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
  const hub = cover ? 66 : 50
  const rMin = cover ? 124 : 88
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
        <text x={cx} y={cy - 2} textAnchor="middle" className="ir-petal-hub"
          style={{ fontSize: cover ? '13px' : '11px', fontWeight: 700, letterSpacing: '-0.01em' }}
          fill={cover ? '#ffffff' : '#013e39'}>{block.overall}</text>
        <text x={cx} y={cy + 15} textAnchor="middle" className="ir-petal-hub-sub"
          style={{ fontSize: cover ? '11px' : '9.5px', fontWeight: 600, letterSpacing: '0.02em' }}
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
        <div className={`ir-petal-legend${cover ? ' cover' : ''}`}>
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
  const items = block.items || [
    { band: 'Running on empty', step: 1 },
    { band: 'Under pressure', step: 2 },
    { band: 'Steady', step: 3 },
    { band: 'Strong', step: 4 },
  ]
  const heights = { 'Running on empty': '44px', 'Under pressure': '92px', 'Steady': '142px', 'Strong': '192px' }
  const textColors = { 'Running on empty': '#d0574f', 'Under pressure': '#b8801f', 'Steady': '#017a6f', 'Strong': '#3d7f2c' }

  return (
    <div style={{ border: '1px solid #ededed', borderRadius: '18px', padding: '24px 26px 20px', marginBottom: '16px', background: '#faf8f4' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'end', height: '214px', marginBottom: '16px' }}>
        {items.map((item) => {
          const c = band(item.band)
          const h = heights[item.band] || `${44 + (item.step - 1) * 48}px`
          const textColor = textColors[item.band] || c.text

          return (
            <div key={item.band} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ font: '800 10px/1 Nunito, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: textColor, marginBottom: '8px' }}>
                {item.band}
              </div>
              <div style={{ height: h, borderRadius: '10px', background: c.ink }} />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e6ddcd', paddingTop: '10px', font: '600 10px/1 Nunito, sans-serif', letterSpacing: '.06em', color: '#a4a5a5' }}>
        <span>{block.left || 'Needs the gentlest care'}</span>
        <span>{block.right || 'A place to stand'}</span>
      </div>
    </div>
  )
}

function BandCards({ block }) {
  const items = block?.items || []

  return (
    <div className="ir-bandcards" style={{ width: '100%', marginBottom: '24px', boxSizing: 'border-box' }}>
      {block?.legend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          border: '1.5px solid #ededed',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '18px',
          background: '#faf8f4',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <span style={{ font: '700 10px/1 Nunito, sans-serif', letterSpacing: '.16em', textTransform: 'uppercase', color: '#019386' }}>
            {block.legend_label || 'Your shape'}
          </span>
          {block.legend.map((l) => {
            const c = band(l.band)
            return (
              <span key={l.band} style={{ display: 'flex', alignItems: 'center', gap: '8px', font: '600 12px/1 Nunito, sans-serif', color: c.text }}>
                <i style={{ width: '10px', height: '10px', borderRadius: '4px', background: c.ink, display: 'inline-block' }} />
                {l.count} {l.band.toLowerCase()}
              </span>
            )
          })}
        </div>
      )}

      {/* 4 Vertically Stacked Band Cards Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '580px' }}>
        {items.map((item) => {
          const c = band(item.band)
          const step = item.step || (item.band === 'Strong' ? 4 : item.band === 'Steady' ? 3 : item.band === 'Under pressure' ? 2 : 1)
          const iconName = item.icon || {
            'Meaning & direction': 'compass',
            'Relationships & support': 'users',
            'Environment & belonging': 'home',
            'Curiosity & growth': 'sprout',
            'Agency & work': 'speed',
            'Financial steadiness': 'wallet',
            'Emotional calm': 'waves',
            'Body & recovery': 'moon',
            'Usable energy': 'zap',
            'Running on empty': 'moon',
            'Under pressure': 'alert',
            'Steady': 'waves',
            'Strong': 'sprout'
          }[item.name || item.band] || 'sparkles'

          const glossText = item.gloss || {
            'Running on empty': 'This area needs the gentlest care right now. Reserve is thin, and effort here costs more than it should.',
            'Under pressure': 'Stretched, and asking for attention. Still functioning, but with less give than it used to have.',
            'Steady': 'Holding reliably, without strain. Not remarkable, and not asking anything of you this month.',
            'Strong': 'A real strength, and a place to stand. Something to spend deliberately, not simply admire.'
          }[item.band] || ''

          return (
            <div key={item.name || item.band} style={{
              border: `1.5px solid ${c.line}`,
              background: c.fill,
              borderRadius: '18px',
              padding: '18px 22px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Icon name={iconName} size={18} style={{ color: c.text, flexShrink: 0 }} />
                <div style={{
                  font: '800 12.5px/1.3 Nunito, sans-serif',
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: c.text
                }}>
                  {item.name || item.band}
                </div>
              </div>
              {item.name && item.name !== item.band && (
                <div style={{ font: '700 11px/1.3 Nunito, sans-serif', color: c.text, marginBottom: '6px' }}>
                  {item.band}
                </div>
              )}
              {glossText && (
                <p style={{ margin: 0, font: '400 13px/1.55 Nunito, sans-serif', color: '#414242', opacity: 0.9 }}>
                  {glossText}
                </p>
              )}
            </div>
          )
        })}
      </div>
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
  const care = block?.care
  const ground = block?.ground
  const here = block?.here
  const firstStep = block?.first_step
  const downstream = block?.downstream || []

  return (
    <div style={{ position: 'relative', height: '472px', background: '#faf8f4', border: '1px solid #e6ddcd', borderRadius: '18px', marginBottom: '16px', overflow: 'hidden' }}>
      <svg aria-hidden="true" viewBox="0 0 686 472" style={{ position: 'absolute', left: 0, top: 0, width: '686px', height: '472px' }}>
        <defs>
          <marker id="mk-leaf" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7z" fill="#4ea038" /></marker>
          <marker id="mk-rose" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7z" fill="#d0574f" /></marker>
          <marker id="mk-teal" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7z" fill="#01ad9c" /></marker>
        </defs>
        <line x1="228" y1="120" x2="272" y2="120" stroke="#4ea038" strokeWidth="1.6" markerEnd="url(#mk-leaf)" />
        <line x1="414" y1="120" x2="458" y2="120" stroke="#d0574f" strokeWidth="1.6" markerEnd="url(#mk-rose)" />
        <path d="M576 164 C 576 244, 540 284, 512 312" fill="none" stroke="#d0574f" strokeWidth="1.3" markerEnd="url(#mk-rose)" />
        <path d="M600 164 C 600 254, 606 292, 610 312" fill="none" stroke="#d0574f" strokeWidth="1.3" markerEnd="url(#mk-rose)" />
        <path d="M330 190 C 300 254, 262 296, 222 318" fill="none" stroke="#01ad9c" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#mk-teal)" />
      </svg>

      {/* Top Banner Context Note */}
      {block?.top_note && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: '14px', textAlign: 'center', font: '600 10px/1 Nunito, sans-serif', color: '#b8801f' }}>
          {block.top_note}
        </div>
      )}

      {/* Ground Node: A place to stand */}
      <div style={{ position: 'absolute', left: '24px', top: '20px', font: '800 8.5px/1 Nunito, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#4ea038' }}>
        {ground?.label || 'A place to stand'}
      </div>
      <div style={{ position: 'absolute', left: '24px', top: '40px', width: '204px', border: '1.6px solid #5fba46', borderRadius: '14px', background: '#ffffff', padding: '14px 15px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
          <Icon name="compass" size={15} style={{ color: '#4ea038' }} />
          <span style={{ font: '800 13px/1.2 Nunito, sans-serif', color: '#013e39' }}>{(ground?.names || []).join(', ') || 'Meaning & direction'}</span>
        </div>
        <div style={{ font: '400 10.5px/1.4 Nunito, sans-serif', color: '#757676', marginBottom: '6px' }}>with relationships and belonging</div>
        <div style={{ font: '600 10px/1.3 Nunito, sans-serif', color: '#4ea038' }}>{ground?.note || 'Your ground, doing real work'}</div>
      </div>

      {/* Center Hub: You are here */}
      <div style={{ position: 'absolute', left: '281px', top: '58px', width: '124px', height: '124px', borderRadius: '50%', border: '1.6px dashed #a7dcd4', background: '#eaf7f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxSizing: 'border-box', padding: '0 12px' }}>
        <span style={{ font: '800 8px/1 Nunito, sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: '#019386', marginBottom: '5px' }}>{here?.label || 'You are here'}</span>
        <span style={{ font: '800 13px/1.2 Nunito, sans-serif', color: '#013e39' }}>{here?.title || 'Steady, but uneven'}</span>
      </div>
      <div style={{ position: 'absolute', left: '232px', top: '126px', font: '600 9.5px/1 Nunito, sans-serif', color: '#a4a5a5' }}>{here?.up || 'holds you up'}</div>
      <div style={{ position: 'absolute', left: '418px', top: '126px', font: '600 9.5px/1 Nunito, sans-serif', color: '#a4a5a5' }}>{here?.down || 'is straining'}</div>

      {/* Care Node: Asking for care */}
      <div style={{ position: 'absolute', right: '24px', top: '20px', font: '800 8.5px/1 Nunito, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#d0574f', textAlign: 'right' }}>
        {care?.label || 'Asking for care'}
      </div>
      <div style={{ position: 'absolute', right: '24px', top: '40px', width: '204px', border: '1.6px solid #d0574f', borderRadius: '14px', background: '#ffffff', padding: '14px 15px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
          <Icon name="moon" size={15} style={{ color: '#d0574f' }} />
          <span style={{ font: '800 13px/1.2 Nunito, sans-serif', color: '#013e39' }}>{care?.name || 'Body & recovery'}</span>
        </div>
        <div style={{ font: '600 10.5px/1.4 Nunito, sans-serif', color: '#b04740', marginBottom: '6px' }}>{care?.band || 'Running on empty'}</div>
        <div style={{ font: '400 10px/1.3 Nunito, sans-serif', color: '#757676' }}>★ Also what you said matters most</div>
      </div>

      {/* Downstream Nodes */}
      {downstream[0] && (
        <div style={{ position: 'absolute', left: '404px', top: '320px', width: '128px', border: '1.2px dashed #e6b3ae', borderRadius: '12px', background: '#ffffff', padding: '10px 12px', boxSizing: 'border-box' }}>
          <div style={{ font: '800 11px/1.2 Nunito, sans-serif', color: '#013e39', marginBottom: '3px' }}>{downstream[0].name}</div>
          <div style={{ font: '400 9.5px/1.35 Nunito, sans-serif', color: '#757676' }}>{downstream[0].note}</div>
        </div>
      )}
      {downstream[1] && (
        <div style={{ position: 'absolute', left: '546px', top: '320px', width: '116px', border: '1.2px dashed #ecd3a4', borderRadius: '12px', background: '#ffffff', padding: '10px 12px', boxSizing: 'border-box' }}>
          <div style={{ font: '800 11px/1.2 Nunito, sans-serif', color: '#013e39', marginBottom: '3px' }}>{downstream[1].name}</div>
          <div style={{ font: '400 9.5px/1.35 Nunito, sans-serif', color: '#757676' }}>{downstream[1].note}</div>
        </div>
      )}

      {/* First Step Node */}
      {firstStep && (
        <div style={{ position: 'absolute', left: '24px', top: '322px', width: '290px', border: '1.6px solid #01ad9c', borderRadius: '14px', background: '#eaf7f5', padding: '13px 15px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
            <Icon name="target" size={15} style={{ color: '#019386' }} />
            <span style={{ font: '800 12px/1.2 Nunito, sans-serif', color: '#015c54' }}>{firstStep.title}</span>
          </div>
          <div style={{ font: '400 10px/1.4 Nunito, sans-serif', color: '#757676' }}>{firstStep.note}</div>
        </div>
      )}

      {/* Bottom Read Line */}
      <div style={{ position: 'absolute', left: '40px', right: '40px', bottom: '18px', textAlign: 'center', font: '400 10px/1.5 Nunito, sans-serif', color: '#a4a5a5' }}>
        {block?.read || 'Read as one sentence. Meaning is holding you up, the body is asking for care, time is in the way, and a small evening transition is the gentlest way in.'}
      </div>
    </div>
  )
}

function Connections({ block }) {
  return (
    <div style={{ position: 'relative', height: '534px', background: '#faf8f4', border: '1px solid #e6ddcd', borderRadius: '18px', marginBottom: '14px', overflow: 'hidden' }}>
      <svg aria-hidden="true" viewBox="0 0 686 534" style={{ position: 'absolute', left: 0, top: 0, width: '686px', height: '534px' }}>
        <defs><marker id="mk-link" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#d0574f" /></marker></defs>
        <line x1="502" y1="44" x2="502" y2="474" stroke="#dcdcdc" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M206 168 C 236 152, 250 136, 268 122" fill="none" stroke="#d0574f" strokeWidth="1.8" markerEnd="url(#mk-link)" />
        <path d="M206 206 C 238 232, 250 246, 268 258" fill="none" stroke="#d0574f" strokeWidth="1.8" markerEnd="url(#mk-link)" />
        <path d="M330 168 C 330 196, 330 214, 330 240" fill="none" stroke="#d0574f" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#mk-link)" />
        <text x="207" y="118" fontFamily="Nunito, sans-serif" fontSize="10" fontWeight="600" fill="#a4a5a5">carries into</text>
        <text x="207" y="272" fontFamily="Nunito, sans-serif" fontSize="10" fontWeight="600" fill="#a4a5a5">is carrying</text>
        <text x="340" y="208" fontFamily="Nunito, sans-serif" fontSize="10" fontWeight="600" fill="#a4a5a5">same loop</text>
      </svg>

      <div style={{ position: 'absolute', left: '24px', top: '18px', font: '800 8.5px/1 Nunito, sans-serif', letterSpacing: '.22em', textTransform: 'uppercase', color: '#c5c5c5' }}>Where the strain sits</div>
      <div style={{ position: 'absolute', left: '518px', top: '18px', font: '800 8.5px/1 Nunito, sans-serif', letterSpacing: '.22em', textTransform: 'uppercase', color: '#c5c5c5' }}>Ground you can rely on</div>

      <div style={{ position: 'absolute', left: '26px', top: '118px', font: '800 8.5px/1 Nunito, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#b04740' }}>Start here</div>
      <div style={{ position: 'absolute', left: '26px', top: '138px', width: '178px', height: '98px', borderRadius: '26px', background: '#d0574f', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 14px', boxSizing: 'border-box' }}>
        <Icon name="moon" size={18} style={{ color: '#ffffff', marginBottom: '6px' }} />
        <span style={{ font: '800 14px/1.15 Nunito, sans-serif' }}>Body &amp; recovery</span>
        <span style={{ font: '600 10.5px/1.3 Nunito, sans-serif', opacity: .88, marginTop: '2px' }}>Running on empty</span>
      </div>

      <div style={{ position: 'absolute', left: '268px', top: '64px', width: '150px', height: '74px', borderRadius: '22px', background: '#e0a03a', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 12px', boxSizing: 'border-box' }}>
        <span style={{ font: '800 12.5px/1.15 Nunito, sans-serif' }}>Emotional calm</span>
        <span style={{ font: '600 10px/1.3 Nunito, sans-serif', opacity: .92, marginTop: '2px' }}>Under pressure</span>
      </div>
      <div style={{ position: 'absolute', left: '268px', top: '246px', width: '150px', height: '74px', borderRadius: '22px', background: '#d97a5f', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 12px', boxSizing: 'border-box' }}>
        <span style={{ font: '800 12.5px/1.15 Nunito, sans-serif' }}>Usable energy</span>
        <span style={{ font: '600 10px/1.3 Nunito, sans-serif', opacity: .92, marginTop: '2px' }}>Running on empty</span>
      </div>

      <div style={{ position: 'absolute', left: '352px', top: '448px', width: '134px', height: '58px', borderRadius: '20px', background: '#01ad9c', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span style={{ font: '800 11.5px/1.15 Nunito, sans-serif' }}>Agency &amp; work</span>
        <span style={{ font: '600 9.5px/1.3 Nunito, sans-serif', opacity: .92 }}>Steady</span>
      </div>
      <div style={{ position: 'absolute', left: '190px', top: '448px', width: '142px', height: '58px', borderRadius: '20px', background: '#01ad9c', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span style={{ font: '800 11.5px/1.15 Nunito, sans-serif' }}>Curiosity &amp; growth</span>
        <span style={{ font: '600 9.5px/1.3 Nunito, sans-serif', opacity: .92 }}>Steady</span>
      </div>
      <div style={{ position: 'absolute', left: '26px', top: '448px', width: '142px', height: '58px', borderRadius: '20px', background: '#01ad9c', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span style={{ font: '800 11.5px/1.15 Nunito, sans-serif' }}>Financial steadiness</span>
        <span style={{ font: '600 9.5px/1.3 Nunito, sans-serif', opacity: .92 }}>Steady</span>
      </div>

      <div style={{ position: 'absolute', left: '522px', top: '52px', width: '142px', height: '76px', borderRadius: '22px', background: '#4ea038', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 12px', boxSizing: 'border-box' }}>
        <span style={{ font: '800 12.5px/1.15 Nunito, sans-serif' }}>Meaning &amp; direction</span>
        <span style={{ font: '600 10px/1.3 Nunito, sans-serif', opacity: .92, marginTop: '2px' }}>Strong</span>
      </div>
      <div style={{ position: 'absolute', left: '522px', top: '144px', width: '142px', height: '76px', borderRadius: '22px', background: '#4ea038', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 12px', boxSizing: 'border-box' }}>
        <span style={{ font: '800 12.5px/1.15 Nunito, sans-serif' }}>Relationships &amp; support</span>
        <span style={{ font: '600 10px/1.3 Nunito, sans-serif', opacity: .92, marginTop: '2px' }}>Strong</span>
      </div>
      <div style={{ position: 'absolute', left: '522px', top: '236px', width: '142px', height: '76px', borderRadius: '22px', background: '#4ea038', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 12px', boxSizing: 'border-box' }}>
        <span style={{ font: '800 12.5px/1.15 Nunito, sans-serif' }}>Environment &amp; belonging</span>
        <span style={{ font: '600 10px/1.3 Nunito, sans-serif', opacity: .92, marginTop: '2px' }}>Strong</span>
      </div>
      <div style={{ position: 'absolute', left: '522px', top: '324px', width: '142px', font: '400 10px/1.45 Nunito, sans-serif', color: '#a4a5a5', textAlign: 'center' }}>
        These three stand apart from the strained loop. That is what makes them useful.
      </div>

      <div style={{ position: 'absolute', left: '24px', bottom: '12px', font: '400 10px/1.4 Nunito, sans-serif', color: '#a4a5a5' }}>
        Only the active links are drawn · the size of each shape follows its reading
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
    <div className="ir-timeline" style={{ marginBottom: '17px' }}>
      {block.title && <p className="ir-label" style={{ font: '700 9px/1 Nunito, sans-serif', letterSpacing: '.16em', textTransform: 'uppercase', color: '#019386', marginBottom: '12px' }}>{block.title}</p>}
      <div style={{ border: '1px solid #ededed', borderRadius: '16px', padding: '16px 19px 16px', background: '#faf8f4' }}>
        <svg aria-hidden="true" viewBox="0 0 642 140" style={{ width: '100%', height: '140px', display: 'block' }}>
          <rect x="0" y="46" width="642" height="34" rx="17" fill="#ededed" />
          <rect x="18" y="46" width="330" height="34" rx="17" fill="#01ad9c" />
          <path d="M348 46h180a17 17 0 0 1 0 34H348z" fill="#a7dcd4" />
          <rect x="528" y="46" width="96" height="34" rx="17" fill="#d6edea" />
          <text x="180" y="68" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="12" fontWeight="700" fill="#ffffff">Work, at full weight</text>
          <text x="438" y="68" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="12" fontWeight="700" fill="#015c54">Work, minimised</text>
          <text x="576" y="68" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="11" fontWeight="700" fill="#017a6f">Light rest</text>
          <line x1="348" y1="32" x2="348" y2="94" stroke="#e0a03a" strokeWidth="1.4" strokeDasharray="4 3" />
          <text x="348" y="24" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="10.5" fontWeight="700" fill="#b8801f">Laptop closes, around six</text>
          <g fontFamily="Nunito, sans-serif" fontSize="10" fill="#a4a5a5">
            <text x="18" y="102">9 am</text>
            <text x="330" y="102">6 pm</text>
            <text x="510" y="102">10 pm</text>
            <text x="600" y="102">Night</text>
          </g>
          <text x="321" y="128" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="10.5" fontStyle="italic" fill="#a4a5a5">
            {block.note || 'The evening is not free time yet. It is work at low volume.'}
          </text>
        </svg>
      </div>
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
  head: [[60, 26]],
  'head & jaw': [[60, 26]],
  'head and jaw': [[60, 26]],
  neck: [[60, 48]],
  'neck & shoulders': [[60, 48]],
  'neck and shoulders': [[60, 48]],
  shoulders: [[60, 56]],
  chest: [[60, 74]],
  'chest & heart': [[60, 74]],
  'chest & heart center': [[60, 74]],
  back: [[60, 84]],
  'upper back': [[60, 84]],
  'upper & lower back': [[60, 88]],
  'lower back': [[60, 98]],
  gut: [[60, 108]],
  stomach: [[60, 108]],
  'stomach & abdomen': [[60, 108]],
  abdomen: [[60, 108]],
  limbs: [[28, 100], [92, 100], [48, 160], [72, 160]],
  arms: [[28, 100], [92, 100]],
  'arms & legs': [[28, 100], [92, 100], [48, 160], [72, 160]],
  legs: [[48, 160], [72, 160]],
  'legs & knees': [[48, 160], [72, 160]],
}

function BodyMap({ block }) {
  const marks = []
  ;(block.zones || []).forEach((zone) => {
    const key = String(zone).toLowerCase().trim()
    const points = ZONE_POINTS[key] || ZONE_POINTS[zone] || []
    points.forEach((p) => marks.push({ zone, p }))
  })

  return (
    <div className="ir-bodymap" style={{
      background: '#ffffff',
      border: '1.5px solid #eef4f2',
      borderRadius: '20px',
      padding: '24px 28px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
      margin: '0 0 20px',
      boxSizing: 'border-box'
    }}>
      {block.title && (
        <p className="ir-label" style={{
          font: '700 11px/1 Nunito, sans-serif',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#00ae9d',
          marginBottom: '16px',
          fontFamily: '"IBM Plex Mono", monospace'
        }}>
          {block.title}
        </p>
      )}
      <div className="ir-bodymap-inner" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '28px',
        flexWrap: 'wrap'
      }}>
        {/* SVG Figure resized cleanly to compact dimensions */}
        <div style={{
          width: '140px',
          height: '240px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <svg viewBox="0 0 120 220" style={{ width: '100%', height: '100%', maxHeight: '230px' }} role="img" aria-label="Where you noticed tension">
            <defs>
              <filter id="spotGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Human Silhouette Contour Lines */}
            <g fill="none" stroke="#a7dcd4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {/* Head */}
              <circle cx="60" cy="26" r="17" fill="#f7fbf9" />
              {/* Neck */}
              <path d="M60 43v6" />
              {/* Torso */}
              <path d="M42 55h36a6 6 0 0 1 6 6v58a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V61a6 6 0 0 1 6-6z" fill="#f7fbf9" />
              {/* Arms */}
              <path d="M42 60 L24 96 v40 M78 60 L96 96 v40" />
              {/* Legs */}
              <path d="M48 127 v66 M72 127 v66" />
            </g>

            {/* Accurately Positioned Tension Spots */}
            {marks.map((m, i) => (
              <g key={i}>
                <circle
                  cx={m.p[0]}
                  cy={m.p[1]}
                  r="9.5"
                  fill="rgba(235, 87, 87, 0.28)"
                  stroke="#eb5757"
                  strokeWidth="1.8"
                  filter="url(#spotGlow)"
                />
                <circle cx={m.p[0]} cy={m.p[1]} r="3.5" fill="#eb5757" />
              </g>
            ))}
          </svg>
        </div>

        {/* Selected Zone Pill Tags on Right */}
        <div className="ir-bodymap-words" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-start',
          flex: 1,
          minWidth: '140px'
        }}>
          {(block.words || block.zones || []).map((w, idx) => (
            <span key={idx} style={{
              font: '700 12px/1 Nunito, sans-serif',
              background: 'rgba(235, 87, 87, 0.12)',
              color: '#eb5757',
              border: '1px solid rgba(235, 87, 87, 0.3)',
              padding: '6px 14px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eb5757', display: 'inline-block' }} />
              {String(w)}
            </span>
          ))}
        </div>
      </div>

      {block.note && (
        <p className="ir-viz-note" style={{
          margin: '16px 0 0 0',
          font: '400 12px/1.5 Nunito, sans-serif',
          color: '#85918e',
          fontStyle: 'italic',
          borderTop: '1px solid #f4f4f4',
          paddingTop: '10px'
        }}>
          {block.note}
        </p>
      )}
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
  const cols = block.columns || (block.items ? block.items.length : 2)
  return (
    <div className={`ir-cards cols-${cols}${block.numbered ? ' numbered' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '14px',
        marginBottom: '17px',
        width: '100%'
      }}>
      {block.items.map((item, i) => {
        const c = item.band ? band(item.band) : null
        const bg = c ? c.fill : (item.tone === 'strong' || item.tone === 'highlight' ? '#eef7ea' : '#faf8f4')
        const border = c ? c.line : (item.tone === 'strong' || item.tone === 'highlight' ? '#dcefd3' : '#ededed')
        const textColor = c ? c.text : (item.tone === 'strong' || item.tone === 'highlight' ? '#3d7f2c' : '#017a6f')

        return (
          <div key={i} style={{
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '14px 16px',
            background: bg,
            boxSizing: 'border-box'
          }}>
            {(item.n || item.icon) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {item.n && <span style={{ width: '22px', height: '22px', borderRadius: '8px', background: '#eaf7f5', color: '#017a6f', font: '800 11px/22px Nunito, sans-serif', textAlign: 'center', flex: 'none' }}>{item.n}</span>}
                {item.icon && <Icon name={item.icon} size={16} style={{ color: textColor }} />}
              </div>
            )}
            {item.label && <p style={{ font: '800 9.5px/1 Nunito, sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: textColor, margin: '0 0 6px' }}>{item.label}</p>}
            {item.title && <p style={{ font: '800 12.5px/1.25 Nunito, sans-serif', color: '#013e39', margin: '0 0 6px' }}>{item.title}</p>}
            <p style={{ margin: 0, font: '400 11.8px/1.55 Nunito, sans-serif', color: '#585858' }}>{item.body}</p>
          </div>
        )
      })}
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
      {block.label && <div style={{ font: '700 9px/1 Nunito, sans-serif', letterSpacing: '.16em', textTransform: 'uppercase', color: '#017a6f', marginBottom: '12px' }}>{block.label}</div>}
      {block.items.map((item, i) => (
        <div className="ir-checklist-row" key={i} style={{ display: 'flex', gap: '9px', marginBottom: i === block.items.length - 1 ? 0 : '11px', alignItems: 'flex-start' }}>
          <Icon name={item.tone === 'no' ? 'alert' : 'check'} size={15}
            style={{ color: item.tone === 'no' ? '#d0574f' : '#4ea038', flex: 'none', marginTop: '2px' }} />
          <span style={{ font: '400 11.5px/1.5 Nunito, sans-serif', color: '#414242' }}>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

function ListBlock({ block }) {
  return (
    <div className={`ir-list${block.variant ? ' ' + block.variant : ''}`}>
      {block.label && <div className="ir-label" style={{ font: '700 9px/1 Nunito, sans-serif', letterSpacing: '.16em', textTransform: 'uppercase', color: '#019386', marginBottom: '11px' }}>{block.label}</div>}
      <div className="ir-list-items">
        {block.items.map((item, i) => {
          const text = typeof item === 'string' ? item : (item.text || '')
          const icon = (typeof item === 'object' && item.icon) ? item.icon : 'check'
          const cleanText = text.replace(/^[✓✔\s]+/, '')
          return (
            <div className="ir-list-row" key={i}>
              <Icon name={icon} size={15} style={{ color: '#4ea038', flex: 'none', marginTop: '2px' }} />
              <span>{cleanText}</span>
            </div>
          )
        })}
      </div>
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
  const name = (block.name && block.name !== 'You') ? block.name : (useLewisStore.getState().name || useLewisStore.getState().authUser?.name || 'User')
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="ir-profile">
      <p className="ir-label">{block.label}</p>
      <div className="ir-profile-row">
        <span className="ir-profile-avatar">{initials || 'U'}</span>
        <span className="ir-profile-info">
          <span className="ir-profile-name">{name}</span>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
        <svg width="28" height="28" viewBox="0 0 82 82">
          <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="41" cy="41" r="11" fill="#00AE9D" />
          <circle cx="71" cy="11" r="7" fill="#5FBB46" />
          <circle cx="11" cy="71" r="7" fill="#00AE9D" />
        </svg>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '16px', color: '#16302B' }}>Lewis</span>
      </div>
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
  const prepared = (page?.blocks || []).find((b) => b?.type === 'prepared')
  const petals = (page?.blocks || []).find((b) => b?.type === 'petals')
  const footer = (page?.blocks || []).find((b) => b?.type === 'callout')
  const resolvedName = (prepared?.name && prepared?.name !== 'You')
    ? prepared.name
    : (useLewisStore.getState().name || useLewisStore.getState().authUser?.name || 'User')

  return (
    <section className="ir-page ir-cover" style={{ position: 'relative', background: '#013e39', color: '#ffffff', overflow: 'hidden' }}>
      {/* Background Decorative Grid Overlay */}
      <svg aria-hidden="true" viewBox="0 0 380 380" style={{ position: 'absolute', right: '-260px', top: '640px', width: '660px', height: '660px', opacity: 0.09, pointerEvents: 'none' }}>
        <g fill="none" stroke="#6dc6ba" strokeWidth="1.1">
          <circle cx="190" cy="190" r="176" /><circle cx="190" cy="190" r="140" /><circle cx="190" cy="190" r="104" /><circle cx="190" cy="190" r="68" />
          <path d="M190 14v352M14 190h352M65 65l250 250M315 65 65 315" />
        </g>
      </svg>

      <div style={{ position: 'relative', height: '1123px', padding: '64px 62px 46px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="34" height="34" viewBox="0 0 82 82">
              <path d="M11 41 V11 H41" fill="none" stroke="#a7dcd4" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="41" cy="41" r="11" fill="#ffffff" />
              <circle cx="71" cy="11" r="7" fill="#5FBB46" />
              <circle cx="11" cy="71" r="7" fill="#ffffff" />
            </svg>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '22px', color: '#ffffff', letterSpacing: '-0.025em' }}>Lewis</span>
          </div>
          <span style={{ border: '1px solid rgba(255,255,255,.42)', borderRadius: '999px', padding: '6px 15px', font: '700 9.5px/1 Nunito, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.88)' }}>Full reflection</span>
        </div>

        {/* Title & Prepared For Grid */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '30px' }}>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(1,173,156,.24)', border: '1px solid rgba(109,198,186,.5)', borderRadius: '999px', padding: '6px 16px', font: '700 9.5px/1 Nunito, sans-serif', letterSpacing: '.16em', textTransform: 'uppercase', color: '#a7dcd4', marginBottom: '16px' }}>
              {page?.eyebrow || 'Your complete wellbeing reflection'}
            </span>
            <h1 style={{ margin: '0 0 14px', font: '800 44px/1.04 Nunito, sans-serif', letterSpacing: '-.026em', color: '#ffffff' }}>
              Your LEWIS<br />Insight Report
            </h1>
            <div style={{ width: '56px', height: '3px', background: '#5fba46', borderRadius: '999px', marginBottom: '14px' }}></div>
            <p style={{ margin: 0, maxWidth: '380px', font: '400 13px/1.5 Nunito, sans-serif', color: 'rgba(255,255,255,.8)' }}>
              {page?.deck || 'Nine areas of your life, read together: what is holding you up, what is stretched, and where one small change travels furthest.'}
            </p>
          </div>
          <div style={{ textAlign: 'right', flex: 'none', paddingBottom: '3px' }}>
            <div style={{ font: '700 9.5px/1 Nunito, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#6dc6ba', marginBottom: '9px' }}>Prepared for</div>
            <div style={{ font: '800 17px/1.3 Nunito, sans-serif', color: '#ffffff' }}>{resolvedName}</div>
            <div style={{ font: '600 11.5px/1.5 Nunito, sans-serif', color: 'rgba(255,255,255,.72)' }}>
              {[prepared?.date, prepared?.location].filter(Boolean).join('  ·  ') || '15 July 2026'}
            </div>
            <div style={{ font: '400 11px/1.5 Nunito, sans-serif', color: 'rgba(255,255,255,.6)', maxWidth: '210px', marginTop: '8px' }}>
              {prepared?.note || 'A private reflection, about twelve minutes to read.'}
            </div>
          </div>
        </div>

        {/* Petal Wheel Diagram Container */}
        <div style={{ margin: '10px 0', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {petals && <Petals block={petals} isCover={true} />}
        </div>

        {/* Bottom 2-Column Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '15px' }}>
          <div style={{ border: '1px solid rgba(255,255,255,.26)', background: 'rgba(255,255,255,.07)', borderRadius: '16px', padding: '14px 17px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
              <Icon name="compass" size={15} style={{ color: '#5fba46' }} />
              <span style={{ font: '700 9.5px/1 Nunito, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: '#a7dcd4' }}>What this report is</span>
            </div>
            <p style={{ margin: 0, font: '400 11.5px/1.5 Nunito, sans-serif', color: 'rgba(255,255,255,.9)' }}>
              A reading of how your wellbeing is arranged right now, across nine areas of life. It describes the season you are in, not the kind of person you are.
            </p>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,.26)', background: 'rgba(255,255,255,.07)', borderRadius: '16px', padding: '14px 17px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
              <Icon name="beaker" size={15} style={{ color: '#5fba46' }} />
              <span style={{ font: '700 9.5px/1 Nunito, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: '#a7dcd4' }}>How it was built</span>
            </div>
            <p style={{ margin: 0, font: '400 11.5px/1.5 Nunito, sans-serif', color: 'rgba(255,255,255,.9)' }}>
              Your answers were read using wellbeing questionnaires tested and used in published research. The short exercises added texture. Every study is named at the end.
            </p>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.2)', paddingTop: '16px', display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
          <Icon name="shield" size={14} style={{ color: 'rgba(255,255,255,.6)', flex: 'none', marginTop: '1px' }} />
          <p style={{ margin: 0, font: '400 10.5px/1.5 Nunito, sans-serif', color: 'rgba(255,255,255,.68)' }}>
            {footer?.body || 'LEWIS is a private, non-clinical reflection. It reads how life feels across nine areas and suggests what may fit. It does not diagnose, grade, or replace professional care.'}
          </p>
        </div>
      </div>
    </section>
  )
}

function ReportPage({ page, meta }) {
  if (!page) return null
  if (page.number === 1) return <CoverPage page={page} />
  const safeMeta = meta || {}
  const resolvedName = (safeMeta.name && safeMeta.name !== 'You') ? safeMeta.name : (useLewisStore.getState().name || useLewisStore.getState().authUser?.name || 'User')
  const isAppendix = page.number >= 24
  const headRight = isAppendix
    ? safeMeta.appendix_header
    : [resolvedName, safeMeta.date].filter(Boolean).join(' · ')
  return (
    <section className="ir-page">
      <div className="ir-page-head">
        <span className="ir-page-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 82 82" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
            <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="41" cy="41" r="11" fill="#00AE9D" />
            <circle cx="71" cy="11" r="7" fill="#5FBB46" />
            <circle cx="11" cy="71" r="7" fill="#00AE9D" />
          </svg>
          LEWIS <span style={{ color: '#a4a5a5' }}>/ Your LEWIS reflection</span>
        </span>
        <span className="ir-page-headright">{headRight}</span>
      </div>
      <div className="ir-page-body">
        <p className="ir-eyebrow">{page.eyebrow}</p>
        <h2 className="ir-title">{page.title}</h2>
        {page.deck && <p className="ir-deck">{page.deck}</p>}
        {(page.blocks || []).map((block, i) => <Block block={block} key={i} />)}
      </div>
      <div className="ir-page-foot">
        <span>{safeMeta.footer}</span>
        <span className="ir-page-number">{String(page.number || 1).padStart(2, '0')}</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export default function InsightReport({ report }) {
  const { authPendingDownload } = useLewisStore()

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

  const pagesToRender = report.pages || []

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
