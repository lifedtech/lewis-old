import React from 'react'
import { motion, Reorder } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function Stage1_7PriorityScreen() {
  const { setScreen, setProfileField, priorities } = useLewisStore()

  const handleNext = () => {
    setScreen('stage1_8Arrival')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="headline">Priority Ranking</h1>
        <p className="sub">Drag these into the order that matters most to you right now.</p>
        
        <div className="form-container" style={{ margin: '2rem auto' }}>
          <Reorder.Group 
            axis="y" 
            values={priorities} 
            onReorder={(newOrder) => setProfileField('priorities', newOrder)} 
            className="draggable-list"
          >
            {priorities.map((item, index) => (
              <Reorder.Item key={item} value={item} className="draggable-item">
                <div className="draggable-content">
                  <span className="draggable-rank">{index + 1}</span>
                  <span className="draggable-text">{item}</span>
                  <span className="draggable-handle" style={{ userSelect: 'none' }}>☰</span>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
        
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button className="btn-primary" onClick={handleNext}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
