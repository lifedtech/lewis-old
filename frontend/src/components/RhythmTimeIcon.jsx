import React from 'react'
import { motion } from 'framer-motion'

/**
 * RhythmTimeIcon - Custom time-of-day badges matching the diurnal energy cycle.
 * Renders period-specific vector icons inside soft circular color badges.
 */
export default function RhythmTimeIcon({ periodId, isActive = false, size = 38 }) {
  const iconScale = size * 0.55

  switch (periodId) {
    case 0: // Late Night (12am - 6am) - Navy Moon with Star Sparks
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: '#e9e6f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 0 14px rgba(46, 41, 78, 0.35)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke="#2e294e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#2e294e" />
            <path d="M18 4l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" fill="#2e294e" stroke="none" />
          </svg>
        </motion.div>
      )

    case 6: // Early Morning (6am - 9am) - Sunrise over Horizon
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: '#ffe8d6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 0 14px rgba(224, 122, 95, 0.4)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke="#e07a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 18a5 5 0 0 0-10 0" />
            <line x1="12" y1="9" x2="12" y2="4" />
            <line x1="4.22" y1="10.22" x2="6.34" y2="12.34" />
            <line x1="19.78" y1="10.22" x2="17.66" y2="12.34" />
            <line x1="2" y1="18" x2="22" y2="18" />
          </svg>
        </motion.div>
      )

    case 9: // Late Morning (9am - 12pm) - Bright Golden Morning Sun
      return (
        <motion.div
          animate={isActive ? { rotate: 90 } : { rotate: 0 }}
          transition={isActive ? { duration: 10, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: '#fef0c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 0 14px rgba(217, 119, 6, 0.4)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" fill="#d97706" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        </motion.div>
      )

    case 12: // Midday (12pm - 3pm) - Peak Concentric Solar Flare Sun
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: '#ffe5d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 0 14px rgba(249, 115, 22, 0.4)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" fill="#f97316" />
            <circle cx="12" cy="12" r="8" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />
            <path d="M12 1v2M12 21v2M1 12h2M21 12h2" />
          </svg>
        </motion.div>
      )

    case 15: // Late Afternoon (3pm - 6pm) - Sunset with Top Arrow Spark
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: '#ffd7d5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 0 14px rgba(225, 29, 72, 0.4)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 18a5 5 0 0 0-10 0" />
            <line x1="2" y1="18" x2="22" y2="18" />
            <path d="M12 8v5M9 10l3-3 3 3" />
          </svg>
        </motion.div>
      )

    case 18: // Evening (6pm - 9pm) - Purple Twilight Crescent Moon
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: '#eae0fb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 0 14px rgba(124, 58, 237, 0.4)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#7c3aed" />
          </svg>
        </motion.div>
      )

    case 21: // Night (9pm - 12am) - Solid Slate Night Star
    default:
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: '#dbeefb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 0 14px rgba(30, 41, 59, 0.4)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="#1e293b" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </motion.div>
      )
  }
}
