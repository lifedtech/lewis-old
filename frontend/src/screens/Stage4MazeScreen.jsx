import {  useState, useEffect, useCallback, useRef  } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

// Randomized Prim's/DFS Algorithm to generate a perfect maze
function generateMaze(width, height) {
  const maze = Array(height).fill().map(() => Array(width).fill(1))

  function carve(r, c) {
    maze[r][c] = 0
    const dirs = [ [-2, 0], [0, 2], [2, 0], [0, -2] ]
    dirs.sort(() => Math.random() - 0.5)

    for (let [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr > 0 && nr < height - 1 && nc > 0 && nc < width - 1 && maze[nr][nc] === 1) {
        maze[r + dr / 2][c + dc / 2] = 0
        carve(nr, nc)
      }
    }
  }

  carve(1, 1)
  return maze
}

const WIDTH = 15
const HEIGHT = 15

export default function Stage4MazeScreen() {
  const { setScreen, setProfileField } = useLewisStore()

  const [maze] = useState(() => generateMaze(WIDTH, HEIGHT))
  const [pos, setPos] = useState({ r: 1, c: 1 })
  const [won, setWon] = useState(false)
  const startTimeRef = useRef(null)

  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])

  const move = useCallback((dr, dc) => {
    if (won) return
    setPos(prev => {
      const nr = prev.r + dr
      const nc = prev.c + dc
      if (nr >= 0 && nr < HEIGHT && nc >= 0 && nc < WIDTH && maze[nr][nc] === 0) {
        if (nr === HEIGHT - 2 && nc === WIDTH - 2) {
          setWon(true)
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setProfileField('mazeCompletionTime', elapsed)
        }
        return { r: nr, c: nc }
      }
      return prev
    })
  }, [maze, won, setProfileField])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
      if(e.key === 'ArrowUp') move(-1, 0)
      if(e.key === 'ArrowDown') move(1, 0)
      if(e.key === 'ArrowLeft') move(0, -1)
      if(e.key === 'ArrowRight') move(0, 1)
    }
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  const handleNext = () => {
    setScreen('stage5_1Landscape')
  }

  if (!maze.length) return null

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 52px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle (No Illustration) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              MINDFUL MAZE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              whiteSpace: 'nowrap',
            }}>
              Navigate your thoughts
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Find the exit to reveal the landscape. Use arrow keys or touch buttons to navigate.
            </p>
          </div>
        </div>

        {/* RIGHT — PROCEDURAL MAZE Eyebrow + Maze Canvas + D-Pad + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 14px 0',
            width: '100%',
          }}>
            PROCEDURAL MAZE
          </p>

          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            boxSizing: 'border-box',
          }}>
            {/* Maze Grid Board Container */}
            <div
              className="maze-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
                gap: '2px',
                background: '#f2f9f6',
                padding: '10px',
                borderRadius: '20px',
                border: '1.5px solid #d2e7e0',
                boxShadow: '0 8px 24px rgba(0,174,157,0.08)',
                width: '100%',
                maxWidth: '240px',
                aspectRatio: '1/1',
                margin: '0 auto',
              }}
            >
              {maze.map((row, r) => (
                row.map((cell, c) => {
                  const isPlayer = r === pos.r && c === pos.c
                  const isTarget = r === HEIGHT - 2 && c === WIDTH - 2

                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{
                        position: 'relative',
                        backgroundColor: isPlayer ? '#00ae9d' : isTarget ? '#00ae9d' : cell === 1 ? '#c2e5dc' : 'transparent',
                        borderRadius: isPlayer || isTarget ? '50%' : '3px',
                        boxShadow: isPlayer ? '0 0 10px rgba(0,174,157,0.6)' : isTarget ? '0 0 10px rgba(16,185,129,0.6)' : 'none',
                        transition: 'background-color 0.2s ease, transform 0.15s ease',
                        transform: isPlayer ? 'scale(1.2)' : isTarget ? 'scale(1.1)' : 'scale(1)',
                        zIndex: isPlayer || isTarget ? 10 : 1
                      }}
                    >
                      {won && isTarget && (
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <motion.div
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              border: '2px solid #00ae9d',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })
              ))}
            </div>

            {/* On-screen D-Pad Controls for Mobile/Touch */}
            <div className="dpad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <button className="dpad-btn" onClick={() => move(-1, 0)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #d2e7e0', background: '#f2f9f6', color: '#414242', fontWeight: 700, cursor: 'pointer' }}>▲</button>
              <div style={{ display: 'flex', gap: '24px' }}>
                <button className="dpad-btn" onClick={() => move(0, -1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #d2e7e0', background: '#f2f9f6', color: '#414242', fontWeight: 700, cursor: 'pointer' }}>◀</button>
                <button className="dpad-btn" onClick={() => move(0, 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #d2e7e0', background: '#f2f9f6', color: '#414242', fontWeight: 700, cursor: 'pointer' }}>▶</button>
              </div>
              <button className="dpad-btn" onClick={() => move(1, 0)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #d2e7e0', background: '#f2f9f6', color: '#414242', fontWeight: 700, cursor: 'pointer' }}>▼</button>
            </div>
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!won}
              style={{
                padding: '10px 36px',
                opacity: won ? 1 : 0.5,
                cursor: won ? 'pointer' : 'not-allowed',
              }}
            >
              {won ? 'Continue' : 'Reach the Exit...'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
