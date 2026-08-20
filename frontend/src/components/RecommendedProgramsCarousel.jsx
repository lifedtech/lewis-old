import { useRef, useState, useEffect } from 'react'

const RECOMMENDED_PROGRAMS = [
  {
    id: 'womens-wellbeing-59',
    title: "5-Day Women's Well-Being Program",
    tag: "Women's Health",
    duration: "5 Days / 4 Nights",
    location: "Ernakulam, India",
    image: "https://lifedhealth.com/storage/programs/59/5MiebKR6PF11tzkOKe5bbJ5CPjkQXrynSgmHMFVO.jpg",
    description: "Personalised residential Ayurvedic program addressing hormonal shifts, stress-driven imbalances, Abhyangam therapies, and pelvic wellbeing.",
    link: "https://lifedhealth.com/program/5-day-womens-well-being-program-59-7ni"
  },
  {
    id: 'mental-wellness-58',
    title: "7-Day Holistic Mental Wellness Program",
    tag: "Mental Wellbeing",
    duration: "7 Days / 6 Nights",
    location: "Ernakulam, India",
    image: "https://lifedhealth.com/storage/programs/58/RZhQkA4f5aaGCDqlNM9WdFZohh1DItDPKcNwYwFS.jpg",
    description: "Designed for chronic mental fatigue, disrupted sleep, and persistent anxiety. Daily Shirodhara regulates cortisol and restores nervous system balance.",
    link: "https://lifedhealth.com/program/7-day-holistic-mental-wellness-program-58-jst"
  },
  {
    id: 'ojas-renewal-57',
    title: "Ojas Renewal: 7-Day Reset for Digital Workers",
    tag: "Digital Detox",
    duration: "7 Days / 6 Nights",
    location: "Wayanad, India",
    image: "https://lifedhealth.com/storage/programs/57/YxSWHWKuuDwKvBKT9tbYfAsCUmR0Q62lUWMA3R1y.jpg",
    description: "Targeted Ayurvedic reset for neck strain, screen burnout, and cellular rejuvenation nestled in the Nilgiri Biosphere Reserve.",
    link: "https://lifedhealth.com/program/ojas-renewal-7-day-ayurvedic-reset-for-digital-workers-57-5wg"
  },
  {
    id: 'samya-retreat-55',
    title: "Samya: 7-Day Yoga, Culture & Nature Retreat",
    tag: "Yoga & Nature",
    duration: "7 Days / 6 Nights",
    location: "Munnar & Fort Kochi, India",
    image: "https://lifedhealth.com/storage/programs/55/nxl5CYzehL5uQFKC3mg8O3q7RTQDIQiNHfRf1fXm.jpg",
    description: "Intimate 10-person retreat blending daily Hatha yoga, pranayama, and slow living across tea-garden hills and coastal shores.",
    link: "https://lifedhealth.com/program/samya-7-day-yoga-culture-nature-retreat-55-oqs"
  },
  {
    id: 'forest-living-54',
    title: "Alternate Way of Living in a Forest Community",
    tag: "Conscious Living",
    duration: "7 Days / 6 Nights",
    location: "Puducherry, India",
    image: "https://lifedhealth.com/storage/programs/54/juel5bRPV1HNRWmHd9sBB9eIzo6nOqILTcM6VwJC.jpg",
    description: "Immersive residency focusing on childlike play, art, body movement, nature connection, and unlearning disconnect.",
    link: "https://lifedhealth.com/program/alternate-way-of-living-in-a-forest-community-54-w7p"
  },
  {
    id: 'restore-53',
    title: "5-Day Restore: Ayurvedic Balance & Recovery",
    tag: "Recovery & Balance",
    duration: "5 Days / 4 Nights",
    location: "Puducherry, India",
    image: "https://lifedhealth.com/storage/programs/53/pFxPEFQievvEygwsHzg6xpXIbhkpqBJ3mRXZt0c9.jpg",
    description: "Clinically grounded Ayurvedic recovery with 1:1 physician consultations, Shirodhara, warm oil treatments, and home protocols.",
    link: "https://lifedhealth.com/program/5-day-restore-ayurvedic-balance-recovery-program-53-fsv"
  }
]

export default function RecommendedProgramsCarousel() {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateScrollState = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    // Estimate active index based on scroll position
    const cardWidth = 320 + 20 // card width + gap
    const index = Math.round(scrollLeft / cardWidth)
    setActiveIndex(Math.min(Math.max(0, index), RECOMMENDED_PROGRAMS.length - 1))
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  const scrollByCards = (direction) => {
    if (!scrollRef.current) return
    const cardWidth = 340
    const scrollAmount = direction === 'next' ? cardWidth : -cardWidth
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const scrollToIndex = (idx) => {
    if (!scrollRef.current) return
    const cardWidth = 340
    scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' })
  }

  return (
    <div className="recommended-programs-section" style={{
      marginTop: '32px',
      marginBottom: '24px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '18px',
        padding: '0 4px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#00ae9d',
            background: 'rgba(0, 174, 157, 0.08)',
            padding: '4px 12px',
            borderRadius: '100px',
            marginBottom: '8px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            Tailored Experiences
          </div>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(20px, 2.5vw, 24px)',
            fontWeight: 800,
            color: 'var(--text, #111827)',
            margin: '0 0 4px 0',
            letterSpacing: '-0.02em'
          }}>
            Recommended Programs for You
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-mute, #6b7280)',
            margin: 0,
            fontWeight: 500
          }}>
            Handpicked wellness retreats and signature programs from LifeD Health to support your journey.
          </p>
        </div>

        {/* Controls Arrow Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => scrollByCards('prev')}
            disabled={!canScrollLeft}
            aria-label="Previous programs"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid rgba(0,0,0,0.1)',
              background: canScrollLeft ? '#ffffff' : 'rgba(0,0,0,0.03)',
              color: canScrollLeft ? '#111827' : '#9ca3af',
              cursor: canScrollLeft ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: canScrollLeft ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() => scrollByCards('next')}
            disabled={!canScrollRight}
            aria-label="Next programs"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid rgba(0,0,0,0.1)',
              background: canScrollRight ? '#ffffff' : 'rgba(0,0,0,0.03)',
              color: canScrollRight ? '#111827' : '#9ca3af',
              cursor: canScrollRight ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: canScrollRight ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div
        ref={scrollRef}
        className="recommended-programs-carousel-track"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          padding: '8px 4px 20px 4px',
          margin: '0 -4px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {RECOMMENDED_PROGRAMS.map((program) => (
          <div
            key={program.id}
            onClick={() => window.open(program.link, '_blank', 'noopener,noreferrer')}
            style={{
              flex: '0 0 320px',
              scrollSnapAlign: 'start',
              background: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid rgba(0,0,0,0.07)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
              position: 'relative'
            }}
            className="program-kpi-card"
          >
            {/* Image Banner Container */}
            <div style={{
              position: 'relative',
              height: '180px',
              width: '100%',
              overflow: 'hidden',
              background: '#f3f4f6'
            }}>
              <img
                src={program.image}
                alt={program.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                className="program-card-img"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)'
              }} />

              {/* Tag Pill */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#047857',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '100px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                letterSpacing: '0.02em'
              }}>
                {program.tag}
              </div>

              {/* Duration Pill */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                textShadow: '0 1px 3px rgba(0,0,0,0.6)'
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {program.duration}
              </div>
            </div>

            {/* Content Body */}
            <div style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'space-between'
            }}>
              <div>
                {/* Location */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: '#00ae9d',
                  fontWeight: 600,
                  marginBottom: '6px'
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {program.location}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 8px 0',
                  lineHeight: '1.35',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {program.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '13px',
                  color: '#4b5563',
                  lineHeight: '1.5',
                  margin: '0 0 16px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {program.description}
                </p>
              </div>

              {/* Action Button Footer */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid rgba(0, 174, 157, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#00ae9d',
                fontWeight: 700,
                fontSize: '13.5px'
              }}>
                <span>Explore Program</span>
                <span className="program-card-arrow" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 174, 157, 0.08)',
                  transition: 'transform 0.25s ease, background 0.25s ease'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        marginTop: '8px'
      }}>
        {RECOMMENDED_PROGRAMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: activeIndex === idx ? '20px' : '7px',
              height: '7px',
              borderRadius: '100px',
              background: activeIndex === idx ? '#00ae9d' : 'rgba(0,0,0,0.15)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      <style>{`
        .recommended-programs-carousel-track::-webkit-scrollbar {
          display: none;
        }
        .program-kpi-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 30px rgba(0, 174, 157, 0.12);
          border-color: rgba(0, 174, 157, 0.3);
        }
        .program-kpi-card:hover .program-card-img {
          transform: scale(1.06);
        }
        .program-kpi-card:hover .program-card-arrow {
          transform: translate(2px, -2px);
          background: #00ae9d;
          color: #ffffff;
        }
        @media print {
          .recommended-programs-section {
            display: none !important;
          }
        }
        body.ir-printing .recommended-programs-section {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
