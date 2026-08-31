import logoIconPng from '../assets/logo-icon.png'
import LewisMotionLogo from './LewisMotionLogo.jsx'
import { useLewisStore } from '../store/useLewisStore.js'

export default function LewisLogo({ 
  size = 32, 
  showText = true, 
  layout = 'horizontal', 
  textColor = '#414242',
  animated = false,
  inverted = undefined,
  className = '',
  style = {}
}) {
  const storeTheme = useLewisStore((s) => s.theme)
  const isDark = inverted !== undefined ? inverted : storeTheme === 'dark'

  if (animated) {
    return (
      <LewisMotionLogo
        size={size}
        showText={showText}
        layout={layout}
        textColor={textColor}
        inverted={isDark}
      />
    )
  }

  const txtColor = isDark ? '#E9F1EF' : (textColor === '#414242' ? '#16302B' : textColor)

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
            userSelect: 'none'
          }} 
        />
        {showText && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
            <span style={{ 
              fontFamily: "'Manrope', 'Nunito', sans-serif", 
              fontWeight: 800, 
              fontSize: `${Math.max(16, Math.round(size * 0.58))}px`, 
              color: txtColor, 
              letterSpacing: '-0.025em', 
              whiteSpace: 'nowrap' 
            }}>
              Lewis
            </span>
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
        gap: `${Math.max(7, Math.round(size * 0.26))}px`,
        flexShrink: 0, 
        whiteSpace: 'nowrap',
        background: 'transparent',
        backgroundColor: 'transparent',
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
          display: 'block',
          userSelect: 'none'
        }} 
      />
      <span style={{
        fontFamily: "'Manrope', 'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: `${Math.max(18, Math.round(size * 0.68))}px`,
        color: txtColor,
        letterSpacing: '-0.025em',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        Lewis
      </span>
    </div>
  )
}
