import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

/* ── Financial Growth Coin Stacks Vector Illustration with Motion ── */
const FinancialGrowthIllustration = () => (
  <motion.svg
    viewBox="0 0 200 180"
    fill="none"
    style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }}
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
      <ellipse cx="58" cy="142" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
      <ellipse cx="58" cy="130" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
    </g>

    {/* Center Stack (3 Coins) */}
    <g>
      <ellipse cx="100" cy="142" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
      <ellipse cx="100" cy="130" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
      <ellipse cx="100" cy="118" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
    </g>

    {/* Right Stack (4 Coins with Highlighted Top Mint Coin) */}
    <g>
      <ellipse cx="142" cy="142" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
      <ellipse cx="142" cy="130" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
      <ellipse cx="142" cy="118" rx="20" ry="7" fill="#E4F4EE" stroke="#00856A" strokeWidth="2.2" />
      {/* Top Mint Highlight Coin with Pulsing Motion */}
      <motion.ellipse
        cx="142" cy="106" rx="20" ry="7"
        fill="#C2F0C2" stroke="#00856A" strokeWidth="2.5"
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 56px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: '0 clamp(16px, 3vw, 40px)',
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Title + Subtitle + Animated Financial Growth Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'center' }}>
          <div>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              margin: 0,
              color: '#16302b',
              textWrap: 'balance',
            }}>
              Financial<br />Aspirations
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: '#4a6b62',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '360px',
            }}>
              What is your primary financial goal or concern right now? How does this impact your day-to-day choices?
            </p>
          </div>
          <FinancialGrowthIllustration />
        </div>

        {/* RIGHT — Full-Height Textarea + Pinned Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>

          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#00ae9d',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Financial Wellbeing
          </p>

          <textarea
            value={financialAspiration || ''}
            onChange={handleChange}
            placeholder="Describe your financial goals, plans, or concerns..."
            style={{
              width: '100%',
              flex: 1,
              minHeight: '200px',
              padding: '18px',
              borderRadius: '20px',
              border: '1.5px solid rgba(0, 174, 157, 0.2)',
              background: '#f7faf8',
              color: '#16302b',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00ae9d'
              e.target.style.background = '#ffffff'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 174, 157, 0.2)'
              e.target.style.background = '#f7faf8'
            }}
          />

          {/* Action button pinned at bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '12px 38px' }}
            >
              {financialAspiration && financialAspiration.trim() ? 'Continue' : 'Skip'}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
