import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'

const NATURE_OPTIONS = [
  'Yes, regularly',
  'Sometimes',
  'Rarely',
  'No'
]

const CULTURAL_1_OPTIONS = [
  'Strongly, I feel deeply at home',
  'Somewhat, it mostly fits',
  'Partially, parts of it feel right',
  'Not much, I feel like an outsider',
  'This is an area of real pain for me'
]

const LEVEL_DESCRIPTIONS = [
  'Separate',
  'Touching',
  'Connected',
  'Intertwined',
  'Integrated',
  'Merged',
  'Unified'
]

const renderOverlapCircles = (idx, selected) => {
  const r = 16.5
  const distances = [38, 33, 24, 16, 9, 4, 0]
  const distance = distances[idx]
  const cxSelf = 54 - distance / 2
  const cxNature = 54 + distance / 2
  const cy = 26

  return (
    <svg
      width="100%"
      viewBox="0 0 108 52"
      style={{ overflow: 'visible', maxWidth: '72px', height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id={`gradSelf-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" stopOpacity={selected ? '0.95' : '0.75'} />
          <stop offset="100%" stopColor="#F43F5E" stopOpacity={selected ? '0.9' : '0.65'} />
        </linearGradient>

        <linearGradient id={`gradNature-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity={selected ? '0.95' : '0.75'} />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity={selected ? '0.9' : '0.65'} />
        </linearGradient>

        <linearGradient id={`gradUnified-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#A7F3D0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity="0.9" />
        </linearGradient>

        <filter id={`shadow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor={selected ? 'rgba(0,174,157,0.3)' : 'rgba(0,0,0,0.06)'} />
        </filter>
      </defs>

      {idx === 6 ? (
        <g filter={`url(#shadow-${idx})`}>
          <circle
            cx={54}
            cy={cy}
            r={r + 3}
            fill="none"
            stroke="#00AE9D"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            opacity={selected ? 0.95 : 0.6}
          />
          <circle
            cx={54}
            cy={cy}
            r={r}
            fill={`url(#gradUnified-${idx})`}
            stroke={selected ? '#00AE9D' : '#0D9488'}
            strokeWidth={selected ? '2' : '1.5'}
          />
          <text
            x={54}
            y={cy - 3}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="800"
            fontFamily="'Nunito', sans-serif"
            fill="#881337"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Self
          </text>
          <text
            x={54}
            y={cy + 4.5}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="6"
            fontWeight="800"
            fontFamily="'Nunito', sans-serif"
            fill="#064E3B"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Nature
          </text>
        </g>
      ) : (
        <g filter={`url(#shadow-${idx})`}>
          <circle
            cx={cxSelf}
            cy={cy}
            r={r}
            fill={`url(#gradSelf-${idx})`}
            stroke={selected ? '#BE123C' : '#E11D48'}
            strokeWidth={selected ? '1.8' : '1.3'}
            style={{ transition: 'all 0.25s ease' }}
          />
          <circle
            cx={cxNature}
            cy={cy}
            r={r}
            fill={`url(#gradNature-${idx})`}
            stroke={selected ? '#008375' : '#0D9488'}
            strokeWidth={selected ? '1.8' : '1.3'}
            style={{ transition: 'all 0.25s ease' }}
          />
          {idx < 4 ? (
            <>
              <text
                x={cxSelf - (idx >= 2 ? 3.5 : 0)}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="7"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#881337"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Self
              </text>
              <text
                x={cxNature + (idx >= 2 ? 3.5 : 0)}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6.8"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#064E3B"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Nature
              </text>
            </>
          ) : idx === 4 ? (
            <>
              <text
                x={cxSelf - 5.5}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6.2"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#881337"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Self
              </text>
              <text
                x={cxNature + 5.5}
                y={cy + 0.5}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="6.2"
                fontWeight="800"
                fontFamily="'Nunito', sans-serif"
                fill="#064E3B"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                Nature
              </text>
            </>
          ) : (
            <text
              x={54}
              y={cy + 0.5}
              dominantBaseline="central"
              textAnchor="middle"
              fontSize="6"
              fontWeight="800"
              fontFamily="'Nunito', sans-serif"
              fill="#064E3B"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              Self &amp; Nature
            </text>
          )}
        </g>
      )}
    </svg>
  )
}

export default function StreamlinedSurroundingsScreen() {
  const { ins, natureAccess, culturalBelonging_1, setProfileField, setScreen } = useLewisStore()
  const [stepIndex, setStepIndex] = useState(0)

  const handleSelectIns = (val) => {
    setProfileField('ins', val)
    setTimeout(() => setStepIndex(1), 180)
  }

  const handleSelectNature = (val) => {
    setProfileField('natureAccess', val)
    setTimeout(() => setStepIndex(2), 180)
  }

  const handleSelectCulture = (val) => {
    setProfileField('culturalBelonging_1', val)
    setTimeout(() => setScreen('sl_5_2Growth'), 180)
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    } else {
      setScreen('sl_5_2Cfpb5')
    }
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
        padding: '0 16px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {/* STEP 1: INS NATURAL ENVIRONMENT CIRCLES */}
        {stepIndex === 0 && (
          <motion.div
            key="ins-circle-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
            }}>
              SURROUNDINGS &amp; BELONGING · 1 OF 3
            </p>

            <p style={{
              margin: '0 0 20px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              From completely separate (1) to deeply connected (7)
            </p>

            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(22px, 3.4vw, 38px)',
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              margin: '0 0 24px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '640px',
              textAlign: 'center',
            }}>
              Which picture best describes your relationship with the natural environment?
            </h1>

            {/* Responsive 2-Column Grid of Horizontal Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '10px',
              width: '100%',
              maxWidth: '640px',
              marginBottom: '24px',
            }}>
              {[1, 2, 3, 4, 5, 6, 7].map((num, idx) => {
                const isSelected = ins === num
                const isLast = idx === 6
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectIns(num)}
                    className={`option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      gridColumn: isLast ? '1 / -1' : 'auto',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: isLast ? 'center' : 'flex-start',
                      gap: '14px',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                      background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.75))',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected
                        ? '0 4px 14px rgba(0, 174, 157, 0.2)'
                        : 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--dawn, #00ae9d)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--card-border, #e5e7eb)'
                      }
                    }}
                  >
                    <div style={{ width: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {renderOverlapCircles(idx, isSelected)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{
                        fontSize: '14px',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 800,
                        color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                        lineHeight: 1.2,
                      }}>
                        {num}. {LEVEL_DESCRIPTIONS[idx]}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: NATURE ACCESS */}
        {stepIndex === 1 && (
          <motion.div
            key="nature-access-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
            }}>
              SURROUNDINGS &amp; BELONGING · 2 OF 3
            </p>

            <p style={{
              margin: '0 0 24px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Parks, gardens, sea, trees, or open sky.
            </p>

            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(24px, 3.4vw, 40px)',
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              margin: '0 0 32px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '620px',
              textAlign: 'center',
            }}>
              Do you have easy access to green space or natural surroundings?
            </h1>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '440px',
              marginBottom: '20px',
            }}>
              {NATURE_OPTIONS.map((opt) => {
                const isSelected = natureAccess === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectNature(opt)}
                    className={`option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      padding: '13px 20px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 600,
                      border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                      background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                      color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                      textAlign: 'center',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 3: CULTURAL BELONGING */}
        {stepIndex === 2 && (
          <motion.div
            key="culture-belonging-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
            }}>
              SURROUNDINGS &amp; BELONGING · 3 OF 3
            </p>

            <p style={{
              margin: '0 0 24px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Feeling understood, valued, and safe to be who you are.
            </p>

            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(24px, 3.4vw, 40px)',
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              margin: '0 0 32px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '620px',
              textAlign: 'center',
            }}>
              Do you feel a sense of belonging in the culture or community around you?
            </h1>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '460px',
              marginBottom: '20px',
            }}>
              {CULTURAL_1_OPTIONS.map((opt) => {
                const isSelected = culturalBelonging_1 === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectCulture(opt)}
                    className={`option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      padding: '13px 20px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 600,
                      border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                      background: isSelected ? 'rgba(0, 174, 157, 0.08)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                      color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                      textAlign: 'center',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
