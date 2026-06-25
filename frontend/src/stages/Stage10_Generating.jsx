/**
 * Stage 10 — Generating Moment
 * Full-screen animated transition with 7 sequential phrases,
 * soft ascending audio tones via Web Audio API, then routes to Results.
 */
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import styles from './Stage10_Generating.module.css'

const PHRASES = [
  { text: 'Reading your reflections…',        icon: '📖', delay: 0 },
  { text: 'Mapping your emotional landscape…', icon: '🗺', delay: 1.6 },
  { text: 'Analysing patterns over time…',     icon: '🔬', delay: 3.2 },
  { text: 'Weighing your strengths…',          icon: '⚖️', delay: 4.8 },
  { text: 'Building your insight report…',     icon: '✨', delay: 6.4 },
  { text: 'Personalising your recommendations…', icon: '🌱', delay: 8.0 },
  { text: 'Almost ready…',                     icon: '🌿', delay: 9.6 },
]

const TOTAL_MS = 12000 // advance to results after 12s

/** Play a soft ascending tone via Web Audio */
function playTone(ctx, freq, startTime, duration = 0.6) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export default function Stage10_Generating() {
  const { goToStage } = useLewisStore()
  const [visibleIdx, setVisibleIdx] = useState(-1)
  const ctxRef = useRef(null)

  useEffect(() => {
    // Web Audio ascending scale
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ctxRef.current = ctx
      const scale = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88]
      PHRASES.forEach((p, i) => {
        const t = ctx.currentTime + p.delay + 0.15
        playTone(ctx, scale[i], t)
        // slight chord colour
        playTone(ctx, scale[i] * 1.498, t + 0.06, 0.45)
      })
    } catch { /* audio not available — degrade gracefully */ }

    // Reveal phrases one by one
    const timers = PHRASES.map((p, i) =>
      setTimeout(() => setVisibleIdx(i), p.delay * 1000)
    )

    // Advance to Results (stage 11) after total
    const done = setTimeout(() => goToStage(11), TOTAL_MS)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
      try { ctxRef.current?.close() } catch {}
    }
  }, [goToStage])

  return (
    <div className={styles.wrap}>
      {/* Ambient pulsing circle */}
      <div className={styles.orb} aria-hidden="true">
        {[0, 1, 2].map(i => (
          <div key={i} className={styles.orbRing} style={{ '--delay': `${i * 1.1}s` }} />
        ))}
        <div className={styles.orbCore} />
      </div>

      {/* Phrase stream */}
      <ul className={styles.phrases} aria-live="polite" aria-label="Generating your report">
        {PHRASES.map((p, i) => (
          <AnimatePresence key={i}>
            {visibleIdx >= i && (
              <motion.li
                className={[styles.phrase, i === visibleIdx ? styles.phraseActive : styles.phraseDone].join(' ')}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: i === visibleIdx ? 1 : 0.38, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={styles.phraseIcon} aria-hidden="true">{p.icon}</span>
                <span>{p.text}</span>
              </motion.li>
            )}
          </AnimatePresence>
        ))}
      </ul>

      {/* Loading bar */}
      <div className={styles.barWrap} role="progressbar" aria-label="Generating report">
        <motion.div
          className={styles.barFill}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: TOTAL_MS / 1000, ease: 'linear' }}
        />
      </div>

      <p className={styles.note}>This usually takes about 10 seconds.</p>
    </div>
  )
}
