import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'
import { SupportModal } from '../components/SupportWidget.jsx'
import ReviewModal from '../components/ReviewModal.jsx'

const NUNITO = "'Nunito', system-ui, sans-serif"
const TEAL = '#00ae9d'
const INK = '#414242'

export default function PaymentConfirmScreen() {
  const {
    setScreen,
    email: storeEmail,
    phone: storePhone,
    name: storeName,
    latestPaymentOrder,
    analysisData
  } = useLewisStore()

  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  useEffect(() => {
    // Meta Pixel Purchase Event Tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: latestPaymentOrder?.amount || 749,
        currency: latestPaymentOrder?.currency || 'INR'
      })
    }

    const timer = setTimeout(() => {
      setIsReviewOpen(true)
    }, 750)
    return () => clearTimeout(timer)
  }, [latestPaymentOrder])

  const customerEmail = latestPaymentOrder?.email || storeEmail || 'your email'
  const customerPhone = latestPaymentOrder?.phone || storePhone || ''
  const customerName = latestPaymentOrder?.name || storeName || ''
  const orderId = latestPaymentOrder?.orderId || latestPaymentOrder?.order_id || `ORD-${Date.now().toString(36).toUpperCase()}`
  const formattedAmount = latestPaymentOrder?.amount
    ? (latestPaymentOrder?.currency === 'INR' || !latestPaymentOrder?.currency ? `₹${latestPaymentOrder.amount}` : `${latestPaymentOrder.currency} ${latestPaymentOrder.amount}`)
    : '₹749 (All Taxes Included)'

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      background: 'radial-gradient(ellipse at 50% 0%, #ebf7f4 0%, #f4faf8 45%, #ffffff 100%)',
      color: INK,
      fontFamily: NUNITO,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      <AbstractLineBackground variant="contours" opacity={0.06} />

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LewisLogo size={32} showText={true} animated={false} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              background: '#ffffff',
              border: '1.5px solid rgba(0, 174, 157, 0.45)',
              color: TEAL,
              fontFamily: NUNITO,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 174, 157, 0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TEAL
              e.currentTarget.style.background = 'rgba(0, 174, 157, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 174, 157, 0.45)'
              e.currentTarget.style.background = '#ffffff'
            }}
          >
            <span style={{ fontSize: '15px', color: '#00ae9d' }}>★</span>
            <span>Rate Experience</span>
          </motion.button>

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
              background: '#ffffff',
              border: '1.5px solid rgba(0, 174, 157, 0.45)',
              color: TEAL,
              fontFamily: NUNITO,
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 174, 157, 0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TEAL
              e.currentTarget.style.background = 'rgba(0, 174, 157, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 174, 157, 0.45)'
              e.currentTarget.style.background = '#ffffff'
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

      {/* Main Content: Single Container with Left & Right Panes */}
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
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid rgba(0, 174, 157, 0.22)',
            boxShadow: '0 16px 45px rgba(0, 174, 157, 0.09), 0 4px 16px rgba(0,0,0,0.02)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            overflow: 'hidden',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {/* ── LEFT PANE: Status, Animated Badge & Action Buttons ── */}
          <div style={{
            padding: 'clamp(24px, 3.5vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            boxSizing: 'border-box',
          }}>
            <div>
              {/* Header Lockup: Animated Vector Tick + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                {/* Animated Vector Tick Mark */}
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
                    color: TEAL,
                    display: 'block',
                    marginBottom: '2px',
                  }}>
                    Payment Successful · Order Confirmed
                  </span>
                  <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(20px, 2.2vw, 25px)',
                    fontWeight: 800,
                    color: '#1e293b',
                    lineHeight: 1.2,
                  }}>
                    Preparing your personalised report
                  </h1>
                </div>
              </div>

              {/* Quality Verification Callout Box (Zero Emoticons) */}
              <div style={{
                background: '#eaf6f4',
                border: '1.2px solid #00ae9d',
                borderRadius: '14px',
                padding: '14px 18px',
                marginBottom: '14px',
                boxSizing: 'border-box',
              }}>
                <p style={{
                  margin: '0 0 6px 0',
                  fontSize: 'clamp(13.5px, 1.2vw, 15px)',
                  fontWeight: 700,
                  color: '#015c53',
                  lineHeight: 1.45,
                }}>
                  Your report is preparing and needs manual verification. You will get your report within 5-10 mins on your email.
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#027a6e',
                  lineHeight: 1.4,
                }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#00ae9d',
                    color: '#ffffff',
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

              {/* Delivery Status Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8faf9',
                border: '1px solid rgba(0, 174, 157, 0.16)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12.5px',
                color: '#334155',
              }}>
                <div>
                  <strong>Status:</strong> Dispatched to <strong>{customerEmail}</strong> upon quality review.
                </div>
              </div>
            </div>

            {/* Actions & Concierge Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setScreen('mirror')}
                style={{
                  width: '100%',
                  padding: '13px 22px',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '999px',
                  background: '#00ae9d',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                  fontFamily: NUNITO,
                }}
              >
                View My Reflection Summary →
              </motion.button>

              <button
                onClick={() => setScreen('landing')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = INK}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >
                Back to Home
              </button>

              <p style={{
                margin: '2px 0 0 0',
                fontSize: '11.5px',
                color: '#85918e',
                lineHeight: 1.4,
              }}>
                Need assistance? Contact concierge at{' '}
                <a href="mailto:lewissupport@lifedhealth.com" style={{ color: TEAL, textDecoration: 'underline', fontWeight: 600 }}>
                  lewissupport@lifedhealth.com
                </a>{' '}
                quoting your Order ID.
              </p>
            </div>
          </div>

          {/* ── RIGHT PANE: Official Receipt & Order Details ── */}
          <div style={{
            background: '#f8faf9',
            borderLeft: '1.5px solid rgba(0, 174, 157, 0.14)',
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
                color: TEAL,
                display: 'block',
                marginBottom: '4px',
              }}>
                Official Receipt
              </span>
              <h2 style={{
                margin: 0,
                fontSize: '19px',
                fontWeight: 800,
                color: '#1e293b',
              }}>
                Order Details & Delivery
              </h2>

              <div style={{ width: '100%', height: '1px', background: 'rgba(0, 174, 157, 0.16)', margin: '14px 0' }} />

              {/* Itemized Order Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                  <span>Order Reference ID</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: INK }}>{orderId}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                  <span>Plan Purchased</span>
                  <span style={{ fontWeight: 700, color: INK }}>Personal Insight Report (PDF)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                  <span>Amount Paid</span>
                  <span style={{ fontWeight: 800, color: TEAL, fontSize: '14.5px' }}>{formattedAmount}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                  <span>Delivery Email</span>
                  <span style={{ fontWeight: 700, color: INK }}>{customerEmail}</span>
                </div>

                {customerPhone && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                    <span>Mobile Number</span>
                    <span style={{ fontWeight: 700, color: INK }}>{customerPhone}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                  <span>Delivery Method</span>
                  <span style={{ fontWeight: 700, color: INK }}>Email PDF Attachment</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                  <span>Estimated Delivery</span>
                  <span style={{ fontWeight: 700, color: '#008a7c' }}>Within 5 to 10 Minutes</span>
                </div>
              </div>
            </div>

            {/* Quality Checklist */}
            <div style={{
              borderTop: '1px solid rgba(0, 174, 157, 0.16)',
              paddingTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {[
                'Full 9-domain psychological & somatic reflection',
                'Manual quality verification in progress',
                'Vector PDF sent directly to your inbox',
              ].map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: TEAL, fontSize: '13px', fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Standard Lewis Footer */}
      <LewisFooter />

      {/* Support Popup Modal */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      {/* Review / Experience Feedback Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        customerName={customerName}
        customerEmail={customerEmail}
        orderId={orderId}
      />
    </div>
  )
}
