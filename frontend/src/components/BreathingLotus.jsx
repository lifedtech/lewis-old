import React from 'react'
import { motion } from 'framer-motion'

/**
 * BreathingLotus - A beautiful, organic, multi-layered lotus flower component
 * with smooth blooming/contracting breathing animations and ambient glow.
 */
export default function BreathingLotus({ 
  size = 140, 
  scaleOverride = null, 
  customColor = null, 
  interactive = false,
  onClick = null,
  duration = 4
}) {
  const innerPetalCount = 6
  const outerPetalCount = 12

  // Color options
  const defaultGradientStart = customColor || '#36D1DC'
  const defaultGradientEnd = customColor || '#5B86E5'
  const defaultGlow = customColor ? `0 0 40px ${customColor}` : '0 0 50px rgba(54, 209, 220, 0.5)'

  return (
    <motion.div 
      className="breathing-lotus-wrapper"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none'
      }}
      animate={scaleOverride === null ? {
        scale: [1, 1.22, 1],
        filter: [
          'drop-shadow(0px 0px 20px rgba(54, 209, 220, 0.4))',
          'drop-shadow(0px 0px 45px rgba(91, 134, 229, 0.8))',
          'drop-shadow(0px 0px 20px rgba(54, 209, 220, 0.4))'
        ]
      } : {
        scale: scaleOverride,
        filter: 'drop-shadow(0px 0px 30px rgba(54, 209, 220, 0.6))'
      }}
      transition={{
        duration: scaleOverride === null ? duration : 0.4,
        repeat: scaleOverride === null ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {/* Background Soft Aura Ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: '80%',
          height: '80%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(54, 209, 220, 0.25) 0%, rgba(255, 148, 102, 0.15) 60%, transparent 80%)',
          filter: 'blur(15px)',
          zIndex: 0
        }}
        animate={{
          scale: [0.9, 1.3, 0.9],
          opacity: [0.4, 0.85, 0.4]
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <svg 
        viewBox="-100 -100 200 200" 
        width={size} 
        height={size}
        style={{ overflow: 'visible', zIndex: 1 }}
      >
        <defs>
          {/* Outer Petal Gradient */}
          <linearGradient id="lotusOuterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#20B2AA" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#48D1CC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0FFFF" stopOpacity="1" />
          </linearGradient>

          {/* Inner Petal Gradient */}
          <linearGradient id="lotusInnerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00A896" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#02C39A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F0FDFC" stopOpacity="1" />
          </linearGradient>

          {/* Center Glow Gradient */}
          <radialGradient id="lotusCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9E6" stopOpacity="1" />
            <stop offset="45%" stopColor="#FFD166" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF9466" stopOpacity="0.8" />
          </radialGradient>

          {/* Custom Dynamic Gradient if color passed */}
          {customColor && (
            <linearGradient id="lotusCustomGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={customColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>
          )}
        </defs>

        {/* Outer Ring of Petals */}
        <motion.g
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: duration * 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {Array.from({ length: outerPetalCount }).map((_, i) => {
            const angle = (360 / outerPetalCount) * i
            return (
              <motion.path
                key={`outer-${i}`}
                d="M 0,0 C -22,-35 -30,-65 0,-85 C 30,-65 22,-35 0,0 Z"
                fill={customColor ? "url(#lotusCustomGrad)" : "url(#lotusOuterGrad)"}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
                transform={`rotate(${angle})`}
                animate={{
                  d: [
                    "M 0,0 C -22,-35 -30,-65 0,-85 C 30,-65 22,-35 0,0 Z",
                    "M 0,0 C -28,-42 -38,-78 0,-96 C 38,-78 28,-42 0,0 Z",
                    "M 0,0 C -22,-35 -30,-65 0,-85 C 30,-65 22,-35 0,0 Z"
                  ]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05
                }}
              />
            )
          })}
        </motion.g>

        {/* Inner Ring of Petals (Offset Angle) */}
        <motion.g
          animate={{ rotate: [0, -20, 0] }}
          transition={{ duration: duration * 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {Array.from({ length: innerPetalCount }).map((_, i) => {
            const angle = (360 / innerPetalCount) * i + (360 / (innerPetalCount * 2))
            return (
              <motion.path
                key={`inner-${i}`}
                d="M 0,0 C -16,-25 -22,-48 0,-64 C 22,-48 16,-25 0,0 Z"
                fill={customColor ? "url(#lotusCustomGrad)" : "url(#lotusInnerGrad)"}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1.2"
                transform={`rotate(${angle})`}
                animate={{
                  d: [
                    "M 0,0 C -16,-25 -22,-48 0,-64 C 22,-48 16,-25 0,0 Z",
                    "M 0,0 C -22,-32 -28,-58 0,-72 C 28,-58 22,-32 0,0 Z",
                    "M 0,0 C -16,-25 -22,-48 0,-64 C 22,-48 16,-25 0,0 Z"
                  ]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08
                }}
              />
            )
          })}
        </motion.g>

        {/* Radiant Central Core / Pistil */}
        <circle 
          cx="0" 
          cy="0" 
          r="16" 
          fill="url(#lotusCoreGrad)" 
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="2"
        />
        <circle 
          cx="0" 
          cy="0" 
          r="8" 
          fill="#FFF" 
          opacity="0.9"
        />
      </svg>
    </motion.div>
  )
}
