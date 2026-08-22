import React from 'react'

export default function MobileContinueButton({
  onClick,
  disabled = false,
  label = 'Continue',
  style = {},
}) {
  return (
    <div className="mobile-continue-wrap" style={{
      width: '100%',
      padding: '12px 0',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      display: 'flex',
      justifyContent: 'flex-end',
      ...style,
    }}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="btn-primary"
        style={{
          width: '100%',
          maxWidth: '100%',
          minHeight: '46px',
          padding: '12px 24px',
          fontSize: '15px',
          fontWeight: 700,
          fontFamily: "'Nunito', sans-serif",
          borderRadius: '14px',
          background: disabled ? '#d2e7e0' : '#00ae9d',
          color: '#ffffff',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: disabled ? 'none' : '0 4px 14px rgba(0, 174, 157, 0.28)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {label}
      </button>
    </div>
  )
}
