import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'

export default function PaymentScreen() {
  const { setScreen, email } = useLewisStore()
  const [selectedPlan, setSelectedPlan] = useState('essential')
  const [loadingPlan, setLoadingPlan] = useState(null)

  // =========================================================================
  // RAZORPAY INTEGRATION PLACEHOLDER
  // Update your Razorpay Key ID, backend order creation API, and plan prices here.
  // =========================================================================
  const handleRazorpayPayment = async (planKey) => {
    setLoadingPlan(planKey)
    try {
      console.log(`[Razorpay] Initiating checkout for plan: ${planKey}, recipient email: ${email || 'guest'}`)

      // --- USER RAZORPAY CODE GOES HERE ---
      // Example implementation:
      // const options = {
      //   key: "YOUR_RAZORPAY_KEY_ID", // e.g. "rzp_test_xxxxxx"
      //   amount: planKey === 'essential' ? 49900 : 149900, // Amount in paise
      //   currency: "INR",
      //   name: "Lewis Wellbeing",
      //   description: planKey === 'essential' ? "25-Page Lewis Insight Mirror" : "Complete Transformation Bundle",
      //   image: "/logo.png",
      //   prefill: {
      //     email: email || "",
      //   },
      //   theme: {
      //     color: "#00ae9d"
      //   },
      //   handler: function (response) {
      //     console.log("Payment Successful:", response.razorpay_payment_id)
      //     alert("Payment successful! Payment ID: " + response.razorpay_payment_id)
      //   }
      // }
      // const rzp = new window.Razorpay(options)
      // rzp.open()

      // Temporary notification for developer
      alert(`Razorpay checkout initiated for ${planKey.toUpperCase()} plan. Plug in your Razorpay Key ID and handler in PaymentScreen.jsx!`)
    } catch (err) {
      console.error('Payment initiation error:', err)
    } finally {
      setLoadingPlan(null)
    }
  }

  const plans = [
    {
      id: 'essential',
      badge: 'MOST POPULAR',
      badgeColor: '#00ae9d',
      title: 'Personal Insight Report',
      priceDisplay: '₹499',
      periodDisplay: 'one-time investment',
      description: 'Your complete 25-page Lewis Insight Mirror sent instantly in high-resolution PDF format to your email.',
      features: [
        'Complete 25-Page Lewis Insight Mirror (PDF)',
        'Full 10-Dimension Psychological Score Matrix',
        'Autonomic Nervous System & Stress Pattern Profile',
        'Personalized Micro-Resolution Action Protocol',
        'Instant Delivery to Your Registered Email'
      ],
      isPopular: true
    },
    {
      id: 'bundle',
      badge: 'COMPLETE SYSTEM',
      badgeColor: '#5fbb46',
      title: 'Transformation Bundle',
      priceDisplay: '₹1,499',
      periodDisplay: 'one-time investment',
      description: 'The complete insight report plus 30-day guided habit architecture and future progress re-assessments.',
      features: [
        'Everything in Personal Insight Report',
        '30-Day Guided Habit & Reflection Roadmap',
        'Sensory Soundscape Audio Companion Library',
        '3 Free Follow-up Re-assessment Vouchers',
        'Priority Direct Support'
      ],
      isPopular: false
    }
  ]

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',
        padding: '16px clamp(12px, 3vw, 32px)',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1000px',
        padding: '12px 0 20px 0',
        borderBottom: '1px solid rgba(0, 174, 157, 0.12)',
        marginBottom: '28px',
        boxSizing: 'border-box'
      }}>
        <button
          onClick={() => setScreen('mirror')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '10px',
            color: '#414242',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '14px',
            fontWeight: 700,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00ae9d'
            e.currentTarget.style.background = 'rgba(0,174,157,0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#414242'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Mirror
        </button>

        <LewisLogo size={30} layout="horizontal" showText={true} animated={false} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '999px',
          background: '#e4f4ee',
          border: '1px solid rgba(0,174,157,0.3)',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#00ae9d',
          textTransform: 'uppercase'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          SECURE CHECKOUT
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '32px' }}>
        <p style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#00ae9d',
          textTransform: 'uppercase',
          margin: '0 0 10px 0',
          lineHeight: 1.3,
        }}>
          UNLOCK YOUR COMPLETE BLUEPRINT
        </p>
        <h1 style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 42px)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: '#414242',
          margin: '0 0 12px 0'
        }}>
          Choose Your Lewis Plan
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          lineHeight: 1.5,
          color: '#414242',
          margin: 0
        }}>
          Get your comprehensive 25-page personalized insight report sent straight to your email.
        </p>
      </div>

      {/* Pricing Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        width: '100%',
        maxWidth: '860px',
        marginBottom: '36px'
      }}>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '32px 28px',
                borderRadius: '24px',
                border: isSelected ? '2px solid #00ae9d' : '1.5px solid #d2e7e0',
                background: isSelected ? 'linear-gradient(180deg, #ffffff 0%, #f4fbf9 100%)' : '#ffffff',
                boxShadow: isSelected ? '0 12px 32px rgba(0, 174, 157, 0.16)' : '0 4px 16px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            >
              {/* Badge */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '28px',
                padding: '4px 14px',
                borderRadius: '999px',
                background: plan.badgeColor,
                color: '#ffffff',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
              }}>
                {plan.badge}
              </div>

              {/* Title & Price */}
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#414242',
                  margin: '0 0 8px 0'
                }}>
                  {plan.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: '36px',
                    color: '#00ae9d',
                    letterSpacing: '-0.02em'
                  }}>
                    {plan.priceDisplay}
                  </span>
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '13px',
                    color: '#64748b',
                    fontWeight: 600
                  }}>
                    / {plan.periodDisplay}
                  </span>
                </div>
              </div>

              <p style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '13.5px',
                lineHeight: 1.45,
                color: '#414242',
                margin: '0 0 20px 0'
              }}>
                {plan.description}
              </p>

              {/* Feature List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '28px',
                flex: 1
              }}>
                {plan.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#e4f4ee',
                      color: '#00ae9d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      ✓
                    </div>
                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '13px',
                      color: '#414242',
                      lineHeight: 1.4,
                      fontWeight: 500
                    }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRazorpayPayment(plan.id)
                }}
                disabled={loadingPlan === plan.id}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: isSelected ? 'linear-gradient(135deg, #00ae9d 0%, #008f81 100%)' : '#00ae9d',
                  color: '#ffffff',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 6px 18px rgba(0, 174, 157, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {loadingPlan === plan.id ? 'Processing...' : 'Get Report on Your Mail'}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Trust & Guarantee Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(16px, 4vw, 36px)',
        flexWrap: 'wrap',
        padding: '16px 24px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(0, 174, 157, 0.15)',
        maxWidth: '860px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '12.5px', fontWeight: 700, color: '#414242' }}>
            256-Bit SSL Encrypted
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '12.5px', fontWeight: 700, color: '#414242' }}>
            Instant Email Delivery
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '12.5px', fontWeight: 700, color: '#414242' }}>
            100% Confidential
          </span>
        </div>
      </div>
    </motion.div>
  )
}
