import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const MindfulBreathingOrb = ({ isFinished }) => {
  return (
    <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', overflow: 'visible' }}>
      <svg
        viewBox="0 0 320 320"
        fill="none"
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="slOrbGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#A8F3E9" />
            <stop offset="45%" stopColor="#00ae9d" />
            <stop offset="85%" stopColor="#00AE9D" />
            <stop offset="100%" stopColor="#008275" />
          </radialGradient>
          <radialGradient id="slOrbOuterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#00AE9D" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="160" cy="160" r="145" fill="url(#slOrbOuterGlow)" />

        <motion.circle
          cx="160" cy="160" r="112"
          stroke="#00AE9D" strokeWidth="1.4" strokeDasharray="5 5" fill="none"
          animate={isFinished ? { scale: 1, opacity: 0.3 } : {
            scale: [0.92, 1.35, 1.35, 0.92],
            opacity: [0.2, 0.6, 0.6, 0.2]
          }}
          transition={isFinished ? { duration: 0.5 } : {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.4, 0.6, 1]
          }}
          style={{ transformOrigin: '160px 160px' }}
        />

        <motion.circle
          cx="160" cy="160" r="96"
          stroke="#00ae9d" strokeWidth="1.8" fill="rgba(0, 174, 157, 0.05)"
          animate={isFinished ? { scale: 1, opacity: 0.4 } : {
            scale: [0.86, 1.28, 1.28, 0.86],
            opacity: [0.25, 0.7, 0.7, 0.25]
          }}
          transition={isFinished ? { duration: 0.5 } : {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.4, 0.6, 1]
          }}
          style={{ transformOrigin: '160px 160px' }}
        />

        <motion.circle
          cx="160" cy="160" r="70"
          fill="url(#slOrbGrad)"
          animate={isFinished ? { scale: 1 } : {
            scale: [0.84, 1.22, 1.22, 0.84]
          }}
          transition={isFinished ? { duration: 0.5 } : {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.4, 0.6, 1]
          }}
          style={{
            transformOrigin: '160px 160px',
            filter: 'drop-shadow(0 6px 20px rgba(0, 174, 157, 0.45))'
          }}
        />
      </svg>
    </div>
  )
}

function getTensionLevel(val) {
  if (val <= 20) return 'Calm'
  if (val <= 45) return 'Settled'
  if (val <= 70) return 'Moderate'
  if (val <= 85) return 'Elevated'
  return 'High'
}

function LuxuryTensionSlider({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false)
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalUp)
      window.addEventListener('touchend', handleGlobalUp)
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp)
      window.removeEventListener('touchend', handleGlobalUp)
    }
  }, [isDragging])

  return (
    <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto 36px auto' }}>
      {/* Dynamic Floating Pill Indicator */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '36px',
        marginBottom: '4px',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          left: `clamp(38px, ${value}%, calc(100% - 38px))`,
          transform: 'translateX(-50%)',
          background: 'var(--dawn, #00ae9d)',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 800,
          fontFamily: '"Nunito", sans-serif',
          padding: '4px 14px',
          borderRadius: '999px',
          boxShadow: '0 4px 14px rgba(0, 174, 157, 0.35)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          transition: isDragging ? 'none' : 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 800 }}>{value}</span>
          <span style={{ fontSize: '11px', opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            • {getTensionLevel(value)}
          </span>
        </div>
      </div>

      {/* Slider Interactive Track Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Base Unfilled Track Rail */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '7px',
          borderRadius: '999px',
          background: 'var(--slider-bg, #414242)',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
          overflow: 'visible',
        }}>
          {/* Active Gradient Fill Bar */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${value}%`,
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #00ae9d 0%, #00d5c0 100%)',
            boxShadow: '0 0 10px rgba(0, 174, 157, 0.4)',
            transition: isDragging ? 'none' : 'width 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }} />

          {/* Milestone Ticks */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              style={{
                position: 'absolute',
                left: `${tick}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: value >= tick ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                transition: 'background 0.2s ease',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Custom Luxury Thumb Knob */}
          <div
            style={{
              position: 'absolute',
              left: `${value}%`,
              top: '50%',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '3.5px solid var(--dawn, #00ae9d)',
              boxShadow: isDragging
                ? '0 0 0 8px rgba(0, 174, 157, 0.22), 0 4px 14px rgba(0, 174, 157, 0.45)'
                : '0 2px 8px rgba(0, 174, 157, 0.35), 0 1px 3px rgba(0, 0, 0, 0.12)',
              transform: `translate(-50%, -50%) scale(${isDragging ? 1.2 : 1})`,
              transition: isDragging
                ? 'transform 0.15s ease, box-shadow 0.15s ease'
                : 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), transform 0.15s ease, box-shadow 0.15s ease',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
        </div>

        {/* Transparent Interactive Input Layer */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: isDragging ? 'grabbing' : 'pointer',
            margin: 0,
            padding: 0,
            zIndex: 4,
          }}
        />
      </div>

      {/* Clickable Edge Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        userSelect: 'none',
      }}>
        <button
          type="button"
          className="btn-ghost slider-edge-btn nav-prev-btn"
          onClick={() => onChange(0)}
          style={{
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            outline: 'none',
            padding: '4px 0',
            fontSize: '12.5px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: value <= 20 ? 800 : 600,
            color: value <= 20 ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #657370)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>Calm &amp; Settled</span>
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: '10px',
            background: value <= 20 ? 'rgba(0, 174, 157, 0.15)' : 'rgba(0, 0, 0, 0.05)',
            fontWeight: 700,
          }}>0</span>
        </button>

        <button
          type="button"
          className="btn-ghost slider-edge-btn nav-prev-btn"
          onClick={() => onChange(100)}
          style={{
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            outline: 'none',
            padding: '4px 0',
            fontSize: '12.5px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: value >= 80 ? 800 : 600,
            color: value >= 80 ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #657370)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: '10px',
            background: value >= 80 ? 'rgba(0, 174, 157, 0.15)' : 'rgba(0, 0, 0, 0.05)',
            fontWeight: 700,
          }}>100</span>
          <span>High Tension</span>
        </button>
      </div>
    </div>
  )
}

export default function StreamlinedBreathingScreen() {
  const { tensionBefore, tensionAfter, setProfileField, setScreen } = useLewisStore()
  const [phase, setPhase] = useState('before')
  const [beforeVal, setBeforeVal] = useState(typeof tensionBefore === 'number' ? tensionBefore : 50)
  const [afterVal, setAfterVal] = useState(typeof tensionAfter === 'number' ? tensionAfter : 30)
  const [breathSeconds, setBreathSeconds] = useState(30)
  const [breathText, setBreathText] = useState('Inhale gently...')

  useEffect(() => {
    if (phase !== 'breathing') return
    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setPhase('after')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'breathing') return
    const elapsed = 30 - breathSeconds
    const cyclePos = elapsed % 10
    if (cyclePos < 4) {
      setBreathText('Inhale gently...')
    } else if (cyclePos < 6) {
      setBreathText('Hold gently...')
    } else {
      setBreathText('Slow, smooth exhale...')
    }
  }, [breathSeconds, phase])

  const handleStartBreath = () => {
    setProfileField('tensionBefore', beforeVal)
    setPhase('breathing')
  }

  const handleFinish = () => {
    setProfileField('tensionAfter', afterVal)
    setScreen('sl_10Generating')
  }

  return (
    <motion.div
      className="screen-container"
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
        maxWidth: '720px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
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
        margin: '0 0 10px 0',
      }}>
        RESET &amp; REFLECTION
      </p>

      {/* PHASE 1: PRE-BREATH TENSION */}
      {phase === 'before' && (
        <>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(28px, 3.8vw, 48px)',
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            margin: '0 0 8px 0',
            color: 'var(--text-main, #414242)',
          }}>
            One breath before you see your map
          </h1>

          <p style={{
            margin: '0 0 36px 0',
            fontSize: 'clamp(13px, 1.6vw, 16px)',
            color: 'var(--text-sub, #657370)',
            fontFamily: "'Nunito', sans-serif",
          }}>
            How much tension is in your body right now?
          </p>

          <LuxuryTensionSlider value={beforeVal} onChange={setBeforeVal} />

          <div>
            <button
              type="button"
              onClick={handleStartBreath}
              className="btn-primary"
              style={{
                padding: '12px 38px',
                borderRadius: '100px',
                fontSize: '14.5px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.02em',
                border: 'none',
                background: 'var(--dawn, #00ae9d)',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Begin 30s Reset
            </button>
          </div>
        </>
      )}

      {/* PHASE 2: MINDFUL BREATHING ANIMATION */}
      {phase === 'breathing' && (
        <>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(28px, 3.8vw, 44px)',
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            margin: '0 0 8px 0',
            color: 'var(--text-main, #414242)',
          }}>
            {breathText}
          </h1>

          <p style={{
            margin: '0 0 32px 0',
            fontSize: '14px',
            color: 'var(--text-sub, #657370)',
            fontFamily: "'Nunito', sans-serif",
          }}>
            {breathSeconds}s remaining
          </p>

          <MindfulBreathingOrb isFinished={false} />

          <div style={{ marginTop: '36px' }}>
            <button
              type="button"
              onClick={() => setPhase('after')}
              className="nav-prev-btn skip-btn btn-ghost"
              style={{
                background: 'transparent',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                color: 'var(--text-mute, #9ca3af)',
                fontSize: '13px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--dawn, #00ae9d)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mute, #9ca3af)')}
            >
              Skip to results →
            </button>
          </div>
        </>
      )}

      {/* PHASE 3: POST-BREATH TENSION */}
      {phase === 'after' && (
        <>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(28px, 3.8vw, 48px)',
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            margin: '0 0 8px 0',
            color: 'var(--text-main, #414242)',
          }}>
            How does your body feel now?
          </h1>

          <p style={{
            margin: '0 0 36px 0',
            fontSize: 'clamp(13px, 1.6vw, 16px)',
            color: 'var(--text-sub, #657370)',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Slide to where your physical tension sits after pausing.
          </p>

          <LuxuryTensionSlider value={afterVal} onChange={setAfterVal} />

          <div>
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary"
              style={{
                padding: '12px 38px',
                borderRadius: '100px',
                fontSize: '14.5px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.02em',
                border: 'none',
                background: 'var(--dawn, #00ae9d)',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Generate My Insights
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}
