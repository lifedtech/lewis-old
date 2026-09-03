import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { initiateCheckout } from '../lib/payment.js'
import { 
  detectLocalCurrency, 
  detectCountryByIp, 
  formatCurrencyPrice, 
  CURRENCY_METADATA 
} from '../lib/geoCurrency.js'
import { 
  ALL_COUNTRY_CODES, 
  getDefaultCountryDialCode 
} from '../lib/countryData.js'
import LewisLogo from '../components/LewisLogo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'
import { SupportModal } from '../components/SupportWidget.jsx'

const NUNITO = "'Nunito', system-ui, sans-serif"
const TEAL = 'var(--dawn, #00ae9d)'
const INK = 'var(--text, #414242)'

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
    paymentConfig,
    theme,
    selectedPlan,
    planPrice,
    streamlinedRRO,
    transitionToFullVersion
  } = useLewisStore()

  const isStreamlined = selectedPlan === 'streamlined_report' || planPrice === 349
  const baseAmountInr = isStreamlined ? 349 : 749
  const planKey = 'personal_report'

  const initialCurrency = detectLocalCurrency()
  const [fullName, setFullName] = useState(storeName || authUser?.name || '')
  const [email, setEmail] = useState(storeEmail || authUser?.email || '')
  const [phone, setPhone] = useState(storePhone || '')
  const [currency, setCurrency] = useState(initialCurrency)
  const [countryCode, setCountryCode] = useState(getDefaultCountryDialCode(initialCurrency))
  const [liveRates, setLiveRates] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  // Coupon State
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  // Handle currency selection & automatically update country code to match
  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr)
    const matchingDial = getDefaultCountryDialCode(newCurr)
    if (matchingDial) {
      setCountryCode(matchingDial)
    }
  }

  // Detect Country & Currency asynchronously in background
  useEffect(() => {
    detectCountryByIp().then(detected => {
      if (detected) {
        setCurrency(detected)
        const matchingDial = getDefaultCountryDialCode(detected)
        if (matchingDial) setCountryCode(matchingDial)
      }
    })

    // Fetch live rates from backend
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    fetch(`${API_BASE}/payment/exchange-rates`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.currencies) {
          setLiveRates(data.currencies)
        }
      })
      .catch(() => {})
  }, [])

  const currentPriceObj = formatCurrencyPrice(currency, liveRates, appliedCoupon, baseAmountInr)
  const reportPrice = currentPriceObj.formatted

  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    const code = (couponInput || '').trim().toUpperCase()
    if (!code) {
      setCouponError('Please enter a coupon code.')
      return
    }

    setIsValidatingCoupon(true)
    setCouponError('')

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          plan: planKey,
          currency: currency,
        }),
      })

      const data = await res.json()
      if (res.ok && data.valid && data.coupon) {
        setAppliedCoupon(data.coupon)
        setCouponError('')
      } else {
        setAppliedCoupon(null)
        setCouponError(data.error || 'Invalid or expired coupon code.')
      }
    } catch (err) {
      // Fallback check if backend unreachable
      if (code === 'LWSR100') {
        setAppliedCoupon({ code: 'LWSR100', discount_type: 'percentage', discount_value: 100, is_free: true, valid: true })
        setCouponError('')
      } else if (code === 'LWSR97') {
        setAppliedCoupon({ code: 'LWSR97', discount_type: 'flat', discount_value: 729, final_amount: 20, valid: true })
        setCouponError('')
      } else {
        setCouponError('Could not validate coupon. Please check your connection.')
      }
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponError('')
  }

  const validateForm = () => {
    const nextErrors = {}
    const trimmedName = (fullName || '').trim()
    const trimmedEmail = (email || '').trim()

    if (!trimmedName || trimmedName.length < 2) {
      nextErrors.fullName = 'Please enter your full name (minimum 2 characters).'
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Please enter your email address to receive your report.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address (e.g., name@example.com).'
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

    // Save into store
    setProfileField('name', trimmedName)
    setProfileField('email', trimmedEmail)

    setIsSubmitting(true)

    try {
      await initiateCheckout({
        plan: planKey,
        currency: currency,
        reportId: analysisData?.report_uuid || streamlinedRRO?.meta?.rro_id,
        userEmail: trimmedEmail,
        userName: trimmedName,
        userPhone: '',
        couponCode: appliedCoupon?.code || (typeof appliedCoupon === 'string' ? appliedCoupon : null),
        onSuccess: (verifyData) => {
          setIsSubmitting(false)
          setPaymentSuccess({
            reportUuid: analysisData?.report_uuid || streamlinedRRO?.meta?.rro_id,
            orderId: verifyData.order_id,
            paymentId: verifyData.payment_id,
            email: trimmedEmail,
            name: trimmedName,
            phone: '',
            currency: currency,
            amount: currentPriceObj.amount,
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
      background: theme === 'dark' ? 'var(--bg-page, #0C1514)' : 'radial-gradient(ellipse at 50% 0%, #ebf7f4 0%, #f4faf8 45%, #ffffff 100%)',
      color: 'var(--text-main, #414242)',
      fontFamily: NUNITO,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <AbstractLineBackground variant="nodes" opacity={theme === 'dark' ? 0.15 : 0.06} color={theme === 'dark' ? '#38C9B7' : '#00ae9d'} />

      {/* Screen Header (stretched to corners) */}
      <header style={{
        width: '100%',
        padding: 'clamp(16px, 2.2vh, 26px) clamp(16px, 3.5vw, 44px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setScreen(isStreamlined ? 'sl_mirror' : 'mirror')}
            className="header-back-btn"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              color: 'var(--text-sub, #85918e)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: NUNITO,
              fontSize: '14px',
              fontWeight: 600,
              transition: 'color 0.2s ease',
              outline: 'none',
              boxShadow: 'none',
            }}
            title="Go back to reflection"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--dawn, #00ae9d)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-sub, #85918e)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div
            onClick={() => setScreen('landing')}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
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
        </div>

        {/* Top-Right Theme Toggle & Support Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
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
              color: TEAL,
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
            background: 'var(--raised, rgba(255, 255, 255, 0.94))',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1.5px solid var(--border-color, rgba(0, 174, 157, 0.18))',
            padding: 'clamp(24px, 3.5vw, 36px)',
            boxShadow: 'var(--shadow-soft, 0 10px 32px rgba(0, 174, 157, 0.06))',
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
              color: 'var(--dawn, #00ae9d)',
              display: 'block',
              marginBottom: '6px',
            }}>
              Step 1 of 2 · Billing & Delivery Details
            </span>
            <h1 style={{
              margin: '0 0 6px 0',
              fontSize: 'clamp(22px, 2.4vw, 28px)',
              fontWeight: 800,
              color: 'var(--text-main, #1e293b)',
              lineHeight: 1.2,
            }}>
              Where should we send your report?
            </h1>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--text-sub, #64748b)',
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
              <label htmlFor="billing-name" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main, #414242)' }}>
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
                  border: errors.fullName ? '1.5px solid #d0574f' : '1.5px solid var(--border-color, #cbd5e1)',
                  background: 'var(--bg-page, #fcfdfd)',
                  fontSize: '15px',
                  fontFamily: NUNITO,
                  color: 'var(--text-main, #414242)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              />
              {errors.fullName && (
                <span style={{ fontSize: '12px', color: '#d0574f', fontWeight: 600 }}>{errors.fullName}</span>
              )}
            </div>

            {/* Email Address with Delivery Guarantee Notice */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="billing-email" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main, #414242)' }}>
                Email Address (Get your report on your mail) <span style={{ color: '#d0574f' }}>*</span>
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
                  border: errors.email ? '1.5px solid #d0574f' : '1.5px solid var(--border-color, #cbd5e1)',
                  background: 'var(--bg-page, #fcfdfd)',
                  fontSize: '15px',
                  fontFamily: NUNITO,
                  color: 'var(--text-main, #414242)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                marginTop: '2px',
                fontSize: '12.5px',
                color: 'var(--dawn, #00ae9d)',
                fontWeight: 700,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Get your full report and interactive link delivered directly to your mail</span>
              </div>
              {errors.email && (
                <span style={{ fontSize: '12px', color: '#d0574f', fontWeight: 600 }}>{errors.email}</span>
              )}
            </div>

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '15px 24px',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '999px',
                background: '#00ae9d',
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

            {/* Try Full Version Option */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              width: '100%',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                margin: '4px 0',
              }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(0, 174, 157, 0.18))' }} />
                <span style={{ fontSize: '11.5px', color: 'var(--text-sub, #85918e)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(0, 174, 157, 0.18))' }} />
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  if (typeof transitionToFullVersion === 'function') {
                    transitionToFullVersion()
                  } else {
                    setScreen('stage1_0About')
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '999px',
                  border: '1.5px solid var(--panel-border, rgba(0, 174, 157, 0.45))',
                  background: 'var(--raised, #ffffff)',
                  color: 'var(--dawn, #00ae9d)',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  fontFamily: NUNITO,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
                  e.currentTarget.style.background = 'rgba(0, 174, 157, 0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--panel-border, rgba(0, 174, 157, 0.45))'
                  e.currentTarget.style.background = 'var(--raised, #ffffff)'
                }}
              >
                <span>Would you like to try Full Version? →</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          style={{
            background: 'var(--raised, #ffffff)',
            borderRadius: '24px',
            border: '1.5px solid var(--border-color, rgba(0, 174, 157, 0.22))',
            padding: 'clamp(24px, 3.5vw, 36px)',
            boxShadow: 'var(--shadow-soft, 0 4px 20px rgba(0, 0, 0, 0.03))',
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
              color: 'var(--dawn, #00ae9d)',
              display: 'block',
              marginBottom: '4px',
            }}>
              Order Summary
            </span>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--text-main, #1e293b)',
            }}>
              {isStreamlined ? 'Complete Insight Report' : 'Personal Insight Report'}
            </h2>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border-color, rgba(0, 174, 157, 0.16))' }} />

          {/* Included Features List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {(isStreamlined ? [
              'Full 11-Section Insight Report & Petals Diagram',
              'Link Graph & Root Driver Leverage Analysis',
              'Single focused habit architecture with if-then cues',
              'Interactive Web View + Downloadable PDF',
              'Get your complete report dispatched directly to your email',
            ] : [
              'Full 9-domain psychological & biometric synthesis',
              'Personalized leverage point & anchor habit practice',
              'Cross-domain tension spillover analysis',
              'Full measure citations and peer-reviewed scientific studies',
              'Delivered to your email within 5–10 minutes after verification',
            ]).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{
                  color: 'var(--dawn, #00ae9d)',
                  fontSize: '14px',
                  fontWeight: 800,
                  marginTop: '1px',
                }}>
                  ✓
                </span>
                <span style={{ fontSize: '13.5px', color: 'var(--text-sub, #334155)', lineHeight: 1.45 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Currency Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--panel, rgba(255, 255, 255, 0.85))',
            border: '1px solid var(--border-color, rgba(0, 174, 157, 0.22))',
            borderRadius: '12px',
            padding: '8px 14px',
            gap: '8px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-sub, #64748b)' }}>
              Billing Currency
            </span>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="currency-select"
                style={{
                  border: 'none',
                  background: 'transparent',
                  backgroundColor: 'transparent',
                  fontFamily: NUNITO,
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: 'var(--dawn, #00ae9d)',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  paddingRight: '16px',
                  paddingLeft: '0px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  margin: 0,
                }}
              >
                {Object.values(CURRENCY_METADATA).map(curr => (
                  <option
                    key={curr.code}
                    value={curr.code}
                    style={{
                      background: 'var(--card-bg, #13201E)',
                      color: 'var(--text-main, #E9F1EF)',
                      padding: '8px',
                      fontWeight: 700,
                    }}
                  >
                    {curr.flag} {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
              <span style={{
                position: 'absolute',
                right: 0,
                pointerEvents: 'none',
                color: 'var(--dawn, #00ae9d)',
                fontSize: '11px',
                fontWeight: 900,
                lineHeight: 1,
              }}>
                ⌄
              </span>
            </div>
          </div>

          {/* Promo / Coupon Code Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'var(--panel, #ffffff)',
            border: '1px solid var(--border-color, rgba(0, 174, 157, 0.22))',
            borderRadius: '14px',
            padding: '12px 14px',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label htmlFor="coupon-input" style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-main, #334155)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                margin: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--dawn, #00ae9d)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span>Coupon Code</span>
              </label>
              {appliedCoupon && (
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: 'var(--dawn, #017a6f)',
                  background: 'rgba(0, 174, 157, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span>✓</span>
                  <span>Applied</span>
                </span>
              )}
            </div>

            {!appliedCoupon ? (
              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <input
                  id="coupon-input"
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase())
                    if (couponError) setCouponError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleApplyCoupon()
                    }
                  }}
                  placeholder="Enter coupon code"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: couponError ? '1.5px solid #d0574f' : '1.5px solid var(--border-color, #cbd5e1)',
                    background: 'var(--bg-page, #f8fafc)',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: NUNITO,
                    color: 'var(--text-main, #414242)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon}
                  className="btn-primary"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    fontFamily: NUNITO,
                    cursor: isValidatingCoupon ? 'wait' : 'pointer',
                    opacity: isValidatingCoupon ? 0.7 : 1,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 174, 157, 0.25)',
                    margin: 0,
                    minWidth: 'auto',
                    minHeight: 'auto',
                  }}
                >
                  {isValidatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 174, 157, 0.06)',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 174, 157, 0.25)',
                marginTop: '2px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: 800,
                      color: 'var(--dawn, #007064)',
                      fontFamily: 'monospace',
                      letterSpacing: '0.08em',
                    }}>
                      {appliedCoupon?.code || (typeof appliedCoupon === 'string' ? appliedCoupon : 'COUPON')}
                    </span>
                    {appliedCoupon?.savings_formatted && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#007064',
                        background: 'rgba(0, 174, 157, 0.15)',
                        padding: '1px 6px',
                        borderRadius: '6px'
                      }}>
                        Save {appliedCoupon.savings_formatted}
                      </span>
                    )}
                  </div>
                  {appliedCoupon?.description && (
                    <span style={{ fontSize: '11.5px', color: 'var(--text-sub, #64748b)', fontWeight: 600 }}>
                      {appliedCoupon.description}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d0574f',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 6px',
                    fontFamily: NUNITO,
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <span style={{ fontSize: '11.5px', color: '#d0574f', fontWeight: 600 }}>
                {couponError}
              </span>
            )}
          </div>

          {/* Pricing Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '4px 0',
          }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main, #414242)' }}>Total Payable</span>
            <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--dawn, #00ae9d)' }}>{reportPrice}</span>
          </div>

          {/* Assurance Note */}
          <div style={{
            background: 'var(--panel, rgba(0, 174, 157, 0.08))',
            border: '1px solid var(--border-color, rgba(0, 174, 157, 0.2))',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '12px',
            color: 'var(--text-sub, #00655a)',
            lineHeight: 1.45,
          }}>
            🛡️ <strong>Manual Quality Verification:</strong> Each report undergoes strict validation before dispatch to ensure 100% integrity of your personalized measurements.
          </div>
        </motion.div>
      </main>

      <LewisFooter />

      {/* Support Dialog Popup Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        initialName={fullName}
        initialEmail={email}
        screenName="billing"
      />
    </div>
  )
}
