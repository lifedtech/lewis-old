import { useEffect, useRef } from 'react'
import styles from './AmbientBackground.module.css'

/* Floating organic orbs — pure CSS-animated, no canvas */
const ORBS = [
  { size: 420, x: -8, y: -10, delay: 0, dur: 28, color: 'rgba(125,184,122,0.13)' },
  { size: 320, x: 65, y: 5, delay: 6, dur: 34, color: 'rgba(168,213,162,0.10)' },
  { size: 260, x: 15, y: 60, delay: 3, dur: 22, color: 'rgba(178,223,219,0.12)' },
  { size: 380, x: 75, y: 55, delay: 10, dur: 30, color: 'rgba(91,158,148,0.09)' },
  { size: 200, x: 40, y: 30, delay: 14, dur: 18, color: 'rgba(125,184,122,0.08)' },
  { size: 290, x: 5, y: 80, delay: 7, dur: 26, color: 'rgba(212,232,194,0.14)' },
  { size: 180, x: 85, y: 20, delay: 18, dur: 20, color: 'rgba(149,199,143,0.10)' },
]

export default function AmbientBackground() {
  return (
    <div className={styles.bg} aria-hidden="true">
      {/* Gradient base */}
      <div className={styles.base} />

      {/* Floating orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className={styles.orb}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.dur}s`,
          }}
        />
      ))}


    </div>
  )
}
