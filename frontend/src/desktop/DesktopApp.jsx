import React, { useRef, useLayoutEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { INSTRUMENTS } from '../constants/instruments.js'
import PageTransition from '../components/PageTransition.jsx'
import AbstractLineBackground from '../components/AbstractLineBackground.jsx'

// Desktop Components
import DesktopHeader from './components/DesktopHeader.jsx'
import DesktopProgress from './components/DesktopProgress.jsx'

// Screen Components
import LandingScreen from '../screens/LandingScreen.jsx'
import AgeStopScreen from '../screens/AgeStopScreen.jsx'
import Stage1_0AboutScreen from '../screens/Stage1_0AboutScreen.jsx'
import Stage1_1IdentityScreen from '../screens/Stage1_1IdentityScreen.jsx'
import Stage1_2StabilityScreen from '../screens/Stage1_2StabilityScreen.jsx'
import Stage1_3PressuresScreen from '../screens/Stage1_3PressuresScreen.jsx'
import Stage1_4BodyScreen from '../screens/Stage1_4BodyScreen.jsx'
import Stage1_6RelationalScreen from '../screens/Stage1_6RelationalScreen.jsx'
import Stage1_7PriorityScreen from '../screens/Stage1_7PriorityScreen.jsx'
import Stage1_8ArrivalScreen from '../screens/Stage1_8ArrivalScreen.jsx'
import Stage1_9FinancialScreen from '../screens/Stage1_9FinancialScreen.jsx'
import Stage1_10EnvironmentScreen from '../screens/Stage1_10EnvironmentScreen.jsx'
import Stage1_11IntellectualScreen from '../screens/Stage1_11IntellectualScreen.jsx'
import Stage1_12CulturalScreen from '../screens/Stage1_12CulturalScreen.jsx'
import Stage1_13BodyRhythmScreen from '../screens/Stage1_13BodyRhythmScreen.jsx'
import Stage1_14SensoryPauseScreen from '../screens/Stage1_14SensoryPauseScreen.jsx'
import Stage2AttentionScreen from '../screens/Stage2AttentionScreen.jsx'
import Stage3_1AffectScreen from '../screens/Stage3_1AffectScreen.jsx'
import Stage3_2BodyMapScreen from '../screens/Stage3_2BodyMapScreen.jsx'
import Stage3_3DayRhythmScreen from '../screens/Stage3_3DayRhythmScreen.jsx'
import Stage3_4BreathingScreen from '../screens/Stage3_4BreathingScreen.jsx'
import Stage3_5NsStateScreen from '../screens/Stage3_5NsStateScreen.jsx'
import Stage3_6BodyAwarenessScreen from '../screens/Stage3_6BodyAwarenessScreen.jsx'
import Stage4MazeScreen from '../screens/Stage4MazeScreen.jsx'
import Stage5_0EmailScreen from '../screens/Stage5_0EmailScreen.jsx'
import Stage5_1LandscapeScreen from '../screens/Stage5_1LandscapeScreen.jsx'
import InstrumentScreen from '../screens/InstrumentScreen.jsx'
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
import Stage10GeneratingScreen from '../screens/Stage10GeneratingScreen.jsx'
import MirrorScreen from '../screens/MirrorScreen.jsx'
import BillingScreen from '../screens/BillingScreen.jsx'
import PaymentConfirmScreen from '../screens/PaymentConfirmScreen.jsx'
import LoginScreen from '../screens/LoginScreen.jsx'
import ReportReviewScreen from '../screens/ReportReviewScreen.jsx'

// Streamlined Screens
import StreamlinedGateScreen from '../screens/streamlined/StreamlinedGateScreen.jsx'
import StreamlinedGateStopScreen from '../screens/streamlined/StreamlinedGateStopScreen.jsx'
import StreamlinedWelcomeScreen from '../screens/streamlined/StreamlinedWelcomeScreen.jsx'
import StreamlinedAboutScreen from '../screens/streamlined/StreamlinedAboutScreen.jsx'
import StreamlinedIdentityScreen from '../screens/streamlined/StreamlinedIdentityScreen.jsx'
import StreamlinedStabilityScreen from '../screens/streamlined/StreamlinedStabilityScreen.jsx'
import StreamlinedPressuresScreen from '../screens/streamlined/StreamlinedPressuresScreen.jsx'
import StreamlinedArrivalScreen from '../screens/streamlined/StreamlinedArrivalScreen.jsx'
import StreamlinedWho5Screen from '../screens/streamlined/StreamlinedWho5Screen.jsx'
import StreamlinedAffectScreen from '../screens/streamlined/StreamlinedAffectScreen.jsx'
import StreamlinedBodyMapScreen from '../screens/streamlined/StreamlinedBodyMapScreen.jsx'
import StreamlinedNsStateScreen from '../screens/streamlined/StreamlinedNsStateScreen.jsx'
import StreamlinedBodyAwarenessScreen from '../screens/streamlined/StreamlinedBodyAwarenessScreen.jsx'
import StreamlinedBodyScreen from '../screens/streamlined/StreamlinedBodyScreen.jsx'
import StreamlinedPss10Screen from '../screens/streamlined/StreamlinedPss10Screen.jsx'
import StreamlinedRelationalScreen from '../screens/streamlined/StreamlinedRelationalScreen.jsx'
import StreamlinedGseScreen from '../screens/streamlined/StreamlinedGseScreen.jsx'
import StreamlinedMeaningScreen from '../screens/streamlined/StreamlinedMeaningScreen.jsx'
import StreamlinedMoneyScreen from '../screens/streamlined/StreamlinedMoneyScreen.jsx'
import StreamlinedSurroundingsScreen from '../screens/streamlined/StreamlinedSurroundingsScreen.jsx'
import StreamlinedGrowthScreen from '../screens/streamlined/StreamlinedGrowthScreen.jsx'
import StreamlinedLandscapeScreen from '../screens/streamlined/StreamlinedLandscapeScreen.jsx'
import StreamlinedPriorityScreen from '../screens/streamlined/StreamlinedPriorityScreen.jsx'
import StreamlinedPriorityTensionScreen from '../screens/streamlined/StreamlinedPriorityTensionScreen.jsx'
import StreamlinedBrightSpotScreen from '../screens/streamlined/StreamlinedBrightSpotScreen.jsx'
import StreamlinedEmailScreen from '../screens/streamlined/StreamlinedEmailScreen.jsx'
import StreamlinedDeepDivesScreen from '../screens/streamlined/StreamlinedDeepDivesScreen.jsx'
import StreamlinedSupportScreen from '../screens/streamlined/StreamlinedSupportScreen.jsx'
import StreamlinedPriorScreen from '../screens/streamlined/StreamlinedPriorScreen.jsx'
import StreamlinedPlannerScreen from '../screens/streamlined/StreamlinedPlannerScreen.jsx'
import StreamlinedRhythmScreen from '../screens/streamlined/StreamlinedRhythmScreen.jsx'
import StreamlinedRecoveryScreen from '../screens/streamlined/StreamlinedRecoveryScreen.jsx'
import StreamlinedStressPatternScreen from '../screens/streamlined/StreamlinedStressPatternScreen.jsx'
import StreamlinedCumulativeScreen from '../screens/streamlined/StreamlinedCumulativeScreen.jsx'
import StreamlinedBreathingScreen from '../screens/streamlined/StreamlinedBreathingScreen.jsx'
import StreamlinedGeneratingScreen from '../screens/streamlined/StreamlinedGeneratingScreen.jsx'
import StreamlinedMirrorScreen from '../screens/streamlined/StreamlinedMirrorScreen.jsx'
import StreamlinedInsightReport from '../report/StreamlinedInsightReport.jsx'

const INSTRUMENT_SCREENS = Object.fromEntries(
  Object.keys(INSTRUMENTS).map((id) => {
    const Screen = () => <InstrumentScreen id={id} />
    Screen.displayName = id
    return [id, Screen]
  })
)

const SCREENS = {
  landing: LandingScreen,
  ageStop: AgeStopScreen,
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
  ...INSTRUMENT_SCREENS,
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
  billing: BillingScreen,
  payment: BillingScreen,
  paymentConfirm: PaymentConfirmScreen,
  login: LoginScreen,
  reportReview: ReportReviewScreen,
  review: ReportReviewScreen,
  'report-review': ReportReviewScreen,

  // Streamlined Route Keys
  sl_gate: StreamlinedGateScreen,
  sl_gate_stop: StreamlinedGateStopScreen,
  sl_welcome: StreamlinedWelcomeScreen,
  sl_1_0About: StreamlinedAboutScreen,
  sl_1_1Identity: StreamlinedIdentityScreen,
  sl_1_2Stability: StreamlinedStabilityScreen,
  sl_1_3Pressures: StreamlinedPressuresScreen,
  sl_1_8Arrival: StreamlinedArrivalScreen,
  sl_1_5Who5: StreamlinedWho5Screen,
  sl_3_1Affect: StreamlinedAffectScreen,
  sl_3_2BodyMap: StreamlinedBodyMapScreen,
  sl_3_5NsState: StreamlinedNsStateScreen,
  sl_3_6BodyAwareness: StreamlinedBodyAwarenessScreen,
  sl_1_4Body: StreamlinedBodyScreen,
  sl_5_2Pss10: StreamlinedPss10Screen,
  sl_5_2Ucla3: StreamlinedRelationalScreen,
  sl_5_2Gse: StreamlinedGseScreen,
  sl_5_2Promis: StreamlinedMeaningScreen,
  sl_5_2Cfpb5: StreamlinedMoneyScreen,
  sl_5_2Ins: StreamlinedSurroundingsScreen,
  sl_5_2Growth: StreamlinedGrowthScreen,
  sl_5_1Landscape: StreamlinedLandscapeScreen,
  sl_5_1Priority: StreamlinedPriorityScreen,
  sl_5_5PriorityTension: StreamlinedPriorityTensionScreen,
  sl_5_4BrightSpot: StreamlinedBrightSpotScreen,
  sl_5_0Email: StreamlinedEmailScreen,
  sl_5_3DeepDives: StreamlinedDeepDivesScreen,
  sl_7_4Support: StreamlinedSupportScreen,
  sl_7_2Prior: StreamlinedPriorScreen,
  sl_7_5Planner: StreamlinedPlannerScreen,
  sl_8_1EnergyArc: StreamlinedRhythmScreen,
  sl_8_3Recovery: StreamlinedRecoveryScreen,
  sl_8_2StressPattern: StreamlinedStressPatternScreen,
  sl_8_4Cumulative: StreamlinedCumulativeScreen,
  sl_3_4Breathing: StreamlinedBreathingScreen,
  sl_10Generating: StreamlinedGeneratingScreen,
  sl_mirror: StreamlinedMirrorScreen,
  sl_report: StreamlinedInsightReport
}

export default function DesktopApp() {
  const { currentScreen, theme } = useLewisStore()
  const isDark = theme === 'dark'
  const validScreen = SCREENS[currentScreen] ? currentScreen : 'landing'
  const ActiveScreen = SCREENS[validScreen]
  const isFullPage = [
    'landing', 'mirror', 'billing', 'payment', 'paymentConfirm',
    'stage10Generating', 'login', 'reportReview', 'review', 'report-review',
    'sl_10Generating', 'sl_mirror', 'sl_report'
  ].includes(validScreen)

  const stageWrapRef = useRef(null)
  const stageMainRef = useRef(null)
  const mainCardRef = useRef(null)

  useLayoutEffect(() => {
    const wrap = stageWrapRef.current
    const main = stageMainRef.current
    if (wrap) wrap.scrollTop = 0
    if (main) main.scrollTop = 0
  }, [validScreen])

  // Full-bleed standalone pages (no app-shell padding or card border artifacts)
  if ([
    'landing', 'billing', 'payment', 'paymentConfirm', 'mirror',
    'reportReview', 'review', 'report-review',
    'sl_10Generating', 'sl_mirror', 'sl_report'
  ].includes(validScreen)) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0, overflowX: 'hidden', overflowY: 'auto', position: 'relative' }}>
        {isDark && validScreen !== 'landing' && (
          <AbstractLineBackground variant="nodes" opacity={0.15} color="#38C9B7" />
        )}
        <AnimatePresence mode="wait">
          <PageTransition key={validScreen}>
            <ActiveScreen />
          </PageTransition>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div
      className="app-shell"
      style={{
        position: 'relative',
        ...(isFullPage ? { height: 'auto', maxHeight: 'none', minHeight: '100dvh', overflow: 'visible' } : {})
      }}
    >
      {/* Dark Mode Abstract Line Background from Landing Research section */}
      {isDark && (
        <AbstractLineBackground variant="nodes" opacity={0.15} color="#38C9B7" />
      )}

      {/* Background Dot Grid */}
      {!isFullPage && <div className="bg-dot-grid" />}

      {/* Desktop Header */}
      {!isFullPage && <DesktopHeader currentScreen={validScreen} />}

      {/* Desktop Stage Progress */}
      {!isFullPage && <DesktopProgress currentScreen={validScreen} />}

      {/* Main View Router */}
      {isFullPage ? (
        <main style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <AnimatePresence mode="wait">
            <PageTransition key={validScreen}>
              <div
                style={
                  validScreen === 'stage10Generating'
                    ? { width: '100%', maxWidth: '960px', minHeight: 'calc(100dvh - 60px)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
                    : { width: '100%', maxWidth: '960px', margin: '0 auto', padding: '10px 20px 80px 20px', boxSizing: 'border-box' }
                }
              >
                <ActiveScreen />
              </div>
            </PageTransition>
          </AnimatePresence>
        </main>
      ) : (
        <div
          ref={stageWrapRef}
          className="main-stage-wrap"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 20px 32px 20px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <div
            ref={mainCardRef}
            className={`main-card ${(validScreen === 'stage1_0About' || validScreen === 'preStage0Age' || validScreen === 'stage1_1Identity' || validScreen.startsWith('sl_')) ? 'transparent-card' : ''}`}
            style={{
              width: '100%',
              maxWidth: (validScreen === 'preStage0Age' || validScreen === 'ageStop') ? '480px' : '860px',
              maxHeight: 'calc(100dvh - 160px)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxSizing: 'border-box',
              transition: 'max-width 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <main
              ref={stageMainRef}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'visible',
                WebkitOverflowScrolling: 'touch',
                overflowAnchor: 'none',
                padding: '20px 8px 16px 8px',
                boxSizing: 'border-box',
              }}
            >
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
  )
}
