import { useState } from 'react'
import LewisLogo from './LewisLogo.jsx'

/**
 * LewisFooter
 * 
 * Recreates the exact Lewis Pulse brand footer:
 * - Brand column with logo lockup & non-clinical legal disclaimer
 * - Information links (Terms & Conditions, Privacy Policy, Contact Support)
 * - Contact Us column with teal icons for Email, Phone, and Location
 * - Copyright & Wellbeing Intelligence attribution bottom bar
 */
export default function LewisFooter() {
  const [modalType, setModalType] = useState(null) // 'terms' | 'privacy' | 'contact'
  const [contactForm, setContactForm] = useState({ name: '', email: '', query: '' })
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: null, error: null })

  const closeModal = () => {
    setModalType(null)
    setSubmitStatus({ loading: false, success: null, error: null })
  }

  const handleSupportSubmit = async (e) => {
    e.preventDefault()
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.query.trim()) return
    setSubmitStatus({ loading: true, success: null, error: null })
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      let res = await fetch(`${apiUrl}/api/support/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      })
      if (!res.ok) {
        res = await fetch(`${apiUrl}/support/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactForm)
        })
      }
      if (!res.ok) throw new Error('Failed to send query')
      setSubmitStatus({
        loading: false,
        success: 'Thank you! Your query has been sent to Lifed Operations System. Our team will contact you shortly.',
        error: null
      })
      setContactForm({ name: '', email: '', query: '' })
    } catch (err) {
      setSubmitStatus({
        loading: false,
        success: null,
        error: 'Unable to send query at the moment. Please try again or email support@lifedhealth.com.'
      })
    }
  }

  return (
    <footer style={{ backgroundColor: '#202323', width: '100%', color: '#ffffff', fontFamily: "'Nunito', sans-serif" }}>
      {/* Main Footer Container */}
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        width: '100%',
        padding: '44px clamp(24px, 4vw, 48px) 16px clamp(24px, 4vw, 48px)',
        boxSizing: 'border-box'
      }}>
        {/* Top Layout: Brand on Left, Links & Contact Grouped on Right */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '48px clamp(32px, 5vw, 64px)',
          marginBottom: '20px'
        }}>

          {/* Column 1: Brand & Disclaimer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '360px' }}>
            {/* Brand Logo Lockup */}
            <LewisLogo size={34} inverted={true} showText={true} />

            <p style={{
              margin: 0,
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.65)'
            }}>
              Lewis is a non-clinical wellbeing reflection. It does not provide medical diagnosis or psychiatric treatment.
            </p>
          </div>

          {/* Right Group: Information + Contact Us */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '48px clamp(32px, 5vw, 72px)',
            alignItems: 'flex-start'
          }}>

            {/* Column 2: Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Information
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setModalType('terms')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.72)',
                    fontSize: '14px',
                    fontFamily: "'Nunito', sans-serif",
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.72)'}
                >
                  Terms & Conditions
                </button>

                <button
                  onClick={() => setModalType('privacy')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.72)',
                    fontSize: '14px',
                    fontFamily: "'Nunito', sans-serif",
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.72)'}
                >
                  Privacy Policy
                </button>

                <button
                  onClick={() => setModalType('contact')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.72)',
                    fontSize: '14px',
                    fontFamily: "'Nunito', sans-serif",
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.72)'}
                >
                  Contact Support
                </button>
              </div>
            </div>

            {/* Column 3: Contact Us */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Contact Us
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.72)' }}>
                <a
                  href="mailto:support@lifedhealth.com"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'rgba(255, 255, 255, 0.72)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6L12 13L2 6" />
                  </svg>
                  <span>support@lifedhealth.com</span>
                </a>

                <a
                  href="tel:+918590177187"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'rgba(255, 255, 255, 0.72)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+91 85901 77187</span>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Kerala, India</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Section */}
      <div style={{
        width: '100%',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '16px clamp(24px, 4vw, 48px) 20px clamp(24px, 4vw, 48px)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.55)',
          lineHeight: 1.5
        }}>
          <span>© 2025–2026 Holobiont Pvt Ltd. All rights reserved.</span>
          <span>Wellbeing Intelligence by Lifed</span>
        </div>
      </div>

      {/* Optional Terms / Privacy / Contact Modal */}
      {modalType && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              color: '#16302B',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: 'rgba(22, 48, 43, 0.06)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 700,
                color: '#16302B'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '22px', fontWeight: 800, marginTop: 0, marginBottom: '16px' }}>
              {modalType === 'terms' ? 'Terms & Conditions' : modalType === 'privacy' ? 'Privacy Policy' : 'Send Us Your Query'}
            </h3>

            {modalType === 'terms' ? (
              <div style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'rgba(22, 48, 43, 0.8)' }}>
                <p><strong>Non-Clinical Use:</strong> Lewis is an evidence-based self-reflection tool. It provides non-clinical wellbeing metrics for personal insight and does not diagnose, treat, or replace professional healthcare.</p>
                <p><strong>Data Ownership:</strong> You retain complete ownership of your inputs. Information entered into Lewis is processed strictly to compile your reflection mirror.</p>
              </div>
            ) : modalType === 'privacy' ? (
              <div style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'rgba(22, 48, 43, 0.8)' }}>
                <p><strong>Privacy First:</strong> Your personal responses and psychological metrics are strictly confidential. Lifed Health does not sell or share personal health reflections with third parties.</p>
                <p><strong>Security:</strong> All payload telemetry is encrypted in transit and at rest.</p>
              </div>
            ) : (
              /* Contact Support Query Form */
              <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                <p style={{ margin: 0, fontSize: '14.5px', color: 'rgba(22, 48, 43, 0.75)', lineHeight: 1.5 }}>
                  Have a question or need assistance? Fill out your details below and your query will be sent directly to Lifed Operations.
                </p>

                {submitStatus.success && (
                  <div style={{ background: '#e6f7f4', border: '1px solid #00ae9d', borderRadius: '12px', padding: '14px 16px', color: '#00776a', fontSize: '14px', lineHeight: 1.5, fontWeight: 700 }}>
                    {submitStatus.success}
                  </div>
                )}

                {submitStatus.error && (
                  <div style={{ background: '#fdf2f2', border: '1px solid #e53e3e', borderRadius: '12px', padding: '14px 16px', color: '#c53030', fontSize: '14px', lineHeight: 1.5, fontWeight: 600 }}>
                    {submitStatus.error}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#16302B' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(22, 48, 43, 0.2)',
                      fontSize: '14.5px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#16302B' }}>Mail ID (Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(22, 48, 43, 0.2)',
                      fontSize: '14.5px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#16302B' }}>Your Query</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type your question or query here..."
                    value={contactForm.query}
                    onChange={(e) => setContactForm({ ...contactForm, query: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(22, 48, 43, 0.2)',
                      fontSize: '14.5px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitStatus.loading}
                  style={{
                    marginTop: '8px',
                    padding: '14px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: '#00ae9d',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: submitStatus.loading ? 'wait' : 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {submitStatus.loading ? 'Sending Query...' : 'Send Query'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  )
}
