import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { INSTRUMENTS } from '../constants/instruments.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

// One screen renders every stepped questionnaire; the instruments themselves
// are pure data in constants/instruments.js.

const MONO = '"Nunito", sans-serif'
const NUNITO = "'Nunito', sans-serif"
const TEAL = '#00ae9d'
const INK = '#414242'

const eyebrowStyle = {
  fontFamily: MONO, fontSize: '11px', fontWeight: 700,
  letterSpacing: '0.14em', color: TEAL, textTransform: 'uppercase',
}

export default function InstrumentScreen({ id }) {
  const spec = INSTRUMENTS[id]
  const { setScreen, setScaleAnswer } = useLewisStore()
  const answers = useLewisStore((s) => s[spec.slice])
  const [step, setStep] = useState(0)

  const last = spec.items.length - 1
  const item = spec.items[step]
  const scale = item.scale || spec.scale
  const answer = answers?.[item.id]

  const handleSelect = (val) => {
    setScaleAnswer(spec.slice, item.id, val)
    if (step < last) {
      setTimeout(() => setStep(step + 1), 220)
    } else {
      setTimeout(() => setScreen(spec.next), 220)
    }
  }

  const pct = Math.round(((step + 1) / spec.items.length) * 100)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Topic Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p style={{ ...eyebrowStyle, margin: '0 0 10px 0', lineHeight: 1.3 }}>{spec.eyebrow}</p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: INK,
              textAlign: 'left',
            }}>
              {Array.isArray(spec.title) ? spec.title.join(' ') : spec.title}
            </h1>
            {spec.subtitle && (
              <p style={{
                margin: '10px 0 0 0',
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                color: INK,
                fontFamily: NUNITO,
                lineHeight: 1.5,
                maxWidth: '350px',
                textAlign: 'left',
              }}>
                {spec.subtitle}
              </p>
            )}
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <TopicLineIllustration topic={spec.topic} />
          </div>
        </div>

        {/* RIGHT — Questionnaire Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '10px' }}>
          {/* Progress Header Row (Stationary) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={eyebrowStyle}>
                {spec.progress} · {step + 1} OF {spec.items.length}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: INK }}>{pct}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(22, 36, 31, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: TEAL }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Question Text & Options Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}
            >
              <p style={{ margin: '2px 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: INK, fontFamily: NUNITO, lineHeight: 1.4, textAlign: 'left' }}>
                "{item.text}"
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {scale.map((opt) => {
                  const active = answer === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '9px 16px',
                        borderRadius: '14px',
                        border: `1.5px solid ${active ? TEAL : '#d2e7e0'}`,
                        background: active ? '#e4f4ee' : '#f2f9f6',
                        color: INK,
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
                        border: `2px solid ${active ? TEAL : '#c2ceca'}`,
                        background: active ? TEAL : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                      }}>
                        {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </div>
                      <span style={{ fontFamily: NUNITO, fontWeight: active ? 700 : 500, fontSize: '13.5px', color: INK }}>
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#64748b', fontFamily: NUNITO, fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            {item.hint || spec.hint}
          </p>
        </div>

      </div>
    </motion.div>
  )
}
