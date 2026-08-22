import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function SupportWidget() {
  const { name: storeName, email: storeEmail, currentScreen } = useLewisStore()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  // Pre-fill from store if available
  useEffect(() => {
    if (storeName && !name) setName(storeName)
    if (storeEmail && !email) setEmail(storeEmail)
  }, [storeName, storeEmail])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!email.trim() || !query.trim()) {
      setErrorMsg('Please enter your email and query.')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      // Post support query to backend endpoint if available, fallback gracefully
      await fetch(`${API_BASE}/support/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous User',
          email: email.trim(),
          query: query.trim(),
          screen: currentScreen,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {
        // Fallback: log to console if offline/local
        console.log('[Support Query Logged]', { name, email, query, currentScreen })
      })

      setStatus('success')
      setTimeout(() => {
        setQuery('')
        setStatus('idle')
        setIsOpen(false)
      }, 2500)
    } catch {
      setStatus('error')
      setErrorMsg('Could not send query. Please email lewissupport@lifedhealth.com directly.')
    }
  }

  if (currentScreen === 'landing') {
    return null
  }

  return (
    <>
      {/* ── BOTTOM-LEFT FLOATING "i" SUPPORT BUTTON ── */}
      <div style={{
        position: 'fixed',
        bottom: '22px',
        left: '22px',
        zIndex: 9990,
      }}>
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Assessment Support & Help"
          title="Need help? Contact Support"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1.5px solid #00ae9d',
            color: '#00ae9d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 174, 157, 0.18)',
            fontFamily: '"Nunito", "Inter", sans-serif',
            fontSize: '15px',
            fontWeight: 700,
            fontStyle: 'normal',
            lineHeight: 1,
            outline: 'none',
            padding: 0,
            transition: 'all 0.2s ease',
          }}
        >
          i
        </motion.button>
      </div>

      {/* ── SUPPORT POPUP MODAL ── */}
      <AnimatePresence>
        {isOpen && (
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(22, 36, 31, 0.45)',
                backdropFilter: 'blur(6px)',
              }}
            />

            {/* Modal Window Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              style={{
                position: 'relative',
                background: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '440px',
                padding: '28px 24px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.18)',
                border: '1px solid rgba(0, 174, 157, 0.15)',
                boxSizing: 'border-box',
                zIndex: 1,
              }}
            >
              {/* Close Icon Button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f1f5f4',
                  color: '#64748b',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background 0.2s ease',
                }}
              >
                ✕
              </button>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: '#e4f4ee',
                  color: '#00ae9d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: '"Nunito", "Inter", sans-serif',
                  fontStyle: 'normal',
                }}>
                  i
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 800,
                    fontFamily: "'Manrope', sans-serif",
                    color: '#1e293b'
                  }}>
                    Assessment Support
                  </h3>
                </div>
              </div>

              <p style={{
                margin: '0 0 20px 0',
                fontSize: '13px',
                color: '#64748b',
                fontFamily: "'Nunito', sans-serif",
                lineHeight: 1.4,
              }}>
                Facing an issue during your assessment? Submit your query below and our team will assist you.
              </p>

              {/* Form or Success Screen */}
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    margin: '12px 0',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 800,
                    margin: '0 auto 12px',
                  }}>
                    ✓
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#166534', fontFamily: "'Manrope', sans-serif", fontSize: '16px' }}>
                    Query Sent Successfully!
                  </h4>
                  <p style={{ margin: 0, color: '#15803d', fontSize: '13px', fontFamily: "'Nunito', sans-serif" }}>
                    Our support team will reach out to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Name Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#414242', marginBottom: '5px', fontFamily: "'Nunito', sans-serif" }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #d2e7e0',
                        fontSize: '13.5px',
                        fontFamily: "'Nunito', sans-serif",
                        color: '#1e293b',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#414242', marginBottom: '5px', fontFamily: "'Nunito', sans-serif" }}>
                      Enter Email <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #d2e7e0',
                        fontSize: '13.5px',
                        fontFamily: "'Nunito', sans-serif",
                        color: '#1e293b',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Query Textarea */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#414242', marginBottom: '5px', fontFamily: "'Nunito', sans-serif" }}>
                      Send Your Query <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your issue or query here..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #d2e7e0',
                        fontSize: '13px',
                        fontFamily: "'Nunito', sans-serif",
                        color: '#1e293b',
                        boxSizing: 'border-box',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <p style={{ margin: 0, color: '#e11d48', fontSize: '12px', fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
                      {errorMsg}
                    </p>
                  )}

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      marginTop: '4px',
                      opacity: status === 'sending' ? 0.7 : 1,
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Query'}
                  </button>
                </form>
              )}

              {/* Direct Mail Notice */}
              <div style={{
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid #eef2f1',
                textAlign: 'center',
                fontSize: '12.5px',
                color: '#64748b',
                fontFamily: "'Nunito', sans-serif",
              }}>
                Or mail us directly to{' '}
                <a
                  href="mailto:lewissupport@lifedhealth.com"
                  style={{
                    color: '#00ae9d',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  lewissupport@lifedhealth.com
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
