import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import './landing.css'

const DOMAINS = [
  { name: 'Sleep & Recovery', field: 'Chronobiology', icon: '🌙', tag: 'Rest quality, rhythm and restoration.', score: 62, desc: 'How well your body repairs itself. Lewis looks at sleep duration, consistency and how recovered you actually feel — the domain that quietly powers every other one.' },
  { name: 'Nutrition', field: 'Metabolic science', icon: '🥗', tag: 'What fuels you, and how it lands.', score: 74, desc: 'Not diets — patterns. Lewis maps eating rhythm, quality and relationship with food against what metabolic research says sustains energy and mood.' },
  { name: 'Movement', field: 'Exercise physiology', icon: '🏃', tag: 'Activity, strength and daily motion.', score: 81, desc: 'From structured training to everyday motion. Lewis measures whether your week gives your body the stimulus it is built to expect.' },
  { name: 'Stress & Resilience', field: 'Psychoneuroimmunology', icon: '🛡️', tag: 'Load, recovery and coping capacity.', score: 58, desc: 'Stress is not the enemy — unrecovered stress is. Lewis tracks your load against your capacity to bounce back.' },
  { name: 'Emotional Balance', field: 'Affective science', icon: '🪞', tag: 'Mood, regulation and self-awareness.', score: 77, desc: 'How you feel, how often, and how well you can name and steer it. Emotional granularity is one of the strongest predictors of long-term wellbeing.' },
  { name: 'Cognitive Health', field: 'Neuroscience', icon: '🧠', tag: 'Focus, clarity and mental energy.', score: 79, desc: 'Attention, memory and mental stamina. Lewis detects the early signature of cognitive strain long before burnout does.' },
  { name: 'Social Connection', field: 'Social epidemiology', icon: '🤝', tag: 'Relationships and belonging.', score: 84, desc: 'The strongest longevity predictor we know. Lewis assesses the depth, not just the count, of your connections.' },
  { name: 'Purpose & Meaning', field: 'Existential psychology', icon: '🧭', tag: 'Direction, values and motivation.', score: 71, desc: 'A felt sense of "why". People with clear purpose recover faster, sleep better and live longer — Lewis measures how anchored yours is.' },
  { name: 'Environment', field: 'Environmental health', icon: '🌿', tag: 'Spaces, light, nature and noise.', score: 68, desc: 'Where you live and work shapes your biology daily. Lewis evaluates light exposure, nature contact, noise and the spaces you spend your hours in.' }
];

export default function LandingScreen() {
  const { setScreen } = useLewisStore()
  const [active, setActive] = useState(0)
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
      {/* Constellation Vector Mesh Overlay matching screenshot */}
      <svg className="constellation-svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
        {/* Left Constellation Mesh */}
        <g stroke="#99e2d8" strokeWidth="1.2" opacity="0.6" fill="none">
          <line x1="150" y1="180" x2="310" y2="120" />
          <line x1="310" y1="120" x2="265" y2="300" />
          <line x1="150" y1="180" x2="265" y2="300" />
          <line x1="310" y1="120" x2="720" y2="90" />
          <line x1="265" y1="300" x2="155" y2="840" />
        </g>
        <g fill="#00ae9d">
          <circle cx="150" cy="180" r="4.5" className="node-pulse" />
          <circle cx="310" cy="120" r="5.5" className="node-pulse" />
          <circle cx="265" cy="300" r="5" className="node-pulse" />
          <circle cx="720" cy="90" r="4" className="node-pulse" />
          <circle cx="155" cy="840" r="4" className="node-pulse" />
        </g>

        {/* Right Constellation Mesh */}
        <g stroke="#99e2d8" strokeWidth="1.2" opacity="0.6" fill="none">
          <line x1="1130" y1="150" x2="1215" y2="265" />
          <line x1="1215" y1="265" x2="1265" y2="565" />
          <line x1="1215" y1="265" x2="1340" y2="120" />
        </g>
        <g fill="#00ae9d">
          <circle cx="1130" cy="150" r="4.5" className="node-pulse" />
          <circle cx="1215" cy="265" r="5.5" className="node-pulse" />
          <circle cx="1265" cy="565" r="4" className="node-pulse" />
        </g>
      </svg>

      {/* TOP NAVIGATION HEADER */}
      <header data-screen-label="Nav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'transparent',
      }}>
        {/* Brand Emblem */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #36D1DC 0%, #00AE9D 65%, #044E43 100%)',
            boxShadow: '0 4px 14px rgba(0, 174, 157, 0.35)',
            flexShrink: 0,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '20px', color: '#16302b', letterSpacing: '-0.02em' }}>Lewis</span>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#7a968e', marginTop: '2px' }}>BY LIFED</span>
          </div>
        </div>

        {/* Header Right Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#how" onClick={(e) => scrollTo(e, 'how')} className="hide-on-mobile" style={{ fontSize: '14.5px', fontWeight: 600, color: '#4a6b62', transition: 'color 0.2s' }}>
            How it works
          </a>
          <a href="#begin" onClick={handleNext} className="landing-header-btn" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1.5px solid rgba(226, 232, 229, 0.85)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
            borderRadius: '999px',
            padding: '9px 22px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: '#16302b',
            cursor: 'pointer',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5fbb46', display: 'inline-block' }} />
            Get your report
          </a>
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
        <div style={{ textAlign: 'center', maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          
          {/* Eyebrow with horizontal accent lines matching screenshot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '22px' }}>
            <span style={{ width: '32px', height: '1.5px', background: '#00ae9d', display: 'inline-block', opacity: 0.7 }} />
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.18em', color: '#00ae9d', textTransform: 'uppercase' }}>
              WELLBEING INTELLIGENCE
            </span>
            <span style={{ width: '32px', height: '1.5px', background: '#00ae9d', display: 'inline-block', opacity: 0.7 }} />
          </div>

          {/* Huge Main Headline matching screenshot */}
          <h1 className="hero-lewis-title" style={{ margin: '0 0 14px 0' }}>
            Lewis
          </h1>

          {/* Subtitle matching screenshot */}
          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(32px, 5.2vw, 64px)',
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            margin: '0 0 28px 0',
          }}>
            <span style={{ fontWeight: 400, color: '#8fa099' }}>wellbeing </span>
            <span style={{ fontWeight: 800, color: '#16302b' }}>made intelligent</span>
          </h2>

          {/* Description matching screenshot */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            color: '#4a6b62',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 36px auto',
          }}>
            Answer a few gentle questions. Lewis reads the signals your body<br className="hide-on-mobile" />
            and life already produce, and turns them into <strong style={{ color: '#00ae9d', fontWeight: 700 }}>one living picture of you</strong>.
          </p>

          {/* Action Buttons Row matching screenshot */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
            <button
              onClick={handleNext}
              className="landing-primary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#00ae9d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '16px 36px',
                fontSize: '16px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                boxShadow: '0 10px 28px rgba(0, 174, 157, 0.3)',
                cursor: 'pointer',
              }}
            >
              Let's begin <span style={{ fontSize: '18px' }}>→</span>
            </button>

            <button
              onClick={(e) => scrollTo(e, 'how')}
              className="landing-secondary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                color: '#16302b',
                border: '1.5px solid #e2e8e5',
                borderRadius: '999px',
                padding: '16px 30px',
                fontSize: '15.5px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
              }}
            >
              See how it works <span style={{ fontSize: '14px', color: '#16302b' }}>⌄</span>
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
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            borderRadius: '16px',
            padding: '12px 20px',
            maxWidth: '360px',
            boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '4px', fontFamily: '"IBM Plex Mono", monospace' }}>
              WELLBEING INTELLIGENCE
            </div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#4a6b62' }}>
              Nine scientific domains, one living picture of you.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a href="#domains" onClick={(e) => scrollTo(e, 'domains')} className="landing-domain-btn" style={{ border: '1.5px solid rgba(0, 174, 157, 0.3)', borderRadius: '999px', padding: '8px 18px', fontSize: '12.5px', fontWeight: 700, color: '#16302b', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              9 Domains
            </a>
            <a href="#how" onClick={(e) => scrollTo(e, 'how')} className="landing-domain-btn" style={{ border: '1.5px solid rgba(0, 174, 157, 0.3)', borderRadius: '999px', padding: '8px 18px', fontSize: '12.5px', fontWeight: 700, color: '#16302b', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              Science-backed
            </a>
            <a href="#report" onClick={(e) => scrollTo(e, 'report')} className="landing-domain-btn" style={{ border: '1.5px solid rgba(0, 174, 157, 0.3)', borderRadius: '999px', padding: '8px 18px', fontSize: '12.5px', fontWeight: 700, color: '#16302b', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              Adaptive
            </a>
          </div>
        </div>
      </section>

      {/* Infinite Domain Marquee Ticker Scroller */}
      <div className="landing-marquee-container">
        <div className="landing-marquee-track">
          {[...DOMAINS, ...DOMAINS, ...DOMAINS].map((d, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 700, color: '#16302b', fontFamily: "'Nunito', sans-serif" }}>
              <span style={{ fontSize: '16px' }}>{d.icon}</span>
              <span>{d.name}</span>
              <span style={{ color: '#00ae9d', fontSize: '11px', margin: '0 8px' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 01 — THE NINE DOMAINS */}
      <section id="domains" data-screen-label="Domains" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw 80px', background: 'rgba(255,255,255,0.45)' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '44px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '10px', fontFamily: '"IBM Plex Mono", monospace' }}>
              [ 01 ] THE NINE DOMAINS
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 50px)', fontFamily: "'Manrope', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', color: '#16302b', lineHeight: 1.08, maxWidth: '640px' }}>
              One score is a lie.<br />Nine tell the truth.
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: '360px', fontSize: '14.5px', lineHeight: 1.6, color: '#4a6b62' }}>
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
                  border: isSelected ? '2px solid #00ae9d' : '1.5px solid #e2e8e5', 
                  borderRadius: '20px', 
                  padding: '24px 22px', 
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 12px 32px rgba(0,174,157,0.15)' : '0 4px 14px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '20px' }}>{d.icon}</span>
                  <span style={{ fontSize: '10.5px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? '#00ae9d' : '#8fa099' }}>
                    {d.field}
                  </span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '6px' }}>
                  {d.name}
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#4a6b62' }}>
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
              background: '#16302b', 
              color: '#ffffff', 
              borderRadius: '24px', 
              padding: '30px 34px', 
              display: 'flex', 
              flexWrap: 'wrap', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '28px', 
              boxShadow: '0 20px 50px rgba(22, 48, 43, 0.25)',
              border: '1.5px solid rgba(0, 174, 157, 0.4)',
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5fbb46', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700 }}>
                DOMAIN 0{active + 1} / 09 · {activeDomain.field}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{activeDomain.icon}</span> {activeDomain.name}
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)', maxWidth: '580px' }}>
                {activeDomain.desc}
              </p>
            </div>

            <div style={{ minWidth: '240px', flex: '0 0 auto', background: 'rgba(255,255,255,0.06)', borderRadius: '18px', padding: '20px 22px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
                <span>Benchmark Score</span>
                <span style={{ color: '#5fbb46', fontWeight: 800 }}>{activeDomain.score} / 100</span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #00ae9d, #5fbb46)', width: `${activeDomain.score}%`, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ marginTop: '12px', fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                Analyzed via Lewis Adaptive Engine
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* SECTION 02 — HOW LEWIS WORKS */}
      <section id="how" data-screen-label="How it works" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw', background: 'rgba(244,249,247,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '12px', fontFamily: '"IBM Plex Mono", monospace' }}>
          [ 02 ] HOW LEWIS WORKS
        </div>
        <h2 ref={addToRefs} className="landing-reveal-element" style={{ margin: '0 0 16px 0', fontSize: 'clamp(30px, 3.8vw, 48px)', fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#16302b', letterSpacing: '-0.03em' }}>
          Intelligence, not averages.
        </h2>
        <p ref={addToRefs} className="landing-reveal-element" style={{ margin: '0 0 32px 0', maxWidth: '640px', fontSize: '15.5px', lineHeight: 1.6, color: '#4a6b62' }}>
          Answer a few gentle questions. Lewis translates your life signals into one clear, actionable picture of your wellbeing.
        </p>

        {/* System Brief Overview Banner */}
        <div ref={addToRefs} className="landing-reveal-element" style={{
          background: '#ffffff',
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
          }}>💡</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#00ae9d', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
              LEWIS SYSTEM OVERVIEW BRIEF
            </div>
            <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65, color: '#16302b' }}>
              LEWIS (The Lifed Everyday Wellbeing Intelligence System) evaluates your responses across 9 validated scientific life dimensions using standardized scales like WHO-5 and PSS-10. Instead of giving generic advice, Lewis uses a deterministic cross-domain influence matrix to calculate where a single micro-habit creates the largest positive ripple effect across your health, mood, and resilience.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', border: '1.5px solid #e2e8e5', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)', borderRadius: '22px', padding: '30px 26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#00ae9d', marginBottom: '16px', fontFamily: '"IBM Plex Mono", monospace' }}>01 — LISTEN</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '10px' }}>An assessment that fits your day</div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#4a6b62' }}>
              Validated questions across all nine domains — choose a 3–5 minute Pulse or the full deep dive. No wearables required.
            </p>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', border: '1.5px solid #e2e8e5', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)', borderRadius: '22px', padding: '30px 26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#00ae9d', marginBottom: '16px', fontFamily: '"IBM Plex Mono", monospace' }}>02 — ANALYZE</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '10px' }}>Cross-domain intelligence</div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#4a6b62' }}>
              Lewis weighs how your domains interact — because sleep debt shows up in mood, and stress impacts every single domain.
            </p>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', border: '1.5px solid #e2e8e5', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)', borderRadius: '22px', padding: '30px 26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#00ae9d', marginBottom: '16px', fontFamily: '"IBM Plex Mono", monospace' }}>03 — GUIDE</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '10px' }}>A report that acts</div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#4a6b62' }}>
              Your report ranks what to change first, and adapts continuously every time you check back in.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 03 — THE SCIENCE & ARCHITECTURE OF LEWIS */}
      <section id="science" data-screen-label="The Science" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw', background: 'rgba(255,255,255,0.45)' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '12px', fontFamily: '"IBM Plex Mono", monospace' }}>
            [ 03 ] THE SCIENCE &amp; ARCHITECTURE
          </div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: 'clamp(30px, 3.8vw, 48px)', fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#16302b', letterSpacing: '-0.03em', maxWidth: '780px', lineHeight: 1.1 }}>
            Deterministic intelligence, zero-PII privacy, &amp; 10,000-profile benchmarking.
          </h2>
          <p style={{ margin: 0, maxWidth: '640px', fontSize: '15.5px', lineHeight: 1.65, color: '#4a6b62' }}>
            LEWIS (The Lifed Everyday Wellbeing Intelligence System) is built on validated psychological scales and a deterministic leverage engine — turning your signals into actionable clarity.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', border: '1.5px solid #e2e8e5', borderRadius: '22px', padding: '30px 28px', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#00ae9d', marginBottom: '14px', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.1em' }}>
              ⚡ 9×9 INFLUENCE MATRIX
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '10px' }}>
              W-Matrix Leverage Engine
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: '#4a6b62' }}>
              Maps how your 9 domains interact. Instead of treating symptoms, Lewis calculates where a small micro-habit change creates the biggest positive ripple effect across your entire life.
            </p>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', border: '1.5px solid #e2e8e5', borderRadius: '22px', padding: '30px 28px', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#00ae9d', marginBottom: '14px', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.1em' }}>
              📊 10K SEED CORPUS (k-NN)
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '10px' }}>
              10,000-Profile Benchmark
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: '#4a6b62' }}>
              Maps your profile against a 10k synthetic dataset using state-only k-NN matching. You receive coarse-position context (<strong style={{ color: '#00ae9d' }}>Thriving, Steady, Strained, Depleted</strong>) without punitive scores.
            </p>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', border: '1.5px solid #e2e8e5', borderRadius: '22px', padding: '30px 28px', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#00ae9d', marginBottom: '14px', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.1em' }}>
              🔬 CLINICAL INSTRUMENTS
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '10px' }}>
              Validated Scientific Scales
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: '#4a6b62' }}>
              Integrates WHO-5 (Wellbeing), PSS-10 (Calm), UCLA-3 (Relationships), GSE (Agency), CFPB-5 (Financial Peace), and PROMIS (Purpose). All distress scales are inverted at source into positive wellbeing polarity.
            </p>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', border: '1.5px solid #e2e8e5', borderRadius: '22px', padding: '30px 28px', boxShadow: '0 6px 20px rgba(0, 80, 70, 0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#00ae9d', marginBottom: '14px', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.1em' }}>
              🛡️ FAIL-SAFE PRIVACY
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b', marginBottom: '10px' }}>
              Zero-PII &amp; Safety Lattice
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: '#4a6b62' }}>
              Private by design. Answers live only for the request duration. If severe depletion is detected, Gentle Mode automatically engages to deliver grounding micro-habits and care signposts.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 04 — SAMPLE REPORT PREVIEW */}
      <section id="report" data-screen-label="Report preview" style={{ position: 'relative', zIndex: 2, padding: '100px 6vw', background: 'rgba(214, 237, 234, 0.35)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div ref={addToRefs} className="landing-reveal-element" style={{ flex: 1, minWidth: '300px', maxWidth: '520px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '12px', fontFamily: '"IBM Plex Mono", monospace' }}>
              [ 04 ] YOUR WELLBEING REPORT
            </div>
            <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(32px, 3.8vw, 48px)', fontFamily: "'Manrope', sans-serif", fontWeight: 800, letterSpacing: '-0.03em', color: '#16302b', lineHeight: 1.08 }}>
              Nine signals.<br />One honest number.
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: '15px', lineHeight: 1.65, color: '#4a6b62' }}>
              Your Lewis Score distills all nine domains into a single trajectory you can actually move — showing you exactly which habit unlocks the biggest impact.
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
            background: '#ffffff',
            border: '1.5px solid #e2e8e5',
            borderRadius: '26px',
            padding: '32px 30px',
            boxShadow: '0 20px 50px rgba(0, 80, 70, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: '#16302b' }}>Wellbeing Report</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#00ae9d', fontFamily: '"IBM Plex Mono", monospace' }}>LIVE PREVIEW</div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                flex: 'none',
                borderRadius: '50%',
                background: `conic-gradient(#00ae9d ${scoreDeg}, #e2e8e5 0)`,
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 16px rgba(0,174,157,0.15)',
              }}>
                <div style={{ width: '92px', height: '92px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <div style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', color: '#16302b', lineHeight: 1, fontFamily: "'Manrope', sans-serif" }}>
                    {score}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fa099', marginTop: '4px', fontFamily: '"IBM Plex Mono", monospace' }}>
                    Lewis score
                  </div>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: '#4a6b62' }}>
                Solid foundation. Your primary opportunity right now is <strong style={{ color: '#00ae9d', fontWeight: 700 }}>Sleep &amp; Recovery</strong> — small improvements there directly elevate three other domains.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {DOMAINS.map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 34px', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#16302b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d.icon} {d.name}
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', background: '#f0f4f2', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #00ae9d, #5fbb46)', width: `${d.score}%` }} />
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#044e43', textAlign: 'right', fontFamily: '"IBM Plex Mono", monospace' }}>
                    {d.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer data-screen-label="Footer" style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexWrap: 'wrap',
        justify: 'space-between',
        alignItems: 'center',
        gap: '16px',
        padding: '28px 32px',
        background: '#16302b',
        color: '#ffffff',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ae9d', display: 'inline-block' }}></span>
          © 2026 Lewis — LIFED Health Intelligence
        </div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
          <a href="#domains" onClick={(e) => scrollTo(e, 'domains')} className="landing-footer-link" style={{ color: 'rgba(255,255,255,0.7)' }}>The Science</a>
          <a href="#report" onClick={(e) => scrollTo(e, 'report')} className="landing-footer-link" style={{ color: 'rgba(255,255,255,0.7)' }}>Sample Report</a>
          <a href="#top" onClick={(e) => scrollTo(e, 'top')} className="landing-footer-link" style={{ color: 'rgba(255,255,255,0.7)' }}>Privacy</a>
        </div>
      </footer>
    </motion.div>
  )
}

