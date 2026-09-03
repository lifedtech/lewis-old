import React from 'react'
import { SCREEN_ORDER, STREAMLINED_SCREEN_ORDER, getStageInfo } from '../../shared/constants/screenOrder.js'

export default function DesktopProgress({ currentScreen }) {
  const isStreamlined = currentScreen && currentScreen.startsWith('sl_')
  const order = isStreamlined ? STREAMLINED_SCREEN_ORDER : SCREEN_ORDER
  const currentIndex = order.indexOf(currentScreen)
  if (currentIndex <= 0) return null

  const stageInfo = getStageInfo(currentScreen)
  const percent = ((currentIndex / (order.length - 1)) * 100).toFixed(1)

  return (
    <nav className="stage-track-v2" style={{ width: '100%', marginBottom: '16px', userSelect: 'none' }} aria-label="Journey progress">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', fontFamily: "'Nunito', sans-serif" }}>
        <span style={{ color: 'var(--dawn, #00ae9d)', fontWeight: 700, letterSpacing: '0.04em', fontSize: '13px' }}>
          {isStreamlined ? `Act ${stageInfo.num} · ${stageInfo.name}` : `Stage ${stageInfo.num} · ${stageInfo.name}`}
        </span>
        <span style={{ color: 'var(--text-sub, #85918e)', fontWeight: 600, fontSize: '13.5px', fontFamily: "'Nunito', sans-serif" }}>
          {Math.round(percent)}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div style={{
        height: '4px',
        background: 'var(--panel-border, rgba(22, 36, 31, 0.1))',
        borderRadius: '4px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: 'var(--dawn, #00ae9d)',
          borderRadius: '3px',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </nav>
  )
}
