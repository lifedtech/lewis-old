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

const eyebrowStyle = (color = 'var(--lp-brand-text, #00ae9d)') => ({
  margin: '0 0 18px', fontSize: '14px', fontWeight: 800, letterSpacing: '0.16em',
  textTransform: 'uppercase', color, fontFamily: "'Nunito', sans-serif",
})

const sectionH2Style = {
  margin: 0, fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, fontWeight: 800,
  letterSpacing: '-0.025em', color: 'var(--lp-text-primary, #414242)', fontFamily: "'Nunito', sans-serif",
}

const flatCardStyle = {
  background: 'var(--lp-card, #ffffff)', borderRadius: '18px', padding: 'clamp(24px, 3vw, 32px)',
  boxShadow: 'var(--lp-shadow, 0 2px 12px rgba(0,0,0,0.03))',
  border: '1px solid var(--lp-card-border, #f0f0f0)',
}

function IconBadge({ name, iconSize = 22, color = 'var(--lp-brand-text, #00ae9d)' }) {
  return (
    <div style={{ color, marginBottom: '20px' }}>
      <Icon name={name} size={iconSize} />
    </div>
  )
}

function ThemeToggle({ theme, toggleTheme, compact = false }) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      className="landing-theme-toggle-btn"
      aria-label={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
    >
      <span className="theme-icon-wrap">
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#38C9B7' }}>
            <circle cx="12" cy="12" r="4.5" fill="rgba(56, 201, 183, 0.25)" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00ae9d' }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>
      {!compact && (
        <span>
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  )
}

export default function LandingScreen() {
  const { setScreen, theme, toggleTheme } = useLewisStore()
  const isDark = theme === 'dark'

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
      className={`landing-screen-wrapper ${isDark ? 'dark' : ''}`}
      data-theme={theme || 'light'}
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
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <LewisLogo size={30} showText={true} inverted={isDark} />
          </button>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

            {/* Desktop Theme Mode Switcher */}
            <div className="landing-desktop-theme-toggle hide-on-mobile">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="landing-mobile-controls">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} compact={true} />
            <button
              className="landing-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} size={20} />
            </button>
          </div>
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
                      <span style={{ color: 'var(--lp-brand-text, #00ae9d)', fontWeight: 800 }}>•</span>
                    )}
                  </button>
                ))}

                <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--lp-text-secondary)' }}>Appearance</span>
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>

                <div className="landing-mobile-drawer-cta">
                  <button
                    onClick={handleNext}
                    className="landing-primary-btn btn-primary"
                    style={{
                      width: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 20px',
                      fontSize: '15px',
                      fontWeight: 700,
                      background: '#00ae9d',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '999px',
                      boxShadow: '0 4px 18px rgba(0, 174, 157, 0.35)'
                    }}
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
            <section id="top" style={{ position: 'relative', overflow: 'hidden', background: 'var(--lp-page-bg, #ffffff)', padding: 'clamp(56px,8vw,90px) clamp(20px,4vw,40px) clamp(48px,6vw,72px)' }}>
              <AbstractLineBackground variant="contours" opacity={isDark ? 0.12 : 0.08} color={isDark ? '#38C9B7' : '#00ae9d'} />
              <div data-row="hero" style={{
                position: 'relative', zIndex: 1,
                maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr',
                gap: 'clamp(32px,5vw,64px)', alignItems: 'center',
              }}>
                <div>
                  <p style={eyebrowStyle()}>SCIENCE-BASED VIEW OF HOW YOU ARE LIVING</p>
                  <h1 style={{
                    margin: '0 0 22px', fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.12, fontWeight: 800,
                    letterSpacing: '-0.025em', color: 'var(--lp-text-primary, #414242)', fontFamily: "'Nunito', sans-serif",
                  }}>
                    <span style={{ display: 'block' }}>Understand your wellbeing,</span>
                    <span style={{ display: 'block' }}>and exactly where to start.</span>
                  </h1>
                  <p style={{ margin: '0 0 28px', fontSize: 'clamp(18px,1.8vw,21px)', lineHeight: 1.7, color: 'var(--lp-text-secondary, rgba(65,66,66,.72))', maxWidth: '580px' }}>
                    LEWIS reads nine areas of your life together and turns what it finds into a plan you can actually follow. Twelve minutes, free to start.
                  </p>
                  <div data-row="ctas" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '30px' }}>
                    <button
                      onClick={handleNext}
                      data-cta="1"
                      className="landing-primary-btn btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '16px 34px',
                        fontSize: '18px',
                        fontWeight: 700,
                        background: '#00ae9d',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 18px rgba(0, 174, 157, 0.35)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      Begin your reflection
                    </button>
                    <button
                      className="landing-ghost-btn"
                      onClick={(e) => navigateTo(e, 'how-it-works')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'transparent',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: 'var(--lp-text-primary, #414242)',
                        padding: '8px 12px',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Nunito', sans-serif",
                        outline: 'none',
                        boxShadow: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--lp-brand-text, #00ae9d)'
                        const circle = e.currentTarget.querySelector('.arrow-circle')
                        if (circle) circle.style.borderColor = 'var(--lp-brand-text, #00ae9d)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--lp-text-primary, #414242)'
                        const circle = e.currentTarget.querySelector('.arrow-circle')
                        if (circle) circle.style.borderColor = 'var(--lp-border-strong, #dcdcdc)'
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
                        border: '1px solid var(--lp-border-strong, #dcdcdc)',
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
            <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--lp-page-alt, #f8faf9)', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px) clamp(40px,5vw,60px)' }}>
              <AbstractLineBackground variant="waves" opacity={isDark ? 0.10 : 0.06} color={isDark ? '#38C9B7' : '#00ae9d'} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <button
                  onClick={(e) => navigateTo(e, 'home')}
                  className="landing-back-home-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent',
                    backgroundColor: 'transparent', border: 'none', color: 'var(--lp-brand-text, #00ae9d)',
                    fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0,
                    outline: 'none', boxShadow: 'none',
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
                  <p style={{ margin: 0, fontSize: 'clamp(18px,1.7vw,20px)', lineHeight: 1.7, color: 'var(--lp-text-secondary, rgba(65,66,66,.75))' }}>
                    Lewis, the Lifed Everyday Wellbeing Intelligence System, is Lifed&rsquo;s non-clinical wellbeing reflection tool. It understands how life feels for you right now, reflects it back across nine connected areas, then names one small place to start.
                  </p>
                </div>
                <div data-row="three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '16px' }}>
                  {WHAT_CARDS.map((c) => (
                    <div key={c.title} style={flatCardStyle}>
                      <IconBadge name={c.icon} />
                      <h3 style={{ margin: '0 0 9px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--lp-text-primary, #414242)' }}>{c.title}</h3>
                      <p style={{ margin: 0, fontSize: '16.5px', lineHeight: 1.68, color: 'var(--lp-text-secondary, rgba(65,66,66,.72))' }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SUB-SECTION 2: NINE AREAS */}
            <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--lp-page-bg, #ffffff)', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)' }}>
              <AbstractLineBackground variant="arcs" opacity={isDark ? 0.12 : 0.07} color={isDark ? '#38C9B7' : '#00ae9d'} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <p style={eyebrowStyle()}>The nine areas</p>
                <div data-row="lede" style={{
                  display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
                  alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
                }}>
                  <h2 style={sectionH2Style}>Nine areas of everyday wellbeing.</h2>
                  <p style={{ margin: 0, fontSize: 'clamp(18px,1.7vw,20px)', lineHeight: 1.7, color: 'var(--lp-text-secondary, rgba(65,66,66,.75))' }}>
                    One area on its own says very little. Read together, they usually explain the feeling you arrived with.
                  </p>
                </div>
                <div data-row="nine" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '16px' }}>
                  {DOMAINS.map((d) => (
                    <div key={d.name} className="landing-domain-card" style={{
                      borderRadius: '16px', padding: '26px', display: 'flex', gap: '16px', alignItems: 'flex-start',
                    }}>
                      <span style={{ color: 'var(--lp-brand-text, #00ae9d)', display: 'inline-flex', flexShrink: 0, marginTop: '2px' }}><Icon name={d.iconKey} size={22} /></span>
                      <div>
                        <h3 style={{ margin: '0 0 5px', fontSize: '18px', fontWeight: 800, color: 'var(--lp-text-primary, #414242)' }}>{d.name}</h3>
                        <p style={{ margin: 0, fontSize: '15.5px', lineHeight: 1.6, color: 'var(--lp-text-secondary, rgba(65,66,66,.68))' }}>{d.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SUB-SECTION 3: SCIENCE & RESEARCH FOUNDATION */}
            <section style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'var(--lp-science-bg, #d6edea)',
              borderTop: isDark ? '1px solid var(--lp-border)' : 'none',
              borderBottom: isDark ? '1px solid var(--lp-border)' : 'none',
              padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)'
            }}>
              <AbstractLineBackground variant="nodes" opacity={isDark ? 0.15 : 0.12} color={isDark ? '#38C9B7' : '#00776a'} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <p style={eyebrowStyle('var(--lp-science-text, #00776a)')}>The science and research</p>
                <div data-row="lede" style={{
                  display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,64px)',
                  alignItems: 'start', marginBottom: 'clamp(32px,4vw,48px)',
                }}>
                  <h2 style={sectionH2Style}>What Lewis is built on.</h2>
                  <p style={{ margin: 0, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'var(--lp-text-secondary, rgba(65,66,66,.78))' }}>
                    Established self-report research where it exists, and honesty about the parts that are reflection rather than measurement.
                  </p>
                </div>
                <div data-row="three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
                  {RESEARCH_CARDS.map((c) => (
                    <div key={c.title} style={flatCardStyle}>
                      <IconBadge name={c.icon} size={24} iconSize={24} color="var(--lp-brand-text, #00ae9d)" />
                      <h3 style={{ margin: '0 0 9px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--lp-text-primary, #414242)' }}>{c.title}</h3>
                      <p style={{ margin: 0, fontSize: '16.5px', lineHeight: 1.68, color: 'var(--lp-text-secondary, rgba(65,66,66,.72))' }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '0', fontSize: '16px', lineHeight: 1.7, color: 'var(--lp-text-muted, rgba(65,66,66,.66))', maxWidth: '840px' }}>
                  Lewis makes no claim about hormones, brain states or heart rhythms. It does not detect, name, treat or prevent any condition, and it is not a substitute for professional care.
                </p>
              </div>
            </section>

            {/* SUB-SECTION 4: QUESTIONS & FAQS */}
            <section style={{ background: 'var(--lp-page-bg, #ffffff)', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)' }}>
              <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
                <p style={eyebrowStyle()}>Good to know</p>
                <h2 style={{ ...sectionH2Style, marginBottom: 'clamp(28px,4vw,44px)' }}>Questions, answered.</h2>
                <div style={{ maxWidth: '900px', borderTop: '1px solid var(--lp-faq-border, #f4f4f4)', marginBottom: '44px' }}>
                  {FAQS.map((f, i) => (
                    <details key={f.q} open={i === 0} style={{ borderBottom: '1px solid var(--lp-faq-border, #f4f4f4)' }}>
                      <summary style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px',
                        padding: '22px 0', fontSize: 'clamp(18px,1.7vw,20px)', fontWeight: 800, color: 'var(--lp-text-primary, #414242)',
                      }}>
                        {f.q}
                        <span data-plus="1" style={{ color: 'var(--lp-brand-text, #00ae9d)', fontSize: '24px', fontWeight: 700, lineHeight: 1, flexShrink: 0 }} />
                      </summary>
                      <p style={{ margin: 0, padding: '0 40px 24px 0', fontSize: '17.5px', lineHeight: 1.72, color: 'var(--lp-text-secondary, rgba(65,66,66,.72))' }}>{f.a}</p>
                    </details>
                  ))}
                </div>

                <div style={{
                  background: isDark ? 'linear-gradient(135deg, #13201E 0%, #182725 100%)' : 'linear-gradient(135deg, #eaf7f5 0%, #f4faf9 100%)',
                  borderRadius: '24px',
                  padding: 'clamp(32px, 5vw, 48px)',
                  textAlign: 'center',
                  border: '1px solid var(--lp-teal-tint-border, rgba(0, 174, 157, 0.2))',
                  boxShadow: 'var(--lp-shadow)',
                }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 800, color: 'var(--lp-text-primary, #414242)' }}>
                    Ready to understand your wellbeing?
                  </h3>
                  <p style={{ margin: '0 0 24px', fontSize: '16px', color: 'var(--lp-text-secondary, #657370)', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Twelve minutes, nine connected areas, and a personalized plan designed for your real life.
                  </p>
                  <button onClick={handleNext} className="landing-primary-btn btn-primary" style={{ padding: '16px 36px', fontSize: '16px', fontWeight: 700 }}>
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
            <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--lp-page-alt, #f8faf9)', padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)' }}>
              <AbstractLineBackground variant="waves" opacity={isDark ? 0.10 : 0.06} color={isDark ? '#38C9B7' : '#00ae9d'} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
                <button
                  onClick={(e) => navigateTo(e, 'home')}
                  className="landing-back-home-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent',
                    backgroundColor: 'transparent', border: 'none', color: 'var(--lp-brand-text, #00ae9d)',
                    fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0,
                    outline: 'none', boxShadow: 'none',
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
                  <p style={{ margin: 0, fontSize: 'clamp(16px,1.6vw,18px)', lineHeight: 1.7, color: 'var(--lp-text-secondary, rgba(65,66,66,.75))' }}>
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
                        background: 'var(--lp-card, #ffffff)',
                        borderRadius: '24px',
                        padding: 'clamp(28px, 4vw, 44px)',
                        border: '1.5px solid var(--lp-teal-tint-border, rgba(0, 174, 157, 0.25))',
                        boxShadow: 'var(--lp-shadow, 0 12px 36px rgba(0, 174, 157, 0.08))',
                        marginBottom: '40px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--lp-brand-text, #00ae9d)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                          {selectedArticle.category} · {selectedArticle.readTime}
                        </span>
                        <button
                          onClick={() => setSelectedArticle(null)}
                          style={{
                            background: 'var(--lp-raised, #f4f6f5)',
                            border: '1px solid var(--lp-border, transparent)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            color: 'var(--lp-text-muted, #657370)',
                            fontSize: '14px',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <h3 style={{ margin: '0 0 16px', fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 800, color: 'var(--lp-text-primary, #414242)' }}>
                        {selectedArticle.title}
                      </h3>
                      <div style={{ fontSize: '13px', color: 'var(--lp-text-muted, #85918e)', marginBottom: '24px' }}>
                        {selectedArticle.author} · {selectedArticle.date}
                      </div>
                      <div style={{ fontSize: '16.5px', lineHeight: 1.8, color: 'var(--lp-text-secondary, #52605d)', borderTop: '1px solid var(--lp-border, #f0f2f1)', paddingTop: '20px' }}>
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
                            background: 'var(--lp-teal-tint, #eaf7f5)',
                            color: 'var(--lp-brand-text, #00ae9d)',
                            border: '1px solid var(--lp-teal-tint-border, transparent)',
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={handleNext}
                        className="landing-primary-btn btn-primary"
                        style={{
                          padding: '12px 28px',
                          fontSize: '14px',
                          fontWeight: 700,
                          background: '#00ae9d',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '999px',
                          boxShadow: '0 4px 18px rgba(0, 174, 157, 0.35)'
                        }}
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
                        background: 'var(--lp-card, #ffffff)',
                        borderRadius: '20px',
                        padding: '30px 26px',
                        border: '1px solid var(--lp-border, #eef2f0)',
                        boxShadow: 'var(--lp-shadow, 0 4px 16px rgba(0,0,0,0.03))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onClick={() => setSelectedArticle(article)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--lp-teal-tint-border, rgba(0, 174, 157, 0.4))'
                        e.currentTarget.style.boxShadow = 'var(--lp-card-hover-shadow)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--lp-border, #eef2f0)'
                        e.currentTarget.style.boxShadow = 'var(--lp-shadow, 0 4px 16px rgba(0,0,0,0.03))'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--lp-brand-text, #00ae9d)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                            {article.category}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--lp-text-muted, #94a39f)' }}>
                            {article.readTime}
                          </span>
                        </div>
                        <h3 style={{ margin: '0 0 12px', fontSize: '19px', fontWeight: 800, lineHeight: 1.35, color: 'var(--lp-text-primary, #414242)' }}>
                          {article.title}
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '14.5px', lineHeight: 1.65, color: 'var(--lp-text-secondary, rgba(65,66,66,.72))' }}>
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
                              background: 'var(--lp-raised, #f4f6f5)',
                              color: 'var(--lp-text-secondary, #657370)',
                              border: '1px solid var(--lp-border, transparent)',
                            }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--lp-brand-text, #00ae9d)',
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
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <LewisFooter />
    </motion.div>
  )
}


