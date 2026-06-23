import styles from './ProgressBar.module.css'

const PHASES = [
  'Context', 'Emotional', 'Agency', 'Body', 'Environment', 'Preferences'
]

export default function ProgressBar({ step }) {
  // step 1-6 = phases, 0 = landing, 7 = results
  if (step === 0 || step === 7) return null
  const pct = (step / 6) * 100

  return (
    <div className={styles.wrap}>
      <div className={styles.labels}>
        {PHASES.map((label, i) => (
          <span
            key={label}
            className={`${styles.label} ${i + 1 === step ? styles.active : ''} ${i + 1 < step ? styles.done : ''}`}
          >
            <span className={styles.dot}>{i + 1 < step ? '✓' : i + 1}</span>
            <span className={styles.labelText}>{label}</span>
          </span>
        ))}
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.stepText}>Phase {step} of 6</p>
    </div>
  )
}
