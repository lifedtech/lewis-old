import { useLewisStore } from '../store/useLewisStore.js'
import { motion } from 'framer-motion'
import BreathingFluidBlob from '../components/BreathingFluidBlob.jsx'

export default function WelcomeScreen() {
  const { setScreen } = useLewisStore()

  const handleBegin = () => {
    setScreen('ageGate')
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ display: 'flex' }}
    >
      <h1 className="headline" style={{ marginTop: '32px' }}>Welcome to LEWIS</h1>
      <p className="sub">Understanding yourself is the first step to feel better.</p>

      <div className="spacer"></div>

      <div className="orb-wrap" style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
        <BreathingFluidBlob size={170} duration={6} />
      </div>
      
      <div className="spacer"></div>

      <div className="trust-row" style={{ marginBottom: '24px', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span className="trust-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Science-backed
        </span>
        <span className="trust-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Private
        </span>
        <span className="trust-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg> Adaptive
        </span>
        <span className="trust-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Non-clinical
        </span>
      </div>

      <button 
        className="btn-primary" 
        onClick={handleBegin}
        style={{ marginBottom: '16px', alignSelf: 'center', width: '100%', maxWidth: '300px' }}
      >
        Let's begin
      </button>

      <p className="sub" style={{ fontStyle: 'italic', opacity: 0.6, fontSize: '13px', marginTop: 0, textAlign: 'center' }}>
        This is your space. Everything here is private and completely yours.
      </p>
    </motion.section>
  )
}
