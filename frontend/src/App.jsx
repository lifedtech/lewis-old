import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLewisStore } from './store/useLewisStore.js'

import LandingScreen from './screens/LandingScreen.jsx'
import PreStage0AgeScreen from './screens/PreStage0AgeScreen.jsx'
import AgeStopScreen from './screens/AgeStopScreen.jsx'
import Background3D from './components/Background3D.jsx'
import Stage1_0AboutScreen from './screens/Stage1_0AboutScreen.jsx'
import Stage1_1IdentityScreen from './screens/Stage1_1IdentityScreen.jsx'
import Stage1_2StabilityScreen from './screens/Stage1_2StabilityScreen.jsx'
import Stage1_3PressuresScreen from './screens/Stage1_3PressuresScreen.jsx'
import Stage1_4BodyScreen from './screens/Stage1_4BodyScreen.jsx'
import Stage1_5Who5Screen from './screens/Stage1_5Who5Screen.jsx'
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
import Stage5_2Pss10Screen from './screens/Stage5_2Pss10Screen.jsx'
import Stage5_2Ucla3Screen from './screens/Stage5_2Ucla3Screen.jsx'
import Stage5_2GseScreen from './screens/Stage5_2GseScreen.jsx'
import Stage5_2PromisScreen from './screens/Stage5_2PromisScreen.jsx'
import Stage5_2Cfpb5Screen from './screens/Stage5_2Cfpb5Screen.jsx'
import Stage5_2DienerScreen from './screens/Stage5_2DienerScreen.jsx'
import Stage5_2InsScreen from './screens/Stage5_2InsScreen.jsx'
import Stage5_2SwlsScreen from './screens/Stage5_2SwlsScreen.jsx'
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
import Stage9QuickChoicesScreen from './screens/Stage9QuickChoicesScreen.jsx'
import Stage10GeneratingScreen from './screens/Stage10GeneratingScreen.jsx'
import MirrorScreen from './screens/MirrorScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'

const SCREENS = {
  landing: LandingScreen,
  preStage0Age: PreStage0AgeScreen,
  ageStop: AgeStopScreen, // terminal screen — deliberately not in SCREEN_ORDER
  stage1_0About: Stage1_0AboutScreen,
  stage1_1Identity: Stage1_1IdentityScreen,
  stage1_2Stability: Stage1_2StabilityScreen,
  stage1_3Pressures: Stage1_3PressuresScreen,
  stage1_4Body: Stage1_4BodyScreen,
  stage1_5Who5: Stage1_5Who5Screen,
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
  stage5_2Pss10: Stage5_2Pss10Screen,
  stage5_2Ucla3: Stage5_2Ucla3Screen,
  stage5_2Gse: Stage5_2GseScreen,
  stage5_2Promis: Stage5_2PromisScreen,
  stage5_2Cfpb5: Stage5_2Cfpb5Screen,
  stage5_2Diener: Stage5_2DienerScreen,
  stage5_2Ins: Stage5_2InsScreen,
  stage5_2Swls: Stage5_2SwlsScreen,
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
  stage9QuickChoices: Stage9QuickChoicesScreen,
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
  'stage9QuickChoices',
  'stage10Generating',
  'mirror'
]

export default function App() {
  const { currentScreen, setScreen, isAuthenticated, authUser, logout } = useLewisStore()
  const ActiveScreen = SCREENS[currentScreen] || LandingScreen

  const currentIndex = SCREEN_ORDER.indexOf(currentScreen)

  return (
    <>
      {currentScreen === 'landing' && <Background3D />}
      {currentScreen !== 'landing' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', width: '520px', height: '520px', left: '-160px', top: '-120px',
            borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(14,147,130,.20), transparent 66%)',
            filter: 'blur(32px)', animation: 'lewisDrift 38s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', width: '460px', height: '460px', right: '-150px', bottom: '-140px',
            borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(72,170,200,.16), transparent 66%)',
            filter: 'blur(36px)', animation: 'lewisDrift2 46s ease-in-out infinite'
          }} />
        </div>
      )}

      <div className="app-shell" style={currentScreen === 'landing' ? { padding: 0 } : {}}>
        {currentScreen !== 'landing' && (
          <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {currentIndex > 0 && (
                <button
                  onClick={() => setScreen(SCREEN_ORDER[currentIndex - 1])}
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
              <div className="wordmark">LEWIS<span>BY LIFED</span></div>
            </div>
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isAuthenticated && authUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 174, 157, 0.1)', padding: '4px 12px 4px 10px', borderRadius: '999px', border: '1px solid rgba(0, 174, 157, 0.25)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dawn)' }}>
                    👤 {authUser.name || authUser.email}
                  </span>
                  <button 
                    onClick={logout} 
                    title="Log Out"
                    style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '11px', cursor: 'pointer', padding: 0, fontWeight: 600, marginLeft: '4px' }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setScreen('login')}
                  style={{ background: 'none', border: '1px solid var(--dawn)', color: 'var(--dawn)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign In
                </button>
              )}
              <span className="proto-tag">Version 1.1.12</span>
              <div className="mini-orb" aria-hidden="true"></div>
            </div>
          </header>
        )}

        {/* Premium Stage Progress Indicator (hidden on terminal screens) */}
        {currentScreen !== 'landing' && currentIndex !== -1 && (() => {
          const STAGE_START_SCREENS = [
            'landing',           // Stage 0
            'stage1_1Identity',   // Stage 1
            'stage2Attention',   // Stage 2
            'stage3_1Affect',    // Stage 3
            'stage4Maze',        // Stage 4
            'stage5_1Landscape', // Stage 5
            'stage6Sharing',     // Stage 6
            'stage7_1External',  // Stage 7
            'stage8_1EnergyArc', // Stage 8
            'stage9Sensory',     // Stage 9
            'stage10Generating'  // Stage 10
          ]

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

          const stageInfo = getStageInfo(currentScreen)
          const percent = ((currentIndex / (SCREEN_ORDER.length - 1)) * 100).toFixed(1)

          return (
            <nav className="stage-track-v2" style={{ marginBottom: '16px', userSelect: 'none' }} aria-label="Journey progress">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '10px', fontFamily: "'IBM Plex Mono', monospace" }}>
                <span style={{
                  color: 'var(--dawn)', fontWeight: 700, letterSpacing: '0.08em',
                  background: 'rgba(14, 147, 130, 0.1)', padding: '6px 12px', borderRadius: '16px'
                }}>
                  STAGE {stageInfo.num} - {stageInfo.name.toUpperCase()}
                </span>
                <span style={{ color: 'var(--text-faint)', fontWeight: 600 }}>
                  {currentIndex + 1} / {SCREEN_ORDER.length} ({Math.round(percent)}%)
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
                  background: 'var(--dawn)',
                  borderRadius: '3px',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />

                {/* Solid indicator knob */}
                <div style={{
                  position: 'absolute',
                  left: `${percent}%`,
                  width: '12px',
                  height: '12px',
                  background: 'var(--dawn)',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none'
                }} />
              </div>
            </nav>
          )
        })()}

        {currentScreen === 'landing' ? (
          <main style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">
              <ActiveScreen key={currentScreen} />
            </AnimatePresence>
          </main>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
            <div className="main-card" style={{
              background: '#ffffff',
              borderRadius: '32px',
              boxShadow: '0 20px 50px rgba(16, 40, 34, 0.13)',
              width: '100%',
              maxWidth: '840px',
              display: 'flex',
              flexDirection: 'column',
              padding: '32px 40px',
              position: 'relative'
            }}>
              <main style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <AnimatePresence mode="wait">
                  <ActiveScreen key={currentScreen} />
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

