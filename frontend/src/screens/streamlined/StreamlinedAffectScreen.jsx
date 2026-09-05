import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import { useDeviceViewport } from '../../shared/hooks/useDeviceViewport.js'

export default function StreamlinedAffectScreen() {
  const { affect, setAffect, setScreen } = useLewisStore()
  const { isMobile } = useDeviceViewport()
  const canvasRef = useRef(null)

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    // Map to -1.0 to 1.0 based on center
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    // Y is inverted in DOM (0 is top), top is +1 (Activated)
    const y = 1 - ((e.clientY - rect.top) / rect.height) * 2

    // Clamp
    const clampX = Math.max(-1, Math.min(1, x))
    const clampY = Math.max(-1, Math.min(1, y))

    setAffect(clampX, clampY)
  }

  const handleNext = () => {
    setScreen('sl_3_2BodyMap')
  }

  const hasSelected = affect?.x !== null && affect?.x !== undefined

  const getDotStyle = () => {
    if (!hasSelected) return { display: 'none' }
    const left = `${((affect.x + 1) / 2) * 100}%`
    const top = `${(1 - (affect.y + 1) / 2) * 100}%`
    return { left, top, display: 'block' }
  }

  return (
    <motion.div
      className="screen-container center-aligned"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: isMobile ? '12px 24px 28px 24px' : '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 auto 10px auto',
        textAlign: 'center',
        width: '100%',
      }}>
        ACT 2 · HOW LIFE FEELS
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: isMobile ? '23px' : 'clamp(24px, 3.3vw, 40px)',
        lineHeight: 1.2,
        letterSpacing: '-0.03em',
        margin: '0 auto 8px auto',
        color: 'var(--text-main, #414242)',
        width: '100%',
        maxWidth: '780px',
        textAlign: 'center',
        whiteSpace: 'normal',
      }}>
        {isMobile ? (
          <>
            Place a dot where<br />you feel right now.
          </>
        ) : (
          'Place a dot where you feel right now.'
        )}
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 auto 24px auto',
        fontSize: isMobile ? '14px' : 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
        textAlign: 'center',
        width: '100%',
      }}>
        One tap. Move it if it isn't quite right.
      </p>

      {/* Affect Grid Canvas Wrapper */}
      <div style={{
        position: 'relative',
        width: isMobile ? '80%' : '100%',
        maxWidth: isMobile ? '265px' : '320px',
        aspectRatio: '1/1',
        margin: isMobile ? '28px auto 36px auto' : '20px auto 32px auto',
      }}>
        {/* Axis Labels */}
        <span style={{
          position: 'absolute',
          top: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          color: 'var(--text-sub, #85918e)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          fontFamily: '"Nunito", sans-serif',
        }}>
          Activated
        </span>
        <span style={{
          position: 'absolute',
          bottom: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          color: 'var(--text-sub, #85918e)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          fontFamily: '"Nunito", sans-serif',
        }}>
          Calm
        </span>
        <span style={{
          position: 'absolute',
          top: '50%',
          left: isMobile ? '-18px' : '-32px',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          fontSize: '10.5px',
          color: 'var(--text-sub, #85918e)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          fontFamily: '"Nunito", sans-serif',
        }}>
          Unpleasant
        </span>
        <span style={{
          position: 'absolute',
          top: '50%',
          right: isMobile ? '-18px' : '-32px',
          transform: 'translate(50%, -50%) rotate(90deg)',
          fontSize: '10.5px',
          color: 'var(--text-sub, #85918e)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          fontFamily: '"Nunito", sans-serif',
        }}>
          Pleasant
        </span>

        {/* The Grid Box */}
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 20%, rgba(214, 237, 234, 0.7) 0%, transparent 70%),
              radial-gradient(circle at 80% 20%, rgba(230, 244, 208, 0.7) 0%, transparent 70%),
              radial-gradient(circle at 20% 80%, rgba(214, 237, 234, 0.7) 0%, transparent 70%),
              radial-gradient(circle at 80% 80%, rgba(230, 250, 242, 0.7) 0%, transparent 70%),
              var(--card-bg, #f2f9f6)
            `,
            border: '1.5px solid var(--card-border, #d2e7e0)',
            borderRadius: '24px',
            position: 'relative',
            cursor: 'crosshair',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow, 0 8px 24px rgba(0, 174, 157, 0.08))',
          }}
        >
          {/* Crosshair Lines */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'var(--card-border, rgba(0, 0, 0, 0.08))' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--card-border, rgba(0, 0, 0, 0.08))' }} />

          {/* Quadrant Corner Labels */}
          <span style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-sub, #657370)', fontFamily: "'Nunito', sans-serif" }}>Tense</span>
          <span style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-sub, #657370)', fontFamily: "'Nunito', sans-serif" }}>Alert</span>
          <span style={{ position: 'absolute', bottom: '14px', left: '16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-sub, #657370)', fontFamily: "'Nunito', sans-serif" }}>Heavy</span>
          <span style={{ position: 'absolute', bottom: '14px', right: '16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-sub, #657370)', fontFamily: "'Nunito', sans-serif" }}>Serene</span>

          {/* Interactive Dot */}
          {hasSelected && (
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              style={{
                position: 'absolute',
                width: '26px',
                height: '26px',
                background: 'var(--dawn, #00ae9d)',
                border: '3px solid #ffffff',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 4px 14px rgba(0, 174, 157, 0.35)',
                ...getDotStyle(),
              }}
            />
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasSelected}
          style={{
            padding: '12px 38px',
            borderRadius: '100px',
            fontSize: '14.5px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.02em',
            border: 'none',
            background: hasSelected ? 'var(--dawn, #00ae9d)' : 'var(--btn-disabled-bg, #e5e7eb)',
            color: hasSelected ? '#ffffff' : 'var(--btn-disabled-text, #9ca3af)',
            cursor: hasSelected ? 'pointer' : 'not-allowed',
            boxShadow: hasSelected ? '0 4px 14px rgba(0, 174, 157, 0.25)' : 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (hasSelected) e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            if (hasSelected) e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}
