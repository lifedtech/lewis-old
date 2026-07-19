// InsightReport.jsx — renders the backend's 16-page insight report JSON
// in the approved report style, and prints it to PDF via the browser.
//
// The backend is the single source of every word on these pages (the
// deterministic spine, gate-checked). This component only lays blocks
// out; it never invents, reorders, or rewrites content.

import React from 'react'
import './report.css'

const BAND_COLORS = {
  'Running on empty': 'var(--ir-empty)',
  'Under pressure': 'var(--ir-pressure)',
  'Steady': 'var(--ir-steady)',
  'Strong': 'var(--ir-strong)',
  'Not read': 'var(--ir-mute)',
}
const BAND_STEPS = { 'Running on empty': 1, 'Under pressure': 2, 'Steady': 3, 'Strong': 4 }

const bandColor = (band) => BAND_COLORS[band] || 'var(--ir-mute)'

function BandChip({ band }) {
  return <span className="ir-band-chip" style={{ background: bandColor(band) }} />
}

function StepBar({ band }) {
  const steps = BAND_STEPS[band] || 0
  return (
    <span className="ir-band-steps">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className="ir-band-step"
          style={i <= steps ? { background: bandColor(band) } : undefined} />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Block renderers                                                     */
/* ------------------------------------------------------------------ */

function Paragraph({ block }) {
  return (
    <p className="ir-para">
      {block.lead && <span className="ir-para-lead">{block.lead}</span>}
      {block.text}
    </p>
  )
}

function Callout({ block }) {
  const variant = block.variant && block.variant !== 'info' ? ` ${block.variant}` : ''
  return (
    <div className={`ir-callout${variant}`}>
      {block.label && <p className="ir-callout-label">{block.label}</p>}
      {block.title && <p className="ir-card-title">{block.title}</p>}
      <p className="ir-callout-body">{block.body}</p>
    </div>
  )
}

function Cards({ block }) {
  return (
    <div className={`ir-cards cols-${block.columns || 2}`}>
      {block.items.map((item, i) => (
        <div className="ir-card" key={i}>
          {item.label && <p className="ir-card-label">{item.label}</p>}
          {item.title && <p className="ir-card-title">{item.title}</p>}
          <p className="ir-card-body">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

function BandWords({ block }) {
  return (
    <div className="ir-bandwords">
      {block.items.map((item) => (
        <div className="ir-bandword" key={item.band}>
          <p className="ir-bandword-name" style={{ color: bandColor(item.band) }}>
            <BandChip band={item.band} />{item.band}
          </p>
          <p className="ir-bandword-gloss">{item.gloss}</p>
        </div>
      ))}
    </div>
  )
}

function Bands({ block }) {
  return (
    <div className="ir-bands">
      {block.title && <p className="ir-bands-title">{block.title}</p>}
      {block.items.map((item) => (
        <div className="ir-band-row" key={item.name}>
          <span>{item.name}</span>
          <StepBar band={item.band} />
          <span className="ir-band-word" style={{ color: bandColor(item.band) }}>{item.band}</span>
        </div>
      ))}
    </div>
  )
}

function Table({ block }) {
  return (
    <div className={`ir-table-wrap${block._seven ? ' ir-sevendays' : ''}`}>
      {block.title && <p className="ir-table-title">{block.title}</p>}
      <table className="ir-table">
        <thead>
          <tr>{block.columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Nine-area wheel: each segment grows in four discrete radius steps
// only, matching the four band words. Color reinforces the band; the
// legend beside it carries every band word as text.
function Wheel({ block }) {
  const items = block.items
  const n = items.length
  const cx = 150, cy = 150, rMax = 118, rMin = 26
  const gap = 0.035

  const wedges = items.map((item, i) => {
    const step = BAND_STEPS[item.band] || 1
    const r = rMin + ((rMax - rMin) * step) / 4
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + gap
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - gap
    const large = a1 - a0 > Math.PI ? 1 : 0
    const p0 = [cx + rMin * Math.cos(a0), cy + rMin * Math.sin(a0)]
    const p1 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)]
    const p2 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)]
    const p3 = [cx + rMin * Math.cos(a1), cy + rMin * Math.sin(a1)]
    const d = [
      `M ${p0[0]} ${p0[1]}`,
      `L ${p1[0]} ${p1[1]}`,
      `A ${r} ${r} 0 ${large} 1 ${p2[0]} ${p2[1]}`,
      `L ${p3[0]} ${p3[1]}`,
      `A ${rMin} ${rMin} 0 ${large} 0 ${p0[0]} ${p0[1]}`,
      'Z',
    ].join(' ')
    return { d, color: bandColor(item.band), key: item.name }
  })

  return (
    <div className="ir-wheel">
      <div>
        <svg viewBox="0 0 300 300" role="img" aria-label="Nine areas, banded in four steps">
          {[1, 2, 3, 4].map((s) => (
            <circle key={s} cx={cx} cy={cy} r={rMin + ((rMax - rMin) * s) / 4}
              fill="none" stroke="var(--ir-hairline)" strokeWidth="1" />
          ))}
          {wedges.map((w) => (
            <path key={w.key} d={w.d} fill={w.color} fillOpacity="0.85"
              stroke="var(--ir-paper)" strokeWidth="2" />
          ))}
          <circle cx={cx} cy={cy} r={rMin - 3} fill="var(--ir-paper)" />
          <text x={cx} y={cy - 3} textAnchor="middle"
            style={{ font: '700 11px Inter, system-ui, sans-serif', fill: 'var(--ir-ink)' }}>
            {block.overall}
          </text>
          <text x={cx} y={cy + 11} textAnchor="middle"
            style={{ font: '9px Inter, system-ui, sans-serif', fill: 'var(--ir-mute)', letterSpacing: '0.1em' }}>
            OVERALL
          </text>
        </svg>
        <p className="ir-wheel-note">{block.note}</p>
      </div>
      <div className="ir-bands" style={{ margin: 0 }}>
        {items.map((item) => (
          <div className="ir-band-row" key={item.name}>
            <span>{item.name}</span>
            <StepBar band={item.band} />
            <span className="ir-band-word" style={{ color: bandColor(item.band) }}>{item.band}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Day rhythm: one series of discrete levels across the day, drawn from
// the person's own description. Every point is directly labeled.
function DayCurve({ block }) {
  const points = block.points || []
  if (!points.length) return null
  const levels = { Low: 96, Med: 62, High: 28, Medium: 62 }
  const w = 560, padX = 56
  const stepX = points.length > 1 ? (w - padX * 2) / (points.length - 1) : 0
  const coords = points.map((p, i) => ({
    x: padX + i * stepX,
    y: levels[p.level] ?? 62,
    slot: p.slot,
    level: p.level,
  }))
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  return (
    <div className="ir-daycurve">
      <p className="ir-table-title">YOUR DAY, AS YOU DESCRIBED IT</p>
      <svg viewBox="0 0 560 150" role="img" aria-label="Energy level across the day">
        {[28, 62, 96].map((y, i) => (
          <line key={y} x1={padX - 8} y1={y} x2={w - padX + 8} y2={y}
            stroke="var(--ir-hairline)" strokeWidth="1" />
        ))}
        {['High', 'Med', 'Low'].map((label, i) => (
          <text key={label} x={padX - 14} y={[28, 62, 96][i] + 3} textAnchor="end"
            style={{ font: '9px Inter, system-ui, sans-serif', fill: 'var(--ir-mute)' }}>{label}</text>
        ))}
        <path d={path} fill="none" stroke="var(--ir-steady)" strokeWidth="2" strokeLinejoin="round" />
        {coords.map((c) => (
          <g key={c.slot}>
            <circle cx={c.x} cy={c.y} r="4.5" fill="var(--ir-steady)" stroke="#fff" strokeWidth="2" />
            <text x={c.x} y={130} textAnchor="middle"
              style={{ font: '10px Inter, system-ui, sans-serif', fill: 'var(--ir-sub)' }}>{c.slot}</text>
          </g>
        ))}
      </svg>
      <p className="ir-viz-note">{block.note}</p>
    </div>
  )
}

function LoadBar({ block }) {
  const labels = ['Light', 'Moderate', 'Carrying a lot']
  return (
    <div className="ir-loadbar">
      <p className="ir-table-title">HOW MUCH YOU HAVE BEEN CARRYING</p>
      <div className="ir-loadbar-track">
        {[1, 2, 3].map((i) => (
          <span key={i} className="ir-loadbar-seg"
            style={i <= block.level ? { background: i === 3 ? 'var(--ir-empty)' : i === 2 ? 'var(--ir-pressure)' : 'var(--ir-strong)' } : undefined} />
        ))}
      </div>
      <div className="ir-loadbar-labels">
        {labels.map((l, i) => (
          <span key={l} className={block.level === i + 1 ? 'active' : ''}>{l}</span>
        ))}
      </div>
      <p className="ir-viz-note">{block.note}</p>
    </div>
  )
}

function BodyMap({ block }) {
  return (
    <div className="ir-bodymap">
      <p className="ir-table-title">WHERE YOU NOTICED TENSION</p>
      <div className="ir-bodymap-zones">
        {block.zones.map((z) => <span className="ir-bodymap-zone" key={z}>{z}</span>)}
      </div>
      {block.note && <p className="ir-viz-note">{block.note}</p>}
    </div>
  )
}

function Flow({ block }) {
  const steps = block.steps
  const cls = steps.length === 1 ? ' n1' : steps.length === 2 ? ' n2' : ''
  return (
    <div className="ir-flow">
      <div className={`ir-flow-steps${cls}`}>
        {steps.map((s, i) => (
          <React.Fragment key={s.tag}>
            {i > 0 && <span className="ir-flow-arrow">→</span>}
            <div className="ir-flow-step">
              <p className="ir-flow-tag">{s.tag}</p>
              <p className="ir-flow-area">{s.area}</p>
              <p className="ir-flow-text">{s.text}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
      <p className="ir-flow-first">{block.first_move}</p>
    </div>
  )
}

function AreaBlock({ block }) {
  return (
    <div className="ir-area">
      <div className="ir-area-head">
        <span>
          <span className="ir-area-name">{block.name}</span>
          <span className="ir-area-band" style={{ color: bandColor(block.band) }}>
            {block.band}
          </span>
        </span>
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
      <p className="ir-practice-tag">{block.tag}</p>
      <p className="ir-practice-title">{block.title}</p>
      <div className="ir-practice-cols">
        {block.cols.map((c) => (
          <div className="ir-practice-col" key={c.label}>
            <p className="ir-practice-col-label">{c.label}</p>
            <p className="ir-practice-col-text">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SevenDays({ block }) {
  return (
    <Table block={{
      title: block.title,
      columns: ['Day', 'Focus', 'One action, nothing more'],
      rows: block.rows.map((r) => [r.day, r.focus, r.action]),
      _seven: true,
    }} />
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

function Program({ block }) {
  return (
    <div className="ir-program">
      <p className="ir-program-tag">{block.tag}</p>
      <p className="ir-program-title">{block.title}</p>
      <p className="ir-program-section"><b>What it is, concretely</b>{block.what}</p>
      <p className="ir-program-section"><b>Why this suits your pattern</b>{block.why}</p>
      <p className="ir-program-section"><b>What to check before booking</b>{block.check}</p>
    </div>
  )
}

const BLOCKS = {
  paragraph: Paragraph,
  callout: Callout,
  cards: Cards,
  bandwords: BandWords,
  bands: Bands,
  table: Table,
  wheel: Wheel,
  daycurve: DayCurve,
  loadbar: LoadBar,
  bodymap: BodyMap,
  flow: Flow,
  area: AreaBlock,
  practice: Practice,
  sevendays: SevenDays,
  supports: Supports,
  program: Program,
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

function CoverPage({ page, meta }) {
  const prepared = page.blocks.find((b) => b.type === 'paragraph' && b.lead)
  const privateLine = page.blocks.find((b) => b.type === 'paragraph' && !b.lead)
  const cards = page.blocks.find((b) => b.type === 'cards')
  const footer = page.blocks.find((b) => b.type === 'callout')
  return (
    <section className="ir-page ir-cover">
      <div className="ir-page-body">
        <p className="ir-cover-brand">LIFED · LEWIS</p>
        <p className="ir-cover-kicker">Your complete wellbeing reflection</p>
        <h1 className="ir-cover-title">{page.title}</h1>
        <p className="ir-cover-sub">{page.subtitle}</p>
        {prepared && <p className="ir-cover-prepared">{prepared.text}</p>}
        {privateLine && <p className="ir-cover-private">{privateLine.text}</p>}
        {cards && <Cards block={cards} />}
        {footer && <Callout block={footer} />}
      </div>
    </section>
  )
}

function ReportPage({ page, meta }) {
  if (page.number === 1) return <CoverPage page={page} meta={meta} />
  const headRight = [
    meta.name ? `Prepared for ${meta.name}` : 'Prepared for you',
    meta.date,
  ].filter(Boolean).join(' · ')
  return (
    <section className="ir-page">
      <div className="ir-page-head">
        <span>LIFED / YOUR LEWIS REFLECTION</span>
        <span>{headRight}</span>
      </div>
      <div className="ir-page-body">
        <p className="ir-eyebrow">{page.eyebrow}</p>
        <h2 className="ir-title">{page.title}</h2>
        {page.subtitle && <p className="ir-subtitle">{page.subtitle}</p>}
        {page.blocks.map((block, i) => {
          const Renderer = BLOCKS[block.type]
          return Renderer ? <Renderer block={block} key={i} /> : null
        })}
      </div>
      <div className="ir-page-foot">
        <span>{meta.footer}</span>
        <span>PAGE {page.number}</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export default function InsightReport({ report }) {
  if (!report || !report.pages) return null

  const handleDownload = () => {
    document.body.classList.add('ir-printing')
    const cleanup = () => {
      document.body.classList.remove('ir-printing')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)
    window.print()
  }

  return (
    <div className="ir-root">
      <div className="ir-toolbar">
        <span className="ir-toolbar-note">
          Your full insight report, ready below. Use the button to save it as a PDF.
        </span>
        <button className="ir-download-btn" onClick={handleDownload}>
          Download as PDF
        </button>
      </div>
      {report.pages.map((page) => (
        <ReportPage page={page} meta={report.meta} key={page.number} />
      ))}
    </div>
  )
}
