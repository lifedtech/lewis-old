import {  useState  } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

const CFPB5_1_SCALE = ['Describes me completely', 'Describes me very well', 'Describes me somewhat', 'Describes me very little', 'Not at all']
const CFPB5_2_SCALE = ['Always', 'Often', 'Sometimes', 'Rarely', 'Never']

const CFPB_ITEMS = [
  { id: 'c1', text: 'Because of my money situation, I feel like I will never have the things I want in life.', scale: CFPB5_1_SCALE, prompt: 'How well does this describe you?' },
  { id: 'c2', text: 'I am just getting by financially.', scale: CFPB5_1_SCALE, prompt: 'How well does this describe you?' },
  { id: 'c3', text: 'I am concerned that the money I have or will save won\'t last.', scale: CFPB5_1_SCALE, prompt: 'How well does this describe you?' },
  { id: 'c4', text: 'I have money left over at the end of the month.', scale: CFPB5_2_SCALE, prompt: 'How often is this true?' },
  { id: 'c5', text: 'My finances control my life.', scale: CFPB5_2_SCALE, prompt: 'How often is this true?' }
]

export default function Stage5_2Cfpb5Screen() {
  const { setScreen, setScaleAnswer, cfpb5 } = useLewisStore()
  const [qIdx, setQIdx] = useState(0)

  const currentItem = CFPB_ITEMS[qIdx]
  const currentAnswer = cfpb5?.[currentItem.id]

  const handleNext = () => {
    if (qIdx < CFPB_ITEMS.length - 1) {
      setQIdx(qIdx + 1)
    } else {
      setScreen('stage5_2Diener')
    }
  }

  const handleSelect = (val) => {
    setScaleAnswer('cfpb5', currentItem.id, val)
    if (qIdx < CFPB_ITEMS.length - 1) {
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
              FINANCIAL WELLBEING
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
            }}>
              Financial<br />Peace
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Assessing financial security and freedom of choice.
            </p>
          </div>
          <TopicLineIllustration topic="cfpb5" />
        </div>

        {/* RIGHT — Questionnaire Card Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #f4f4f4',
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
                  FINANCIAL PEACE · {qIdx + 1} OF {CFPB_ITEMS.length}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                  {Math.round(((qIdx + 1) / CFPB_ITEMS.length) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: '#00ae9d' }}
                  animate={{ width: `${((qIdx + 1) / CFPB_ITEMS.length) * 100}%` }}
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
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
              >
                {/* Question Statement */}
                <p style={{ margin: '4px 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif", lineHeight: 1.4, textAlign: 'left' }}>
                  "{currentItem.text}"
                </p>

                {/* Stacked Option Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  {currentItem.scale.map(opt => {
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
                          color: active ? '#414242' : '#3a3a3a',
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
                          color: active ? '#414242' : '#414242',
                        }}>
                          {opt}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#414242', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              {currentItem.prompt}
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
              {qIdx < CFPB_ITEMS.length - 1 ? 'Next' : 'Continue'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}

