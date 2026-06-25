/**
 * Stage 3 — Somatic & Affect Tasks
 * 3.1 Affect Canvas (2D valence × arousal)
 * 3.2 Body Map (5 selectable zones)
 * 3.4 Breathing Visualizer (60s) with pre/post tension rating
 */
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import NavRow from '../components/NavRow.jsx'
import styles from './Stage3_Somatic.module.css'

const BODY_ZONES = [
  { id: 'head',       label: 'Head & Neck',    top: '4%',   left: '38%', w: 24, h: 24 },
  { id: 'chest',      label: 'Chest',          top: '28%',  left: '34%', w: 32, h: 22 },
  { id: 'stomach',    label: 'Stomach',        top: '46%',  left: '35%', w: 30, h: 18 },
  { id: 'shoulders',  label: 'Shoulders/Back', top: '24%',  left: '14%', w: 72, h: 16 },
  { id: 'limbs',      label: 'Limbs',          top: '62%',  left: '28%', w: 44, h: 24 },
]

const BREATH_DURATION = 60 // seconds
const INHALE = 4, HOLD = 4, EXHALE = 4 // box breathing

export default function Stage3_Somatic() {
  const { setAffectPoint, setBodyZones: storeSetBodyZones, setBreathingPre, setBreathingPost, nextStage, prevStage } = useLewisStore()
  const [screen, setScreen] = useState('affect')

  // 3.1 Affect Canvas
  const [affectPt, setAffectPt]   = useState(null)
  const canvasRef = useRef(null)
  const handleAffectClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width)  * 2 - 1   // -1..1
    const y = -((e.clientY - rect.top)  / rect.height) * 2 + 1  // -1..1 (y flipped)
    setAffectPt({ x, y })
  }

  // 3.2 Body Map
  const [zones, setZones] = useState([])
  const toggleZone = (id) => {
    setZones(prev => prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id])
  }

  // 3.4 Breathing
  const [breathPre,  setBreathPre]  = useState(null)
  const [breathPost, setBreathPost] = useState(null)
  const [breathing,  setBreathing]  = useState(false)
  const [breathDone, setBreathDone] = useState(false)
  const [breathElapsed, setBreathElapsed] = useState(0)
  const [breathPhase, setBreathPhase] = useState('inhale')
  const breathRef = useRef(null)

  useEffect(() => {
    if (!breathing) return
    let t = 0
    const tick = setInterval(() => {
      t++
      setBreathElapsed(t)
      const cycle = t % (INHALE + HOLD + EXHALE + HOLD)
      if      (cycle < INHALE)                   setBreathPhase('inhale')
      else if (cycle < INHALE + HOLD)            setBreathPhase('hold')
      else if (cycle < INHALE + HOLD + EXHALE)   setBreathPhase('exhale')
      else                                       setBreathPhase('hold')
      if (t >= BREATH_DURATION) {
        clearInterval(tick)
        setBreathing(false)
        setBreathDone(true)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [breathing])

  const handleDone = () => {
    setAffectPoint(affectPt)
    storeSetBodyZones(zones)
    setBreathingPre(breathPre)
    setBreathingPost(breathPost)
    nextStage()
  }

  const phase3Scale = { inhale: 1.35, hold: 1.35, exhale: 0.75 }
  const breathLabel = { inhale: 'Breathe in…', hold: 'Hold…', exhale: 'Breathe out…' }

  return (
    <StageShell stage={3}>
      <AnimatePresence mode="wait">

        {/* ── 3.1 Affect Canvas ─────────────────────────────── */}
        {screen === 'affect' && (
          <motion.div key="affect"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>How you're feeling right now</h2>
            <p className={styles.sub}>Tap anywhere on the grid to mark your current feeling.</p>

            <div className={styles.affectWrap}
              onClick={handleAffectClick}
              role="application"
              aria-label="Affect grid. X-axis: unpleasant to pleasant. Y-axis: calm to activated."
              tabIndex={0}
            >
              {/* Axis labels */}
              <span className={styles.axTop}>Activated</span>
              <span className={styles.axBottom}>Calm</span>
              <span className={styles.axLeft}>Unpleasant</span>
              <span className={styles.axRight}>Pleasant</span>
              {/* Crosshairs */}
              <div className={styles.axH} aria-hidden="true" />
              <div className={styles.axV} aria-hidden="true" />
              {/* Quadrant labels */}
              <span className={styles.q1}>Anxious</span>
              <span className={styles.q2}>Excited</span>
              <span className={styles.q3}>Depressed</span>
              <span className={styles.q4}>Content</span>
              {/* Marker */}
              {affectPt && (
                <motion.div
                  className={styles.marker}
                  style={{
                    left: `${((affectPt.x + 1) / 2) * 100}%`,
                    top:  `${((1 - affectPt.y) / 2) * 100}%`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  aria-label={`Feeling marked at x: ${affectPt.x.toFixed(2)}, y: ${affectPt.y.toFixed(2)}`}
                />
              )}
            </div>

            <NavRow onBack={prevStage} onNext={() => setScreen('body')}
              nextDisabled={!affectPt} />
          </motion.div>
        )}

        {/* ── 3.2 Body Map ──────────────────────────────────── */}
        {screen === 'body' && (
          <motion.div key="body"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>Where do you feel it in your body?</h2>
            <p className={styles.sub}>Tap the areas where you notice tension, discomfort, or sensation. Select all that apply.</p>

            <div className={styles.bodyMapWrap} role="group" aria-label="Body map">
              {/* Silhouette SVG */}
              <svg className={styles.silhouette} viewBox="0 0 100 200" aria-hidden="true">
                <ellipse cx="50" cy="14" rx="12" ry="13" fill="#e8dcc8" />
                <rect x="33" y="28" width="34" height="38" rx="6" fill="#e8dcc8" />
                <rect x="36" y="68" width="28" height="32" rx="4" fill="#e8dcc8" />
                <rect x="10" y="30" width="22" height="48" rx="8" fill="#e8dcc8" />
                <rect x="68" y="30" width="22" height="48" rx="8" fill="#e8dcc8" />
                <rect x="34" y="102" width="14" height="52" rx="6" fill="#e8dcc8" />
                <rect x="52" y="102" width="14" height="52" rx="6" fill="#e8dcc8" />
              </svg>

              {/* Clickable zones */}
              {BODY_ZONES.map(zone => (
                <button
                  key={zone.id}
                  className={[styles.zoneBtn, zones.includes(zone.id) ? styles.zoneActive : ''].join(' ')}
                  style={{ top: zone.top, left: zone.left, width: `${zone.w}%`, height: `${zone.h}%` }}
                  onClick={() => toggleZone(zone.id)}
                  aria-label={zone.label}
                  aria-pressed={zones.includes(zone.id)}
                />
              ))}
            </div>

            <div className={styles.zoneChips}>
              {zones.length === 0
                ? <span className={styles.noZone}>No areas selected</span>
                : BODY_ZONES.filter(z => zones.includes(z.id)).map(z => (
                    <span key={z.id} className={styles.zoneChip}>{z.label}</span>
                  ))
              }
            </div>

            <NavRow onBack={() => setScreen('affect')} onNext={() => setScreen('breathPre')} />
          </motion.div>
        )}

        {/* ── 3.4a Pre-breathing tension ──────────────────────── */}
        {screen === 'breathPre' && (
          <motion.div key="breathPre"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>Before breathing</h2>
            <p className={styles.sub}>On a scale of 0–10, how much tension are you holding right now?</p>
            <div className={styles.tensionRow}>
              {Array.from({ length: 11 }, (_, i) => (
                <motion.button key={i}
                  className={[styles.tensionBtn, breathPre === i ? styles.tensionActive : ''].join(' ')}
                  onClick={() => setBreathPre(i)}
                  whileTap={{ scale: 0.88 }}
                  aria-label={`Tension level ${i}`} aria-pressed={breathPre === i}
                >
                  {i}
                </motion.button>
              ))}
            </div>
            <NavRow onBack={() => setScreen('body')} onNext={() => setScreen('breathing')}
              nextDisabled={breathPre === null} />
          </motion.div>
        )}

        {/* ── 3.4b Breathing Visualizer ─────────────────────── */}
        {screen === 'breathing' && (
          <motion.div key="breathing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={styles.breathWrap}
          >
            <h2 className={styles.title}>Box Breathing</h2>
            <p className={styles.sub}>Follow the visual. Breathe in — hold — breathe out — hold. 4 counts each.</p>

            {!breathing && !breathDone && (
              <motion.button className={styles.startBtn} onClick={() => setBreathing(true)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                Start breathing exercise
              </motion.button>
            )}

            {breathing && (
              <>
                <motion.div
                  className={styles.breathCircle}
                  animate={{ scale: phase3Scale[breathPhase] || 1 }}
                  transition={{ duration: breathPhase === 'inhale' ? INHALE : breathPhase === 'exhale' ? EXHALE : 0.3, ease: 'easeInOut' }}
                  aria-live="polite" aria-atomic="true"
                >
                  <span className={styles.breathLabel}>{breathLabel[breathPhase]}</span>
                </motion.div>
                <div className={styles.breathTimer}>{BREATH_DURATION - breathElapsed}s</div>
              </>
            )}

            {breathDone && (
              <motion.div className={styles.breathDone}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring' }}>
                <div className={styles.doneCheck}>✓</div>
                <p>Well done. Take a moment to notice how you feel.</p>
              </motion.div>
            )}

            {(breathDone) && (
              <NavRow onBack={() => setScreen('breathPre')} onNext={() => setScreen('breathPost')} />
            )}
          </motion.div>
        )}

        {/* ── 3.4c Post-breathing tension ────────────────────── */}
        {screen === 'breathPost' && (
          <motion.div key="breathPost"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>After the breathing</h2>
            <p className={styles.sub}>How much tension are you holding <em>now</em>?</p>
            <div className={styles.tensionRow}>
              {Array.from({ length: 11 }, (_, i) => (
                <motion.button key={i}
                  className={[styles.tensionBtn, breathPost === i ? styles.tensionActive : ''].join(' ')}
                  onClick={() => setBreathPost(i)}
                  whileTap={{ scale: 0.88 }}
                  aria-label={`Tension level ${i}`} aria-pressed={breathPost === i}
                >
                  {i}
                </motion.button>
              ))}
            </div>
            {breathPost !== null && breathPre !== null && (
              <p className={styles.breathInsight}>
                {breathPost < breathPre
                  ? `That's a ${breathPre - breathPost}-point drop. The body responds.`
                  : breathPost === breathPre
                    ? `Same level — that's okay. Awareness is the first step.`
                    : `Tension can rise when noticed. That's normal.`
                }
              </p>
            )}
            <NavRow onBack={() => setScreen('breathing')} onNext={handleDone}
              nextDisabled={breathPost === null} nextLabel="Continue to Stage 4 →" />
          </motion.div>
        )}

      </AnimatePresence>
    </StageShell>
  )
}
