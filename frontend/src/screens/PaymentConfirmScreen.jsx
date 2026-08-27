import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'

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

  const customerEmail = latestPaymentOrder?.email || storeEmail || 'your email'
  const customerPhone = latestPaymentOrder?.phone || storePhone || ''
  const customerName = latestPaymentOrder?.name || storeName || ''
  const orderId = latestPaymentOrder?.orderId || latestPaymentOrder?.order_id || `ORD-${Date.now().toString(36).toUpperCase()}`

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LewisLogo size={32} showText={true} animated={false} />
        </div>
        <div>
          <button
            onClick={() => setScreen('mirror')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0faf8',
              border: '1px solid rgba(0, 174, 157, 0.28)',
              color: TEAL,
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '999px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 174, 157, 0.14)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0faf8'
            }}
          >
            <span>View Reflection Summary</span>
            <span>→</span>
          </button>
        </div>
      </header>

      {/* Main Confirmation Container */}
      <main style={{
        flex: 1,
        maxWidth: '720px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(32px, 5vh, 60px) clamp(16px, 3.5vw, 32px)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            background: '#ffffff',
            borderRadius: '28px',
            border: '1.5px solid rgba(0, 174, 157, 0.22)',
            padding: 'clamp(32px, 5vw, 48px) clamp(20px, 4vw, 40px)',
            boxShadow: '0 16px 45px rgba(0, 174, 157, 0.1), 0 4px 16px rgba(0,0,0,0.02)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          {/* Animated Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00ae9d 0%, #5fbb46 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '34px',
              boxShadow: '0 8px 24px rgba(0, 174, 157, 0.35)',
              marginBottom: '20px',
            }}
          >
            ✓
          </motion.div>

          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#008a7c',
            marginBottom: '8px',
          }}>
            Payment Successful · Order Confirmed
          </span>

          <h1 style={{
            margin: '0 0 16px 0',
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 800,
            color: '#1e293b',
            lineHeight: 1.2,
          }}>
            Preparing your personalised report
          </h1>

          {/* User Requested Callout Box */}
          <div style={{
            background: 'linear-gradient(135deg, #eaf6f4 0%, #e1f4ef 100%)',
            border: '1.5px solid #00ae9d',
            borderRadius: '18px',
            padding: '20px 24px',
            margin: '12px 0 24px 0',
            textAlign: 'center',
            boxSizing: 'border-box',
            width: '100%',
          }}>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: 'clamp(15px, 1.4vw, 17px)',
              fontWeight: 700,
              color: '#015c53',
              lineHeight: 1.5,
            }}>
              Your report is preparing and needs manual verification. You will get your report within 5–10 mins on your email.
            </p>
            <p style={{
              margin: 0,
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#027a6e',
              lineHeight: 1.4,
            }}>
              📬 <strong>Important:</strong> Please check your <strong>spam / junk folder</strong> or promotions tab if not received in your primary inbox.
            </p>
          </div>

          {/* Delivery & Order Details Summary */}
          <div style={{
            width: '100%',
            background: '#f8faf9',
            borderRadius: '16px',
            border: '1px solid rgba(22, 36, 31, 0.08)',
            padding: '18px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            textAlign: 'left',
            boxSizing: 'border-box',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b' }}>
              <span>Order Reference ID</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: INK }}>{orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b' }}>
              <span>Plan Purchased</span>
              <span style={{ fontWeight: 700, color: INK }}>Personalised Insight Report (PDF)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b' }}>
              <span>Amount Paid</span>
              <span style={{ fontWeight: 800, color: TEAL }}>₹749 (All Taxes Included)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b' }}>
              <span>Delivery Email</span>
              <span style={{ fontWeight: 700, color: INK }}>{customerEmail}</span>
            </div>
            {customerPhone && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b' }}>
                <span>Mobile Number</span>
                <span style={{ fontWeight: 700, color: INK }}>+91 {customerPhone}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b' }}>
              <span>Estimated Delivery</span>
              <span style={{ fontWeight: 700, color: '#008a7c' }}>Within 5 to 10 Minutes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '360px',
          }}>
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setScreen('mirror')}
              style={{
                width: '100%',
                padding: '14px 24px',
                fontSize: '15.5px',
                fontWeight: 700,
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #00ae9d 0%, #017a6f 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 174, 157, 0.28)',
                fontFamily: NUNITO,
              }}
            >
              View My Reflection Summary
            </motion.button>

            <button
              onClick={() => setScreen('landing')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px 12px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = INK}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              Back to Home
            </button>
          </div>

          {/* Support Helpline Note */}
          <p style={{
            margin: '24px 0 0 0',
            fontSize: '12.5px',
            color: '#85918e',
            lineHeight: 1.45,
          }}>
            Need assistance or haven't received your report after 15 minutes? Write to our concierge at{' '}
            <a href="mailto:support@lewiswellbeing.com" style={{ color: TEAL, textDecoration: 'underline', fontWeight: 600 }}>
              support@lewiswellbeing.com
            </a>{' '}
            referencing your Order ID.
          </p>
        </motion.div>
      </main>

      <LewisFooter />
    </div>
  )
}
