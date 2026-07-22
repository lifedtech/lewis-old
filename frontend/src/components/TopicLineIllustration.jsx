import React from 'react'
import { motion } from 'framer-motion'

/**
 * TopicLineIllustration - Beautiful, minimalist SVG line art illustrations
 * designed for the left column of scale & questionnaire screens.
 */
export default function TopicLineIllustration({ topic = 'agency', title = '' }) {
  // Normalize topic key
  const t = (topic || '').toLowerCase()

  const getIllustrationContent = () => {
    if (t.includes('gse') || t.includes('agency') || t.includes('accomplishment')) {
      // Accomplishment & Agency: Mountain peak, climbing trajectory, summit star
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="illGradDawn" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9466" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E67B5E" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="illGradTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#36D1DC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5B86E5" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background Ambient Aura */}
          <circle cx="160" cy="120" r="90" fill="url(#illGradTeal)" opacity="0.12" filter="blur(30px)" />

          {/* Mountain Peaks Line Art */}
          <motion.path
            d="M 30,220 L 110,110 L 160,160 L 230,70 L 290,220 Z"
            stroke="var(--dawn)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />

          <motion.path
            d="M 90,220 L 160,130 L 210,220 Z"
            stroke="rgba(22, 36, 31, 0.25)"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* Target Milestone Trajectory */}
          <motion.path
            d="M 40,200 C 90,180 140,110 230,70"
            stroke="url(#illGradDawn)"
            strokeWidth="2"
            strokeDasharray="6 6"
            animate={{ strokeDashoffset: [-20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Summit Star / Goal Core */}
          <motion.g
            animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '230px 70px' }}
          >
            <circle cx="230" cy="70" r="16" fill="rgba(255, 148, 102, 0.2)" />
            <circle cx="230" cy="70" r="8" fill="url(#illGradDawn)" />
            <path d="M 230,52 L 230,88 M 212,70 L 248,70" stroke="var(--dawn)" strokeWidth="1.5" />
          </motion.g>

          {/* Step Milestones */}
          <circle cx="70" cy="165" r="4" fill="var(--dawn)" />
          <circle cx="125" cy="135" r="4" fill="var(--dawn)" />
          <circle cx="180" cy="100" r="4" fill="var(--dawn)" />

          {/* Title Label */}
          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            ACCOMPLISHMENT & AGENCY
          </text>
        </svg>
      )
    }

    if (t.includes('who5') || t.includes('wellbeing') || t.includes('overall')) {
      // Overall Wellbeing: Radiant Sun over calm horizon waves & leaf
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="wellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Sun Aura */}
          <motion.circle 
            cx="160" cy="90" r="45" 
            fill="url(#wellGrad)" 
            opacity="0.2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '160px 90px' }}
          />

          {/* Sun Circle & Rays */}
          <circle cx="160" cy="90" r="22" fill="#FBBF24" opacity="0.9" stroke="var(--dawn)" strokeWidth="2" />
          <path d="M 160,50 L 160,60 M 160,120 L 160,130 M 120,90 L 130,90 M 190,90 L 200,90 M 132,62 L 139,69 M 181,111 L 188,118 M 132,118 L 139,111 M 181,69 L 188,62" stroke="var(--dawn)" strokeWidth="2" strokeLinecap="round" />

          {/* Horizon Fluid Waves */}
          <motion.path
            d="M 30,190 Q 90,160 160,190 T 290,190"
            stroke="#10B981"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={{ d: [
              "M 30,190 Q 90,160 160,190 T 290,190",
              "M 30,185 Q 90,200 160,185 T 290,185",
              "M 30,190 Q 90,160 160,190 T 290,190"
            ]}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M 50,210 Q 110,190 180,210 T 270,210" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            OVERALL WELLBEING
          </text>
        </svg>
      )
    }

    if (t.includes('pss10') || t.includes('stress') || t.includes('mental')) {
      // Emotional & Mental Stress: Zen Zen balance stones & mind harmony
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          {/* Zen Stones */}
          <motion.ellipse cx="160" cy="200" rx="65" ry="18" fill="rgba(99, 102, 241, 0.15)" stroke="#6366F1" strokeWidth="2" />
          <motion.ellipse cx="160" cy="168" rx="48" ry="14" fill="rgba(139, 92, 246, 0.2)" stroke="#8B5CF6" strokeWidth="2" />
          <motion.ellipse cx="160" cy="140" rx="32" ry="11" fill="rgba(236, 72, 153, 0.25)" stroke="#EC4899" strokeWidth="2" />

          {/* Centering Ripple Rings */}
          <motion.circle 
            cx="160" cy="90" r="30" 
            stroke="var(--dawn)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transformOrigin: '160px 90px' }}
          />
          <circle cx="160" cy="90" r="8" fill="var(--dawn)" />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            EMOTIONAL & MENTAL
          </text>
        </svg>
      )
    }

    if (t.includes('ucla3') || t.includes('social') || t.includes('relationship')) {
      // Relationships & Social: Overlapping human profiles / Connection bridge
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <circle cx="120" cy="130" r="45" stroke="#36D1DC" strokeWidth="2.2" fill="rgba(54, 209, 220, 0.1)" />
          <circle cx="200" cy="130" r="45" stroke="#FF9466" strokeWidth="2.2" fill="rgba(255, 148, 102, 0.1)" />
          
          <motion.line 
            x1="120" y1="130" x2="200" y2="130" 
            stroke="var(--dawn)" 
            strokeWidth="2.5" 
            strokeDasharray="6 4"
            animate={{ strokeDashoffset: [-20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          <circle cx="160" cy="130" r="10" fill="#FFF" stroke="var(--dawn)" strokeWidth="2" />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            RELATIONSHIPS & SOCIAL
          </text>
        </svg>
      )
    }

    if (t.includes('promis') || t.includes('purpose') || t.includes('meaning')) {
      // Meaning & Purpose: Celestial compass & North Star
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <circle cx="160" cy="130" r="65" stroke="rgba(22, 36, 31, 0.2)" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="160" cy="130" r="45" stroke="var(--dawn)" strokeWidth="1.8" fill="rgba(255, 148, 102, 0.08)" />

          <motion.path 
            d="M 160,70 L 170,120 L 220,130 L 170,140 L 160,190 L 150,140 L 100,130 L 150,120 Z" 
            fill="var(--dawn)" 
            opacity="0.9"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '160px 130px' }}
          />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            MEANING & PURPOSE
          </text>
        </svg>
      )
    }

    if (t.includes('sharing') || t.includes('everyday') || t.includes('resource')) {
      // Everyday Sharing: Central energy core with orbiting resource nodes
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="shareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#36D1DC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF9466" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Central Sharing Energy Core */}
          <motion.circle 
            cx="160" cy="120" r="35" 
            fill="url(#shareGrad)" 
            opacity="0.2"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '160px 120px' }}
          />

          <circle cx="160" cy="120" r="16" fill="var(--dawn)" opacity="0.9" />

          {/* Orbiting Resource Sharing Nodes (Time, Energy, Trust, Recognition, Knowledge) */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '160px 120px' }}
          >
            <circle cx="160" cy="65" r="7" fill="#36D1DC" />
            <circle cx="215" cy="120" r="7" fill="#FF9466" />
            <circle cx="160" cy="175" r="7" fill="#10B981" />
            <circle cx="105" cy="120" r="7" fill="#F59E0B" />
          </motion.g>

          {/* Radiating Sharing Rings */}
          <circle cx="160" cy="120" r="55" stroke="var(--dawn)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
          <circle cx="160" cy="120" r="75" stroke="rgba(54, 209, 220, 0.4)" strokeWidth="1.2" strokeDasharray="3 3" />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            EVERYDAY SHARING
          </text>
        </svg>
      )
    }

    if (t.includes('swls') || t.includes('satisfaction') || t.includes('life')) {
      // Global Life Satisfaction: Golden Horizon Sun & balanced harmony arc
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="satGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#36D1DC" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <motion.circle 
            cx="160" cy="120" r="50" 
            fill="url(#satGrad)" 
            opacity="0.18"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '160px 120px' }}
          />
          <circle cx="160" cy="120" r="22" stroke="var(--dawn)" strokeWidth="2" fill="#FFF" />
          <circle cx="160" cy="120" r="10" fill="var(--dawn)" />

          {/* Balanced Horizon Arc */}
          <motion.path 
            d="M 50,170 Q 160,110 270,170" 
            stroke="#10B981" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6 }}
          />
          <path d="M 70,190 Q 160,140 250,190" stroke="rgba(0, 174, 157, 0.35)" strokeWidth="1.5" strokeDasharray="5 5" />

          {/* Star Node */}
          <circle cx="160" cy="65" r="5" fill="#F59E0B" />
          <line x1="160" y1="75" x2="160" y2="92" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            GLOBAL LIFE SATISFACTION
          </text>
        </svg>
      )
    }

    if (t.includes('diener') || t.includes('flourishing') || t.includes('growth')) {
      // Flourishing & Growth: Expanding geometric Lotus bloom
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <motion.circle 
            cx="160" cy="125" r="45" 
            fill="url(#growthGrad)" 
            opacity="0.15"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '160px 125px' }}
          />
          {/* Outer Petals */}
          <path d="M 160,65 C 190,95 210,125 160,185 C 110,125 130,95 160,65 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="1.8" />
          <path d="M 100,125 C 130,95 160,115 220,125 C 160,135 130,155 100,125 Z" fill="rgba(0, 174, 157, 0.15)" stroke="var(--dawn)" strokeWidth="1.8" />

          {/* Central Bloom Core */}
          <circle cx="160" cy="125" r="12" fill="var(--dawn)" />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            FLOURISHING & GROWTH
          </text>
        </svg>
      )
    }

    if (t.includes('cfpb') || t.includes('finance') || t.includes('financial')) {
      // Financial Wellness: Ascending growth tree & shield
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <path d="M 50,210 L 270,210" stroke="rgba(22, 36, 31, 0.2)" strokeWidth="1.5" />
          <motion.path 
            d="M 60,190 L 120,150 L 170,170 L 250,90" 
            stroke="#10B981" 
            strokeWidth="2.8" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
          <circle cx="250" cy="90" r="8" fill="#10B981" />
          <path d="M 170,170 C 170,140 190,130 200,130 C 210,130 210,150 170,170 Z" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="1.5" />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            FINANCIAL WELLNESS
          </text>
        </svg>
      )
    }

    // Default Abstract Trajectory
    return (
      <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
        <circle cx="160" cy="130" r="55" stroke="var(--dawn)" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="160" cy="130" r="25" fill="rgba(255, 148, 102, 0.2)" />
        <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
          {title ? title.toUpperCase() : 'LEWIS ASSESSMENT'}
        </text>
      </svg>
    )
  }

  return (
    <motion.div 
      className="topic-illustration-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        height: '100%',
        width: '100%',
        padding: '20px 10px',
        userSelect: 'none'
      }}
    >
      {getIllustrationContent()}
    </motion.div>
  )
}
