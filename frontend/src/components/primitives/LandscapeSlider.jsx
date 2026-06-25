/**
 * LandscapeSlider — single-drag horizontal slider
 * Framer Motion drag with haptic-style bounce
 */
import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import styles from './LandscapeSlider.module.css'

export default function LandscapeSlider({ name, value, onChange, leftLabel, rightLabel, min = 0, max = 100 }) {
  const trackRef = useRef(null)

  const pct = ((value - min) / (max - min)) * 100

  const handleTrackClick = (e) => {
    const rect = trackRef.current.getBoundingClientRect()
    const x    = e.clientX - rect.left
    const raw  = Math.round((x / rect.width) * (max - min) + min)
    onChange(name, Math.min(max, Math.max(min, raw)))
  }

  const handleChange = (e) => {
    onChange(name, Number(e.target.value))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.track} ref={trackRef} onClick={handleTrackClick}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
        <motion.div
          className={styles.thumb}
          style={{ left: `${pct}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 380, damping: 20 }}
        >
          <span className={styles.thumbValue}>{value}</span>
        </motion.div>
        {/* Native range behind for keyboard / a11y */}
        <input
          type="range" min={min} max={max}
          value={value}
          onChange={handleChange}
          className={styles.nativeRange}
          aria-label={`${leftLabel} to ${rightLabel}`}
        />
      </div>
      <div className={styles.labels}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}
