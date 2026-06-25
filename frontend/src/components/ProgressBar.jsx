import styles from './ProgressBar.module.css'

const PHASES = [
  { label: 'Context',   icon: '🌍' },
  { label: 'Emotional', icon: '🌤' },
  { label: 'Agency',    icon: '⚡' },
  { label: 'Body',      icon: '🌿' },
  { label: 'World',     icon: '🏡' },
  { label: 'Reflect',   icon: '🔮' },
]

export default function ProgressBar({ step }) {
  if (step === 0 || step === 7) return null
  const pct = (step / 6) * 100

  return (
    <div className={styles.wrap}>
      <div className={styles.steps}>
        {PHASES.map((phase, i) => {
          const num   = i + 1
          const done  = num < step
          const active = num === step

          return (
            <div key={phase.label} className={`${styles.step} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
              <div className={styles.dot}>
                {done ? <span className={styles.check}>✓</span> : <span>{phase.icon}</span>}
              </div>
              <span className={styles.label}>{phase.label}</span>
            </div>
          )
        })}
      </div>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%` }}
        />
        <div
          className={styles.glow}
          style={{ left: `${pct}%` }}
        />
      </div>

      <p className={styles.stepText}>Phase {step} of 6 — {PHASES[step - 1]?.label}</p>
    </div>
  )
}
