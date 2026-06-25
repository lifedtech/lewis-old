/**
 * LEWIS — Shared UI Primitives
 * Warm retro-vintage tactile feel × high-end modern interactivity
 */
import styles from './ui.module.css'

/* ─── Card ────────────────────────────────────────────────────────────────── */
export function Card({ children, accent = true, style, glass, stagger }) {
  return (
    <div
      className={[
        styles.card,
        accent  ? styles.accent : '',
        glass   ? styles.glass  : '',
        stagger !== undefined ? styles.cardStagger : '',
      ].join(' ')}
      style={{
        ...style,
        ...(stagger !== undefined
          ? { animationDelay: `${stagger * 110}ms`, animationFillMode: 'both' }
          : {}),
      }}
    >
      {children}
    </div>
  )
}

/* ─── Section Title ───────────────────────────────────────────────────────── */
export function SectionTitle({ children, sub }) {
  return (
    <div className={styles.sectionTitleWrap}>
      <h3 className={styles.sectionTitle}>{children}</h3>
      {sub && <p className={styles.sectionSub}>{sub}</p>}
    </div>
  )
}

/* ─── Caption ─────────────────────────────────────────────────────────────── */
export function Caption({ children }) {
  return <p className={styles.caption}>{children}</p>
}

/* ─── Divider ─────────────────────────────────────────────────────────────── */
export function Divider() {
  return (
    <div className={styles.divider} role="separator">
      <span /><span className={styles.dividerLeaf}>✦</span><span />
    </div>
  )
}

/* ─── SliderField ─────────────────────────────────────────────────────────── */
export function SliderField({
  label, name, min, max, value, onChange,
  leftLabel, rightLabel, step = 1,
}) {
  const pct  = ((value - min) / (max - min)) * 100
  const dots = max - min + 1

  return (
    <div className={styles.sliderField}>
      <label className={styles.sliderLabel} htmlFor={`slider-${name}`}>
        {label}
      </label>

      <div className={styles.sliderTrackWrap}>
        <input
          id={`slider-${name}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(name, Number(e.target.value))}
          className={styles.slider}
          style={{ '--pct': `${pct}%` }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />

        {/* Clickable step dots below track */}
        <div className={styles.sliderDots} aria-hidden="true">
          {Array.from({ length: dots }, (_, i) => {
            const dotVal = min + i
            return (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                className={[
                  styles.dot,
                  dotVal === value   ? styles.dotActive  : '',
                  dotVal <  value    ? styles.dotPassed  : '',
                ].join(' ')}
                onClick={() => onChange(name, dotVal)}
                aria-label={`Set ${name} to ${dotVal}`}
              />
            )
          })}
        </div>
      </div>

      <div className={styles.sliderEdges}>
        <span className={styles.edgeLabel}>{leftLabel}</span>
        <span className={styles.sliderBubble}>{value}</span>
        <span className={styles.edgeLabel}>{rightLabel}</span>
      </div>
    </div>
  )
}

/* ─── RadioGroup ──────────────────────────────────────────────────────────── */
export function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className={styles.radioGroup} role="group" aria-label={label}>
      <span className={styles.sliderLabel}>{label}</span>
      <div className={styles.radioOptions}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
            className={[styles.radioBtn, value === opt ? styles.radioBtnActive : ''].join(' ')}
            onClick={() => onChange(name, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── SelectField ─────────────────────────────────────────────────────────── */
export function SelectField({ label, name, options, value, onChange }) {
  return (
    <div className={styles.selectField}>
      <label className={styles.sliderLabel} htmlFor={`select-${name}`}>{label}</label>
      <div className={styles.selectWrap}>
        <select
          id={`select-${name}`}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          className={styles.select}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <svg className={styles.selectChevron} viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.8"
                fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

/* ─── MultiSelect ─────────────────────────────────────────────────────────── */
export function MultiSelect({ label, name, options, value = [], onChange }) {
  const toggle = (opt) => {
    const next = value.includes(opt)
      ? value.filter(v => v !== opt)
      : [...value, opt]
    onChange(name, next)
  }
  return (
    <div className={styles.radioGroup} role="group" aria-label={label}>
      <span className={styles.sliderLabel}>{label}</span>
      <div className={styles.radioOptions}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            role="checkbox"
            aria-checked={value.includes(opt)}
            className={[styles.radioBtn, value.includes(opt) ? styles.radioBtnActive : ''].join(' ')}
            onClick={() => toggle(opt)}
          >
            {value.includes(opt) && <span className={styles.checkmark}>✓ </span>}
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── PrimaryBtn ──────────────────────────────────────────────────────────── */
export function PrimaryBtn({ children, onClick, disabled, full }) {
  return (
    <button
      type="button"
      className={[styles.primaryBtn, full ? styles.fullWidth : ''].join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.btnInner}>{children}</span>
      <span className={styles.btnSheen} aria-hidden="true" />
    </button>
  )
}

/* ─── GhostBtn ────────────────────────────────────────────────────────────── */
export function GhostBtn({ children, onClick }) {
  return (
    <button type="button" className={styles.ghostBtn} onClick={onClick}>
      {children}
    </button>
  )
}

/* ─── ScoreRing ───────────────────────────────────────────────────────────── */
export function ScoreRing({ score, color, size = 84, label }) {
  const r    = size * 0.37
  const circ = 2 * Math.PI * r
  const dash = Math.min((score / 100) * circ, circ)

  // Conditional colour per prompt: >65 teal, >40 mint, ≤40 orange
  const ringColor = color || (
    score > 65 ? 'var(--lewis-teal)' :
    score > 40 ? 'var(--lewis-mint)' :
                 '#E07B39'
  )

  return (
    <div className={styles.scoreRing} style={{ width: size, height: size }}
         role="img" aria-label={`${label || ''} score: ${Math.round(score)} out of 100`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(26,46,48,0.08)"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className={styles.scoreRingInner}>
        <span className={styles.scoreNum} style={{ color: ringColor }}>
          {Math.round(score)}
        </span>
      </div>
    </div>
  )
}
