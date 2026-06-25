import { useState, useEffect, useRef } from 'react'
import styles from './MindGame.module.css'

/*
  LEWIS Mind Mirror — a psychological game based on the
  "Emotional Colour Association" paradigm.

  The player sees a word (emotion) displayed in a colour.
  They must pick the colour they FEEL matches the word —
  not the colour it's written in (a Stroop-inspired variant).

  Clinically, colour-emotion associations are used to detect
  emotional dysregulation and measure affective flexibility.
  Fast, congruent choices indicate emotional clarity;
  slow or incongruent choices can signal stress or confusion.

  Results feed context to parent (arr of {word, chosen, time}).
*/

const ROUNDS = [
  { word: 'CALM',      textColor: '#e67e22', options: ['#7db87a','#e67e22','#5b9e94','#c0392b'] },
  { word: 'JOY',       textColor: '#5b9e94', options: ['#f1c40f','#5b9e94','#a8d5a2','#9b59b6'] },
  { word: 'STRESS',    textColor: '#7db87a', options: ['#c0392b','#7db87a','#f39c12','#2c3e50'] },
  { word: 'PEACE',     textColor: '#c0392b', options: ['#b2dfdb','#c0392b','#7db87a','#e67e22'] },
  { word: 'TIRED',     textColor: '#a8d5a2', options: ['#7f8c8d','#a8d5a2','#f39c12','#3498db'] },
  { word: 'HOPE',      textColor: '#9b59b6', options: ['#f1c40f','#9b59b6','#a8d5a2','#3498db'] },
  { word: 'OVERWHELM', textColor: '#7db87a', options: ['#c0392b','#7db87a','#2c3e50','#f39c12'] },
  { word: 'CONTENT',   textColor: '#3498db', options: ['#a8d5a2','#3498db','#7db87a','#f1c40f'] },
]

const COLOUR_NAMES = {
  '#7db87a': 'Forest Green',
  '#e67e22': 'Warm Orange',
  '#5b9e94': 'Teal',
  '#c0392b': 'Deep Red',
  '#f1c40f': 'Sunny Yellow',
  '#a8d5a2': 'Soft Mint',
  '#9b59b6': 'Violet',
  '#b2dfdb': 'Sky Mint',
  '#f39c12': 'Amber',
  '#2c3e50': 'Deep Slate',
  '#7f8c8d': 'Grey',
  '#3498db': 'Blue',
}

// Clinically-informed colour emotion mapping
const EMOTION_COLOURS = {
  '#7db87a': 'calm, natural, grounded',
  '#e67e22': 'energised, warm, social',
  '#5b9e94': 'reflective, clear, steady',
  '#c0392b': 'intense, urgent, stressed',
  '#f1c40f': 'hopeful, bright, optimistic',
  '#a8d5a2': 'gentle, restful, soft',
  '#9b59b6': 'imaginative, spiritual, complex',
  '#b2dfdb': 'peaceful, cool, serene',
  '#f39c12': 'active, alert, cautious',
  '#2c3e50': 'heavy, withdrawn, fatigued',
  '#7f8c8d': 'neutral, numb, depleted',
  '#3498db': 'open, curious, clear-headed',
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MindGame({ onComplete }) {
  const [rounds]    = useState(() => shuffle(ROUNDS).slice(0, 6))
  const [idx, setIdx]     = useState(0)
  const [results, setResults] = useState([])
  const [chosen, setChosen]   = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone]     = useState(false)
  const [intro, setIntro]   = useState(true)
  const startRef = useRef(Date.now())

  const round = rounds[idx]

  useEffect(() => {
    startRef.current = Date.now()
  }, [idx])

  const pick = (color) => {
    if (chosen) return
    const ms = Date.now() - startRef.current
    setChosen(color)

    // Immediate feedback — show what it reveals
    const meaning = EMOTION_COLOURS[color] || 'expressive'
    setFeedback({ color, meaning, ms })

    const newResults = [...results, { word: round.word, chosen: color, timeMs: ms }]

    setTimeout(() => {
      setChosen(null)
      setFeedback(null)
      if (idx + 1 >= rounds.length) {
        setResults(newResults)
        setDone(true)
        onComplete && onComplete(newResults)
      } else {
        setResults(newResults)
        setIdx(i => i + 1)
      }
    }, 1400)
  }

  // Analyse results
  const getSummary = () => {
    const counts = {}
    results.forEach(r => {
      counts[r.chosen] = (counts[r.chosen] || 0) + 1
    })
    const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0]
    const avgTime = Math.round(results.reduce((s,r) => s + r.timeMs, 0) / results.length)
    const topColour = top ? COLOUR_NAMES[top[0]] : 'varied'
    const topEmotion = top ? EMOTION_COLOURS[top[0]] : 'a balanced emotional state'
    const speed = avgTime < 1200 ? 'quickly and decisively' : avgTime < 2000 ? 'at a steady pace' : 'thoughtfully and carefully'

    return { topColour, topEmotion, speed, avgTime }
  }

  if (intro) {
    return (
      <div className={styles.intro}>
        <div className={styles.introIcon}>🎨</div>
        <h3>Mind Mirror</h3>
        <p>
          You'll see an emotion word in a colour. Pick the colour you <em>feel</em> best matches that emotion —
          not the colour the word is written in.
        </p>
        <p className={styles.introSub}>There are no right answers. This reveals your emotional colour world.</p>
        <button className={styles.startBtn} onClick={() => setIntro(false)}>
          Begin →
        </button>
      </div>
    )
  }

  if (done) {
    const { topColour, topEmotion, speed, avgTime } = getSummary()
    return (
      <div className={styles.doneWrap}>
        <div className={styles.doneHeader}>
          <span className={styles.doneIcon}>🌈</span>
          <h3>Your Emotional Colour Profile</h3>
        </div>

        <div className={styles.summaryGrid}>
          {results.map((r, i) => (
            <div key={i} className={styles.resultChip}>
              <div className={styles.resultSwatch} style={{ background: r.chosen }} />
              <div>
                <span className={styles.resultWord}>{r.word}</span>
                <span className={styles.resultTime}>{(r.timeMs/1000).toFixed(1)}s</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.insightBox}>
          <p>
            You responded <strong>{speed}</strong> (avg {(avgTime/1000).toFixed(1)}s).
            You most often reached for <strong>{topColour}</strong> —
            a colour associated with feeling <em>{topEmotion}</em>.
          </p>
          <p className={styles.insightNote}>
            This snapshot is woven into your wellbeing analysis.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.gameWrap}>
      {/* Progress dots */}
      <div className={styles.gameDots}>
        {rounds.map((_, i) => (
          <div key={i} className={`${styles.gameDot} ${i < idx ? styles.gameDotDone : ''} ${i === idx ? styles.gameDotActive : ''}`} />
        ))}
      </div>

      {/* The word */}
      <div className={styles.wordWrap}>
        <span
          className={styles.word}
          style={{ color: round.textColor }}
        >
          {round.word}
        </span>
        <p className={styles.wordPrompt}>Pick the colour you <em>feel</em> matches this</p>
      </div>

      {/* Colour options */}
      <div className={styles.colourGrid}>
        {round.options.map(color => (
          <button
            key={color}
            className={`${styles.colourBtn} ${chosen === color ? styles.chosen : ''}`}
            style={{ background: color }}
            onClick={() => pick(color)}
            aria-label={COLOUR_NAMES[color] || color}
          />
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={styles.feedbackPill} style={{ borderColor: feedback.color }}>
          <span style={{ color: feedback.color }}>●</span>
          &nbsp; {COLOUR_NAMES[feedback.color]} — <em>{feedback.meaning}</em>
        </div>
      )}
    </div>
  )
}
