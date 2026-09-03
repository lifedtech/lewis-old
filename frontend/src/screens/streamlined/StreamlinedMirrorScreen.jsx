import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

export default function StreamlinedMirrorScreen() {
  const {
    name,
    streamlinedRRO,
    isReportUnlocked,
    transitionToFullVersion,
    setPaymentSuccess,
    setProfileField,
    setScreen
  } = useLewisStore()

  const displayName = name || streamlinedRRO?.meta?.name || 'Friend'

  const handlePayAndUnlock = () => {
    setProfileField('selectedPlan', 'streamlined_report')
    setProfileField('planPrice', 349)
    setScreen('billing')
  }

  const handleTryFullVersion = () => {
    transitionToFullVersion()
  }

  return (
    <motion.div
      className="sl-mirror-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        margin: '0 auto',
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        padding: '52px 20px 60px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
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
        REFLECTION COMPLETE
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(28px, 3.6vw, 42px)',
        lineHeight: 1.12,
        letterSpacing: '-0.035em',
        margin: '0 0 8px 0',
        color: 'var(--text-main, #414242)',
      }}>
        Your reflection is ready, {displayName}.
      </h1>

      {/* Subtitle */}
      <p style={{
        margin: '0 0 22px 0',
        fontSize: 'clamp(13px, 1.5vw, 15px)',
        color: 'var(--text-sub, #657370)',
        fontFamily: "'Nunito', sans-serif",
        maxWidth: '560px',
        lineHeight: 1.5,
      }}>
        Nine areas of your life mapped from your answers. Where things sit, how they connect, and the single place a small change reaches furthest.
      </p>

      {/* Petal Diagram Visual Preview */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '28px',
      }}>
        <div style={{
          width: '140px',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: '50%',
          border: '1px solid rgba(0, 174, 157, 0.15)',
          boxShadow: '0 6px 20px rgba(0, 174, 157, 0.08)',
          padding: '10px',
          boxSizing: 'border-box',
        }}>
          <svg viewBox="-190 -190 380 380" style={{ width: '100%', height: '100%', display: 'block' }}>
            <g fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1">
              <circle cx="0" cy="0" r="57" />
              <circle cx="0" cy="0" r="88" />
              <circle cx="0" cy="0" r="119" />
              <circle cx="0" cy="0" r="150" />
            </g>
            <g stroke="#ffffff" strokeWidth="1.25">
              <path d="M0,0 C10.1,-13.6 9,-39.3 0,-54.5 C-9,-39.3 -10.1,-13.6 0,0" fill="#cf7f5e" fillOpacity="0.78" />
              <path d="M0,0 C18,-4.3 35,-26.5 38.2,-45.6 C20,-39.1 1.1,-18.5 0,0" fill="#cf7f5e" fillOpacity="0.78" />
              <path d="M0,0 C24.5,12.3 64.9,3.3 86.7,-15.3 C59.9,-25.3 18.8,-19.9 0,0" fill="#d9a44a" fillOpacity="0.78" />
              <path d="M0,0 C13.5,31.2 59,54.9 94.5,54.5 C77,23.7 33.8,-3.9 0,0" fill="#00ae9d" fillOpacity="0.82" />
              <path d="M0,0 C-9.5,31.8 9.7,78.1 36.5,100.2 C42.8,66.1 27.7,18.3 0,0" fill="#00ae9d" fillOpacity="0.82" />
              <path d="M0,0 C-24.8,16.3 -38.3,59.2 -32.6,89.7 C-8.7,70 8.5,28.5 0,0" fill="#00ae9d" fillOpacity="0.82" />
              <path d="M0,0 C-17.6,-2.1 -40.2,12.4 -49.4,28.5 C-30.8,28.7 -7,16.3 0,0" fill="#cf7f5e" fillOpacity="0.78" />
              <path d="M0,0 C-15.4,-16.3 -48.9,-20.7 -70.8,-12.5 C-53,2.7 -20,10 0,0" fill="#cf7f5e" fillOpacity="0.78" />
              <path d="M0,0 C-1.5,-25.1 -27.1,-53 -51.8,-61.7 C-47.5,-35.9 -24.4,-5.8 0,0" fill="#d9a44a" fillOpacity="0.78" />
            </g>
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
          </svg>
        </div>
        <span style={{
          fontSize: '11.5px',
          fontFamily: "'Nunito', sans-serif",
          color: 'var(--dawn, #00ae9d)',
          background: 'rgba(0, 174, 157, 0.08)',
          border: '1px solid rgba(0, 174, 157, 0.18)',
          padding: '3px 14px',
          borderRadius: '100px',
          marginTop: '10px',
          fontWeight: 700,
        }}>
          39 answers · 11 sections · Verified analysis
        </span>
      </div>

      {/* Dual Choice Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '18px',
        width: '100%',
        maxWidth: '740px',
        alignItems: 'stretch',
      }}>
        {/* Choice A: Pay ₹349 & Unlock Report */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          padding: '24px',
          borderRadius: '20px',
          background: 'rgba(0, 174, 157, 0.04)',
          border: '2px solid var(--dawn, #00ae9d)',
          boxShadow: '0 6px 22px rgba(0, 174, 157, 0.12)',
          position: 'relative',
        }}>
          {/* Header row: Badge + Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--dawn, #00ae9d)',
              background: 'rgba(0, 174, 157, 0.12)',
              padding: '3px 10px',
              borderRadius: '100px',
            }}>
              INSTANT ACCESS
            </span>
            <span style={{ fontSize: '24px', fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: 'var(--text-main, #414242)' }}>
              ₹349
            </span>
          </div>

          <h3 style={{ fontSize: '18px', fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: 'var(--text-main, #414242)', margin: '0 0 14px', lineHeight: 1.25 }}>
            Unlock Complete Insight Report
          </h3>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '12.5px',
            fontFamily: "'Nunito', sans-serif",
            color: 'var(--text-sub, #657370)',
            fontWeight: 600,
            width: '100%',
          }}>
            {[
              'Full 11-Section Insight Report & Petals Diagram',
              'Link Graph & Root Driver Leverage Analysis',
              'Single focused habit architecture with if-then cues',
              'Interactive Web View + Downloadable PDF',
            ].map((text) => (
              <li key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', lineHeight: 1.4 }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'rgba(0, 174, 157, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.2 5.5L8 1" stroke="var(--dawn, #00ae9d)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handlePayAndUnlock}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '100px',
              fontSize: '14.5px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              border: 'none',
              background: 'var(--dawn, #00ae9d)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
              transition: 'all 0.2s ease',
              marginTop: 'auto',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Get Insight Report — ₹349
          </button>
        </div>

        {/* Choice B: Try Extended Version */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          padding: '24px',
          borderRadius: '20px',
          background: 'var(--card-bg, #ffffff)',
          border: '1.5px solid var(--card-border, #e5e7eb)',
          boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
        }}>
          {/* Header row: Badge + Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-sub, #657370)',
              background: 'rgba(0, 0, 0, 0.05)',
              padding: '3px 10px',
              borderRadius: '100px',
            }}>
              WANT EVEN DEEPER?
            </span>
            <span style={{
              fontSize: '12px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              color: 'var(--dawn, #00ae9d)',
              background: 'rgba(0, 174, 157, 0.08)',
              padding: '2px 8px',
              borderRadius: '6px',
            }}>
              FREE
            </span>
          </div>

          <h3 style={{ fontSize: '18px', fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: 'var(--text-main, #414242)', margin: '0 0 14px', lineHeight: 1.25 }}>
            Continue to Extended Journey
          </h3>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '12.5px',
            fontFamily: "'Nunito', sans-serif",
            color: 'var(--text-sub, #657370)',
            fontWeight: 600,
            width: '100%',
          }}>
            {[
              'Complete all 10 interactive reflective stages',
              'Deep-dive cognitive focus & values mapping',
              'Full multi-area habit architectures',
              'All current answers carried forward without repeating',
            ].map((text) => (
              <li key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', lineHeight: 1.4 }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'rgba(101, 115, 112, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.2 5.5L8 1" stroke="var(--text-sub, #657370)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleTryFullVersion}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '100px',
              fontSize: '14px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              border: '1.5px solid var(--card-border, #cbd5e1)',
              background: '#ffffff',
              color: 'var(--text-main, #414242)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginTop: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
              e.currentTarget.style.color = 'var(--dawn, #00ae9d)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--card-border, #cbd5e1)'
              e.currentTarget.style.color = 'var(--text-main, #414242)'
            }}
          >
            Continue to Extended Version →
          </button>
        </div>
      </div>
      </div>
    </motion.div>
  )
}
