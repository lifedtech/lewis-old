import React from 'react'
import { motion } from 'framer-motion'

/**
 * BreathingFluidBlob - A modern, organic liquid lava-lamp style fluid mesh
 * with morphing vector paths, rich aurora gradients, and breathing pulses.
 */
export default function BreathingFluidBlob({ 
  size = 150, 
  scaleOverride = null, 
  customColor = null, 
  interactive = false,
  onClick = null,
  duration = 4
}) {
  // Organic morphing SVG path keyframes
  const path1 = "M 0,-70 C 45,-75 75,-40 70,10 C 65,55 35,75 -15,70 C -60,65 -75,30 -70,-20 C -65,-60 -40,-65 0,-70 Z"
  const path2 = "M 10,-75 C 65,-60 70,-15 75,25 C 80,65 15,80 -30,70 C -75,60 -80,0 -60,-40 C -45,-75 -30,-85 10,-75 Z"
  const path3 = "M -10,-65 C 35,-85 80,-30 60,20 C 45,70 -20,80 -65,55 C -85,35 -60,-15 -50,-55 C -40,-80 -45,-45 -10,-65 Z"

  const defaultGlow = customColor 
    ? `0 0 50px ${customColor}` 
    : '0 0 50px rgba(54, 209, 220, 0.6)'

  return (
    <motion.div 
      className="fluid-blob-wrapper"
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
        scale: [1, 1.25, 1],
        rotate: [0, 90, 180, 270, 360],
        filter: [
          'drop-shadow(0px 0px 25px rgba(54, 209, 220, 0.5))',
          'drop-shadow(0px 0px 50px rgba(255, 148, 102, 0.75))',
          'drop-shadow(0px 0px 25px rgba(54, 209, 220, 0.5))'
        ]
      } : {
        scale: scaleOverride,
        filter: customColor 
          ? `drop-shadow(0px 0px 45px ${customColor})` 
          : 'drop-shadow(0px 0px 30px rgba(54, 209, 220, 0.7))'
      }}
      transition={{
        scale: { duration: scaleOverride === null ? duration : 0.25, repeat: scaleOverride === null ? Infinity : 0, ease: "easeInOut" },
        rotate: { duration: duration * 4, repeat: Infinity, ease: "linear" },
        filter: { duration: duration, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* Background Soft Aura Mesh */}
      <motion.div
        style={{
          position: 'absolute',
          width: '90%',
          height: '90%',
          borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%',
          background: customColor
            ? `radial-gradient(circle, ${customColor} 0%, transparent 75%)`
            : 'radial-gradient(circle at 30% 30%, rgba(54, 209, 220, 0.4), rgba(255, 148, 102, 0.3) 60%, transparent 85%)',
          filter: 'blur(20px)',
          zIndex: 0
        }}
        animate={{
          scale: [0.95, 1.35, 0.95],
          borderRadius: [
            '45% 55% 60% 40% / 50% 45% 55% 50%',
            '60% 40% 45% 55% / 40% 60% 40% 60%',
            '45% 55% 60% 40% / 50% 45% 55% 50%'
          ]
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
          {/* Main Aurora Liquid Gradient */}
          <linearGradient id="blobAuroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#36D1DC" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#5B86E5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF9466" stopOpacity="0.95" />
          </linearGradient>

          {/* Secondary Liquid Mesh Overlay */}
          <radialGradient id="blobCoreHighlight" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#E0FFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#36D1DC" stopOpacity="0" />
          </radialGradient>

          {/* Custom Dynamic Gradient */}
          {customColor && (
            <linearGradient id="blobCustomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={customColor} stopOpacity="1" />
              <stop offset="60%" stopColor="#FF6B6B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFE66D" stopOpacity="0.8" />
            </linearGradient>
          )}
        </defs>

        {/* Outer Morphing Liquid Layer */}
        <motion.path
          d={path1}
          fill={customColor ? "url(#blobCustomGrad)" : "url(#blobAuroraGrad)"}
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.5"
          animate={{
            d: [path1, path2, path3, path1]
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Inner Liquid Highlight Layer */}
        <motion.path
          d={path2}
          fill="url(#blobCoreHighlight)"
          style={{ transform: 'scale(0.75)' }}
          animate={{
            d: [path2, path3, path1, path2]
          }}
          transition={{
            duration: duration * 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Ambient Sparkle / Fluid Droplets */}
        <motion.circle
          cx="-25"
          cy="-30"
          r="6"
          fill="#FFF"
          opacity="0.8"
          animate={{
            cx: [-25, -15, -30, -25],
            cy: [-30, -45, -20, -30],
            scale: [1, 1.4, 0.8, 1]
          }}
          transition={{ duration: duration, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="30"
          cy="20"
          r="4"
          fill="#FFF"
          opacity="0.6"
          animate={{
            cx: [30, 42, 20, 30],
            cy: [20, 10, 35, 20],
            scale: [1, 0.7, 1.3, 1]
          }}
          transition={{ duration: duration * 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  )
}
