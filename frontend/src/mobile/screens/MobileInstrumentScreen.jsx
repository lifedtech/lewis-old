import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import { INSTRUMENTS } from '../../constants/instruments.js'
import MobileQuestionOption from '../components/MobileQuestionOption.jsx'

export default function MobileInstrumentScreen({ id }) {
  const spec = INSTRUMENTS[id]
  const { setScreen, setScaleAnswer } = useLewisStore()
  const answers = useLewisStore((s) => (spec?.slice ? s[spec.slice] : undefined)) || {}
  const [step, setStep] = useState(0)

  if (!spec) return null

  const last = spec.items.length - 1
  const item = spec.items[step]
  const currentAnswer = answers?.[item?.id]

  const handleSelect = (val) => {
    setScaleAnswer(spec.slice, item.id, val)
    if (step < last) {
      setTimeout(() => setStep(step + 1), 220)
    } else {
      setTimeout(() => setScreen(spec.next), 220)
    }
  }

  const pct = Math.round(((step + 1) / spec.items.length) * 100)
  const activeScale = item.scale ?? spec.scale
  const activeHint = item.hint ?? spec.hint

  const titleText = Array.isArray(spec.title) ? spec.title.join(' ') : (spec.title || 'Assessment')

  return (
    <motion.div
      className="mobile-screen-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '12px 16px 24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Compact Integrated Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '7.5px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#7a8683',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            CHOOSE ONE
          </p>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            margin: 0,
            color: '#414242',
          }}>
            {titleText}
          </h1>
        </div>

        {/* Step Indicator Badge */}
        <span style={{
          fontSize: '10.5px',
          fontWeight: 800,
          letterSpacing: '0.06em',
          color: '#00ae9d',
          background: 'rgba(0, 174, 157, 0.08)',
          padding: '3px 8px',
          borderRadius: '999px',
          fontFamily: "'Nunito', sans-serif",
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {step + 1} / {spec.items.length}
        </span>
      </div>

      {/* Question Text & Options with Clean Step Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {/* Question Prompt */}
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '14px',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#414242',
            fontFamily: "'Nunito', sans-serif",
            textAlign: 'left',
            overflowWrap: 'break-word',
          }}>
            {item.text}
          </p>

          {/* Standardized Option Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', width: '100%' }}>
            {activeScale.map((opt) => {
              const optVal = typeof opt === 'object' ? (opt.value ?? opt.label) : opt
              const optTitle = typeof opt === 'object' ? (opt.label || opt.title || opt.value) : opt
              const optSubtitle = typeof opt === 'object' ? opt.desc : undefined
              const isSelected = Boolean(currentAnswer && currentAnswer === optVal)
              return (
                <MobileQuestionOption
                  key={optVal}
                  selected={isSelected}
                  onClick={() => handleSelect(optVal)}
                  title={optTitle}
                  subtitle={optSubtitle}
                />
              )
            })}
          </div>

          {activeHint && (
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '11px',
              color: '#7a8683',
              fontFamily: "'Nunito', sans-serif",
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              {activeHint}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
