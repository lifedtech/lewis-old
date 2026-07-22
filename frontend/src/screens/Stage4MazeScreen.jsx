import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

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

export default function Stage4MazeScreen() {
  const { setScreen, setProfileField } = useLewisStore()
  
  const [maze, setMaze] = useState([])
  const [pos, setPos] = useState({ r: 1, c: 1 })
  const [won, setWon] = useState(false)
  const startTimeRef = useRef(null)

  // Generate a new maze on mount
  useEffect(() => {
    setMaze(generateMaze(WIDTH, HEIGHT))
    setPos({ r: 1, c: 1 })
    setWon(false)
    startTimeRef.current = Date.now()
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
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setProfileField('mazeCompletionTime', elapsed)
        }
        return { r: nr, c: nc }
      }
      return prev
    })
  }, [maze, won, setProfileField])

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

  const handleNext = () => {
    setScreen('stage5_1Landscape')
  }

  if (!maze.length) return null

  return (
    <motion.div 
      className="screen-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
        <h1 className="headline" style={{ marginBottom: '16px' }}>Navigate your thoughts</h1>
        <p className="sub" style={{ marginBottom: '24px' }}>Find the exit to reveal the landscape.</p>

        <div style={{ gridArea: 'form', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%' }}>
          {/* Maze Renderer */}
          <div 
            className="maze-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
              gap: '2px',
              background: '#ffffff',
              padding: '12px',
              borderRadius: '24px',
              border: '2px solid var(--dawn-soft)',
              boxShadow: '0 24px 48px -12px var(--dawn-glow)',
              width: '100%',
              maxWidth: '320px',
              aspectRatio: '1/1',
              margin: '0 auto'
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
                      backgroundColor: isPlayer ? 'var(--dawn)' : isTarget ? 'var(--sage)' : cell === 1 ? 'var(--dawn-soft)' : 'transparent',
                      borderRadius: isPlayer || isTarget ? '50%' : '6px',
                      boxShadow: isPlayer ? '0 0 16px rgba(0,174,157,0.6)' : isTarget ? '0 0 16px rgba(95,187,70,0.6)' : 'none',
                      transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
                      transform: isPlayer ? 'scale(1.2)' : isTarget ? 'scale(1.1)' : 'scale(1)',
                      zIndex: isPlayer || isTarget ? 10 : 1
                    }}
                  >
                    {won && isTarget && (
                      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {Array.from({ length: 12 }).map((_, i) => {
                          const angle = (i / 12) * Math.PI * 2
                          const tx = Math.cos(angle) * 80
                          const ty = Math.sin(angle) * 80
                          return (
                            <motion.div
                              key={i}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                              animate={{ x: tx, y: ty, opacity: 0, scale: 1.5 }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              style={{
                                position: 'absolute',
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                background: i % 2 === 0 ? 'var(--dawn)' : 'var(--sage)',
                                boxShadow: i % 2 === 0 ? '0 0 12px var(--dawn)' : '0 0 12px var(--sage)'
                              }}
                            />
                          )
                        })}
                        <motion.div
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ scale: 6, opacity: 0 }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '2px solid var(--dawn)',
                            boxShadow: '0 0 20px var(--dawn)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })
            ))}
          </div>

          {/* On-screen D-Pad Controls or Success Button */}
          {!won ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dpad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button className="dpad-btn" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', color: 'var(--text-mute)', width: '56px', height: '56px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={() => move(-1, 0)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </button>
              <div style={{ display: 'flex', gap: '56px' }}>
                <button className="dpad-btn" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', color: 'var(--text-mute)', width: '56px', height: '56px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={() => move(0, -1)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button className="dpad-btn" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', color: 'var(--text-mute)', width: '56px', height: '56px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={() => move(0, 1)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
              <button className="dpad-btn" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', color: 'var(--text-mute)', width: '56px', height: '56px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={() => move(1, 0)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              style={{ marginTop: '1rem' }}
            >
              <button 
                className="btn-primary" 
                onClick={handleNext}
                style={{ minWidth: '280px', boxShadow: '0 0 40px rgba(143,191,160,0.4)' }}
              >
                See the Landscape
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
