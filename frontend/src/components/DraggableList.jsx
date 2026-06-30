import React from 'react'
import { Reorder } from 'framer-motion'

export default function DraggableList({ items, setItems }) {
  return (
    <Reorder.Group 
      axis="y" 
      values={items} 
      onReorder={setItems} 
      className="draggable-list"
    >
      {items.map((item, idx) => (
        <Reorder.Item 
          key={item} 
          value={item} 
          className="draggable-item"
        >
          <div className="draggable-content">
            <span className="draggable-rank">{idx + 1}</span>
            <span className="draggable-text">{item}</span>
            <span className="draggable-handle">☰</span>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
