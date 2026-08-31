import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

const NUNITO = "'Nunito', system-ui, sans-serif"
const TEAL = '#00ae9d'
const LEWIS_GREEN = '#00ae9d'
const INK = '#1e293b'

const RATING_LABELS = {
  1: 'Needs improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Great experience',
  5: 'Exceptional',
}

const FLOW_OPTIONS = [
  'Smooth & intuitive',
  'Thoughtful depth',
  'A bit long',
  'Could be easier'
]

const ACCURACY_OPTIONS = [
  'Spot on & resonance',
  'Very insightful',
  'Partially matched',
  'Still exploring'
]

export default function ReviewModal({
  isOpen,
  onClose,
  customerName = '',
  customerEmail = '',
  orderId = '',
}) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [flowChoice, setFlowChoice] = useState('Smooth & intuitive')
  const [accuracyChoice, setAccuracyChoice] = useState('Spot on & resonance')
  const [comments, setComments] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'submitted'

  useEffect(() => {
    if (isOpen) {
      setStatus('idle')
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setStatus('submitting')

    try {
      const API_BASE = import.meta.env.VITE_API_URL || ''
      const payload = {
        user_email: customerEmail || 'client@lewis.app',
        user_name: customerName || 'Lewis User',
        rating: Number(rating),
        depth_resonance: flowChoice,
        clarity_actionability: accuracyChoice,
        feedback_comments: comments.trim() || undefined,
        order_id: orderId || undefined,
        metadata: {
          submitted_at: new Date().toISOString(),
          source: 'PaymentConfirmation_Modal'
        }
      }

      let res = await fetch(`${API_BASE}/api/reviews/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok && API_BASE) {
        await fetch('/api/reviews/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
    } catch (err) {
      console.warn('Review submission network fallback:', err)
    } finally {
      setStatus('submitted')
      try {
        localStorage.setItem(`lewis_review_submitted_${orderId || 'default'}`, 'true')
      } catch (_) {}
      setTimeout(() => {
        onClose?.()
      }, 2200)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="review-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px',
          boxSizing: 'border-box',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && status !== 'submitting') {
            onClose?.()
          }
        }}
      >
        <motion.div
          key="review-card"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            background: 'var(--raised, #ffffff)',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-soft, 0 20px 50px rgba(0, 174, 157, 0.12), 0 8px 24px rgba(0,0,0,0.08))',
            border: '1.5px solid var(--border-color, rgba(0, 174, 157, 0.25))',
            padding: 'clamp(22px, 3.5vw, 32px)',
            boxSizing: 'border-box',
            position: 'relative',
            fontFamily: NUNITO,
            color: 'var(--text-main, #414242)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'var(--panel, #f1f5f9)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-sub, #64748b)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--panel-hover, #e2e8f0)'
              e.currentTarget.style.color = 'var(--text-main, #414242)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--panel, #f1f5f9)'
              e.currentTarget.style.color = 'var(--text-sub, #64748b)'
            }}
            aria-label="Close review"
          >
            ✕
          </button>

          {status === 'submitted' ? (
            /* Success Feedback State */
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--dawn, #00ae9d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0, 174, 157, 0.3)',
                }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 800, color: 'var(--text-main, #414242)' }}>
                Thank You for Your Feedback!
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-sub, #64748b)', lineHeight: 1.5 }}>
                Your insights help us continuously refine and elevate the Lewis self-reflection experience.
              </p>
            </div>
          ) : (
            /* Review Form */
            <form onSubmit={handleSubmit}>
              {/* Header Badge & Title */}
              <div style={{ marginBottom: '18px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--dawn, #00ae9d)',
                  display: 'block',
                  marginBottom: '4px',
                }}>
                  Quick Review
                </span>
                <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800, color: 'var(--text-main, #414242)', lineHeight: 1.25 }}>
                  Star Your Lewis Experience
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-sub, #64748b)', lineHeight: 1.4 }}>
                  Help us know how the reflection journey felt for you today.
                </p>
              </div>

              {/* Q1: Star Rating */}
              <div style={{
                background: 'var(--panel, #f8fafc)',
                border: '1.2px solid var(--border-color, rgba(0, 174, 157, 0.18))',
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #334155)', marginBottom: '8px' }}>
                  1. Overall Rating
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
                          fontSize: '32px',
                          lineHeight: 1,
                          color: active ? 'var(--dawn, #00ae9d)' : 'var(--border-strong, #cbd5e1)',
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
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--dawn, #00ae9d)', marginTop: '4px', height: '16px' }}>
                  {RATING_LABELS[hoverRating || rating]}
                </div>
              </div>

              {/* Q2: Assessment Flow & Clarity */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #334155)', marginBottom: '8px' }}>
                  2. How was the flow of the reflection questions?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {FLOW_OPTIONS.map((opt) => {
                    const selected = flowChoice === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFlowChoice(opt)}
                        style={{
                          padding: '7px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '999px',
                          border: selected ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-color, #e2e8f0)',
                          background: selected ? 'var(--teal-tint, rgba(0, 174, 157, 0.1))' : 'var(--panel, #ffffff)',
                          color: selected ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #475569)',
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

              {/* Q3: Mirror Resonance */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #334155)', marginBottom: '8px' }}>
                  3. Did your Mirror summary feel relevant & resonant?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ACCURACY_OPTIONS.map((opt) => {
                    const selected = accuracyChoice === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAccuracyChoice(opt)}
                        style={{
                          padding: '7px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '999px',
                          border: selected ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-color, #e2e8f0)',
                          background: selected ? 'var(--teal-tint, rgba(0, 174, 157, 0.1))' : 'var(--panel, #ffffff)',
                          color: selected ? 'var(--dawn, #00ae9d)' : 'var(--text-sub, #475569)',
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

              {/* Q4: Quick Thoughts (Optional) */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #334155)', marginBottom: '6px' }}>
                  4. Any quick feedback or suggestions? <span style={{ fontWeight: 400, color: 'var(--text-sub, #94a3b8)' }}>(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share a quick thought or what stood out to you..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-color, #e2e8f0)',
                    fontSize: '13px',
                    fontFamily: NUNITO,
                    background: 'var(--bg-page, #ffffff)',
                    color: 'var(--text-main, #414242)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color, #e2e8f0)'}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <motion.button
                  type="submit"
                  disabled={status === 'submitting'}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '13px 20px',
                    fontSize: '14.5px',
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
                  {status === 'submitting' ? 'Submitting...' : 'Submit Review ★'}
                </motion.button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-sub, #64748b)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '10px 14px',
                    fontFamily: NUNITO,
                  }}
                >
                  Maybe Later
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
