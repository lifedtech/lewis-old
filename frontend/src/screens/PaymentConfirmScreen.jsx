import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'
import { SupportModal } from '../components/SupportWidget.jsx'
import ReviewModal from '../components/ReviewModal.jsx'

const NUNITO = "'Nunito', system-ui, sans-serif"
const TEAL = 'var(--dawn, #00ae9d)'
const INK = 'var(--text, #414242)'

export default function PaymentConfirmScreen() {
  const {
    setScreen,
    email: storeEmail,
    phone: storePhone,
    name: storeName,
    latestPaymentOrder,
    analysisData,
    theme,
    selectedPlan,
    planPrice,
    transitionToFullVersion
  } = useLewisStore()

  const customerEmail = latestPaymentOrder?.email || storeEmail || 'your email'
  const customerPhone = latestPaymentOrder?.phone || storePhone || ''
  const customerName = latestPaymentOrder?.name || storeName || ''
  const orderId = latestPaymentOrder?.orderId || latestPaymentOrder?.order_id || `ORD-${Date.now().toString(36).toUpperCase()}`

  const flowMode = useLewisStore((s) => s.flowMode)
  const isStreamlined = latestPaymentOrder?.plan === 'streamlined_report' || selectedPlan === 'streamlined_report' || (flowMode === 'streamlined' && selectedPlan !== 'personal_report' && latestPaymentOrder?.plan !== 'personal_report')

  const planName = isStreamlined
    ? 'Complete Insight Report (11-Section PDF)'
    : 'Personal Insight Report (24-Page PDF)'

  const formattedAmount = (() => {
    if (latestPaymentOrder && typeof latestPaymentOrder.amount === 'number') {
      const sym = (!latestPaymentOrder.currency || latestPaymentOrder.currency === 'INR') ? '₹' : `${latestPaymentOrder.currency} `
      if (latestPaymentOrder.amount === 0) return `${sym}0 (100% Coupon Applied)`
      return `${sym}${latestPaymentOrder.amount}`
    }
    return isStreamlined ? '₹349 (All Taxes Included)' : '₹749 (All Taxes Included)'
  })()

  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(() => {
    try {
      return (
        localStorage.getItem(`lewis_review_submitted_${orderId}`) === 'true' ||
        localStorage.getItem('lewis_review_submitted_default') === 'true' ||
        localStorage.getItem('lewis_feedback_completed') === 'true'
      )
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (hasSubmittedFeedback) return
    const timer = setTimeout(() => {
      setIsReviewOpen(true)
    }, 750)
    return () => clearTimeout(timer)
  }, [hasSubmittedFeedback])

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      background: theme === 'dark' ? 'var(--bg-page, #0C1514)' : 'radial-gradient(ellipse at 50% 0%, #ebf7f4 0%, #f4faf8 45%, #ffffff 100%)',
      color: 'var(--text-main, #414242)',
      fontFamily: NUNITO,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      <AbstractLineBackground variant="nodes" opacity={theme === 'dark' ? 0.15 : 0.06} color={theme === 'dark' ? '#38C9B7' : '#00ae9d'} />

      {/* Screen Header (Stretched to outer corners) */}
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
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setScreen('landing')
            }
          }}
          aria-label="Go to Landing Page"
        >
          <LewisLogo size={32} showText={true} animated={false} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
          {!hasSubmittedFeedback && (
            <motion.button
              type="button"
              onClick={() => setIsReviewOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 14px',
                borderRadius: '999px',
                background: 'var(--raised, #ffffff)',
                border: '1.5px solid var(--panel-border, rgba(0, 174, 157, 0.45))',
                color: 'var(--dawn, #00ae9d)',
                fontFamily: NUNITO,
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft, 0 2px 10px rgba(0, 174, 157, 0.1))',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--panel-border, rgba(0, 174, 157, 0.45))'
              }}
            >
              <span style={{ fontSize: '15px', color: 'var(--dawn, #00ae9d)' }}>★</span>
              <span>Rate Experience</span>
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 14px',
              borderRadius: '999px',
              background: 'var(--raised, #ffffff)',
              border: '1.5px solid var(--panel-border, rgba(0, 174, 157, 0.45))',
              color: 'var(--dawn, #00ae9d)',
              fontFamily: NUNITO,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-soft, 0 2px 10px rgba(0, 174, 157, 0.1))',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--panel-border, rgba(0, 174, 157, 0.45))'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Support</span>
          </motion.button>
        </div>
      </header>

      <main style={{
        flex: 1,
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(14px, 2.5vh, 28px) clamp(16px, 2.5vw, 28px)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          style={{
            background: 'var(--raised, #ffffff)',
            borderRadius: '24px',
            border: '1.5px solid var(--border-color, rgba(0, 174, 157, 0.22))',
            boxShadow: 'var(--shadow-soft, 0 16px 45px rgba(0, 174, 157, 0.09))',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            overflow: 'hidden',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <div style={{
            padding: 'clamp(24px, 3.5vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            boxSizing: 'border-box',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: [1, 1.28, 1], opacity: [0.35, 0, 0.35] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      inset: '-3px',
                      borderRadius: '50%',
                      background: 'rgba(0, 174, 157, 0.4)',
                      filter: 'blur(4px)',
                    }}
                  />

                  <svg width="52" height="52" viewBox="0 0 64 64" fill="none" style={{ display: 'block' }}>
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="#00ae9d"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                    />
                    <motion.path
                      d="M19 32.5 L28 41.5 L45 23.5"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                    />
                  </svg>
                </div>

                <div>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--dawn, #00ae9d)',
                    display: 'block',
                    marginBottom: '2px',
                  }}>
                    Order Confirmed
                  </span>
                  <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(22px, 2.4vw, 28px)',
                    fontWeight: 800,
                    color: 'var(--text-main, #1e293b)',
                    lineHeight: 1.2,
                  }}>
                    Payment Confirmed
                  </h1>
                </div>
              </div>
              <div style={{
                background: 'var(--panel, #eaf6f4)',
                border: '1.2px solid var(--border-color, #00ae9d)',
                borderRadius: '14px',
                padding: '14px 18px',
                marginBottom: '14px',
                boxSizing: 'border-box',
              }}>
                <p style={{
                  margin: '0 0 6px 0',
                  fontSize: 'clamp(13.5px, 1.2vw, 15px)',
                  fontWeight: 700,
                  color: 'var(--dawn, #015c53)',
                  lineHeight: 1.45,
                }}>
                  Your report is preparing and needs manual verification. You will get your report within 5-10 mins on your email.
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-sub, #027a6e)',
                  lineHeight: 1.4,
                }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'var(--dawn, #00ae9d)',
                    color: 'var(--action-text, #ffffff)',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    marginRight: '6px',
                    verticalAlign: 'middle',
                    letterSpacing: '0.04em'
                  }}>
                    NOTE
                  </span>
                  Please check your <strong>spam / junk folder</strong> or promotions tab if not received in your primary inbox.
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--panel, #f8faf9)',
                border: '1px solid var(--border-color, rgba(0, 174, 157, 0.16))',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12.5px',
                color: 'var(--text-sub, #334155)',
              }}>
                <div>
                  <strong>Status:</strong> Dispatched to <strong>{customerEmail}</strong> upon quality review.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              {isStreamlined ? (
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    if (typeof transitionToFullVersion === 'function') {
                      transitionToFullVersion()
                    } else {
                      setScreen('stage1_0About')
                    }
                  }}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                    fontFamily: NUNITO,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Would you like to try LEWIS Extended Version? →</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setScreen('mirror')}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                    fontFamily: NUNITO,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Return to Reflection Mirror →</span>
                </motion.button>
              )}

              <button
                type="button"
                onClick={() => setScreen('landing')}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '999px',
                  border: '1.5px solid var(--border-color, #cbd5e1)',
                  background: 'transparent',
                  color: 'var(--text-main, #414242)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: NUNITO,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
                  e.currentTarget.style.color = 'var(--dawn, #00ae9d)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color, #cbd5e1)'
                  e.currentTarget.style.color = 'var(--text-main, #414242)'
                }}
              >
                Back to Home Page
              </button>

              <p style={{
                margin: '2px 0 0 0',
                fontSize: '11.5px',
                color: 'var(--text-sub, #85918e)',
                lineHeight: 1.4,
              }}>
                Need assistance? Contact concierge at{' '}
                <a href="mailto:lewissupport@lifedhealth.com" style={{ color: 'var(--dawn, #00ae9d)', textDecoration: 'underline', fontWeight: 600 }}>
                  lewissupport@lifedhealth.com
                </a>{' '}
                quoting your Order ID.
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--panel, #f8faf9)',
            borderLeft: '1.5px solid var(--border-color, rgba(0, 174, 157, 0.14))',
            padding: 'clamp(24px, 3.5vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            boxSizing: 'border-box',
          }}>
            <div>
              <span style={{
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dawn, #00ae9d)',
                display: 'block',
                marginBottom: '4px',
              }}>
                Official Receipt
              </span>
              <h2 style={{
                margin: 0,
                fontSize: '19px',
                fontWeight: 800,
                color: 'var(--text-main, #1e293b)',
              }}>
                Order Details & Delivery
              </h2>

              <div style={{ width: '100%', height: '1px', background: 'var(--border-color, rgba(0, 174, 157, 0.16))', margin: '14px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-sub, #64748b)' }}>
                  <span>Order Reference ID</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-main, #414242)' }}>{orderId}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-sub, #64748b)' }}>
                  <span>Plan Purchased</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main, #414242)' }}>{planName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-sub, #64748b)' }}>
                  <span>Amount Paid</span>
                  <span style={{ fontWeight: 800, color: 'var(--dawn, #00ae9d)', fontSize: '14.5px' }}>{formattedAmount}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-sub, #64748b)' }}>
                  <span>Delivery Email</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main, #414242)' }}>{customerEmail}</span>
                </div>

                {customerPhone && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-sub, #64748b)' }}>
                    <span>Mobile Number</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main, #414242)' }}>{customerPhone}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-sub, #64748b)' }}>
                  <span>Delivery Method</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main, #414242)' }}>Email PDF Attachment</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-sub, #64748b)' }}>
                  <span>Estimated Delivery</span>
                  <span style={{ fontWeight: 700, color: 'var(--dawn, #008a7c)' }}>Within 5 to 10 Minutes</span>
                </div>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid var(--border-color, rgba(0, 174, 157, 0.16))',
              paddingTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {(isStreamlined ? [
                'Full 11-Section Insight Report & Petals Diagram',
                'Link Graph & Root Driver Leverage Analysis',
                'Encrypted & dispatched exclusively to your verified address',
              ] : [
                'Validated against 9 psychological baseline dimensions',
                'Peer-reviewed self-report literature citations embedded',
                'Encrypted & dispatched exclusively to your verified address',
              ]).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-sub, #475569)' }}>
                  <span style={{ color: 'var(--dawn, #00ae9d)', fontWeight: 800 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <LewisFooter />

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      {/* Review / Experience Feedback Modal */}
      <ReviewModal
        isOpen={isReviewOpen && !hasSubmittedFeedback}
        onClose={() => setIsReviewOpen(false)}
        onSubmitted={() => {
          setHasSubmittedFeedback(true)
          setIsReviewOpen(false)
        }}
        customerName={customerName}
        customerEmail={customerEmail}
        orderId={orderId}
      />
    </div>
  )
}
