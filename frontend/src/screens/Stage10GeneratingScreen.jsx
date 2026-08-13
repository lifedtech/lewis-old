import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { buildFullAssessmentPayload } from '../lib/payload.js'

/* ── 9-Petal Mirror Synthesis Geometry Vector Illustration ── */
const MirrorSynthesisIllustration = () => {
  const angles = [0, 40, 80, 120, 160, 200, 240, 280, 320]
  return (
    <motion.svg
      viewBox="-110 -110 220 220"
      fill="none"
      style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '0 auto' }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="synthAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Radial Aura Glow */}
      <circle cx="0" cy="0" r="95" fill="url(#synthAura)" />

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

export default function Stage10GeneratingScreen() {
  const { setScreen } = useLewisStore()
  const [stepIdx, setStepIdx] = useState(0)
  const [progressPercent, setProgressPercent] = useState(15)

  const steps = [
    "Compiling your psychological metrics & cross-domain influence matrix...",
    "Normalizing perceived stress load & baseline resilience indices...",
    "Evaluating relational, financial & systemic support structures...",
    "Running neural cascade matrix & priority tension mapping...",
    "Synthesizing personalized growth & micro-resolution pathways...",
    "Preparing your complete 25-Page Lewis Insight Mirror..."
  ]

  useEffect(() => {
    let mounted = true
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

    // Smooth active progress ticker while fetching backend data
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 94) {
          const next = prev + Math.floor(Math.random() * 5 + 3)
          const targetStep = Math.min(steps.length - 1, Math.floor((next / 94) * (steps.length - 1)))
          setStepIdx(targetStep)
          return Math.min(94, next)
        }
        return prev
      })
    }, 320)

    async function fetchAnalysis() {
      try {
        const { payload, missing } = buildFullAssessmentPayload(useLewisStore.getState())
        if (missing.length > 0) {
          useLewisStore.setState({ analysisMissing: missing, analysisData: null, analysisError: null })
          if (mounted) {
            clearInterval(interval)
            setProgressPercent(100)
            setStepIdx(steps.length - 1)
            setTimeout(() => setScreen('mirror'), 450)
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
          setTimeout(() => setScreen('mirror'), 450)
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
          setTimeout(() => setScreen('mirror'), 450)
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        margin: 'auto 0',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      {/* Single Premium Hero Card */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 250, 248, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        border: '1.5px solid rgba(0, 174, 157, 0.22)',
        boxShadow: '0 24px 70px rgba(0, 174, 157, 0.12), 0 4px 20px rgba(0, 0, 0, 0.02)',
        padding: '48px clamp(24px, 5vw, 56px)',
        maxWidth: '540px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>

        {/* Ambient Top Glow Effect */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '260px',
          height: '160px',
          background: 'radial-gradient(ellipse at center, rgba(0, 174, 157, 0.2) 0%, rgba(0, 174, 157, 0) 75%)',
          pointerEvents: 'none'
        }} />

        {/* Custom 9-Petal Mirror Synthesis Vector Illustration Centerpiece */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <MirrorSynthesisIllustration />
        </div>

        {/* Eyebrow Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: '#eaf7f5',
          border: '1px solid rgba(0, 174, 157, 0.35)',
          marginBottom: '14px'
        }}>
          <svg width="12" height="12" viewBox="0 0 82 82">
            <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="56" cy="26" r="11" fill="#00AE9D" />
            <path d="M71 41 V71 H41" fill="none" stroke="#00AE9D" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="26" cy="56" r="11" fill="#00AE9D" />
          </svg>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#017a6f',
            textTransform: 'uppercase'
          }}>
            Lewis ASSESSMENT ENGINE
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(26px, 3.5vw, 32px)',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
          color: '#1e293b',
          margin: '0 0 16px 0'
        }}>
          Synthesizing Your Mirror
        </h1>

        {/* Dynamic High-Contrast Step Message */}
        <div style={{
          minHeight: '48px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIdx}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: 1.5,
                color: '#334155',
                margin: 0,
                maxWidth: '420px'
              }}
            >
              {steps[stepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Premium Progress Meter */}
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#64748b',
              textTransform: 'uppercase'
            }}>
              COMPILING METRICS
            </span>
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '14px',
              fontWeight: 800,
              color: '#00ae9d'
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
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.06)'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00ae9d 0%, #017a6f 100%)',
                borderRadius: '999px',
                boxShadow: '0 0 12px rgba(0, 174, 157, 0.4)'
              }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </div>
        </div>

      </div>
    </motion.div>
  )
}
