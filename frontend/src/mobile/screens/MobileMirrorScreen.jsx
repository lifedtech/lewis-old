import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import LewisLogo from '../../components/LewisLogo.jsx'
import { buildFullAssessmentPayload } from '../../lib/payload.js'
import { buildClientFallbackAnalysis } from '../../lib/scoring.js'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import InsightReport from '../../report/InsightReport.jsx'
import { exportReportPdf } from '../../report/exportPdf.js'
import Icon from '../../report/icons.jsx'

export default function MobileMirrorScreen() {
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          width: '100%',
          padding: '24px 20px',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <LewisLogo size={44} layout="stacked" showText={false} animated={true} />
        </div>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '22px', fontWeight: 700, color: '#414242', margin: '0 0 10px 0' }}>
          Synthesizing Your Mirror
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '14px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5, maxWidth: '320px' }}>
          Compiling your psychological metrics and cross-domain influence matrix...
        </p>
        <div style={{ width: '100%', maxWidth: '260px', height: '6px', background: '#d6edea', borderRadius: '999px', overflow: 'hidden', margin: '0 auto 8px' }}>
          <motion.div
            style={{ height: '100%', background: '#00ae9d', borderRadius: '999px' }}
            animate={{ width: `${loadProgress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
        <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '12px', fontWeight: 800, color: '#00ae9d' }}>
          {loadProgress}%
        </span>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '24px 16px',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}
      >
        <p style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
          CONNECTION STATUS
        </p>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '24px', color: '#414242', margin: '0 0 10px 0' }}>
          Unable to Load Your Synthesis
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', fontFamily: "'Nunito', sans-serif", lineHeight: 1.45, maxWidth: '320px', margin: '0 0 20px 0' }}>
          {error}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
          <button
            className="btn-primary"
            onClick={() => {
              const { payload } = buildFullAssessmentPayload(useLewisStore.getState())
              const fallbackData = buildClientFallbackAnalysis(payload)
              setLocalError(null)
              setErrorDetail(null)
              useLewisStore.setState({ analysisData: fallbackData, analysisError: null, analysisMissing: null })
            }}
            style={{ width: '100%', padding: '12px' }}
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
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #d2e7e0', background: 'transparent', color: '#00ae9d', fontWeight: 700 }}
          >
            Retry Connection
          </button>
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '12px 16px 36px 16px',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header Bar - Clean Mobile Alignment */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: '14px',
        borderBottom: '1px solid rgba(0, 174, 157, 0.14)',
        marginBottom: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              background: 'none',
              border: 'none',
              padding: '6px',
              color: '#414242',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <LewisLogo size={28} layout="horizontal" showText={true} animated={false} />
        </div>

        <span style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '10.5px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: '#00ae9d',
          background: '#e4f4ee',
          padding: '4px 10px',
          borderRadius: '999px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>
          THE MIRROR
        </span>
      </div>

      {/* Hero Header */}
      <div style={{ textAlign: 'left', marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: '28px',
          fontWeight: 700,
          color: '#414242',
          margin: '0 0 6px 0',
          letterSpacing: '-0.01em',
          textAlign: 'left',
          width: '100%'
        }}>
          Your Lewis Mirror
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '14px',
          color: '#64748b',
          margin: 0,
          lineHeight: 1.45,
          textAlign: 'left',
          width: '100%'
        }}>
          Your complete reflection of wellbeing, stability, and growth resources.
        </p>
      </div>

      {/* Main Column Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>

        {/* Care note card (if present) */}
        {analysis?.safety?.care_note && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '18px',
            borderRadius: '18px',
            border: '1.5px solid rgba(95, 187, 70, 0.35)',
            background: 'linear-gradient(135deg, rgba(95, 187, 70, 0.08) 0%, #ffffff 100%)',
            boxShadow: '0 4px 16px rgba(95, 187, 70, 0.08)',
            boxSizing: 'border-box'
          }}>
            <p style={{ color: '#2e7d32', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', fontFamily: "'Nunito', sans-serif" }}>
              <Icon name="heart" size={15} />
              A Note of Care
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#414242', margin: 0, fontFamily: "'Nunito', sans-serif" }}>
              {analysis.safety.care_note}
            </p>
          </div>
        )}

        {/* Resolution Card */}
        {analysis?.prescription && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 18px',
            borderRadius: '20px',
            border: '1.5px solid rgba(0, 174, 157, 0.3)',
            background: 'linear-gradient(135deg, rgba(0, 174, 157, 0.08) 0%, #ffffff 100%)',
            boxShadow: '0 6px 20px rgba(0, 174, 157, 0.08)',
            boxSizing: 'border-box'
          }}>
            <p style={{ color: '#00ae9d', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif" }}>
              <Icon name="compass" size={15} />
              YOUR RESOLUTION
            </p>
            <h3 style={{ color: '#414242', fontSize: '20px', marginBottom: '8px', fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
              {analysis?.prescription?.habit_title}
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#64748b', margin: 0, fontFamily: "'Nunito', sans-serif" }}>
              {analysis?.prescription?.micro_action}
            </p>
          </div>
        )}

        {/* Resilience Radar Card */}
        {chartData.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 12px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #d2e7e0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            boxSizing: 'border-box',
            width: '100%',
            overflow: 'hidden'
          }}>
            <p style={{ color: '#00ae9d', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif", alignSelf: 'flex-start', marginLeft: '6px' }}>
              <Icon name="target" size={15} />
              RESILIENCE RADAR
            </p>

            <div style={{ width: '100%', height: '260px', marginTop: '6px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="62%" data={chartData}>
                  <PolarGrid stroke="rgba(0,0,0,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#414242', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.01em' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="You"
                    dataKey="A"
                    stroke="#00ae9d"
                    strokeWidth={2.2}
                    fill="#00ae9d"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Wellbeing Landscape Card */}
        {sortedData.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 14px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #d2e7e0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <p style={{ color: '#00ae9d', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif" }}>
              <Icon name="waves" size={15} />
              THE WELLBEING LANDSCAPE
            </p>
            <p style={{ fontSize: '12.5px', marginBottom: '12px', color: '#64748b', fontFamily: "'Nunito', sans-serif" }}>
              Ranked from your strongest resources to areas asking for attention.
            </p>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradNatureMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#00ae9d" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradGrowthMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradWellbeingMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradAgencyMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradMeaningMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradEnergyMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradPhysicalMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fb923c" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradFinancialMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradCalmMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradConnectionMob" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fb7185" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradDefaultMob" x1="0" y1="0" x2="1" y2="0">
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
                    tick={{ fill: '#414242', fontSize: 11, fontWeight: 700 }}
                    width={95}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#00ae9d', borderRadius: '12px', color: '#414242', fontSize: '12px' }}
                    itemStyle={{ color: '#414242', fontWeight: 700 }}
                  />
                  <Bar
                    dataKey="A"
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                    animationDuration={1200}
                  >
                    {sortedData.map((entry, index) => {
                      const gradMapMob = {
                        'Nature': 'url(#gradNatureMob)',
                        'Growth': 'url(#gradGrowthMob)',
                        'Wellbeing': 'url(#gradWellbeingMob)',
                        'Agency': 'url(#gradAgencyMob)',
                        'Meaning': 'url(#gradMeaningMob)',
                        'Energy': 'url(#gradEnergyMob)',
                        'Physical': 'url(#gradPhysicalMob)',
                        'Financial Peace': 'url(#gradFinancialMob)',
                        'Calm': 'url(#gradCalmMob)',
                        'Connection': 'url(#gradConnectionMob)'
                      }
                      const fillId = gradMapMob[entry.subject] || 'url(#gradDefaultMob)'
                      return <Cell key={`cell-mob-${index}`} fill={fillId} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Locked Full 25-Page Insight Report Gate */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 18px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9f6 100%)',
          border: '1.5px solid rgba(0, 174, 157, 0.35)',
          boxShadow: '0 8px 24px rgba(0, 174, 157, 0.12)',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}>
          {/* Lock Icon */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#e4f4ee',
            border: '1.5px solid rgba(0, 174, 157, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00ae9d',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(0, 174, 157, 0.15)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <span style={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '10.5px',
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#00ae9d',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            COMPREHENSIVE 25-PAGE BLUEPRINT
          </span>

          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '22px',
            fontWeight: 700,
            color: '#414242',
            margin: '0 0 8px 0',
            letterSpacing: '-0.01em'
          }}>
            Your Full Lewis Insight Mirror
          </h2>

          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '13.5px',
            color: '#414242',
            lineHeight: 1.45,
            margin: '0 0 16px 0'
          }}>
            Access and download your complete 25-page report featuring cross-domain resilience maps, clinical dimension analyses, and tailored micro-habit resolutions.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            marginBottom: '20px'
          }}>
            {['10-Dimension Analysis', 'Autonomic Nervous Mapping', '30-Day Growth Roadmap', 'Instant PDF Download'].map((item) => (
              <div key={item} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1px solid #d2e7e0',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                color: '#414242',
              }}>
                <span style={{ color: '#00ae9d', fontWeight: 800 }}>✓</span> {item}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetReport}
            disabled={isDownloading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00ae9d 0%, #008f81 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(0, 174, 157, 0.28)',
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
            fontSize: '11.5px',
            color: '#64748b',
            margin: '10px 0 0 0',
            fontStyle: 'italic'
          }}>
            Safe, confidential, and instant PDF download.
          </p>
          </div>
        </div>

      {/* Hidden Render Target for Canvas-Accurate PDF Generation */}
      <div style={{ position: 'fixed', left: '-99999px', top: 0, width: '1200px', pointerEvents: 'none', opacity: 0.01 }} aria-hidden="true">
        <InsightReport report={analysis?.insight_report || analysis?.report} />
      </div>

      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginTop: '24px', fontFamily: "'Nunito', sans-serif" }}>
        Lewis reflects. It never diagnoses.
      </p>
    </motion.div>
  )
}
