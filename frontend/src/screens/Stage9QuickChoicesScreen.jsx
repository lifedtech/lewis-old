import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage9QuickChoicesScreen() {
  const { setScreen, updateObjectField } = useLewisStore()
  
  // Game state
  const [round, setRound] = useState(1)
  const maxRounds = 5
  
  const [lowerBound, setLowerBound] = useState(0)
  const [upperBound, setUpperBound] = useState(100)
  const [currentImmediate, setCurrentImmediate] = useState(50)
  
  const [gameOver, setGameOver] = useState(false)
  const [discountingTendency, setDiscountingTendency] = useState(null)

  const handleChoice = (choice) => {
    let newLower = lowerBound
    let newUpper = upperBound

    if (choice === 'immediate') {
      newUpper = currentImmediate
    } else {
      newLower = currentImmediate
    }

    setLowerBound(newLower)
    setUpperBound(newUpper)

    if (round >= maxRounds) {
      const indifferencePoint = (newLower + newUpper) / 2
      const tendency = (indifferencePoint / 100).toFixed(2)
      setDiscountingTendency(tendency)
      updateObjectField('quickChoices', 'discountingTendency', tendency)
      setGameOver(true)
    } else {
      setCurrentImmediate(Math.floor((newLower + newUpper) / 2))
      setRound(r => r + 1)
    }
  }

  const handleNext = () => {
    setScreen('stage10Generating')
  }

  return (
    <motion.div 
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
        <p className="eyebrow">Quick Choices (Delay Discounting)</p>
        
        {!gameOver ? (
          <>
            <h1 className="headline" style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>
              Which would you prefer?
            </h1>
            <p className="sub" style={{ marginBottom: '40px' }}>Round {round} of {maxRounds}</p>

            <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '500px', flexWrap: 'wrap' }}>
              <motion.button 
                className="btn-primary" 
                style={{ flex: 1, padding: '30px 20px', fontSize: '18px', background: 'var(--panel-2)', border: '1px solid var(--panel-border)', color: 'var(--text)', minWidth: '200px' }}
                whileHover={{ scale: 1.02, borderColor: 'var(--dawn)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('immediate')}
              >
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--dawn)' }}>₹{(currentImmediate * 100).toLocaleString('en-IN')}</span>
                Right Now
              </motion.button>
              
              <motion.button 
                className="btn-primary" 
                style={{ flex: 1, padding: '30px 20px', fontSize: '18px', background: 'var(--panel-2)', border: '1px solid var(--panel-border)', color: 'var(--text)', minWidth: '200px' }}
                whileHover={{ scale: 1.02, borderColor: 'var(--dawn)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('later')}
              >
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--dawn)' }}>₹10,000</span>
                In 1 Month
              </motion.button>
            </div>
            
            <div style={{ marginTop: '60px', width: '100%', maxWidth: '400px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-mute)', textAlign: 'center', marginBottom: '8px' }}>
                Indifference calibration
              </p>
              <div style={{ height: '4px', background: 'var(--panel-border)', borderRadius: '2px', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: `${lowerBound}%`, 
                  right: `${100 - upperBound}%`, 
                  height: '100%', 
                  background: 'var(--dawn)', 
                  opacity: 0.5,
                  transition: 'all 0.3s ease'
                }} />
                <div style={{ 
                  position: 'absolute', 
                  left: `${currentImmediate}%`, 
                  width: '8px', 
                  height: '12px', 
                  background: 'var(--dawn-glow)', 
                  top: '-4px', 
                  transform: 'translateX(-50%)', 
                  borderRadius: '4px',
                  boxShadow: '0 0 10px var(--dawn)',
                  transition: 'all 0.3s ease'
                }} />
              </div>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <h1 className="headline" style={{ fontSize: '24px', marginBottom: '16px' }}>
              Task Complete
            </h1>
            <div style={{ background: 'var(--panel-1)', border: '1px solid var(--panel-border)', padding: '30px', borderRadius: '16px', marginBottom: '40px', maxWidth: '400px' }}>
              <p className="sub" style={{ marginBottom: '8px' }}>Computed Indifference Point:</p>
              <p style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--dawn)', margin: '0 0 16px 0', textShadow: '0 0 20px rgba(255,100,100,0.3)' }}>
                {discountingTendency}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-mute)', lineHeight: '1.5' }}>
                {parseFloat(discountingTendency) > 0.5 
                  ? "Your choices indicate a stronger preference for immediate gratification (higher discounting tendency)." 
                  : "Your choices indicate a willingness to delay gratification for a larger reward (lower discounting tendency)."}
              </p>
            </div>
            <button className="btn-primary" onClick={handleNext}>
              Continue Journey
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
