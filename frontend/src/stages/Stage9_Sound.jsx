/**
 * Stage 9 — Sound Check + Quick Choices (9b)
 * 9a: 3 generated ambient audio clips (Web Audio API), user picks preference
 * 9b: 3 rapid-fire A/B choice screens, no timers
 */
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import StageShell from '../components/StageShell.jsx'
import NavRow from '../components/NavRow.jsx'
import styles from './Stage9_Sound.module.css'

/* Generate distinct ambient textures via Web Audio API */
function buildClip(ctx, type) {
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  if (type === 'rain') {
    // White noise
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.35
    const src   = ctx.createBufferSource()
    const filt  = ctx.createBiquadFilter()
    src.buffer  = buf
    src.loop    = true
    filt.type   = 'lowpass'
    filt.frequency.value = 700
    src.connect(filt); filt.connect(master)
    src.start()
  } else if (type === 'pad') {
    // Sine chord
    [130.81, 196, 261.63].forEach(freq => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type   = 'sine'
      osc.frequency.value = freq
      gain.gain.value = 0.06
      const lfo  = ctx.createOscillator()
      const lfoG = ctx.createGain()
      lfo.frequency.value = 0.07; lfoG.gain.value = 0.015
      lfo.connect(lfoG); lfoG.connect(gain.gain)
      osc.connect(gain); gain.connect(master)
      osc.start(); lfo.start()
    })
  } else {
    // Brown noise
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const w = (Math.random() * 2 - 1) * 0.3
      last = (last + 0.02 * w) / 1.02
      data[i] = last * 12
    }
    const src  = ctx.createBufferSource()
    src.buffer = buf; src.loop = true
    src.connect(master)
    src.start()
  }
  return master
}

const CLIPS = [
  { id: 'rain',   label: 'Gentle rain',    icon: '🌧', type: 'rain'  },
  { id: 'pad',    label: 'Soft tones',     icon: '🎵', type: 'pad'   },
  { id: 'brown',  label: 'Warm rumble',    icon: '🌊', type: 'brown' },
]

const AB_CHOICES = [
  {
    id: 'reflect_style',
    question: 'When you reflect on a difficult situation, you tend to…',
    a: 'Analyse and think it through logically',
    b: 'Feel it out and process emotionally',
  },
  {
    id: 'rest_pref',
    question: 'When you need to recharge, you prefer…',
    a: 'Being alone in quiet',
    b: 'Being around people you care about',
  },
  {
    id: 'change_pace',
    question: 'When making a change, you tend to…',
    a: 'Plan it carefully before starting',
    b: 'Jump in and figure it out as you go',
  },
]

export default function Stage9_Sound() {
  const { setAnswer, nextStage, prevStage } = useLewisStore()
  const [screen,    setScreen]   = useState('sound')
  const [playing,   setPlaying]  = useState(null)
  const [preferred, setPreferred] = useState(null)
  const [abIdx,     setAbIdx]    = useState(0)

  const ctxRef    = useRef(null)
  const clipsRef  = useRef({})

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  const play = (id) => {
    const ctx = getCtx()
    // Fade out all
    Object.values(clipsRef.current).forEach(g => {
      g.gain.cancelScheduledValues(ctx.currentTime)
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
    })
    if (playing === id) { setPlaying(null); return }
    // Build or reuse clip
    if (!clipsRef.current[id]) {
      const clip = CLIPS.find(c => c.id === id)
      clipsRef.current[id] = buildClip(ctx, clip.type)
    }
    const g = clipsRef.current[id]
    g.gain.cancelScheduledValues(ctx.currentTime)
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.8)
    setPlaying(id)
    // Auto stop after 15s
    setTimeout(() => {
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
      setPlaying(prev => prev === id ? null : prev)
    }, 15000)
  }

  const skip = () => {
    Object.values(clipsRef.current).forEach(g => {
      try { g.gain.linearRampToValueAtTime(0, getCtx().currentTime + 0.3) } catch {}
    })
    setScreen('ab')
  }

  useEffect(() => {
    return () => {
      try { ctxRef.current?.close() } catch {}
    }
  }, [])

  const handleABPick = (val) => {
    setAnswer(`ab_${AB_CHOICES[abIdx].id}`, val)
    if (abIdx + 1 < AB_CHOICES.length) {
      setAbIdx(i => i + 1)
    } else {
      nextStage()
    }
  }

  return (
    <StageShell stage={9}>
      <AnimatePresence mode="wait">

        {/* ── 9a Sound Check ────────────────────────────────── */}
        {screen === 'sound' && (
          <motion.div key="sound"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}
          >
            <h2 className={styles.title}>What sounds best to you?</h2>
            <p className={styles.sub}>
              Each clip plays for ~15 seconds. Tap to listen, tap again to stop.
              Pick the one that feels most calming.
            </p>

            <div className={styles.clips}>
              {CLIPS.map(clip => {
                const isPlaying = playing === clip.id
                const isPicked  = preferred === clip.id
                return (
                  <motion.button
                    key={clip.id}
                    className={[styles.clipBtn, isPicked ? styles.clipPicked : '', isPlaying ? styles.clipPlaying : ''].join(' ')}
                    onClick={() => play(clip.id)}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`${clip.label}${isPlaying ? ', playing' : ''}`}
                    aria-pressed={isPlaying}
                  >
                    <span className={styles.clipIcon}>{clip.icon}</span>
                    <span className={styles.clipLabel}>{clip.label}</span>
                    {isPlaying && (
                      <span className={styles.waveWrap} aria-hidden="true">
                        {[0,1,2,3].map(i => (
                          <span key={i} className={styles.wave}
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </span>
                    )}
                    {isPicked && !isPlaying && <span className={styles.pickedMark}>✓</span>}
                  </motion.button>
                )
              })}
            </div>

            {/* Pick favourite */}
            {playing && (
              <motion.div className={styles.pickRow}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className={styles.pickQ}>Enjoying this one?</p>
                <button className={styles.pickBtn} onClick={() => { setPreferred(playing); setAnswer('sound_preference', playing) }}>
                  ✓ Set as my preference
                </button>
              </motion.div>
            )}

            <NavRow
              onBack={prevStage}
              onNext={() => setScreen('ab')}
              nextLabel="Continue →"
            />
            <div className={styles.skipRow}>
              <button className={styles.skipBtn} onClick={skip}>Skip sound check</button>
            </div>
          </motion.div>
        )}

        {/* ── 9b Quick A/B Choices ───────────────────────────── */}
        {screen === 'ab' && (
          <motion.div key={`ab-${abIdx}`}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className={styles.abProgress}>
              {AB_CHOICES.map((_, i) => (
                <div key={i} className={[styles.abDot, i < abIdx ? styles.abDotDone : '', i === abIdx ? styles.abDotActive : ''].join(' ')} />
              ))}
            </div>

            <h2 className={styles.abQ}>{AB_CHOICES[abIdx].question}</h2>

            <div className={styles.abChoices}>
              <motion.button
                className={styles.abBtn}
                onClick={() => handleABPick('a')}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className={styles.abLetter}>A</span>
                <span className={styles.abText}>{AB_CHOICES[abIdx].a}</span>
              </motion.button>

              <div className={styles.abOr} aria-hidden="true">or</div>

              <motion.button
                className={styles.abBtn}
                onClick={() => handleABPick('b')}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className={styles.abLetter}>B</span>
                <span className={styles.abText}>{AB_CHOICES[abIdx].b}</span>
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </StageShell>
  )
}
