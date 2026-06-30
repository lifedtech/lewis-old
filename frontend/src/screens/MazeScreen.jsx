import React, { useState, useEffect, useCallback } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'

// Randomized Prim's/DFS Algorithm to generate a perfect maze
function generateMaze(width, height) {
  const maze = Array(height).fill().map(() => Array(width).fill(1))
  
  function carve(r, c) {
    maze[r][c] = 0
    const dirs = [ [-2, 0], [0, 2], [2, 0], [0, -2] ]
    // Randomize directions for procedural generation
    dirs.sort(() => Math.random() - 0.5)
    
    for (let [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr > 0 && nr < height - 1 && nc > 0 && nc < width - 1 && maze[nr][nc] === 1) {
        maze[r + dr / 2][c + dc / 2] = 0 // knock down wall between
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
  
  const [maze, setMaze] = useState([])
  const [pos, setPos] = useState({ r: 1, c: 1 })
  const [won, setWon] = useState(false)

  // Generate a new maze on mount (satisfying "on each refresh")
  useEffect(() => {
    setMaze(generateMaze(WIDTH, HEIGHT))
    setPos({ r: 1, c: 1 })
    setWon(false)
  }, [])

  const move = useCallback((dr, dc) => {
    if (won) return
    setPos(prev => {
      const nr = prev.r + dr
      const nc = prev.c + dc
      // Collision detection: ensure we stay in bounds and don't hit walls (1)
      if (nr >= 0 && nr < HEIGHT && nc >= 0 && nc < WIDTH && maze[nr][nc] === 0) {
        if (nr === HEIGHT - 2 && nc === WIDTH - 2) {
          setWon(true)
        }
        return { r: nr, c: nc }
      }
      return prev
    })
  }, [maze, won])

  // Keyboard Event Listeners for Desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling when using arrow keys
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
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <h1 className="headline" style={{ fontSize: '24px', marginBottom: '8px' }}>Navigate your thoughts</h1>
      <p className="sub" style={{ marginBottom: '24px' }}>Find the exit to reveal the mirror.</p>

      {/* Maze Renderer */}
      <div 
        className="maze-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
          gap: '2px',
          background: 'rgba(20, 17, 31, 0.5)',
          padding: '8px',
          borderRadius: '16px',
          border: '1px solid rgba(246, 240, 230, 0.09)',
          boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.55)'
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
                  width: '18px', height: '18px',
                  backgroundColor: isPlayer ? '#FF9466' : isTarget ? '#8FBFA0' : cell === 1 ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderRadius: isPlayer || isTarget ? '50%' : '4px',
                  boxShadow: isPlayer ? '0 0 14px rgba(255,148,102,0.8)' : isTarget ? '0 0 14px rgba(143,191,160,0.8)' : 'none',
                  transition: 'background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
                  transform: isPlayer ? 'scale(1.15)' : 'scale(1)'
                }}
              />
            )
          })
        ))}
      </div>

      {/* On-screen D-Pad Controls for Mobile */}
      <div className="dpad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '32px' }}>
        <button className="dpad-btn" onClick={() => move(-1, 0)}>▲</button>
        <div style={{ display: 'flex', gap: '38px' }}>
          <button className="dpad-btn" onClick={() => move(0, -1)}>◀</button>
          <button className="dpad-btn" onClick={() => move(0, 1)}>▶</button>
        </div>
        <button className="dpad-btn" onClick={() => move(1, 0)}>▼</button>
      </div>

      {won && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'absolute', bottom: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <button 
            className="btn-primary" 
            onClick={() => setScreen('mirror')}
            style={{ minWidth: '280px', boxShadow: '0 0 40px rgba(143,191,160,0.4)' }}
          >
            See the Mirror
          </button>
        </motion.div>
      )}

    </motion.section>
  )
}
