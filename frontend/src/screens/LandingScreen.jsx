import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import Icon from '../report/icons.jsx'
import './landing.css'

const DOMAINS = [
  { name: 'Sleep & Recovery', field: 'Chronobiology', iconKey: 'moon', icon: '🌙', tag: 'Rest quality, rhythm and restoration.', score: 62, desc: 'How well your body repairs itself. LEWIS looks at sleep duration, consistency and how recovered you actually feel — the domain that quietly powers every other one.' },
  { name: 'Nutrition', field: 'Metabolic science', iconKey: 'utensils', icon: '🥗', tag: 'What fuels you, and how it lands.', score: 74, desc: 'Not diets — patterns. LEWIS maps eating rhythm, quality and relationship with food against what metabolic research says sustains energy and mood.' },
  { name: 'Movement', field: 'Exercise physiology', iconKey: 'activity', icon: '🏃', tag: 'Activity, strength and daily motion.', score: 81, desc: 'From structured training to everyday motion. LEWIS measures whether your week gives your body the stimulus it is built to expect.' },
  { name: 'Stress & Resilience', field: 'Psychoneuroimmunology', iconKey: 'wind', icon: '🛡️', tag: 'Load, recovery and coping capacity.', score: 58, desc: 'Stress is not the enemy — unrecovered stress is. LEWIS tracks your load against your capacity to bounce back.' },
  { name: 'Emotional Balance', field: 'Affective science', iconKey: 'scale', icon: '🪞', tag: 'Mood, regulation and self-awareness.', score: 77, desc: 'How you feel, how often, and how well you can name and steer it. Emotional granularity is one of the strongest predictors of long-term wellbeing.' },
  { name: 'Cognitive Health', field: 'Neuroscience', iconKey: 'brain', icon: '🧠', tag: 'Focus, clarity and mental energy.', score: 79, desc: 'Attention, memory and mental stamina. LEWIS detects the early signature of cognitive strain long before burnout does.' },
  { name: 'Social Connection', field: 'Social epidemiology', iconKey: 'users', icon: '🤝', tag: 'Relationships and belonging.', score: 84, desc: 'The strongest longevity predictor we know. LEWIS assesses the depth, not just the count, of your connections.' },
  { name: 'Purpose & Meaning', field: 'Existential psychology', iconKey: 'compass', icon: '🧭', tag: 'Direction, values and motivation.', score: 71, desc: 'A felt sense of "why". People with clear purpose recover faster, sleep better and live longer — LEWIS measures how anchored yours is.' },
  { name: 'Environment', field: 'Environmental health', iconKey: 'trees', icon: '🌿', tag: 'Spaces, light, nature and noise.', score: 68, desc: 'Where you live and work shapes your biology daily. LEWIS evaluates light exposure, nature contact, noise and the spaces you spend your hours in.' }
];

export default function LandingScreen() {
  const { setScreen } = useLewisStore()
  const [active, setActive] = useState(0)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', topic: 'General Inquiry' })
  const revealRefs = useRef([])

  const handleNext = (e) => {
    if (e) e.preventDefault()
    setScreen('preStage0Age')
  }

  const scrollTo = (e, id) => {
    if (e) e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleContactSubmit = (e) => {
    if (e) e.preventDefault()
    if (contactForm.name && contactForm.email && contactForm.message) {
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        setContactSubmitted(true)
      }, 500)
    }
  }

  const [headerOpacity, setHeaderOpacity] = useState(1)
  const [headerY, setHeaderY] = useState(0)

  useEffect(() => {
    const wrapper = document.querySelector('.landing-screen-wrapper')

    const handleScroll = () => {
      const scrollTop = wrapper ? wrapper.scrollTop : (window.scrollY || 0)
      // Fade out header smoothly over first 160px of scroll
      const opacity = Math.max(0, 1 - scrollTop / 160)
      // Translate header upward along with scroll
      const translateY = -Math.min(60, scrollTop * 0.4)

      setHeaderOpacity(opacity)
      setHeaderY(translateY)
    }

    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      if (wrapper) wrapper.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const container = document.querySelector('.landing-screen-wrapper')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      })
    }, { root: container || null, threshold: 0.1 })

    revealRefs.current.forEach((el) => {
      if (el) io.observe(el)
    })

    return () => io.disconnect()
  }, [])


  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  const score = 76
  const scoreDeg = `${(score * 3.6)}deg`

  const activeDomain = active != null ? DOMAINS[active] : null

  return (
    <motion.div
      className="landing-screen-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Premium Luminescent Ambient Background Layers */}
      <div className="bg-ambient-orb-1" />
      <div className="bg-ambient-orb-2" />
      <div className="bg-dot-grid" />

      {/* TOP NAVIGATION HEADER */}
      <header data-screen-label="Nav" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'transparent',
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        pointerEvents: headerOpacity < 0.05 ? 'none' : 'auto',
        transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
      }}>
        {/* Brand Emblem */}
        <LewisLogo size={34} showText={true} />

        {/* Header Right Nav */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: "'Nunito', sans-serif",
            color: '#00ae9d',
            letterSpacing: '0.02em'
          }}>
            Wellbeing Intelligence by Lifed
          </span>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="top" data-screen-label="Hero" style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          gap: '36px'
        }}>
          {/* Left-Aligned Main Text Content Block */}
          <div style={{ flex: '1 1 560px', maxWidth: '680px', textAlign: 'left' }}>
            {/* Eyebrow with left accent line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span style={{ width: '28px', height: '2px', background: '#00ae9d', display: 'inline-block', opacity: 0.8 }} />
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.18em', color: '#00ae9d', textTransform: 'uppercase' }}>
                WELLBEING INTELLIGENCE
              </span>
            </div>

            {/* Main LEWIS Title */}
            <h1 className="hero-lewis-title" style={{ fontSize: 'clamp(64px, 7.5vw, 105px)', color: '#000000', margin: '0 0 12px 0', textAlign: 'left', width: '100%', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.02em' }}>
              LEWIS
            </h1>

            {/* Left Aligned Subtitle */}
            <h2 style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 'clamp(22px, 2.6vw, 32px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: '0 0 20px 0',
              textAlign: 'left',
              width: '100%',
            }}>
              <span style={{ fontWeight: 400, color: '#414242' }}>wellbeing </span>
              <span style={{ fontWeight: 800, color: '#414242' }}>made intelligent</span>
            </h2>

            {/* Left Aligned Description */}
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              color: '#414242',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: 0,
              textAlign: 'left'
            }}>
              Answer a few gentle questions. LEWIS reads the signals your body
              and life already produce, and turns them into <strong style={{ color: '#00ae9d', fontWeight: 700 }}>one living picture of you</strong>.
            </p>
          </div>

          {/* Right Side Action Button */}
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              className="landing-primary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: '#00ae9d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '18px 42px',
                fontSize: '17px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                boxShadow: '0 10px 28px rgba(0, 174, 157, 0.3)',
                cursor: 'pointer',
              }}
            >
              Let's begin <span style={{ fontSize: '19px' }}>→</span>
            </button>
          </div>
        </div>

        {/* Hero Bottom Bar Info Pills */}
        <div style={{
          marginTop: 'auto',
          width: '100%',
          maxWidth: '1100px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          paddingTop: '40px',
          zIndex: 2,
        }}>
          <div style={{
            background: 'rgba(0, 174, 157, 0.10)',
            border: '1.5px solid rgba(0, 174, 157, 0.4)',
            borderRadius: '16px',
            padding: '12px 20px',
            maxWidth: '360px',
            boxShadow: '0 6px 20px rgba(0, 174, 157, 0.08)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '4px', fontFamily: '"Nunito", sans-serif' }}>
              WELLBEING INTELLIGENCE
            </div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#252626' }}>
              Nine scientific domains, one living picture of you.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a href="#domains" onClick={(e) => scrollTo(e, 'domains')} className="landing-domain-btn">
              9 Domains
            </a>
            <a href="#how" onClick={(e) => scrollTo(e, 'how')} className="landing-domain-btn">
              Science-backed
            </a>
            <a href="#report" onClick={(e) => scrollTo(e, 'report')} className="landing-domain-btn">
              Adaptive
            </a>
            <span className="landing-domain-btn">
              Non-clinical
            </span>
          </div>
        </div>
      </section>

      {/* Infinite Domain Marquee Ticker Scroller */}
      <div className="landing-marquee-container">
        <div className="landing-marquee-track">
          {[...DOMAINS, ...DOMAINS, ...DOMAINS].map((d, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 700, color: '#414242', fontFamily: "'Nunito', sans-serif" }}>
              <span>{d.name}</span>
              <span style={{ color: '#00ae9d', fontSize: '11px', margin: '0 8px' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 01 — THE NINE DOMAINS */}
      <section id="domains" data-screen-label="Domains" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw 80px', background: 'transparent' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '44px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '10px', fontFamily: '"Nunito", sans-serif' }}>
              [ 01 ] THE NINE DOMAINS
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 50px)', fontFamily: "'Nunito', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', color: '#414242', lineHeight: 1.08, maxWidth: '640px' }}>
              One score is a lie.<br />Nine tell the truth.
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: '360px', fontSize: '14.5px', lineHeight: 1.6, color: '#414242' }}>
            Every domain is grounded in peer-reviewed science. Together they map the full terrain of how you're really doing. Select any card to explore.
          </p>
        </div>

        {/* 9 Interactive Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {DOMAINS.map((d, i) => {
            const isSelected = active === i
            return (
              <div
                key={i}
                ref={addToRefs}
                onClick={() => setActive(i)}
                className="landing-reveal-element landing-domain-card"
                style={{
                  position: 'relative',
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: isSelected ? '2px solid #00ae9d' : '1.5px solid #f4f4f4',
                  borderRadius: '20px',
                  padding: '24px 22px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 12px 32px rgba(0,174,157,0.15)' : '0 4px 14px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: isSelected ? '#00ae9d' : '#eaf7f5',
                    color: isSelected ? '#ffffff' : '#017a6f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(0,174,157,0.3)' : 'none'
                  }}>
                    <Icon name={d.iconKey} size={20} />
                  </div>
                  <span style={{ fontSize: '10.5px', fontFamily: '"Nunito", sans-serif', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? '#00ae9d' : '#414242' }}>
                    {d.field}
                  </span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", color: '#414242', marginBottom: '6px' }}>
                  {d.name}
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#414242' }}>
                  {d.tag}
                </div>
              </div>
            )
          })}
        </div>

        {/* Dynamic Domain Details Drawer */}
        {activeDomain && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              marginTop: '28px',
              background: 'rgba(0, 174, 157, 0.10)',
              color: '#414242',
              borderRadius: '24px',
              padding: '30px 34px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '28px',
              boxShadow: '0 8px 24px rgba(0, 174, 157, 0.08)',
              border: '1px solid rgba(0, 174, 157, 0.25)',
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '8px', fontFamily: '"Nunito", sans-serif', fontWeight: 800 }}>
                DOMAIN 0{active + 1} / 09 · {activeDomain.field}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", color: '#008e82', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffffff', color: '#00ae9d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0, 174, 157, 0.12)' }}>
                  <Icon name={activeDomain?.iconKey || 'sparkles'} size={20} />
                </div>
                {activeDomain.name}
              </div>
              <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: 'rgba(0, 70, 60, 0.82)', maxWidth: '580px' }}>
                {activeDomain.desc}
              </p>
            </div>

            <div style={{ minWidth: '240px', flex: '0 0 auto', background: '#ffffff', borderRadius: '18px', padding: '20px 22px', border: '1.5px solid rgba(0, 174, 157, 0.2)', boxShadow: '0 4px 16px rgba(0, 174, 157, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#414242', fontWeight: 700, marginBottom: '10px' }}>
                <span>Benchmark Score</span>
                <span style={{ color: '#00ae9d', fontWeight: 800 }}>{activeDomain.score} / 100</span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(0, 174, 157, 0.15)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: '#00ae9d', width: `${activeDomain.score}%`, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ marginTop: '12px', fontSize: '11.5px', color: 'rgba(65, 66, 66, 0.55)', fontStyle: 'italic' }}>
                Analyzed via LEWIS Adaptive Engine
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* SECTION 02 — HOW LEWIS WORKS */}
      <section id="how" data-screen-label="How it works" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw', background: 'transparent' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '12px', fontFamily: '"Nunito", sans-serif' }}>
          [ 02 ] HOW LEWIS WORKS
        </div>
        <h2 ref={addToRefs} className="landing-reveal-element" style={{ margin: '0 0 16px 0', fontSize: 'clamp(30px, 3.8vw, 48px)', fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#414242', letterSpacing: '-0.03em' }}>
          Intelligence, not averages.
        </h2>
        <p ref={addToRefs} className="landing-reveal-element" style={{ margin: '0 0 32px 0', maxWidth: '640px', fontSize: '15.5px', lineHeight: 1.6, color: '#414242' }}>
          Answer a few gentle questions. LEWIS translates your life signals into one clear, actionable picture of your wellbeing.
        </p>

        {/* System Brief Overview Banner */}
        <div ref={addToRefs} className="landing-reveal-element" style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(0, 174, 157, 0.25)',
          borderRadius: '22px',
          padding: '24px 28px',
          marginBottom: '36px',
          boxShadow: '0 8px 24px rgba(0, 174, 157, 0.06)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '18px',
        }}>
          <div style={{
            fontSize: '24px',
            background: 'rgba(0, 174, 157, 0.1)',
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ae9d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg></div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#00ae9d', fontFamily: '"Nunito", sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
              LEWIS SYSTEM OVERVIEW BRIEF
            </div>
            <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65, color: '#414242' }}>
              LEWIS (The Lifed Everyday Wellbeing Intelligence System) evaluates your responses across 9 validated scientific life dimensions using standardized scales like WHO-5 and PSS-10. Instead of giving generic advice, LEWIS uses a deterministic cross-domain influence matrix to calculate where a single micro-habit creates the largest positive ripple effect across your health, mood, and resilience.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div ref={addToRefs} className="landing-reveal-element" style={{ background: 'rgba(255, 255, 255, 0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(0, 174, 157, 0.2)', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)', borderRadius: '22px', padding: '30px 26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#00ae9d', marginBottom: '16px', fontFamily: "'Nunito', sans-serif" }}>01 — LISTEN</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", color: '#414242', marginBottom: '10px' }}>An assessment that fits your day</div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#414242' }}>
              Validated questions across all nine domains — choose a 3–5 minute reflection or the full deep dive. No wearables required.
            </p>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ background: 'rgba(255, 255, 255, 0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(0, 174, 157, 0.2)', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)', borderRadius: '22px', padding: '30px 26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#00ae9d', marginBottom: '16px', fontFamily: "'Nunito', sans-serif" }}>02 — ANALYZE</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", color: '#414242', marginBottom: '10px' }}>Cross-domain intelligence</div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#414242' }}>
              LEWIS weighs how your domains interact — because sleep debt shows up in mood, and stress impacts every single domain.
            </p>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ background: 'rgba(255, 255, 255, 0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(0, 174, 157, 0.2)', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)', borderRadius: '22px', padding: '30px 26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#00ae9d', marginBottom: '16px', fontFamily: "'Nunito', sans-serif" }}>03 — GUIDE</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", color: '#414242', marginBottom: '10px' }}>A report that acts</div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#414242' }}>
              Your report ranks what to change first, and adapts continuously every time you check back in.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 03 — YOUR WELLBEING REPORT */}
      <section id="report" data-screen-label="Why LEWIS" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw', background: 'transparent' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '48px' }}>

          <div ref={addToRefs} className="landing-reveal-element" style={{ flex: 1, minWidth: '300px', maxWidth: '520px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '12px', fontFamily: '"Nunito", sans-serif' }}>
              [ 03 ] YOUR WELLBEING REPORT
            </div>
            <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(32px, 3.8vw, 48px)', fontFamily: "'Nunito', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', color: '#414242', lineHeight: 1.08 }}>
              Nine signals.<br />One honest number.
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: '15px', lineHeight: 1.65, color: '#414242' }}>
              Your LEWIS Score distills all nine domains into a single trajectory you can actually move — showing you exactly which habit unlocks the biggest impact.
            </p>
            <a href="#begin" onClick={handleNext} className="landing-primary-btn" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#00ae9d',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '15px 34px',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: '0 10px 28px rgba(0, 174, 157, 0.3)',
              cursor: 'pointer',
            }}>
              Start your assessment <span style={{ fontSize: '17px' }}>→</span>
            </a>
          </div>

          {/* Interactive Score Ticker Card */}
          <div ref={addToRefs} className="landing-reveal-element" style={{
            flex: '0 1 480px',
            minWidth: '320px',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(0, 174, 157, 0.2)',
            borderRadius: '26px',
            padding: '32px 30px',
            boxShadow: '0 20px 50px rgba(0, 80, 70, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#414242' }}>Wellbeing Report</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#00ae9d', fontFamily: '"IBM Plex Mono", monospace' }}>LIVE PREVIEW</div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                flex: 'none',
                borderRadius: '50%',
                background: `conic-gradient(#00ae9d ${scoreDeg}, #f4f4f4 0)`,
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 16px rgba(0,174,157,0.15)',
              }}>
                <div style={{ width: '92px', height: '92px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <div style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', color: '#414242', lineHeight: 1, fontFamily: "'Manrope', sans-serif" }}>
                    {score}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#414242', marginTop: '4px', fontFamily: '"IBM Plex Mono", monospace' }}>
                    LEWIS score
                  </div>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: '#414242' }}>
                Solid foundation. Your primary opportunity right now is <strong style={{ color: '#00ae9d', fontWeight: 700 }}>Sleep &amp; Recovery</strong> — small improvements there directly elevate three other domains.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {DOMAINS.map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 34px', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#414242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d.icon} {d.name}
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', background: '#f0f4f2', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #00ae9d, #5fbb46)', width: `${d.score}%` }} />
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#414242', textAlign: 'right', fontFamily: '"IBM Plex Mono", monospace' }}>
                    {d.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION — CONTACT US / SUPPORT */}
      <section id="contact" data-screen-label="Contact Us" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw', background: 'transparent' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '48px', maxWidth: '1100px', margin: '0 auto' }}>

          {/* Left Column: Left-Aligned Title and Information */}
          <div style={{ flex: '1 1 340px', maxWidth: '460px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '14px', fontFamily: '"Nunito", sans-serif' }}>
              [ 04 ] GET IN TOUCH
            </div>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'clamp(32px, 3.8vw, 48px)', fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#414242', letterSpacing: '-0.03em', lineHeight: 1.12, textAlign: 'left' }}>
              Let's Start a Conversation
            </h2>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.65, color: '#414242', textAlign: 'left' }}>
              Have questions about your wellbeing assessment, feedback, or need assistance? We're here to help.
            </p>
          </div>

          {/* Right Column: Interactive Send Us Your Query Container */}
          <div style={{
            flex: '1 1 480px',
            maxWidth: '560px',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(0, 174, 157, 0.2)',
            borderRadius: '28px',
            padding: '38px 34px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", color: '#414242', letterSpacing: '-0.02em' }}>
              Send us a message
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14.5px', color: '#414242', opacity: 0.8, fontFamily: "'Nunito', sans-serif" }}>
              Select a topic and fill out your message below:
            </p>

            {/* Topic Selector — Clean Selectable Text Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              {['General Inquiry', 'Assessment Support', 'Feedback', 'Partnership'].map((t) => {
                const isSelected = contactForm.topic === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setContactForm({ ...contactForm, topic: t })}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 0',
                      fontSize: '13.5px',
                      fontWeight: isSelected ? 800 : 600,
                      fontFamily: "'Nunito', sans-serif",
                      color: isSelected ? '#00ae9d' : 'rgba(65, 66, 66, 0.7)',
                      cursor: 'pointer',
                      borderBottom: isSelected ? '2px solid #00ae9d' : '2px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>

            {contactSubmitted ? (
              <div style={{
                background: 'rgba(0, 174, 157, 0.08)',
                border: '1.5px solid #00ae9d',
                borderRadius: '20px',
                padding: '36px 24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '42px', marginBottom: '14px' }}>✨</div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800, color: '#414242', fontFamily: "'Manrope', sans-serif" }}>Message Received!</h4>
                <p style={{ margin: '0 0 20px 0', fontSize: '14.5px', color: '#414242', lineHeight: 1.6 }}>
                  Thank you, <strong>{contactForm.name}</strong>! We have received your query regarding <em>{contactForm.topic || 'General Inquiry'}</em> and will reply to <strong>{contactForm.email}</strong> shortly.
                </p>
                <button
                  onClick={() => { setContactSubmitted(false); setContactForm({ name: '', email: '', message: '', topic: 'General Inquiry' }); }}
                  style={{
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    boxShadow: '0 4px 12px rgba(0, 174, 157, 0.25)'
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#414242', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mary Jane"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8e5',
                      fontSize: '14.5px',
                      fontFamily: "'Nunito', sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#414242', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8e5',
                      fontSize: '14.5px',
                      fontFamily: "'Nunito', sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#414242', marginBottom: '6px' }}>
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8e5',
                      fontSize: '14.5px',
                      fontFamily: "'Nunito', sans-serif",
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="landing-primary-btn"
                  style={{
                    background: '#00ae9d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '15.5px',
                    cursor: 'pointer',
                    marginTop: '4px',
                    boxShadow: '0 6px 20px rgba(0, 174, 157, 0.28)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <span>Send Message →</span>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <LewisFooter />
    </motion.div>
  )
}

