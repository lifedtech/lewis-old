/**
 * Stage 7 — Habits & Preferences
 * What works for you / what you'd like to try.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import NavRow from '../components/NavRow.jsx'
import TileGrid from '../components/primitives/TileGrid.jsx'
import styles from './Stage7_Habits.module.css'

const CURRENT_HABITS = [
  { value: 'exercise',   label: 'Exercise',         emoji: '🏃' },
  { value: 'meditation', label: 'Meditation',        emoji: '🧘' },
  { value: 'journaling', label: 'Journaling',        emoji: '📓' },
  { value: 'sleep',      label: 'Sleep hygiene',     emoji: '😴' },
  { value: 'therapy',    label: 'Therapy',           emoji: '🗣' },
  { value: 'diet',       label: 'Healthy eating',    emoji: '🥗' },
  { value: 'social',     label: 'Social connection', emoji: '🤝' },
  { value: 'nature',     label: 'Time in nature',    emoji: '🌿' },
  { value: 'creative',   label: 'Creative outlet',   emoji: '🎨' },
  { value: 'none',       label: 'None yet',          emoji: '🌱' },
]

const WANT_HABITS = [
  { value: 'breathwork', label: 'Breathwork',        emoji: '💨' },
  { value: 'cold',       label: 'Cold exposure',     emoji: '🧊' },
  { value: 'reading',    label: 'More reading',      emoji: '📚' },
  { value: 'movement',   label: 'Daily movement',    emoji: '🚶' },
  { value: 'mindful',    label: 'Mindfulness',       emoji: '🌸' },
  { value: 'digital',    label: 'Digital detox',     emoji: '📵' },
  { value: 'community',  label: 'Community',         emoji: '🏘' },
  { value: 'coaching',   label: 'Coaching',          emoji: '🎯' },
  { value: 'nutrition',  label: 'Better nutrition',  emoji: '🥦' },
  { value: 'unsure',     label: 'Not sure yet',      emoji: '💭' },
]

const SUPPORT_STYLES = [
  { value: 'steps',      label: 'Practical steps & tools',    emoji: '🔧' },
  { value: 'validation', label: 'Emotional validation first', emoji: '🫂' },
  { value: 'data',       label: 'Data & explanations',        emoji: '📊' },
  { value: 'direct',     label: 'Just tell me what to do',    emoji: '🎯' },
  { value: 'gentle',     label: 'Gentle nudges over time',    emoji: '🌱' },
]

export default function Stage7_Habits() {
  const { answers, setAnswer, nextStage, prevStage } = useLewisStore()
  const [screen, setScreen] = useState('current')
  const get = k => answers[k] ?? []

  return (
    <StageShell stage={7}>
      <motion.div
        key={screen}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
      >
        {screen === 'current' && (
          <>
            <h2 className={styles.title}>What's already in your toolkit?</h2>
            <p className={styles.sub}>Select everything you currently do to look after yourself.</p>
            <TileGrid
              name="current_habits"
              options={CURRENT_HABITS}
              selected={get('current_habits')}
              onChange={(k,v) => setAnswer(k,v)}
            />
            <NavRow onBack={prevStage} onNext={() => setScreen('want')}
              nextDisabled={get('current_habits').length === 0} />
          </>
        )}

        {screen === 'want' && (
          <>
            <h2 className={styles.title}>What would you like to explore?</h2>
            <p className={styles.sub}>Things you're curious about or want to try.</p>
            <TileGrid
              name="want_habits"
              options={WANT_HABITS}
              selected={get('want_habits')}
              onChange={(k,v) => setAnswer(k,v)}
            />
            <NavRow onBack={() => setScreen('current')} onNext={() => setScreen('support')}
              nextDisabled={get('want_habits').length === 0} />
          </>
        )}

        {screen === 'support' && (
          <>
            <h2 className={styles.title}>How do you work best?</h2>
            <p className={styles.sub}>When it comes to support and guidance, what feels most useful?</p>
            <div className={styles.supportList}>
              {SUPPORT_STYLES.map(s => {
                const active = answers.support_style === s.value
                return (
                  <motion.button key={s.value}
                    className={[styles.supportBtn, active ? styles.supportActive : ''].join(' ')}
                    onClick={() => setAnswer('support_style', s.value)}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ x: 4 }}
                    aria-pressed={active}
                  >
                    <span className={styles.supportEmoji}>{s.emoji}</span>
                    <span className={styles.supportLabel}>{s.label}</span>
                    {active && <span className={styles.supportCheck}>✓</span>}
                  </motion.button>
                )
              })}
            </div>
            <NavRow onBack={() => setScreen('want')} onNext={nextStage}
              nextDisabled={!answers.support_style} />
          </>
        )}
      </motion.div>
    </StageShell>
  )
}
