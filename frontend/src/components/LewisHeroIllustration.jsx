import React from 'react'
import { motion } from 'framer-motion'

export default function LewisHeroIllustration() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient background soft glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,174,157,0.18) 0%, rgba(214,237,234,0.1) 60%, transparent 80%)',
          filter: 'blur(32px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 440 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '480px',
          position: 'relative',
          zIndex: 1,
          overflow: 'visible',
        }}
      >
        <defs>
          {/* Subtle glow filters */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#414242" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ae9d" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#48a999" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#414242" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ── TOP SECTION: REFLECTIVE FIGURE ── */}
        <motion.g
          animate={{ y: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Head & Hand on Chin */}
          {/* Head outline */}
          <path
            d="M 218 36 C 218 24 234 24 234 36 C 234 46 226 55 219 55 C 213 55 210 46 218 36 Z"
            stroke="#414242"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />
          {/* Face profile line */}
          <path
            d="M 224 35 C 221 40 220 46 224 50"
            stroke="#414242"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Torso & Contemplative Pose */}
          <path
            d="M 213 54 C 206 63 203 76 205 92 C 206 102 201 112 195 120"
            stroke="#414242"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 229 54 C 236 64 242 78 241 94 C 240 106 248 116 256 122"
            stroke="#414242"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Raised Arm to Chin */}
          <path
            d="M 207 68 C 208 60 216 52 222 51"
            stroke="#414242"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Crossed Arm & Resting Hand */}
          <path
            d="M 238 78 C 234 92 222 98 212 98 C 204 98 200 90 200 84"
            stroke="#414242"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crossed Legs in Seated Reflection */}
          <path
            d="M 194 120 C 184 123 175 125 186 127 C 196 127 210 125 218 118 C 224 112 226 100 226 94"
            stroke="#414242"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 256 122 C 263 125 264 129 252 130 C 238 131 228 131 222 138 C 220 142 224 148 226 148"
            stroke="#414242"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Foot touching water ripple */}
          <path
            d="M 224 136 C 223 144 225 149 227 150"
            stroke="#00ae9d"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ── CONCENTRIC WATER RIPPLES (PULSING) ── */}
        <g id="ripples">
          {/* Center Ripple 1 */}
          <motion.ellipse
            cx="225"
            cy="154"
            rx="24"
            ry="7"
            stroke="#00ae9d"
            strokeWidth="2"
            fill="none"
            animate={{
              rx: [22, 26, 22],
              ry: [6.5, 7.8, 6.5],
              strokeOpacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Ripple 2 */}
          <motion.ellipse
            cx="225"
            cy="156"
            rx="48"
            ry="12"
            stroke="#00ae9d"
            strokeWidth="1.8"
            fill="none"
            animate={{
              rx: [45, 52, 45],
              ry: [11, 13.5, 11],
              strokeOpacity: [0.5, 0.9, 0.5],
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          {/* Ripple 3 */}
          <motion.ellipse
            cx="225"
            cy="159"
            rx="78"
            ry="18"
            stroke="#48a999"
            strokeWidth="1.8"
            fill="none"
            animate={{
              rx: [75, 83, 75],
              ry: [17, 19.5, 17],
              strokeOpacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
          {/* Ripple 4 */}
          <motion.ellipse
            cx="225"
            cy="163"
            rx="114"
            ry="25"
            stroke="#414242"
            strokeWidth="1.8"
            strokeDasharray="180 12"
            fill="none"
            animate={{
              rx: [110, 118, 110],
              ry: [24, 26.5, 24],
            }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
          {/* Outer Pool Border Wave */}
          <motion.path
            d="M 98 168 C 120 192 330 192 352 168 C 364 154 350 144 320 140 C 270 134 180 134 130 140 C 100 144 86 154 98 168 Z"
            stroke="#414242"
            strokeWidth="2.2"
            fill="none"
            animate={{
              strokeOpacity: [0.75, 1, 0.75],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>

        {/* ── FLOWING CASCADE / FUNNELING CHANNELS ── */}
        <g id="funnel-streams">
          {/* Left funnel channel */}
          <motion.path
            d="M 198 186 C 182 208 160 218 152 240 C 142 268 174 278 184 308 C 196 342 160 376 142 410"
            stroke="url(#streamGrad2)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
          {/* Center-left crossover */}
          <motion.path
            d="M 218 190 C 205 220 236 242 230 270 C 222 305 168 335 186 385 C 194 406 210 424 218 450"
            stroke="#414242"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Center-right stream */}
          <motion.path
            d="M 234 190 C 248 214 280 230 274 260 C 265 300 220 318 238 360 C 248 384 272 400 276 430"
            stroke="url(#streamGrad1)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right wide loop */}
          <motion.path
            d="M 252 186 C 285 212 342 236 332 284 C 322 334 266 330 292 388 C 304 416 338 412 348 412"
            stroke="#00ae9d"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left outer branch to leaf */}
          <motion.path
            d="M 172 235 C 130 250 98 280 84 316 C 74 344 80 378 92 404"
            stroke="#414242"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ── CONSTELLATION INTERCONNECTING ARCS ── */}
        <g id="constellation-web" stroke="#b6ded8" strokeWidth="1.4" strokeDasharray="3 4">
          <line x1="88" y1="318" x2="148" y2="340" />
          <line x1="148" y1="340" x2="224" y2="310" />
          <line x1="224" y1="310" x2="294" y2="360" />
          <line x1="294" y1="360" x2="330" y2="305" />
          <line x1="330" y1="305" x2="356" y2="278" />
          <line x1="92" y1="406" x2="152" y2="444" />
          <line x1="152" y1="444" x2="220" y2="466" />
          <line x1="220" y1="466" x2="290" y2="448" />
          <line x1="290" y1="448" x2="348" y2="400" />
          <line x1="148" y1="340" x2="182" y2="416" />
        </g>

        {/* ── INTERCONNECTED DOMAIN ICONS & GLOWING NODES ── */}

        {/* 1. Leaf / Physical Growth (Top Left) */}
        <motion.g
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        >
          <circle cx="86" cy="316" r="16" fill="#d6edea" opacity="0.8" />
          <circle cx="86" cy="316" r="14" fill="#ffffff" stroke="#00ae9d" strokeWidth="1.8" />
          <path
            d="M 80 324 C 80 312 92 308 92 308 C 92 308 92 320 80 324 Z"
            stroke="#414242"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M 82 322 L 90 312" stroke="#00ae9d" strokeWidth="1.3" />
        </motion.g>

        {/* 2. Gear / Agency & Action (Middle Left) */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '92px 406px' }}
        >
          <circle cx="92" cy="406" r="15" fill="#e8f5f2" opacity="0.9" />
          <circle cx="92" cy="406" r="12" fill="#ffffff" stroke="#414242" strokeWidth="1.8" />
          <circle cx="92" cy="406" r="4" fill="none" stroke="#00ae9d" strokeWidth="1.5" />
          {/* Cog teeth */}
          <path d="M 92 390 L 92 394 M 92 418 L 92 422 M 76 406 L 80 406 M 104 406 L 108 406" stroke="#414242" strokeWidth="2.2" strokeLinecap="round" />
        </motion.g>

        {/* 3. People / Relationships (Upper Center-Left) */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <circle cx="150" cy="342" r="18" fill="#d6edea" opacity="0.85" />
          <circle cx="144" cy="336" r="4.5" fill="none" stroke="#414242" strokeWidth="1.8" />
          <circle cx="158" cy="336" r="4.5" fill="none" stroke="#00ae9d" strokeWidth="1.8" />
          <path d="M 136 348 C 137 344 141 343 147 344" stroke="#414242" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 153 344 C 158 343 164 344 166 348" stroke="#00ae9d" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* 4. Book / Intellectual (Bottom Left) */}
        <motion.g
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <circle cx="152" cy="444" r="17" fill="#f0faf7" opacity="0.95" />
          <rect x="139" y="434" width="26" height="20" rx="3" fill="#ffffff" stroke="#414242" strokeWidth="1.8" />
          <line x1="152" y1="434" x2="152" y2="454" stroke="#00ae9d" strokeWidth="1.8" />
          <path d="M 143 439 L 149 439 M 143 444 L 149 444 M 155 439 L 161 439 M 155 444 L 161 444" stroke="#8fa39e" strokeWidth="1.2" strokeLinecap="round" />
        </motion.g>

        {/* 5. Central Star / Meaning & Values (Center) */}
        <motion.g
          animate={{
            scale: [1, 1.12, 1],
            rotate: [0, 6, 0, -6, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '224px 310px' }}
        >
          <circle cx="224" cy="310" r="18" fill="#d6edea" opacity="0.9" />
          {/* Star polygon */}
          <path
            d="M 224 296 L 228 305 L 238 307 L 230 314 L 233 324 L 224 319 L 215 324 L 218 314 L 210 307 L 220 305 Z"
            fill="#ffffff"
            stroke="#00ae9d"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* 6. Key / Clarity & Insight (Bottom Center) */}
        <motion.g
          animate={{ y: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        >
          <circle cx="220" cy="466" r="16" fill="#e8f5f2" opacity="0.9" />
          <circle cx="220" cy="458" r="5" fill="#ffffff" stroke="#414242" strokeWidth="1.8" />
          <path d="M 220 463 L 220 476 M 220 471 L 224 471 M 220 475 L 225 475" stroke="#414242" strokeWidth="1.8" strokeLinecap="round" />
        </motion.g>

        {/* 7. Flame / Energy & Vitality (Center-Right) */}
        <motion.g
          animate={{
            scale: [1, 1.08, 1],
            y: [-2, 2, -2],
          }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{ transformOrigin: '294px 360px' }}
        >
          <circle cx="294" cy="360" r="18" fill="#d6edea" opacity="0.95" />
          <circle cx="294" cy="360" r="15" fill="#ffffff" stroke="#00ae9d" strokeWidth="1.8" />
          {/* Flame curve */}
          <path
            d="M 294 348 C 298 354 302 358 300 365 C 298 371 290 372 288 367 C 286 362 289 359 292 357 C 294 353 291 350 294 348 Z"
            fill="#d6edea"
            stroke="#00ae9d"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* 8. Clock / Rhythm & Sleep (Upper Right) */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          {/* Large Clock Face */}
          <circle cx="356" cy="278" r="32" fill="#f0faf7" stroke="#414242" strokeWidth="2" />
          {/* Minute tick markers */}
          <line x1="356" y1="250" x2="356" y2="254" stroke="#8fa39e" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="384" y1="278" x2="380" y2="278" stroke="#8fa39e" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="356" y1="306" x2="356" y2="302" stroke="#8fa39e" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="328" y1="278" x2="332" y2="278" stroke="#8fa39e" strokeWidth="1.8" strokeLinecap="round" />
          
          {/* Small offset clock badge */}
          <circle cx="330" cy="305" r="12" fill="#ffffff" stroke="#00ae9d" strokeWidth="1.8" />
          <path d="M 330 297 L 330 305 L 336 305" stroke="#00ae9d" strokeWidth="1.6" strokeLinecap="round" />

          {/* Clock Hands (Animated gentle tick rotation) */}
          <circle cx="356" cy="278" r="3" fill="#00ae9d" />
          {/* Hour hand */}
          <line x1="356" y1="278" x2="356" y2="262" stroke="#414242" strokeWidth="2.2" strokeLinecap="round" />
          {/* Minute hand with subtle motion */}
          <motion.line
            x1="356"
            y1="278"
            x2="373"
            y2="288"
            stroke="#00ae9d"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '356px 278px' }}
          />
        </motion.g>

        {/* 9. Cash / Financial (Right Mid-Lower) */}
        <motion.g
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
        >
          <circle cx="348" cy="400" r="16" fill="#d6edea" opacity="0.8" />
          <rect x="335" y="391" width="28" height="18" rx="4" fill="#ffffff" stroke="#414242" strokeWidth="1.8" />
          <circle cx="349" cy="400" r="4.5" fill="none" stroke="#00ae9d" strokeWidth="1.5" />
          <text x="346.5" y="403" fontSize="8" fontWeight="800" fill="#00ae9d" fontFamily="'Nunito', sans-serif">$</text>
        </motion.g>

        {/* 10. Question Mark / Inquiry (Bottom Right) */}
        <motion.g
          animate={{ y: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          <circle cx="290" cy="448" r="16" fill="#d6edea" opacity="0.85" />
          <path
            d="M 284 440 C 284 433 296 433 296 441 C 296 447 289 448 289 454"
            stroke="#414242"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="289" cy="460" r="1.6" fill="#414242" />
        </motion.g>

        {/* Floating Ambient Sparkles / Particles */}
        <motion.circle
          cx="110"
          cy="260"
          r="2.5"
          fill="#00ae9d"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="310"
          cy="220"
          r="3"
          fill="#80c26d"
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.circle
          cx="245"
          cy="400"
          r="2.5"
          fill="#00ae9d"
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>
    </div>
  )
}
