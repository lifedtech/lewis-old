import {  useState, useEffect  } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Interactive Vector Butterfly Illustration ── */
const ButterflyIllustration = ({ isOrange = false, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{ cursor: 'pointer', position: 'relative', width: '100%', maxWidth: '220px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
  >
    <motion.svg
      className="interactive-butterfly"
      viewBox="0 0 240 190"
      fill="none"
      style={{ width: '100%', maxWidth: '220px', height: 'auto', display: 'block' }}
      animate={{ scale: isOrange ? 1.12 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="buttGlowTeal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="buttGlowOrange" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9466" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF9466" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Aura Background */}
      <circle
        cx="120" cy="95" r="75"
        fill={isOrange ? 'url(#buttGlowOrange)' : 'url(#buttGlowTeal)'}
        style={{ transition: 'fill 0.3s ease' }}
      />

      {/* Gentle Wing Flap Motion Group */}
      <motion.g
        animate={{ scaleX: [1, 0.95, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '120px 95px' }}
      >
        {/* Left Upper Wing */}
        <path
          d="M 120,90 C 100,45 45,35 40,80 C 38,100 70,120 120,100 Z"
          fill={isOrange ? 'rgba(255, 148, 102, 0.35)' : 'rgba(0, 174, 157, 0.15)'}
          stroke={isOrange ? '#FF9466' : '#00AE9D'}
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ transition: 'all 0.3s ease' }}
        />
        {/* Left Lower Wing */}
        <path
          d="M 120,100 C 80,115 50,145 75,165 C 95,180 115,145 120,110 Z"
          fill={isOrange ? 'rgba(255, 148, 102, 0.25)' : 'rgba(16, 185, 129, 0.12)'}
          stroke={isOrange ? '#FF7A45' : '#00ae9d'}
          strokeWidth="2.2"
          strokeLinejoin="round"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Right Upper Wing */}
        <path
          d="M 120,90 C 140,45 195,35 200,80 C 202,100 170,120 120,100 Z"
          fill={isOrange ? 'rgba(255, 148, 102, 0.35)' : 'rgba(0, 174, 157, 0.15)'}
          stroke={isOrange ? '#FF9466' : '#00AE9D'}
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ transition: 'all 0.3s ease' }}
        />
        {/* Right Lower Wing */}
        <path
          d="M 120,100 C 160,115 190,145 165,165 C 145,180 125,145 120,110 Z"
          fill={isOrange ? 'rgba(255, 148, 102, 0.25)' : 'rgba(16, 185, 129, 0.12)'}
          stroke={isOrange ? '#FF7A45' : '#00ae9d'}
          strokeWidth="2.2"
          strokeLinejoin="round"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Wing Vein Line Art Details */}
        <path d="M 120,93 Q 80,70 55,80" stroke={isOrange ? '#FF9466' : '#00AE9D'} strokeWidth="1.5" opacity="0.6" fill="none" />
        <path d="M 120,93 Q 160,70 185,80" stroke={isOrange ? '#FF9466' : '#00AE9D'} strokeWidth="1.5" opacity="0.6" fill="none" />
        <path d="M 120,103 Q 90,135 75,150" stroke={isOrange ? '#FF7A45' : '#00ae9d'} strokeWidth="1.2" opacity="0.5" fill="none" />
        <path d="M 120,103 Q 150,135 165,150" stroke={isOrange ? '#FF7A45' : '#00ae9d'} strokeWidth="1.2" opacity="0.5" fill="none" />
      </motion.g>

      {/* Butterfly Body Line */}
      <line x1="120" y1="70" x2="120" y2="130" stroke={isOrange ? '#E65100' : '#414242'} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="120" cy="67" r="4.5" fill={isOrange ? '#E65100' : '#414242'} />

      {/* Antennae */}
      <path d="M 120,65 Q 112,50 102,45" stroke={isOrange ? '#E65100' : '#414242'} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 120,65 Q 128,50 138,45" stroke={isOrange ? '#E65100' : '#414242'} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="102" cy="45" r="2" fill={isOrange ? '#E65100' : '#414242'} />
      <circle cx="138" cy="45" r="2" fill={isOrange ? '#E65100' : '#414242'} />

      {/* Floating Sparkle Nodes */}
      {[{ cx: 50, cy: 50 }, { cx: 190, cy: 50 }, { cx: 70, cy: 170 }, { cx: 170, cy: 170 }].map((sp, i) => (
        <circle
          key={i} cx={sp.cx} cy={sp.cy} r="2.5"
          fill={isOrange ? '#FF9466' : '#00AE9D'}
          opacity={isOrange ? 0.9 : 0.4}
        />
      ))}
    </motion.svg>
  </motion.div>
)

export default function Stage2AttentionScreen() {
  const { setScreen, setProfileField } = useLewisStore()
  const [hits, setHits] = useState(0)
  const [color, setColor] = useState('white') // 'white' or 'orange'
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('Watch closely...')

  useEffect(() => {
    if (done) return

    const interval = setInterval(() => {
      const isOrange = Math.random() > 0.5
      setColor(isOrange ? 'orange' : 'white')
    }, 1200)

    return () => clearInterval(interval)
  }, [done])

  const handleOrbClick = () => {
    if (done) return
    if (color === 'orange') {
      const nextHits = hits + 1
      setHits(nextHits)
      setMessage('Nice hit!')
      if (nextHits >= 3) {
        setDone(true)
        setMessage('Focus calibrated successfully!')
      }
    } else {
      setHits(0)
      setMessage('Ooops! Click only on Orange!')
    }
  }

  const handleNext = () => {
    setProfileField('attentionDriftDone', true)
    setScreen('stage3_1Affect')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#414242',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              ATTENTION TEST
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
            }}>
              Cognitive Focus
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              This calibrates your cognitive presence. Tap the butterfly ONLY when it turns <span style={{ color: '#FF9466', fontWeight: 700 }}>Orange</span>.
            </p>
          </div>
        </div>

        {/* RIGHT — Interactive Butterfly Test Box + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start', width: '100%' }}>

          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            background: '#f2f9f6',
            border: '1.5px solid #d2e7e0',
            borderRadius: '20px',
            padding: '24px',
            boxSizing: 'border-box'
          }}>
            {/* Score Badge */}
            <div style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#414242',
              background: '#ffffff',
              border: '1.5px solid #d2e7e0',
              borderRadius: '20px',
              padding: '6px 18px',
              letterSpacing: '0.08em',
            }}>
              SCORE: {hits} / 3
            </div>

            {/* Interactive Vector Butterfly */}
            <ButterflyIllustration isOrange={color === 'orange'} onClick={handleOrbClick} />

            {/* Status Message */}
            <p style={{
              margin: 0,
              fontSize: '14.5px',
              fontWeight: 700,
              color: color === 'orange' ? '#FF9466' : done ? '#00ae9d' : '#414242',
              fontFamily: "'Nunito', sans-serif",
              textAlign: 'center',
              minHeight: '24px',
            }}>
              {message}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '12px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!done}
              style={{
                opacity: done ? 1 : 0.5,
                cursor: done ? 'pointer' : 'not-allowed',
                padding: '10px 36px',
              }}
            >
              {done ? 'Continue' : 'Calibrating Focus...'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
