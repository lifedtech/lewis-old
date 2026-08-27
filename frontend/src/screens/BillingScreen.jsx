import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { initiateCheckout } from '../lib/payment.js'
import LewisLogo from '../components/LewisLogo.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'

const NUNITO = "'Nunito', system-ui, sans-serif"
const TEAL = '#00ae9d'
const INK = '#414242'

export default function BillingScreen() {
  const { 
    setScreen, 
    setProfileField, 
    setPaymentSuccess, 
    name: storeName, 
    email: storeEmail, 
    phone: storePhone, 
    authUser,
    analysisData,
    paymentConfig
  } = useLewisStore()

  const [fullName, setFullName] = useState(storeName || authUser?.name || '')
  const [email, setEmail] = useState(storeEmail || authUser?.email || '')
  const [phone, setPhone] = useState(storePhone || '')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const reportPrice = paymentConfig?.plans?.personal_report?.amount_inr 
    ? `₹${paymentConfig.plans.personal_report.amount_inr}` 
    : '₹749'

  const validateForm = () => {
    const nextErrors = {}
    const trimmedName = (fullName || '').trim()
    const trimmedEmail = (email || '').trim()
    const trimmedPhone = (phone || '').trim().replace(/\D/g, '')

    if (!trimmedName || trimmedName.length < 2) {
      nextErrors.fullName = 'Please enter your full name (minimum 2 characters).'
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Please enter your email address to receive your report.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address (e.g., name@example.com).'
    }

    if (!trimmedPhone) {
      nextErrors.phone = 'Please enter your mobile phone number.'
    } else if (trimmedPhone.length < 10) {
      nextErrors.phone = 'Please enter a valid 10-digit mobile number.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleContinuePayment = async (e) => {
    if (e) e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    // Save into store
    setProfileField('name', trimmedName)
    setProfileField('email', trimmedEmail)
    setProfileField('phone', trimmedPhone)

    setIsSubmitting(true)

    try {
      await initiateCheckout({
        plan: 'personal_report',
        reportId: analysisData?.report_uuid,
        userEmail: trimmedEmail,
        userName: trimmedName,
        userPhone: trimmedPhone,
        onSuccess: (verifyData) => {
          setIsSubmitting(false)
          setPaymentSuccess({
            reportUuid: analysisData?.report_uuid,
            orderId: verifyData.order_id,
            paymentId: verifyData.payment_id,
            email: trimmedEmail,
            name: trimmedName,
            phone: trimmedPhone,
            amount: 749,
            paidAt: new Date().toISOString()
          })
          // Navigate to Payment Confirmation Screen
          setScreen('paymentConfirm')
        },
        onError: (err) => {
          setIsSubmitting(false)
          setSubmitError(err?.message || 'Payment initiation was cancelled or encountered an issue. Please try again.')
        }
      })
    } catch (err) {
      setIsSubmitting(false)
      setSubmitError(err?.message || 'Unable to connect to payment gateway. Please check your connection.')
    }
  }

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
      overflow: 'hidden',
    }}>
      <AbstractLineBackground variant="contours" opacity={0.06} />

      {/* Screen Header (matching previous screens style) */}
      <header style={{
        width: '100%',
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '24px clamp(16px, 2.5vw, 24px) 12px clamp(16px, 2.5vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setScreen('mirror')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#85918e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: NUNITO,
              fontSize: '14px',
              fontWeight: 600,
              transition: 'color 0.2s ease',
            }}
            title="Go back to reflection"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1e293b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#85918e')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <LewisLogo size={32} showText={true} animated={false} />
        </div>
      </header>

      {/* Main Billing Form & Order Summary */}
      <main style={{
        flex: 1,
        maxWidth: '1040px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(20px, 3vh, 40px) clamp(16px, 2.5vw, 24px)',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'clamp(20px, 2.5vw, 32px)',
        alignItems: 'start',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* LEFT COLUMN: Customer Information Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(0, 174, 157, 0.18)',
            padding: 'clamp(24px, 3.5vw, 36px)',
            boxShadow: '0 10px 32px rgba(0, 174, 157, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div>
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: TEAL,
              display: 'block',
              marginBottom: '6px',
            }}>
              Step 1 of 2 · Billing & Delivery Details
            </span>
            <h1 style={{
              margin: '0 0 6px 0',
              fontSize: 'clamp(22px, 2.4vw, 28px)',
              fontWeight: 800,
              color: '#1e293b',
              lineHeight: 1.2,
            }}>
              Where should we send your report?
            </h1>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#64748b',
              lineHeight: 1.5,
            }}>
              Your personalised Insight Report will be prepared and delivered directly to your verified email.
            </p>
          </div>

          {submitError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#b91c1c',
              fontSize: '13.5px',
              fontWeight: 600,
              lineHeight: 1.45,
            }}>
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleContinuePayment} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="billing-name" style={{ fontSize: '13.5px', fontWeight: 700, color: INK }}>
                Full Name <span style={{ color: '#d0574f' }}>*</span>
              </label>
              <input
                id="billing-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }))
                }}
                placeholder="Enter your full name"
                style={{
                  padding: '13px 16px',
                  borderRadius: '12px',
                  border: errors.fullName ? '1.5px solid #d0574f' : '1.5px solid #cbd5e1',
                  background: '#fcfdfd',
                  fontSize: '15px',
                  fontFamily: NUNITO,
                  color: INK,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              />
              {errors.fullName && (
                <span style={{ fontSize: '12px', color: '#d0574f', fontWeight: 600 }}>{errors.fullName}</span>
              )}
            </div>

            {/* Email Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="billing-email" style={{ fontSize: '13.5px', fontWeight: 700, color: INK }}>
                Email Address (for report delivery) <span style={{ color: '#d0574f' }}>*</span>
              </label>
              <input
                id="billing-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                }}
                placeholder="your.email@example.com"
                style={{
                  padding: '13px 16px',
                  borderRadius: '12px',
                  border: errors.email ? '1.5px solid #d0574f' : '1.5px solid #cbd5e1',
                  background: '#fcfdfd',
                  fontSize: '15px',
                  fontFamily: NUNITO,
                  color: INK,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <span style={{ fontSize: '12px', color: '#d0574f', fontWeight: 600 }}>{errors.email}</span>
              )}
            </div>

            {/* Phone Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="billing-phone" style={{ fontSize: '13.5px', fontWeight: 700, color: INK }}>
                Mobile Number <span style={{ color: '#d0574f' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: '#64748b',
                  pointerEvents: 'none',
                }}>
                  +91
                </span>
                <input
                  id="billing-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setPhone(digits)
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
                  }}
                  placeholder="98765 43210"
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 52px',
                    borderRadius: '12px',
                    border: errors.phone ? '1.5px solid #d0574f' : '1.5px solid #cbd5e1',
                    background: '#fcfdfd',
                    fontSize: '15px',
                    fontFamily: NUNITO,
                    color: INK,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {errors.phone && (
                <span style={{ fontSize: '12px', color: '#d0574f', fontWeight: 600 }}>{errors.phone}</span>
              )}
            </div>

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '15px 24px',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #00ae9d 0%, #017a6f 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                boxShadow: '0 6px 20px rgba(0, 174, 157, 0.32)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontFamily: NUNITO,
                opacity: isSubmitting ? 0.85 : 1,
              }}
            >
              {isSubmitting ? (
                <span>Opening Razorpay Secure Checkout...</span>
              ) : (
                <>
                  <span>Continue to Payment &nbsp;·&nbsp; {reportPrice}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </motion.button>

            {/* Security Badges */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              paddingTop: '8px',
              fontSize: '12px',
              color: '#85918e',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                🔒 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                ⚡ Razorpay Verified
              </span>
            </div>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          style={{
            background: '#fcfdfd',
            borderRadius: '24px',
            border: '1.5px solid rgba(0, 174, 157, 0.22)',
            padding: 'clamp(24px, 3.5vw, 36px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#007064',
              display: 'block',
              marginBottom: '4px',
            }}>
              Order Summary
            </span>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 800,
              color: '#1e293b',
            }}>
              Personal Insight Report
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Complete Personalised Lewis Wellbeing Intelligence Report
            </p>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(0, 174, 157, 0.16)' }} />

          {/* Included Features List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {[
              'Full 9-domain psychological & biometric synthesis',
              'Personalized leverage point & anchor habit practice',
              'Cross-domain tension spillover analysis',
              '30-day gentle experiment architecture',
              'Full measure citations and peer-reviewed scientific studies',
              'Delivered to your email within 5–10 minutes after verification',
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{
                  color: TEAL,
                  fontSize: '14px',
                  fontWeight: 800,
                  marginTop: '1px',
                }}>
                  ✓
                </span>
                <span style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.45 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(0, 174, 157, 0.16)' }} />

          {/* Pricing Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '4px 0',
          }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: INK }}>Total Payable</span>
            <span style={{ fontSize: '26px', fontWeight: 900, color: TEAL }}>{reportPrice}</span>
          </div>

          {/* Assurance Note */}
          <div style={{
            background: 'rgba(0, 174, 157, 0.08)',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '12px',
            color: '#00655a',
            lineHeight: 1.45,
          }}>
            🛡️ <strong>Manual Quality Verification:</strong> Each report undergoes strict validation before dispatch to ensure 100% integrity of your personalized measurements.
          </div>
        </motion.div>
      </main>

      <LewisFooter />
    </div>
  )
}
