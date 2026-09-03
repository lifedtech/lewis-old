import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { STREAMLINED_ACTS } from '../../shared/constants/screenOrder.js'

export default function ActTransitionCard({ actNum, actNumber, title, subtitle, onDismiss }) {
  const currentNum = actNum || actNumber || 1
  const matchedAct = STREAMLINED_ACTS.find((a) => a.num === currentNum)

  const displayTitle = title || matchedAct?.name || `Act ${currentNum}`
  const displaySubtitle = subtitle || matchedAct?.subtitle || ''

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      onClick={onDismiss}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* 6-step Progress Dots */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginBottom: '24px',
      }}>
        {[1, 2, 3, 4, 5, 6].map((num) => {
          const isCurrent = num === currentNum
          const isPast = num < currentNum
          return (
            <span
              key={num}
              style={{
                height: '5px',
                width: isCurrent ? '24px' : '6px',
                borderRadius: '10px',
                background: isCurrent
                  ? 'var(--dawn, #00ae9d)'
                  : isPast
                  ? 'rgba(0, 174, 157, 0.4)'
                  : 'rgba(0, 0, 0, 0.12)',
                transition: 'all 0.3s ease',
              }}
            />
          )
        })}
      </div>

      {/* Eyebrow */}
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 0 12px 0',
      }}>
        Act {currentNum} of 6
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(32px, 4.8vw, 56px)',
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
        margin: '0 0 16px 0',
        color: 'var(--text-main, #414242)',
      }}>
        {displayTitle}
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 36px 0',
        fontSize: 'clamp(14px, 1.8vw, 18px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
        maxWidth: '520px',
        lineHeight: 1.5,
      }}>
        {displaySubtitle}
      </p>

      {/* Tap anywhere hint */}
      <p style={{
        fontSize: '12px',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 600,
        color: 'var(--text-mute, #9ca3af)',
        letterSpacing: '0.04em',
        margin: 0,
      }}>
        Tap anywhere to continue
      </p>
    </motion.div>
  )
}
