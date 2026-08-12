import {  useState, useEffect, useCallback  } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const TOTAL_TIME = 30 // 3 cycles of 10s (4s in, 2s hold, 4s out)
const CYCLE_TIME = 10

/* ── 3D Glowing Breathing Orb with Generous ViewBox & Unclipped Wave Motion ── */
const MindfulBreathingOrb = ({ isFinished }) => {
  return (
    <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', overflow: 'visible' }}>
      <svg
        viewBox="0 0 320 320"
        fill="none"
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="orbGradient" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#A8F3E9" />
            <stop offset="45%" stopColor="#00ae9d" />
            <stop offset="85%" stopColor="#00AE9D" />
            <stop offset="100%" stopColor="#00ae9d" />
          </radialGradient>
          <radialGradient id="orbOuterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#00AE9D" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Soft Glow Background */}
        <circle cx="160" cy="160" r="145" fill="url(#orbOuterGlow)" />

        {/* Outer Wave 3 — Dashed fluid wave ring */}
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

        {/* Middle Wave 2 — Smooth solid ripple ring */}
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

        {/* Main 3D Orb */}
        <motion.circle
          cx="160" cy="160" r="74"
          fill="url(#orbGradient)"
          animate={isFinished ? { scale: 1 } : {
            scale: [0.8, 1.22, 1.22, 0.8]
          }}
          transition={isFinished ? { duration: 0.5 } : {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.4, 0.6, 1]
          }}
          style={{ transformOrigin: '160px 160px' }}
        />

        {/* Glossy Highlight Dots on Orb */}
        <motion.g
          animate={isFinished ? { scale: 1 } : {
            scale: [0.8, 1.22, 1.22, 0.8]
          }}
          transition={isFinished ? { duration: 0.5 } : {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.4, 0.6, 1]
          }}
          style={{ transformOrigin: '160px 160px' }}
        >
          <circle cx="135" cy="125" r="9.5" fill="#FFFFFF" opacity="0.85" />
          <circle cx="188" cy="178" r="5.5" fill="#FFFFFF" opacity="0.5" />
        </motion.g>
      </svg>
    </div>
  )
}

export default function Stage3_4BreathingScreen() {
  const { setScreen, setProfileField } = useLewisStore()
  const [remaining, setRemaining] = useState(TOTAL_TIME)
  const [isFinished, setIsFinished] = useState(false)

  const finishBreathing = useCallback(() => {
    setIsFinished(true)
    setProfileField('breathingDone', true)
  }, [setProfileField])

  useEffect(() => {
    if (isFinished) return

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          finishBreathing()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [finishBreathing, isFinished])

  const elapsed = TOTAL_TIME - remaining
  const cycleNum = Math.min(3, Math.floor(elapsed / CYCLE_TIME) + 1)
  const cycleSec = elapsed % CYCLE_TIME

  let breatheState

  if (cycleSec < 4) {
    breatheState = 'Breathe in'
  } else if (cycleSec < 6) {
    breatheState = 'Hold'
  } else {
    breatheState = 'Breathe out'
  }

  const handleSkipOrContinue = () => {
    setProfileField('breathingDone', true)
    setScreen('stage3_5NsState')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ overflow: 'visible' }}
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
        overflow: 'visible',
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
              SOMATIC RESET
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              whiteSpace: 'nowrap',
            }}>
              Mindful Breathing
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Follow the glowing orb as it expands and contracts. Take 3 deep, restorative breaths.
            </p>
          </div>
        </div>

        {/* RIGHT — BREATHING EXERCISE Eyebrow + Orb Container + Pinned Button */}
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
            BREATHING EXERCISE
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
            <MindfulBreathingOrb isFinished={isFinished} />

            <div style={{ textAlign: 'center' }}>
              <motion.p
                key={breatheState}
                initial={{ opacity: 0.6, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: '#414242',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {isFinished ? 'Complete' : breatheState}
              </motion.p>
              <p style={{
                margin: '6px 0 0 0',
                fontSize: '12px',
                fontWeight: 700,
                color: '#414242',
                fontFamily: '"Nunito", sans-serif',
                letterSpacing: '0.08em',
              }}>
                CYCLE {cycleNum} OF 3
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '12px', flexShrink: 0 }}>
            <button
              onClick={handleSkipOrContinue}
              className={isFinished ? 'btn-primary' : 'chip'}
              style={{
                padding: '10px 32px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: isFinished ? 'none' : '1.5px solid #00ae9d',
                color: isFinished ? '#fff' : '#00ae9d',
                background: isFinished ? 'var(--dawn)' : '#ffffff',
                cursor: 'pointer',
              }}
            >
              {isFinished ? 'Continue' : 'Skip Exercise'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
