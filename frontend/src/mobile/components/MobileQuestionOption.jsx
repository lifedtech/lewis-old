import React from 'react'

export default function MobileQuestionOption({
  selected = false,
  onClick,
  title,
  subtitle,
  icon,
  multiSelect = false,
  style = {},
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mobile-question-option ${selected ? 'selected' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        minHeight: '48px',
        padding: '12px 14px',
        borderRadius: '14px',
        border: selected ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-color, rgba(0, 174, 157, 0.18))',
        background: selected ? 'var(--teal-tint, #e6f7f2)' : 'var(--raised, #ffffff)',
        color: 'var(--text-main, #414242)',
        cursor: 'pointer',
        textAlign: 'left',
        boxSizing: 'border-box',
        transition: 'all 0.15s ease',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {/* Indicator icon */}
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: multiSelect ? '6px' : '50%',
        border: selected ? '2px solid var(--dawn, #00ae9d)' : '2px solid var(--border-strong, #cbd5e1)',
        background: selected ? 'var(--dawn, #00ae9d)' : 'var(--card-bg, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.15s ease',
      }}>
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--action-text, #ffffff)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Text content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {title && (
          <span style={{
            fontSize: '14px',
            fontWeight: selected ? 700 : 600,
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1.35,
            color: selected ? 'var(--dawn, #1b4d43)' : 'var(--text-main, #414242)',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}>
            {title}
          </span>
        )}
        {subtitle && (
          <span style={{
            fontSize: '11.5px',
            color: selected ? 'var(--dawn, #2d5a50)' : 'var(--text-sub, #85918e)',
            fontFamily: "'Nunito', sans-serif",
            marginTop: '2px',
            lineHeight: 1.35,
            overflowWrap: 'break-word',
          }}>
            {subtitle}
          </span>
        )}
      </div>

      {icon && (
        <div style={{ flexShrink: 0, opacity: selected ? 1 : 0.6 }}>
          {icon}
        </div>
      )}
    </button>
  )
}
