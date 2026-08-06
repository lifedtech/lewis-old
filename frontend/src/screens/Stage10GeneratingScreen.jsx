import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { buildFullAssessmentPayload } from '../lib/payload.js'

/* ── 9-Petal Wheel Synthesis Geometry Illustration ── */
const MirrorSynthesisIllustration = () => {
  const angles = [0, 40, 80, 120, 160, 200, 240, 280, 320]
  return (
    <motion.svg className="stage-illustration"
      viewBox="-120 -120 240 240"
      fill="none"
      style={{ width: '100%', maxWidth: '220px', display: 'block', margin: '0 auto' }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <radialGradient id="synthGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Soft Glow */}
      <circle cx="0" cy="0" r="100" fill="url(#synthGlow)" />

      {/* Rotating 9-Petal Wheel Guide Geometry */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        {/* Concentric Guide Circles */}
        <circle cx="0" cy="0" r="32" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.35" fill="none" />
        <circle cx="0" cy="0" r="54" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.3" fill="none" />
        <circle cx="0" cy="0" r="76" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.25" fill="none" />
        <circle cx="0" cy="0" r="98" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.2" fill="none" />

        {/* 9 Radiating Axes */}
        {angles.map((deg, i) => {
          const rad = (deg - 90) * (Math.PI / 180)
          const x2 = Math.cos(rad) * 98
          const y2 = Math.sin(rad) * 98
          return (
            <line
              key={`axis-${i}`}
              x1="0" y1="0"
              x2={x2} y2={y2}
              stroke="#00AE9D" strokeWidth="1" strokeOpacity="0.2"
            />
          )
        })}

        {/* 9 Animated Petal Shapes with Pulsing Nodes */}
        {angles.map((deg, i) => {
          const rad = (deg - 90) * (Math.PI / 180)
          const rPetal = 48 + (i % 3) * 18
          const cx = Math.cos(rad) * rPetal
          const cy = Math.sin(rad) * rPetal
          const isTeal = i % 2 === 0
          return (
            <g key={`petal-${i}`}>
              <motion.line
                x1="0" y1="0" x2={cx} y2={cy}
                stroke={isTeal ? "#00AE9D" : "#5FBB46"}
                strokeWidth="2" strokeOpacity="0.75"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              />
              <motion.circle
                cx={cx} cy={cy} r="4"
                fill={isTeal ? "#00AE9D" : "#5FBB46"}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
              />
            </g>
          )
        })}
      </motion.g>

      {/* Center Hub with LEWIS Logo Mark */}
      <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#00AE9D" strokeWidth="1.5" />
      <g transform="translate(-16, -16) scale(0.39)">
        <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="41" cy="41" r="11" fill="#00AE9D" />
        <circle cx="71" cy="11" r="7" fill="#5FBB46" />
      </g>
    </motion.svg>
  )
}

export default function Stage10GeneratingScreen() {
  const { setScreen } = useLewisStore()
  const [stepIdx, setStepIdx] = useState(0)
  const [progressPercent, setProgressPercent] = useState(15)

  const steps = [
    "Scoring emotional well-being & psychological metrics...",
    "Normalizing perceived stress load & resilience index...",
    "Evaluating relational & systemic support structures...",
    "Running neural cascade matrix & priority mapping...",
    "Synthesizing personal action pathways...",
    "Preparing your complete LEWIS Insight Mirror..."
  ]

  useEffect(() => {
    let mounted = true
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

    // Smooth active progress ticker while fetching backend data
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 92) {
          const next = prev + Math.floor(Math.random() * 6 + 3)
          const targetStep = Math.min(steps.length - 1, Math.floor((next / 92) * (steps.length - 1)))
          setStepIdx(targetStep)
          return Math.min(92, next)
        }
        return prev
      })
    }, 350)

    async function fetchAnalysis() {
      try {
        const { payload, missing } = buildFullAssessmentPayload(useLewisStore.getState())
        if (missing.length > 0) {
          useLewisStore.setState({ analysisMissing: missing, analysisData: null, analysisError: null })
          if (mounted) {
            clearInterval(interval)
            setProgressPercent(100)
            setStepIdx(steps.length - 1)
            setTimeout(() => setScreen('mirror'), 400)
          }
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
        useLewisStore.setState({ analysisData: data, analysisMissing: null, analysisError: null })

        if (mounted) {
          clearInterval(interval)
          setProgressPercent(100)
          setStepIdx(steps.length - 1)
          setTimeout(() => setScreen('mirror'), 400)
        }
      } catch (err) {
        console.error(err)
        useLewisStore.setState({
          analysisError: 'We could not put your synthesis together just now. Please try again in a little while.',
          analysisData: null
        })
        if (mounted) {
          clearInterval(interval)
          setProgressPercent(100)
          setTimeout(() => setScreen('mirror'), 400)
        }
      }
    }

    fetchAnalysis()

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [setScreen, steps.length])

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        maxWidth: '620px',
        margin: '0 auto',
        padding: '24px clamp(16px, 3vw, 40px)',
        boxSizing: 'border-box',
      }}>

        {/* Top Eyebrow Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: '#e4f4ee',
          border: '1px solid #00ae9d',
          marginBottom: '16px',
        }}>
          <svg width="12" height="12" viewBox="0 0 82 82" style={{ flexShrink: 0 }}>
            <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="41" cy="41" r="11" fill="#00AE9D" />
          </svg>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#414242',
            textTransform: 'uppercase',
          }}>
            LEWIS AI ENGINE SYNTHESIS
          </span>
        </div>

        {/* AI Neural Synthesis Vector Line Art (Replaced Orb) */}
        <MirrorSynthesisIllustration />

        {/* Main Headline */}
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(28px, 3.8vw, 40px)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '16px 0 8px 0',
          color: '#414242',
        }}>
          Synthesizing Your Mirror
        </h1>

        {/* Step Tracker Message */}
        <div style={{
          minHeight: '28px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIdx}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#00ae9d',
                fontFamily: "'Nunito', sans-serif",
                margin: 0,
              }}
            >
              {steps[stepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Animated Progress Bar */}
        <div style={{ width: '100%', maxWidth: '440px', marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#414242',
            marginBottom: '8px',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            <span>COMPILING METRICS</span>
            <span style={{ color: '#00ae9d' }}>{progressPercent}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            borderRadius: '6px',
            background: '#f4f4f4',
            overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00ae9d 0%, #00ae9d 100%)',
                borderRadius: '6px',
              }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Subtitle Footer */}
        <p style={{
          fontSize: '13px',
          color: '#414242',
          margin: 0,
          maxWidth: '440px',
          fontFamily: "'Nunito', sans-serif",
          lineHeight: 1.5,
        }}>
          Compiling your psychological metrics, stress vectors, and qualitative reflections into your personal reflection.
        </p>

      </div>
    </motion.div>
  )
}
