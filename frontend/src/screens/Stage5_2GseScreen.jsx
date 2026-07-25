import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

const GSE_ITEMS = [
  { id: 'g1', text: 'I can always manage to solve difficult problems if I try hard enough.' },
  { id: 'g2', text: 'If someone opposes me, I can find the means and ways to get what I want.' },
  { id: 'g3', text: 'It is easy for me to stick to my aims and accomplish my goals.' },
  { id: 'g4', text: 'I am confident that I could deal efficiently with unexpected events.' },
  { id: 'g5', text: 'Thanks to my resourcefulness, I know how to handle unforeseen situations.' },
  { id: 'g6', text: 'I can solve most problems if I invest the necessary effort.' },
  { id: 'g7', text: 'I can remain calm when facing difficulties because I can rely on my coping abilities.' },
  { id: 'g8', text: 'When I am confronted with a problem, I can usually find several solutions.' },
  { id: 'g9', text: 'If I am in trouble, I can usually think of a solution.' },
  { id: 'g10', text: 'I can usually handle whatever comes my way.' }
]

const GSE_SCALE = ['Not at all true', 'Hardly true', 'Moderately true', 'Exactly true']

export default function Stage5_2GseScreen() {
  const { setScreen, setScaleAnswer, gse } = useLewisStore()
  const [qIdx, setQIdx] = useState(0)

  const currentItem = GSE_ITEMS[qIdx]
  const currentAnswer = gse?.[currentItem.id]

  const handleNext = () => {
    if (qIdx < GSE_ITEMS.length - 1) {
      setQIdx(qIdx + 1)
    } else {
      setScreen('stage5_2Promis')
    }
  }

  const handleSelect = (val) => {
    setScaleAnswer('gse', currentItem.id, val)
    if (qIdx < GSE_ITEMS.length - 1) {
      setTimeout(() => setQIdx(qIdx + 1), 350)
    }
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 52px)',
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
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
            }}>
              ACCOMPLISHMENT &amp; AGENCY
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#16302b',
              textAlign: 'left',
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Accomplishment</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>&amp; Agency</span>
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              How true is each of these statements for your daily agency and goals?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <TopicLineIllustration topic="gse" />
          </div>
        </div>

        {/* RIGHT — Questionnaire Card Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #e2e8e5',
              borderRadius: '20px',
              padding: '16px 20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Progress Header Row (Stationary) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                  AGENCY &amp; CAPABILITY · {qIdx + 1} OF {GSE_ITEMS.length}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                  {Math.round(((qIdx + 1) / GSE_ITEMS.length) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: '#00ae9d' }}
                  animate={{ width: `${((qIdx + 1) / GSE_ITEMS.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Question Text & Options Transition (Container stays still) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}
              >
                {/* Question Statement */}
                <p style={{ margin: '2px 0 2px 0', fontSize: '14.5px', fontWeight: 700, color: '#16302b', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4 }}>
                  "{currentItem.text}"
                </p>

                {/* 4 Stacked Option Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  {GSE_SCALE.map(opt => {
                    const active = currentAnswer === opt
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '8px 14px',
                          borderRadius: '12px',
                          border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                          background: active ? '#e4f4ee' : '#f2f9f6',
                          color: active ? '#044e43' : '#3a3a3a',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                          boxSizing: 'border-box',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                          background: active ? '#00ae9d' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.18s ease',
                        }}>
                          {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                        </div>

                        <span style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: active ? 700 : 500,
                          fontSize: '13.5px',
                          color: active ? '#044e43' : '#16302b',
                        }}>
                          {opt}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#8fa099', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              Select how accurately this statement describes your outlook.
            </p>
          </div>

          {/* Action Button directly below card (moved upwards) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '12px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!currentAnswer}
              style={{
                padding: '9px 36px',
                opacity: currentAnswer ? 1 : 0.5,
                cursor: currentAnswer ? 'pointer' : 'not-allowed',
              }}
            >
              {qIdx < GSE_ITEMS.length - 1 ? 'Next' : 'Continue'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
