import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

// Hard stop for under-18 visitors. LEWIS's instruments and reflections
// are designed and validated for adults, so the journey ends here —
// warmly, without collecting anything.
export default function AgeStopScreen() {
  const { reset } = useLewisStore()

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center', maxWidth: '540px', margin: '0 auto' }}>
        <p className="eyebrow">Thank you for your honesty</p>
        <h1 className="headline" style={{ marginBottom: '1.5rem' }}>
          LEWIS is designed for adults
        </h1>
        <p className="sub" style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
          The reflections here are built and tested for people 18 and older,
          so the journey stops here for now — nothing you've entered has been
          saved. You'll be very welcome back when you're 18.
        </p>
        <p className="sub" style={{ lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Caring about your own wellbeing at your age is a genuine strength.
          If things ever feel heavy, please talk to someone you trust — a
          parent, a teacher, a school counsellor, or another adult in your
          corner. You deserve support from people around you, not just from
          a screen.
        </p>
        <div className="button-group" style={{ justifyContent: 'center' }}>
          <button className="btn-primary" onClick={reset}>
            Return to the start
          </button>
        </div>
      </div>
    </motion.div>
  )
}
