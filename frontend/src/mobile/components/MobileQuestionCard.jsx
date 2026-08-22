import React from 'react'

export default function MobileQuestionCard({
  eyebrow,
  title,
  subtitle,
  children,
  style = {},
}) {
  return (
    <div className="mobile-question-card" style={{
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      margin: '0 auto',
      ...style,
    }}>
      {/* Header section (Left-aligned) */}
      {(eyebrow || title || subtitle) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
          {eyebrow && (
            <p className="mobile-eyebrow" style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#7a8683',
              textTransform: 'uppercase',
              margin: '0 0 2px 0',
            }}>
              {eyebrow}
            </p>
          )}

          {title && (
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}>
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mobile-subtitle" style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              color: '#5e6060',
              lineHeight: 1.45,
              margin: '2px 0 0 0',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main question options & content */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  )
}
