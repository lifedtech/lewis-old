import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import { buildFullAssessmentPayload } from '../lib/payload.js'
import { buildClientFallbackAnalysis } from '../lib/scoring.js'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import InsightReport from '../report/InsightReport.jsx'
import { exportReportPdf } from '../report/exportPdf.js'
import Icon from '../report/icons.jsx'
import './landing.css'
/* ── Backend Connection Error Vector Line Art ── */
const BackendConnectionErrorIllustration = () => (
  <motion.svg className="stage-illustration"
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
  const { setScreen } = useLewisStore()
  const storeAnalysis = useLewisStore((s) => s.analysisData)
  const storeError = useLewisStore((s) => s.analysisError)

  const [localError, setLocalError] = useState(null)
  const [errorDetail, setErrorDetail] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [loadProgress, setLoadProgress] = useState(storeAnalysis ? 100 : 25)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const analysis = storeAnalysis
  const error = localError || storeError

  const handleGetReport = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    setDownloadSuccess(false)
    try {
      await exportReportPdf('Lewis-Insight-Report.pdf')
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    } catch (err) {
      console.error('PDF export fallback:', err)
      window.print()
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    if (storeAnalysis) {
      return
    }

    const interval = setInterval(() => {
      setLoadProgress((prev) => (prev < 92 ? prev + Math.floor(Math.random() * 6 + 3) : prev))
    }, 350)

    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    async function fetchAnalysis() {
      try {
        const { payload } = buildFullAssessmentPayload(useLewisStore.getState())

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
        setLoadProgress(100)
        useLewisStore.setState({ analysisData: data, analysisMissing: null, analysisError: null })
      } catch (err) {
        console.error(err)
        const msg = 'We could not put your synthesis together just now. Please try again in a little while.'
        setLocalError(msg)
        setErrorDetail(`POST ${API_BASE}/assessment/full — ${err.message}`)
        useLewisStore.setState({ analysisError: msg })
      } finally {
        clearInterval(interval)
      }
    }
    fetchAnalysis()

    return () => clearInterval(interval)
  }, [attempt, storeAnalysis])

  if (!analysis && !error) {
    return (
      <motion.div
        className="screen-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          width: '100%',
        }}
      >
        <div className="mirror-card" style={{
          width: '100%',
          maxWidth: '520px',
          padding: '44px 36px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: '1.5px solid rgba(0, 174, 157, 0.25)',
          boxShadow: '0 16px 48px rgba(0, 174, 157, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <LewisLogo size={52} layout="stacked" showText={false} animated={true} />
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '24px', fontWeight: 800, color: '#414242', margin: '0 0 12px 0' }}>
            Synthesizing Your Mirror
          </h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '14px', color: '#666666', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Lewis is compiling your psychological metrics and cross-domain influence matrix into your complete insight report...
          </p>
          <div style={{ width: '80%', height: '6px', background: 'rgba(0, 174, 157, 0.12)', borderRadius: '6px', overflow: 'hidden', margin: '0 auto 8px' }}>
            <motion.div
              style={{ height: '100%', background: '#00ae9d', borderRadius: '6px' }}
              animate={{ width: `${loadProgress}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, color: '#00ae9d' }}>
            {loadProgress}%
          </span>
        </div>
      </motion.div>
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
        <div className="stage-split" style={{
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
                fontFamily: '"Nunito", sans-serif',
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

            <p className="stage-right-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#414242',
              textTransform: 'uppercase',
              
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
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
                Your responses are safe. Lewis just needs a moment before it can synthesise them. Please try again after a while.
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
                  fontFamily: '"Nunito", sans-serif',
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

            {/* Action buttons pinned at bottom right */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', width: '100%', marginTop: 'auto', paddingTop: '16px', flexShrink: 0, flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  const { payload } = buildFullAssessmentPayload(useLewisStore.getState())
                  const fallbackData = buildClientFallbackAnalysis(payload)
                  setLocalError(null)
                  setErrorDetail(null)
                  useLewisStore.setState({ analysisData: fallbackData, analysisError: null, analysisMissing: null })
                }}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #00ae9d 0%, #008f81 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: '14px',
                  boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                }}
              >
                View Reflection Offline
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setLocalError(null)
                  setErrorDetail(null)
                  useLewisStore.setState({ analysisError: null, analysisData: null, analysisMissing: null })
                  setAttempt((n) => n + 1)
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(0, 174, 157, 0.4)',
                  color: '#00ae9d',
                  fontWeight: 600,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Retry Connection
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
      {/* Web Dashboard UI — Excluded during PDF print export */}
      <div className="mirror-web-ui">
        {/* Full-width Edge-to-Edge Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '16px clamp(12px, 3vw, 32px)',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(0, 174, 157, 0.12)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                useLewisStore.setState({ analysisData: null, analysisError: null, analysisMissing: null })
                if (typeof window !== 'undefined' && window.history.state?.screen) {
                  window.history.back()
                } else {
                  setScreen('stage9Sensory')
                }
              }}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: '#414242', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: "'Nunito', system-ui, sans-serif",
                fontSize: '14px', fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
              title="Go back"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00ae9d'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#414242'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <LewisLogo size={32} layout="horizontal" showText={true} animated={false} />
          </div>

          <span style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#00ae9d',
            textTransform: 'uppercase'
          }}>
            THE MIRROR
          </span>

          <span style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '11.5px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#414242',
            textTransform: 'uppercase'
          }}>
            WELLBEING INTELLIGENCE
          </span>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
          {/* Hero Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              color: 'var(--text)',
              margin: '0 0 8px 0',
              letterSpacing: '-0.03em',
              textAlign: 'center',
              width: '100%',
            }}>
              Your Lewis Mirror
            </h1>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '16px',
              color: 'var(--text-mute)',
              margin: '0 0 16px 0',
              textAlign: 'center',
              width: '100%',
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: '24px',
                width: '100%'
              }}>
                {/* Resilience Radar Card */}
                <div className="mirror-card" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px clamp(16px, 3vw, 28px)',
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

                  <div style={{ width: '100%', height: '290px', marginTop: '12px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="rgba(0,0,0,0.12)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em' }} />
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
                  padding: '24px clamp(16px, 3vw, 28px)',
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1.5px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                }}>
                  <p className="mirror-label" style={{ color: 'var(--dawn)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                    <Icon name="waves" size={16} />
                    The Wellbeing Landscape
                  </p>
                  <p className="mirror-text" style={{ fontSize: '13px', marginBottom: '14px', color: 'var(--text-mute)' }}>
                    Ranked from your strongest resources to areas asking for attention.
                  </p>

                  <div style={{ width: '100%', height: '290px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 15, left: 5, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradNature" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#00ae9d" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradGrowth" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradWellbeing" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradAgency" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradMeaning" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradEnergy" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradPhysical" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#fb923c" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#ea580c" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradFinancial" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#0f766e" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradCalm" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#0891b2" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradConnection" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#e11d48" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradDefault" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#475569" stopOpacity={1} />
                          </linearGradient>
                        </defs>

                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                          dataKey="subject"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--text)', fontSize: 11.5, fontWeight: 600 }}
                          width={105}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                          contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'var(--dawn)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'var(--text)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                          itemStyle={{ color: 'var(--text)', fontWeight: 700 }}
                        />
                        <Bar
                          dataKey="A"
                          radius={[0, 8, 8, 0]}
                          barSize={22}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        >
                          {sortedData.map((entry, index) => {
                            const gradMap = {
                              'Nature': 'url(#gradNature)',
                              'Growth': 'url(#gradGrowth)',
                              'Wellbeing': 'url(#gradWellbeing)',
                              'Agency': 'url(#gradAgency)',
                              'Meaning': 'url(#gradMeaning)',
                              'Energy': 'url(#gradEnergy)',
                              'Physical': 'url(#gradPhysical)',
                              'Financial Peace': 'url(#gradFinancial)',
                              'Calm': 'url(#gradCalm)',
                              'Connection': 'url(#gradConnection)'
                            }
                            const fillId = gradMap[entry.subject] || 'url(#gradDefault)'
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

          {/* Locked Full 25-Page Insight Report Gate */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'clamp(28px, 4vw, 40px) clamp(18px, 4vw, 32px)',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9f6 100%)',
            border: '1.5px solid rgba(0, 174, 157, 0.35)',
            boxShadow: '0 16px 40px rgba(0, 174, 157, 0.12), 0 2px 8px rgba(0, 0, 0, 0.03)',
            textAlign: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Lock Icon */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#e4f4ee',
              border: '1.5px solid rgba(0, 174, 157, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00ae9d',
              marginBottom: '14px',
              boxShadow: '0 4px 12px rgba(0, 174, 157, 0.15)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            {/* Eyebrow */}
            <span style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              COMPREHENSIVE 25-PAGE BLUEPRINT
            </span>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(22px, 3.2vw, 28px)',
              fontWeight: 800,
              color: '#414242',
              margin: '0 0 10px 0',
              letterSpacing: '-0.02em'
            }}>
              Your Full Lewis Insight Mirror
            </h2>

            {/* Description */}
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 'clamp(14px, 1.5vw, 15px)',
              color: '#414242',
              maxWidth: '540px',
              lineHeight: 1.5,
              margin: '0 0 20px 0'
            }}>
              Access and download your complete 25-page report featuring cross-domain resilience maps, clinical dimension analyses, and tailored micro-habit resolutions.
            </p>

            {/* Feature Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px',
              maxWidth: '580px'
            }}>
              {['10-Dimension Analysis', 'Autonomic Nervous Mapping', '30-Day Growth Roadmap', 'Instant PDF Download'].map((item) => (
                <span key={item} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: '#ffffff',
                  border: '1px solid #d2e7e0',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#414242',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                  <span style={{ color: '#00ae9d', fontWeight: 800 }}>✓</span> {item}
                </span>
              ))}
            </div>

            {/* Download Report CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetReport}
              disabled={isDownloading}
              className="btn-primary"
              style={{
                padding: '14px 34px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #00ae9d 0%, #008f81 100%)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(0, 174, 157, 0.28)',
                cursor: isDownloading ? 'wait' : 'pointer',
                border: 'none',
                opacity: isDownloading ? 0.8 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {isDownloading ? 'Generating Report...' : (downloadSuccess ? '✓ Report Downloaded!' : 'Get your report')}
            </motion.button>

            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '12px',
              color: '#64748b',
              margin: '10px 0 0 0',
              fontStyle: 'italic'
            }}>
              Safe, confidential, and instant PDF download.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Render Target for Canvas-Accurate PDF Generation */}
      <div style={{ position: 'fixed', left: '-99999px', top: 0, width: '1200px', pointerEvents: 'none', opacity: 0.01 }} aria-hidden="true">
        <InsightReport report={analysis?.report} />
      </div>

      <p className="closing-line mirror-web-ui" style={{ textAlign: 'center', color: 'var(--text-mute)', fontSize: '13.5px', marginTop: '16px' }}>
        Lewis reflects. It never diagnoses.
      </p>
    </motion.div>
  )
}
