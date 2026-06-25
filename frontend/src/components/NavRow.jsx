import { motion } from 'framer-motion'
import styles from './NavRow.module.css'

export default function NavRow({ onBack, onNext, nextLabel = 'Continue →', nextDisabled, hideBack }) {
  return (
    <div className={styles.row}>
      {!hideBack && (
        <motion.button
          type="button"
          className={styles.back}
          onClick={onBack}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      )}
      <motion.button
        type="button"
        className={styles.next}
        onClick={onNext}
        disabled={nextDisabled}
        whileHover={nextDisabled ? {} : { scale: 1.02, y: -2 }}
        whileTap={nextDisabled ? {} : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      >
        <span>{nextLabel}</span>
        <span className={styles.sheen} aria-hidden="true" />
      </motion.button>
    </div>
  )
}
