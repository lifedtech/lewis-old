import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import ActTransitionCard from './ActTransitionCard.jsx'

const VARIANTS = [
  {
    headline: "Let's take an honest look at how life feels for you right now.",
    sub: "No right answers. Just your reflection, gently guided."
  },
  {
    headline: "However you're arriving today is okay. Let's begin where you are.",
    sub: "A few honest minutes, just for you."
  },
  {
    headline: "Before anything else, let's notice how things really feel underneath.",
    sub: "Answer just for yourself. Nothing here is judged."
  },
  {
    headline: "Take a breath. There's nothing to get right here, only what's true for you.",
    sub: "A quiet space to see how you really are."
  }
]

export default function StreamlinedWelcomeScreen() {
  const { setScreen } = useLewisStore()
  const [variant, setVariant] = useState(VARIANTS[0])
  const [showAct1, setShowAct1] = useState(false)

  useEffect(() => {
    const idx = Math.floor(Math.random() * VARIANTS.length)
    setVariant(VARIANTS[idx])
  }, [])

  const handleBegin = () => {
    setShowAct1(true)
  }

  if (showAct1) {
    return (
      <ActTransitionCard
        actNumber={1}
        title="Arrival"
        subtitle="Setting up your reflection"
        onDismiss={() => setScreen('sl_1_0About')}
      />
    )
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >

      {/* Main Headline */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(30px, 4.2vw, 48px)',
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
        margin: '0 0 14px 0',
        color: 'var(--text-main, #414242)',
      }}>
        {variant.headline}
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 28px 0',
        fontSize: 'clamp(14px, 1.6vw, 17px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        {variant.sub}
      </p>

      {/* 4 Trust Signals */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '36px',
      }}>
        {['Private', 'Adaptive', 'Research-based', 'Not a diagnosis'].map((pill) => (
          <span
            key={pill}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '12px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
              border: '1px solid var(--card-border, #e5e7eb)',
              color: 'var(--text-sub, #657370)',
              boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
            }}
          >
            {pill}
          </span>
        ))}
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={handleBegin}
        className="btn-primary"
        style={{
          padding: '14px 44px',
          borderRadius: '100px',
          fontSize: '15px',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.02em',
          border: 'none',
          background: 'var(--dawn, #00ae9d)',
          color: '#ffffff',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        Begin Reflection
      </button>

      {/* Expectation Line */}
      <p style={{
        marginTop: '16px',
        fontSize: '12px',
        color: 'var(--text-mute, #9ca3af)',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 500,
      }}>
        Takes about 10–12 minutes. Complete in one sitting.
      </p>
    </motion.div>
  )
}
