import { memo } from 'react'

/**
 * AbstractLineBackground
 * Renders subtle, elegant vector line abstract background overlays for landing page sections.
 */
function AbstractLineBackgroundComponent({ variant = 'waves', opacity = 0.07, color = '#00ae9d' }) {
  const commonStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 0,
  }

  if (variant === 'waves') {
    return (
      <div style={commonStyle}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
          style={{ opacity }}
        >
          <path
            d="M-100 150 C 300 50, 700 350, 1540 100"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M-100 220 C 400 120, 800 420, 1540 180"
            stroke={color}
            strokeWidth="2"
          />
          <path
            d="M-100 290 C 350 200, 750 480, 1540 250"
            stroke={color}
            strokeWidth="1"
          />
          <path
            d="M-100 360 C 450 280, 850 540, 1540 320"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
    )
  }

  if (variant === 'contours') {
    return (
      <div style={commonStyle}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMaxYMin slice"
          fill="none"
          style={{ opacity }}
        >
          <ellipse cx="1000" cy="150" rx="300" ry="200" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="1000" cy="150" rx="420" ry="290" stroke={color} strokeWidth="1.5" />
          <ellipse cx="1000" cy="150" rx="540" ry="380" stroke={color} strokeWidth="1" />
          <ellipse cx="1000" cy="150" rx="660" ry="470" stroke={color} strokeWidth="1.5" strokeDasharray="6 6" />
          <ellipse cx="1000" cy="150" rx="780" ry="560" stroke={color} strokeWidth="1" />
        </svg>
      </div>
    )
  }

  if (variant === 'nodes') {
    return (
      <div style={commonStyle}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMinYMax slice"
          fill="none"
          style={{ opacity }}
        >
          <path d="M50 500 L 250 350 L 480 420 L 720 280 L 950 380 L 1200 220 L 1400 340" stroke={color} strokeWidth="1.5" />
          <path d="M250 350 L 380 180 L 720 280 L 850 150 L 1200 220" stroke={color} strokeWidth="1" strokeDasharray="5 5" />
          <path d="M480 420 L 600 580 L 950 380 L 1100 520" stroke={color} strokeWidth="1" />
          {/* Node points */}
          <circle cx="250" cy="350" r="4" fill={color} />
          <circle cx="480" cy="420" r="4" fill={color} />
          <circle cx="720" cy="280" r="5" fill={color} />
          <circle cx="950" cy="380" r="4" fill={color} />
          <circle cx="1200" cy="220" r="4" fill={color} />
          <circle cx="380" cy="180" r="3" fill={color} />
          <circle cx="850" cy="150" r="3" fill={color} />
        </svg>
      </div>
    )
  }

  if (variant === 'arcs') {
    return (
      <div style={commonStyle}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMinYMin slice"
          fill="none"
          style={{ opacity }}
        >
          <circle cx="0" cy="350" r="220" stroke={color} strokeWidth="1.5" />
          <circle cx="0" cy="350" r="340" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="0" cy="350" r="460" stroke={color} strokeWidth="1" />
          <circle cx="0" cy="350" r="580" stroke={color} strokeWidth="1.5" />
          <circle cx="0" cy="350" r="700" stroke={color} strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </div>
    )
  }

  return null
}

export const AbstractLineBackground = memo(AbstractLineBackgroundComponent)
export default AbstractLineBackground
