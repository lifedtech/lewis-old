import { useState, useEffect } from 'react'
import styles from './Results.module.css'
import { PrimaryBtn } from '../components/ui.jsx'

const DIM_LABELS = {
  emotional_wellbeing:  { icon: '😊', label: 'Emotional Wellbeing' },
  stress_load:          { icon: '😤', label: 'Stress Load' },
  connection_isolation: { icon: '🤝', label: 'Connection' },
  sleep_recovery:       { icon: '😴', label: 'Sleep & Recovery' },
  physical_activity:    { icon: '🏃', label: 'Physical Activity' },
  financial_peace:      { icon: '💰', label: 'Financial Peace' },
  purpose_meaning:      { icon: '🌱', label: 'Purpose & Meaning' },
  burnout_workload:     { icon: '🔥', label: 'Burnout & Workload' },
  nutrition_hydration:  { icon: '🥗', label: 'Nutrition & Hydration' },
}

function DimBar({ icon, label, score }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(score, 100)), 100)
    return () => clearTimeout(t)
  }, [score])

  const color = score > 65 ? 'var(--teal)' : score > 40 ? 'var(--green)' : 'var(--muted)'

  return (
    <div className={styles.dimRow}>
      <span className={styles.dimIcon}>{icon}</span>
      <div className={styles.dimInfo}>
        <div className={styles.dimTop}>
          <span className={styles.dimLabel}>{label}</span>
          <span className={styles.dimScore} style={{ color }}>{score.toFixed(1)}</span>
        </div>
        <div className={styles.dimTrack}>
          <div className={styles.dimFill} style={{ width: `${width}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}

export default function Results({ formData, onReset }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })

  useEffect(() => {
    const run = async () => {
      const d = formData
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
        max_time_available: get('time_avail', 5),
        current_environment: get('env', 'Anywhere'),
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/assessment/full', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setState({ status: 'done', data, error: null })
      } catch (err) {
        setState({ status: 'error', data: null, error: err.message })
      }
    }
    run()
  }, [formData])

  if (state.status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>LEWIS Engine is analysing 9 dimensions and generating your narrative…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className={styles.errorBox}>
        <h3>⚠️ Connection Error</h3>
        <p>{state.error}</p>
        <p>Make sure the FastAPI backend is running on port 8000.</p>
        <div style={{ marginTop: '1.5rem' }}>
          <PrimaryBtn onClick={onReset}>← Start Over</PrimaryBtn>
        </div>
      </div>
    )
  }

  const { data } = state

  return (
    <div className={styles.wrap}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>🌿</div>
        <h1>Your Wellbeing Report</h1>
        <p>Powered by LEWIS 9D</p>
      </div>

      {/* AI Narrative */}
      <div className={styles.narrativeCard}>
        <div className={styles.narrativeIcon}>💬</div>
        <div>
          <h3>Your Personal Narrative</h3>
          <p className={styles.narrativeText}>{data.ai_narrative}</p>
        </div>
      </div>

      {/* Root Driver */}
      <div className={styles.driverCard}>
        <p className={styles.driverLabel}>🎯 Primary Root Driver</p>
        <p className={styles.driverText}>{data.cascade_analysis.primary_root_driver}</p>
      </div>

      {/* Habit Prescription */}
      <div className={styles.habitCard}>
        <div className={styles.habitHeader}>
          <span className={styles.habitBadge}>✅ Prescribed Micro-Habit</span>
          <h3>{data.prescription.habit_title}</h3>
        </div>
        <div className={styles.habitAction}>
          <p>{data.prescription.micro_action}</p>
        </div>
      </div>

      {/* 9D Scores */}
      <div className={styles.dimsCard}>
        <h3>📊 Your 9 Dimension Scores</h3>
        <div className={styles.dimList}>
          {Object.entries(DIM_LABELS).map(([key, { icon, label }]) => (
            <DimBar key={key} icon={icon} label={label} score={data.dimensions[key] ?? 0} />
          ))}
        </div>
      </div>

      <div className={styles.resetRow}>
        <PrimaryBtn onClick={onReset}>🔄 Start Over</PrimaryBtn>
      </div>
    </div>
  )
}
