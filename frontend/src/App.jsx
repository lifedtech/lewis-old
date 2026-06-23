import { useState } from 'react'
import styles from './App.module.css'

import ProgressBar from './components/ProgressBar.jsx'
import Landing  from './pages/Landing.jsx'
import Phase1   from './pages/Phase1.jsx'
import Phase2   from './pages/Phase2.jsx'
import Phase3   from './pages/Phase3.jsx'
import Phase4   from './pages/Phase4.jsx'
import Phase5   from './pages/Phase5.jsx'
import Phase6   from './pages/Phase6.jsx'
import Results  from './pages/Results.jsx'

const PHASE_TITLES = {
  0: '',
  1: 'Context & Life Stability',
  2: 'Emotional & Mental Wellbeing',
  3: 'Agency, Finances & Flourishing',
  4: 'Body, Burnout & Nourishment',
  5: 'Environment & Financial Context',
  6: 'Support Preferences',
  7: '',
}

export default function App() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({})

  const onChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }))
  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)
  const reset = () => { setStep(0); setForm({}) }

  const props = { data: form, onChange, onNext: next, onBack: back }

  return (
    <div className={styles.shell}>
      {/* Top Nav */}
      {step > 0 && step < 7 && (
        <header className={styles.header}>
          <span className={styles.logo}>🌿 LEWIS</span>
          <span className={styles.phaseTitle}>{PHASE_TITLES[step]}</span>
        </header>
      )}

      {/* Progress */}
      <ProgressBar step={step} />

      {/* Main content */}
      <main className={styles.main}>
        {step === 0 && <Landing   {...props} />}
        {step === 1 && <Phase1    {...props} />}
        {step === 2 && <Phase2    {...props} />}
        {step === 3 && <Phase3    {...props} />}
        {step === 4 && <Phase4    {...props} />}
        {step === 5 && <Phase5    {...props} />}
        {step === 6 && <Phase6    {...props} />}
        {step === 7 && <Results formData={form} onReset={reset} />}
      </main>
    </div>
  )
}
