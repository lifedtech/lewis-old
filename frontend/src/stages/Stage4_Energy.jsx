/**
 * Stage 4 — Energy Maze
 * 60-second spatial puzzle (3 levels). Canvas-based, optional audio cue.
 */
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import styles from './Stage4_Energy.module.css'

// Simple maze structures per level [rows of strings: '.' = open, '#' = wall, 'S' = start, 'E' = end]
const MAZES = [
  // Level 1 — easy (8×8)
  ['S.......','........','..####..','..#.....','..#.###.','....#.E.','........','........'],
  // Level 2 — moderate (8×8)
  ['S.#.....','..#.###.','..#...#.','..###.#.','......#.','####..#.','......#.','......E.'],
  // Level 3 — harder (10×10)
  ['S.......#.','..#####.#.','..#.....#.','..#.###.#.','..#.#.#...','..#.#.###.','..#.#...#.','..###.#.#.','........#.','########E.'],
]

const CELL = 40
const DURATION = 60

function parseMaze(rows) {
  const cells = []
  rows.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      cells.push({ r, c, type: ch })
    })
  )
  const cols = rows[0].length
  const rowCount = rows.length
  const start = cells.find(c => c.type === 'S')
  const end   = cells.find(c => c.type === 'E')
  return { cells, cols, rowCount, start, end }
}

export default function Stage4_Energy() {
  const { setMazeDuration, nextStage, prevStage } = useLewisStore()
  const [phase,    setPhase]   = useState('intro')
  const [level,    setLevel]   = useState(0)
  const [elapsed,  setElapsed] = useState(0)
  const [solved,   setSolved]  = useState(false)
  const [pos,      setPos]     = useState({ r: 0, c: 0 })
  const startMs = useRef(0)

  const maze = parseMaze(MAZES[Math.min(level, MAZES.length - 1)])

  // Reset position when level changes
  useEffect(() => {
    setPos({ r: maze.start.r, c: maze.start.c })
  }, [level, maze.start.r, maze.start.c])

  const startMaze = () => {
    startMs.current = Date.now()
    setPhase('playing')
  }

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || solved) return
    const t = setInterval(() => {
      const e = Math.floor((Date.now() - startMs.current) / 1000)
      setElapsed(Math.min(e, DURATION))
      if (e >= DURATION) {
        clearInterval(t)
        setMazeDuration(Date.now() - startMs.current)
        setPhase('done')
      }
    }, 1000)
    return () => clearInterval(t)
  }, [phase, solved, setMazeDuration])

  const move = (dr, dc) => {
    if (solved) return // Block moves while transitioning
    setPos(prev => {
      const nr = prev.r + dr, nc = prev.c + dc
      const cell = maze.cells.find(x => x.r === nr && x.c === nc)
      if (!cell || cell.type === '#') return prev // Hit wall
      
      if (cell.type === 'E') {
        setMazeDuration(Date.now() - startMs.current)
        setSolved(true)
        if (level < MAZES.length - 1) {
          setTimeout(() => { 
             setLevel(l => l + 1)
             setSolved(false)
          }, 800)
        } else {
          setTimeout(() => setPhase('done'), 800)
        }
      }
      return { r: nr, c: nc }
    })
  }

  // Keyboard
  useEffect(() => {
    if (phase !== 'playing' || solved) return
    const handler = (e) => {
      if (['ArrowUp','w'].includes(e.key)) move(-1, 0)
      if (['ArrowDown','s'].includes(e.key)) move(1, 0)
      if (['ArrowLeft','a'].includes(e.key)) move(0, -1)
      if (['ArrowRight','d'].includes(e.key)) move(0, 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, solved]) // Add solved to dependencies so handler refreshes

  return (
    <StageShell stage={4}>
      <AnimatePresence mode="wait">

        {phase === 'intro' && (
          <motion.div key="intro" className={styles.intro}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}>
            <div className={styles.icon}>⚡</div>
            <h2 className={styles.title}>Energy Maze</h2>
            <p className={styles.desc}>
              Navigate the maze using arrow keys (or the buttons below on mobile).
              The maze gently scales in complexity. Take your time — there's no penalty for slowness.
            </p>
            <motion.button className={styles.startBtn} onClick={startMaze}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              Start maze
            </motion.button>
            <button className={styles.skipBtn} onClick={() => { setMazeDuration(null); nextStage() }}>
              Skip this exercise
            </button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div key="playing" className={styles.playing}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.hud}>
              <span className={styles.levelBadge}>Level {level + 1}</span>
              <span className={styles.timerTxt}>{DURATION - elapsed}s</span>
              {solved && <span className={styles.solvedBadge}>✓ Solved!</span>}
            </div>
            <div className={styles.timerBar}>
              <div className={styles.timerFill} style={{ width: `${(elapsed / DURATION) * 100}%` }} />
            </div>
            
            <div className={styles.canvasScroll} tabIndex={0}>
              <div 
                className={styles.mazeContainer} 
                style={{ width: maze.cols * CELL, height: maze.rowCount * CELL }}
                aria-label={`Maze level ${level + 1}`}
              >
                {maze.cells.map((cell, i) => (
                  <div 
                    key={i} 
                    className={`${styles.cell} ${cell.type === '#' ? styles.wall : ''} ${cell.type === 'E' ? styles.end : ''}`}
                    style={{ left: cell.c * CELL, top: cell.r * CELL, width: CELL, height: CELL }}
                  >
                    {cell.type === 'E' && '🏁'}
                  </div>
                ))}
                <motion.div 
                  className={styles.player}
                  animate={{ x: pos.c * CELL, y: pos.r * CELL }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>

            {/* Mobile dpad */}
            <div className={styles.dpad} role="group" aria-label="Direction controls">
              <button className={styles.dpadBtn} style={{ gridArea: 'up' }}
                onClick={() => move(-1,0)} aria-label="Move up">↑</button>
              <button className={styles.dpadBtn} style={{ gridArea: 'left' }}
                onClick={() => move(0,-1)} aria-label="Move left">←</button>
              <button className={styles.dpadBtn} style={{ gridArea: 'right' }}
                onClick={() => move(0,1)} aria-label="Move right">→</button>
              <button className={styles.dpadBtn} style={{ gridArea: 'down' }}
                onClick={() => move(1,0)} aria-label="Move down">↓</button>
            </div>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div key="done" className={styles.done}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.doneIcon}>⚡</div>
            <h3>That's the maze done</h3>
            <p>Your energy and focus data has been noted.</p>
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
