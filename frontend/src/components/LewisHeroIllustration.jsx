import React from 'react'

export default function LewisHeroIllustration() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '446px',
        margin: '-20px auto 0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateY(-14px)',
        background: 'transparent',
      }}
    >
      <img
        src="/lewis-svg/life_orbit_animation_446x480.svg"
        alt="Lewis Nine Domains Orbit Animation"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '580px',
          display: 'block',
          pointerEvents: 'none',
          background: 'transparent',
          backgroundColor: 'transparent',
        }}
      />

      <p
        style={{
          margin: '10px 0 0 0',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--lp-text-muted, #8fa39e)',
          fontFamily: "'Nunito', sans-serif",
          letterSpacing: '0.04em',
          textAlign: 'center',
        }}
      >
        Nine connected domains of everyday wellbeing
      </p>
    </div>
  )
}
