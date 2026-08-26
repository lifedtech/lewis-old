import LewisMotionLogo from './LewisMotionLogo.jsx'

export default function LewisLogo({ 
  size = 32, 
  showText = true, 
  layout = 'horizontal', 
  textColor = '#414242',
  animated = false,
  inverted = false
}) {
  if (animated) {
    return (
      <LewisMotionLogo
        size={size}
        showText={showText}
        layout={layout}
        textColor={textColor}
        inverted={inverted}
      />
    )
  }

  const markColorUpper = inverted ? '#a7dcd4' : '#00AE9D'
  const markColorLower = '#5FBB46'
  const centerDiscColor = inverted ? '#ffffff' : '#00AE9D'
  const lowerCounterpointColor = inverted ? '#ffffff' : '#00AE9D'
  const upperCounterpointColor = '#5FBB46'
  const txtColor = inverted ? '#ffffff' : (textColor === '#414242' ? '#16302B' : textColor)

  const markSvg = (
    <svg width={size} height={size} viewBox="0 0 82 82" style={{ flexShrink: 0, overflow: 'visible' }}>
      {/* Upper Arm (Given) */}
      <path d="M11 41 V11 H41" fill="none" stroke={markColorUpper} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Upper Counterpoint */}
      <circle cx="71" cy="11" r="7" fill={upperCounterpointColor} />
      
      {/* Centre Disc (Person) */}
      <circle cx="41" cy="41" r="11" fill={centerDiscColor} />

      {/* Lower Arm (Returned) */}
      <path d="M71 41 V71 H41" fill="none" stroke={markColorLower} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Lower Counterpoint */}
      <circle cx="11" cy="71" r="7" fill={lowerCounterpointColor} />
    </svg>
  )

  if (layout === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', flexShrink: 0 }}>
        {markSvg}
        {showText && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: "'Manrope', 'Nunito', sans-serif", fontWeight: 800, fontSize: '20px', color: txtColor, letterSpacing: '-0.025em', whiteSpace: 'nowrap' }}>Lewis</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexShrink: 0, whiteSpace: 'nowrap' }}>
      {markSvg}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: "'Manrope', 'Nunito', sans-serif", fontWeight: 800, fontSize: `${Math.max(17, Math.round(size * 0.62))}px`, color: txtColor, letterSpacing: '-0.025em', whiteSpace: 'nowrap' }}>Lewis</span>
        </div>
      )}
    </div>
  )
}
