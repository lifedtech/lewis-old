import { useState } from 'react'

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
  const [modalType, setModalType] = useState(null)

  const closeModal = () => setModalType(null)

  return (
    <footer style={{
      backgroundColor: '#202323',
      color: '#ffffff',
      fontFamily: "'Nunito', sans-serif",
      position: 'relative',
      zIndex: 10,
      width: '100%',
      boxSizing: 'border-box'
    }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="34" height="34" viewBox="0 0 82 82" style={{ flexShrink: 0 }}>
                <path d="M11 41 V11 H41" fill="none" stroke="#ffffff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M71 41 V71 H41" fill="none" stroke="#ffffff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="41" cy="41" r="11" fill="#ffffff" />
                <circle cx="71" cy="11" r="7" fill="#ffffff" />
                <circle cx="11" cy="71" r="7" fill="#ffffff" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '20px', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  Lewis
                </span>
              </div>
            </div>

            {/* Disclaimer text */}
            <p style={{
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.65)',
              margin: 0,
              fontFamily: "'Nunito', sans-serif"
            }}>
              Lewis is a non-clinical wellbeing reflection. It does not provide medical diagnosis or psychiatric treatment.
            </p>
          </div>

          {/* Right Group: Information & Contact Us */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '48px clamp(48px, 6vw, 100px)',
            alignItems: 'flex-start'
          }}>
            {/* Column 2: Information Links */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

                <a
                  href="mailto:support@lifedhealth.com"
                  style={{
                    color: 'rgba(255, 255, 255, 0.72)',
                    fontSize: '14px',
                    fontFamily: "'Nunito', sans-serif",
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.72)'}
                >
                  Contact Support
                </a>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Mail */}
                <a
                  href="mailto:support@lifedhealth.com"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#00AE9D'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00AE9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>support@lifedhealth.com</span>
                </a>

                {/* Phone */}
                <a
                  href="tel:+918590122187"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#00AE9D'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00AE9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+91 85901 22187</span>
                </a>

                {/* Location */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '14px'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00AE9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Kerala, India</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar Section (100% Full Width Edge-to-Edge) */}
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

      {/* Optional Terms / Privacy Modal */}
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
              maxHeight: '80vh',
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
              {modalType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h3>

            {modalType === 'terms' ? (
              <div style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'rgba(22, 48, 43, 0.8)' }}>
                <p><strong>Non-Clinical Use:</strong> Lewis is an evidence-based self-reflection tool. It provides non-clinical wellbeing metrics for personal insight and does not diagnose, treat, or replace professional healthcare.</p>
                <p><strong>Data Ownership:</strong> You retain complete ownership of your inputs. Information entered into Lewis is processed strictly to compile your reflection mirror.</p>
              </div>
            ) : (
              <div style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'rgba(22, 48, 43, 0.8)' }}>
                <p><strong>Privacy First:</strong> Your personal responses and psychological metrics are strictly confidential. Lifed Health does not sell or share personal health reflections with third parties.</p>
                <p><strong>Security:</strong> All payload telemetry is encrypted in transit and at rest.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  )
}
