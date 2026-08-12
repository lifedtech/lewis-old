import { useRef } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage3_1AffectScreen() {
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
    setScreen('stage3_2BodyMap')
  }

  const getDotStyle = () => {
    if (affect?.x === null || affect?.y === null || affect?.x === undefined) return { display: 'none' }

    const left = `${((affect.x + 1) / 2) * 100}%`
    const top = `${(1 - (affect.y + 1) / 2) * 100}%`

    return {
      left,
      top,
      display: 'block'
    }
  }

  const hasSelected = affect?.x !== null && affect?.x !== undefined

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
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

        {/* LEFT — Eyebrow + Title + Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              EMOTIONAL STATE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textWrap: 'balance',
            }}>
              Where is your mind sitting right now?
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Tap anywhere on the grid to reflect your current energy and mood.
            </p>
          </div>
        </div>

        {/* RIGHT — Affect Grid Canvas + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 14px 0',
            width: '100%',
          }}>
            AFFECT GRID
          </p>

          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 0',
          }}>
            <div
              className="affect-canvas-wrapper"
              style={{
                width: '100%',
                maxWidth: '300px',
                aspectRatio: '1/1',
                position: 'relative'
              }}
            >
              {/* Axis Labels */}
              <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: '#414242', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif' }}>Activated / High Energy</span>
              <span style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: '#414242', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif' }}>Calm / Low Energy</span>
              <span style={{ position: 'absolute', top: '50%', left: '-26px', transform: 'translate(-50%, -50%) rotate(-90deg)', fontSize: '11px', color: '#414242', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif' }}>Unpleasant</span>
              <span style={{ position: 'absolute', top: '50%', right: '-26px', transform: 'translate(50%, -50%) rotate(90deg)', fontSize: '11px', color: '#414242', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif' }}>Pleasant</span>

              {/* The Grid Canvas */}
              <div
                ref={canvasRef}
                className="affect-grid"
                onClick={handleCanvasClick}
                style={{
                  width: '100%',
                  height: '100%',
                  background: `
                    radial-gradient(circle at 15% 15%, rgba(214, 237, 234, 0.65) 0%, rgba(248, 230, 225, 0.3) 50%, transparent 80%),
                    radial-gradient(circle at 85% 15%, rgba(230, 244, 208, 0.65) 0%, rgba(240, 250, 225, 0.3) 50%, transparent 80%),
                    radial-gradient(circle at 15% 85%, rgba(214, 237, 234, 0.65) 0%, rgba(242, 238, 255, 0.3) 50%, transparent 80%),
                    radial-gradient(circle at 85% 85%, rgba(214, 237, 234, 0.65) 0%, rgba(230, 250, 242, 0.3) 50%, transparent 80%),
                    #f2f9f6
                  `,
                  border: '1.5px solid #d2e7e0',
                  borderRadius: '24px',
                  position: 'relative',
                  cursor: 'crosshair',
                  overflow: 'hidden',
                  boxShadow: '0 8px 28px rgba(0,174,157,0.08)'
                }}
              >
                {/* Center Crosshair Lines */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(0, 0, 0, 0.08)' }}></div>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0, 0, 0, 0.08)' }}></div>

                {/* Corner Quadrant Labels */}
                <span style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '12px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif" }}>Tense</span>
                <span style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '12px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif" }}>Alert</span>
                <span style={{ position: 'absolute', bottom: '14px', left: '16px', fontSize: '12px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif" }}>Heavy</span>
                <span style={{ position: 'absolute', bottom: '14px', right: '16px', fontSize: '12px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif" }}>Serene</span>

                {/* Selector Dot */}
                {hasSelected && (
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
                      ...getDotStyle()
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!hasSelected}
              style={{
                padding: '10px 36px',
                opacity: hasSelected ? 1 : 0.5,
                cursor: hasSelected ? 'pointer' : 'not-allowed',
              }}
            >
              Continue
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
