/**
 * Stage 6 — Everyday Sharing
 * 5 rapid-fire situational prompts, exactly 3 buttons each.
 * No sliders. Safety intercept on distress signal.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import styles from './Stage6_Sharing.module.css'

const PROMPTS = [
  {
    id: 'hard_day',
    text: "You've had a really difficult day. A friend asks how you are.",
    safety: false,
  },
  {
    id: 'health_worry',
    text: "You've been worried about your health for a few weeks. Your partner notices you seem off.",
    safety: false,
  },
  {
    id: 'money_stress',
    text: "You're under real financial pressure. A colleague mentions they're struggling too.",
    safety: false,
  },
  {
    id: 'feeling_low',
    text: "You've been feeling persistently low and unmotivated. A close friend asks if you're okay.",
    safety: true,   // safety intercept flag
  },
  {
    id: 'overwhelmed',
    text: "You feel completely overwhelmed and like you can't cope. Someone checks in on you.",
    safety: true,
  },
]

const CHOICES = [
  { value: 'keep',   label: 'Keep it to myself',  icon: '🤐' },
  { value: 'little', label: 'Share a little',     icon: '💬' },
  { value: 'fully',  label: 'Share fully',        icon: '🫂' },
]

const DISTRESS_RESOURCE = {
  title: "It sounds like things feel really heavy right now.",
  body:  "You're not alone. If you'd like to talk to someone, these resources are available any time:",
  links: [
    { label: 'Crisis Text Line (US)',   href: 'https://www.crisistextline.org' },
    { label: 'Samaritans (UK)',         href: 'https://www.samaritans.org' },
    { label: 'Lifeline (AU)',           href: 'https://www.lifeline.org.au' },
  ],
}

export default function Stage6_Sharing() {
  const { setAnswer, nextStage, prevStage, triggerSafety, safetyTriggered } = useLewisStore()
  const [idx,       setIdx]       = useState(0)
  const [chosen,    setChosen]    = useState(null)
  const [showSafety, setShowSafety] = useState(false)

  const prompt = PROMPTS[idx]

  const pick = (value) => {
    setChosen(value)
    setAnswer(`sharing_${prompt.id}`, value)

    // Safety check: if prompt is flagged AND user picks 'keep', show resource
    if (prompt.safety && value === 'keep') {
      triggerSafety(prompt.id)
    }

    // Auto-advance after 600ms
    setTimeout(() => {
      setChosen(null)
      if (idx + 1 < PROMPTS.length) {
        setIdx(i => i + 1)
      } else {
        // Check if safety was triggered on ANY flag prompt
        const needsSafety = PROMPTS.some((p, i) => p.safety)
        nextStage()
      }
    }, 600)
  }

  return (
    <StageShell stage={6}
      title="How do you usually share?"
      subtitle="No right answers — just what feels true for you."
    >
      {/* Safety resource overlay */}
      <AnimatePresence>
        {safetyTriggered && (
          <motion.div
            className={styles.safetyOverlay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.safetyCard}>
              <div className={styles.safetyIcon}>🫂</div>
              <h3 className={styles.safetyTitle}>{DISTRESS_RESOURCE.title}</h3>
              <p className={styles.safetyBody}>{DISTRESS_RESOURCE.body}</p>
              <div className={styles.safetyLinks}>
                {DISTRESS_RESOURCE.links.map(l => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                     className={styles.safetyLink}>
                    {l.label} →
                  </a>
                ))}
              </div>
              <button className={styles.safetyContinue}
                onClick={() => nextStage()}>
                Continue with assessment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className={styles.dots} aria-label={`Question ${idx + 1} of ${PROMPTS.length}`}>
        {PROMPTS.map((_, i) => (
          <div key={i} className={[styles.dot, i < idx ? styles.dotDone : '', i === idx ? styles.dotActive : ''].join(' ')} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className={styles.card}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <p className={styles.prompt}>{prompt.text}</p>

          <div className={styles.choices}>
            {CHOICES.map(c => (
              <motion.button
                key={c.value}
                className={[styles.choiceBtn, chosen === c.value ? styles.choiceActive : ''].join(' ')}
                onClick={() => pick(c.value)}
                whileTap={{ scale: 0.94 }}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 360, damping: 18 }}
                aria-label={c.label}
              >
                <span className={styles.choiceIcon}>{c.icon}</span>
                <span className={styles.choiceLabel}>{c.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </StageShell>
  )
}
