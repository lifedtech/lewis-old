import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import BreathingFluidBlob from '../components/BreathingFluidBlob.jsx'

export default function Stage10GeneratingScreen() {
  const { setScreen } = useLewisStore()
  const [stepIdx, setStepIdx] = useState(0)

  const steps = [
    "Scoring emotional well-being & psychological metrics...",
    "Normalizing perceived stress load & resilience index...",
    "Evaluating relational & systemic support structures...",
    "Running neural cascade matrix & priority mapping...",
    "Synthesizing personal action pathways...",
    "Preparing your complete LEWIS Insight Mirror..."
  ]

  useEffect(() => {
    if (stepIdx < steps.length - 1) {
      const timer = setTimeout(() => {
        setStepIdx(stepIdx + 1)
      }, 700)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setScreen('mirror')
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [stepIdx])

  const progressPercent = Math.round(((stepIdx + 1) / steps.length) * 100)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        width: '100%'
      }}
    >
      {/* Override generic split grid rules for this centered synthesis screen */}
      <style>{`
        .stage10-wrapper {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          width: 100% !important;
          max-width: 580px !important;
          margin: 0 auto !important;
        }
        .stage10-wrapper h1.headline::before {
          display: none !important;
        }
      `}</style>

      <div className="stage10-wrapper" style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(0, 174, 157, 0.22)',
        borderRadius: '32px',
        padding: '44px 36px',
        boxShadow: '0 20px 60px rgba(0, 174, 157, 0.12)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Eyebrow Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(0, 174, 157, 0.08)',
          border: '1px solid rgba(0, 174, 157, 0.2)',
          marginBottom: '28px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--dawn)',
            boxShadow: '0 0 10px var(--dawn)',
            animation: 'lw-pulse 2s infinite'
          }} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--dawn)',
            textTransform: 'uppercase'
          }}>
            LEWIS AI ENGINE SYNTHESIS
          </span>
        </div>

        {/* Fluid Blob Visual Core */}
        <div style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <BreathingFluidBlob size={130} duration={2.2} />
        </div>

        {/* Main Headline */}
        <h1 className="headline" style={{
          fontSize: '26px',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: '12px',
          letterSpacing: '-0.01em'
        }}>
          Synthesizing Your Mirror
        </h1>

        {/* Step Tracker Message */}
        <div style={{
          minHeight: '28px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIdx}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                color: 'var(--dawn)',
                margin: 0
              }}
            >
              {steps[stepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Animated Progress Bar */}
        <div style={{ width: '100%', maxWidth: '380px', marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justify: 'space-between',
            fontSize: '11.5px',
            fontWeight: 700,
            color: 'var(--text-mute)',
            marginBottom: '8px',
            fontFamily: "'IBM Plex Mono', monospace"
          }}>
            <span>COMPILING METRICS</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            borderRadius: '6px',
            background: 'rgba(22, 36, 31, 0.08)',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00ae9d 0%, #10b981 100%)',
                borderRadius: '6px'
              }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Subtitle Footer */}
        <p style={{
          fontSize: '12.5px',
          color: 'var(--text-mute)',
          margin: 0,
          maxWidth: '380px',
          lineHeight: '1.5'
        }}>
          Compiling your psychological metrics, stress vectors, and qualitative reflections into your personal reflection.
        </p>
      </div>
    </motion.div>
  )
}
