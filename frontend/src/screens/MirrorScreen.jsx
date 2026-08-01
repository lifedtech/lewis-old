import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { buildFullAssessmentPayload } from '../lib/payload.js'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import ReactMarkdown from 'react-markdown'
import InsightReport from '../report/InsightReport.jsx'
import BreathingFluidBlob from '../components/BreathingFluidBlob.jsx'
import Icon from '../report/icons.jsx'
import './landing.css'
/* ── Backend Connection Error Vector Line Art ── */
const BackendConnectionErrorIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="errAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#00ae9d" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#errAura)" />

    {/* Disconnected Server Plug Line Art */}
    <rect x="75" y="60" width="90" height="55" rx="14" stroke="#00AE9D" strokeWidth="2.5" fill="rgba(0,174,157,0.06)" />
    <circle cx="100" cy="87.5" r="7" fill="#00ae9d" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="120" cy="87.5" r="7" fill="#5fbb46" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="140" cy="87.5" r="7" fill="#00ae9d" stroke="#FFF" strokeWidth="1.5" />

    {/* Pulsing Disconnection Warning Signal */}
    <motion.path
      d="M 120,40 L 120,50"
      stroke="#00ae9d" strokeWidth="3" strokeLinecap="round"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />

    {/* Wavy Horizon Lines */}
    <motion.path
      d="M 28,154 Q 85,145 135,158 T 222,150"
      stroke="#00AE9D" strokeWidth="3.2" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 38,170 Q 95,161 145,174 T 212,166"
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function MirrorScreen() {
  const setScreen = useLewisStore((s) => s.setScreen)

  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [errorDetail, setErrorDetail] = useState(null)
  const [missing, setMissing] = useState(null)
  const [loadingStepIdx, setLoadingStepIdx] = useState(0)
  const [attempt, setAttempt] = useState(0)

  const loadingSteps = [
    "Scoring WHO-5 Emotional Wellbeing & Resilience...",
    "Normalizing PSS-10 Perceived Stress Load...",
    "Evaluating Social Bonds & Financial Peace...",
    "Running Systemic Cascade Impact Matrix...",
    "Synthesizing Personalized Narrative & Actionable Prescription...",
    "Preparing Your Mirror Overview..."
  ]

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setLoadingStepIdx(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
    }, 1200)
    return () => clearInterval(interval)
  }, [loading, loadingSteps.length])

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    async function fetchAnalysis() {
      try {
        const { payload, missing } = buildFullAssessmentPayload(useLewisStore.getState())
        if (missing.length > 0) {
          setMissing(missing)
          setLoading(false)
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
        setAnalysis(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('We could not put your synthesis together just now. Please try again in a little while.')
        setErrorDetail(`POST ${API_BASE}/assessment/full — ${err.message}`)
        setLoading(false)
      }
    }
    fetchAnalysis()
  }, [attempt])

  if (loading) {
    return (
      <motion.div 
        className="screen-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '70vh', 
          width: '100%',
          position: 'relative' 
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '560px',
          padding: '44px 36px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          borderRadius: '32px',
          border: '1.5px solid rgba(255, 148, 102, 0.3)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.08), 0 0 45px rgba(255, 148, 102, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ambient Glow Aura */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 174, 157, 0.35) 0%, rgba(255, 148, 102, 0.25) 50%, transparent 80%)',
            filter: 'blur(35px)',
            pointerEvents: 'none'
          }} />

          {/* Dynamic Morphing Fluid Core */}
          <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
            <BreathingFluidBlob size={135} duration={3} />
          </div>

          {/* Engine Header Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', zIndex: 1 }}>
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: 'var(--dawn)', 
                boxShadow: '0 0 10px var(--dawn)' 
              }} 
            />
            <span style={{ 
              fontFamily: '"IBM Plex Mono", monospace', 
              fontSize: '11px', 
              letterSpacing: '0.14em', 
              color: 'var(--dawn)', 
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              LEWIS ASSESSMENT ENGINE
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: '0 0 14px 0', zIndex: 1 }}>
            Synthesizing Your Mirror
          </h2>

          {/* Animated Step Messages */}
          <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', zIndex: 1 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingStepIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ fontSize: '14px', color: 'var(--text-mute)', margin: 0, fontWeight: 500 }}
              >
                {loadingSteps[loadingStepIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div style={{ width: '80%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', margin: '24px 0 14px', overflow: 'hidden', zIndex: 1 }}>
            <motion.div 
              style={{ height: '100%', background: 'linear-gradient(90deg, #00ae9d 0%, #FF9466 100%)' }}
              animate={{ width: ['10%', '98%'] }}
              transition={{ duration: 7, ease: "easeInOut" }}
            />
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontStyle: 'italic', margin: 0, zIndex: 1 }}>
            LEWIS compiles your psychological metrics into personalized systemic insights.
          </p>
        </div>
      </motion.div>
    )
  }

  if (missing) {
    return (
      <motion.section className="screen active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <p className="eyebrow" style={{ textAlign: 'center' }}>Almost there</p>
        <h1 className="headline" style={{ textAlign: 'center' }}>A few check-ins still need answers.</h1>
        <p className="sub" style={{ textAlign: 'center', maxWidth: '480px', marginBottom: '24px' }}>
          LEWIS only reflects what you actually shared — unanswered questions are
          never guessed or filled in for you.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px' }}>
          {missing.map((m) => (
            <button key={m.screen} className="btn-primary" style={{ width: '100%' }} onClick={() => setScreen(m.screen)}>
              Finish: {m.label}
            </button>
          ))}
        </div>
      </motion.section>
    )
  }

  if (error) {
    return (
      <motion.div
        className="screen-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.65fr',
          gap: 'clamp(24px, 4vw, 52px)',
          alignItems: 'stretch',
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          padding: '0 clamp(16px, 3vw, 40px)',
          boxSizing: 'border-box',
        }}>

          {/* LEFT — Eyebrow + Title + Subtitle + Vector Line Art */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'center' }}>
            <div>
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#00ae9d',
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
              }}>
                CONNECTION STATUS
              </p>
              <h1 style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(34px, 4.4vw, 56px)',
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
                margin: 0,
                color: '#414242',
                textWrap: 'balance',
              }}>
                Unable to Load<br />Your Synthesis
              </h1>
              <p style={{
                margin: '12px 0 0 2px',
                fontSize: 'clamp(13px, 1.5vw, 15.5px)',
                color: '#414242',
                fontFamily: "'Nunito', sans-serif",
                lineHeight: 1.5,
                maxWidth: '350px',
              }}>
                {error}
              </p>
            </div>
            <BackendConnectionErrorIllustration />
          </div>

          {/* RIGHT — DIAGNOSTICS & RETRY + Warning Card + Pinned Retry Button */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#414242',
              textTransform: 'uppercase',
              textAlign: 'right',
              margin: '0 0 12px 0',
            }}>
              DIAGNOSTICS & RETRY
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '24px',
              borderRadius: '20px',
              border: '1.5px solid #fee2e2',
              background: '#fef2f2',
              boxSizing: 'border-box',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>⚠️</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '18px', color: '#991b1b' }}>
                  Synthesis Unavailable
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '13.5px',
                color: '#7f1d1d',
                fontFamily: "'Nunito', sans-serif",
                lineHeight: 1.5,
              }}>
                Your responses are safe. LEWIS just needs a moment before it can synthesise them. Please try again after a while.
              </p>
              {/* The real status and body, dev only: this card is the one place
                  a failure is visible, and "try again later" is not a diagnosis. */}
              {import.meta.env.DEV && errorDetail && (
                <pre style={{
                  margin: 0,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#fee2e2',
                  color: '#7f1d1d',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '11.5px',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '190px',
                  overflow: 'auto',
                }}>
                  {errorDetail}
                </pre>
              )}
            </div>

            {/* Action button pinned at bottom right */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '16px', flexShrink: 0 }}>
              <button
                className="btn-primary"
                onClick={() => {
                  // Retry the request, never reload: a reload resets the store
                  // and the whole assessment has to be answered again.
                  setError(null)
                  setErrorDetail(null)
                  setLoadingStepIdx(0)
                  setLoading(true)
                  setAttempt((n) => n + 1)
                }}
                style={{ padding: '12px 38px' }}
              >
                Try Again
              </button>
            </div>

          </div>

        </div>
      </motion.div>
    )
  }

  const dims = analysis?.dimensions
  let chartData = []
  let sortedData = []
  
  if (dims) {
    const dimKeys = [
      { key: 'emotional', label: 'Wellbeing' },
      { key: 'calm', label: 'Calm' },
      { key: 'relationships', label: 'Connection' },
      { key: 'accomplishment', label: 'Agency' },
      { key: 'meaning', label: 'Meaning' },
      { key: 'financial', label: 'Financial Peace' },
      { key: 'growth', label: 'Growth' },
      { key: 'environment', label: 'Nature' },
      { key: 'physical', label: 'Physical' },
      { key: 'energy', label: 'Energy' }
    ]
    
    dimKeys.forEach(({ key, label }) => {
      if (dims[key] && dims[key].score !== null) {
        chartData.push({ subject: label, A: dims[key].score, fullMark: 100 })
      }
    })

    sortedData = [...chartData].sort((a, b) => b.A - a.A)
  }

  return (
    <motion.div
      className="mirror-page-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Hero Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--dawn)',
          textTransform: 'uppercase',
          background: 'rgba(0, 174, 157, 0.1)',
          padding: '6px 14px',
          borderRadius: '999px',
          display: 'inline-block',
          marginBottom: '12px'
        }}>
          Systemic Overview
        </span>
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 800,
          color: 'var(--text)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.03em'
        }}>
          The Mirror
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '16px',
          color: 'var(--text-mute)',
          margin: 0
        }}>
          Your complete reflection of wellbeing, stability, and growth resources.
        </p>
      </div>

      {/* Care note first: safety renders before everything else (INV-06/08) */}
      {analysis?.safety?.care_note && (
        <div className="mirror-card care-note-card" style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 28px',
          borderRadius: '20px',
          border: '1.5px solid rgba(95, 187, 70, 0.35)',
          background: 'linear-gradient(135deg, rgba(95, 187, 70, 0.10) 0%, rgba(255, 255, 255, 0.95) 100%)',
          boxShadow: '0 8px 24px rgba(95, 187, 70, 0.12)'
        }}>
          <p className="mirror-label" style={{ color: 'var(--sage)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <Icon name="heart" size={16} />
            A note of care
          </p>
          <p className="mirror-text" style={{ fontSize: '15.5px', lineHeight: '1.7', color: 'var(--text)', margin: 0 }}>
            {analysis.safety.care_note}
          </p>
        </div>
      )}

      {dims && (
        <>
          {/* Prominent Resolution Card */}
          <div className="mirror-card resolution-card" style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '28px 32px',
            borderRadius: '24px',
            border: '1.5px solid rgba(0, 174, 157, 0.35)',
            background: 'linear-gradient(135deg, rgba(0, 174, 157, 0.10) 0%, rgba(255, 255, 255, 0.95) 100%)',
            boxShadow: '0 10px 30px rgba(0, 174, 157, 0.12)'
          }}>
            <p className="mirror-label" style={{ color: 'var(--dawn)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <Icon name="compass" size={16} />
              Your Resolution
            </p>
            <h3 style={{ color: 'var(--text)', fontSize: '24px', marginBottom: '8px', fontWeight: '800', fontFamily: "'Manrope', sans-serif" }}>
              {analysis?.prescription?.habit_title}
            </h3>
            <p className="mirror-text" style={{ fontSize: '15.5px', lineHeight: '1.6', color: 'var(--text-mute)', margin: 0 }}>
              {analysis?.prescription?.micro_action}
            </p>
          </div>

          {/* Visual Overview Dashboard Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '24px',
            width: '100%'
          }}>
            {/* Resilience Radar Card */}
            <div className="mirror-card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1.5px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <p className="mirror-label" style={{ color: 'var(--dawn)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, alignSelf: 'flex-start' }}>
                <Icon name="target" size={16} />
                Resilience Radar
              </p>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(0, 174, 157, 0.08), transparent 70%)', pointerEvents: 'none' }}></div>
              
              <div style={{ width: '100%', height: '300px', marginTop: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="rgba(0,0,0,0.12)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 12, fontWeight: 600, letterSpacing: '0.02em' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="You"
                      dataKey="A"
                      stroke="var(--dawn)"
                      strokeWidth={2.5}
                      fill="var(--dawn)"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wellbeing Landscape Card */}
            <div className="mirror-card" style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1.5px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
            }}>
              <p className="mirror-label" style={{ color: 'var(--dawn)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Icon name="waves" size={16} />
                The Wellbeing Landscape
              </p>
              <p className="mirror-text" style={{ fontSize: '13.5px', marginBottom: '16px', color: 'var(--text-mute)' }}>
                Ranked from your strongest resources to areas asking for attention.
              </p>
              
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradThriving" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#00ae9d" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="gradSteady" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fde047" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="gradStretched" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--dawn-glow)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="var(--dawn)" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="gradDepleted" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#be123c" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      dataKey="subject" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text)', fontSize: 12, fontWeight: 600 }} 
                      width={110} 
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.04)'}} 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'var(--dawn)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'var(--text)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'var(--text)', fontWeight: 700 }}
                    />
                    <Bar 
                      dataKey="A" 
                      radius={[0, 8, 8, 0]} 
                      barSize={24}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {sortedData.map((entry, index) => {
                        let fillId = "url(#gradDepleted)"
                        if (entry.A >= 70) fillId = "url(#gradThriving)"
                        else if (entry.A >= 55) fillId = "url(#gradSteady)"
                        else if (entry.A >= 40) fillId = "url(#gradStretched)"
                        return <Cell key={`cell-${index}`} fill={fillId} />
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* The full Insight Report (v4.0 25-page layout), downloadable as PDF */}
      {analysis?.insight_report ? (
        <div style={{ marginTop: '16px' }}>
          <InsightReport report={analysis.insight_report} />
        </div>
      ) : (
        <div className="mirror-card ai-report-content" style={{ padding: '32px', background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.06)' }}>
          <ReactMarkdown
            components={{
              h1: ({ ...props }) => <h2 className="mirror-label notice" style={{ marginTop: '32px', marginBottom: '16px', fontSize: '16px' }} {...props} />,
              h2: ({ ...props }) => <h3 className="mirror-title" style={{ marginTop: '24px', marginBottom: '12px', fontSize: '18px' }} {...props} />,
              p: ({ ...props }) => <p className="mirror-text" style={{ marginBottom: '16px', lineHeight: '1.6' }} {...props} />,
              ul: ({ ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px', color: 'var(--text-sub)' }} {...props} />,
              li: ({ ...props }) => <li style={{ marginBottom: '8px' }} {...props} />,
              blockquote: ({ ...props }) => <blockquote style={{ borderLeft: '4px solid var(--dawn)', paddingLeft: '16px', fontStyle: 'italic', color: 'var(--text-main)', background: 'var(--panel-border)', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px' }} {...props} />,
              strong: ({ ...props }) => <strong style={{ color: 'var(--text-main)', fontWeight: 600 }} {...props} />
            }}
          >
            {analysis?.narrative}
          </ReactMarkdown>
        </div>
      )}

      <p className="closing-line" style={{ textAlign: 'center', color: 'var(--text-mute)', fontSize: '13.5px', marginTop: '16px' }}>
        LEWIS reflects. It never diagnoses.
      </p>
      </div>

    </motion.div>
  )
}
