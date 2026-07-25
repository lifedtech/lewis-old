import { useState } from 'react';
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function DelayDiscountingScreen() {
  const { setScreen } = useLewisStore()
  
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
      // User prefers immediate over $100 later. They are impatient.
      // Indifference point is < currentImmediate.
      newUpper = currentImmediate
    } else {
      // User prefers $100 later over immediate. They are patient.
      // Indifference point is > currentImmediate.
      newLower = currentImmediate
    }

    setLowerBound(newLower)
    setUpperBound(newUpper)

    if (round >= maxRounds) {
      // Game over, calculate final tendency
      // Indifference point is the average of final bounds
      const indifferencePoint = (newLower + newUpper) / 2
      // Tendency: 0 (Patient, low discount) to 1 (Impulsive, high discount)
      // Since max is $100, if indifference is $100, they are extremely impatient (would only wait if immediate is $100).
      // Wait, if indifference is $99, they would rather have $99 now than $100 later -> impulsive.
      // If indifference is $10, they would rather have $100 later than $10 now -> patient.
      // So high indifference = high discounting (impulsive). Low indifference = low discounting (patient).
      const tendency = (indifferencePoint / 100).toFixed(2)
      setDiscountingTendency(tendency)
      setGameOver(true)
    } else {
      setCurrentImmediate(Math.floor((newLower + newUpper) / 2))
      setRound(r => r + 1)
    }
  }

  const handleNext = () => {
    // In a real app, we'd save the `discountingTendency` to the store or backend here.
    setScreen('breathe') // Or wherever the next screen should be
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <p className="eyebrow">Quick Choices</p>
      
      {!gameOver ? (
        <>
          <h1 className="headline" style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>
            Which would you prefer?
          </h1>
          <p className="sub" style={{ marginBottom: '40px' }}>Round {round} of {maxRounds}</p>

          <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '500px' }}>
            <motion.button 
              className="btn-primary" 
              style={{ flex: 1, padding: '30px 20px', fontSize: '18px', background: 'var(--panel-2)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
              whileHover={{ scale: 1.02, borderColor: 'var(--dawn)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('immediate')}
            >
              <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--dawn)' }}>${currentImmediate}</span>
              Right Now
            </motion.button>
            
            <motion.button 
              className="btn-primary" 
              style={{ flex: 1, padding: '30px 20px', fontSize: '18px', background: 'var(--panel-2)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
              whileHover={{ scale: 1.02, borderColor: 'var(--dawn)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('later')}
            >
              <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--dawn)' }}>$100</span>
              In 1 Month
            </motion.button>
          </div>
          
          <div style={{ marginTop: '60px', width: '100%', maxWidth: '400px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-mute)', textAlign: 'center', marginBottom: '8px' }}>
              Adaptive range visualization (Backend parameter)
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
          <div style={{ background: 'var(--panel-1)', border: '1px solid var(--panel-border)', padding: '30px', borderRadius: '16px', marginBottom: '40px' }}>
            <p className="sub" style={{ marginBottom: '8px' }}>Computed "Now vs. Later Lean":</p>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--dawn)', margin: '0 0 16px 0', textShadow: '0 0 20px rgba(255,100,100,0.3)' }}>
              {discountingTendency}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-mute)', maxWidth: '300px', margin: '0 auto' }}>
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
    </motion.section>
  )
}
