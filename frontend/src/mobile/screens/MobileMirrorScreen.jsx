import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import LewisLogo from '../../components/LewisLogo.jsx'
import { buildFullAssessmentPayload } from '../../lib/payload.js'
import { buildClientFallbackAnalysis } from '../../lib/scoring.js'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import InsightReport from '../../report/InsightReport.jsx'
import { exportReportPdf } from '../../report/exportPdf.js'
import AbstractLineBackground from '../../components/AbstractLineBackground.jsx'
import { initiateCheckout } from '../../lib/payment.js'

export default function MobileMirrorScreen() {
  const { setScreen, email, name, isReportUnlocked, checkReportEntitlement, fetchPaymentConfig, paymentConfig, theme } = useLewisStore()
  const storeAnalysis = useLewisStore((s) => s.analysisData)
  const storeError = useLewisStore((s) => s.analysisError)

  const [localError, setLocalError] = useState(null)
  const [errorDetail, setErrorDetail] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [loadProgress, setLoadProgress] = useState(storeAnalysis ? 100 : 25)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const analysis = storeAnalysis
  const error = localError || storeError

  useEffect(() => {
    fetchPaymentConfig()
  }, [])

  useEffect(() => {
    if (analysis?.report_uuid) {
      checkReportEntitlement(analysis.report_uuid)
    }
  }, [analysis?.report_uuid])

  const reportPrice = paymentConfig?.plans?.personal_report?.amount_inr 
    ? `₹${paymentConfig.plans.personal_report.amount_inr}` 
    : '₹749'

  const handleGetReport = async () => {
    if (isDownloading || isUnlocking) return

    if (!isReportUnlocked) {
      useLewisStore.setState({
        flowMode: 'full',
        selectedPlan: 'personal_report',
        planPrice: 749
      })
      setScreen('billing')
      return
    }

    setIsDownloading(true)
    setDownloadSuccess(false)
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const repId = analysis?.report_uuid
      if (repId) {
        const verifyPdf = await fetch(`${API_BASE}/reports/${repId}/pdf`)
        if (!verifyPdf.ok && verifyPdf.status === 403) {
          throw new Error('Report entitlement is not active. Please complete payment.')
        }
      }
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
        const { payload } = buildFullAssessmentPayload(useLewisStore.getState())
        const fallbackData = buildClientFallbackAnalysis(payload)
        setLoadProgress(100)
        useLewisStore.setState({ analysisData: fallbackData, analysisMissing: null, analysisError: null })
      } finally {
        clearInterval(interval)
      }
    }
    fetchAnalysis()

    return () => clearInterval(interval)
  }, [attempt, storeAnalysis])

  const dims = analysis?.dimensions
  let chartData = []

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

  if (dims) {
    dimKeys.forEach(({ key, label }) => {
      const val = (dims[key] && dims[key].score !== null && dims[key].score !== undefined) ? dims[key].score : 62
      chartData.push({ subject: label, A: val, fullMark: 100 })
    })
  } else {
    chartData = [
      { subject: 'Wellbeing', A: 74, fullMark: 100 },
      { subject: 'Calm', A: 48, fullMark: 100 },
      { subject: 'Connection', A: 38, fullMark: 100 },
      { subject: 'Agency', A: 76, fullMark: 100 },
      { subject: 'Meaning', A: 82, fullMark: 100 },
      { subject: 'Financial Peace', A: 54, fullMark: 100 },
      { subject: 'Growth', A: 84, fullMark: 100 },
      { subject: 'Nature', A: 66, fullMark: 100 },
      { subject: 'Physical', A: 58, fullMark: 100 },
      { subject: 'Energy', A: 45, fullMark: 100 }
    ]
  }

  const LOCKED_CARDS = [
    {
      title: 'What moves together',
      desc: 'How strain in one area is arriving in the next'
    },
    {
      title: 'Where the tension settles',
      desc: 'The area quietly driving the rest, not the loudest one'
    },
    {
      title: 'Your anchor practice',
      desc: 'If this report kept one recommendation, this is it'
    },
    {
      title: 'Seven days, then thirty',
      desc: 'Small enough to survive a crowded day'
    }
  ]

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '12px 16px 36px 16px',
        boxSizing: 'border-box',
        fontFamily: "'Nunito', system-ui, sans-serif",
        color: '#414242',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <AbstractLineBackground variant="nodes" opacity={theme === 'dark' ? 0.15 : 0.07} color={theme === 'dark' ? '#38C9B7' : '#00ae9d'} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(0, 174, 157, 0.12)',
        marginBottom: '16px',
      }}>
        <div
          onClick={() => setScreen('landing')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          role="button"
          tabIndex={0}
          title="Go to Home"
          aria-label="Go to Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setScreen('landing')
            }
          }}
        >
          <LewisLogo size={26} showText={true} />
        </div>
      </div>

      {/* Main Column Layout for Mobile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* Title */}
        <div>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '24px',
            fontWeight: 800,
            color: '#414242',
          }}>
            Your reflection is ready.
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#657370', lineHeight: 1.4 }}>
            Nine areas of your life, read together. This is where you are right now.
          </p>
        </div>

        {/* Graph Card */}
        <div style={{
          background: '#ebf4f1',
          borderRadius: '18px',
          padding: '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid rgba(0, 174, 157, 0.12)',
        }}>
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="rgba(0, 174, 157, 0.16)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#414242', fontSize: 9.5, fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Reflection"
                  dataKey="A"
                  stroke="#00ae9d"
                  strokeWidth={2.2}
                  fill="#00ae9d"
                  fillOpacity={0.32}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Descriptive Text */}
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800, color: '#414242' }}>
            Steady, but uneven.
          </h3>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.48, color: '#657370' }}>
            Three areas are under pressure and one is running on empty, while your agency and work are holding you up. This describes the season you are in, not the kind of person you are.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 800, color: '#414242' }}>
            You can see the shape. Your report explains why it is that shape.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            {LOCKED_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#f8faf9',
                  borderRadius: '12px',
                  padding: '10px',
                  border: '1px solid rgba(22, 36, 31, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#414242' }}>
                    {card.title}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '10.5px', lineHeight: 1.35, color: '#657370' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <p style={{ margin: '0 0 12px 0', fontSize: '11.5px', color: '#85918e', fontWeight: 600 }}>
            Twenty-five pages, with every measure and study named in full. Yours to keep.
          </p>
        </div>

        {/* Unlock Box */}
        <div style={{
          background: isReportUnlocked ? 'linear-gradient(180deg, #ffffff 0%, #f2faf8 100%)' : '#ffffff',
          borderRadius: '16px',
          border: isReportUnlocked ? '1.5px solid #00ae9d' : '1.5px solid rgba(0, 174, 157, 0.35)',
          padding: '14px 16px',
          boxShadow: isReportUnlocked ? '0 6px 20px rgba(0, 174, 157, 0.12)' : '0 4px 16px rgba(0, 174, 157, 0.08)',
          textAlign: 'center',
        }}>
          {isReportUnlocked ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 0',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#00ae9d',
                fontWeight: 800,
                fontSize: '14.5px',
              }}>
                <span style={{ fontSize: '18px' }}>✓</span>
                <span>Insight Report Delivered</span>
              </div>
              <p style={{ margin: '2px 0 12px 0', fontSize: '12.5px', color: '#52605d', lineHeight: 1.45, textAlign: 'center' }}>
                Your complete 24-page Insight Report has been compiled and emailed directly with the PDF attached.
              </p>
              <button
                onClick={() => setScreen('reportReview')}
                style={{
                  padding: '10px 22px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '999px',
                  background: '#00ae9d',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Rate Your Experience ★
              </button>
            </div>
          ) : (
            <>
              <p style={{ 
                margin: '0 0 8px 0', 
                fontSize: '12.5px', 
                fontWeight: 700, 
                color: '#414242' 
              }}>
                ₹749, inclusive of all taxes. One-time payment, no subscription.
              </p>

              <button
                onClick={handleGetReport}
                disabled={isUnlocking}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  borderRadius: '999px',
                  background: '#00ae9d',
                  color: '#ffffff',
                  border: 'none',
                  cursor: isUnlocking ? 'wait' : 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 174, 157, 0.32)',
                  fontFamily: "'Nunito', sans-serif",
                  opacity: isUnlocking ? 0.85 : 1,
                }}
              >
                {isUnlocking 
                  ? 'Preparing report & opening checkout...' 
                  : 'Unlock your insight report at ₹749'}
              </button>

              <p style={{ margin: '6px 0 0 0', fontSize: '10.5px', color: '#85918e', lineHeight: 1.35 }}>
                Your personalised report is sent directly to your email. Pay via UPI, Card, Netbanking or Wallet.
              </p>
            </>
          )}
        </div>

        <p style={{ margin: '0', fontSize: '11px', color: '#85918e', textAlign: 'center' }}>
          Your reflection is saved. You can return to this page any time.
        </p>

        <footer style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          width: '100%',
          fontSize: '10.5px',
          color: '#94a39f',
        }}>
          <div>© 2025–2026 Holobiont Pvt Ltd.</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span>T&amp;C</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </footer>
      </div>

      {/* Hidden Render Target for PDF Generation */}
      <div style={{ position: 'fixed', left: '-3000px', top: 0, width: '1200px', pointerEvents: 'none', opacity: 0.01 }} aria-hidden="true">
        <InsightReport report={analysis?.insight_report || analysis?.report} />
      </div>
    </motion.div>
  )
}
