import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const GENERATION_STEPS = [
  'Reading your reflections...',
  'Mapping your nine areas of wellbeing...',
  'Reading how you described your inner state...',
  'Noticing your stress and recovery pattern...',
  'Cross-checking what you said with what you showed...',
  'Seeing how your areas connect...',
  'Building your personal reflection...'
]

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
        <radialGradient id="synthAuraSl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="95" fill="url(#synthAuraSl)" />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="0" cy="0" r="30" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.4" fill="none" />
        <circle cx="0" cy="0" r="52" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.3" fill="none" />
        <circle cx="0" cy="0" r="74" stroke="#00AE9D" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.22" fill="none" />

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

      <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#00AE9D" strokeWidth="1.8" />
      <circle cx="0" cy="0" r="10" fill="#00AE9D" />
      <circle cx="0" cy="0" r="4" fill="#ffffff" />
    </motion.svg>
  )
}

export default function StreamlinedGeneratingScreen() {
  const store = useLewisStore()
  const { setStreamlinedRRO, setScreen } = store
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progressPercent, setProgressPercent] = useState(15)

  useEffect(() => {
    // Ensure streamlined flow mode and pricing are locked in
    useLewisStore.setState({
      isReportUnlocked: false,
      unlockedReportId: null,
      flowMode: 'streamlined',
      selectedPlan: 'streamlined_report',
      planPrice: 349
    })

    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          const next = prev + 1
          setProgressPercent(Math.round(((next + 1) / GENERATION_STEPS.length) * 100))
          return next
        }
        return prev
      })
    }, 1400)

    // Trigger backend deterministic scoring
    const generate = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        const payload = {
          session_id: store.journeySessionId,
          name: store.name || 'Friend',
          email: store.email,
          who5: store.who5,
          pss10: store.pss10,
          ucla3: store.ucla3,
          gse6: store.gse6,
          purpose: store.purpose,
          cfpb5: store.cfpb5,
          ins: store.ins,
          growth: store.growth,
          growth_recency: store.growthRecency,
          sleep_quality: store.sleepQuality,
          activity_level: store.bodyMovement,
          nature_access: store.natureAccess,
          cultural_belonging_1: store.culturalBelonging_1,
          transcendent_connection: store.transcendentConnection,
          financial_stress: store.financialStress,
          income_regularity: store.incomeRegularity,
          active_pressures: store.activePressures,
          domain_sort: store.domainSort,
          priority_top3: store.priorityTop3,
          tension_confirmed: store.tensionConfirmed,
          bright_spot_text: store.brightSpotText,
          deepdive_flags: store.deepdiveFlags,
          deepdive_trajectories: store.deepdiveTrajectories,
          deepdive_frictions: store.deepdiveFrictions,
          support_preference: store.supportPreference,
          content_preference: store.contentPreference,
          planner_readiness: store.plannerReadiness,
          prior_attempts: store.priorAttempts,
          somatic_zones: store.bodyMapZones,
          ns_portrait: store.nsPortrait,
          stress_cluster: store.stressCluster,
          recovery_responsiveness: store.recoveryResponsiveness,
          tension_before: store.tensionBefore,
          tension_after: store.tensionAfter,
          energy_arc: store.energyArcPattern,
          cumulative_load: store.cumulativeLoad5,
          arrival_word: store.arrivalWord
        }

        const res = await fetch(`${API_BASE}/api/report/streamlined-generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (res.ok) {
          const data = await res.json()
          if (data.rro) {
            setStreamlinedRRO(data.rro)
          }
        }
      } catch (e) {
        console.warn('Backend generation fallback, rendering locally:', e)
      }

      // Smooth auto transition to mirror teaser
      setTimeout(() => {
        setScreen('sl_mirror')
      }, 9500)
    }

    generate()
    return () => clearInterval(stepInterval)
  }, [])

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
        padding: '20px',
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
        margin: '0 0 16px 0',
      }}>
        SYNTHESIZING YOUR REFLECTION
      </p>

      {/* Rotating 9-Petal Vector Canvas */}
      <div style={{ margin: '10px 0 28px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <MirrorSynthesisIllustration />
      </div>

      {/* Dynamic Animated Status Step */}
      <div style={{ minHeight: '68px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentStepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(20px, 2.8vw, 30px)',
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              margin: '0 0 8px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '560px',
            }}
          >
            {GENERATION_STEPS[currentStepIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Progress Track */}
      <div style={{ width: '100%', maxWidth: '380px', marginTop: '14px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '11px', fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: 'var(--text-sub, #657370)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Processing Analysis
          </span>
          <span style={{ fontSize: '12px', fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: 'var(--dawn, #00ae9d)' }}>
            {progressPercent}%
          </span>
        </div>

        {/* 7 Segmented Progress Bars */}
        <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
          {GENERATION_STEPS.map((_, idx) => (
            <div
              key={idx}
              style={{
                height: '4px',
                flex: 1,
                borderRadius: '10px',
                background: idx <= currentStepIndex ? 'var(--dawn, #00ae9d)' : 'rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
