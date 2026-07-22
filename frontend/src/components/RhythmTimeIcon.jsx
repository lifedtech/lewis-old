import React from 'react'
import { motion } from 'framer-motion'

/**
 * RhythmTimeIcon - Custom, creative vector badges with gradient fills
 * and animated micro-elements to replace standard emojis for diurnal time periods.
 */
export default function RhythmTimeIcon({ periodId, isActive = false, size = 32 }) {
  switch (periodId) {
    case 0: // Late Night (12am - 6am) - Midnight Crescent & Stars
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 12px rgba(99, 102, 241, 0.6)' : 'none' }}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="url(#nightMoonGrad)" stroke="#A5B4FC" strokeWidth="1.2" />
            <circle cx="18" cy="6" r="1" fill="#FFF" />
            <circle cx="15" cy="4" r="0.8" fill="#E0E7FF" opacity="0.8" />
            <defs>
              <linearGradient id="nightMoonGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C7D2FE" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )

    case 6: // Early Morning (6am - 9am) - Golden Sunrise
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 12px rgba(251, 146, 60, 0.6)' : 'none' }}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="14" r="5" fill="url(#sunriseGrad)" stroke="#F97316" strokeWidth="1" />
            <path d="M12 4v2M4.93 7.93l1.41 1.41M19.07 7.93l-1.41 1.41" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="sunriseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )

    case 9: // Late Morning (9am - 12pm) - Bright Radiant Sun
      return (
        <motion.div
          animate={isActive ? { rotate: 90 } : { rotate: 45 }}
          transition={isActive ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 12px rgba(245, 158, 11, 0.6)' : 'none' }}
        >
          <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="#F59E0B" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </motion.div>
      )

    case 12: // Midday (12pm - 3pm) - High Zenith Solar Flare
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 14px rgba(234, 88, 12, 0.7)' : 'none' }}
        >
          <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="6" fill="url(#middayGrad)" stroke="#EA580C" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="9" stroke="#F97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
            <defs>
              <linearGradient id="middayGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )

    case 15: // Late Afternoon (3pm - 6pm) - Golden Hour Sunset
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #FFEDD5 0%, #FCA5A5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 12px rgba(239, 68, 68, 0.6)' : 'none' }}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <path d="M17 18a5 5 0 0 0-10 0" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 11l3 3 3-3" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )

    case 18: // Evening (6pm - 9pm) - Dusk Twilight Skyline
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #4C1D95 0%, #1E1B4B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 12px rgba(139, 92, 246, 0.6)' : 'none' }}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill="#DDD6FE" opacity="0.9" />
            <circle cx="6" cy="6" r="1" fill="#F472B6" />
          </svg>
        </motion.div>
      )

    case 21: // Night (9pm - 12am) - Cosmic Deep Starlight
    default:
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.6)' : 'none' }}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.4 5.6L20 10l-4.4 4L17 20l-5-3-5 3 1.4-6L4 10l5.6-2.4L12 2z" fill="url(#starGrad)" />
            <defs>
              <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )
  }
}
