import { motion } from 'framer-motion'

/**
 * RhythmTimeIcon - Time-of-day badges matching Teal Green / Lewis Green (#00ae9d / #017a6f).
 * All icon badges use soft pale mint-teal background (#eaf7f5) and deep lewis green stroke/fill (#00ae9d / #017a6f).
 */
export default function RhythmTimeIcon({ periodId, isActive = false, size = 32 }) {
  const iconScale = size * 0.56

  const TEAL_BG = '#eaf7f5'       // Soft Light Mint-Teal Pill Background
  const TEAL_MAIN = '#00ae9d'     // Lewis Green / Teal Green Main Accent
  const TEAL_STROKE = '#017a6f'   // Deep Lewis Green Stroke Accent

  switch (periodId) {
    case 0: // Late Night (12am - 6am) - Lewis Green Crescent Moon & Star Spark
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: TEAL_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 2px 10px rgba(0, 174, 157, 0.28)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={TEAL_MAIN} stroke={TEAL_MAIN} strokeWidth="0.5" />
            <path d="M17.5 4.5l.3.6.6.3-.6.3-.3.6-.3-.6-.6-.3.6-.3z" fill={TEAL_MAIN} />
          </svg>
        </motion.div>
      )

    case 6: // Early Morning (6am - 9am) - Lewis Green Sunrise
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: TEAL_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 2px 10px rgba(0, 174, 157, 0.28)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke={TEAL_STROKE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="18" x2="21" y2="18" />
            <path d="M17 18a5 5 0 0 0-10 0" fill="none" />
            <line x1="12" y1="10" x2="12" y2="5" />
            <line x1="6.34" y1="12.34" x2="4.5" y2="10.5" />
            <line x1="17.66" y1="12.34" x2="19.5" y2="10.5" />
          </svg>
        </motion.div>
      )

    case 9: // Late Morning (9am - 12pm) - Lewis Green Morning Sun
      return (
        <motion.div
          animate={isActive ? { rotate: 90 } : { rotate: 0 }}
          transition={isActive ? { duration: 10, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: TEAL_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 2px 10px rgba(0, 174, 157, 0.28)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke={TEAL_STROKE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" fill={TEAL_MAIN} stroke={TEAL_STROKE} />
            <path d="M12 2v2.5M12 19.5v2.5M2 12h2.5M19.5 12h2.5M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
          </svg>
        </motion.div>
      )

    case 12: // Midday (12pm - 3pm) - Lewis Green Target Sun
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: TEAL_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 2px 10px rgba(0, 174, 157, 0.28)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke={TEAL_STROKE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3.5" fill={TEAL_MAIN} stroke={TEAL_STROKE} />
            <circle cx="12" cy="12" r="8" fill="none" stroke={TEAL_STROKE} strokeWidth="1.8" />
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
          </svg>
        </motion.div>
      )

    case 15: // Late Afternoon (3pm - 6pm) - Lewis Green Setting Sun & Arrow
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: TEAL_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 2px 10px rgba(0, 174, 157, 0.28)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none" stroke={TEAL_STROKE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="18" x2="21" y2="18" />
            <path d="M17 18a5 5 0 0 0-10 0" fill="none" />
            <line x1="12" y1="15" x2="12" y2="6" />
            <path d="M9 9l3-3 3 3" fill="none" />
          </svg>
        </motion.div>
      )

    case 18: // Evening (6pm - 9pm) - Lewis Green Twilight Crescent Moon
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: TEAL_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 2px 10px rgba(0, 174, 157, 0.28)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={TEAL_MAIN} stroke={TEAL_MAIN} strokeWidth="0.5" />
          </svg>
        </motion.div>
      )

    case 21: // Night (9pm - 12am) - Lewis Green Star
    default:
      return (
        <motion.div
          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: TEAL_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? '0 2px 10px rgba(0, 174, 157, 0.28)' : 'none'
          }}
        >
          <svg width={iconScale} height={iconScale} viewBox="0 0 24 24" fill={TEAL_MAIN} stroke={TEAL_MAIN} strokeWidth="1" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </motion.div>
      )
  }
}
