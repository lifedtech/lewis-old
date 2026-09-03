import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const STOPS = [
  { val: 0, label: 'Very turbulent' },
  { val: 25, label: 'Unsettled' },
  { val: 50, label: 'Mixed' },
  { val: 75, label: 'Mostly steady' },
  { val: 100, label: 'Very steady' }
]

export default function StreamlinedStabilityScreen() {
  const { lifeStability, setProfileField, setScreen } = useLewisStore()
  const currentVal = typeof lifeStability === 'number' ? lifeStability : 50

  const activeStop = STOPS.reduce((prev, curr) => 
    Math.abs(curr.val - currentVal) < Math.abs(prev.val - currentVal) ? curr : prev
  )

  const handleSliderChange = (e) => {
    setProfileField('lifeStability', Number(e.target.value))
  }

  const handleNext = () => {
    setScreen('sl_1_3Pressures')
  }

  const [isDragging, setIsDragging] = React.useState(false)

  React.useEffect(() => {
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
        maxWidth: '620px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 0 10px 0',
      }}>
        DRAG SLIDER
      </p>

      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(32px, 4.2vw, 52px)',
        lineHeight: 1.05,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
      }}>
        Where life feels right now
      </h1>

      <p style={{
        margin: '0 0 36px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        One drag. There is no better or worse end of this.
      </p>

      {/* Selected Label Badge with Smooth Morph Transition */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '160px',
        height: '46px',
        padding: '0 24px',
        borderRadius: '100px',
        background: 'rgba(0, 174, 157, 0.08)',
        border: '1.5px solid var(--dawn, #00ae9d)',
        color: 'var(--dawn, #00ae9d)',
        fontSize: '16px',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 700,
        marginBottom: '32px',
        boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
        overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeStop.label}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {activeStop.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Smooth Motion Slider Container */}
      <div style={{ width: '100%', maxWidth: '440px', padding: '0 10px', boxSizing: 'border-box' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Base Unfilled Track */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '6px',
            borderRadius: '4px',
            background: 'var(--slider-bg, #414242)',
            overflow: 'visible',
          }}>
            {/* Active Filled Progress */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${currentVal}%`,
              borderRadius: '4px',
              background: 'var(--dawn, #00ae9d)',
              transition: isDragging ? 'none' : 'width 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
              boxShadow: '0 0 10px rgba(0, 174, 157, 0.35)',
            }} />

            {/* Subtle Milestone Dots */}
            {STOPS.map((s) => (
              <div
                key={s.val}
                style={{
                  position: 'absolute',
                  left: `${s.val}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: currentVal >= s.val ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'background 0.2s ease',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Smooth Motion Thumb Knob */}
            <div
              style={{
                position: 'absolute',
                left: `${currentVal}%`,
                top: '50%',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--dawn, #00ae9d)',
                border: '2px solid #ffffff',
                boxShadow: isDragging
                  ? '0 0 0 8px rgba(0, 174, 157, 0.22), 0 4px 12px rgba(0, 0, 0, 0.25)'
                  : '0 2px 6px rgba(0, 0, 0, 0.25)',
                transform: `translate(-50%, -50%) scale(${isDragging ? 1.25 : 1})`,
                transition: isDragging
                  ? 'transform 0.15s ease, box-shadow 0.15s ease'
                  : 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), transform 0.15s ease, box-shadow 0.15s ease',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
          </div>

          {/* Interactive Invisible Range Input Layer */}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={currentVal}
            onChange={handleSliderChange}
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

        {/* Clickable Labels with Smooth Glide */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 600,
          color: 'var(--text-sub, #85918e)',
          marginTop: '10px',
          userSelect: 'none',
        }}>
          <span
            onClick={() => setProfileField('lifeStability', 0)}
            style={{
              cursor: 'pointer',
              transition: 'color 0.2s ease, font-weight 0.2s ease',
              color: currentVal <= 15 ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #85918e)',
              fontWeight: currentVal <= 15 ? 700 : 600,
            }}
          >
            Very turbulent
          </span>
          <span
            onClick={() => setProfileField('lifeStability', 50)}
            style={{
              cursor: 'pointer',
              transition: 'color 0.2s ease, font-weight 0.2s ease',
              color: currentVal >= 40 && currentVal <= 60 ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #85918e)',
              fontWeight: currentVal >= 40 && currentVal <= 60 ? 700 : 600,
            }}
          >
            Mixed
          </span>
          <span
            onClick={() => setProfileField('lifeStability', 100)}
            style={{
              cursor: 'pointer',
              transition: 'color 0.2s ease, font-weight 0.2s ease',
              color: currentVal >= 85 ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #85918e)',
              fontWeight: currentVal >= 85 ? 700 : 600,
            }}
          >
            Very steady
          </span>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <button
          type="button"
          onClick={handleNext}
          style={{
            padding: '12px 36px',
            borderRadius: '100px',
            fontSize: '14px',
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
          Continue
        </button>
      </div>
    </motion.div>
  )
}
