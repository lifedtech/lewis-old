import React from 'react'

export default function LikertScale({ prompt, options, value, onChange }) {
  return (
    <div className="likert-container">
      {prompt && <p className="likert-prompt">{prompt}</p>}
      <div className="likert-options">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`likert-btn ${value === opt ? 'selected' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
