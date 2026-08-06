export default function LewisLogo({ 
  size = 32, 
  showText = true, 
  layout = 'horizontal', 
  textColor = '#414242',
  animated = false,
  inverted = false
}) {
  const markColorUpper = inverted ? '#ffffff' : '#00AE9D'
  const markColorLower = inverted ? '#a7dcd4' : '#5FBB46'
  const txtColor = inverted ? '#ffffff' : textColor

  const markSvg = (
    <svg width={size} height={size} viewBox="0 0 82 82" style={{ flexShrink: 0, overflow: 'visible' }}>
      <style>{`
        @keyframes lewis30sArmRotate {
          0%, 88% { transform: rotate(0deg); }
          95%, 98% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Upper Arm (Given) */}
      <path d="M11 41 V11 H41" fill="none" stroke={markColorUpper} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Upper Counterpoint */}
      <circle cx="71" cy="11" r="7" fill={markColorLower} />
      
      {/* Centre Disc (Person) */}
      <circle cx="41" cy="41" r="11" fill={markColorUpper} />

      {/* Lower Arm (Returned) */}
      <g style={{
        transformOrigin: '41px 41px',
        animation: animated ? 'lewis30sArmRotate 30s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none'
      }}>
        <path d="M71 41 V71 H41" fill="none" stroke={markColorLower} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="71" r="7" fill={markColorUpper} />
      </g>
    </svg>
  )

  if (layout === 'stacked') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
        {markSvg}
        {showText && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '20px', color: txtColor, letterSpacing: '-0.025em' }}>Lewis</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '0.24em', color: txtColor, opacity: 0.6, marginTop: '3px' }}>BY LIFED</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {markSvg}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: `${Math.max(16, Math.round(size * 0.58))}px`, color: txtColor, letterSpacing: '-0.02em' }}>Lewis</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: `${Math.max(8, Math.round(size * 0.26))}px`, letterSpacing: '0.2em', color: txtColor, opacity: 0.6, marginTop: '2px' }}>BY LIFED</span>
        </div>
      )}
    </div>
  )
}
