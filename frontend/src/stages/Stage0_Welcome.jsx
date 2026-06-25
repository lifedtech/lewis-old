/**
 * Stage 0 — Welcome & Age Gate
 * Age gate modal → welcome sequence → trust signals → proceed
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import styles from './Stage0_Welcome.module.css'

const WELCOME_VARIANTS = [
  "Something's been on your mind. Take a moment.",
  "No labels. No judgement. Just an honest look at how you're doing.",
  "This is your space. Everything here is private and completely yours.",
  "Understanding yourself is the first step to feeling better.",
]

const TRUST_SIGNALS = [
  { icon: '🔬', label: 'Science-backed', desc: 'Built on validated psychological scales' },
  { icon: '🔒', label: 'Private',        desc: 'Your answers never leave your device' },
  { icon: '🧠', label: 'Adaptive',       desc: 'The flow responds to what you share' },
  { icon: '✨', label: 'Non-clinical',   desc: 'No diagnoses. No labels. Just insight.' },
]

const RIPPLE_COUNT = 3

export default function Stage0_Welcome() {
  const { confirmAge, blockAge, ageConfirmed, ageBlocked, nextStage } = useLewisStore()
  const [gateVisible, setGateVisible] = useState(true)
  const [welcomeIdx,  setWelcomeIdx]  = useState(0)
  const [trustIdx,    setTrustIdx]    = useState(-1)
  const [rippling,    setRippling]    = useState(false)
  const [showCta,     setShowCta]     = useState(false)

  // After age confirmed, run the welcome sequence
  useEffect(() => {
    if (!ageConfirmed) return
    setGateVisible(false)

    // Cycle through welcome text variants every 2.2s (show 1 total)
    const wIdx = Math.floor(Math.random() * WELCOME_VARIANTS.length)
    setWelcomeIdx(wIdx)

    // Sequential trust signal reveal
    let i = 0
    const t = setInterval(() => {
      setTrustIdx(i)
      i++
      if (i >= TRUST_SIGNALS.length) {
        clearInterval(t)
        setRippling(true)
        setTimeout(() => {
          setRippling(false)
          setShowCta(true)
        }, 3200)
      }
    }, 500)

    return () => clearInterval(t)
  }, [ageConfirmed])

  if (ageBlocked) {
    return (
      <div className={styles.blocked}>
        <div className={styles.blockedIcon}>🌱</div>
        <h2>Thanks for being honest</h2>
        <p>
          This assessment is designed for adults aged 18 and over.
          If you're under 18 and looking for support, please reach out to
          a trusted adult, school counsellor, or a helpline in your area.
        </p>
        <a href="https://www.crisistextline.org" target="_blank" rel="noreferrer"
           className={styles.resourceLink}>
          Find support resources →
        </a>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {/* Age Gate Modal */}
      <AnimatePresence>
        {!ageConfirmed && gateVisible && (
          <motion.div
            className={styles.gateOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className={styles.gateCard}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <div className={styles.gateIcon}>🌿</div>
              <h2 className={styles.gateTitle}>Before beginning</h2>
              <p className={styles.gateQ}>
                Please confirm: are you <strong>18 or older</strong>?
              </p>
              <div className={styles.gateBtns}>
                <motion.button
                  className={styles.gateYes}
                  onClick={confirmAge}
                  whileTap={{ scale: 0.96 }}
                >
                  Yes, I'm 18 or older
                </motion.button>
                <motion.button
                  className={styles.gateNo}
                  onClick={blockAge}
                  whileTap={{ scale: 0.96 }}
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome sequence (shown after age confirmed) */}
      <AnimatePresence>
        {ageConfirmed && (
          <motion.div
            className={styles.welcome}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Background — ambient circles */}
            <div className={styles.circles} aria-hidden="true">
              {[600, 460, 330, 210].map((sz, i) => (
                <div key={i} className={styles.circle}
                     style={{ '--sz': `${sz}px`, '--delay': `${i}s` }} />
              ))}
            </div>

            <div className={styles.content}>
              {/* LEWIS brand */}
              <motion.h1
                className={styles.brand}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                LEWIS
              </motion.h1>

              {/* Welcome text */}
              <motion.p
                className={styles.welcomeText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {WELCOME_VARIANTS[welcomeIdx]}
              </motion.p>

              {/* Sensory ripple */}
              <AnimatePresence>
                {rippling && (
                  <div className={styles.rippleWrap} aria-hidden="true">
                    {[0,1,2].map(i => (
                      <motion.div
                        key={i}
                        className={styles.ripple}
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 3.5, opacity: 0 }}
                        transition={{ duration: 2.8, delay: i * 0.9, ease: 'easeOut' }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Trust signals */}
              <div className={styles.trustRow} role="list">
                {TRUST_SIGNALS.map((ts, i) => (
                  <motion.div
                    key={ts.label}
                    className={styles.trustChip}
                    role="listitem"
                    initial={{ opacity: 0, y: 10 }}
                    animate={trustIdx >= i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    aria-label={`${ts.label}: ${ts.desc}`}
                  >
                    <span aria-hidden="true">{ts.icon}</span>
                    <span>{ts.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <AnimatePresence>
                {showCta && (
                  <motion.button
                    className={styles.ctaBtn}
                    onClick={nextStage}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Begin session
                    <span className={styles.ctaArrow}>→</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Before age confirmed — just show the gate (handled above) */}
      {!ageConfirmed && !ageBlocked && (
        <div className={styles.landingBg}>
          <div className={styles.circles} aria-hidden="true">
            {[600, 460, 330, 210].map((sz, i) => (
              <div key={i} className={styles.circle}
                   style={{ '--sz': `${sz}px`, '--delay': `${i}s` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
