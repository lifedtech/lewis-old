import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import RhythmTimeIcon from '../components/RhythmTimeIcon.jsx'

/* ── Diurnal Energy Cycle Vector Line Art ── */
const DiurnalCycleIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 240 180"
    fill="none"
    style={{ width: '100%', maxWidth: '210px', display: 'block', margin: '10px 0 10px 90px' }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <defs>
      <radialGradient id="diurnalAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.2" />
        <stop offset="70%" stopColor="#00ae9d" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Aura */}
    <circle cx="120" cy="90" r="72" fill="url(#diurnalAura)" />

    {/* Diurnal Parabolic Arc */}
    <motion.path
      d="M 40,135 Q 120,40 200,135"
      stroke="#00AE9D"
      strokeWidth="2.2"
      strokeDasharray="4 4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Sun at Midday Apex */}
    <motion.g
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '120px 40px' }}
    >
      <circle cx="120" cy="40" r="13" fill="#FBBF24" stroke="#5fbb46" strokeWidth="2" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '120px 40px' }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <line
            key={deg}
            x1="120" y1="23" x2="120" y2="19"
            stroke="#5fbb46" strokeWidth="1.8" strokeLinecap="round"
            transform={`rotate(${deg} 120 40)`}
          />
        ))}
      </motion.g>
    </motion.g>

    {/* Crescent Moon at Night End */}
    <motion.g
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      style={{ transformOrigin: '200px 135px' }}
    >
      <path
        d="M 206,127 C 197,127 190,134 190,143 C 190,152 197,159 206,159 C 200,156 197,150 197,143 C 197,136 200,130 206,127 Z"
        fill="#818CF8"
        stroke="#6366F1"
        strokeWidth="1.5"
      />
    </motion.g>

    {/* Sunrise / Dawn Star on Morning Rise */}
    <motion.circle
      cx="40" cy="135" r="5"
      fill="#5fbb46"
      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Floating Energy Particles along the Cycle Arc */}
    <motion.circle
      cx="80" cy="78" r="3.5" fill="#00ae9d"
      animate={{ y: [-3, 3, -3], scale: [0.9, 1.25, 0.9] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="160" cy="78" r="3.5" fill="#00ae9d"
      animate={{ y: [3, -3, 3], scale: [1.2, 0.8, 1.2] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    />

    {/* Wavy Horizon Base Lines */}
    <motion.path
      d="M 28,148 Q 85,139 135,152 T 222,144"
      stroke="#00AE9D"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
    />
    <motion.path
      d="M 38,164 Q 95,155 145,168 T 212,160"
      stroke="#d6edea"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
    />
  </motion.svg>
)

export default function Stage3_3DayRhythmScreen() {
  const { setScreen, toggleArrayItem, dayRhythmMap } = useLewisStore()

  const handleNext = () => {
    setScreen('stage3_4Breathing')
  }

  const periods = [
    { id: 0, label: 'Late Night (12am - 6am)' },
    { id: 6, label: 'Early Morning (6am - 9am)' },
    { id: 9, label: 'Late Morning (9am - 12pm)' },
    { id: 12, label: 'Midday (12pm - 3pm)' },
    { id: 15, label: 'Late Afternoon (3pm - 6pm)' },
    { id: 18, label: 'Evening (6pm - 9pm)' },
    { id: 21, label: 'Night (9pm - 12am)' }
  ]

  const isSelected = (id) => (dayRhythmMap || []).includes(id)

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
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
              SELECT ALL THAT APPLY
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
              Diurnal Energy Cycle
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
            }}>
              Highlight the periods of the day when you typically feel your energy peaks or feel most productive.
            </p>
          </div>
          <DiurnalCycleIllustration />
        </div>

        {/* RIGHT — PEAK ENERGY PERIODS Eyebrow + 7 Option Cards + Pinned Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#414242',
            textTransform: 'uppercase',
            textAlign: 'right',
            margin: '0 0 14px 0',
            width: '100%',
          }}>
            PEAK ENERGY PERIODS
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', paddingRight: '4px', width: '100%' }}>
            {periods.map(p => {
              const active = isSelected(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleArrayItem('dayRhythmMap', p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '8px 16px',
                    borderRadius: '16px',
                    border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                    background: active ? '#e4f4ee' : '#f7faf8',
                    color: active ? '#414242' : '#3a3a3a',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '14px',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 3px 12px rgba(0,174,157,0.15)' : '0 1px 3px rgba(0,0,0,0.02)',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  {/* Rounded Checkbox Indicator (Matching LIFED program UI) */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: active ? '2px solid #00ae9d' : '2px solid #b4c7c0',
                    background: active ? '#00ae9d' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}>
                    {active && <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 900, lineHeight: 1 }}>✓</span>}
                  </div>

                  {/* Icon Badge from LIFED Program Icon Library */}
                  <RhythmTimeIcon periodId={p.id} isActive={active} size={32} />

                  {/* Label */}
                  <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', color: '#414242' }}>{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* Action button pinned at bottom right */}
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
