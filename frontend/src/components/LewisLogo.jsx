import logoPng from '../assets/logo.png'
import logoIconPng from '../assets/logo-icon.png'
import LewisMotionLogo from './LewisMotionLogo.jsx'

export default function LewisLogo({ 
  size = 32, 
  showText = true, 
  layout = 'horizontal', 
  textColor = '#414242',
  animated = false,
  inverted = false,
  className = '',
  style = {}
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

  const txtColor = inverted ? '#ffffff' : (textColor === '#414242' ? '#16302B' : textColor)

  if (layout === 'stacked') {
    return (
      <div 
        className={className}
        style={{ 
          display: 'inline-flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: '8px', 
          flexShrink: 0,
          ...style 
        }}
      >
        <img 
          src={logoIconPng} 
          alt="Lewis" 
          style={{ 
            height: `${size}px`, 
            width: 'auto', 
            objectFit: 'contain',
            filter: inverted ? 'brightness(0) invert(1)' : undefined,
            userSelect: 'none'
          }} 
        />
        {showText && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: "'Manrope', 'Nunito', sans-serif", fontWeight: 800, fontSize: '20px', color: txtColor, letterSpacing: '-0.025em', whiteSpace: 'nowrap' }}>Lewis</span>
          </div>
        )}
      </div>
    )
  }

  if (!showText) {
    return (
      <img 
        src={logoIconPng} 
        alt="Lewis" 
        className={className}
        style={{ 
          height: `${size}px`, 
          width: 'auto', 
          objectFit: 'contain',
          filter: inverted ? 'brightness(0) invert(1)' : undefined,
          userSelect: 'none',
          ...style 
        }} 
      />
    )
  }

  return (
    <div 
      className={className}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        flexShrink: 0, 
        whiteSpace: 'nowrap',
        ...style 
      }}
    >
      <img 
        src={logoPng} 
        alt="Lewis" 
        style={{ 
          height: `${size}px`, 
          width: 'auto', 
          objectFit: 'contain',
          filter: inverted ? 'brightness(0) invert(1)' : undefined,
          display: 'block',
          userSelect: 'none'
        }} 
      />
    </div>
  )
}
