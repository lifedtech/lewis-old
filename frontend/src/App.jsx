import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLewisStore } from './store/useLewisStore.js'
import LewisLogo from './components/LewisLogo.jsx'
import LewisLoadingScreen from './components/LewisLoadingScreen.jsx'
import PageTransition from './components/PageTransition.jsx'
import { useAdaptiveScreenBrain } from './hooks/useAdaptiveScreenBrain.js'

import LandingScreen from './screens/LandingScreen.jsx'
import PreStage0AgeScreen from './screens/PreStage0AgeScreen.jsx'
import AgeStopScreen from './screens/AgeStopScreen.jsx'
import Stage1_0AboutScreen from './screens/Stage1_0AboutScreen.jsx'
import Stage1_1IdentityScreen from './screens/Stage1_1IdentityScreen.jsx'
import Stage1_2StabilityScreen from './screens/Stage1_2StabilityScreen.jsx'
import Stage1_3PressuresScreen from './screens/Stage1_3PressuresScreen.jsx'
import Stage1_4BodyScreen from './screens/Stage1_4BodyScreen.jsx'
import Stage1_6RelationalScreen from './screens/Stage1_6RelationalScreen.jsx'
import Stage1_7PriorityScreen from './screens/Stage1_7PriorityScreen.jsx'
import Stage1_8ArrivalScreen from './screens/Stage1_8ArrivalScreen.jsx'
import Stage1_9FinancialScreen from './screens/Stage1_9FinancialScreen.jsx'
import Stage1_10EnvironmentScreen from './screens/Stage1_10EnvironmentScreen.jsx'
import Stage1_11IntellectualScreen from './screens/Stage1_11IntellectualScreen.jsx'
import Stage1_12CulturalScreen from './screens/Stage1_12CulturalScreen.jsx'
import Stage1_13BodyRhythmScreen from './screens/Stage1_13BodyRhythmScreen.jsx'
import Stage1_14SensoryPauseScreen from './screens/Stage1_14SensoryPauseScreen.jsx'
import Stage2AttentionScreen from './screens/Stage2AttentionScreen.jsx'
import Stage3_1AffectScreen from './screens/Stage3_1AffectScreen.jsx'
import Stage3_2BodyMapScreen from './screens/Stage3_2BodyMapScreen.jsx'
import Stage3_3DayRhythmScreen from './screens/Stage3_3DayRhythmScreen.jsx'
import Stage3_4BreathingScreen from './screens/Stage3_4BreathingScreen.jsx'
import Stage3_5NsStateScreen from './screens/Stage3_5NsStateScreen.jsx'
import Stage3_6BodyAwarenessScreen from './screens/Stage3_6BodyAwarenessScreen.jsx'
import Stage4MazeScreen from './screens/Stage4MazeScreen.jsx'
import Stage5_1LandscapeScreen from './screens/Stage5_1LandscapeScreen.jsx'
import Stage5_0EmailScreen from './screens/Stage5_0EmailScreen.jsx'
import InstrumentScreen from './screens/InstrumentScreen.jsx'
import { INSTRUMENTS } from './constants/instruments.js'
import Stage5_2InsScreen from './screens/Stage5_2InsScreen.jsx'
import Stage5_3DeepDivesScreen from './screens/Stage5_3DeepDivesScreen.jsx'
import Stage5_4BrightSpotScreen from './screens/Stage5_4BrightSpotScreen.jsx'
import Stage5_5PriorityTensionScreen from './screens/Stage5_5PriorityTensionScreen.jsx'
import Stage6SharingScreen from './screens/Stage6SharingScreen.jsx'
import Stage7_1ExternalScreen from './screens/Stage7_1ExternalScreen.jsx'
import Stage7_2PriorScreen from './screens/Stage7_2PriorScreen.jsx'
import Stage7_3AspirationScreen from './screens/Stage7_3AspirationScreen.jsx'
import Stage7_4SupportScreen from './screens/Stage7_4SupportScreen.jsx'
import Stage7_5PlannerScreen from './screens/Stage7_5PlannerScreen.jsx'
import Stage7_6ValuesScreen from './screens/Stage7_6ValuesScreen.jsx'
import Stage7_7FinancialAspScreen from './screens/Stage7_7FinancialAspScreen.jsx'
import Stage7_8FrictionScreen from './screens/Stage7_8FrictionScreen.jsx'
import Stage8_1EnergyArcScreen from './screens/Stage8_1EnergyArcScreen.jsx'
import Stage8_2StressPatternScreen from './screens/Stage8_2StressPatternScreen.jsx'
import Stage8_3RecoveryScreen from './screens/Stage8_3RecoveryScreen.jsx'
import Stage8_4CumulativeScreen from './screens/Stage8_4CumulativeScreen.jsx'
import Stage9SensoryScreen from './screens/Stage9SensoryScreen.jsx'
import Stage10GeneratingScreen from './screens/Stage10GeneratingScreen.jsx'
import MirrorScreen from './screens/MirrorScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'

// Bound once at module load so the screen map holds stable component
// identities — an inline arrow would remount the screen on every render.
const INSTRUMENT_SCREENS = Object.fromEntries(
  Object.keys(INSTRUMENTS).map((id) => {
    const Screen = () => <InstrumentScreen id={id} />
    Screen.displayName = id
    return [id, Screen]
  }),
)

const SCREENS = {
  landing: LandingScreen,
  preStage0Age: PreStage0AgeScreen,
  ageStop: AgeStopScreen, // terminal screen — deliberately not in SCREEN_ORDER
  stage1_0About: Stage1_0AboutScreen,
  stage1_1Identity: Stage1_1IdentityScreen,
  stage1_2Stability: Stage1_2StabilityScreen,
  stage1_3Pressures: Stage1_3PressuresScreen,
  stage1_4Body: Stage1_4BodyScreen,
  stage1_6Relational: Stage1_6RelationalScreen,
  stage1_7Priority: Stage1_7PriorityScreen,
  stage1_8Arrival: Stage1_8ArrivalScreen,
  stage1_9Financial: Stage1_9FinancialScreen,
  stage1_10Environment: Stage1_10EnvironmentScreen,
  stage1_11Intellectual: Stage1_11IntellectualScreen,
  stage1_12Cultural: Stage1_12CulturalScreen,
  stage1_13BodyRhythm: Stage1_13BodyRhythmScreen,
  stage1_14SensoryPause: Stage1_14SensoryPauseScreen,
  stage2Attention: Stage2AttentionScreen,
  stage3_1Affect: Stage3_1AffectScreen,
  stage3_2BodyMap: Stage3_2BodyMapScreen,
  stage3_3DayRhythm: Stage3_3DayRhythmScreen,
  stage3_4Breathing: Stage3_4BreathingScreen,
  stage3_5NsState: Stage3_5NsStateScreen,
  stage3_6BodyAwareness: Stage3_6BodyAwarenessScreen,
  stage4Maze: Stage4MazeScreen,
  stage5_1Landscape: Stage5_1LandscapeScreen,
  stage5_0Email: Stage5_0EmailScreen,
  ...INSTRUMENT_SCREENS, // the 8 stepped questionnaires (who5 + stage5_2*)
  stage5_2Ins: Stage5_2InsScreen,
  stage5_3DeepDives: Stage5_3DeepDivesScreen,
  stage5_4BrightSpot: Stage5_4BrightSpotScreen,
  stage5_5PriorityTension: Stage5_5PriorityTensionScreen,
  stage6Sharing: Stage6SharingScreen,
  stage7_1External: Stage7_1ExternalScreen,
  stage7_2Prior: Stage7_2PriorScreen,
  stage7_3Aspiration: Stage7_3AspirationScreen,
  stage7_4Support: Stage7_4SupportScreen,
  stage7_5Planner: Stage7_5PlannerScreen,
  stage7_6Values: Stage7_6ValuesScreen,
  stage7_7FinancialAsp: Stage7_7FinancialAspScreen,
  stage7_8Friction: Stage7_8FrictionScreen,
  stage8_1EnergyArc: Stage8_1EnergyArcScreen,
  stage8_2StressPattern: Stage8_2StressPatternScreen,
  stage8_3Recovery: Stage8_3RecoveryScreen,
  stage8_4Cumulative: Stage8_4CumulativeScreen,
  stage9Sensory: Stage9SensoryScreen,
  stage10Generating: Stage10GeneratingScreen,
  mirror: MirrorScreen,
  login: LoginScreen,
}

const SCREEN_ORDER = [
  'landing',
  'preStage0Age',
  'stage1_0About',
  'stage1_1Identity',
  'stage1_2Stability',
  'stage1_3Pressures',
  'stage1_4Body',
  'stage1_5Who5',
  'stage1_6Relational',
  'stage1_7Priority',
  'stage1_8Arrival',
  'stage1_9Financial',
  'stage1_10Environment',
  'stage1_11Intellectual',
  'stage1_12Cultural',
  'stage1_13BodyRhythm',
  'stage1_14SensoryPause',
  'stage2Attention',
  'stage3_1Affect',
  'stage3_2BodyMap',
  'stage3_3DayRhythm',
  'stage3_4Breathing',
  'stage3_5NsState',
  'stage3_6BodyAwareness',
  'stage4Maze',
  'stage5_1Landscape',
  'stage5_0Email',
  'stage5_2Pss10',
  'stage5_2Ucla3',
  'stage5_2Gse',
  'stage5_2Promis',
  'stage5_2Cfpb5',
  'stage5_2Diener',
  'stage5_2Ins',
  'stage5_2Swls',
  'stage5_3DeepDives',
  'stage5_4BrightSpot',
  'stage5_5PriorityTension',
  'stage6Sharing',
  'stage7_1External',
  'stage7_2Prior',
  'stage7_3Aspiration',
  'stage7_4Support',
  'stage7_5Planner',
  'stage7_6Values',
  'stage7_7FinancialAsp',
  'stage7_8Friction',
  'stage8_1EnergyArc',
  'stage8_2StressPattern',
  'stage8_3Recovery',
  'stage8_4Cumulative',
  'stage9Sensory',
  'stage10Generating',
  'mirror'
]

export default function App() {
  useAdaptiveScreenBrain()
  const { currentScreen, setScreen, isAuthenticated, authUser, logout } = useLewisStore()
  const [bootLoading, setBootLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootLoading(false)
    }, 1400)
    return () => clearTimeout(timer)
  }, [])

  // Guard against invalid/undefined screen names so app NEVER goes blank
  const validScreen = SCREENS[currentScreen] ? currentScreen : 'landing'
  const ActiveScreen = SCREENS[validScreen]

  const currentIndex = SCREEN_ORDER.indexOf(validScreen)

  const stageWrapRef = useRef(null)
  const stageMainRef = useRef(null)
  const mainCardRef = useRef(null)

  // Browsers can leave a scrollable ancestor's scrollTop at a stray non-zero
  // value after its content changes - e.g. auto-scrolling to reveal a newly
  // focused button deeper in an instrument questionnaire's next sub-question -
  // silently cropping the new content from the top. Reset on navigation, on
  // any DOM change within the card (multi-step screens swap content
  // internally without changing currentScreen), and undo any scroll that
  // wasn't a real continuous-scroll gesture (wheel/touchmove).
  useLayoutEffect(() => {
    const wrap = stageWrapRef.current
    const main = stageMainRef.current
    const card = mainCardRef.current
    const resetScroll = () => {
      if (wrap) wrap.scrollTop = 0
      if (main) main.scrollTop = 0
    }
    resetScroll()
    if (!card) return

    let raf = 0
    const scheduleReset = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(resetScroll)
    }
    const mo = new MutationObserver(scheduleReset)
    mo.observe(card, { childList: true, subtree: true, attributes: true })

    let userScrolling = false
    let userScrollTimer = 0
    const markUserScroll = () => {
      userScrolling = true
      clearTimeout(userScrollTimer)
      userScrollTimer = setTimeout(() => { userScrolling = false }, 400)
    }
    const scrollables = [wrap, main].filter(Boolean)
    const scrollHandlers = scrollables.map((el) => {
      const handler = () => { if (!userScrolling && el.scrollTop !== 0) el.scrollTop = 0 }
      el.addEventListener('scroll', handler, { passive: true })
      return [el, handler]
    })
    // Only real continuous-scroll gestures count as "user is scrolling" -
    // pointerdown/touchstart also fire on a plain click (e.g. the Continue
    // button), whose resulting browser auto-scroll is exactly what this
    // effect needs to undo, not protect.
    const gestureEvents = ['wheel', 'touchmove']
    scrollables.forEach((el) => {
      gestureEvents.forEach((evt) => el.addEventListener(evt, markUserScroll, { passive: true }))
    })

    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(userScrollTimer)
      scrollHandlers.forEach(([el, handler]) => el.removeEventListener('scroll', handler))
      scrollables.forEach((el) => {
        gestureEvents.forEach((evt) => el.removeEventListener(evt, markUserScroll))
      })
    }
  }, [currentScreen])

  // Sync with system backward / forward navigation (Browser Back, Mobile gesture, Android Hardware Back)
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
    const initialScreen = (hash && SCREENS[hash]) ? hash : useLewisStore.getState().currentScreen

    if (initialScreen && initialScreen !== useLewisStore.getState().currentScreen) {
      useLewisStore.getState().setScreen(initialScreen, { skipHistory: true })
    }

    if (typeof window !== 'undefined' && window.history.state?.screen !== initialScreen) {
      window.history.replaceState({ screen: initialScreen }, '', `#${initialScreen}`)
    }

    const handlePopState = (event) => {
      const targetScreen = event.state?.screen || (window.location.hash ? window.location.hash.replace('#', '') : 'landing')
      if (targetScreen && SCREENS[targetScreen]) {
        useLewisStore.getState().setScreen(targetScreen, { skipHistory: true })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Background Telemetry & Inactivity Heartbeat
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const sendPing = () => {
      const store = useLewisStore.getState()
      if (!store.journeySessionId) return
      const idx = SCREEN_ORDER.indexOf(validScreen)
      const pct = idx >= 0 ? Number(((idx / (SCREEN_ORDER.length - 1)) * 100).toFixed(1)) : 0.0
      const durationSec = store.getJourneyDurationSeconds ? store.getJourneyDurationSeconds() : 0

      if (validScreen === 'mirror') {
        fetch(`${API_BASE}/journey/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: store.journeySessionId, duration_seconds: durationSec }),
        }).catch(() => {})
        return
      }

      fetch(`${API_BASE}/journey/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: store.journeySessionId,
          user_name: store.name || store.authUser?.name || null,
          user_email: store.email || store.authUser?.email || null,
          current_stage: idx >= 0 ? Math.min(10, Math.floor(idx / 5)) : 0,
          current_screen: validScreen,
          progress_percent: pct,
          duration_seconds: durationSec,
        }),
      }).catch(() => {})
    }

    sendPing()
    const interval = setInterval(sendPing, 45000)
    return () => clearInterval(interval)
  }, [validScreen])

  return (
    <>
      <AnimatePresence mode="wait">
        {bootLoading && (
          <LewisLoadingScreen
            key="boot-loader"
            onComplete={() => {
              setBootLoading(false)
              setScreen('landing')
            }}
          />
        )}
      </AnimatePresence>
      {/* Signature LEWIS Teal Dot Grid Layer */}
      <div className="bg-dot-grid" />

      <div className="app-shell" style={['landing', 'mirror', 'stage10Generating'].includes(validScreen) ? { height: 'auto', maxHeight: 'none', minHeight: '100dvh', overflow: 'visible', padding: validScreen === 'landing' ? 0 : undefined } : {}}>
        {!['landing', 'mirror', 'stage10Generating'].includes(validScreen) && (
          <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {currentIndex > 0 && (
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.history.state?.screen) {
                      window.history.back()
                    } else if (currentIndex > 0 && SCREEN_ORDER[currentIndex - 1]) {
                      setScreen(SCREEN_ORDER[currentIndex - 1])
                    } else {
                      setScreen('landing')
                    }
                  }}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    color: 'var(--text-mute)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontFamily: "'Nunito', system-ui, sans-serif",
                    fontSize: '14px', fontWeight: 600,
                    transition: 'color 0.2s ease'
                  }}
                  title="Go back to previous question"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-mute)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              )}
              <LewisLogo size={32} showText={true} animated={false} />
            </div>
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isAuthenticated && authUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 174, 157, 0.1)', padding: '4px 12px 4px 10px', borderRadius: '999px', border: '1px solid rgba(0, 174, 157, 0.25)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dawn)' }}>
                    {authUser.name || authUser.email}
                  </span>
                  <button
                    onClick={logout}
                    title="Log Out"
                    style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '11px', cursor: 'pointer', padding: 0, fontWeight: 600, marginLeft: '4px' }}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#414242', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Nunito', sans-serif" }}>
                Wellbeing Intelligence
              </span>
            </div>
          </header>
        )}

        {/* Premium Stage Progress Indicator (hidden on terminal/mirror/generating screens) */}
        {!['landing', 'mirror', 'stage10Generating'].includes(validScreen) && currentIndex !== -1 && (() => {
          const STAGE_NAMES = [
            'Setup',
            'Life Context',
            'Cognitive Focus',
            'ANS & Somatic',
            'Maze Task',
            'Core Assessment',
            'Sharing Context',
            'Action & Support',
            'Cumulative Load',
            'Sensory Choices',
            'The Mirror'
          ]

          const getStageInfo = (screen) => {
            if (screen === 'landing' || screen === 'preStage0Age' || screen === 'stage1_0About') {
              return { num: 0, name: STAGE_NAMES[0] }
            }
            if (screen.startsWith('stage1_')) return { num: 1, name: STAGE_NAMES[1] }
            if (screen.startsWith('stage2')) return { num: 2, name: STAGE_NAMES[2] }
            if (screen.startsWith('stage3_')) return { num: 3, name: STAGE_NAMES[3] }
            if (screen.startsWith('stage4')) return { num: 4, name: STAGE_NAMES[4] }
            if (screen.startsWith('stage5_')) return { num: 5, name: STAGE_NAMES[5] }
            if (screen.startsWith('stage6')) return { num: 6, name: STAGE_NAMES[6] }
            if (screen.startsWith('stage7_')) return { num: 7, name: STAGE_NAMES[7] }
            if (screen.startsWith('stage8_')) return { num: 8, name: STAGE_NAMES[8] }
            if (screen.startsWith('stage9')) return { num: 9, name: STAGE_NAMES[9] }
            if (screen.startsWith('stage10') || screen === 'mirror') return { num: 10, name: STAGE_NAMES[10] }
            return { num: 0, name: STAGE_NAMES[0] }
          }

          const stageInfo = getStageInfo(validScreen)
          const percent = ((currentIndex / (SCREEN_ORDER.length - 1)) * 100).toFixed(1)

          return (
            <nav className="stage-track-v2" style={{ marginBottom: '16px', userSelect: 'none' }} aria-label="Journey progress">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', fontFamily: "'Nunito', sans-serif" }}>
                <span style={{
                  color: 'var(--dawn)', fontWeight: 700, letterSpacing: '0.04em', fontSize: '13px'
                }}>
                  Stage {stageInfo.num} — {stageInfo.name}
                </span>
                <span style={{ color: '#85918e', fontWeight: 600, fontSize: '13.5px', fontFamily: "'Nunito', sans-serif" }}>
                  {Math.round(percent)}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{
                height: '4px',
                background: 'rgba(22, 36, 31, 0.1)',
                borderRadius: '4px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                {/* Solid progress line */}
                <div style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: '#00ae9d',
                  borderRadius: '3px',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />


              </div>
            </nav>
          )
        })()}

        {validScreen === 'landing' ? (
          <main style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">
              <PageTransition key={validScreen}>
                <ActiveScreen />
              </PageTransition>
            </AnimatePresence>
          </main>
        ) : validScreen === 'mirror' ? (
          <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '10px 20px 80px 20px', boxSizing: 'border-box' }}>
            <AnimatePresence mode="wait">
              <PageTransition key={validScreen}>
                <ActiveScreen />
              </PageTransition>
            </AnimatePresence>
          </div>
        ) : validScreen === 'stage10Generating' ? (
          <div style={{ width: '100%', maxWidth: '960px', minHeight: 'calc(100vh - 60px)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
            <AnimatePresence mode="wait">
              <PageTransition key={validScreen}>
                <ActiveScreen />
              </PageTransition>
            </AnimatePresence>
          </div>
        ) : (
          <div ref={stageWrapRef} className="main-stage-wrap" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px 32px 20px', boxSizing: 'border-box', overflow: 'hidden', minHeight: 0 }}>
            <div ref={mainCardRef} className={`main-card ${(validScreen === 'stage1_0About' || validScreen === 'preStage0Age' || validScreen === 'stage1_1Identity') ? 'transparent-card' : ''}`} style={{
              width: '100%',
              maxWidth: (validScreen === 'preStage0Age' || validScreen === 'ageStop') ? '480px' : '860px',
              maxHeight: 'calc(100dvh - 160px)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxSizing: 'border-box',
              transition: 'max-width 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <main ref={stageMainRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', overflowAnchor: 'none' }}>
                <AnimatePresence mode="wait">
                  <PageTransition key={validScreen}>
                    <ActiveScreen />
                  </PageTransition>
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

