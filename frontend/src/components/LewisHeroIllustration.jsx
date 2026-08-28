import React, { useState } from 'react'
import { motion } from 'framer-motion'

const DOMAINS = [
  {
    id: 'ac',
    name: 'Accomplishment & Agency',
    desc: 'Confidence & follow-through',
    initialAngle: -90,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M3.4 19.6h4.6V15h4.6v-4.6h4.6V5.8h3.4" />
      </g>
    ),
  },
  {
    id: 'ec',
    name: 'Environmental & Cultural',
    desc: 'Belonging & surroundings',
    initialAngle: -50,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M4.6 19.8V12a7.4 7.4 0 0 1 14.8 0v7.8" />
        <path d="M2.4 19.8h19.2" />
        <path d="M9.9 19.8v-4.2a2.1 2.1 0 0 1 4.2 0v4.2" />
      </g>
    ),
  },
  {
    id: 'em',
    name: 'Emotional & Mental',
    desc: 'Pressure, mood & steadiness',
    initialAngle: -10,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M3.4 7.6q2.65-2.8 5.3 0t5.3 0 5.3 0" />
        <path d="M3.4 13q2.65-1.9 5.3 0t5.3 0 5.3 0" />
        <path d="M3.4 18.1q2.65-1 5.3 0t5.3 0 5.3 0" />
      </g>
    ),
  },
  {
    id: 'en',
    name: 'Engagement & Energy',
    desc: 'Vitality, interest & focus',
    initialAngle: 30,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M3.2 19.4C9 19 14 16 20 5" />
        <path d="M15.7 7.6 20 5l.1 5" />
      </g>
    ),
  },
  {
    id: 'fw',
    name: 'Financial Wellness',
    desc: 'Relationship with resources',
    initialAngle: 70,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M4.4 9.4h15.2v6.6a4.8 4.8 0 0 1-4.8 4.8H9.2a4.8 4.8 0 0 1-4.8-4.8Z" />
        <path d="M8.6 9.4V7a3.4 3.4 0 0 1 6.8 0v2.4" />
      </g>
    ),
  },
  {
    id: 'ig',
    name: 'Intellectual & Growth',
    desc: 'Curiosity & room to grow',
    initialAngle: 110,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M12 7.6v12.5" />
        <path d="M12 7.6C10.4 6 8 5.2 5.2 5.2H3v12.4h2.2c2.8 0 5.2.8 6.8 2.5" />
        <path d="M12 7.6c1.6-1.6 4-2.4 6.8-2.4H21v12.4h-2.2c-2.8 0-5.2.8-6.8 2.5" />
      </g>
    ),
  },
  {
    id: 'ms',
    name: 'Meaning & Spiritual',
    desc: 'Values & what matters',
    initialAngle: 150,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M12 2.6c1.1 6.1 3.3 8.3 9.4 9.4-6.1 1.1-8.3 3.3-9.4 9.4-1.1-6.1-3.3-8.3-9.4-9.4 6.1-1.1 8.3-3.3 9.4-9.4Z" />
      </g>
    ),
  },
  {
    id: 'ph',
    name: 'Physical & Regeneration',
    desc: 'Sleep, rest & recovery',
    initialAngle: 190,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <path d="M3 12.5h4.2l2.3 5.4 3.6-11.6 2.4 6.2H21" />
      </g>
    ),
  },
  {
    id: 'rs',
    name: 'Relationships & Social',
    desc: 'Connection & community',
    initialAngle: 230,
    path: (
      <g stroke="#017a6f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(12, 12)">
        <circle cx="9" cy="12" r="5.9" fill="none" />
        <circle cx="15" cy="12" r="5.9" fill="none" />
      </g>
    ),
  },
]

export default function LewisHeroIllustration() {
  const [hoveredDomain, setHoveredDomain] = useState(null)

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient background soft radial glow */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '40px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 174, 157, 0.16) 0%, rgba(214, 237, 234, 0.12) 55%, transparent 75%)',
          filter: 'blur(36px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="446"
        height="580"
        viewBox="0 0 446 580"
        role="img"
        aria-label="Person in center with 9 LEWIS domain icons orbiting slowly around them"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '560px',
          position: 'relative',
          zIndex: 1,
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id="orbitStroke" x1="42" y1="60" x2="404" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C7D2E1" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#00ae9d" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#C7D2E1" stopOpacity="0.45" />
          </linearGradient>

          <filter id="iconGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#00ae9d" floodOpacity="0.22" />
          </filter>
        </defs>

        <style>{`
          .orbit-line {
            fill: none;
            stroke: url(#orbitStroke);
            stroke-width: 1.8;
            stroke-dasharray: 3 11;
            stroke-linecap: round;
          }
          .inner-ring {
            fill: none;
            stroke: #eaf7f5;
            stroke-width: 1.5;
            opacity: 0.75;
          }
          .icon-node {
            cursor: pointer;
            transition: transform 0.25s ease, filter 0.25s ease;
          }
          .icon-node:hover {
            filter: drop-shadow(0 4px 10px rgba(0, 174, 157, 0.35));
          }
          @media (prefers-reduced-motion: reduce) {
            animateTransform {
              display: none;
            }
          }
        `}</style>

        {/* Outer dashed orbit line */}
        <circle className="orbit-line" cx="223" cy="240" r="172" />

        {/* Inner circle behind person */}
        <circle className="inner-ring" cx="223" cy="240" r="118" />

        {/* Center Person Image with gentle breathing animation */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <image
            id="personImage"
            href="/lewis-svg/no-bg-image.png"
            xlinkHref="/lewis-svg/no-bg-image.png"
            x="15"
            y="52"
            width="410"
            height="530"
            preserveAspectRatio="xMidYMax meet"
          />
        </motion.g>

        {/* 9 Orbiting Lewis Domain Leaf Icons */}
        {DOMAINS.map((domain) => (
          <g key={domain.id} transform={`rotate(${domain.initialAngle} 223 240)`}>
            <g>
              {/* 360-degree continuous orbital rotation */}
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 223 240"
                to="360 223 240"
                dur="55s"
                repeatCount="indefinite"
              />

              {/* Translate to orbit perimeter */}
              <g transform="translate(223, 68)">
                <g transform={`rotate(${-domain.initialAngle})`}>
                  <g>
                    {/* Inverse rotation to keep icon upright */}
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to="-360 0 0"
                      dur="55s"
                      repeatCount="indefinite"
                    />

                    {/* Interactive Leaf Node */}
                    <g
                      className="icon-node"
                      onMouseEnter={() => setHoveredDomain(domain)}
                      onMouseLeave={() => setHoveredDomain(null)}
                    >
                      {/* Leaf background container */}
                      <g transform="translate(-24, -24)" filter="url(#iconGlow)">
                        <path
                          d="M2 46V18C2 9.2 9.2 2 18 2h28v28c0 8.8-7.2 16-16 16Z"
                          fill="#eaf7f5"
                          stroke="rgba(0, 174, 157, 0.3)"
                          strokeWidth="1.2"
                        />
                        {domain.path}
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        ))}
      </svg>

      {/* Dynamic Active Domain Label Badge on Hover */}
      <div
        style={{
          minHeight: '26px',
          marginTop: '-12px',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hoveredDomain ? (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(0, 174, 157, 0.35)',
              boxShadow: '0 4px 14px rgba(0, 174, 157, 0.12)',
              fontSize: '12px',
              fontWeight: 800,
              color: '#007064',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <span>🌿</span>
            <span>{hoveredDomain.name}</span>
          </motion.span>
        ) : (
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#8fa39e',
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: '0.04em',
            }}
          >
            Nine connected domains of everyday wellbeing
          </span>
        )}
      </div>
    </div>
  )
}
