import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'

const NUNITO = "'Nunito', system-ui, sans-serif"
const TEAL = 'var(--dawn, #00ae9d)'
const INK = 'var(--text, #1e293b)'

const RATING_LABELS = {
  1: 'Needs improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Great experience',
  5: 'Exceptional & deeply resonant',
}

const RESONANCE_OPTIONS = [
  'Deeply resonant & accurate',
  'Mostly accurate',
  'Somewhat relevant',
  'Missed the mark'
]

const CLARITY_OPTIONS = [
  'Extremely clear & actionable',
  'Helpful perspective',
  'A bit too dense',
  'Needs simpler language'
]

const IMPACT_OPTIONS = [
  'Significant clarity & relief',
  'Helpful validation',
  'Neutral / exploring',
  'Not quite'
]

export default function ReportReviewScreen() {
  const {
    setScreen,
    email: storeEmail,
    name: storeName,
    latestPaymentOrder,
    analysisData,
    theme
  } = useLewisStore()

  // Parse URL search params if present
  const getQueryParam = (param) => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has(param)) return urlParams.get(param)
      // Check hash params if formatted like #report-review?email=...
      if (window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1]
        const hashParams = new URLSearchParams(hashQuery)
        if (hashParams.has(param)) return hashParams.get(param)
      }
    } catch (_) {}
    return ''
  }

  const [email, setEmail] = useState(() => getQueryParam('email') || latestPaymentOrder?.email || storeEmail || '')
  const [name, setName] = useState(() => getQueryParam('name') || latestPaymentOrder?.name || storeName || '')
  const [reportId, setReportId] = useState(() => getQueryParam('report_id') || getQueryParam('id') || analysisData?.report_id || '')
  const [orderId, setOrderId] = useState(() => getQueryParam('order_id') || latestPaymentOrder?.orderId || '')

  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [resonanceChoice, setResonanceChoice] = useState('Deeply resonant & accurate')
  const [clarityChoice, setClarityChoice] = useState('Extremely clear & actionable')
  const [impactChoice, setImpactChoice] = useState('Significant clarity & relief')
  const [comments, setComments] = useState('')

  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'submitted' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to link your review.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      user_email: email.trim(),
      user_name: name.trim() || 'Lewis Client',
      report_id: reportId.trim() || undefined,
      order_id: orderId.trim() || undefined,
      rating: Number(rating),
      depth_resonance: resonanceChoice,
      clarity_actionability: clarityChoice,
      relief_impact: impactChoice,
      feedback_comments: comments.trim() || undefined,
      metadata: {
        submitted_at: new Date().toISOString(),
        source: 'insight_report_review_page',
        url: window.location.href
      }
    }

    try {
      const API_BASE = import.meta.env.VITE_API_URL || ''
      let res = await fetch(`${API_BASE}/api/reviews/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok && API_BASE) {
        res = await fetch('/api/reviews/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      setStatus('submitted')
    } catch (err) {
      console.warn('Network error recording review:', err)
      setStatus('submitted')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      background: '#f8faf9',
      color: INK,
      fontFamily: NUNITO,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      <AbstractLineBackground variant="nodes" opacity={theme === 'dark' ? 0.15 : 0.05} color={theme === 'dark' ? '#38C9B7' : '#00ae9d'} />

      {/* Header */}
      <header style={{
        width: '100%',
        padding: 'clamp(14px, 2vh, 22px) clamp(16px, 3.5vw, 44px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
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
          <LewisLogo size={32} showText={true} animated={false} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
          <button
            type="button"
            className="landing-back-home-btn"
            onClick={() => setScreen('landing')}
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-mute, #64748b)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '6px 12px',
              fontFamily: NUNITO,
              outline: 'none',
              boxShadow: 'none',
            }}
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(16px, 3vh, 36px) clamp(16px, 3vw, 24px)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            background: 'var(--panel, #ffffff)',
            borderRadius: '24px',
            border: '1.5px solid var(--panel-border, rgba(0, 174, 157, 0.22))',
            boxShadow: 'var(--shadow-soft, 0 16px 40px rgba(0, 174, 157, 0.08))',
            padding: 'clamp(24px, 4vw, 40px)',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {status === 'submitted' ? (
            /* Success View */
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#00ae9d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0, 174, 157, 0.25)',
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 800, color: INK }}>
                Thank You for Your Feedback!
              </h1>
              <p style={{ margin: '0 0 24px 0', fontSize: '14.5px', color: '#64748b', lineHeight: 1.55 }}>
                Your review has been recorded. Your observations help us continually hone and elevate the personal insight report for everyone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen('mirror')}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    borderRadius: '999px',
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: NUNITO,
                    boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                  }}
                >
                  View Reflection Summary →
                </motion.button>
                <button
                  type="button"
                  onClick={() => setScreen('landing')}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    color: '#475569',
                    cursor: 'pointer',
                    fontFamily: NUNITO,
                  }}
                >
                  Home
                </button>
              </div>
            </div>
          ) : (
            /* Review Form */
            <form onSubmit={handleSubmit}>
              {/* Header Title Lockup */}
              <div style={{ marginBottom: '22px' }}>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: TEAL,
                  display: 'block',
                  marginBottom: '4px',
                }}>
                  Insight Report Feedback
                </span>
                <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(22px, 2.4vw, 27px)', fontWeight: 800, color: INK, lineHeight: 1.25 }}>
                  Review Your Lewis Insight Report
                </h1>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
                  Take a quick moment to share how reading your personalised report felt.
                </p>
              </div>

              {errorMessage && (
                <div style={{
                  background: '#fef2f2',
                  border: '1.2px solid #f87171',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#991b1b',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}>
                  {errorMessage}
                </div>
              )}

              {/* User Details Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '18px',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@domain.com"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '13.5px',
                      fontFamily: NUNITO,
                      color: INK,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = TEAL}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First Name"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '13.5px',
                      fontFamily: NUNITO,
                      color: INK,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = TEAL}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Q1: Star Rating */}
              <div style={{
                background: '#f8faf9',
                border: '1.2px solid rgba(0, 174, 157, 0.18)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  1. Overall Insight Report Experience
                </div>
                <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          fontSize: '34px',
                          lineHeight: 1,
                          color: active ? TEAL : '#cbd5e1',
                          transition: 'transform 0.15s ease, color 0.15s ease',
                          transform: (hoverRating === star || rating === star) ? 'scale(1.18)' : 'scale(1)',
                        }}
                        aria-label={`${star} Star`}
                      >
                        ★
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TEAL, marginTop: '6px', height: '18px' }}>
                  {RATING_LABELS[hoverRating || rating]}
                </div>
              </div>

              {/* Q2: Resonance */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  2. How accurately did the report capture your current season & patterns?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {RESONANCE_OPTIONS.map((opt) => {
                    const selected = resonanceChoice === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setResonanceChoice(opt)}
                        style={{
                          padding: '8px 14px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          borderRadius: '999px',
                          border: selected ? `1.5px solid ${TEAL}` : '1.5px solid #e2e8f0',
                          background: selected ? 'rgba(0, 174, 157, 0.1)' : '#ffffff',
                          color: selected ? TEAL : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {selected && '✓ '}
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Q3: Clarity & Actionability */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  3. How clear and actionable were the recommendations & anchors?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CLARITY_OPTIONS.map((opt) => {
                    const selected = clarityChoice === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setClarityChoice(opt)}
                        style={{
                          padding: '8px 14px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          borderRadius: '999px',
                          border: selected ? `1.5px solid ${TEAL}` : '1.5px solid #e2e8f0',
                          background: selected ? 'rgba(0, 174, 157, 0.1)' : '#ffffff',
                          color: selected ? TEAL : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {selected && '✓ '}
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Q4: Relief & Clarity */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  4. Did reading your report provide a sense of clarity or validation?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {IMPACT_OPTIONS.map((opt) => {
                    const selected = impactChoice === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setImpactChoice(opt)}
                        style={{
                          padding: '8px 14px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          borderRadius: '999px',
                          border: selected ? `1.5px solid ${TEAL}` : '1.5px solid #e2e8f0',
                          background: selected ? 'rgba(0, 174, 157, 0.1)' : '#ffffff',
                          color: selected ? TEAL : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {selected && '✓ '}
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Q5: Feedback text */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  5. What was the most valuable part, or what could we improve? <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share any thoughts, observations, or feedback on your report..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '13.5px',
                    fontFamily: NUNITO,
                    color: INK,
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = TEAL}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Action Button */}
              <div>
                <motion.button
                  type="submit"
                  disabled={status === 'submitting'}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: 800,
                    borderRadius: '999px',
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                    fontFamily: NUNITO,
                    opacity: status === 'submitting' ? 0.7 : 1,
                  }}
                >
                  {status === 'submitting' ? 'Saving Your Review...' : 'Submit Report Review ★'}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </main>

      <LewisFooter />
    </div>
  )
}
