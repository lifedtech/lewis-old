import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Exact Arrival Arch Vector Line Art with Motion ── */
const ArrivalStateIllustration = () => (
  <motion.svg
    viewBox="0 0 240 180"
    fill="none"
    style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '10px 0' }}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    {/* Ground Horizontal Base Line */}
    <motion.line
      x1="36" y1="152" x2="194" y2="152"
      stroke="#00ae9d"
      strokeWidth="3.2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />

    {/* Outer Main Teal Arch */}
    <motion.path
      d="M 64,152 V 76 A 51,51 0 0,1 166,76 V 152"
      stroke="#00ae9d"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    />

    {/* Inner Light Green Arch */}
    <motion.path
      d="M 88,152 V 88 A 27,27 0 0,1 142,88 V 152"
      stroke="#9fe2c0"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
    />

    {/* Bottom Center Concentric Ring */}
    <motion.circle
      cx="115" cy="138" r="14"
      stroke="#9fe2c0"
      strokeWidth="1.8"
      fill="none"
      animate={{ scale: [1, 1.22, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '115px 138px' }}
    />

    {/* Bottom Center Solid Teal Target Circle */}
    <motion.circle
      cx="115" cy="138" r="7.5"
      fill="#00ae9d"
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '115px 138px' }}
    />

    {/* Floating Top-Left Green Orbit Ring */}
    <motion.circle
      cx="50" cy="62" r="4.5"
      stroke="#80c26d"
      strokeWidth="2"
      fill="none"
      animate={{ y: [-3, 4, -3], scale: [0.95, 1.1, 0.95] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Floating Top-Right Teal Orbit Ring */}
    <motion.circle
      cx="186" cy="48" r="3.5"
      stroke="#00ae9d"
      strokeWidth="1.8"
      fill="none"
      animate={{ y: [3, -4, 3], scale: [1.1, 0.9, 1.1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    />

    {/* Floating Bottom-Right Particle Ring 1 */}
    <motion.circle
      cx="200" cy="148" r="2.8"
      stroke="#00ae9d"
      strokeWidth="1.5"
      fill="none"
      animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Floating Bottom-Right Particle Ring 2 */}
    <motion.circle
      cx="216" cy="148" r="2"
      stroke="#9fe2c0"
      strokeWidth="1.5"
      fill="none"
      animate={{ y: [2, -2, 2], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </motion.svg>
)

export default function Stage1_8ArrivalScreen() {
  const { setScreen, setProfileField, arrivalState } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_9Financial')
  }

  const handleChange = (e) => {
    setProfileField('arrivalState', e.target.value)
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 56px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Animated Arch Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
            }}>
              OPEN REFLECTION
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#16302b',
              whiteSpace: 'nowrap',
            }}>
              Arrival State
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '360px',
            }}>
              Before we go deeper - how would you describe arriving here today? One word, if you like.
            </p>
          </div>
          <ArrivalStateIllustration />
        </div>

        {/* RIGHT — YOUR STATE OF MIND Eyebrow + Full-Height Textarea + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: 0,
          }}>
            YOUR STATE OF MIND
          </p>

          <textarea
            value={arrivalState || ''}
            onChange={handleChange}
            placeholder="Write a word, a phrase, or a thought about how you're feeling right now..."
            style={{
              flex: 1,
              width: '100%',
              minHeight: '160px',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1.5px solid #d2e7e0',
              background: '#f2f9f6',
              color: '#16302b',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00ae9d'
              e.target.style.background = '#ffffff'
              e.target.style.boxShadow = '0 4px 16px rgba(0,174,157,0.12)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d2e7e0'
              e.target.style.background = '#f2f9f6'
              e.target.style.boxShadow = 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button className="btn-primary" onClick={handleNext} style={{ padding: '10px 36px' }}>
              Continue
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
