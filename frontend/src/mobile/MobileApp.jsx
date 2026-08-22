import React, { useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { INSTRUMENTS } from '../constants/instruments.js'
import { SCREEN_ORDER } from '../shared/constants/screenOrder.js'
import PageTransition from '../components/PageTransition.jsx'

// Mobile Components
import MobileHeader from './components/MobileHeader.jsx'
import MobileProgress from './components/MobileProgress.jsx'
import MobileInstrumentScreen from './screens/MobileInstrumentScreen.jsx'

// Screen Components (All using shared store & business logic)
import LandingScreen from '../screens/LandingScreen.jsx'
import AgeStopScreen from '../screens/AgeStopScreen.jsx'
import MobileStage1_0AboutScreen from './screens/MobileStage1_0AboutScreen.jsx'
import MobileStage1_1IdentityScreen from './screens/MobileStage1_1IdentityScreen.jsx'
import MobileStage1_2StabilityScreen from './screens/MobileStage1_2StabilityScreen.jsx'
import MobileStage1_3PressuresScreen from './screens/MobileStage1_3PressuresScreen.jsx'
import Stage1_4BodyScreen from '../screens/Stage1_4BodyScreen.jsx'
import Stage1_6RelationalScreen from '../screens/Stage1_6RelationalScreen.jsx'
import MobileStage1_7PriorityScreen from './screens/MobileStage1_7PriorityScreen.jsx'
import Stage1_8ArrivalScreen from '../screens/Stage1_8ArrivalScreen.jsx'
import Stage1_9FinancialScreen from '../screens/Stage1_9FinancialScreen.jsx'
import Stage1_10EnvironmentScreen from '../screens/Stage1_10EnvironmentScreen.jsx'
import Stage1_11IntellectualScreen from '../screens/Stage1_11IntellectualScreen.jsx'
import Stage1_12CulturalScreen from '../screens/Stage1_12CulturalScreen.jsx'
import Stage1_13BodyRhythmScreen from '../screens/Stage1_13BodyRhythmScreen.jsx'
import Stage1_14SensoryPauseScreen from '../screens/Stage1_14SensoryPauseScreen.jsx'
import Stage2AttentionScreen from '../screens/Stage2AttentionScreen.jsx'
import Stage3_1AffectScreen from '../screens/Stage3_1AffectScreen.jsx'
import MobileStage3_2BodyMapScreen from './screens/MobileStage3_2BodyMapScreen.jsx'
import Stage3_3DayRhythmScreen from '../screens/Stage3_3DayRhythmScreen.jsx'
import Stage3_4BreathingScreen from '../screens/Stage3_4BreathingScreen.jsx'
import Stage3_5NsStateScreen from '../screens/Stage3_5NsStateScreen.jsx'
import Stage3_6BodyAwarenessScreen from '../screens/Stage3_6BodyAwarenessScreen.jsx'
import Stage4MazeScreen from '../screens/Stage4MazeScreen.jsx'
import Stage5_0EmailScreen from '../screens/Stage5_0EmailScreen.jsx'
import Stage5_1LandscapeScreen from '../screens/Stage5_1LandscapeScreen.jsx'
import Stage5_2InsScreen from '../screens/Stage5_2InsScreen.jsx'
import Stage5_3DeepDivesScreen from '../screens/Stage5_3DeepDivesScreen.jsx'
import Stage5_4BrightSpotScreen from '../screens/Stage5_4BrightSpotScreen.jsx'
import Stage5_5PriorityTensionScreen from '../screens/Stage5_5PriorityTensionScreen.jsx'
import Stage6SharingScreen from '../screens/Stage6SharingScreen.jsx'
import Stage7_1ExternalScreen from '../screens/Stage7_1ExternalScreen.jsx'
import Stage7_2PriorScreen from '../screens/Stage7_2PriorScreen.jsx'
import Stage7_3AspirationScreen from '../screens/Stage7_3AspirationScreen.jsx'
import Stage7_4SupportScreen from '../screens/Stage7_4SupportScreen.jsx'
import Stage7_5PlannerScreen from '../screens/Stage7_5PlannerScreen.jsx'
import Stage7_6ValuesScreen from '../screens/Stage7_6ValuesScreen.jsx'
import Stage7_7FinancialAspScreen from '../screens/Stage7_7FinancialAspScreen.jsx'
import Stage7_8FrictionScreen from '../screens/Stage7_8FrictionScreen.jsx'
import Stage8_1EnergyArcScreen from '../screens/Stage8_1EnergyArcScreen.jsx'
import Stage8_2StressPatternScreen from '../screens/Stage8_2StressPatternScreen.jsx'
import Stage8_3RecoveryScreen from '../screens/Stage8_3RecoveryScreen.jsx'
import Stage8_4CumulativeScreen from '../screens/Stage8_4CumulativeScreen.jsx'
import Stage9SensoryScreen from '../screens/Stage9SensoryScreen.jsx'
import MobileStage10GeneratingScreen from './screens/MobileStage10GeneratingScreen.jsx'
import MobileMirrorScreen from './screens/MobileMirrorScreen.jsx'
import PaymentScreen from '../screens/PaymentScreen.jsx'
import LoginScreen from '../screens/LoginScreen.jsx'

// Stepped questionnaire instruments rendered via MobileInstrumentScreen
const MOBILE_INSTRUMENT_SCREENS = Object.fromEntries(
  Object.keys(INSTRUMENTS).map((id) => {
    const Screen = () => <MobileInstrumentScreen id={id} />
    Screen.displayName = `Mobile_${id}`
    return [id, Screen]
  })
)

const MOBILE_SCREENS = {
  landing: LandingScreen,
  ageStop: AgeStopScreen,
  stage1_0About: MobileStage1_0AboutScreen,
  stage1_1Identity: MobileStage1_1IdentityScreen,
  stage1_2Stability: MobileStage1_2StabilityScreen,
  stage1_3Pressures: MobileStage1_3PressuresScreen,
  stage1_4Body: Stage1_4BodyScreen,
  stage1_6Relational: Stage1_6RelationalScreen,
  stage1_7Priority: MobileStage1_7PriorityScreen,
  stage1_8Arrival: Stage1_8ArrivalScreen,
  stage1_9Financial: Stage1_9FinancialScreen,
  stage1_10Environment: Stage1_10EnvironmentScreen,
  stage1_11Intellectual: Stage1_11IntellectualScreen,
  stage1_12Cultural: Stage1_12CulturalScreen,
  stage1_13BodyRhythm: Stage1_13BodyRhythmScreen,
  stage1_14SensoryPause: Stage1_14SensoryPauseScreen,
  stage2Attention: Stage2AttentionScreen,
  stage3_1Affect: Stage3_1AffectScreen,
  stage3_2BodyMap: MobileStage3_2BodyMapScreen,
  stage3_3DayRhythm: Stage3_3DayRhythmScreen,
  stage3_4Breathing: Stage3_4BreathingScreen,
  stage3_5NsState: Stage3_5NsStateScreen,
  stage3_6BodyAwareness: Stage3_6BodyAwarenessScreen,
  stage4Maze: Stage4MazeScreen,
  stage5_1Landscape: Stage5_1LandscapeScreen,
  stage5_0Email: Stage5_0EmailScreen,
  ...MOBILE_INSTRUMENT_SCREENS,
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
  stage10Generating: MobileStage10GeneratingScreen,
  mirror: MobileMirrorScreen,
  payment: MobileMirrorScreen,
  login: LoginScreen,
}

export default function MobileApp() {
  const { currentScreen, setScreen } = useLewisStore()
  const validScreen = MOBILE_SCREENS[currentScreen] ? currentScreen : 'landing'
  const ActiveScreen = MOBILE_SCREENS[validScreen]
  const isFullPage = ['landing', 'mirror', 'payment', 'stage10Generating', 'login'].includes(validScreen)
  const containerRef = useRef(null)

  // Scroll to top cleanly on screen change without locking native gestures
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'instant' })
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [validScreen])

  return (
    <div
      ref={containerRef}
      className="mobile-app-root"
      style={{
        width: '100%',
        minHeight: '100dvh',
        background: '#f6fbf9',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Background Dot Grid */}
      <div className="bg-dot-grid" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* Mobile Top Header (Hidden on landing, mirror, generating) */}
      {!isFullPage && <MobileHeader currentScreen={validScreen} />}

      {/* Mobile Progress Bar */}
      {!isFullPage && <MobileProgress currentScreen={validScreen} />}

      {/* Main Content Area */}
      <main
        className="mobile-main-content"
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          padding: isFullPage ? 0 : '8px 12px 24px 12px',
          boxSizing: 'border-box',
          maxWidth: '100%',
        }}
      >
        <AnimatePresence mode="wait">
          <PageTransition key={validScreen}>
            <ActiveScreen />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  )
}
