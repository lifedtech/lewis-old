/**
 * LikertScale — supports 4, 5, or 7-point scales
 * Uses Framer Motion for tap ripple feedback
 */
import { motion } from 'framer-motion'
import styles from './LikertScale.module.css'

const LABELS_4 = ['Never', 'Sometimes', 'Often', 'Always']
const LABELS_5 = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
const LABELS_7 = ['Strongly\nDisagree', 'Disagree', 'Slightly\nDisagree', 'Neutral', 'Slightly\nAgree', 'Agree', 'Strongly\nAgree']

export default function LikertScale({ question, name, points = 5, value, onChange, index }) {
  const labels = points === 4 ? LABELS_4 : points === 7 ? LABELS_7 : LABELS_5
  const pts    = Array.from({ length: points }, (_, i) => i + 1)

  return (
    <div className={styles.wrap}>
      {index !== undefined && (
        <span className={styles.index}>{index + 1}</span>
      )}
      <p className={styles.question}>{question}</p>

      <div className={styles.scale} role="radiogroup" aria-label={question}>
        {pts.map(pt => (
          <motion.button
            key={pt}
            type="button"
            role="radio"
            aria-checked={value === pt}
            aria-label={labels[pt - 1]}
            className={[styles.btn, value === pt ? styles.btnActive : ''].join(' ')}
            onClick={() => onChange(name, pt)}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <span className={styles.num}>{pt}</span>
            {points <= 5 && (
              <span className={styles.tick} aria-hidden="true">
                {value === pt ? '●' : '○'}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <div className={styles.edgeLabels}>
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  )
}
