import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── AI Neural Core Mirror Synthesis Vector Line Art Illustration with Motion ── */
const MirrorSynthesisIllustration = () => (
  <motion.svg
    viewBox="0 0 240 200"
    fill="none"
    style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="synthGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="synthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#36D1DC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="95" r="75" fill="url(#synthGlow)" />

    {/* Rotating Concentric Neural Orbit Rings */}
    <motion.circle
      cx="120" cy="95" r="50"
      stroke="#00AE9D" strokeWidth="1.8" strokeDasharray="6 6" fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '120px 95px' }}
    />
    <motion.circle
      cx="120" cy="95" r="32"
      stroke="#10B981" strokeWidth="1.8" strokeDasharray="4 4" fill="none"
      animate={{ rotate: -360 }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '120px 95px' }}
    />

    {/* Center AI Synthesis Diamond Core */}
    <motion.polygon
      points="120,65 140,95 120,125 100,95"
      fill="rgba(0, 174, 157, 0.08)" stroke="url(#synthGrad)" strokeWidth="2.5" strokeLinejoin="round"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 95px' }}
    />
    <circle cx="120" cy="95" r="6" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />

    {/* Orbit Sparkle Nodes */}
    <motion.circle cx="120" cy="45" r="4" fill="#00AE9D" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.circle cx="170" cy="95" r="4" fill="#10B981" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
    <motion.circle cx="120" cy="145" r="4" fill="#36D1DC" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
    <motion.circle cx="70" cy="95" r="4" fill="#00AE9D" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} />

    {/* Wavy Horizon Lines */}
    <motion.path
      d="M 28,165 Q 85,156 135,169 T 222,161"
      stroke="#00AE9D" strokeWidth="3.2" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 38,181 Q 95,172 145,185 T 212,177"
      stroke="#99E2D8" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

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
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00ae9d',
            boxShadow: '0 0 8px #00ae9d',
          }} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#044e43',
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
          color: '#16302b',
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
            color: '#4a6b62',
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
            background: '#e2e8e5',
            overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #36D1DC 0%, #10B981 100%)',
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
          color: '#4a6b62',
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
