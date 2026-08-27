import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import { buildFullAssessmentPayload } from '../../lib/payload.js'

/* ── 9-Petal Mirror Synthesis Geometry Vector Illustration ── */
const MirrorSynthesisIllustration = () => {
  const angles = [0, 40, 80, 120, 160, 200, 240, 280, 320]
  return (
    <motion.svg
      viewBox="-110 -110 220 220"
      fill="none"
      style={{ width: '100%', maxWidth: '190px', display: 'block', margin: '0 auto' }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="synthAuraMob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Radial Aura Glow */}
      <circle cx="0" cy="0" r="95" fill="url(#synthAuraMob)" />

      {/* Rotating Guide Geometry */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {/* Concentric Guide Rings */}
        <circle cx="0" cy="0" r="30" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.4" fill="none" />
        <circle cx="0" cy="0" r="52" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.3" fill="none" />
        <circle cx="0" cy="0" r="74" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.22" fill="none" />

        {/* 9 Radiating Axes */}
        {angles.map((deg, i) => {
          const rad = (deg - 90) * (Math.PI / 180)
          const x2 = Math.cos(rad) * 78
          const y2 = Math.sin(rad) * 78
          return (
            <line
              key={`axis-${i}`}
              x1="0" y1="0"
              x2={x2} y2={y2}
              stroke="#00AE9D" strokeWidth="1" strokeOpacity="0.25"
            />
          )
        })}

        {/* 9 Animated Petal Rays & Nodes */}
        {angles.map((deg, i) => {
          const rad = (deg - 90) * (Math.PI / 180)
          const rPetal = 44 + (i % 3) * 16
          const cx = Math.cos(rad) * rPetal
          const cy = Math.sin(rad) * rPetal
          const isTeal = i % 2 === 0
          return (
            <g key={`petal-${i}`}>
              <motion.line
                x1="0" y1="0" x2={cx} y2={cy}
                stroke={isTeal ? "#00AE9D" : "#5FBB46"}
                strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: i * 0.08 }}
              />
              <motion.circle
                cx={cx} cy={cy} r="4.5"
                fill={isTeal ? "#00AE9D" : "#5FBB46"}
                animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.12 }}
              />
            </g>
          )
        })}
      </motion.g>

      {/* Center Hub */}
      <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#00AE9D" strokeWidth="1.8" />
      <circle cx="0" cy="0" r="10" fill="#00AE9D" />
      <circle cx="0" cy="0" r="4" fill="#ffffff" />
    </motion.svg>
  )
}

export default function MobileStage10GeneratingScreen() {
  const { setScreen } = useLewisStore()
  const [stepIdx, setStepIdx] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)

  const steps = [
    "Compiling your psychological metrics & cross-domain influence matrix...",
    "Normalizing perceived stress load & baseline resilience indices...",
    "Evaluating relational, financial & systemic support structures...",
    "Running neural cascade matrix & priority tension mapping...",
    "Synthesizing personalized growth & micro-resolution pathways...",
    "Preparing your personalized Lewis Insight Mirror..."
  ]

  useEffect(() => {
    let mounted = true
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const TOTAL_DURATION_MS = 26000 // 26 second sequence for smooth cold-start & LLM generation tolerance
    const startTime = Date.now()
    let isFinished = false

    // 1. Fire backend analysis synthesis
    async function runFetch() {
      try {
        const { payload, missing } = buildFullAssessmentPayload(useLewisStore.getState())
        if (missing.length > 0) {
          useLewisStore.setState({ analysisMissing: missing, analysisData: null, analysisError: null })
          return
        }

        const response = await fetch(`${API_BASE}/assessment/full`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const detail = await response.text()
          throw new Error(`${response.status}: ${detail.slice(0, 300)}`)
        }

        const data = await response.json()
        if (mounted) {
          useLewisStore.setState({ analysisData: data, analysisMissing: null, analysisError: null })
          isFinished = true
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          useLewisStore.setState({
            analysisError: 'We could not put your synthesis together just now. Please try again in a little while.',
            analysisData: null
          })
        }
      }
    }

    runFetch()

    // 2. High-precision 26s progress ticker with smart completion
    const timer = setInterval(() => {
      if (!mounted) return
      const elapsed = Date.now() - startTime
      
      // Calculate target progress
      let currentProgress = Math.floor((elapsed / TOTAL_DURATION_MS) * 100)
      
      // If backend hasn't responded yet, hold comfortably at 94%
      if (!isFinished && currentProgress > 94) {
        currentProgress = 94
      }

      // If backend has completed, allow reaching 100%
      if (isFinished) {
        currentProgress = Math.max(currentProgress, 95)
        if (elapsed >= 10000 || currentProgress >= 98) {
          currentProgress = 100
        }
      }

      const clamped = Math.min(100, Math.max(0, currentProgress))
      setProgressPercent(clamped)

      const currentStep = Math.min(
        steps.length - 1,
        Math.floor((clamped / 100) * steps.length)
      )
      setStepIdx(currentStep)

      if (clamped >= 100) {
        clearInterval(timer)
        setTimeout(() => {
          if (mounted) {
            setScreen('mirror')
          }
        }, 700)
      }
    }, 60)

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [setScreen, steps.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '75vh',
        padding: '24px 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Central Geometry Illustration */}
      <div style={{ marginBottom: '24px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <MirrorSynthesisIllustration />
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 700,
        fontSize: 'clamp(22px, 6vw, 28px)',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        margin: 0,
        color: '#414242',
      }}>
        Preparing your personalised Well-being report
      </h1>

      {/* Dynamic Animated Status Step */}
      <div style={{
        minHeight: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: '12px 0 24px 0',
      }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '14.5px',
              fontWeight: 600,
              lineHeight: 1.45,
              color: '#414242',
              margin: 0,
              maxWidth: '340px',
            }}
          >
            {steps[stepIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Clean Progress Meter */}
      <div style={{
        width: '100%',
        maxWidth: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#00ae9d',
            textTransform: 'uppercase',
          }}>
            COMPILING METRICS
          </span>
          <span style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '14px',
            fontWeight: 800,
            color: '#00ae9d',
          }}>
            {progressPercent}%
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '8px',
          borderRadius: '999px',
          background: '#d6edea',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'linear' }}
            style={{
              width: '0%',
              height: '100%',
              background: 'linear-gradient(90deg, #00ae9d 0%, #008f81 100%)',
              borderRadius: '999px',
              boxShadow: '0 0 8px rgba(0, 174, 157, 0.35)',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
