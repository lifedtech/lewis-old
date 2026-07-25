import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { AGREEMENT_5 } from '../constants/scales.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

export default function Stage5_2DienerScreen() {
  const { setScreen, setScaleAnswer, diener } = useLewisStore()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1)
    } else {
      setScreen('stage5_2Ins')
    }
  }

  const handleSelect = (qId, val) => {
    setScaleAnswer('diener', qId, val)
    if (step < 7) {
      setTimeout(() => setStep(step + 1), 350)
    }
  }

  const questions = [
    { id: 'q0', prompt: 'I lead a purposeful and meaningful life' },
    { id: 'q1', prompt: 'My social relationships are supportive and rewarding' },
    { id: 'q2', prompt: 'I am engaged and interested in my daily activities' },
    { id: 'q3', prompt: 'I actively contribute to the happiness and well-being of others' },
    { id: 'q4', prompt: 'I am competent and capable in the activities that are important to me' },
    { id: 'q5', prompt: 'I am a good person and live a good life' },
    { id: 'q6', prompt: 'I am optimistic about my future' },
    { id: 'q7', prompt: 'People respect me' }
  ]

  const currentQ = questions[step]
  const currentAnswer = diener?.[currentQ.id]

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              FLOURISHING &amp; GROWTH
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
              Intellectual &amp;<br />Growth
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
              Evaluating competence, optimism, and overall flourishing.
            </p>
          </div>
          <TopicLineIllustration topic="diener" />
        </div>

        {/* RIGHT — Questionnaire Card Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #e2e8e5',
              borderRadius: '20px',
              padding: '18px 22px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Progress Header Row (Stationary) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                  FLOURISHING &amp; GROWTH · {step + 1} OF {questions.length}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                  {Math.round(((step + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: '#00ae9d' }}
                  animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Question Text & Options Transition (Container stays still) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
              >
                {/* Question Statement */}
                <p style={{ margin: '4px 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#16302b', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
                  "{currentQ.prompt}"
                </p>

                {/* Stacked Option Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  {AGREEMENT_5.map(opt => {
                    const active = currentAnswer === opt
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(currentQ.id, opt)}
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
              Select how strongly you agree with this reflection.
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
              {step < 7 ? 'Next' : 'Continue'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}

