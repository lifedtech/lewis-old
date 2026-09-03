import React from 'react'
import { motion } from 'framer-motion'
import { SCREEN_ORDER, STREAMLINED_SCREEN_ORDER, getStageInfo } from '../../shared/constants/screenOrder.js'

export default function MobileProgress({ currentScreen }) {
  const isStreamlined = currentScreen && currentScreen.startsWith('sl_')
  const order = isStreamlined ? STREAMLINED_SCREEN_ORDER : SCREEN_ORDER
  const currentIndex = order.indexOf(currentScreen)
  if (currentIndex <= 0) return null

  const stageInfo = getStageInfo(currentScreen)
  const percent = Math.round((currentIndex / (order.length - 1)) * 100)

  return (
    <div className="mobile-progress-bar-wrap" style={{
      width: '100%',
      padding: '8px 16px 4px 16px',
      boxSizing: 'border-box',
      userSelect: 'none',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.06em',
          color: '#00ae9d',
          textTransform: 'uppercase',
          fontFamily: "'Nunito', sans-serif",
        }}>
          {isStreamlined ? `Act ${stageInfo.num} · ${stageInfo.name}` : `Stage ${stageInfo.num} · ${stageInfo.name}`}
        </span>
      </div>

      <div style={{
        width: '100%',
        height: '3.5px',
        background: 'rgba(22, 36, 31, 0.08)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: '#00ae9d',
            borderRadius: '3px',
          }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
