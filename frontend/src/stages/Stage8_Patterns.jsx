/**
 * Stage 8 — Patterns
 * 8.1 Energy Arc — 4-zone time-of-day selector (High/Med/Low)
 * 8.2 Stress Clusters — 4 illustrated tile groups ("Cycle" requires opt-in)
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import NavRow from '../components/NavRow.jsx'
import styles from './Stage8_Patterns.module.css'

const TIME_ZONES = [
  { id: 'morning',   label: 'Morning',   icon: '🌅', hours: '6–12am' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️', hours: '12–5pm' },
  { id: 'evening',   label: 'Evening',   icon: '🌆', hours: '5–9pm' },
  { id: 'night',     label: 'Night',     icon: '🌙', hours: '9pm–2am' },
]

const ENERGY_LEVELS = [
  { value: 'high',   label: 'High',   color: '#00B09B', bg: 'rgba(0,176,155,0.12)' },
  { value: 'medium', label: 'Medium', color: '#78C652', bg: 'rgba(120,198,82,0.12)' },
  { value: 'low',    label: 'Low',    color: '#d4956a', bg: 'rgba(212,149,106,0.12)' },
]

const STRESS_CLUSTERS = [
  {
    id: 'work',
    label: 'Work & Performance',
    emoji: '💼',
    items: ['Deadlines', 'Expectations', 'Workload', 'Job security', 'Conflict at work'],
    cycle: false,
  },
  {
    id: 'relationships',
    label: 'Relationships & Family',
    emoji: '👨‍👩‍👧',
    items: ['Partner tension', 'Parenting pressure', 'Family conflict', 'Loneliness', 'Social anxiety'],
    cycle: false,
  },
  {
    id: 'financial',
    label: 'Money & Security',
    emoji: '💰',
    items: ['Bills & debt', 'Housing costs', 'Income uncertainty', 'Saving pressure', 'Future worry'],
    cycle: false,
  },
  {
    id: 'cycle',
    label: 'Hormonal & Cycle',
    emoji: '🌕',
    items: ['PMS / PMDD', 'Perimenopause', 'Hormonal mood shifts', 'Cycle-related fatigue'],
    cycle: true,   // requires explicit opt-in
  },
]

export default function Stage8_Patterns() {
  const { answers, setAnswer, setAnswers, nextStage, prevStage } = useLewisStore()
  const [screen, setScreen] = useState('energy')

  // Energy Arc
  const getEnergy = id => answers[`energy_${id}`] || null
  const setEnergy = (id, val) => setAnswer(`energy_${id}`, val)

  // Stress Clusters
  const [clusterExpanded, setClusterExpanded] = useState(null)
  const [cycleOptIn, setCycleOptIn] = useState(false)
  const getClusterItems = id => answers[`stress_cluster_${id}`] || []
  const toggleItem = (clusterId, item) => {
    const cur = getClusterItems(clusterId)
    const next = cur.includes(item) ? cur.filter(i => i !== item) : [...cur, item]
    setAnswer(`stress_cluster_${clusterId}`, next)
  }

  const energyComplete = TIME_ZONES.every(z => getEnergy(z.id))

  const heightMap = { high: '90%', medium: '55%', low: '25%' }

  return (
    <StageShell stage={8}>
      <AnimatePresence mode="wait">

        {/* ── 8.1 Energy Arc ──────────────────────────────── */}
        {screen === 'energy' && (
          <motion.div key="energy"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>Your energy across the day</h2>
            <p className={styles.sub}>Tap High, Medium, or Low for each part of your typical day.</p>

            {/* Arc visualisation */}
            <div className={styles.arcWrap} aria-label="Energy timeline">
              {TIME_ZONES.map(zone => {
                const val = getEnergy(zone.id)
                const lvl = ENERGY_LEVELS.find(l => l.value === val)
                return (
                  <div key={zone.id} className={styles.arcZone}>
                    <div className={styles.arcBar}>
                      <AnimatePresence>
                        {val && (
                          <motion.div
                            className={styles.arcFill}
                            style={{ background: lvl?.color }}
                            initial={{ height: 0 }}
                            animate={{ height: heightMap[val] || '0%' }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    <div className={styles.arcIcon}>{zone.icon}</div>
                    <div className={styles.arcLabel}>{zone.label}</div>
                    <div className={styles.arcHours}>{zone.hours}</div>
                    <div className={styles.arcBtns}>
                      {ENERGY_LEVELS.map(lvl => (
                        <motion.button
                          key={lvl.value}
                          className={[styles.arcBtn, getEnergy(zone.id) === lvl.value ? styles.arcBtnActive : ''].join(' ')}
                          style={getEnergy(zone.id) === lvl.value ? { background: lvl.bg, borderColor: lvl.color, color: lvl.color } : {}}
                          onClick={() => setEnergy(zone.id, lvl.value)}
                          whileTap={{ scale: 0.88 }}
                          aria-label={`${zone.label} energy: ${lvl.label}`}
                          aria-pressed={getEnergy(zone.id) === lvl.value}
                        >
                          {lvl.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <NavRow onBack={prevStage} onNext={() => setScreen('stress')}
              nextDisabled={!energyComplete} />
          </motion.div>
        )}

        {/* ── 8.2 Stress Clusters ─────────────────────────── */}
        {screen === 'stress' && (
          <motion.div key="stress"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>What kind of stress is present?</h2>
            <p className={styles.sub}>Tap a cluster to expand it, then select what resonates.</p>

            <div className={styles.clusters}>
              {STRESS_CLUSTERS.map(cluster => {
                const isExpanded = clusterExpanded === cluster.id
                const selected   = getClusterItems(cluster.id)
                const isCycle    = cluster.cycle

                if (isCycle && !cycleOptIn) {
                  return (
                    <div key={cluster.id} className={styles.clusterOptIn}>
                      <span className={styles.clusterOptEmoji}>{cluster.emoji}</span>
                      <div>
                        <span className={styles.clusterOptLabel}>{cluster.label}</span>
                        <span className={styles.clusterOptNote}> — optional, tap to include</span>
                      </div>
                      <motion.button
                        className={styles.optInBtn}
                        onClick={() => setCycleOptIn(true)}
                        whileTap={{ scale: 0.94 }}
                      >
                        Include
                      </motion.button>
                    </div>
                  )
                }

                return (
                  <div key={cluster.id} className={styles.cluster}>
                    <motion.button
                      className={[styles.clusterHead, isExpanded ? styles.clusterHeadOpen : ''].join(' ')}
                      onClick={() => setClusterExpanded(isExpanded ? null : cluster.id)}
                      aria-expanded={isExpanded}
                    >
                      <span className={styles.clusterEmoji}>{cluster.emoji}</span>
                      <span className={styles.clusterLabel}>{cluster.label}</span>
                      {selected.length > 0 && (
                        <span className={styles.clusterCount}>{selected.length}</span>
                      )}
                      <span className={styles.clusterChevron}>{isExpanded ? '▲' : '▼'}</span>
                    </motion.button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className={styles.clusterItems}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {cluster.items.map(item => {
                            const active = selected.includes(item)
                            return (
                              <motion.button
                                key={item}
                                className={[styles.clusterItem, active ? styles.clusterItemActive : ''].join(' ')}
                                onClick={() => toggleItem(cluster.id, item)}
                                whileTap={{ scale: 0.94 }}
                                aria-pressed={active}
                              >
                                {active ? '✓ ' : ''}{item}
                              </motion.button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            <NavRow onBack={() => setScreen('energy')} onNext={nextStage} />
          </motion.div>
        )}

      </AnimatePresence>
    </StageShell>
  )
}
