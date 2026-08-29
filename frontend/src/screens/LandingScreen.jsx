import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import LewisLogo from '../components/LewisLogo.jsx'
import LewisFooter from '../components/LewisFooter.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'
import LewisHeroIllustration from '../components/LewisHeroIllustration.jsx'
import TopFrameworkPills from '../components/TopFrameworkPills.jsx'
import Icon from '../report/icons.jsx'
import './landing.css'

const NAV_LINKS = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'research', label: 'The research' },
]

const WHAT_CARDS = [
  { icon: 'waves', title: 'Questions, tasks and activities', desc: 'A body map, a breathing minute, a sound check, a few quick choices. What you do counts as much as what you say.' },
  { icon: 'brain', title: 'Nine areas, read together', desc: 'Lewis sees which areas are moving together and where a small effort reaches furthest. Leverage, never a claim about cause.' },
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
  { icon: 'refresh', title: 'Traceable, not generated', desc: 'Everything Lewis tells you maps back to your own answers and efforts. Where the picture is thin, it says so rather than guessing.' },
]

const FAQS = [
  { q: 'What is Lewis?', a: "Lewis, the Lifed Everyday Wellbeing Intelligence System, is Lifed's non-clinical wellbeing reflection tool. Through questions, tasks and guided activities, it understands how life feels for you right now and reflects it back across nine connected areas of everyday wellbeing. It takes 12 to 15 minutes, and it does not diagnose." },
  { q: 'How long does Lewis take?', a: '12 to 15 minutes, taken at your own pace in one sitting.' },
  { q: 'What does Lewis cost?', a: 'Starting Lewis costs nothing. Your complete reflection and full breakdown is available to start immediately.' },
  { q: 'Is it only questions?', a: 'No. Alongside the questions there are short tasks and guided activities, including a body map, a breathing minute, a sound check and a few quick choices. What you do in them adds to the picture as much as what you answer.' },
  { q: 'Is Lewis a medical or mental health assessment?', a: 'No. Lewis is non-clinical. It does not diagnose, treat or measure any condition, and it is not a replacement for professional care. It is a structured reflection, not a verdict.' },
  { q: 'What are the nine areas of wellbeing?', a: 'Physical & Regeneration, Emotional & Mental, Engagement & Energy, Relationships & Social, Meaning & Spiritual, Accomplishment & Agency, Financial Wellness, Intellectual & Growth, and Environmental & Cultural.' },
  { q: 'What is the research behind Lewis?', a: 'Each of the nine areas is anchored to established, peer-reviewed self-report research, and the wording of those questions is never altered. The tasks and activities alongside them can shade a reading only when they agree with it, never create one.' },
  { q: 'Who can use Lewis, and do I need a wearable?', a: 'Lewis is for adults aged 18 and over, and it confirms your age before it begins. No wearable or connected device is involved. Lewis works from your own answers and efforts, and makes no claims about hormones, brain states or heart-rate patterns.' },
]

const BLOG_ARTICLES = [
  {
    id: 1,
    title: 'Why Wellbeing Cannot Be Captured in a Single Number',
    category: 'Research & Methodology',
    readTime: '5 min read',
    date: 'August 2026',
    author: 'Lifed Research Team',
    excerpt: 'Composite scores often hide the very strain they set out to measure. How reading nine distinct domains together provides actionable leverage without clinical verdicts.',
    tags: ['Psychometrics', 'Evidence-Based', 'Self-Reflection'],
  },
  {
    id: 2,
    title: 'Cross-Domain Spillover: How Sleep & Mental Load Move in Loops',
    category: 'Wellbeing Science',
    readTime: '6 min read',
    date: 'July 2026',
    author: 'Dr. S. Nair, Cognitive Science',
    excerpt: 'Examining the mutual influence between emotional pressure and physical regeneration. When to protect the anchor practice rather than forcing more tasks.',
    tags: ['Recovery', 'Sleep Science', 'Nervous System'],
  },
  {
    id: 3,
    title: 'The Evidence Behind 12-Minute Reflective Interventions',
    category: 'Behavioral Psychology',
    readTime: '4 min read',
    date: 'June 2026',
    author: 'Lifed Editorial',
    excerpt: 'A review of validated self-report scales (PSQI, PANAS, WHO-5) and why interactive micro-tasks ground subjective reflection in real-time texture.',
    tags: ['Clinical Validity', 'Micro-Interventions', 'Habits'],
  },
  {
    id: 4,
    title: 'Designing for Gentle Follow-Through in Crowded Weeks',
    category: 'Practice & Routine',
    readTime: '4 min read',
    date: 'May 2026',
    author: 'Lifed Practice Team',
    excerpt: 'Why oversized wellbeing plans fail in the first demanding week, and how micro-anchors build sustained resilience without performance tracking.',
    tags: ['Habit Formation', 'Resilience', 'Rest'],
  },
]

const eyebrowStyle = (color = '#00ae9d') => ({
  margin: '0 0 18px', fontSize: '14px', fontWeight: 800, letterSpacing: '0.16em',
  textTransform: 'uppercase', color, fontFamily: "'Nunito', sans-serif",
})

const sectionH2Style = {
  margin: 0, fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, fontWeight: 800,
  letterSpacing: '-0.025em', color: '#414242', fontFamily: "'Nunito', sans-serif",
}

const flatCardStyle = {
  background: '#ffffff', borderRadius: '18px', padding: 'clamp(24px, 3vw, 32px)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
  border: '1px solid #f0f0f0',
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
  // Active page tab: 'home' | 'how-it-works' | 'research'
  const [activePage, setActivePage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const handleNext = (e) => {
    if (e) e.preventDefault()
    setMobileMenuOpen(false)
    setScreen('stage1_0About')
  }

  const navigateTo = (e, pageId) => {
    if (e) e.preventDefault()
    const target = pageId === 'blogs' ? 'research' : pageId
    setActivePage(target)
    setSelectedArticle(null)
    setMobileMenuOpen(false)
    const wrapper = document.querySelector('.landing-screen-wrapper')
    if (wrapper) wrapper.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      className="landing-screen-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* STICKY NAV */}
      <header className="landing-sticky-header">
        <div className="landing-header-inner">
          <button
            onClick={(e) => navigateTo(e, 'home')}
            className="landing-logo-btn"
            aria-label="Lewis Home"
          >
            <LewisLogo size={30} showText={true} />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="landing-desktop-nav" data-nav="1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={(e) => navigateTo(e, l.id)}
                data-nav-link="1"
                className={`landing-nav-link ${activePage === l.id || (l.id === 'research' && activePage === 'blogs') ? 'active' : ''}`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger Menu Button */}
          <button
            className="landing-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={20} />
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="landing-mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <div className="landing-mobile-drawer-content">
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={(e) => navigateTo(e, l.id)}
                    className={`landing-mobile-drawer-link ${activePage === l.id ? 'active' : ''}`}
                  >
                    <span>{l.label}</span>
                    {activePage === l.id && (
                      <span style={{ color: '#00ae9d', fontWeight: 800 }}>•</span>
                    )}
                  </button>
                ))}
                <div className="landing-mobile-drawer-cta">
                  <button
                    onClick={handleNext}
                    className="landing-primary-btn"
                    style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', fontSize: '15px' }}
                  >
                    Begin your reflection <Icon name="arrow" size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* TOP SCIENTIFIC FRAMEWORK PILLS CAROUSEL */}
      <TopFrameworkPills onExploreMethodology={(e) => navigateTo(e, 'research')} />

      {/* DEDICATED PAGE VIEWS */}
      <AnimatePresence mode="wait">
        {/* ── 1. HOME VIEW ── */}
        {activePage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* SECTION 1: HERO */}
            <section id="top" style={{ position: 'relative', overflow: 'hidden', background: '#ffffff', padding: 'clamp(56px,8vw,90px) clamp(20px,4vw,40px) clamp(48px,6vw,72px)' }}>
              <AbstractLineBackground variant="contours" opacity={0.08} />
              <div data-row="hero" style={{
                position: 'relative', zIndex: 1,
                maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr',
                gap: 'clamp(32px,5vw,64px)', alignItems: 'center',
              }}>
                <div>
                  <p style={eyebrowStyle()}>SCIENCE-BASED VIEW OF HOW YOU ARE LIVING</p>
                  <h1 style={{
                    margin: '0 0 22px', fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.12, fontWeight: 800,
                    letterSpacing: '-0.025em', color: '#414242', fontFamily: "'Nunito', sans-serif",
                  }}>
                    <span style={{ display: 'block' }}>Understand your wellbeing,</span>
                    <span style={{ display: 'block' }}>and exactly where to start.</span>
                  </h1>
                  <p style={{ margin: '0 0 28px', fontSize: 'clamp(18px,1.8vw,21px)', lineHeight: 1.7, color: 'rgba(65,66,66,.72)', maxWidth: '580px' }}>
                    LEWIS reads nine areas of your life together and turns what it finds into a plan you can actually follow. Twelve minutes, free to start.
                  </p>
                  <div data-row="ctas" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '30px' }}>
                    <button onClick={handleNext} data-cta="1" className="landing-primary-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px 34px', fontSize: '18px', fontWeight: 700 }}>
                      Begin your reflection
                    </button>
                    <button
                      onClick={(e) => navigateTo(e, 'how-it-works')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#414242',
                        padding: '8px 12px',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00ae9d'
                        const circle = e.currentTarget.querySelector('.arrow-circle')
                        if (circle) circle.style.borderColor = '#00ae9d'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#414242'
                        const circle = e.currentTarget.querySelector('.arrow-circle')
                        if (circle) circle.style.borderColor = '#dcdcdc'
                      }}
                    >
                      <span>How Lewis works</span>
                      <span className="arrow-circle" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '1px solid #dcdcdc',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease',
                      }}>
                        &rarr;
                      </span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LewisHeroIllustration />
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ── 2. "HOW IT WORKS" UNIFIED HUB (What is Lewis + Nine Areas + Science + FAQs) ── */}
        {activePage === 'how-it-works' && (
          <motion.div
            key="how-it-works"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* SUB-SECTION 1: WHAT IS LEWIS */}
            <section style={{ position: 'relative', overflow: 'hidden', background: '#f8faf9', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px) clamp(40px,5vw,60px)' }}>
              <AbstractLineBackground variant="waves" opacity={0.06} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <button
                  onClick={(e) => navigateTo(e, 'home')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none',
                    border: 'none', color: '#00ae9d', fontWeight: 700, fontSize: '14px',
                    cursor: 'pointer', marginBottom: '20px', padding: 0
                  }}
                >
                  &larr; Back to Home
                </button>
                <p style={eyebrowStyle()}>How it works</p>
                <div data-row="lede" style={{
                  display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
                  alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
                }}>
                  <h2 style={sectionH2Style}>A reflection, not a verdict.</h2>
                  <p style={{ margin: 0, fontSize: 'clamp(18px,1.7vw,20px)', lineHeight: 1.7, color: 'rgba(65,66,66,.75)' }}>
                    Lewis, the Lifed Everyday Wellbeing Intelligence System, is Lifed&rsquo;s non-clinical wellbeing reflection tool. It understands how life feels for you right now, reflects it back across nine connected areas, then names one small place to start.
                  </p>
                </div>
                <div data-row="three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '16px' }}>
                  {WHAT_CARDS.map((c) => (
                    <div key={c.title} style={flatCardStyle}>
                      <IconBadge name={c.icon} />
                      <h3 style={{ margin: '0 0 9px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', color: '#414242' }}>{c.title}</h3>
                      <p style={{ margin: 0, fontSize: '16.5px', lineHeight: 1.68, color: 'rgba(65,66,66,.72)' }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SUB-SECTION 2: NINE AREAS */}
            <section style={{ position: 'relative', overflow: 'hidden', background: '#ffffff', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)' }}>
              <AbstractLineBackground variant="arcs" opacity={0.07} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <p style={eyebrowStyle()}>The nine areas</p>
                <div data-row="lede" style={{
                  display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
                  alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
                }}>
                  <h2 style={sectionH2Style}>Nine areas of everyday wellbeing.</h2>
                  <p style={{ margin: 0, fontSize: 'clamp(18px,1.7vw,20px)', lineHeight: 1.7, color: 'rgba(65,66,66,.75)' }}>
                    One area on its own says very little. Read together, they usually explain the feeling you arrived with.
                  </p>
                </div>
                <div data-row="nine" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '16px' }}>
                  {DOMAINS.map((d) => (
                    <div key={d.name} className="landing-domain-card" style={{
                      background: '#f8faf9', borderRadius: '16px', padding: '26px', display: 'flex', gap: '16px', alignItems: 'flex-start',
                      border: '1px solid #eef2f0'
                    }}>
                      <span style={{ color: '#00ae9d', display: 'inline-flex', flexShrink: 0, marginTop: '2px' }}><Icon name={d.iconKey} size={22} /></span>
                      <div>
                        <h3 style={{ margin: '0 0 5px', fontSize: '18px', fontWeight: 800, color: '#414242' }}>{d.name}</h3>
                        <p style={{ margin: 0, fontSize: '15.5px', lineHeight: 1.6, color: 'rgba(65,66,66,.68)' }}>{d.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SUB-SECTION 3: SCIENCE & RESEARCH FOUNDATION */}
            <section style={{ position: 'relative', overflow: 'hidden', background: '#d6edea', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)' }}>
              <AbstractLineBackground variant="nodes" opacity={0.12} color="#00776a" />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <p style={eyebrowStyle('#00776a')}>The science and research</p>
                <div data-row="lede" style={{
                  display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
                  alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
                }}>
                  <h2 style={sectionH2Style}>What Lewis is built on.</h2>
                  <p style={{ margin: 0, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'rgba(65,66,66,.78)' }}>
                    Established self-report research where it exists, and honesty about the parts that are reflection rather than measurement.
                  </p>
                </div>
                <div data-row="three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
                  {RESEARCH_CARDS.map((c) => (
                    <div key={c.title} style={flatCardStyle}>
                      <IconBadge name={c.icon} size={24} iconSize={24} />
                      <h3 style={{ margin: '0 0 9px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', color: '#414242' }}>{c.title}</h3>
                      <p style={{ margin: 0, fontSize: '16.5px', lineHeight: 1.68, color: 'rgba(65,66,66,.72)' }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '0', fontSize: '16px', lineHeight: 1.7, color: 'rgba(65,66,66,.66)', maxWidth: '840px' }}>
                  Lewis makes no claim about hormones, brain states or heart rhythms. It does not detect, name, treat or prevent any condition, and it is not a substitute for professional care.
                </p>
              </div>
            </section>

            {/* SUB-SECTION 4: QUESTIONS & FAQS */}
            <section style={{ background: '#ffffff', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)' }}>
              <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
                <p style={eyebrowStyle()}>Good to know</p>
                <h2 style={{ ...sectionH2Style, marginBottom: 'clamp(28px,4vw,44px)' }}>Questions, answered.</h2>
                <div style={{ maxWidth: '900px', borderTop: '1px solid #f4f4f4', marginBottom: '44px' }}>
                  {FAQS.map((f, i) => (
                    <details key={f.q} open={i === 0} style={{ borderBottom: '1px solid #f4f4f4' }}>
                      <summary style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px',
                        padding: '22px 0', fontSize: 'clamp(18px,1.7vw,20px)', fontWeight: 800, color: '#414242',
                      }}>
                        {f.q}
                        <span data-plus="1" style={{ color: '#00ae9d', fontSize: '24px', fontWeight: 700, lineHeight: 1, flexShrink: 0 }} />
                      </summary>
                      <p style={{ margin: 0, padding: '0 40px 24px 0', fontSize: '17.5px', lineHeight: 1.72, color: 'rgba(65,66,66,.72)' }}>{f.a}</p>
                    </details>
                  ))}
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #eaf7f5 0%, #f4faf9 100%)',
                  borderRadius: '24px',
                  padding: 'clamp(32px, 5vw, 48px)',
                  textAlign: 'center',
                  border: '1px solid rgba(0, 174, 157, 0.2)',
                }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 800, color: '#414242' }}>
                    Ready to understand your wellbeing?
                  </h3>
                  <p style={{ margin: '0 0 24px', fontSize: '16px', color: '#657370', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Twelve minutes, nine connected areas, and a personalized plan designed for your real life.
                  </p>
                  <button onClick={handleNext} className="landing-primary-btn" style={{ padding: '16px 36px', fontSize: '16px', fontWeight: 700 }}>
                    Begin your reflection &rarr;
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ── 3. "THE RESEARCH / BLOG" PAGE ── */}
        {(activePage === 'research' || activePage === 'blogs') && (
          <motion.div
            key="research-blog"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <section style={{ position: 'relative', overflow: 'hidden', background: '#f8faf9', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)' }}>
              <AbstractLineBackground variant="waves" opacity={0.06} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <button
                  onClick={(e) => navigateTo(e, 'home')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none',
                    border: 'none', color: '#00ae9d', fontWeight: 700, fontSize: '14px',
                    cursor: 'pointer', marginBottom: '20px', padding: 0
                  }}
                >
                  &larr; Back to Home
                </button>
                <p style={eyebrowStyle()}>Research &amp; Perspectives</p>
                <div data-row="lede" style={{
                  display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
                  alignItems: 'start', marginBottom: 'clamp(36px,4vw,52px)',
                }}>
                  <h2 style={sectionH2Style}>The Research Blog.</h2>
                  <p style={{ margin: 0, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'rgba(65,66,66,.75)' }}>
                    Explorations into measurement validity, cross-domain wellbeing dynamics, and evidence-based restorative practices from Lifed.
                  </p>
                </div>

                {/* Article Modal / Detail View */}
                <AnimatePresence>
                  {selectedArticle && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        background: '#ffffff',
                        borderRadius: '24px',
                        padding: 'clamp(28px, 4vw, 44px)',
                        border: '1.5px solid rgba(0, 174, 157, 0.25)',
                        boxShadow: '0 12px 36px rgba(0, 174, 157, 0.08)',
                        marginBottom: '40px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#00ae9d', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                          {selectedArticle.category} · {selectedArticle.readTime}
                        </span>
                        <button
                          onClick={() => setSelectedArticle(null)}
                          style={{
                            background: '#f4f6f5',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            color: '#657370',
                            fontSize: '14px',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <h3 style={{ margin: '0 0 16px', fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 800, color: '#414242' }}>
                        {selectedArticle.title}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#85918e', marginBottom: '24px' }}>
                        {selectedArticle.author} · {selectedArticle.date}
                      </div>
                      <div style={{ fontSize: '16.5px', lineHeight: 1.8, color: '#52605d', borderTop: '1px solid #f0f2f1', paddingTop: '20px' }}>
                        <p style={{ marginTop: 0, marginBottom: '16px' }}>
                          {selectedArticle.excerpt}
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                          In contemporary wellbeing research, reductionist models often attempt to compress complex human experience into a single aggregate score. While numbers provide ease of classification, they routinely obscure the intricate tensions between domains—such as when high professional agency masks an acute deficit in physical restoration.
                        </p>
                        <p style={{ marginBottom: '24px' }}>
                          LEWIS addresses this through multi-domain topological reflection: mapping nine interconnected areas alongside real-time behavioral cues. Rather than assigning clinical diagnostic labels, the focus remains squarely on actionable leverage—identifying the exact micro-practice where minimal effort yields maximal restorative cascade.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                        {selectedArticle.tags.map((tag) => (
                          <span key={tag} style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '999px',
                            background: '#eaf7f5',
                            color: '#00ae9d',
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={handleNext}
                        className="landing-primary-btn"
                        style={{ padding: '12px 28px', fontSize: '14px' }}
                      >
                        Try Lewis Reflection &rarr;
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Blog Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                  gap: '24px',
                  marginBottom: '48px',
                }}>
                  {BLOG_ARTICLES.map((article) => (
                    <motion.article
                      key={article.id}
                      whileHover={{ y: -4 }}
                      style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '30px 26px',
                        border: '1px solid #eef2f0',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onClick={() => setSelectedArticle(article)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 174, 157, 0.4)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 174, 157, 0.08)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#eef2f0'
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#00ae9d', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                            {article.category}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94a39f' }}>
                            {article.readTime}
                          </span>
                        </div>
                        <h3 style={{ margin: '0 0 12px', fontSize: '19px', fontWeight: 800, lineHeight: 1.35, color: '#414242' }}>
                          {article.title}
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(65,66,66,.72)' }}>
                          {article.excerpt}
                        </p>
                      </div>

                      <div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                          {article.tags.map((t) => (
                            <span key={t} style={{
                              fontSize: '11.5px',
                              fontWeight: 600,
                              padding: '3px 10px',
                              borderRadius: '999px',
                              background: '#f4f6f5',
                              color: '#657370',
                            }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#00ae9d',
                          fontWeight: 700,
                          fontSize: '14px',
                        }}>
                          <span>Read article</span>
                          <span>&rarr;</span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Newsletter / Research Updates Subscription Box */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #eef2f0',
                  padding: 'clamp(36px, 5vw, 48px)',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0, 174, 157, 0.05)',
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    background: '#eaf7f5',
                    color: '#00ae9d',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}>
                    <Icon name="sparkles" size={26} />
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, color: '#414242' }}>
                    Occasional Wellbeing Research
                  </h3>
                  <p style={{ margin: '0 auto 24px', fontSize: '15px', color: '#657370', maxWidth: '480px', lineHeight: 1.6 }}>
                    New methodology notes, peer-reviewed findings, and practical wellbeing practices published monthly.
                  </p>
                  <button onClick={handleNext} className="landing-primary-btn" style={{ padding: '14px 32px', fontSize: '15px' }}>
                    Begin reflection &rarr;
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <LewisFooter />
    </motion.div>
  )
}


