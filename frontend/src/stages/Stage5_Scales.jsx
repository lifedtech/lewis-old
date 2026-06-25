/**
 * Stage 5 — Validated Measurements
 * 5.1 Landscape Sort (9 cards → 3 drop zones)
 * 5.2 Validated Likert scales (WHO-5, PSS-10, UCLA-3, SQI, etc.)
 * 5.3 Adaptive deep-dives (conditional, max 4)
 * 5.4 Bright Spot
 */
import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import NavRow from '../components/NavRow.jsx'
import LikertScale from '../components/primitives/LikertScale.jsx'
import styles from './Stage5_Scales.module.css'

const SORT_CARDS = [
  { id: 'emotional', label: '😊 Emotional wellbeing', dim: 'emotional_wellbeing' },
  { id: 'stress',    label: '😤 Stress levels',       dim: 'stress_load' },
  { id: 'connect',   label: '🤝 Connection',          dim: 'connection_isolation' },
  { id: 'sleep',     label: '😴 Sleep quality',       dim: 'sleep_recovery' },
  { id: 'body',      label: '🏃 Physical activity',   dim: 'physical_activity' },
  { id: 'money',     label: '💰 Financial peace',     dim: 'financial_peace' },
  { id: 'purpose',   label: '🌱 Purpose & meaning',   dim: 'purpose_meaning' },
  { id: 'burnout',   label: '🔥 Burnout & workload',  dim: 'burnout_workload' },
  { id: 'nourish',   label: '🥗 Nutrition',            dim: 'nutrition_hydration' },
]
const ZONES = [
  { id: 'depleted', label: 'Depleted right now', color: '#e07b39' },
  { id: 'okay',     label: 'Doing okay',         color: '#78C652' },
  { id: 'strength', label: 'A real strength',    color: '#00B09B' },
]
const ZONE_SCORE = { depleted: 25, okay: 55, strength: 80 }

// WHO-5
const WHO5_QS = [
  'I have felt cheerful and in good spirits.',
  'I have felt calm and relaxed.',
  'I have felt active and vigorous.',
  'I woke up feeling fresh and rested.',
  'My daily life has been filled with things that interest me.',
]
// PSS-10
const PSS10_QS = [
  'You were upset because of something that happened unexpectedly?',
  'You felt unable to control the important things in your life?',
  'You felt nervous and stressed?',
  'You felt confident about your ability to handle personal problems?',
  'Things were going your way?',
  'You could not cope with all the things you had to do?',
  'You were able to control irritations in your life?',
  'You felt that you were on top of things?',
  'You were angered by things that were outside your control?',
  'Difficulties were piling up so high that you could not overcome them?',
]
// UCLA-3
const UCLA3_QS = [
  'How often do you feel that you lack companionship?',
  'How often do you feel left out?',
  'How often do you feel isolated from others?',
]
// SQI-4
const SQI4_QS = [
  'Overall sleep quality last week.',
  'Difficulty falling or staying asleep.',
  'Waking up feeling unrefreshed.',
  'Sleep disrupting your daily functioning.',
]

const DEEP_DIVE_QUESTIONS = {
  emotional_wellbeing:  ['What texture best describes this lately?', 'Is it getting better or worse?', 'What gets in the way most?'],
  stress_load:          ['What kind of stress is this?', 'How long has this been elevated?', 'What does the stress feel like in your body?'],
  sleep_recovery:       ['What most disrupts your sleep?', 'How is this affecting your days?', "What's the biggest barrier to better sleep?"],
  connection_isolation: ['What kind of connection do you miss most?', 'How long have you felt this way?', 'What has stopped you from connecting?'],
  physical_activity:    ['What does movement feel like right now?', 'How long since regular exercise?', 'What is the main barrier?'],
  financial_peace:      ['What is the main financial pressure?', 'How long has money felt stressful?', 'Is it getting better or worse?'],
  purpose_meaning:      ['When did purpose last feel strong?', "What's missing most right now?", 'What matters most to you?'],
  burnout_workload:     ['How many hours a week are you working?', 'Do you have recovery time?', 'What drains you the most?'],
  nutrition_hydration:  ['How regular are your meals?', 'How much water do you drink daily?', 'What tends to disrupt healthy eating?'],
}

const TEXTURE_OPTIONS = ['Heavy & slow', 'Tense & tight', 'Empty & flat', 'Scattered & restless', 'Numb & disconnected', 'Mostly fine actually']
const TRAJECTORY_OPTIONS = ["Getting worse", "About the same", "Slowly improving", "Fluctuating"]

export default function Stage5_Scales() {
  const { answers, setAnswer, setAnswers, setScores, setDeepDiveDimensions, nextStage, prevStage } = useLewisStore()
  const [screen, setScreen] = useState('sort')

  // 5.1 Sort state
  const [placed, setPlaced] = useState({}) // { cardId: zoneId }
  const [dragging, setDragging] = useState(null)

  // 5.2 Likert answers
  const get = (k, d) => answers[k] ?? d

  // 5.3 Deep-dive
  const [ddScreen, setDdScreen] = useState(0)
  const [ddDims, setDdDims] = useState([])
  const [ddIdx, setDdIdx] = useState(0)
  const [ddTexture, setDdTexture] = useState(null)
  const [ddTrajectory, setDdTrajectory] = useState(null)
  const [ddFriction, setDdFriction] = useState('')

  // 5.4 Bright spot
  const [brightText, setBrightText] = useState('')

  const handleSortDrop = (cardId, zoneId) => {
    setPlaced(prev => ({ ...prev, [cardId]: zoneId }))
    setDragging(null)
  }

  const computeScoresFromSort = () => {
    const scores = {}
    SORT_CARDS.forEach(card => {
      const zone = placed[card.id] || 'okay'
      scores[card.dim] = ZONE_SCORE[zone]
    })
    return scores
  }

  const proceedFromSort = () => {
    // Assign sort-based scores then refine with Likert
    const sortScores = computeScoresFromSort()
    setScores(sortScores)
    setScreen('scales')
  }

  const proceedFromScales = () => {
    // Compute WHO-5 score
    const who5Raw = [0,1,2,3,4].reduce((s,i) => s + (get(`w${i}`,3)), 0)
    const who5    = who5Raw * 4 // 0-100

    // PSS-10
    const reverseIdx = [3,4,6,7]
    const pss10Raw   = [0,1,2,3,4,5,6,7,8,9].reduce((s,i) => {
      const v = get(`p${i}`, 2)
      return s + (reverseIdx.includes(i) ? 4 - v : v)
    }, 0)
    const pss10 = (pss10Raw / 40) * 100

    // UCLA-3
    const ucla3 = ((([0,1,2].reduce((s,i) => s + get(`u${i}`,2), 0)) - 3) / 6) * 100

    // SQI-4
    const sqi4  = ([0,1,2,3].reduce((s,i) => s + get(`s${i}`,1), 0) / 12) * 100

    const newScores = {
      emotional_wellbeing:  who5,
      stress_load:          pss10,
      connection_isolation: ucla3,
      sleep_recovery:       sqi4,
    }
    setScores(newScores)

    // Find deep-dive candidates (score < 55, max 4)
    const allScores = { ...computeScoresFromSort(), ...newScores }
    const candidates = SORT_CARDS
      .filter(c => (allScores[c.dim] ?? 50) < 55)
      .slice(0, 4)
      .map(c => c.dim)
    setDdDims(candidates)
    setDeepDiveDimensions(candidates)

    if (candidates.length > 0) {
      setScreen('deepdive')
    } else {
      setScreen('brightspot')
    }
  }

  const handleDDNext = () => {
    const dim = ddDims[ddIdx]
    setAnswers({
      [`dd_${dim}_texture`]:    ddTexture,
      [`dd_${dim}_trajectory`]: ddTrajectory,
      [`dd_${dim}_friction`]:   ddFriction,
    })
    setDdTexture(null); setDdTrajectory(null); setDdFriction('')
    setDdScreen(0)
    if (ddIdx + 1 < ddDims.length) {
      setDdIdx(i => i + 1)
    } else {
      setScreen('brightspot')
    }
  }

  // Compute highest score for bright spot logic
  const allCurrentScores = computeScoresFromSort()
  const maxScore = Math.max(...Object.values(allCurrentScores))
  const showBrightInput = maxScore >= 55

  const unplaced = SORT_CARDS.filter(c => !placed[c.id])

  return (
    <StageShell stage={5}>
      <AnimatePresence mode="wait">

        {/* ── 5.1 Landscape Sort ──────────────────────────────── */}
        {screen === 'sort' && (
          <motion.div key="sort"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>Where are things sitting right now?</h2>
            <p className={styles.sub}>Drag each card to the zone that fits best. Unplaced cards stay visible.</p>

            {/* Drop zones */}
            <div className={styles.zones}>
              {ZONES.map(zone => (
                <div
                  key={zone.id}
                  className={styles.zone}
                  style={{ '--zc': zone.color }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => dragging && handleSortDrop(dragging, zone.id)}
                >
                  <span className={styles.zoneLabel} style={{ color: zone.color }}>{zone.label}</span>
                  <div className={styles.zonePile}>
                    {SORT_CARDS.filter(c => placed[c.id] === zone.id).map(card => (
                      <motion.div key={card.id} className={styles.card}
                        layout initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        draggable onDragStart={() => setDragging(card.id)}
                        whileHover={{ y: -2 }}
                      >
                        {card.label}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Unplaced cards */}
            {unplaced.length > 0 && (
              <div className={styles.unplacedWrap}>
                <p className={styles.unplacedLabel}>Unplaced</p>
                <div className={styles.unplacedRow}>
                  {unplaced.map(card => (
                    <motion.div key={card.id} className={styles.card}
                      draggable onDragStart={() => setDragging(card.id)}
                      whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(0,176,155,0.2)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {card.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tap-to-place fallback */}
            {unplaced.length > 0 && (
              <p className={styles.tapFallback}>On mobile: tap a card, then tap a zone to place it.</p>
            )}

            <NavRow onBack={prevStage} onNext={proceedFromSort} />
          </motion.div>
        )}

        {/* ── 5.2 Validated Scales ──────────────────────────── */}
        {screen === 'scales' && (
          <motion.div key="scales"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>A few more honest questions</h2>
            <p className={styles.sub}>These use validated psychological scales. There are no right or wrong answers.</p>

            <div className={styles.scaleGroup}>
              <div className={styles.scaleGroupTitle}>🌤 Emotional Wellbeing (WHO-5)</div>
              <p className={styles.scaleCaption}>Over the last two weeks — how often?</p>
              {WHO5_QS.map((q, i) => (
                <LikertScale key={i} question={q} name={`w${i}`} points={5} index={i}
                  value={get(`w${i}`, 3)} onChange={(k,v) => setAnswer(k,v)} />
              ))}
            </div>

            <div className={styles.scaleGroup}>
              <div className={styles.scaleGroupTitle}>🧠 Stress Load (PSS-10)</div>
              <p className={styles.scaleCaption}>In the last month — how often?</p>
              {PSS10_QS.map((q, i) => (
                <LikertScale key={i} question={q} name={`p${i}`} points={5} index={i}
                  value={get(`p${i}`, 2)} onChange={(k,v) => setAnswer(k,v)} />
              ))}
            </div>

            <div className={styles.scaleGroup}>
              <div className={styles.scaleGroupTitle}>🤝 Connection (UCLA-3)</div>
              <p className={styles.scaleCaption}>1 = Hardly ever · 3 = Often</p>
              {UCLA3_QS.map((q, i) => (
                <LikertScale key={i} question={q} name={`u${i}`} points={4} index={i}
                  value={get(`u${i}`, 2)} onChange={(k,v) => setAnswer(k,v)} />
              ))}
            </div>

            <div className={styles.scaleGroup}>
              <div className={styles.scaleGroupTitle}>😴 Sleep Quality (SQI-4)</div>
              <p className={styles.scaleCaption}>0 = Good · 3 = Terrible (4-point scale)</p>
              {SQI4_QS.map((q, i) => (
                <LikertScale key={i} question={q} name={`s${i}`} points={4} index={i}
                  value={get(`s${i}`, 1)} onChange={(k,v) => setAnswer(k,v)} />
              ))}
            </div>

            <NavRow onBack={() => setScreen('sort')} onNext={proceedFromScales}
              nextLabel="Continue →" />
          </motion.div>
        )}

        {/* ── 5.3 Adaptive Deep Dives ───────────────────────── */}
        {screen === 'deepdive' && ddDims.length > 0 && (
          <motion.div key={`dd-${ddIdx}`}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>A little deeper on one area</h2>
            <p className={styles.sub}>
              {ddIdx + 1} of {ddDims.length} · <strong>{ddDims[ddIdx].replace(/_/g,' ')}</strong>
            </p>

            {ddScreen === 0 && (
              <>
                <p className={styles.ddQ}>What texture best describes this right now?</p>
                <div className={styles.chipRow}>
                  {TEXTURE_OPTIONS.map(t => (
                    <motion.button key={t}
                      className={[styles.chip, ddTexture === t ? styles.chipActive : ''].join(' ')}
                      onClick={() => setDdTexture(t)} whileTap={{ scale: 0.93 }}>
                      {t}
                    </motion.button>
                  ))}
                </div>
                <NavRow onBack={() => setScreen('scales')} onNext={() => setDdScreen(1)}
                  nextDisabled={!ddTexture} />
              </>
            )}
            {ddScreen === 1 && (
              <>
                <p className={styles.ddQ}>Is it getting better or worse?</p>
                <div className={styles.chipRow}>
                  {TRAJECTORY_OPTIONS.map(t => (
                    <motion.button key={t}
                      className={[styles.chip, ddTrajectory === t ? styles.chipActive : ''].join(' ')}
                      onClick={() => setDdTrajectory(t)} whileTap={{ scale: 0.93 }}>
                      {t}
                    </motion.button>
                  ))}
                </div>
                <NavRow onBack={() => setDdScreen(0)} onNext={() => setDdScreen(2)}
                  nextDisabled={!ddTrajectory} />
              </>
            )}
            {ddScreen === 2 && (
              <>
                <p className={styles.ddQ}>{DEEP_DIVE_QUESTIONS[ddDims[ddIdx]]?.[2] || 'What feels like the main friction here?'}</p>
                <textarea
                  className={styles.textarea}
                  placeholder="Optional — write as much or as little as feels right."
                  value={ddFriction} onChange={e => setDdFriction(e.target.value)}
                  rows={4}
                />
                <NavRow onBack={() => setDdScreen(1)}
                  onNext={handleDDNext}
                  nextLabel={ddIdx + 1 < ddDims.length ? `Next area →` : 'Continue →'} />
              </>
            )}
          </motion.div>
        )}

        {/* ── 5.4 Bright Spot ───────────────────────────────── */}
        {screen === 'brightspot' && (
          <motion.div key="brightspot"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>One bright spot</h2>
            {showBrightInput ? (
              <>
                <p className={styles.sub}>
                  You have at least one dimension doing well. What's one thing in your life that's genuinely working right now?
                </p>
                <textarea
                  className={styles.textarea}
                  placeholder="Even something small counts…"
                  value={brightText} onChange={e => setBrightText(e.target.value)}
                  rows={4}
                />
              </>
            ) : (
              <p className={styles.sub}>
                Things feel heavy across the board right now — and that takes courage to acknowledge.
                You're doing the right thing by showing up here.
              </p>
            )}
            <NavRow
              onBack={() => screen === 'brightspot' && ddDims.length > 0 ? setScreen('deepdive') : setScreen('scales')}
              onNext={() => { setAnswer('bright_spot', brightText); nextStage() }}
              nextLabel="Continue →"
            />
          </motion.div>
        )}

      </AnimatePresence>
    </StageShell>
  )
}
