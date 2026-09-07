import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

export default function StreamlinedBrightSpotScreen() {
  const { domainSort, setProfileField, setScreen } = useLewisStore()
  const [reflectionText, setReflectionText] = useState('')

  const strengthList = domainSort?.strength || []
  const okayList = domainSort?.okay || []

  let tier = 1
  let topDomain = 'Energy & drive'

  if (strengthList.length > 0) {
    tier = 1
    topDomain = strengthList[0]
  } else if (okayList.length > 0) {
    tier = 2
    topDomain = okayList[0]
  } else {
    tier = 3
    topDomain = null
  }

  const handleNext = () => {
    setProfileField('brightSpotTier', tier)
    setProfileField('brightSpotText', reflectionText.trim())
    setScreen('sl_5_0Email')
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
        maxWidth: '720px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--dawn, #00ae9d)',
        textTransform: 'uppercase',
        margin: '0 0 10px 0',
      }}>
        {tier === 1 ? 'A BRIGHT SPOT' : 'HONEST REFLECTION'}
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(24px, 3.4vw, 40px)',
        lineHeight: 1.15,
        letterSpacing: '-0.035em',
        margin: '0 0 16px 0',
        color: 'var(--text-main, #414242)',
        maxWidth: '640px',
      }}>
        {tier === 1 && (
          <>
            Your <span style={{ color: 'var(--dawn, #00ae9d)' }}>{topDomain}</span> stands out as a real steady ground right now.
          </>
        )}
        {tier === 2 && (
          <>
            Nothing is in the bright zone right now, and that's honest and useful to name.
          </>
        )}
        {tier === 3 && (
          <>
            Right now, things feel depleted across multiple areas.
          </>
        )}
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 28px 0',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
        maxWidth: '520px',
      }}>
        {tier === 1
          ? 'What has helped keep this steady, even when other things pull at your attention?'
          : 'What has been the main weight you are carrying lately?'}
      </p>

      {/* Input Text Area */}
      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '28px' }}>
        <textarea
          rows={3}
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="A word, sentence, or feeling (optional)..."
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: '18px',
            fontSize: '14px',
            fontFamily: "'Nunito', sans-serif",
            border: '1px solid var(--card-border, #e5e7eb)',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.7))',
            color: 'var(--text-main, #414242)',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--dawn, #00ae9d)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--card-border, #e5e7eb)')}
        />
      </div>

      {/* Continue Button */}
      <div>
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary"
          style={{
            padding: '12px 38px',
            borderRadius: '100px',
            fontSize: '14.5px',
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
          Continue
        </button>
      </div>
    </motion.div>
  )
}
