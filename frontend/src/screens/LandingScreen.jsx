import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import './landing.css'

const DOMAINS = [
  { name: 'Sleep & Recovery', field: 'Chronobiology', tag: 'Rest quality, rhythm and restoration.', score: 62, desc: 'How well your body repairs itself. Lewis looks at sleep duration, consistency and how recovered you actually feel — the domain that quietly powers every other one.' },
  { name: 'Nutrition', field: 'Metabolic science', tag: 'What fuels you, and how it lands.', score: 74, desc: 'Not diets — patterns. Lewis maps eating rhythm, quality and relationship with food against what metabolic research says sustains energy and mood.' },
  { name: 'Movement', field: 'Exercise physiology', tag: 'Activity, strength and daily motion.', score: 81, desc: 'From structured training to everyday motion. Lewis measures whether your week gives your body the stimulus it is built to expect.' },
  { name: 'Stress & Resilience', field: 'Psychoneuroimmunology', tag: 'Load, recovery and coping capacity.', score: 58, desc: 'Stress is not the enemy — unrecovered stress is. Lewis tracks your load against your capacity to bounce back.' },
  { name: 'Emotional Balance', field: 'Affective science', tag: 'Mood, regulation and self-awareness.', score: 77, desc: 'How you feel, how often, and how well you can name and steer it. Emotional granularity is one of the strongest predictors of long-term wellbeing.' },
  { name: 'Cognitive Health', field: 'Neuroscience', tag: 'Focus, clarity and mental energy.', score: 79, desc: 'Attention, memory and mental stamina. Lewis detects the early signature of cognitive strain long before burnout does.' },
  { name: 'Social Connection', field: 'Social epidemiology', tag: 'Relationships and belonging.', score: 84, desc: 'The strongest longevity predictor we know. Lewis assesses the depth, not just the count, of your connections.' },
  { name: 'Purpose & Meaning', field: 'Existential psychology', tag: 'Direction, values and motivation.', score: 71, desc: 'A felt sense of "why". People with clear purpose recover faster, sleep better and live longer — Lewis measures how anchored yours is.' },
  { name: 'Environment', field: 'Environmental health', tag: 'Spaces, light, nature and noise.', score: 68, desc: 'Where you live and work shapes your biology daily. Lewis evaluates light exposure, nature contact, noise and the spaces you spend your hours in.' }
];

export default function LandingScreen() {
  const { setScreen } = useLewisStore()
  const [active, setActive] = useState(null)
  const revealRefs = useRef([])

  const handleNext = (e) => {
    e.preventDefault()
    setScreen('preStage0Age')
  }

  const scrollTo = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })

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
  const scoreDeg = (score * 3.6) + 'deg'

  const activeDomain = active != null ? DOMAINS[active] : null

  return (
    <motion.div 
      className="landing-screen-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <header data-screen-label="Nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <a href="#top" onClick={(e) => scrollTo(e, 'top')} style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#414242' }}>
            <span style={{ position: 'relative', width: '20px', height: '20px', display: 'inline-block' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, width: '14px', height: '14px', borderRadius: '50%', background: '#00ae9d' }}></span>
              <span style={{ position: 'absolute', right: 0, bottom: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#5fbb46', mixBlendMode: 'multiply' }}></span>
            </span>
            <span style={{ fontWeight: 600, fontSize: '17px', letterSpacing: '-0.02em' }}>Lewis</span>
          </a>
          <div style={{ display: 'flex', gap: '14px', fontSize: '10.5px', fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(65,66,66,0.55)' }}>
            <span className="hide-on-mobile">Wellbeing Intelligence</span>
            <span>9 Domains</span>
          </div>
        </div>
        <a href="#report" onClick={(e) => scrollTo(e, 'report')} className="landing-header-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.75)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 18px rgba(0,80,70,0.08)', borderRadius: '999px', padding: '8px 18px', fontSize: '12.5px', fontWeight: 500, color: '#414242' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ae9d', display: 'inline-block' }}></span>
          Get your report
        </a>
      </header>

      <section id="top" data-screen-label="Hero" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', animation: 'lw-rise 1s ease both' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(52px, 7.5vw, 88px)', fontWeight: 700, letterSpacing: '-0.035em', color: '#2b2c2c', lineHeight: 1.02 }}>Lewis</h1>
          <p style={{ margin: '6px 0 0', fontSize: 'clamp(30px, 4.4vw, 52px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            <span style={{ fontWeight: 300, color: 'rgba(65,66,66,0.42)' }}>wellbeing </span><span style={{ fontWeight: 700, color: '#2b2c2c' }}>made intelligent</span>
          </p>
          <div style={{ marginTop: '36px' }}>
            <a href="#begin" onClick={handleNext} className="landing-primary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0,174,157,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 12px 30px rgba(0,120,105,0.28)', color: '#ffffff', borderRadius: '999px', padding: '14px 32px', fontSize: '15px', fontWeight: 500 }}>
              Let's begin ! <span style={{ fontSize: '17px' }}>→</span>
            </a>
          </div>
        </div>

        <div style={{ position: 'absolute', left: '32px', bottom: '36px', maxWidth: '320px', zIndex: 2 }}>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '10px' }}>Wellbeing Intelligence</div>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.55, color: 'rgba(65,66,66,0.75)' }}>Nine scientific domains, one living picture of you. Lewis reads the signals your body and life already produce.</p>
        </div>

        <div style={{ position: 'absolute', right: '32px', bottom: '36px', display: 'flex', gap: '8px', zIndex: 2 }}>
          <a href="#domains" onClick={(e) => scrollTo(e, 'domains')} className="landing-domain-btn" style={{ border: '1px solid rgba(255,255,255,0.75)', borderRadius: '999px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, color: '#414242', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 14px rgba(0,80,70,0.07)' }}>9 Domains</a>
          <a href="#how" onClick={(e) => scrollTo(e, 'how')} className="landing-domain-btn" style={{ border: '1px solid rgba(255,255,255,0.75)', borderRadius: '999px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, color: '#414242', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 14px rgba(0,80,70,0.07)' }}>Science-backed</a>
          <a href="#report" onClick={(e) => scrollTo(e, 'report')} className="landing-domain-btn" style={{ border: '1px solid rgba(255,255,255,0.75)', borderRadius: '999px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, color: '#414242', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 14px rgba(0,80,70,0.07)' }}>Adaptive</a>
        </div>
      </section>

      <section id="domains" data-screen-label="Domains" style={{ position: 'relative', zIndex: 1, padding: '120px 6vw 90px', background: 'rgba(255,255,255,0.2)' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '52px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '14px', fontFamily: 'ui-monospace, Menlo, monospace' }}>[ 01 ] The nine domains</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, letterSpacing: '-0.03em', color: '#2b2c2c', lineHeight: 1.08, maxWidth: '640px' }}>One score is a lie.<br/>Nine tell the truth.</h2>
          </div>
          <p style={{ margin: 0, maxWidth: '340px', fontSize: '14px', lineHeight: 1.6, color: 'rgba(65,66,66,0.65)' }}>Every domain is grounded in peer-reviewed science. Together they map the full terrain of how you're really doing. Select one to explore.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {DOMAINS.map((d, i) => (
            <div key={i} ref={addToRefs} onClick={() => setActive(active === i ? null : i)} className="landing-reveal-element landing-domain-card" style={{ position: 'relative', background: 'rgba(244,244,244,0.55)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '20px', padding: '26px 24px 24px', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', border: '2px solid #00ae9d', pointerEvents: 'none', transition: 'opacity .2s', opacity: active === i ? 1 : 0 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '34px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#00ae9d' }}>0{i + 1}</span>
                <span style={{ fontSize: '10px', fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(65,66,66,0.42)' }}>{d.field}</span>
              </div>
              <div style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.01em', color: '#2b2c2c', marginBottom: '6px' }}>{d.name}</div>
              <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'rgba(65,66,66,0.6)' }}>{d.tag}</div>
            </div>
          ))}
        </div>

        {active != null && activeDomain && (
          <div style={{ marginTop: '26px', background: 'rgba(43,44,44,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 44px rgba(0,60,52,0.18)', color: '#ffffff', borderRadius: '20px', padding: '28px 30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '28px', animation: 'lw-rise .45s ease both' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5fbb46', marginBottom: '8px', fontFamily: 'ui-monospace, Menlo, monospace' }}>Domain 0{active + 1} / 09</div>
              <div style={{ fontSize: '22px', fontWeight: 600, marginBottom: '6px' }}>{activeDomain.name}</div>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(255,255,255,0.72)', maxWidth: '520px' }}>{activeDomain.desc}</p>
            </div>
            <div style={{ minWidth: '220px', flex: '0 0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                <span>Sample score</span><span style={{ color: '#ffffff', fontWeight: 600 }}>{activeDomain.score}</span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #00ae9d, #5fbb46)', transition: 'width .5s ease', width: activeDomain.score + '%' }}></div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section id="how" data-screen-label="How it works" style={{ position: 'relative', zIndex: 1, padding: '90px 6vw', background: 'rgba(244,244,244,0.3)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div ref={addToRefs} className="landing-reveal-element" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ae9d', marginBottom: '44px', fontFamily: 'ui-monospace, Menlo, monospace' }}>[ 02 ] How Lewis works</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
          <div ref={addToRefs} className="landing-reveal-element" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.65)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 24px rgba(0,80,70,0.06)', borderRadius: '20px', padding: '26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#5fbb46', marginBottom: '14px', fontFamily: 'ui-monospace, Menlo, monospace' }}>01 — Listen</div>
            <div style={{ fontSize: '21px', fontWeight: 600, letterSpacing: '-0.01em', color: '#2b2c2c', marginBottom: '8px' }}>An assessment that fits your day</div>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(65,66,66,0.65)' }}>Validated questions across all nine domains — a 3–5 minute Pulse or the full 10–15 minute deep dive. No wearables required, no jargon.</p>
          </div>
          <div ref={addToRefs} className="landing-reveal-element" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.65)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 24px rgba(0,80,70,0.06)', borderRadius: '20px', padding: '26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#5fbb46', marginBottom: '14px', fontFamily: 'ui-monospace, Menlo, monospace' }}>02 — Analyze</div>
            <div style={{ fontSize: '21px', fontWeight: 600, letterSpacing: '-0.01em', color: '#2b2c2c', marginBottom: '8px' }}>Intelligence, not averages</div>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(65,66,66,0.65)' }}>Lewis weighs how your domains interact — because sleep debt shows up in mood, and stress shows up everywhere.</p>
          </div>
          <div ref={addToRefs} className="landing-reveal-element" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.65)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 24px rgba(0,80,70,0.06)', borderRadius: '20px', padding: '26px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#5fbb46', marginBottom: '14px', fontFamily: 'ui-monospace, Menlo, monospace' }}>03 — Guide</div>
            <div style={{ fontSize: '21px', fontWeight: 600, letterSpacing: '-0.01em', color: '#2b2c2c', marginBottom: '8px' }}>A report that acts</div>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(65,66,66,0.65)' }}>Your report ranks what to change first, and adapts every time you check back in.</p>
          </div>
        </div>
      </section>

      <section id="report" data-screen-label="Report preview" style={{ position: 'relative', zIndex: 1, padding: '110px 6vw', background: 'rgba(214,237,234,0.3)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div ref={addToRefs} className="landing-reveal-element" style={{ flex: 1, minWidth: '300px', maxWidth: '520px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00907f', marginBottom: '14px', fontFamily: 'ui-monospace, Menlo, monospace' }}>[ 03 ] Your wellbeing report</div>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(30px, 3.6vw, 46px)', fontWeight: 600, letterSpacing: '-0.03em', color: '#2b2c2c', lineHeight: 1.1 }}>Nine signals.<br/>One honest number.</h2>
            <p style={{ margin: '0 0 28px', fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(65,66,66,0.7)' }}>Your Lewis Score distills all nine domains into a single trajectory you can actually move — and shows you exactly which domain moves it most.</p>
            <a href="#begin" onClick={handleNext} className="landing-primary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0,174,157,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 10px 28px rgba(0,120,105,0.28)', color: '#ffffff', borderRadius: '999px', padding: '13px 26px', fontSize: '14px', fontWeight: 500 }}>
              Start your assessment <span style={{ fontSize: '16px' }}>→</span>
            </a>
          </div>

          <div ref={addToRefs} className="landing-reveal-element" style={{ flex: '0 1 460px', minWidth: '320px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '26px', padding: '30px 30px 26px', boxShadow: '0 24px 60px rgba(0,80,70,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#2b2c2c' }}>Wellbeing Report</div>
              <div style={{ fontSize: '11.5px', color: 'rgba(65,66,66,0.45)' }}>July 2026</div>
            </div>
            <div style={{ display: 'flex', gap: '26px', alignItems: 'center', marginBottom: '26px' }}>
              <div style={{ position: 'relative', width: '118px', height: '118px', flex: 'none', borderRadius: '50%', background: `conic-gradient(#00ae9d ${scoreDeg}, #e6f4d0 0)`, display: 'grid', placeItems: 'center' }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#ffffff', display: 'grid', placeItems: 'center', flexDirection: 'column' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#2b2c2c', lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: '9.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(65,66,66,0.45)', marginTop: '3px' }}>Lewis score</div>
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.55, color: 'rgba(65,66,66,0.6)' }}>Solid foundation. Your biggest opportunity right now is <strong style={{ color: '#00907f' }}>Sleep & Recovery</strong> — small changes there lift three other domains.</p>
            </div>
            <div style={{ display: 'grid', gap: '9px' }}>
              {DOMAINS.map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '118px 1fr 30px', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '11.5px', color: 'rgba(65,66,66,0.65)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <div style={{ height: '6px', borderRadius: '999px', background: '#f4f4f4', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #00ae9d, #5fbb46)', width: d.score + '%' }}></div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#414242', textAlign: 'right' }}>{d.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer data-screen-label="Footer" style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '26px 28px', background: '#414242', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ae9d', display: 'inline-block' }}></span>
          © 2026 Lewis — LIFED Health
        </div>
        <div style={{ display: 'flex', gap: '22px', fontSize: '12px' }}>
          <a href="#domains" onClick={(e) => scrollTo(e, 'domains')} className="landing-footer-link" style={{ color: 'rgba(255,255,255,0.55)' }}>The science</a>
          <a href="#report" onClick={(e) => scrollTo(e, 'report')} className="landing-footer-link" style={{ color: 'rgba(255,255,255,0.55)' }}>Sample report</a>
          <a href="#top" onClick={(e) => scrollTo(e, 'top')} className="landing-footer-link" style={{ color: 'rgba(255,255,255,0.55)' }}>Privacy</a>
        </div>
      </footer>
    </motion.div>
  )
}

