import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import Icon from '../report/icons.jsx'
import './landing.css'

// Redesigned from "LEWIS Homepage v2" (marketing spec). Canonical 9-domain
// taxonomy matches the real assessment (useLewisStore priorities / Stage5
// Landscape), not the placeholder names the old landing page used.
const NAV_LINKS = [
  { id: 'what-is-lewis', label: 'What is LEWIS' },
  { id: 'areas', label: 'Nine areas', secondary: true },
  { id: 'research', label: 'The research' },
  { id: 'questions', label: 'Questions' },
]

const HERO_PILLS = [
  { icon: 'clock', text: '12 to 15 minutes, one sitting' },
  { icon: 'grid', text: 'Nine connected areas of life' },
  { icon: 'badgeCheck', text: 'Non-clinical. No diagnosis.' },
  { icon: 'users', text: 'Adults 18 and over' },
]

const WHAT_CARDS = [
  { icon: 'waves', title: 'Questions, tasks and activities', desc: 'A body map, a breathing minute, a sound check, a few quick choices. What you do counts as much as what you say.' },
  { icon: 'brain', title: 'Nine areas, read together', desc: 'LEWIS sees which areas are moving together and where a small effort reaches furthest. Leverage, never a claim about cause.' },
  { icon: 'leaf', title: 'It starts small', desc: 'What comes back begins with one habit small enough to actually do. Support always comes before anything else.' },
]

const DOMAINS = [
  { name: 'Physical & Regeneration', iconKey: 'refresh', desc: 'Sleep, rest and recovery.' },
  { name: 'Emotional & Mental', iconKey: 'waves', desc: 'Pressure, mood and steadiness.' },
  { name: 'Engagement & Energy', iconKey: 'sparkles', desc: 'Vitality, interest and focus.' },
  { name: 'Relationships & Social', iconKey: 'users', desc: 'Connection and support.' },
  { name: 'Meaning & Spiritual', iconKey: 'mountain', desc: 'Values and what matters.' },
  { name: 'Accomplishment & Agency', iconKey: 'badgeCheck', desc: 'Confidence and follow-through.' },
  { name: 'Financial Wellness', iconKey: 'wallet', desc: 'How money has been sitting with you.' },
  { name: 'Intellectual & Growth', iconKey: 'leaf', desc: 'Curiosity and room to grow.' },
  { name: 'Environmental & Cultural', iconKey: 'home', desc: 'Belonging and surroundings.' },
]

const RESEARCH_CARDS = [
  { icon: 'brain', title: 'Validated questions carry the weight', desc: 'Every area is anchored to established, peer-reviewed self-report research. That wording is never altered, in any language, because that is what makes it mean anything.' },
  { icon: 'compass', title: 'Tasks and activities only nudge', desc: 'The behavioural moments are suggestive signals. They can shade a reading within a tight bound when they agree with it, and can never create a problem on their own.' },
  { icon: 'refresh', title: 'Traceable, not generated', desc: 'Everything LEWIS tells you maps back to your own answers and efforts. Where the picture is thin, it says so rather than guessing.' },
]

const FAQS = [
  { q: 'What is LEWIS?', a: "LEWIS, the Lifed Everyday Wellbeing Intelligence System, is Lifed's non-clinical wellbeing reflection tool. Through questions, tasks and guided activities, it understands how life feels for you right now and reflects it back across nine connected areas of everyday wellbeing. It takes 12 to 15 minutes, and it does not diagnose." },
  { q: 'How long does LEWIS take?', a: '12 to 15 minutes, taken at your own pace in one sitting.' },
  { q: 'What does LEWIS cost?', a: 'Starting LEWIS costs nothing. Your complete report, around 20 pages, is ₹399.' },
  { q: 'Is it only questions?', a: 'No. Alongside the questions there are short tasks and guided activities, including a body map, a breathing minute, a sound check and a few quick choices. What you do in them adds to the picture as much as what you answer.' },
  { q: 'Is LEWIS a medical or mental health assessment?', a: 'No. LEWIS is non-clinical. It does not diagnose, treat or measure any condition, and it is not a replacement for professional care. It is a structured reflection, not a verdict.' },
  { q: 'What are the nine areas of wellbeing?', a: 'Physical & Regeneration, Emotional & Mental, Engagement & Energy, Relationships & Social, Meaning & Spiritual, Accomplishment & Agency, Financial Wellness, Intellectual & Growth, and Environmental & Cultural.' },
  { q: 'What is the research behind LEWIS?', a: 'Each of the nine areas is anchored to established, peer-reviewed self-report research, and the wording of those questions is never altered. The tasks and activities alongside them can shade a reading only when they agree with it, never create one.' },
  { q: 'Who can use LEWIS, and do I need a wearable?', a: 'LEWIS is for adults aged 18 and over, and it confirms your age before it begins. No wearable or connected device is involved. LEWIS works from your own answers and efforts, and makes no claims about hormones, brain states or heart-rate patterns.' },
]

const eyebrowStyle = (color = '#00ae9d') => ({
  margin: '0 0 18px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em',
  textTransform: 'uppercase', color, fontFamily: "'Nunito', sans-serif",
})

const sectionH2Style = {
  margin: 0, fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.1, fontWeight: 800,
  letterSpacing: '-0.025em', color: '#414242', fontFamily: "'Nunito', sans-serif",
}

const flatCardStyle = {
  background: '#ffffff', borderRadius: '18px', padding: 'clamp(24px, 3vw, 32px)',
}

function IconBadge({ name, iconSize = 22, color = '#00ae9d' }) {
  return (
    <div style={{ color, marginBottom: '20px' }}>
      <Icon name={name} size={iconSize} />
    </div>
  )
}

export default function LandingScreen() {
  const { setScreen } = useLewisStore()
  const revealRefs = useRef([])

  const handleNext = (e) => {
    if (e) e.preventDefault()
    setScreen('preStage0Age')
  }

  const scrollTo = (e, id) => {
    if (e) e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const container = document.querySelector('.landing-screen-wrapper')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    }, { root: container || null, threshold: 0.1 })

    revealRefs.current.forEach((el) => { if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  return (
    <motion.div
      className="landing-screen-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* STICKY NAV */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.93)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid #f4f4f4',
      }}>
        <div style={{
          maxWidth: '1180px', margin: '0 auto', padding: '18px clamp(20px,4vw,40px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
        }}>
          <a href="#top" onClick={(e) => scrollTo(e, 'top')} style={{ display: 'flex', alignItems: 'center' }}>
            <LewisLogo size={30} showText={true} />
          </a>
          <nav data-nav="1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,2.4vw,30px)' }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-nav-link="1"
                data-secondary={l.secondary ? '1' : undefined}
                onClick={(e) => scrollTo(e, l.id)}
                className="landing-nav-link"
                style={{ fontSize: '14px', fontWeight: 700, color: '#414242' }}
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={handleNext}
              className="landing-primary-btn"
              style={{ padding: '13px 22px', fontSize: '14px', whiteSpace: 'nowrap' }}
            >
              Start LEWIS
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" style={{ background: '#ffffff', padding: 'clamp(56px,8vw,100px) clamp(20px,4vw,40px) clamp(56px,7vw,88px)' }}>
        <div data-row="hero" style={{
          maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr .8fr',
          gap: 'clamp(36px,5vw,72px)', alignItems: 'start',
        }}>
          <div>
            <p style={eyebrowStyle()}>LEWIS by Lifed</p>
            <h1 style={{
              margin: '0 0 22px', fontSize: 'clamp(34px,5.6vw,58px)', lineHeight: 1.05, fontWeight: 800,
              letterSpacing: '-0.03em', color: '#414242', fontFamily: "'Nunito', sans-serif",
            }}>
              A clearer picture of your wellbeing, in 12 to 15 minutes.
            </h1>
            <p style={{ margin: '0 0 30px', fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.7, color: 'rgba(65,66,66,.72)', maxWidth: '600px' }}>
              Most people know something is off without being able to name which part of life it is coming from. Through questions, tasks and guided activities, LEWIS understands how things honestly feel right now, and reflects it back across nine connected areas of life. Non-clinical, and never a diagnosis.
            </p>
            <div data-row="ctas" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={handleNext} data-cta="1" className="landing-primary-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '19px 32px', fontSize: '16px' }}>
                Start LEWIS <Icon name="arrow" size={18} />
              </button>
              <a href="#what-is-lewis" onClick={(e) => scrollTo(e, 'what-is-lewis')} data-cta="1" className="landing-secondary-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '19px 28px', fontSize: '16px' }}>
                What LEWIS is
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            {HERO_PILLS.map((p) => (
              <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f4f4f4', borderRadius: '14px', padding: '19px 22px' }}>
                <span style={{ color: '#00ae9d', display: 'inline-flex', flexShrink: 0 }}><Icon name={p.icon} size={21} /></span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#414242' }}>{p.text}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#d6edea', borderRadius: '14px', padding: '19px 22px' }}>
              <span style={{ color: '#00776a', display: 'inline-flex', flexShrink: 0 }}><Icon name="sparkles" size={21} /></span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#414242' }}>Start free &middot; complete report &#8377;399</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS LEWIS */}
      <section id="what-is-lewis" style={{ background: '#f4f4f4', padding: 'clamp(56px,8vw,92px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <p style={eyebrowStyle()}>What is LEWIS</p>
          <div data-row="lede" ref={addToRefs} className="landing-reveal-element" style={{
            display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
            alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
          }}>
            <h2 style={sectionH2Style}>A reflection, not a verdict.</h2>
            <p style={{ margin: 0, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'rgba(65,66,66,.75)' }}>
              LEWIS, the Lifed Everyday Wellbeing Intelligence System, is Lifed&rsquo;s non-clinical wellbeing reflection tool. It understands how life feels for you right now, reflects it back across nine connected areas, then names one small place to start.
            </p>
          </div>
          <div data-row="three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {WHAT_CARDS.map((c) => (
              <div key={c.title} ref={addToRefs} className="landing-reveal-element" style={flatCardStyle}>
                <IconBadge name={c.icon} />
                <h3 style={{ margin: '0 0 9px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', color: '#414242' }}>{c.title}</h3>
                <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.68, color: 'rgba(65,66,66,.72)' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NINE AREAS */}
      <section id="areas" style={{ background: '#ffffff', padding: 'clamp(56px,8vw,92px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <p style={eyebrowStyle()}>The nine areas</p>
          <div data-row="lede" ref={addToRefs} className="landing-reveal-element" style={{
            display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
            alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
          }}>
            <h2 style={sectionH2Style}>Nine areas of everyday wellbeing.</h2>
            <p style={{ margin: 0, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'rgba(65,66,66,.75)' }}>
              One area on its own says very little. Read together, they usually explain the feeling you arrived with.
            </p>
          </div>
          <div data-row="nine" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {DOMAINS.map((d) => (
              <div key={d.name} ref={addToRefs} className="landing-reveal-element landing-domain-card" style={{
                background: '#f4f4f4', border: '1.5px solid transparent', borderRadius: '16px', padding: '26px', display: 'flex', gap: '16px', alignItems: 'flex-start',
              }}>
                <span style={{ color: '#00ae9d', display: 'inline-flex', flexShrink: 0, marginTop: '2px' }}><Icon name={d.iconKey} size={22} /></span>
                <div>
                  <h3 style={{ margin: '0 0 5px', fontSize: '17px', fontWeight: 800, color: '#414242' }}>{d.name}</h3>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'rgba(65,66,66,.68)' }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research" style={{ background: '#d6edea', padding: 'clamp(56px,8vw,92px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <p style={eyebrowStyle('#00776a')}>The science and research</p>
          <div data-row="lede" ref={addToRefs} className="landing-reveal-element" style={{
            display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
            alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
          }}>
            <h2 style={sectionH2Style}>What LEWIS is built on.</h2>
            <p style={{ margin: 0, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'rgba(65,66,66,.78)' }}>
              Established self-report research where it exists, and honesty about the parts that are reflection rather than measurement.
            </p>
          </div>
          <div data-row="three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {RESEARCH_CARDS.map((c) => (
              <div key={c.title} ref={addToRefs} className="landing-reveal-element" style={flatCardStyle}>
                <IconBadge name={c.icon} iconSize={24} />
                <h3 style={{ margin: '0 0 9px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', color: '#414242' }}>{c.title}</h3>
                <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.68, color: 'rgba(65,66,66,.72)' }}>{c.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '24px 0 0', fontSize: '15px', lineHeight: 1.7, color: 'rgba(65,66,66,.66)', maxWidth: '840px' }}>
            LEWIS makes no claim about hormones, brain states or heart rhythms. It does not detect, name, treat or prevent any condition, and it is not a substitute for professional care.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="questions" style={{ background: '#ffffff', padding: 'clamp(56px,8vw,92px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <p style={eyebrowStyle()}>Good to know</p>
          <h2 style={{ ...sectionH2Style, marginBottom: 'clamp(28px,4vw,44px)' }}>Questions, answered.</h2>
          <div style={{ maxWidth: '900px', borderTop: '1px solid #f4f4f4' }}>
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0} style={{ borderBottom: '1px solid #f4f4f4' }}>
                <summary style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px',
                  padding: '22px 0', fontSize: 'clamp(16px,1.7vw,18px)', fontWeight: 800, color: '#414242',
                }}>
                  {f.q}
                  <span data-plus="1" style={{ color: '#00ae9d', fontSize: '24px', fontWeight: 700, lineHeight: 1, flexShrink: 0 }} />
                </summary>
                <p style={{ margin: 0, padding: '0 40px 24px 0', fontSize: '16px', lineHeight: 1.72, color: 'rgba(65,66,66,.72)' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="start" style={{ background: '#f4f4f4', padding: 'clamp(56px,8vw,96px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div ref={addToRefs} className="landing-reveal-element" style={{ background: '#ffffff', borderRadius: '24px', padding: 'clamp(32px,5vw,60px)' }}>
            <p style={eyebrowStyle()}>Ready when you are</p>
            <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(28px,4.2vw,44px)', lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.028em', color: '#414242', maxWidth: '740px', fontFamily: "'Nunito', sans-serif" }}>
              Let&rsquo;s take an honest look at how life feels right now.
            </h2>
            <p style={{ margin: '0 0 30px', fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'rgba(65,66,66,.72)', maxWidth: '600px' }}>
              No right answers, just your reflection, gently guided. Begin at no cost. Your complete report, around 20 pages, is &#8377;399.
            </p>
            <button onClick={handleNext} data-cta="1" className="landing-primary-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '19px 32px', fontSize: '16px' }}>
              Start LEWIS <Icon name="arrow" size={18} />
            </button>
            <p style={{ margin: '24px 0 0', fontSize: '13px', lineHeight: 1.65, color: 'rgba(65,66,66,.55)' }}>
              For adults 18 and over. LEWIS is non-clinical, does not diagnose, and does not replace professional care.
            </p>
          </div>
        </div>
      </section>

      <LewisFooter />
    </motion.div>
  )
}
