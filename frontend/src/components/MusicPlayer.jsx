import { useState, useEffect, useRef } from 'react'
import styles from './MusicPlayer.module.css'

/*
  Uses the Web Audio API to generate gentle generative ambient tones
  (no external audio file needed — no CORS, no hosting issues).
  Creates a soft, breathing pad sound with slow LFO modulation.
*/

function buildAmbientEngine(ctx) {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.connect(ctx.destination)

  // Reverb via convolver (impulse response)
  const convolver = ctx.createConvolver()
  const reverbLen  = ctx.sampleRate * 3
  const impulse    = ctx.createBuffer(2, reverbLen, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < reverbLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.5)
    }
  }
  convolver.buffer = impulse
  convolver.connect(master)

  const dryGain = ctx.createGain()
  dryGain.gain.value = 0.25
  dryGain.connect(master)

  const wetGain = ctx.createGain()
  wetGain.gain.value = 0.75
  wetGain.connect(convolver)

  // Gentle chord — Cmaj7 frequencies (calm, open)
  const FREQS = [130.81, 164.81, 196.00, 246.94, 261.63]

  const oscNodes = FREQS.map(freq => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    const lfo  = ctx.createOscillator()
    const lfoG = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = freq

    // Gentle LFO breathing (0.05–0.12 Hz)
    lfo.type = 'sine'
    lfo.frequency.value = 0.05 + Math.random() * 0.07
    lfoG.gain.value = 0.02

    lfo.connect(lfoG)
    lfoG.connect(gain.gain)

    gain.gain.setValueAtTime(0.04 + Math.random() * 0.03, ctx.currentTime)
    osc.connect(gain)
    gain.connect(dryGain)
    gain.connect(wetGain)

    osc.start()
    lfo.start()

    return { osc, gain, lfo }
  })

  return { master, oscNodes }
}

export default function MusicPlayer() {
  const [playing, setPlaying]   = useState(false)
  const [started, setStarted]   = useState(false)
  const [vol, setVol]           = useState(0.4)
  const ctxRef    = useRef(null)
  const engineRef = useRef(null)

  const start = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      engineRef.current = buildAmbientEngine(ctxRef.current)
    }
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') ctx.resume()
    // Fade in
    engineRef.current.master.gain.cancelScheduledValues(ctx.currentTime)
    engineRef.current.master.gain.setValueAtTime(
      engineRef.current.master.gain.value, ctx.currentTime
    )
    engineRef.current.master.gain.linearRampToValueAtTime(vol, ctx.currentTime + 2)
    setPlaying(true)
    setStarted(true)
  }

  const stop = () => {
    if (!ctxRef.current || !engineRef.current) return
    const ctx = ctxRef.current
    engineRef.current.master.gain.cancelScheduledValues(ctx.currentTime)
    engineRef.current.master.gain.setValueAtTime(
      engineRef.current.master.gain.value, ctx.currentTime
    )
    engineRef.current.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
    setTimeout(() => setPlaying(false), 1600)
  }

  const toggle = () => playing ? stop() : start()

  useEffect(() => {
    if (!engineRef.current || !ctxRef.current) return
    const ctx = ctxRef.current
    engineRef.current.master.gain.cancelScheduledValues(ctx.currentTime)
    engineRef.current.master.gain.setValueAtTime(
      engineRef.current.master.gain.value, ctx.currentTime
    )
    if (playing) {
      engineRef.current.master.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.5)
    }
  }, [vol, playing])

  useEffect(() => {
    return () => {
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [])

  return (
    <div className={styles.player}>
      <button
        className={`${styles.btn} ${playing ? styles.active : ''}`}
        onClick={toggle}
        title={playing ? 'Pause ambient sound' : 'Play ambient sound'}
        aria-label={playing ? 'Pause ambient sound' : 'Play ambient sound'}
      >
        <span className={styles.icon}>{playing ? '♪' : '♫'}</span>
        <span className={styles.label}>{playing ? 'Ambient On' : 'Ambient'}</span>
        {playing && <span className={styles.wave}><span /><span /><span /></span>}
      </button>

      {started && (
        <input
          type="range" min="0" max="1" step="0.05"
          value={vol}
          onChange={e => setVol(Number(e.target.value))}
          className={styles.volSlider}
          title="Volume"
          aria-label="Volume"
        />
      )}
    </div>
  )
}
