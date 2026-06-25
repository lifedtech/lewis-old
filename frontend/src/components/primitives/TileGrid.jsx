/**
 * TileGrid — multi-select grid of icon+label tiles
 * Framer Motion spring animation on tap
 */
import { motion } from 'framer-motion'
import styles from './TileGrid.module.css'

export default function TileGrid({ options, selected = [], onChange, name, maxSelect }) {
  const toggle = (opt) => {
    const isOn = selected.includes(opt)
    if (!isOn && maxSelect && selected.length >= maxSelect) return
    const next = isOn ? selected.filter(v => v !== opt) : [...selected, opt]
    onChange(name, next)
  }

  return (
    <div className={styles.grid} role="group">
      {options.map(({ value, label, icon, emoji }) => {
        const active = selected.includes(value)
        return (
          <motion.button
            key={value}
            type="button"
            role="checkbox"
            aria-checked={active}
            aria-label={label}
            className={[styles.tile, active ? styles.tileActive : ''].join(' ')}
            onClick={() => toggle(value)}
            whileTap={{ scale: 0.93 }}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            <span className={styles.tileIcon} aria-hidden="true">
              {emoji || icon || '○'}
            </span>
            <span className={styles.tileLabel}>{label}</span>
            {active && (
              <motion.span
                className={styles.check}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >✓</motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
