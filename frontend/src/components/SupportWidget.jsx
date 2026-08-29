import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { useDeviceViewport } from '../shared/hooks/useDeviceViewport.js'

export function SupportModal({ isOpen, onClose, initialName = '', initialEmail = '', screenName = '' }) {
  const { currentScreen } = useLewisStore()
  const activeScreen = screenName || currentScreen
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (initialName && !name) setName(initialName)
      if (initialEmail && !email) setEmail(initialEmail)
      setStatus('idle')
      setErrorMsg('')
    }
  }, [isOpen, initialName, initialEmail])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!email.trim() || !query.trim()) {
      setErrorMsg('Please enter your email and query.')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    try {
      const API_BASE = import.meta.env.VITE_API_URL || ''
      const payload = {
        name: name.trim() || 'Anonymous User',
        email: email.trim(),
        query: query.trim(),
        screen: activeScreen,
        timestamp: new Date().toISOString()
      }

      let res = await fetch(`${API_BASE}/support/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok && API_BASE) {
        res = await fetch('/support/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!res.ok) {
        throw new Error('Support query submission failed')
      }

      setStatus('success')
      setTimeout(() => {
        setQuery('')
        setStatus('idle')
        if (onClose) onClose()
      }, 2500)
    } catch (err) {
      console.error('Support query error:', err)
      setStatus('error')
      setErrorMsg('Could not send query. Please email lewissupport@lifedhealth.com directly.')
    }
  }

  return (
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
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(22, 36, 31, 0.45)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal Window Card */}
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
              maxWidth: '430px',
              padding: '28px 24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 174, 157, 0.18)',
              boxSizing: 'border-box',
              zIndex: 1,
              fontFamily: "'Nunito', system-ui, sans-serif",
            }}
          >
            {/* Close Icon Button */}
            <button
              onClick={onClose}
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
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eef2f1'
                e.currentTarget.style.color = '#414242'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8faf9'
                e.currentTarget.style.color = '#657370'
              }}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(0, 174, 157, 0.12)',
                color: '#00ae9d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 800,
                color: '#414242',
                letterSpacing: '-0.02em',
              }}>
                Support
              </h3>
            </div>

            <p style={{
              margin: '0 0 18px 0',
              fontSize: '13px',
              color: '#657370',
              lineHeight: 1.45,
            }}>
              Facing an issue or have a question? Leave a message and our team will assist you.
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
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  margin: '0 auto 10px',
                }}>
                  ✓
                </div>
                <h4 style={{ margin: '0 0 4px 0', color: '#166534', fontWeight: 800, fontSize: '15.5px' }}>
                  Query Sent Successfully!
                </h4>
                <p style={{ margin: 0, color: '#15803d', fontSize: '12.5px' }}>
                  Our support team will reach out to you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Name Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#414242', marginBottom: '5px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #dcdcdc',
                      background: '#ffffff',
                      fontSize: '13.5px',
                      fontFamily: "'Nunito', sans-serif",
                      color: '#414242',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00ae9d'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 174, 157, 0.12)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#dcdcdc'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#414242', marginBottom: '5px' }}>
                    Your Email <span style={{ color: '#00ae9d' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #dcdcdc',
                      background: '#ffffff',
                      fontSize: '13.5px',
                      fontFamily: "'Nunito', sans-serif",
                      color: '#414242',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00ae9d'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 174, 157, 0.12)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#dcdcdc'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Query Textarea */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#414242', marginBottom: '5px' }}>
                    How can we help? <span style={{ color: '#00ae9d' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your issue or query here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #dcdcdc',
                      background: '#ffffff',
                      fontSize: '13px',
                      fontFamily: "'Nunito', sans-serif",
                      color: '#414242',
                      boxSizing: 'border-box',
                      outline: 'none',
                      resize: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00ae9d'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 174, 157, 0.12)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#dcdcdc'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Error Notification */}
                {errorMsg && (
                  <p style={{ margin: 0, color: '#d0574f', fontSize: '12px', fontWeight: 700 }}>
                    {errorMsg}
                  </p>
                )}

                {/* Submit Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    marginTop: '4px',
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#00ae9d',
                    color: '#ffffff',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: status === 'sending' ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 174, 157, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {status === 'sending' ? 'Sending Query...' : 'Submit Message'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function SupportWidget() {
  const { currentScreen } = useLewisStore()
  const { isMobile } = useDeviceViewport()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  if (['landing', 'mirror', 'report', 'billing', 'payment', 'paymentConfirm'].includes(currentScreen)) {
    return null
  }

  return (
    <>
      {/* ── BOTTOM-LEFT CORNER SUPPORT BUTTON (Questionnaire Stages) ── */}
      <div style={{
        position: 'fixed',
        bottom: 'clamp(16px, 2.5vh, 24px)',
        left: 'clamp(16px, 2.5vw, 28px)',
        zIndex: 9990,
      }}>
        {!isMobile ? (
          /* Desktop: Full Pill Support Button */
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Contact Support"
            title="Need help? Contact Support"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 14px',
              borderRadius: '999px',
              background: '#ffffff',
              border: '1.5px solid rgba(0, 174, 157, 0.45)',
              color: '#00ae9d',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              lineHeight: 1,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 174, 157, 0.12)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00ae9d'
              e.currentTarget.style.background = 'rgba(0, 174, 157, 0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 174, 157, 0.45)'
              e.currentTarget.style.background = '#ffffff'
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, display: 'block' }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span style={{ display: 'inline-block', lineHeight: 1, paddingTop: '1px' }}>Support</span>
          </motion.button>
        ) : (
          /* Mobile: Compact Circular (i) Button */
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Support & Help"
            title="Need help or have a question? Click for support"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1.5px solid rgba(0, 174, 157, 0.45)',
              color: '#00ae9d',
              fontFamily: "'Nunito', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 174, 157, 0.14)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00ae9d'
              e.currentTarget.style.background = 'rgba(0, 174, 157, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 174, 157, 0.45)'
              e.currentTarget.style.background = '#ffffff'
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: 'block' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* ── SUPPORT POPUP MODAL ── */}
      <SupportModal isOpen={isOpen} onClose={handleClose} />
    </>
  )
}
