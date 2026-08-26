/**
 * LewisMotionLogo
 * 
 * Official Motion Logo for Lewis, strictly implementing Section 08 Motion
 * of the Lewis Identity Guidelines:
 * 
 * - Keyframe: @keyframes lwTurn { 0%, 14% { transform: rotate(0deg) } 46%, 100% { transform: rotate(180deg) } }
 * - Rotation origin is always the centre disc (41px 41px)
 * - The counterpoints and centre disc never move
 * - The upper arm is stationary (#00AE9D)
 * - The second arm rotates 180 degrees about the centre and settles (#5FBB46)
 * - Timing: 3.6s cubic-bezier(0.6, 0, 0.2, 1) infinite loop
 */
export default function LewisMotionLogo({
  size = 82,
  showText = false,
  layout = 'horizontal', // 'horizontal' | 'stacked'
  textColor = '#16302B',
  inverted = false,
  speed = 1.0,
  glow = true
}) {
  const markColorUpper = inverted ? '#a7dcd4' : '#00AE9D'
  const markColorLower = '#5FBB46'
  const centerDiscColor = inverted ? '#ffffff' : '#00AE9D'
  const lowerCounterpointColor = inverted ? '#ffffff' : '#00AE9D'
  const upperCounterpointColor = '#5FBB46'
  const txtColor = inverted ? '#ffffff' : (textColor === '#16302B' ? '#16302B' : textColor)
  const turnDuration = 3.6 / speed

  const markSvg = (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {glow && (
        <div style={{
          position: 'absolute',
          inset: '-20%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${markColorUpper}20 0%, ${markColorLower}12 50%, transparent 70%)`,
          filter: 'blur(12px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 82 82"
        style={{ position: 'relative', zIndex: 1, flexShrink: 0, overflow: 'visible' }}
        role="img"
        aria-label="Lewis Motion Logo"
      >
        <style>{`
          @keyframes lwTurn {
            0%, 14% { transform: rotate(0deg); }
            46%, 100% { transform: rotate(180deg); }
          }
        `}</style>

        {/* Centre Disc (Person) - Never moves per Section 8 */}
        <circle cx="41" cy="41" r="11" fill={centerDiscColor} />

        {/* Top-Right Counterpoint (Green) - Never moves per Section 8 */}
        <circle cx="71" cy="11" r="7" fill={upperCounterpointColor} />

        {/* Bottom-Left Counterpoint (Teal / White) - Never moves per Section 8 */}
        <circle cx="11" cy="71" r="7" fill={lowerCounterpointColor} />

        {/* Upper Arm (Given) - Stationary per Section 8 */}
        <path d="M11 41 V11 H41" fill="none" stroke={markColorUpper} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />

        {/* Second Arm (Returned) - Rotates 180 degrees about the centre (41px 41px) and settles */}
        <g style={{
          transformOrigin: '41px 41px',
          animation: `lwTurn ${turnDuration}s cubic-bezier(0.6, 0, 0.2, 1) infinite`
        }}>
          <path d="M11 41 V11 H41" fill="none" stroke={markColorLower} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  )

  if (!showText) return markSvg

  if (layout === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: `${Math.max(6, Math.round(size * 0.15))}px`, flexShrink: 0, whiteSpace: 'nowrap' }}>
        {markSvg}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: "'Manrope', 'Nunito', sans-serif", fontWeight: 800, fontSize: `${Math.max(18, Math.round(size * 0.38))}px`, color: txtColor, letterSpacing: '-0.025em', whiteSpace: 'nowrap' }}>
            Lewis
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: `${Math.max(10, Math.round(size * 0.18))}px`, flexShrink: 0, whiteSpace: 'nowrap' }}>
      {markSvg}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: "'Manrope', 'Nunito', sans-serif", fontWeight: 800, fontSize: `${Math.max(18, Math.round(size * 0.48))}px`, color: txtColor, letterSpacing: '-0.025em', whiteSpace: 'nowrap' }}>
          Lewis
        </span>
      </div>
    </div>
  )
}
