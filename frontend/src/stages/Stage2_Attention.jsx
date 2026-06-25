/**
 * Stage 2 — Attention Drift Task
 * 45-second canvas: follow the gently drifting pulsing dot.
 * Logs precision silently (distance from dot center when tapping).
 */
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import styles from './Stage2_Attention.module.css'

const DURATION = 45  // seconds

export default function Stage2_Attention() {
  const { setAttentionData, nextStage, prevStage } = useLewisStore()
  const [phase, setPhase] = useState('intro')  // intro | running | done
  const start = () => {
    setPhase('running')
  }

  const handleFinish = (data) => {
    setAttentionData(data)
    setPhase('done')
  }

  return (
    <StageShell stage={2}
      title={phase === 'intro' ? 'Attention & focus' : null}
      subtitle={phase === 'intro' ? 'A gentle 45-second focus exercise. Follow the dot with your eyes.' : null}
      noPad={phase === 'running' || phase === 'done'}
    >
      <AnimatePresence mode="wait">

        {phase === 'intro' && (
          <motion.div key="intro"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            className={styles.intro}
          >
            <div className={styles.introIcon}>👁</div>
            <p className={styles.introText}>
              A softly moving dot will appear. Just follow it with your eyes — or tap it if you like.
              There's nothing to get right. This runs silently in the background.
            </p>
            <motion.button className={styles.startBtn} onClick={start}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              Start →
            </motion.button>
            <button className={styles.skipBtn} onClick={() => { setAttentionData(null); nextStage() }}>
              Skip this exercise
            </button>
          </motion.div>
        )}

        {phase === 'running' && (
          <AttentionCanvas key="running" onFinish={handleFinish} />
        )}

        {phase === 'done' && (
          <motion.div key="done" className={styles.done}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className={styles.doneIcon}>✓</div>
            <h3>Nicely done</h3>
            <p>That took focus. Take a breath before moving on.</p>
            <motion.button className={styles.startBtn} onClick={nextStage}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              Continue →
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </StageShell>
  )
}

function AttentionCanvas({ onFinish }) {
  const canvasRef = useRef(null)
  const stateRef  = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0, t: 0, taps: [], running: true })
  const frameRef  = useRef(null)
  const [elapsed, setElapsed] = useState(0)

  // Sync canvas pixel size to its CSS display size
  const syncCanvasSize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1
    const w    = Math.round(rect.width  * dpr)
    const h    = Math.round(rect.height * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w
      canvas.height = h
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const s = stateRef.current
    s.running = true
    s.vx = (Math.random() - 0.5) * 0.003
    s.vy = (Math.random() - 0.5) * 0.003

    // Give the DOM one frame to lay out before we grab dimensions
    const startRaf = requestAnimationFrame(() => {
      syncCanvasSize()
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      let last  = performance.now()

      const draw = (now) => {
        syncCanvasSize()
        const dt = (now - last) / 1000
        last = now
        if (!s.running) return

        s.t  += dt
        s.x  += s.vx + Math.sin(s.t * 0.4) * 0.0008
        s.y  += s.vy + Math.cos(s.t * 0.3) * 0.0007
        // Bounce off walls softly
        if (s.x < 0.1 || s.x > 0.9) s.vx *= -1
        if (s.y < 0.15 || s.y > 0.85) s.vy *= -1
        s.x = Math.max(0.08, Math.min(0.92, s.x))
        s.y = Math.max(0.12, Math.min(0.88, s.y))

        const W  = canvas.width
        const H  = canvas.height
        const cx = s.x * W
        const cy = s.y * H
        const pulse = (18 + Math.sin(s.t * 2.5) * 5) * dpr

        ctx.clearRect(0, 0, W, H)

        // Outer glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulse * 2.5)
        grd.addColorStop(0, 'rgba(0,176,155,0.22)')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, pulse * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(cx, cy, pulse, 0, Math.PI * 2)
        ctx.fillStyle = '#00B09B'
        ctx.fill()

        // Inner white highlight
        ctx.beginPath()
        ctx.arc(cx, cy, pulse * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.fill()

        setElapsed(Math.min(Math.floor(s.t), DURATION))
        if (s.t >= DURATION) {
          s.running = false
          onFinish({ taps: s.taps, duration: s.t })
          return
        }
        frameRef.current = requestAnimationFrame(draw)
      }
      frameRef.current = requestAnimationFrame(draw)
    })

    return () => {
      s.running = false
      cancelAnimationFrame(startRaf)
      cancelAnimationFrame(frameRef.current)
    }
  }, [onFinish])

  const handleTap = (e) => {
    const s = stateRef.current
    if (!s.running) return
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    // Normalize to 0–1 using the CSS display size (not the pixel buffer size)
    const tx = (e.clientX - rect.left)  / rect.width
    const ty = (e.clientY - rect.top)   / rect.height
    const dist = Math.hypot(tx - s.x, ty - s.y)
    s.taps.push({ t: s.t, dist })
  }

  return (
    <motion.div className={styles.canvasWrap}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={styles.timer} aria-live="polite" aria-atomic="true">
        {DURATION - elapsed}s
      </div>
      <div className={styles.timerBar}>
        <div className={styles.timerFill} style={{ width: `${(elapsed / DURATION) * 100}%` }} />
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={handleTap}
        aria-label="Follow the dot"
      />
    </motion.div>
  )
}
