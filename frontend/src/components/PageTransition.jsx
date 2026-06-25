import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './PageTransition.module.css'

const COLS = 20
const ROWS = 20
const TOTAL = COLS * ROWS

/*
  Phase timing (ms):
    0 → COVERING  : tiles fly in, obscuring the screen
    1 → HOLD      : brief full-cover pause while child swaps
    2 → REVEALING : tiles dissolve away revealing new page
    3 → IDLE      : overlay unmounted, child fully visible
*/
const T_COVER   = 520   // duration of cover animation
const T_HOLD    = 80    // pause at full cover (child renders beneath)
const T_REVEAL  = 520   // duration of reveal animation
const MAX_STAGGER = 300 // max random per-tile delay spread (ms)

/* Build a shuffled array of per-tile delays so every tile
   appears at a different time — gives the "disintegrating" look */
function makeDelays(maxDelay) {
  const delays = Array.from({ length: TOTAL }, (_, i) => {
    // slight cluster bias: tiles closer to center arrive earlier
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const cx  = (col / (COLS - 1) - 0.5) * 2   // -1..1
    const cy  = (row / (ROWS - 1) - 0.5) * 2
    const dist = Math.sqrt(cx * cx + cy * cy) / Math.SQRT2  // 0..1, edge=1
    // combine distance-based bias with randomness
    const base  = dist * maxDelay * 0.4
    const noise = Math.random() * maxDelay * 0.6
    return Math.round(base + noise)
  })
  // Shuffle additionally to break the radial pattern
  for (let i = delays.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[delays[i], delays[j]] = [delays[j], delays[i]]
  }
  return delays
}

export default function PageTransition({ step, children }) {
  const [phase, setPhase]           = useState('idle')       // idle | covering | hold | revealing
  const [displayedChild, setDisplayedChild] = useState(children)
  const [coverDelays]               = useState(() => makeDelays(MAX_STAGGER))
  const [revealDelays, setRevealDelays]     = useState(() => makeDelays(MAX_STAGGER))
  const prevStep = useRef(step)
  const timerRef = useRef([])

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
  }

  const after = (ms, fn) => {
    const t = setTimeout(fn, ms)
    timerRef.current.push(t)
    return t
  }

  const runTransition = useCallback((newChildren) => {
    clearTimers()

    // 1. Start covering
    setPhase('covering')

    // 2. At peak cover: swap the child + generate fresh reveal delays
    after(T_COVER + T_HOLD, () => {
      setDisplayedChild(newChildren)
      setRevealDelays(makeDelays(MAX_STAGGER))
      setPhase('revealing')
    })

    // 3. Reveal done → idle
    after(T_COVER + T_HOLD + T_REVEAL + MAX_STAGGER + 60, () => {
      setPhase('idle')
    })
  }, [])

  useEffect(() => {
    if (step !== prevStep.current) {
      prevStep.current = step
      runTransition(children)
    } else {
      // same step but children identity changed (shouldn't normally happen)
      setDisplayedChild(children)
    }
  }, [step, children, runTransition])

  // Cleanup on unmount
  useEffect(() => clearTimers, [])

  const overlayActive = phase === 'covering' || phase === 'hold' || phase === 'revealing'

  return (
    <div className={styles.root}>
      {/* The actual page content */}
      <div
        className={`${styles.content} ${phase === 'covering' ? styles.contentDim : ''}`}
        aria-live="polite"
      >
        {displayedChild}
      </div>

      {/* Mosaic overlay — only rendered when active */}
      {overlayActive && (
        <div
          className={styles.overlay}
          aria-hidden="true"
        >
          <div className={styles.grid}>
            {Array.from({ length: TOTAL }, (_, i) => {
              const isRevealing = phase === 'revealing'
              const delay       = isRevealing ? revealDelays[i] : coverDelays[i]

              return (
                <div
                  key={i}
                  className={`${styles.tile} ${isRevealing ? styles.tileOut : styles.tileIn}`}
                  style={{ animationDelay: `${delay}ms` }}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
