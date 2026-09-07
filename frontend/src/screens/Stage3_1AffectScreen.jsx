import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage3_1AffectScreen() {
  const { affect, setAffect, setScreen } = useLewisStore()
  const canvasRef = useRef(null)
  const [isPointerDown, setIsPointerDown] = useState(false)

  const updateCoordinates = (clientX, clientY) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    // Map to -1.0 to 1.0 based on center
    const x = ((clientX - rect.left) / rect.width) * 2 - 1
    // Y is inverted in DOM (0 is top), top is +1 (Activated)
    const y = 1 - ((clientY - rect.top) / rect.height) * 2

    // Clamp
    const clampX = Math.max(-1, Math.min(1, x))
    const clampY = Math.max(-1, Math.min(1, y))

    setAffect(clampX, clampY)
  }

  const handlePointerDown = (e) => {
    setIsPointerDown(true)
    updateCoordinates(e.clientX, e.clientY)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }

  const handlePointerMove = (e) => {
    if (!isPointerDown) return
    updateCoordinates(e.clientX, e.clientY)
  }

  const handlePointerUp = (e) => {
    setIsPointerDown(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }

  const handleNext = () => {
    setScreen('stage3_2BodyMap')
  }

  const hasSelected = affect?.x !== null && affect?.x !== undefined

  const getActiveQuadrant = (x, y) => {
    if (x === null || x === undefined || y === null || y === undefined) return null
    if (x < 0 && y > 0) return { key: 'tense', label: 'Tense', mood: 'Unpleasant · High Energy', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.16)', border: 'rgba(244, 63, 94, 0.45)' }
    if (x >= 0 && y > 0) return { key: 'alert', label: 'Alert', mood: 'Pleasant · High Energy', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.45)' }
    if (x < 0 && y <= 0) return { key: 'heavy', label: 'Heavy', mood: 'Unpleasant · Low Energy', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.16)', border: 'rgba(99, 102, 241, 0.45)' }
    return { key: 'serene', label: 'Serene', mood: 'Pleasant · Low Energy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.16)', border: 'rgba(16, 185, 129, 0.45)' }
  }

  const activeQuad = hasSelected ? getActiveQuadrant(affect.x, affect.y) : null

  const getDotStyle = () => {
    if (!hasSelected) return { display: 'none' }
    const left = `${((affect.x + 1) / 2) * 100}%`
    const top = `${(1 - (affect.y + 1) / 2) * 100}%`
    return { left, top, display: 'block' }
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              EMOTIONAL STATE
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(22px, 2.8vw, 34px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: 'var(--text-main, #414242)',
            }}>
              Where is your mind sitting right now?
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Tap anywhere on the grid to reflect your current energy and mood.
            </p>
          </div>
        </div>

        {/* RIGHT — Affect Grid Canvas + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start', width: '100%' }}>

          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0 10px 0'
          }}>
            <div
              className="affect-canvas-wrapper"
              style={{
                width: '100%',
                maxWidth: '310px',
                aspectRatio: '1/1',
                position: 'relative'
              }}
            >
              {/* Axis Labels */}
              <span style={{ position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)', fontSize: '11.5px', color: 'var(--text-main, #414242)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif', pointerEvents: 'none', userSelect: 'none' }}>Activated</span>
              <span style={{ position: 'absolute', bottom: '-26px', left: '50%', transform: 'translateX(-50%)', fontSize: '11.5px', color: 'var(--text-main, #414242)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif', pointerEvents: 'none', userSelect: 'none' }}>Calm</span>
              <span style={{ position: 'absolute', top: '50%', left: '-32px', transform: 'translate(-50%, -50%) rotate(-90deg)', fontSize: '11px', color: 'var(--text-main, #414242)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif', pointerEvents: 'none', userSelect: 'none' }}>Unpleasant</span>
              <span style={{ position: 'absolute', top: '50%', right: '-32px', transform: 'translate(50%, -50%) rotate(90deg)', fontSize: '11px', color: 'var(--text-main, #414242)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Nunito", sans-serif', pointerEvents: 'none', userSelect: 'none' }}>Pleasant</span>

              {/* The Grid Canvas */}
              <div
                ref={canvasRef}
                className="affect-grid"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onClick={(e) => updateCoordinates(e.clientX, e.clientY)}
                style={{
                  width: '100%',
                  height: '100%',
                  background: `
                    radial-gradient(circle at 24% 24%, rgba(244, 63, 94, 0.28) 0%, rgba(244, 63, 94, 0.05) 54%, transparent 74%),
                    radial-gradient(circle at 76% 24%, rgba(245, 158, 11, 0.28) 0%, rgba(245, 158, 11, 0.05) 54%, transparent 74%),
                    radial-gradient(circle at 24% 76%, rgba(99, 102, 241, 0.28) 0%, rgba(99, 102, 241, 0.05) 54%, transparent 74%),
                    radial-gradient(circle at 76% 76%, rgba(16, 185, 129, 0.28) 0%, rgba(16, 185, 129, 0.05) 54%, transparent 74%),
                    var(--card-bg, #13201E)
                  `,
                  border: '1.5px solid var(--border-strong, rgba(255, 255, 255, 0.15))',
                  borderRadius: '24px',
                  position: 'relative',
                  cursor: 'crosshair',
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22), 0 2px 10px rgba(0, 174, 157, 0.12)',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                {/* Center Crosshair Lines */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'var(--border-strong, rgba(255, 255, 255, 0.15))', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-strong, rgba(255, 255, 255, 0.15))', pointerEvents: 'none' }}></div>

                {/* Quadrant Badge: TENSE (Top-Left: Unpleasant + Activated) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.16)',
                  border: '1px solid rgba(244, 63, 94, 0.38)',
                  backdropFilter: 'blur(8px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  boxShadow: activeQuad?.key === 'tense' ? '0 0 14px rgba(244, 63, 94, 0.5)' : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: "'Nunito', sans-serif",
                    color: 'var(--quad-tense-text, #fda4af)',
                    letterSpacing: '0.02em',
                  }}>
                    Tense
                  </span>
                </div>

                {/* Quadrant Badge: ALERT (Top-Right: Pleasant + Activated) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.16)',
                  border: '1px solid rgba(245, 158, 11, 0.38)',
                  backdropFilter: 'blur(8px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  boxShadow: activeQuad?.key === 'alert' ? '0 0 14px rgba(245, 158, 11, 0.5)' : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: "'Nunito', sans-serif",
                    color: 'var(--quad-alert-text, #fde047)',
                    letterSpacing: '0.02em',
                  }}>
                    Alert
                  </span>
                </div>

                {/* Quadrant Badge: HEAVY (Bottom-Left: Unpleasant + Calm) */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.16)',
                  border: '1px solid rgba(99, 102, 241, 0.38)',
                  backdropFilter: 'blur(8px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  boxShadow: activeQuad?.key === 'heavy' ? '0 0 14px rgba(99, 102, 241, 0.5)' : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: "'Nunito', sans-serif",
                    color: 'var(--quad-heavy-text, #c7d2fe)',
                    letterSpacing: '0.02em',
                  }}>
                    Heavy
                  </span>
                </div>

                {/* Quadrant Badge: SERENE (Bottom-Right: Pleasant + Calm) */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.16)',
                  border: '1px solid rgba(16, 185, 129, 0.38)',
                  backdropFilter: 'blur(8px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  boxShadow: activeQuad?.key === 'serene' ? '0 0 14px rgba(16, 185, 129, 0.5)' : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: "'Nunito', sans-serif",
                    color: 'var(--quad-serene-text, #6ee7b7)',
                    letterSpacing: '0.02em',
                  }}>
                    Serene
                  </span>
                </div>

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
                      background: activeQuad?.color || 'var(--action-fill, #00ae9d)',
                      border: '3px solid #ffffff',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: `0 0 0 4px ${activeQuad ? activeQuad.color + '44' : 'rgba(0, 174, 157, 0.3)'}, 0 4px 14px rgba(0, 0, 0, 0.4)`,
                      pointerEvents: 'none',
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
