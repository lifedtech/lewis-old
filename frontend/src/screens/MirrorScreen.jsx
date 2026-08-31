import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { buildFullAssessmentPayload } from '../lib/payload.js'
import { buildClientFallbackAnalysis } from '../lib/scoring.js'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import InsightReport from '../report/InsightReport.jsx'
import { exportReportPdf } from '../report/exportPdf.js'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'
import Icon from '../report/icons.jsx'
import { initiateCheckout } from '../lib/payment.js'
import './landing.css'

export default function MirrorScreen() {
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
  const [activeLegalModal, setActiveLegalModal] = useState(null)

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

  const handleGetReport = () => {
    // If not unlocked, navigate to Billing screen to collect delivery info and process payment
    if (!isReportUnlocked) {
      setScreen('billing')
      return
    }

    // If unlocked, view delivery status on payment confirmation screen
    setScreen('paymentConfirm')
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
        // Auto fallback to client scoring so the user always sees their reflection
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

  // Chart data from dimensions
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
      data-theme={theme || 'light'}
      className={`mirror-screen-main ${theme === 'dark' ? 'dark' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--lp-page-bg, #ffffff)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: 'clamp(10px, 1.6vh, 20px) clamp(16px, 3.5vw, 48px)',
        fontFamily: "'Nunito', system-ui, sans-serif",
        color: 'var(--lp-text-primary, #414242)',
        zIndex: 50,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AbstractLineBackground variant="nodes" opacity={theme === 'dark' ? 0.15 : 0.08} color={theme === 'dark' ? '#38C9B7' : '#00ae9d'} />

      {/* ── HEADER (Top Bar with Logo & Theme Toggle) ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 'clamp(6px, 1.2vh, 14px)',
        flexShrink: 0,
      }}>
        <div
          onClick={() => setScreen('landing')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
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
          <LewisLogo size={30} showText={true} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* ── SINGLE SECTION MAIN LAYOUT (2 COLUMNS, NO SCROLL) ── */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.08fr)',
        gap: 'clamp(24px, 3.8vw, 56px)',
        alignItems: 'center',
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {/* ── LEFT COLUMN: Headline + Graph Card + Summary Text ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        }}>
          {/* Eyebrow & Headline */}
          <div style={{ marginBottom: 'clamp(10px, 1.8vh, 16px)' }}>
            <h1 className="mirror-headline-h1" style={{
              margin: '0 0 4px 0',
              fontSize: 'clamp(26px, 2.9vw, 38px)',
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--lp-text-primary, #414242)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Your reflection is ready.
            </h1>
            <p className="mirror-headline-sub" style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.35vw, 17px)',
              lineHeight: 1.4,
              color: 'var(--lp-text-secondary, #657370)',
              fontWeight: 500,
            }}>
              Nine areas of your life, read together. This is where you are right now.
            </p>
          </div>

          {/* Graph Card from Image 1 */}
          <div style={{
            background: 'var(--lp-card, #ebf4f1)',
            borderRadius: '20px',
            padding: 'clamp(12px, 1.8vh, 18px) clamp(14px, 2vw, 20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            border: '1px solid var(--lp-card-border, rgba(0, 174, 157, 0.12))',
            boxShadow: 'var(--lp-shadow, 0 4px 16px rgba(0,0,0,0.04))',
            position: 'relative',
          }}>
            {/* Resilience Radar Chart */}
            <div style={{ width: '100%', height: 'clamp(170px, 26vh, 230px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
                  <PolarGrid stroke={theme === 'dark' ? 'rgba(56, 201, 183, 0.22)' : 'rgba(0, 174, 157, 0.16)'} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: theme === 'dark' ? '#E9F1EF' : '#414242', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.01em' }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Reflection"
                    dataKey="A"
                    stroke="var(--lp-brand-text, #00ae9d)"
                    strokeWidth={2.4}
                    fill="var(--lp-brand-text, #00ae9d)"
                    fillOpacity={theme === 'dark' ? 0.38 : 0.32}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic / Image 2 Descriptive Text */}
          <div style={{ marginTop: 'clamp(10px, 1.8vh, 16px)' }}>
            <h3 className="mirror-desc-title" style={{
              margin: '0 0 4px 0',
              fontSize: 'clamp(17px, 1.55vw, 20px)',
              fontWeight: 800,
              color: 'var(--lp-text-primary, #414242)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Steady, but uneven.
            </h3>
            <p className="mirror-desc-p" style={{
              margin: 0,
              fontSize: 'clamp(14.5px, 1.25vw, 16px)',
              lineHeight: 1.48,
              color: 'var(--lp-text-secondary, #657370)',
            }}>
              Three areas are under pressure and one is running on empty, while your agency and work are holding you up. This describes the season you are in, not the kind of person you are.
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Report Scope + 4 Lock Cards + Unlock Box ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        }}>
          {/* Header text from Image 2 */}
          <h2 className="mirror-section-h2" style={{
            margin: '0 0 clamp(8px, 1.4vh, 12px) 0',
            fontSize: 'clamp(16px, 1.5vw, 19px)',
            fontWeight: 800,
            color: 'var(--lp-text-primary, #414242)',
            lineHeight: 1.3,
            fontFamily: "'Nunito', sans-serif",
          }}>
            You can see the shape. Your report explains why it is that shape.
          </h2>

          {/* 4 Feature Cards (2x2 Grid) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(8px, 1.2vh, 12px)',
            marginBottom: 'clamp(8px, 1.2vh, 12px)',
          }}>
            {LOCKED_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  background: 'var(--lp-raised, #f8faf9)',
                  borderRadius: '12px',
                  padding: 'clamp(10px, 1.4vh, 14px) clamp(10px, 1.2vw, 14px)',
                  border: '1px solid var(--lp-border, rgba(22, 36, 31, 0.06))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--lp-brand-text, #00ae9d)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span className="mirror-card-title" style={{
                    fontSize: 'clamp(14px, 1.2vw, 15.5px)',
                    fontWeight: 800,
                    color: 'var(--lp-text-primary, #414242)',
                    lineHeight: 1.2,
                  }}>
                    {card.title}
                  </span>
                </div>
                <p className="mirror-card-desc" style={{
                  margin: 0,
                  fontSize: 'clamp(12.5px, 1.05vw, 13.5px)',
                  lineHeight: 1.38,
                  color: 'var(--lp-text-secondary, #657370)',
                  fontWeight: 500,
                }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Pages description */}
          <p className="mirror-pages-desc" style={{
            margin: '0 0 clamp(8px, 1.4vh, 12px) 0',
            fontSize: 'clamp(13.5px, 1.1vw, 14.5px)',
            color: 'var(--lp-text-muted, #85918e)',
            fontWeight: 600,
          }}>
            Twenty-five pages, with every measure and study named in full. Yours to keep.
          </p>

          {/* Unlock Box */}
          <div style={{
            background: 'var(--lp-card, #ffffff)',
            borderRadius: '16px',
            border: isReportUnlocked ? '1.5px solid var(--lp-brand-text, #00ae9d)' : '1.5px solid var(--lp-border-strong, rgba(0, 174, 157, 0.35))',
            padding: 'clamp(14px, 2vh, 20px) clamp(16px, 2vw, 24px)',
            boxShadow: isReportUnlocked ? 'var(--lp-card-hover-shadow)' : 'var(--lp-shadow)',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}>
            {isReportUnlocked ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#00ae9d',
                  fontWeight: 800,
                  fontSize: 'clamp(15px, 1.25vw, 17px)',
                }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <span>Insight Report Delivered</span>
                </div>
                <p style={{ margin: '2px 0 14px 0', fontSize: '13.5px', color: '#52605d', lineHeight: 1.5, textAlign: 'center' }}>
                  Your complete 25-page Insight Report has been compiled and emailed directly with the PDF attached.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen('reportReview')}
                  style={{
                    padding: '11px 26px',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Nunito', sans-serif",
                    boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                  }}
                >
                  Rate Your Experience ★
                </motion.button>
              </div>
            ) : (
              <>
                <p className="mirror-unlock-title" style={{
                  margin: 0,
                  fontSize: 'clamp(14px, 1.2vw, 15.5px)',
                  fontWeight: 700,
                  color: 'var(--lp-text-primary, #414242)',
                }}>
                  ₹749, inclusive of all taxes. One-time payment, no subscription.
                </p>

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleGetReport}
                  disabled={isUnlocking}
                  className="mirror-unlock-btn btn-primary"
                  style={{
                    marginTop: 'clamp(8px, 1.2vh, 10px)',
                    width: '100%',
                    padding: 'clamp(12px, 1.6vh, 15px) 20px',
                    fontSize: 'clamp(16px, 1.35vw, 18px)',
                    fontWeight: 700,
                    borderRadius: '999px',
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    cursor: isUnlocking ? 'wait' : 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 174, 157, 0.32)',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Nunito', sans-serif",
                    opacity: isUnlocking ? 0.85 : 1,
                  }}
                >
                  {isUnlocking 
                    ? 'Preparing report & opening checkout...' 
                    : 'Unlock your insight report at ₹749'}
                </motion.button>

                <p className="mirror-unlock-note" style={{
                  margin: 'clamp(6px, 1vh, 8px) 0 0 0',
                  fontSize: 'clamp(12px, 1vw, 13px)',
                  color: 'var(--lp-text-muted, #85918e)',
                  lineHeight: 1.35,
                }}>
                  Your personalised insight report is sent directly to your email. Pay via UPI, Card, or Netbanking.
                </p>
              </>
            )}
          </div>

          {/* Footer note */}
          <p className="mirror-footer-note" style={{
            margin: 'clamp(6px, 1vh, 10px) 0 0 0',
            fontSize: 'clamp(12.5px, 1vw, 13.5px)',
            color: '#85918e',
            textAlign: 'center',
          }}>
            Your reflection is saved. You can return to this page any time.
          </p>
        </div>
      </main>

      {/* ── FOOTER (Corners) ── */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 'clamp(4px, 0.8vh, 8px)',
        fontSize: 'clamp(10px, 0.8vw, 11.5px)',
        color: '#94a39f',
        flexShrink: 0,
      }}>
        <div>
          © 2025–2026 Holobiont Pvt Ltd. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setActiveLegalModal('terms')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#85918e',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00ae9d')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#85918e')}
          >
            T&amp;C
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveLegalModal('privacy')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#85918e',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00ae9d')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#85918e')}
          >
            Privacy Policy
          </button>
        </div>
      </footer>

      {/* ── LEGAL MODAL (Terms & Conditions / Privacy Policy) ── */}
      <AnimatePresence>
        {activeLegalModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLegalModal(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(22, 36, 31, 0.45)',
                backdropFilter: 'blur(6px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              style={{
                position: 'relative',
                background: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '460px',
                padding: '28px 24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 174, 157, 0.18)',
                boxSizing: 'border-box',
                zIndex: 1,
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}
            >
              <button
                onClick={() => setActiveLegalModal(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #eef2f1',
                  background: '#f8faf9',
                  color: '#657370',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                ✕
              </button>

              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: 800,
                color: '#414242',
              }}>
                {activeLegalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h3>

              {activeLegalModal === 'terms' ? (
                <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#52605d' }}>
                  <p style={{ marginTop: 0, marginBottom: '12px' }}>
                    <strong>Non-Clinical Use:</strong> Lewis is an evidence-based self-reflection tool. It provides non-clinical wellbeing metrics for personal insight and does not diagnose, treat, or replace professional healthcare.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Data Ownership:</strong> You retain complete ownership of your inputs. Information entered into Lewis is processed strictly to compile your reflection mirror.
                  </p>
                </div>
              ) : (
                <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#52605d' }}>
                  <p style={{ marginTop: 0, marginBottom: '12px' }}>
                    <strong>Privacy First:</strong> Your personal responses and wellbeing reflections are strictly confidential. Lifed Health does not sell or share personal reflections with third parties.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Security:</strong> All payload data is encrypted in transit and at rest.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Render Target for Canvas-Accurate PDF Generation */}
      <div style={{ position: 'fixed', left: '-3000px', top: 0, width: '1200px', pointerEvents: 'none', opacity: 0.01 }} aria-hidden="true">
        <InsightReport report={analysis?.insight_report || analysis?.report} />
      </div>
    </motion.div>
  )
}
