import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function MindGamesScreen() {
  const { affect, setAffect, setScreen } = useLewisStore()
  const canvasRef = useRef(null)
  
  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    // Map to -1.0 to 1.0 based on center
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    // Y is inverted in DOM (0 is top), but we want top to be +1 (Activated)
    const y = 1 - ((e.clientY - rect.top) / rect.height) * 2
    
    // Clamp
    const clampX = Math.max(-1, Math.min(1, x))
    const clampY = Math.max(-1, Math.min(1, y))
    
    setAffect(clampX, clampY)
  }

  const handleNext = () => {
    setScreen('delayDiscounting')
  }

  const getDotStyle = () => {
    if (affect.x === null || affect.y === null) return { display: 'none' }
    
    const left = `${((affect.x + 1) / 2) * 100}%`
    const top = `${(1 - (affect.y + 1) / 2) * 100}%`
    
    return {
      left,
      top,
      display: 'block'
    }
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>The Affect Canvas</p>
      <h1 className="headline" style={{ textAlign: 'center', fontSize: '24px' }}>Where is your mind sitting right now?</h1>
      <p className="sub" style={{ textAlign: 'center', marginBottom: '40px' }}>Tap anywhere on the grid.</p>

      <div 
        className="affect-canvas-wrapper" 
        style={{
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '1/1',
          margin: '0 auto 40px',
          position: 'relative'
        }}
      >
        {/* Labels */}
        <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'var(--text-mute)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Activated / High Energy</span>
        <span style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'var(--text-mute)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Calm / Low Energy</span>
        <span style={{ position: 'absolute', top: '50%', left: '-35px', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '12px', color: 'var(--text-mute)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Unpleasant</span>
        <span style={{ position: 'absolute', top: '50%', right: '-30px', transform: 'translateY(-50%) rotate(90deg)', fontSize: '12px', color: 'var(--text-mute)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Pleasant</span>
        
        {/* The Grid Canvas */}
        <div 
          ref={canvasRef}
          className="affect-grid"
          onClick={handleCanvasClick}
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 0% 0%, rgba(255, 107, 107, 0.22), transparent 55%),
              radial-gradient(circle at 100% 0%, rgba(255, 209, 102, 0.25), transparent 55%),
              radial-gradient(circle at 0% 100%, rgba(120, 115, 245, 0.22), transparent 55%),
              radial-gradient(circle at 100% 100%, rgba(54, 209, 220, 0.25), transparent 55%),
              var(--panel-2)
            `,
            border: '1px solid var(--panel-border)',
            borderRadius: '24px',
            position: 'relative',
            cursor: 'crosshair',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}
        >
          {/* Axis lines */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(0,0,0,0.08)' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.08)' }}></div>
          
          {/* 4 Quadrants with Vibrant Color Gradients & Styled Badges */}
          {/* Top-Left: Stressed / Tense */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '50%', height: '50%',
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.25) 0%, rgba(255, 148, 102, 0.05) 100%)',
            borderRight: '1px dashed rgba(255, 107, 107, 0.15)',
            borderBottom: '1px dashed rgba(255, 107, 107, 0.15)'
          }}>
            <span style={{ 
              position: 'absolute', top: '14px', left: '14px', 
              fontSize: '11px', fontWeight: 600, color: '#D93838', 
              background: 'rgba(255, 255, 255, 0.75)', padding: '4px 8px', borderRadius: '8px',
              backdropFilter: 'blur(4px)', boxShadow: '0 2px 6px rgba(217,56,56,0.1)'
            }}>Stressed / Tense</span>
          </div>

          {/* Top-Right: Excited / Alert */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '50%', height: '50%',
            background: 'linear-gradient(225deg, rgba(255, 190, 60, 0.25) 0%, rgba(255, 230, 100, 0.05) 100%)',
            borderLeft: '1px dashed rgba(255, 190, 60, 0.15)',
            borderBottom: '1px dashed rgba(255, 190, 60, 0.15)'
          }}>
            <span style={{ 
              position: 'absolute', top: '14px', right: '14px', 
              fontSize: '11px', fontWeight: 600, color: '#D97706', 
              background: 'rgba(255, 255, 255, 0.75)', padding: '4px 8px', borderRadius: '8px',
              backdropFilter: 'blur(4px)', boxShadow: '0 2px 6px rgba(217,119,6,0.1)'
            }}>Excited / Alert</span>
          </div>

          {/* Bottom-Left: Fatigued / Sad */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%',
            background: 'linear-gradient(45deg, rgba(120, 115, 245, 0.22) 0%, rgba(160, 150, 255, 0.05) 100%)',
            borderRight: '1px dashed rgba(120, 115, 245, 0.15)',
            borderTop: '1px dashed rgba(120, 115, 245, 0.15)'
          }}>
            <span style={{ 
              position: 'absolute', bottom: '14px', left: '14px', 
              fontSize: '11px', fontWeight: 600, color: '#4F46E5', 
              background: 'rgba(255, 255, 255, 0.75)', padding: '4px 8px', borderRadius: '8px',
              backdropFilter: 'blur(4px)', boxShadow: '0 2px 6px rgba(79,70,229,0.1)'
            }}>Fatigued / Sad</span>
          </div>

          {/* Bottom-Right: Calm / Serene */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%',
            background: 'linear-gradient(315deg, rgba(45, 212, 191, 0.28) 0%, rgba(54, 209, 220, 0.05) 100%)',
            borderLeft: '1px dashed rgba(45, 212, 191, 0.15)',
            borderTop: '1px dashed rgba(45, 212, 191, 0.15)'
          }}>
            <span style={{ 
              position: 'absolute', bottom: '14px', right: '14px', 
              fontSize: '11px', fontWeight: 600, color: '#0D9488', 
              background: 'rgba(255, 255, 255, 0.75)', padding: '4px 8px', borderRadius: '8px',
              backdropFilter: 'blur(4px)', boxShadow: '0 2px 6px rgba(13,148,136,0.1)'
            }}>Calm / Serene</span>
          </div>

          {/* The Point */}
          <motion.div 
            className="affect-dot"
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              background: 'var(--dawn-glow)',
              border: '2px solid var(--dawn)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px var(--dawn-glow)',
              ...getDotStyle()
            }}
          />
        </div>
      </div>

      <div className="spacer"></div>
      <button 
        className="btn-primary" 
        onClick={handleNext} 
        disabled={affect.x === null}
        style={{ alignSelf: 'center' }}
      >
        Continue
      </button>
    </motion.section>
  )
}
