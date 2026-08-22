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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
          {eyebrow && (
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '7.5px',
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
              fontSize: 'clamp(22px, 5.5vw, 28px)',
              lineHeight: 1.12,
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
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '13px',
              color: '#5e6060',
              lineHeight: 1.45,
              margin: '2px 0 0 0',
              textAlign: 'left',
              overflowWrap: 'break-word',
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
