import { useRef } from 'react';
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
              radial-gradient(circle at 0% 0%, rgba(0, 174, 157, 0.22), transparent 55%),
              radial-gradient(circle at 100% 0%, rgba(91, 187, 70, 0.25), transparent 55%),
              radial-gradient(circle at 0% 100%, rgba(0, 174, 157, 0.22), transparent 55%),
              radial-gradient(circle at 100% 100%, rgba(0, 174, 157, 0.25), transparent 55%),
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
        {/* Subtle Center Crosshair Lines */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(0, 0, 0, 0.06)' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0, 0, 0, 0.06)' }}></div>

        {/* Muted Minimal Corner Labels */}
        <span style={{ position: 'absolute', top: '16px', left: '18px', fontSize: '13px', fontWeight: 600, color: '#414242' }}>Tense</span>
        <span style={{ position: 'absolute', top: '16px', right: '18px', fontSize: '13px', fontWeight: 600, color: '#414242' }}>Alert</span>
        <span style={{ position: 'absolute', bottom: '16px', left: '18px', fontSize: '13px', fontWeight: 600, color: '#414242' }}>Heavy</span>
        <span style={{ position: 'absolute', bottom: '16px', right: '18px', fontSize: '13px', fontWeight: 600, color: '#414242' }}>Serene</span>

        {/* Selector Dot with White Outer Ring & Teal Core */}
        {affect?.x !== null && affect?.x !== undefined && (
          <motion.div
            className="affect-dot"
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: 'absolute',
              width: '28px',
              height: '28px',
              background: '#ffffff',
              border: '3px solid #00ae9d',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 4px 14px rgba(0, 174, 157, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...getDotStyle()
            }}
          >
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ae9d' }} />
          </motion.div>
        )}
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
