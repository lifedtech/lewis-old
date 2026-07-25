import {  useState  } from 'react';
import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'

export default function ReflectScreen() {
  const [step, setStep] = useState(1)
  const { who5, setWho5, chips, toggleChip, setScreen } = useLewisStore()

  const handleContinue1 = () => {
    setStep(2)
  }

  const handleContinue2 = () => {
    setScreen('breathe')
  }

  const renderStep1 = () => (
    <div className="qstep active" id="qstep1">
      <p className="eyebrow">Engagement &amp; Energy · EN</p>
      <div className="q-card">
        <p className="q-text">My daily life has been filled with things that interest me.</p>
        <p className="q-caption">Over the last two weeks.</p>
        <div className="scale-grid" id="who5Grid">
          {[
            { val: 0, label: 'At no time' },
            { val: 1, label: 'Some of the time' },
            { val: 2, label: 'Less than half the time' },
            { val: 3, label: 'More than half the time' },
            { val: 4, label: 'Most of the time' },
            { val: 5, label: 'All of the time' },
          ].map(opt => (
            <button 
              key={opt.val}
              className={`scale-opt ${who5 === opt.val ? 'selected' : ''}`}
              onClick={() => setWho5(opt.val)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="micro">There's no wrong answer here — only an honest one.</p>
      </div>
      <div className="spacer"></div>
      <button 
        className="btn-primary" 
        disabled={who5 === null}
        onClick={handleContinue1}
      >
        Continue
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div className="qstep active" id="qstep2">
      <p className="eyebrow">This week</p>
      <div className="q-card">
        <p className="q-text">Which of these feel true right now?</p>
        <p className="q-caption">Choose as many as fit.</p>
        <div className="chip-grid" id="chipGrid">
          {[
            { id: 'money', label: 'Money\'s been on my mind' },
            { id: 'foggy', label: 'Felt foggy or tired' },
            { id: 'people', label: 'Glad for the people around me' },
            { id: 'stretched', label: 'Stretched thin' },
            { id: 'steady', label: 'Mostly steady' },
          ].map(opt => (
            <button 
              key={opt.id}
              className={`chip ${chips.includes(opt.id) ? 'selected' : ''}`}
              onClick={() => toggleChip(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="spacer"></div>
      <button className="btn-primary" onClick={handleContinue2}>Continue</button>
    </div>
  )

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ display: 'flex' }}
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </motion.section>
  )
}
