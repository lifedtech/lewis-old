import React from 'react'
import { useLewisStore } from '../store/useLewisStore.js'

export default function ThemeToggle({ compact = false, className = '', style = {} }) {
  const { theme, toggleTheme } = useLewisStore()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 0 : '7px',
        background: isDark ? 'var(--raised, #182725)' : 'var(--void, #ffffff)',
        border: `1px solid ${isDark ? 'var(--panel-border, #22332F)' : 'rgba(0, 174, 157, 0.22)'}`,
        color: isDark ? 'var(--dawn, #38C9B7)' : 'var(--text-main, #414242)',
        borderRadius: '999px',
        padding: compact ? '7px' : '6px 14px',
        fontFamily: "'Nunito', system-ui, sans-serif",
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        flexShrink: 0,
        userSelect: 'none',
        boxShadow: isDark ? '0 2px 8px rgba(4, 32, 29, 0.5)' : '0 2px 6px rgba(0, 174, 157, 0.06)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.borderColor = 'var(--dawn, #38C9B7)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 14px rgba(41, 179, 163, 0.25)'
          : '0 4px 12px rgba(0, 174, 157, 0.18)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = isDark ? 'var(--panel-border, #22332F)' : 'rgba(0, 174, 157, 0.22)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 2px 8px rgba(4, 32, 29, 0.5)'
          : '0 2px 6px rgba(0, 174, 157, 0.06)'
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        {isDark ? (
          /* Sun Icon */
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--dawn, #38C9B7)' }}
          >
            <circle cx="12" cy="12" r="4.5" fill="rgba(56, 201, 183, 0.25)" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon Icon */
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--dawn, #00ae9d)' }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>

      {!compact && (
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.01em' }}>
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  )
}
