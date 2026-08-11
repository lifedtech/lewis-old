import { motion } from 'framer-motion'

/**
 * TopicLineIllustration - Beautiful, minimalist SVG line art illustrations
 * designed for the left column of scale & questionnaire screens.
 */
export default function TopicLineIllustration({ topic = 'agency', title = '' }) {
  // Normalize topic key
  const t = (topic || '').toLowerCase()

  const getIllustrationContent = () => {
    if (t.includes('about') || t.includes('identity') || t.includes('profile')) {
      // About You / Identity: Abstract personal silhouette with an ambient aura
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9466" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ae9d" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Ambient Aura */}
          <motion.circle
            cx="160" cy="140" r="70"
            fill="url(#aboutGrad)"
            opacity="0.15"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '160px 140px' }}
          />

          {/* Head */}
          <motion.circle
            cx="160" cy="95" r="30"
            stroke="var(--dawn)"
            strokeWidth="2.2"
            fill="rgba(255, 148, 102, 0.08)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Shoulders / Silhouette Arc */}
          <motion.path
            d="M 90,215 C 90,155 130,130 160,130 C 190,130 230,155 230,215"
            stroke="var(--dawn)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Identity Spark */}
          <motion.circle
            cx="216" cy="150" r="6"
            fill="#00ae9d"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            ABOUT YOU
          </text>
        </svg>
      )
    }

    if (t.includes('gse') || t.includes('agency') || t.includes('accomplishment')) {
      // Accomplishment & Agency: Mountain peak, climbing trajectory, summit star
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="illGradDawn" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9466" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5fbb46" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="illGradTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ae9d" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <g transform="translate(0, -16)">
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
          </g>

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
              <stop offset="0%" stopColor="#5fbb46" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ae9d" stopOpacity="0.5" />
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
            stroke="#00ae9d"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={{
              d: [
                "M 30,190 Q 90,160 160,190 T 290,190",
                "M 30,185 Q 90,200 160,185 T 290,185",
                "M 30,190 Q 90,160 160,190 T 290,190"
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M 50,210 Q 110,190 180,210 T 270,210" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
        </svg>
      )
    }

    if (t.includes('pss10') || t.includes('stress') || t.includes('mental')) {
      // Emotional & Mental Stress: Zen Zen balance stones & mind harmony
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <g transform="translate(0, -40)">
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
          </g>
        </svg>
      )
    }

    if (t.includes('ucla3') || t.includes('social') || t.includes('relationship')) {
      // Relationships & Social: Overlapping human profiles / Connection bridge
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <g transform="translate(0, -40)">
            <circle cx="120" cy="130" r="45" stroke="#00ae9d" strokeWidth="2.2" fill="rgba(0, 174, 157, 0.1)" />
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
          </g>
        </svg>
      )
    }

    if (t.includes('promis') || t.includes('purpose') || t.includes('meaning')) {
      // Meaning & Purpose: Celestial compass & North Star
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <g transform="translate(0, -40)">
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
          </g>
        </svg>
      )
    }

    if (t.includes('sharing') || t.includes('everyday') || t.includes('resource')) {
      // Everyday Sharing: Central energy core with orbiting resource nodes
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="shareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF9466" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <g transform="translate(0, -40)">
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
              <circle cx="160" cy="65" r="7" fill="#00ae9d" />
              <circle cx="215" cy="120" r="7" fill="#FF9466" />
              <circle cx="160" cy="175" r="7" fill="#00ae9d" />
              <circle cx="105" cy="120" r="7" fill="#5fbb46" />
            </motion.g>

            {/* Radiating Sharing Rings */}
            <circle cx="160" cy="120" r="55" stroke="var(--dawn)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
            <circle cx="160" cy="120" r="75" stroke="rgba(0, 174, 157, 0.4)" strokeWidth="1.2" strokeDasharray="3 3" />

            <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
              EVERYDAY SHARING
            </text>
          </g>
        </svg>
      )
    }

    if (t.includes('swls') || t.includes('satisfaction') || t.includes('life')) {
      // Life Satisfaction: Golden Horizon Sun & balanced harmony arc
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="satGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5fbb46" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ae9d" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <g transform="translate(0, -40)">
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
              stroke="#00ae9d"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6 }}
            />
            <path d="M 70,190 Q 160,140 250,190" stroke="rgba(0, 174, 157, 0.35)" strokeWidth="1.5" strokeDasharray="5 5" />

            {/* Star Node */}
            <circle cx="160" cy="65" r="5" fill="#5fbb46" />
            <line x1="160" y1="75" x2="160" y2="92" stroke="#5fbb46" strokeWidth="1.5" strokeDasharray="3 3" />

            <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
              GLOBAL LIFE SATISFACTION
            </text>
          </g>
        </svg>
      )
    }

    if (t.includes('diener') || t.includes('flourishing') || t.includes('growth')) {
      // Flourishing & Growth: Expanding geometric Lotus bloom
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <g transform="translate(0, -40)">
            <motion.circle
              cx="160" cy="125" r="45"
              fill="url(#growthGrad)"
              opacity="0.15"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: '160px 125px' }}
            />
            {/* Outer Petals */}
            <path d="M 160,65 C 190,95 210,125 160,185 C 110,125 130,95 160,65 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#00ae9d" strokeWidth="1.8" />
            <path d="M 100,125 C 130,95 160,115 220,125 C 160,135 130,155 100,125 Z" fill="rgba(0, 174, 157, 0.15)" stroke="var(--dawn)" strokeWidth="1.8" />

            {/* Central Bloom Core */}
            <circle cx="160" cy="125" r="12" fill="var(--dawn)" />

            <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
              FLOURISHING & GROWTH
            </text>
          </g>
        </svg>
      )
    }

    if (t.includes('cfpb') || t.includes('finance') || t.includes('financial')) {
      // Financial Wellness: Ascending growth tree & shield
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <g transform="translate(0, -40)">
            <path d="M 50,210 L 270,210" stroke="rgba(22, 36, 31, 0.2)" strokeWidth="1.5" />
            <motion.path
              d="M 60,190 L 120,150 L 170,170 L 250,90"
              stroke="#00ae9d"
              strokeWidth="2.8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            <circle cx="250" cy="90" r="8" fill="#00ae9d" />
            <path d="M 170,170 C 170,140 190,130 200,130 C 210,130 210,150 170,170 Z" fill="rgba(16, 185, 129, 0.3)" stroke="#00ae9d" strokeWidth="1.5" />

            <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
              FINANCIAL WELLNESS
            </text>
          </g>
        </svg>
      )
    }

    if (t.includes('circadian') || t.includes('bodyrhythm') || t.includes('rhythm') || t.includes('dayrhythm')) {
      // Body & Circadian Rhythms: Sun moving over circadian arc with green waves & floating particles
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <radialGradient id="circadianGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#00AE9D" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00ae9d" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Soft Dome Glow */}
          <circle cx="160" cy="140" r="85" fill="url(#circadianGlow)" />

          {/* Dotted Parabolic Circadian Trajectory Arc */}
          <motion.path
            d="M 95,175 C 115,100 205,100 225,175"
            stroke="#00ae9d"
            strokeWidth="2.2"
            strokeDasharray="3 4"
            strokeLinecap="round"
            animate={{ strokeDashoffset: [-28, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating Green Particles along the Arc */}
          <motion.circle
            cx="160" cy="108" r="4.5"
            fill="#00ae9d"
            animate={{ y: [-3, 3, -3], scale: [0.9, 1.25, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="185" cy="116" r="3.5"
            fill="#34D399"
            animate={{ y: [2, -4, 2], scale: [1.1, 0.8, 1.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.circle
            cx="204" cy="134" r="2.8"
            fill="#00ae9d"
            animate={{ y: [-2, 3, -2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.circle
            cx="138" cy="120" r="3"
            fill="#00ae9d"
            animate={{ y: [3, -3, 3], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Animated Traveling Sun along the Arc */}
          <motion.g
            animate={{
              x: [0, 45, 90, 45, 0],
              y: [0, -40, -28, -40, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '110px 168px' }}
          >
            {/* Glowing Sun Core */}
            <circle cx="110" cy="168" r="14" fill="#FBBF24" stroke="#5fbb46" strokeWidth="1.5" />

            {/* Rotating Sun Rays */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '110px 168px' }}
            >
              <line x1="110" y1="146" x2="110" y2="151" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
              <line x1="110" y1="185" x2="110" y2="190" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
              <line x1="88" y1="168" x2="93" y2="168" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
              <line x1="127" y1="168" x2="132" y2="168" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
              <line x1="95" y1="153" x2="99" y2="157" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
              <line x1="121" y1="179" x2="125" y2="183" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
              <line x1="95" y1="183" x2="99" y2="179" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
              <line x1="121" y1="157" x2="125" y2="153" stroke="#5fbb46" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          </motion.g>

          {/* Bottom Wavy Landscape / Waves */}
          <motion.path
            d="M 85,215 Q 160,198 235,215"
            stroke="#00AE9D"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                "M 85,215 Q 160,198 235,215",
                "M 85,212 Q 160,203 235,212",
                "M 85,215 Q 160,198 235,215"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 95,227 Q 160,217 225,227"
            stroke="rgba(0, 174, 157, 0.45)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                "M 95,227 Q 160,217 225,227",
                "M 95,229 Q 160,214 225,229",
                "M 95,227 Q 160,217 225,227"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      )
    }

    if (t.includes('ins') || t.includes('nature') || t.includes('inclusion')) {
      // Inclusion of Nature in Self: Self & Nature circles overlapping, leaf & shared core
      return (
        <svg viewBox="0 0 320 280" fill="none" style={{ width: '100%', maxHeight: '280px' }}>
          <defs>
            <radialGradient id="insSelfGrad" cx="40%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#FF9466" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FF7E67" stopOpacity="0.12" />
            </radialGradient>
            <radialGradient id="insNatureGrad" cx="60%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00ae9d" stopOpacity="0.12" />
            </radialGradient>
          </defs>

          {/* Ambient Aura */}
          <motion.circle
            cx="160" cy="130" r="92"
            fill="url(#insNatureGrad)"
            opacity="0.12"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '160px 130px' }}
          />

          {/* Self Circle — breathes toward Nature */}
          <motion.circle
            cx="128" cy="130" r="62"
            fill="url(#insSelfGrad)"
            stroke="#FF7E67"
            strokeWidth="2"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Nature Circle — breathes toward Self */}
          <motion.circle
            cx="192" cy="130" r="62"
            fill="url(#insNatureGrad)"
            stroke="#00ae9d"
            strokeWidth="2"
            animate={{ x: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Leaf motif inside Nature */}
          <path d="M 206,108 C 228,108 238,130 221,152 C 199,152 194,128 206,108 Z" fill="rgba(16, 185, 129, 0.35)" stroke="#00ae9d" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M 210,148 L 219,118" stroke="#00ae9d" strokeWidth="1.4" strokeLinecap="round" />

          {/* Self spark */}
          <circle cx="112" cy="130" r="6" fill="#FF7E67" />

          {/* Shared Overlap Core */}
          <motion.circle
            cx="160" cy="130" r="9"
            fill="var(--dawn)"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '160px 130px' }}
          />

          {/* Anchor Labels */}
          <text x="110" y="214" textAnchor="middle" fill="#F43F5E" fontSize="11" fontWeight="700" letterSpacing="0.04em">SELF</text>
          <text x="210" y="214" textAnchor="middle" fill="#00ae9d" fontSize="11" fontWeight="700" letterSpacing="0.04em">NATURE</text>

          <text x="160" y="260" textAnchor="middle" fill="var(--text-mute)" fontSize="13" fontWeight="500" letterSpacing="0.08em">
            CONNECTION TO NATURE
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
      className="topic-illustration-container stage-illustration"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
