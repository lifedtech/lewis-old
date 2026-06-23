/* Shared UI primitives */
import styles from './ui.module.css'

export function Card({ children, accent = true, style }) {
  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`} style={style}>
      {children}
    </div>
  )
}

export function SectionTitle({ children }) {
  return <h3 className={styles.sectionTitle}>{children}</h3>
}

export function Caption({ children }) {
  return <p className={styles.caption}>{children}</p>
}

export function Divider() {
  return <hr className={styles.divider} />
}

export function SliderField({ label, name, min, max, value, onChange, leftLabel, rightLabel, step = 1 }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={styles.sliderField}>
      <label className={styles.sliderLabel}>{label}</label>
      <div className={styles.sliderTrackWrap}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(name, Number(e.target.value))}
          className={styles.slider}
          style={{ '--pct': `${pct}%` }}
        />
        <div className={styles.sliderDots}>
          {Array.from({ length: max - min + 1 }, (_, i) => (
            <span key={i} className={`${styles.dot} ${i === value - min ? styles.dotActive : ''}`} />
          ))}
        </div>
      </div>
      <div className={styles.sliderEdges}>
        <span>{leftLabel}</span>
        <span className={styles.sliderValue}>{value}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

export function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className={styles.radioGroup}>
      <label className={styles.sliderLabel}>{label}</label>
      <div className={styles.radioOptions}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            className={`${styles.radioBtn} ${value === opt ? styles.radioBtnActive : ''}`}
            onClick={() => onChange(name, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SelectField({ label, name, options, value, onChange }) {
  return (
    <div className={styles.selectField}>
      <label className={styles.sliderLabel}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(name, e.target.value)}
        className={styles.select}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}

export function MultiSelect({ label, name, options, value = [], onChange }) {
  const toggle = (opt) => {
    const next = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]
    onChange(name, next)
  }
  return (
    <div className={styles.radioGroup}>
      <label className={styles.sliderLabel}>{label}</label>
      <div className={styles.radioOptions}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            className={`${styles.radioBtn} ${value.includes(opt) ? styles.radioBtnActive : ''}`}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function PrimaryBtn({ children, onClick, disabled, full }) {
  return (
    <button
      className={`${styles.primaryBtn} ${full ? styles.fullWidth : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function GhostBtn({ children, onClick }) {
  return (
    <button className={styles.ghostBtn} onClick={onClick}>{children}</button>
  )
}
