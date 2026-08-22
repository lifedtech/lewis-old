import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Financial Growth Coin Stacks Vector Illustration with Motion ── */
const FinancialGrowthIllustration = () => (
  <motion.svg className="stage-illustration"
    viewBox="0 0 200 180"
    fill="none"
    style={{ width: '100%', maxWidth: '160px', display: 'block', margin: '0 auto' }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <defs>
      <radialGradient id="finGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00AE9D" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#00AE9D" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="100" cy="100" r="70" fill="url(#finGlow)" />

    {/* Ground Baseline */}
    <line x1="35" y1="150" x2="165" y2="150" stroke="#D1E3DF" strokeWidth="2.5" strokeLinecap="round" />

    {/* Coin Stacks */}
    {/* Left Stack (2 Coins) */}
    <g>
      <ellipse cx="58" cy="142" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
      <ellipse cx="58" cy="130" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
    </g>

    {/* Center Stack (3 Coins) */}
    <g>
      <ellipse cx="100" cy="142" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
      <ellipse cx="100" cy="130" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
      <ellipse cx="100" cy="118" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
    </g>

    {/* Right Stack (4 Coins with Highlighted Top Mint Coin) */}
    <g>
      <ellipse cx="142" cy="142" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
      <ellipse cx="142" cy="130" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
      <ellipse cx="142" cy="118" rx="20" ry="7" fill="#E4F4EE" stroke="#00ae9d" strokeWidth="2.2" />
      {/* Top Mint Highlight Coin with Pulsing Motion */}
      <motion.ellipse
        cx="142" cy="106" rx="20" ry="7"
        fill="#C2F0C2" stroke="#00ae9d" strokeWidth="2.5"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '142px 106px' }}
      />
    </g>

    {/* Animated Upward Trending Arrow */}
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.path
        d="M 48,98 L 98,78 L 124,88 L 164,48"
        stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* Arrowhead */}
      <motion.path
        d="M 148,48 L 164,48 L 164,64"
        stroke="#00AE9D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
      />
    </motion.g>
  </motion.svg>
)

export default function Stage7_7FinancialAspScreen() {
  const { setScreen, setProfileField, financialAspiration } = useLewisStore()

  const handleNext = () => {
    setScreen('stage7_8Friction')
  }

  const handleChange = (e) => {
    setProfileField('financialAspiration', e.target.value)
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
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 52px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Vector Graphic */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              QUALITATIVE REFLECTION
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 38px)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
              whiteSpace: 'nowrap',
            }}>
              Financial Aspirations
            </h1>
            <p style={{
              margin: '8px 0 14px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.45,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              What is your primary financial goal or concern right now? How does this impact your day-to-day choices?
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <FinancialGrowthIllustration />
          </div>
        </div>

        {/* RIGHT — Textarea Container + Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '14px' }}>

          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
              SHARE YOUR REFLECTION
            </span>
          </div>

          <textarea
            value={financialAspiration || ''}
            onChange={handleChange}
            placeholder="Describe your financial goals, plans, or concerns..."
            style={{
              width: '100%',
              height: '180px',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1.5px solid #d2e7e0',
              background: '#ffffff',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '14.5px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00ae9d'
              e.target.style.boxShadow = '0 0 0 3px rgba(0,174,157,0.12)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d2e7e0'
              e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'
            }}
          />

          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Your reflection is saved to guide your personalized insights.
          </p>

          {/* Action button directly below */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '10px 40px' }}
            >
              {financialAspiration && financialAspiration.trim() ? 'Continue' : 'Skip'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}

