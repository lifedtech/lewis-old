import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLewisStore } from './store/useLewisStore.js'

import WelcomeScreen from './screens/WelcomeScreen.jsx'
import AgeGateScreen from './screens/AgeGateScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import PathSelectionScreen from './screens/PathSelectionScreen.jsx'
import ScalesScreen from './screens/ScalesScreen.jsx'
import MindGamesScreen from './screens/MindGamesScreen.jsx'
import BreatheScreen from './screens/BreatheScreen.jsx'
import LandscapeScreen from './screens/LandscapeScreen.jsx'
import MazeScreen from './screens/MazeScreen.jsx'
import MirrorScreen from './screens/MirrorScreen.jsx'

const SCREENS = {
  welcome: WelcomeScreen,
  ageGate: AgeGateScreen,
  profile: ProfileScreen,
  pathSelection: PathSelectionScreen,
  scales: ScalesScreen,
  mindgames: MindGamesScreen,
  breathe: BreatheScreen,
  landscape: LandscapeScreen,
  maze: MazeScreen,
  mirror: MirrorScreen,
}

const SCREEN_ORDER = ['welcome', 'ageGate', 'profile', 'pathSelection', 'scales', 'mindgames', 'breathe', 'landscape', 'maze', 'mirror']

export default function App() {
  const { currentScreen, setScreen } = useLewisStore()
  const ActiveScreen = SCREENS[currentScreen] || WelcomeScreen

  const currentIndex = SCREEN_ORDER.indexOf(currentScreen)

  // Atmospheric mouse follow (desktop)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24
      const y = (e.clientY / window.innerHeight - 0.5) * 24
      setMousePos({ x, y })
    }
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')

    if (!mql.matches && fine.matches) {
      document.addEventListener('mousemove', handleMouseMove)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <div
        className="atmosphere"
        style={{
          '--mx': `${mousePos.x}px`,
          '--my': `${mousePos.y}px`
        }}
      >
        <div className="blob-3"></div>
      </div>
      <div className="grain"></div>

      <div className="app-shell">
        <header className="app-header">
          <div className="wordmark">LEWIS<span>BY LIFED</span></div>
          <div className="header-right">
            <span className="proto-tag">prototype 1.1</span>
            <div className="mini-orb" aria-hidden="true"></div>
          </div>
        </header>

        <nav className="stage-track" aria-label="Journey progress">
          {SCREEN_ORDER.map((screen, idx) => (
            <button
              key={screen}
              className={`stage-dot ${currentScreen === screen ? 'active' : ''} ${idx < currentIndex ? 'done' : ''}`}
              data-screen={screen}
              aria-label={screen.charAt(0).toUpperCase() + screen.slice(1)}
              onClick={() => setScreen(screen)}
            ></button>
          ))}
        </nav>

        <main style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            <ActiveScreen key={currentScreen} />
          </AnimatePresence>
        </main>
      </div>
    </>
  )
}

