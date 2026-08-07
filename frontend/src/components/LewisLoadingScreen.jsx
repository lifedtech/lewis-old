import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LewisMotionLogo from './LewisMotionLogo.jsx'

/**
 * LewisLoadingScreen
 * 
 * Recreates the exact Lewis Pulse prototype loading screen:
 * - 5-element Motion Logo
 * - .s-kicker eyebrow ("One moment")
 * - .genwrap container with .genline step lines and pulsing .dot bullets
 * - Smooth step progression transitioning seamlessly to landing page
 */
export default function LewisLoadingScreen({
  progress = null,
  onComplete = null,
  fullScreen = true,
  kicker = "One moment",
  steps = [
    "Reading how you placed things",
    "Matching the Lifed catalogue to your pattern",
    "Building your page"
  ]
}) {
  const [internalProgress, setInternalProgress] = useState(progress !== null ? progress : 0)
  const [activeLineIdx, setActiveLineIdx] = useState(0)

  useEffect(() => {
    if (progress !== null) {
      const idx = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length))
      setActiveLineIdx(idx)
      if (progress >= 100 && onComplete) {
        const timeout = setTimeout(() => {
          onComplete()
        }, 300)
        return () => clearTimeout(timeout)
      }
      return
    }

    // Smooth line-by-line step progression (matching 420ms pulse interval)
    const stepInterval = 450
    const timer = setInterval(() => {
      setActiveLineIdx((prev) => {
        if (prev < steps.length - 1) {
          const next = prev + 1
          setInternalProgress(Math.round(((next + 1) / steps.length) * 100))
          return next
        } else {
          clearInterval(timer)
          setInternalProgress(100)
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 350)
          return prev
        }
      })
    }, stepInterval)

    return () => clearInterval(timer)
  }, [progress, onComplete, steps.length])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: fullScreen ? 'fixed' : 'relative',
        inset: fullScreen ? 0 : 'auto',
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        minHeight: fullScreen ? '100vh' : '420px',
        backgroundColor: '#E6F2EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: fullScreen ? 9999 : 1,
        padding: '24px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif"
      }}
    >
      {/* Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '22%',
        left: '28%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 174, 157, 0.16) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '22%',
        right: '28%',
        width: '340px',
        height: '340px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(95, 187, 70, 0.14) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Center Pulse Loading Wrapper (.genwrap style) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: '460px',
        width: '100%',
        zIndex: 2,
        padding: '20px clamp(16px, 4vw, 32px)'
      }}>

        {/* 5-Element Motion Logo Lockup */}
        <div style={{ marginBottom: '32px', alignSelf: 'center' }}>
          <LewisMotionLogo size={84} showText={true} layout="stacked" glow={true} speed={1.2} />
        </div>

        {/* .s-kicker Eyebrow */}
        <div style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#0A8577',
          marginBottom: '16px'
        }}>
          {kicker}
        </div>

        {/* .genline Sequential Step Lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          {steps.map((text, i) => {
            const isActive = i <= activeLineIdx
            const isCurrent = i === activeLineIdx

            return (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: isActive ? 1 : 0.28,
                  y: isActive ? 0 : 6
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '17px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#16302B' : 'rgba(22, 48, 43, 0.45)'
                }}
              >
                {/* .dot Bullet Circle */}
                <motion.span
                  animate={{
                    scale: isCurrent ? [1, 1.35, 1] : 1,
                    backgroundColor: isActive ? (isCurrent ? '#00AE9D' : '#5FBB46') : 'rgba(22, 48, 43, 0.25)'
                  }}
                  transition={{
                    scale: { duration: 1.2, repeat: isCurrent ? Infinity : 0, ease: 'easeInOut' }
                  }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    flex: 'none'
                  }}
                />
                <span>{text}</span>
              </motion.div>
            )
          })}
        </div>

      </div>
    </motion.div>
  )
}
