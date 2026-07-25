
export default function MultiSelectGrid({ options, selected, onChange }) {
  return (
    <div className="chip-grid">
      {options.map((opt, idx) => (
        <button
          key={idx}
          className={`chip ${selected.includes(opt) ? 'selected' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
