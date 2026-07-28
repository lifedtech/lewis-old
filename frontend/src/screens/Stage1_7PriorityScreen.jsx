import { motion, Reorder } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Priority Ranking Vector Line Art ── */
const PriorityIllustration = () => (
  <motion.svg
    viewBox="0 0 240 190"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="prioAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="prioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ae9d" />
        <stop offset="100%" stopColor="#00ae9d" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="120" cy="90" r="75" fill="url(#prioAura)" />

    {/* Stacked Ordered Cards Line Art */}
    <rect x="70" y="55" width="100" height="22" rx="6" stroke="#00AE9D" strokeWidth="2" fill="rgba(0,174,157,0.12)" />
    <rect x="75" y="85" width="90" height="22" rx="6" stroke="url(#prioGrad)" strokeWidth="2" fill="rgba(0,174,157,0.06)" />
    <rect x="80" y="115" width="80" height="22" rx="6" stroke="#00ae9d" strokeWidth="2" fill="rgba(16,185,129,0.04)" />

    {/* Up/Down Reorder Indicator */}
    <motion.path
      d="M 182,75 L 182,120 M 177,82 L 182,75 L 187,82 M 177,113 L 182,120 L 187,113"
      stroke="#00AE9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      animate={{ y: [-2, 2, -2] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Wavy Horizon Lines */}
    <motion.path
      d="M 28,154 Q 85,145 135,158 T 222,150"
      stroke="#00AE9D" strokeWidth="3.2" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 38,170 Q 95,161 145,174 T 212,166"
      stroke="#d6edea" strokeWidth="2.5" strokeLinecap="round" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage1_7PriorityScreen() {
  const { setScreen, setProfileField, priorities = [
    'Career & Growth',
    'Health & Energy',
    'Relationships & Family',
    'Financial Security',
    'Personal Purpose',
  ] } = useLewisStore()

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
        gap: 'clamp(24px, 4vw, 52px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Vector Line Art */}
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
              RANK YOUR PRIORITIES
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              whiteSpace: 'nowrap',
            }}>
              Priority Ranking
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Drag these into the order that matters most to you right now.
            </p>
          </div>
          <PriorityIllustration />
        </div>

        {/* RIGHT — DRAG TO REORDER Eyebrow + Draggable List + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 8px 0',
          }}>
            DRAG TO REORDER
          </p>

          <Reorder.Group
            axis="y"
            values={priorities}
            onReorder={(newOrder) => setProfileField('priorities', newOrder)}
            className="draggable-list"
            style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}
          >
            {priorities.map((item, index) => (
              <Reorder.Item key={item} value={item} className="draggable-item">
                <div className="draggable-content">
                  <span className="draggable-rank">{index + 1}</span>
                  <span className="draggable-text">{item}</span>
                  <span className="draggable-handle" style={{ userSelect: 'none' }}>☰</span>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <button className="btn-primary" onClick={() => setScreen('stage1_8Arrival')} style={{ padding: '10px 36px' }}>
              Continue
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
