import styles from './Landing.module.css'
import { PrimaryBtn } from '../components/ui.jsx'

export default function Landing({ onNext }) {
  return (
    <div className={styles.container}>

      {/* Concentric circle visual — behind everything */}
      <div className={styles.circles} aria-hidden="true">
        <div className={styles.circle} style={{ '--delay': '0s',   '--size': '600px' }} />
        <div className={styles.circle} style={{ '--delay': '1s',   '--size': '470px' }} />
        <div className={styles.circle} style={{ '--delay': '2s',   '--size': '350px' }} />
        <div className={styles.circle} style={{ '--delay': '3s',   '--size': '240px' }} />
        <div className={styles.circleSolid}                                            />
      </div>

      {/* Hero */}
      <div className={styles.hero}>

        {/* Greeting */}
        <p className={styles.greeting}>Meet</p>

        {/* LEWIS — the focal point */}
        <h1 className={styles.brand}>LEWIS</h1>

        {/* Full name ribbon */}
        <p className={styles.fullName}>
          Life &amp; Wellbeing Intelligence System
        </p>

        {/* Divider line */}
        <div className={styles.rule} />

        {/* One-liner */}
        <p className={styles.tagline}>
          A science-backed, AI-powered check-in across<br />
          9 dimensions of your wellbeing.
        </p>

        {/* CTA */}
        <div className={styles.cta}>
          <button className={styles.ctaBtn} onClick={onNext}>
            Begin Wellbeing Analysis
            <span className={styles.ctaArrow}>→</span>
          </button>
          <p className={styles.ctaMeta}>No signup · Anonymous · ~5 mins</p>
        </div>

      </div>
    </div>
  )
}
