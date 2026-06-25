/**
 * StageShell — wrapper for all assessment stages 1–10
 * Renders stage progress, title, and animated entry
 */
import { motion, AnimatePresence } from 'framer-motion'
import styles from './StageShell.module.css'
import { useLewisStore } from '../store/useLewisStore.js'
import MusicPlayer from './MusicPlayer.jsx'

const STAGE_META = {
  1:  { label: 'Context',          icon: '🌍' },
  2:  { label: 'Attention',        icon: '👁' },
  3:  { label: 'Body & Feeling',   icon: '🫀' },
  4:  { label: 'Energy',           icon: '⚡' },
  5:  { label: 'Measurement',      icon: '📊' },
  6:  { label: 'Sharing',          icon: '💬' },
  7:  { label: 'Habits',           icon: '🌱' },
  8:  { label: 'Patterns',         icon: '🔄' },
  9:  { label: 'Sound & Choice',   icon: '🎵' },
  10: { label: 'Final Reflection', icon: '🔮' },
}

export default function StageShell({ stage, title, subtitle, children, noPad }) {
  const meta = STAGE_META[stage] || {}
  const pct  = (stage / 10) * 100

  return (
    <div className={styles.shell}>
      {/* Top bar */}
      <header className={styles.header}>
        <span className={styles.logo}>🌿 LEWIS</span>
        <div className={styles.headerCenter}>
          <span className={styles.stageLabel}>
            {meta.icon} Stage {stage} · {meta.label}
          </span>
        </div>
        <MusicPlayer />
      </header>

      {/* Progress track */}
      <div className={styles.progressTrack} role="progressbar"
           aria-valuenow={stage} aria-valuemin={1} aria-valuemax={10}>
        <motion.div
          className={styles.progressFill}
          initial={{ width: `${((stage - 1) / 10) * 100}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <div className={styles.progressGlow} style={{ left: `${pct}%` }} />
      </div>
      <p className={styles.progressText}>{stage} of 10</p>

      {/* Content */}
      <motion.main
        className={noPad ? styles.mainNoPad : styles.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        key={stage}
      >
        {title && (
          <div className={styles.stageHeader}>
            <h2 className={styles.stageTitle}>{title}</h2>
            {subtitle && <p className={styles.stageSub}>{subtitle}</p>}
          </div>
        )}
        {children}
      </motion.main>
    </div>
  )
}
