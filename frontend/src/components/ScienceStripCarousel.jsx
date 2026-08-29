import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TEAL = '#00ae9d'
const DARK_TEAL = '#017a6f'
const INK = '#252626'
const MUTED = '#657370'

const FRAMEWORK_ITEMS = [
  {
    dimension: 'OVERALL WELLBEING',
    name: 'WHO‑5 Well‑Being Index',
    kind: 'scale',
    icon: 'gauge',
    desc: 'World Health Organization validated index for vitality & general wellbeing.'
  },
  {
    dimension: 'EMOTIONAL & MENTAL',
    name: 'Perceived Stress Scale, PSS‑10',
    kind: 'scale',
    icon: 'brain',
    desc: 'Classic psychometric instrument measuring perceived cognitive & emotional load.'
  },
  {
    dimension: 'RELATIONSHIPS & SOCIAL',
    name: 'UCLA 3‑Item Loneliness Scale',
    kind: 'scale',
    icon: 'users',
    desc: 'Established standard for relational connectedness and perceived social support.'
  },
  {
    dimension: 'MEANING & SPIRITUAL',
    name: 'PROMIS Meaning & Purpose, 4‑item',
    kind: 'scale',
    icon: 'compass',
    desc: 'NIH-validated self-report metric for personal direction and purpose in daily life.'
  },
  {
    dimension: 'FINANCIAL WELLNESS',
    name: 'CFPB Financial Well‑Being Scale, 5‑item',
    kind: 'scale',
    icon: 'wallet',
    desc: 'Validated benchmark for subjective financial confidence and stress resilience.'
  },
  {
    dimension: 'INTELLECTUAL & GROWTH',
    name: 'Diener Flourishing Scale, 8‑item',
    kind: 'scale',
    icon: 'sprout',
    desc: 'Psychological flourishing measure covering competence, optimism and curiosity.'
  },
  {
    dimension: 'ENVIRONMENTAL & CULTURAL',
    name: 'Inclusion of Nature in Self',
    kind: 'scale',
    icon: 'mountain',
    desc: 'Visual validated metric evaluating connection to physical environment & space.'
  },
  {
    dimension: 'PHYSICAL & REGENERATION',
    name: 'Composite Somatic Inventory',
    kind: 'scale',
    icon: 'refresh',
    desc: 'Sleep architecture, recovery cycles, rest depth and somatic vitality.'
  },
  {
    dimension: 'EMOTIONAL STATE',
    name: 'Circumplex Model of Affect',
    kind: 'framework',
    icon: 'circle-dot',
    desc: 'Russell dimensional model evaluating momentary valence and autonomic arousal.'
  },
  {
    dimension: 'BODY',
    name: 'Interactive Somatic Body Mapping',
    kind: 'framework',
    icon: 'person',
    desc: 'Spatial topography mapping of localized physical tension and energy.'
  },
  {
    dimension: 'NERVOUS SYSTEM',
    name: 'Autonomic Nervous System State',
    kind: 'framework',
    icon: 'activity',
    desc: 'Polyvagal-informed self-reflection across ventral, sympathetic and dorsal states.'
  },
  {
    dimension: 'REGULATION',
    name: 'Paced Slow Resonant Breathing',
    kind: 'framework',
    icon: 'wind',
    desc: 'Real-time guided 1-minute vagal pacing task measuring regulation response.'
  },
  {
    dimension: 'MOTIVATION',
    name: 'Delay Discounting & Agency Choice',
    kind: 'framework',
    icon: 'clock',
    desc: 'Behavioural economics choice paradigm assessing present vs future trade-offs.'
  }
]

function CarouselIcon({ name, size = 20, color = 'currentColor' }) {
  switch (name) {
    case 'gauge':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
      )
    case 'brain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M12 5v13" />
        </svg>
      )
    case 'users':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'compass':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    case 'wallet':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      )
    case 'sprout':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-13" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
        </svg>
      )
    case 'mountain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      )
    case 'refresh':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
        </svg>
      )
    case 'circle-dot':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" />
        </svg>
      )
    case 'person':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" /><path d="m9 20 3-6 3 6" /><path d="m6 8 6 2 6-2" /><path d="M12 10v4" />
        </svg>
      )
    case 'activity':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    case 'wind':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
        </svg>
      )
    case 'clock':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      )
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

export default function ScienceStripCarousel({ onExploreMethodology }) {
  const railRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = railRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = railRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction) => {
    const el = railRef.current
    if (!el) return
    const scrollAmount = direction * (el.clientWidth * 0.75)
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section style={{
      width: '100%',
      background: 'linear-gradient(180deg, #f8fbfb 0%, #ffffff 100%)',
      borderTop: '1px solid rgba(0, 174, 157, 0.12)',
      borderBottom: '1px solid rgba(0, 174, 157, 0.12)',
      padding: 'clamp(32px, 4vw, 52px) 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Container Header */}
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '0 clamp(16px, 3.5vw, 32px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '24px',
        flexWrap: 'wrap',
        marginBottom: '22px',
      }}>
        <div style={{ maxWidth: '640px' }}>
          <span style={{
            display: 'inline-block',
            fontWeight: 800,
            fontSize: '12.5px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: TEAL,
            marginBottom: '6px',
            fontFamily: "'Nunito', sans-serif",
          }}>
            RESEARCH-INFORMED FRAMEWORK
          </span>
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(20px, 2.4vw, 28px)',
            fontWeight: 800,
            color: '#1e293b',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            fontFamily: "'Nunito', sans-serif",
          }}>
            Validated measures, peer-reviewed tools and research
          </h2>
        </div>

        {/* Carousel Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontWeight: 700,
            fontSize: '11.5px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#85918e',
            fontFamily: "'Nunito', sans-serif",
            marginRight: '4px',
          }}>
            {FRAMEWORK_ITEMS.length} Domains & Scales
          </span>

          <motion.button
            type="button"
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            whileHover={canScrollLeft ? { scale: 1.06 } : {}}
            whileTap={canScrollLeft ? { scale: 0.94 } : {}}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid #dcdcdc',
              background: '#ffffff',
              color: canScrollLeft ? INK : '#c5c5c5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'default',
              opacity: canScrollLeft ? 1 : 0.45,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>

          <motion.button
            type="button"
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            whileHover={canScrollRight ? { scale: 1.06 } : {}}
            whileTap={canScrollRight ? { scale: 0.94 } : {}}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid #dcdcdc',
              background: '#ffffff',
              color: canScrollRight ? INK : '#c5c5c5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'default',
              opacity: canScrollRight ? 1 : 0.45,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Horizontal Carousel Rail */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          ref={railRef}
          className="sci-rail"
          style={{
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            padding: '8px 0 16px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div style={{
            display: 'flex',
            gap: '16px',
            padding: '0 clamp(16px, 3.5vw, 32px)',
            width: 'max-content',
          }}>
            {FRAMEWORK_ITEMS.map((item, idx) => (
              <motion.article
                key={idx}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0, 174, 157, 0.12)', borderColor: '#8fe1d7' }}
                style={{
                  flex: '0 0 auto',
                  width: '210px',
                  minHeight: '230px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  padding: '20px 18px',
                  borderRadius: '18px',
                  border: '1.2px solid #e7ecea',
                  background: '#ffffff',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxSizing: 'border-box',
                  cursor: 'default',
                }}
              >
                <div>
                  {/* Icon Circle */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.kind === 'framework' ? 'rgba(0, 174, 157, 0.14)' : '#eaf7f5',
                    color: TEAL,
                    marginBottom: '14px',
                  }}>
                    <CarouselIcon name={item.icon} size={20} color={TEAL} />
                  </div>

                  {/* Dimension & Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '10px',
                      lineHeight: 1.3,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: TEAL,
                      fontFamily: "'Nunito', sans-serif",
                    }}>
                      {item.dimension}
                    </span>
                    <h4 style={{
                      margin: 0,
                      fontWeight: 800,
                      fontSize: '15px',
                      lineHeight: 1.3,
                      color: INK,
                      fontFamily: "'Nunito', sans-serif",
                    }}>
                      {item.name}
                    </h4>
                  </div>
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: 1.45,
                  color: MUTED,
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  {item.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Link */}
      {onExploreMethodology && (
        <div style={{
          maxWidth: '1180px',
          margin: '18px auto 0',
          padding: '0 clamp(16px, 3.5vw, 32px)',
        }}>
          <button
            onClick={onExploreMethodology}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '14px',
              color: TEAL,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              fontFamily: "'Nunito', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = DARK_TEAL)}
            onMouseLeave={(e) => (e.currentTarget.style.color = TEAL)}
          >
            <span>Explore the full 9-domain science methodology</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
