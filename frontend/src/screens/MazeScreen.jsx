import {  useState, useEffect, useCallback  } from 'react';
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'

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

export default function MazeScreen() {
  const { setScreen } = useLewisStore()
  
  const [maze] = useState(() => generateMaze(WIDTH, HEIGHT))
  const [pos, setPos] = useState({ r: 1, c: 1 })
  const [won, setWon] = useState(false)

  const move = useCallback((dr, dc) => {
    if (won) return
    setPos(prev => {
      const nr = prev.r + dr
      const nc = prev.c + dc
      if (nr >= 0 && nr < HEIGHT && nc >= 0 && nc < WIDTH && maze[nr][nc] === 0) {
        if (nr === HEIGHT - 2 && nc === WIDTH - 2) {
          setWon(true)
        }
        return { r: nr, c: nc }
      }
      return prev
    })
  }, [maze, won])

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
              color: '#16302b',
              whiteSpace: 'nowrap',
            }}>
              Navigate your thoughts
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Use arrow keys or touch buttons to navigate the maze and reach the green exit node.
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
            color: '#94a3b8',
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
            {/* Maze Grid */}
            <div 
              className="maze-grid"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
                gap: '2px',
                background: '#16302b',
                padding: '10px',
                borderRadius: '18px',
                border: '1.5px solid #d2e7e0',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)'
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
                        width: '16px', height: '16px',
                        backgroundColor: isPlayer ? '#FF9466' : isTarget ? '#10B981' : cell === 1 ? 'rgba(255,255,255,0.12)' : 'transparent',
                        borderRadius: isPlayer || isTarget ? '50%' : '3px',
                        boxShadow: isPlayer ? '0 0 12px rgba(255,148,102,0.9)' : isTarget ? '0 0 12px rgba(16,185,129,0.9)' : 'none',
                        transition: 'all 0.15s ease',
                        transform: isPlayer ? 'scale(1.15)' : 'scale(1)'
                      }}
                    />
                  )
                })
              ))}
            </div>

            {/* On-screen D-Pad Controls for Mobile/Touch */}
            <div className="dpad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <button className="dpad-btn" onClick={() => move(-1, 0)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #d2e7e0', background: '#ffffff', cursor: 'pointer' }}>▲</button>
              <div style={{ display: 'flex', gap: '24px' }}>
                <button className="dpad-btn" onClick={() => move(0, -1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #d2e7e0', background: '#ffffff', cursor: 'pointer' }}>◀</button>
                <button className="dpad-btn" onClick={() => move(0, 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #d2e7e0', background: '#ffffff', cursor: 'pointer' }}>▶</button>
              </div>
              <button className="dpad-btn" onClick={() => move(1, 0)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #d2e7e0', background: '#ffffff', cursor: 'pointer' }}>▼</button>
            </div>
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button 
              className="btn-primary" 
              onClick={() => setScreen('mirror')}
              disabled={!won}
              style={{
                padding: '10px 36px',
                opacity: won ? 1 : 0.5,
                cursor: won ? 'pointer' : 'not-allowed',
              }}
            >
              {won ? 'See the Mirror' : 'Reach the Exit...'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
