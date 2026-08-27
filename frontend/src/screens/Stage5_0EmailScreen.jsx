import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

const MONO = '"Nunito", sans-serif'
const NUNITO = "'Nunito', sans-serif"
const TEAL = '#00ae9d'
const INK = '#414242'

const eyebrowStyle = {
  fontFamily: MONO,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  color: TEAL,
  textTransform: 'uppercase',
}

export default function Stage5_0EmailScreen() {
  const { setScreen, setProfileField, email: storeEmail, subscribeNewsletter: storeSub, authUser } = useLewisStore()
  
  const initialEmail = storeEmail || authUser?.email || ''
  const [email, setEmail] = useState(initialEmail)
  const [subscribe, setSubscribe] = useState(storeSub !== undefined ? storeSub : false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const validateEmail = (val) => {
    const trimmed = (val || '').trim()
    if (!trimmed) {
      return '' // Optional
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(trimmed)) {
      return 'Please enter a valid email address (e.g., name@example.com).'
    }
    return ''
  }

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    setProfileField('email', val)
    if (touched) {
      setError(validateEmail(val))
    }
  }

  const handleToggleNewsletter = () => {
    const nextVal = !subscribe
    setSubscribe(nextVal)
    setProfileField('subscribeNewsletter', nextVal)
  }

  const handleNext = () => {
    setTouched(true)
    const err = validateEmail(email)
    if (err) {
      setError(err)
      return
    }
    setError('')
    setProfileField('email', email ? email.trim() : '')
    setProfileField('subscribeNewsletter', subscribe)
    setScreen('stage5_2Pss10')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Topic Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#85918e',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              Five of nine areas so far
            </p>
            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              margin: 0,
              color: INK,
              textAlign: 'left',
            }}>
              Save what you have built so far.
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '12px 0 0 0',
              fontSize: '15px',
              fontWeight: 600,
              color: 'rgba(65, 66, 66, 0.8)',
              fontFamily: NUNITO,
              lineHeight: 1.6,
              maxWidth: '380px',
              textAlign: 'left',
            }}>
              Add your email and this is held safely, so you can step away and come back to exactly this point. Your reading will be sent here when you finish.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <TopicLineIllustration topic="report_delivery" title="Report Delivery" />
          </div>
        </div>

        {/* RIGHT — Interactive Form Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            width: '100%',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(22, 36, 31, 0.08)',
            padding: 'clamp(20px, 3vw, 36px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            boxShadow: '0 4px 20px -2px rgba(22, 36, 31, 0.04)',
          }}>

            {/* Milestone Header Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(22, 36, 31, 0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(0, 174, 157, 0.12)',
                  color: TEAL,
                  fontSize: '13px',
                  fontWeight: 800,
                }}>
                  ✓
                </span>
                <span style={{
                  fontFamily: NUNITO,
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: INK,
                  letterSpacing: '0.02em',
                }}>
                  Halfway Milestone Reached (50%)
                </span>
              </div>
              <span style={{
                fontFamily: MONO,
                fontSize: '11px',
                fontWeight: 700,
                color: TEAL,
                background: 'rgba(0, 174, 157, 0.08)',
                padding: '4px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Dispatch Ready
              </span>
            </div>

            {/* Email Input Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="user-email-input" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: NUNITO,
                fontSize: '14px',
                fontWeight: 700,
                color: INK,
              }}>
                <span>Where should we send your report? <span style={{ color: '#85918e', fontWeight: 500 }}>(optional)</span></span>
              </label>

              <div style={{ position: 'relative', width: '100%' }}>
                {/* Mail Icon */}
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: error ? '#d0574f' : (email ? TEAL : '#85918e'),
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  transition: 'color 0.2s ease',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>

                <input
                  id="user-email-input"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => { setTouched(true); setError(validateEmail(email)) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleNext()
                    }
                  }}
                  placeholder="Enter your email address"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    borderRadius: '12px',
                    border: error ? '1.5px solid #d0574f' : (email ? '1.5px solid #00ae9d' : '1.5px solid #c2ceca'),
                    background: '#fcfdfd',
                    fontSize: '15px',
                    fontFamily: NUNITO,
                    color: INK,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                    boxShadow: error ? '0 0 0 3px rgba(208, 87, 79, 0.12)' : 'none',
                  }}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    margin: '2px 0 0 4px',
                    fontSize: '12.5px',
                    color: '#d0574f',
                    fontFamily: NUNITO,
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                >
                  {error}
                </motion.p>
              )}

              {/* Progress & Privacy Callout */}
              <div style={{
                background: '#f5f7f6',
                borderRadius: '14px',
                padding: '14px 18px',
                marginTop: '6px',
                textAlign: 'left',
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'rgba(65, 66, 66, 0.8)',
                  fontFamily: NUNITO,
                  fontWeight: 500,
                }}>
                  Used to save your progress and send your reading. Your reflection answers are never used for advertising.
                </p>
              </div>
            </div>

            {/* Subtle Divider */}
            <div style={{ width: '100%', height: '1px', background: 'rgba(22, 36, 31, 0.07)', margin: '0' }} />

            {/* Research Newsletter Subscription Checkbox */}
            <div
              onClick={handleToggleNewsletter}
              role="checkbox"
              aria-checked={subscribe}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  handleToggleNewsletter()
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '2px 0',
                cursor: 'pointer',
                userSelect: 'none',
                outline: 'none',
              }}
            >
              {/* Custom Checkbox Box */}
              <div style={{
                width: '18px',
                height: '18px',
                minWidth: '18px',
                borderRadius: '4px',
                border: subscribe ? '1.5px solid #00ae9d' : '1.5px solid #a4b3ae',
                background: subscribe ? '#00ae9d' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                transition: 'all 0.2s ease',
              }}>
                {subscribe && (
                  <motion.svg
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </motion.svg>
                )}
              </div>

              <span style={{
                fontFamily: NUNITO,
                fontSize: '13.5px',
                lineHeight: 1.5,
                color: 'rgba(65, 66, 66, 0.85)',
                fontWeight: 500,
                textAlign: 'left',
              }}>
                Send me occasional wellbeing research from LEWIS. About once a month, unsubscribe any time.
              </span>
            </div>

          </div>

          {/* Action Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginTop: 'auto',
            paddingTop: '16px',
            flexShrink: 0,
          }}>
            <button
              id="continue-email-btn"
              className="btn-primary"
              style={{
                padding: '12px 36px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
              onClick={handleNext}
            >
              <span>Continue Assessment</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
