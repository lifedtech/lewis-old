/**
 * Stage 1 — Context & Personalisation
 * Name, Age, Sex, Life Roles (11-tile grid), Life Stability slider, Priority ranking, Sensory Pause
 */
import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import NavRow from '../components/NavRow.jsx'
import TileGrid from '../components/primitives/TileGrid.jsx'
import LandscapeSlider from '../components/primitives/LandscapeSlider.jsx'
import styles from './Stage1_Context.module.css'

const LIFE_ROLES = [
  { value: 'student',      label: 'Student',       emoji: '📚' },
  { value: 'professional', label: 'Professional',   emoji: '💼' },
  { value: 'parent',       label: 'Parent',         emoji: '👨‍👧' },
  { value: 'caregiver',    label: 'Caregiver',      emoji: '🤲' },
  { value: 'partner',      label: 'Partner',        emoji: '💑' },
  { value: 'friend',       label: 'Friend',         emoji: '🤝' },
  { value: 'creative',     label: 'Creative',       emoji: '🎨' },
  { value: 'leader',       label: 'Leader',         emoji: '🏔' },
  { value: 'carer_self',   label: 'Self-Carer',     emoji: '🛁' },
  { value: 'between',      label: 'Between things', emoji: '🌊' },
  { value: 'other',        label: 'Other',          emoji: '✨' },
]

const PRIORITY_ITEMS_DEFAULT = [
  { id: 'health',       label: '🫀 Health & body' },
  { id: 'mental',       label: '🧠 Mental wellbeing' },
  { id: 'career',       label: '💼 Career & work' },
  { id: 'money',        label: '💰 Financial peace' },
  { id: 'family',       label: '👨‍👩‍👧 Family & home' },
  { id: 'friends',      label: '🤝 Friendships' },
  { id: 'purpose',      label: '🌱 Purpose & meaning' },
  { id: 'fun',          label: '🎉 Fun & enjoyment' },
  { id: 'growth',       label: '📈 Personal growth' },
]

const SUB_SCREENS = ['intro', 'name', 'roles', 'stability', 'priority', 'sensory']

export default function Stage1_Context() {
  const { answers, setAnswer, setAnswers, nextStage, prevStage } = useLewisStore()
  const [screen, setScreen] = useState('name')
  const [name,     setName]     = useState(answers.name     || '')
  const [age,      setAge]      = useState(answers.age      || '')
  const [sex,      setSex]      = useState(answers.sex      || '')
  const [roles,    setRoles]    = useState(answers.life_roles || [])
  const [stability, setStability] = useState(answers.life_stability ?? 50)
  const [priority, setPriority] = useState(answers.priority_ranking || PRIORITY_ITEMS_DEFAULT)
  const [rippleDone, setRippleDone] = useState(false)

  const go = (s) => setScreen(s)

  const handleDone = () => {
    setAnswers({
      name, age, sex,
      life_roles: roles,
      life_stability: stability,
      priority_ranking: priority.map(p => p.id),
    })
    nextStage()
  }

  // Sensory pause auto-advances after animation
  const startSensory = () => {
    go('sensory')
    setTimeout(() => setRippleDone(true), 3500)
  }

  return (
    <StageShell stage={1}
      title={screen !== 'sensory' ? "A little about you" : null}
      subtitle={screen !== 'sensory' ? "This helps the assessment respond to your world." : null}
    >
      <AnimatePresence mode="wait">

        {/* ── Name & basics ─────────────────────────────────── */}
        {screen === 'name' && (
          <motion.div key="name"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <div className={styles.field}>
              <label className={styles.label} htmlFor="inp-name">What would you like to be called?</label>
              <input
                id="inp-name" type="text" className={styles.input}
                placeholder="First name or nickname"
                value={name} onChange={e => setName(e.target.value)}
                autoFocus autoComplete="given-name"
              />
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="inp-age">Age <span className={styles.opt}>(optional)</span></label>
                <select id="inp-age" className={styles.select}
                  value={age} onChange={e => setAge(e.target.value)}>
                  <option value="">Prefer not to say</option>
                  {['18–24','25–34','35–44','45–54','55–64','65+'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="inp-sex">Sex <span className={styles.opt}>(optional)</span></label>
                <select id="inp-sex" className={styles.select}
                  value={sex} onChange={e => setSex(e.target.value)}>
                  <option value="">Prefer not to say</option>
                  {['Female','Male','Non-binary','Other'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <NavRow onBack={prevStage} onNext={() => go('roles')}
              nextDisabled={!name.trim()} />
          </motion.div>
        )}

        {/* ── Life Roles tiles ─────────────────────────────── */}
        {screen === 'roles' && (
          <motion.div key="roles"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <p className={styles.hint}>
              Which of these feel like <em>you</em> right now? Select all that apply.
            </p>
            <TileGrid
              name="life_roles"
              options={LIFE_ROLES}
              selected={roles}
              onChange={(_, v) => setRoles(v)}
            />
            <NavRow onBack={() => go('name')} onNext={() => go('stability')}
              nextDisabled={roles.length === 0} />
          </motion.div>
        )}

        {/* ── Life Stability landscape slider ──────────────── */}
        {screen === 'stability' && (
          <motion.div key="stability"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <p className={styles.hint}>
              How would you describe where life feels right now?
            </p>
            <LandscapeSlider
              name="life_stability"
              value={stability}
              onChange={(_, v) => setStability(v)}
              leftLabel="Very turbulent"
              rightLabel="Very steady"
            />
            <div className={styles.stabilityBand}>
              <span>{stability < 33 ? '🌊 Turbulent' : stability < 66 ? '🌤 Mixed' : '⛵ Steady'}</span>
            </div>
            <NavRow onBack={() => go('roles')} onNext={() => go('priority')} />
          </motion.div>
        )}

        {/* ── Priority ranking drag list ────────────────────── */}
        {screen === 'priority' && (
          <motion.div key="priority"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <p className={styles.hint}>
              Drag to rank these from <strong>most</strong> to <strong>least</strong> important to you right now.
              <span className={styles.tapHint}> (Tap ↑ ↓ to reorder on mobile)</span>
            </p>
            <Reorder.Group axis="y" values={priority} onReorder={setPriority} className={styles.rankList}>
              {priority.map((item, idx) => (
                <Reorder.Item key={item.id} value={item}
                  className={styles.rankItem}
                  whileDrag={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,176,155,0.2)', cursor: 'grabbing' }}
                >
                  <span className={styles.rankNum}>{idx + 1}</span>
                  <span className={styles.rankLabel}>{item.label}</span>
                  <div className={styles.rankTap}>
                    <button onClick={() => {
                      if (idx === 0) return
                      const a = [...priority]; [a[idx-1],a[idx]] = [a[idx],a[idx-1]]; setPriority(a)
                    }} aria-label="Move up">↑</button>
                    <button onClick={() => {
                      if (idx === priority.length-1) return
                      const a = [...priority]; [a[idx],a[idx+1]] = [a[idx+1],a[idx]]; setPriority(a)
                    }} aria-label="Move down">↓</button>
                  </div>
                  <span className={styles.dragHandle} aria-hidden="true">⠿</span>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <NavRow onBack={() => go('stability')} onNext={startSensory} />
          </motion.div>
        )}

        {/* ── Sensory Pause ─────────────────────────────────── */}
        {screen === 'sensory' && (
          <motion.div key="sensory"
            className={styles.sensory}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          >
            <div className={styles.sensoryRipples} aria-hidden="true">
              {[0,1,2].map(i => (
                <motion.div key={i} className={styles.sensoryRipple}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 3.8, opacity: 0 }}
                  transition={{ duration: 2.6, delay: i * 0.85, ease: 'easeOut', repeat: Infinity, repeatDelay: 1 }}
                />
              ))}
            </div>
            <motion.p className={styles.sensoryText}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}>
              Take a breath. You're doing great.
            </motion.p>
            <AnimatePresence>
              {rippleDone && (
                <motion.button
                  className={styles.sensoryBtn}
                  onClick={handleDone}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.96 }}
                >
                  I'm ready →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>
    </StageShell>
  )
}
