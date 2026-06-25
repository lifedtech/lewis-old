import { useState, useEffect, useRef } from 'react'
import styles from './Results.module.css'
import { PrimaryBtn } from '../components/ui.jsx'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts'

/* ── Dimension metadata ───────────────────────────────── */
const DIMS = {
  emotional_wellbeing:  { icon: '😊', label: 'Emotional Wellbeing',  short: 'Emotional',  hib: true  },
  stress_load:          { icon: '😤', label: 'Stress Load',           short: 'Stress',     hib: false },
  connection_isolation: { icon: '🤝', label: 'Connection',            short: 'Connection', hib: true  },
  sleep_recovery:       { icon: '😴', label: 'Sleep & Recovery',      short: 'Sleep',      hib: true  },
  physical_activity:    { icon: '🏃', label: 'Physical Activity',     short: 'Physical',   hib: true  },
  financial_peace:      { icon: '💰', label: 'Financial Peace',       short: 'Financial',  hib: true  },
  purpose_meaning:      { icon: '🌱', label: 'Purpose & Meaning',     short: 'Purpose',    hib: true  },
  burnout_workload:     { icon: '🔥', label: 'Burnout & Workload',    short: 'Burnout',    hib: false },
  nutrition_hydration:  { icon: '🥗', label: 'Nutrition & Hydration', short: 'Nutrition',  hib: true  },
}

const CHART_GREENS = [
  '#00B09B','#78C652','#4e8c4a',
  '#5b9e94','#b2dfdb','#95c78f',
  '#3a7a50','#c8e6c9','#d4e8c2',
]

function effectiveScore(score, hib) { return hib ? score : 100 - score }

function ringColor(eff) {
  if (eff > 65) return 'var(--lewis-teal)'
  if (eff > 40) return 'var(--lewis-mint)'
  return '#E07B39'
}

function bandFor(eff) {
  if (eff >= 70) return { label: 'Thriving',       bg: 'rgba(0,176,155,0.12)',  fg: '#008f7e' }
  if (eff >= 50) return { label: 'Steady',         bg: 'rgba(120,198,82,0.12)', fg: '#4e8c4a' }
  if (eff >= 35) return { label: 'Stretched',      bg: 'rgba(224,123,57,0.12)', fg: '#c06030' }
  return               { label: 'Needs Attention', bg: 'rgba(192,57,43,0.12)',  fg: '#c0392b' }
}

/* ── Animated SVG Progress Ring ───────────────────────── */
function ProgressRing({ score, hib, icon, label, size = 92, delay = 0 }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const eff   = effectiveScore(score, hib)
  const color = ringColor(eff)
  const band  = bandFor(eff)
  const r     = (size - 10) / 2
  const circ  = 2 * Math.PI * r
  const dash  = animated ? (eff / 100) * circ : 0

  return (
    <div className={styles.ringCard}>
      <div className={styles.ringSvgWrap}
           style={{ width: size, height: size }}
           role="img"
           aria-label={`${label}: ${Math.round(eff)} out of 100`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* bg track */}
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke="rgba(26,46,48,0.08)" strokeWidth="7" />
          {/* progress */}
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: `stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1) ${delay}ms` }}
          />
        </svg>
        <div className={styles.ringCenter}>
          <span className={styles.ringScore} style={{ color }}>{Math.round(eff)}</span>
        </div>
      </div>
      <div className={styles.ringMeta}>
        <span className={styles.ringIcon}>{icon}</span>
        <span className={styles.ringLabel}>{label}</span>
        <span className={styles.ringBand} style={{ background: band.bg, color: band.fg }}>
          {band.label}
        </span>
      </div>
    </div>
  )
}

/* ── Animated horizontal dim bar ──────────────────────── */
function DimBar({ icon, label, score, hib, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(Math.min(score, 100)), delay + 80)
    return () => clearTimeout(t)
  }, [score, delay])

  const eff   = effectiveScore(score, hib)
  const color = ringColor(eff)
  const band  = bandFor(eff)

  return (
    <div className={styles.dimRow}>
      <div className={styles.dimLeft}>
        <span className={styles.dimIcon}>{icon}</span>
        <span className={styles.dimLabel}>{label}</span>
      </div>
      <div className={styles.dimRight}>
        <div className={styles.dimTrack}>
          <div className={styles.dimFill}
               style={{
                 width: `${w}%`,
                 background: `linear-gradient(90deg, ${color}bb, ${color})`,
                 transition: `width 1.1s cubic-bezier(.4,0,.2,1)`,
               }} />
        </div>
        <div className={styles.dimMeta}>
          <span className={styles.dimScore} style={{ color }}>{score.toFixed(0)}</span>
          <span className={styles.dimBand}
                style={{ background: band.bg, color: band.fg }}>{band.label}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Premium loading screen ───────────────────────────── */
function LoadingScreen() {
  const canvasRef = useRef(null)
  const [stepIdx, setStepIdx] = useState(0)
  const STEPS = [
    'Synthesizing your psychological profile…',
    'Calculating 9 dimension scores…',
    'Running cascade root analysis…',
    'Generating your AI narrative…',
    'Building your report…',
  ]

  useEffect(() => {
    const t = setInterval(() => setStepIdx(s => Math.min(s + 1, STEPS.length - 1)), 1600)
    return () => clearInterval(t)
  }, [])

  /* Geometric pulse animation via canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame, t = 0

    const draw = () => {
      const { width: W, height: H } = canvas
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2

      for (let ring = 0; ring < 4; ring++) {
        const phase   = t * 0.022 + ring * (Math.PI / 2)
        const baseR   = 22 + ring * 22
        const pulse   = Math.sin(phase) * 6
        const r       = baseR + pulse
        const alpha   = 0.12 + Math.sin(phase + 1) * 0.08

        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,176,155,${alpha})`
        ctx.lineWidth   = 1.5 + ring * 0.4
        ctx.stroke()
      }

      // Rotating dashes
      for (let i = 0; i < 6; i++) {
        const angle = (t * 0.015) + (i * Math.PI / 3)
        const rx    = cx + Math.cos(angle) * 50
        const ry    = cy + Math.sin(angle) * 50
        ctx.beginPath()
        ctx.arc(rx, ry, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(120,198,82,${0.25 + Math.sin(t * 0.04 + i) * 0.15})`
        ctx.fill()
      }

      t++
      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={styles.loadingWrap}>
      <canvas ref={canvasRef} width={140} height={140} className={styles.loadingCanvas} />
      <div className={styles.loadingLeaf}>🌿</div>
      <h2 className={styles.loadingTitle}>{STEPS[stepIdx]}</h2>
      <div className={styles.loadingDots}>
        {STEPS.map((_, i) => (
          <span key={i}
                className={[styles.loadingDot, i <= stepIdx ? styles.loadingDotActive : ''].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Custom chart tooltip ─────────────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.chartTip}>
      {label && <p className={styles.chartTipLabel}>{label}</p>}
      <p className={styles.chartTipVal} style={{ color: 'var(--lewis-teal)' }}>
        {payload[0].value?.toFixed ? payload[0].value.toFixed(0) : payload[0].value}
        <span className={styles.chartTipUnit}> / 100</span>
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN RESULTS PAGE
   ══════════════════════════════════════════════════════ */
export default function Results({ formData, onReset }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })

  useEffect(() => {
    const run = async () => {
      const d   = formData
      const get = (key, def) => d[key] ?? def

      const payload = {
        who5:  [0,1,2,3,4].map(i => get(`w${i}`, 3)),
        pss10: [0,1,2,3,4,5,6,7,8,9].map(i => get(`p${i}`, 2)),
        ucla3: [0,1,2].map(i => get(`u${i}`, 2)),
        sqi:   [0,1,2,3].map(i => get(`s${i}`, 1)),
        pai3:  [0,1,2].map(i => get(`pa${i}`, 2)),
        fsi3:  [0,1,2].map(i => get(`cfpb${i}`, 2)),
        pmi3:  [0,1,2].map(i => get(`fl${i}`, 2)),
        bwi3:  [0,1,2].map(i => get(`bw${i}`, 2)),
        nhi3:  [0,1,2].map(i => get(`nh${i}`, 2)),
        max_time_available:  get('time_avail', 5),
        current_environment: get('env', 'Anywhere'),
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/assessment/full`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(await res.text())
        setState({ status: 'done', data: await res.json(), error: null })
      } catch (err) {
        setState({ status: 'error', data: null, error: err.message })
      }
    }
    run()
  }, [formData])

  /* ── Loading ── */
  if (state.status === 'loading') return <LoadingScreen />

  /* ── Error ── */
  if (state.status === 'error') return (
    <div className={styles.errorBox}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3>Connection Error</h3>
      <p>{state.error}</p>
      <p className={styles.errorHint}>
        Make sure the FastAPI backend is running on port 8000.
      </p>
      <div className={styles.errorBtn}>
        <PrimaryBtn onClick={onReset}>← Start Over</PrimaryBtn>
      </div>
    </div>
  )

  const { data } = state
  const dims     = data.dimensions

  /* ── Data prep ── */
  const scored = Object.entries(DIMS).map(([key, meta]) => ({
    key, meta,
    raw:  dims[key] ?? 0,
    eff:  effectiveScore(dims[key] ?? 0, meta.hib),
  }))

  const top3    = [...scored].sort((a, b) => b.eff - a.eff).slice(0, 3)
  const bottom3 = [...scored].sort((a, b) => a.eff - b.eff).slice(0, 3)

  const radarData = scored.map(({ meta, raw }) => ({
    subject:  meta.short,
    value:    Math.round(raw),
    fullMark: 100,
  }))

  const barData = [...scored]
    .sort((a, b) => b.raw - a.raw)
    .map(({ meta, raw }, i) => ({
      name:  meta.short,
      score: Math.round(raw),
      fill:  CHART_GREENS[i % CHART_GREENS.length],
    }))

  const bandCounts = { Thriving: 0, Steady: 0, Stretched: 0, 'Needs Attention': 0 }
  scored.forEach(({ eff }) => { bandCounts[bandFor(eff).label]++ })
  const pieData = Object.entries(bandCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value], i) => ({
      name, value,
      fill: ['#00B09B','#78C652','#E07B39','#c0392b'][i],
    }))

  return (
    <div className={styles.wrap}>

      {/* ── Hero ──────────────────────────── */}
      <div className={styles.hero}>
        <span className={styles.heroLeaf}>🌿</span>
        <h1 className={styles.heroTitle}>Your Wellbeing Report</h1>
        <p className={styles.heroSub}>
          Powered by LEWIS 9D ·{' '}
          {new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* ── AI Narrative — premium glassmorphism card ── */}
      <div className={styles.narrativeCard}>
        <div className={styles.narrativeGrain} aria-hidden="true" />
        <div className={styles.narrativeAccent} />
        <div className={styles.narrativeInner}>
          <p className={styles.narrativeEyebrow}>✦ Your Personal Narrative</p>
          <blockquote className={styles.narrativeText}>
            {data.ai_narrative}
          </blockquote>
        </div>
      </div>

      {/* ── Root Driver ───────────────────── */}
      <div className={styles.driverCard}>
        <span className={styles.driverPill}>🎯 Primary Root Driver</span>
        <p className={styles.driverText}>{data.cascade_analysis.primary_root_driver}</p>
      </div>

      {/* ── Habit Prescription ────────────── */}
      <div className={styles.habitCard}>
        <div className={styles.habitLeft}>
          <span className={styles.habitIcon}>✅</span>
          <span className={styles.habitTag}>Micro-Habit</span>
        </div>
        <div>
          <h3 className={styles.habitTitle}>{data.prescription.habit_title}</h3>
          <p className={styles.habitAction}>{data.prescription.micro_action}</p>
        </div>
      </div>

      {/* ── Top 3 Strengths (animated rings) ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionHead}>💪 Your Top Strengths</h2>
        <p className={styles.sectionDesc}>Dimensions where you are thriving right now</p>
        <div className={styles.ringsRow}>
          {top3.map(({ key, meta, raw }, i) => (
            <ProgressRing
              key={key}
              score={raw}
              hib={meta.hib}
              icon={meta.icon}
              label={meta.label}
              size={96}
              delay={i * 160}
            />
          ))}
        </div>
      </section>

      {/* ── Bottom 3 To Nurture (animated rings) ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionHead}>🌱 To Nurture</h2>
        <p className={styles.sectionDesc}>Dimensions that deserve your care and attention</p>
        <div className={styles.ringsRow}>
          {bottom3.map(({ key, meta, raw }, i) => (
            <ProgressRing
              key={key}
              score={raw}
              hib={meta.hib}
              icon={meta.icon}
              label={meta.label}
              size={96}
              delay={i * 160}
            />
          ))}
        </div>
      </section>

      {/* ── Radar Chart ───────────────────── */}
      <section className={[styles.section, styles.chartSection].join(' ')}>
        <div className={styles.chartGrain} aria-hidden="true" />
        <h2 className={styles.sectionHead}>🕸 Wellbeing Radar</h2>
        <p className={styles.sectionDesc}>A holistic spider-view across all nine dimensions</p>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}
                        margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
              <PolarGrid stroke="rgba(26,46,48,0.08)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'Inter' }}
              />
              <PolarRadiusAxis
                angle={90} domain={[0, 100]}
                tick={{ fill: 'var(--muted)', fontSize: 9 }}
                axisLine={false}
              />
              <Radar name="Score" dataKey="value"
                stroke="var(--lewis-teal)"
                fill="var(--lewis-teal)"
                fillOpacity={0.22}
                strokeWidth={2}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className={styles.chartTip}>
                      <p className={styles.chartTipLabel}>{payload[0].payload.subject}</p>
                      <p className={styles.chartTipVal} style={{ color: 'var(--lewis-teal)' }}>
                        {payload[0].value}
                        <span className={styles.chartTipUnit}> / 100</span>
                      </p>
                    </div>
                  )
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Bar Chart (sorted by score) ───── */}
      <section className={[styles.section, styles.chartSection].join(' ')}>
        <div className={styles.chartGrain} aria-hidden="true" />
        <h2 className={styles.sectionHead}>📊 Dimension Scores</h2>
        <p className={styles.sectionDesc}>Sorted from highest to lowest</p>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={barData}
                      margin={{ top: 8, right: 8, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3"
                             stroke="rgba(26,46,48,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'Inter' }}
                angle={-32}
                textAnchor="end"
                interval={0}
                dy={6}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: 'var(--muted)', fontSize: 9 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Pie — band distribution ────────── */}
      <section className={[styles.section, styles.chartSection].join(' ')}>
        <div className={styles.chartGrain} aria-hidden="true" />
        <h2 className={styles.sectionHead}>🥧 Wellbeing Band Distribution</h2>
        <p className={styles.sectionDesc}>
          How your nine dimensions are spread across wellbeing bands
        </p>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="46%"
                innerRadius={56} outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: 'var(--muted)', strokeWidth: 1 }}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v} dimension${v > 1 ? 's' : ''}`]}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  fontFamily: 'Inter',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Full detailed bar list ─────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionHead}>📋 Full Dimension Breakdown</h2>
        <p className={styles.sectionDesc}>All nine scores with band classification</p>
        <div className={styles.dimList}>
          {scored.map(({ key, meta, raw }, i) => (
            <DimBar
              key={key}
              icon={meta.icon}
              label={meta.label}
              score={raw}
              hib={meta.hib}
              delay={i * 60}
            />
          ))}
        </div>
      </section>

      {/* ── Reset ─────────────────────────── */}
      <div className={styles.resetRow}>
        <PrimaryBtn onClick={onReset}>🔄 Take Assessment Again</PrimaryBtn>
      </div>

    </div>
  )
}
