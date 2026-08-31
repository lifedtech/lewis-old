import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import TopicLineIllustration from '../components/TopicLineIllustration.jsx'

export default function Stage5_3DeepDivesScreen() {
  const { setScreen, updateObjectField, adaptiveDeepDives } = useLewisStore()

  const handleNext = () => {
    setScreen('stage5_4BrightSpot')
  }

  const areas = [
    { key: 'physical', label: 'Physical Ease & Sleep' },
    { key: 'emotional', label: 'Emotional & Stress Regulation' },
    { key: 'relationships', label: 'Relationships & Social Support' },
    { key: 'meaning', label: 'Meaning & Purpose' },
    { key: 'financial', label: 'Financial Security & Peace' }
  ]

  const handleToggle = (key) => {
    const currentVal = adaptiveDeepDives?.[key] || false
    updateObjectField('adaptiveDeepDives', key, !currentVal)
  }

  const selectedCount = Object.values(adaptiveDeepDives || {}).filter(Boolean).length

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="stage-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.45fr',
        gap: 'clamp(24px, 3.5vw, 44px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title + Subtitle + Line Illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="stage-eyebrow mobile-eyebrow" style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 10px 0',
              lineHeight: 1.3,
            }}>
              PRIORITY FOCUS
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
              color: 'var(--text-main, #414242)',
              textAlign: 'left',
            }}>
              Adaptive Deep Dives
            </h1>
            <p className="stage-subtitle mobile-subtitle" style={{
              margin: '10px 0 0 0',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Select the core areas you feel are most critical to examine and improve right now.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <TopicLineIllustration topic="swls" />
          </div>
        </div>

        {/* RIGHT — Multi-select Card List */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '12px' }}>

          {/* Stacked Option Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {areas.map(a => {
              const active = !!adaptiveDeepDives?.[a.key]
              return (
                <button
                  key={a.key}
                  onClick={() => handleToggle(a.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: active ? '1.5px solid var(--dawn, #00ae9d)' : '1.5px solid var(--border-color, #d2e7e0)',
                    background: active ? 'var(--teal-tint, #e4f4ee)' : 'var(--raised, #ffffff)',
                    color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #3a3a3a)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: active ? '0 2px 8px rgba(0,174,157,0.12)' : 'none',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: active ? '2px solid var(--dawn, #00ae9d)' : '2px solid var(--border-strong, #c2ceca)',
                    background: active ? 'var(--dawn, #00ae9d)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.18s ease',
                  }}>
                    {active && <span style={{ color: 'var(--action-text, #ffffff)', fontSize: '12px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>

                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: active ? 700 : 600,
                    fontSize: '14.5px',
                    color: active ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                    textAlign: 'left',
                    flex: 1,
                  }}>
                    {a.label}
                  </span>
                </button>
              )
            })}
          </div>

          <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Select one or more areas to prioritize for deeper adaptive exploration.
          </p>

          {/* Action Button directly below */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '8px', flexShrink: 0 }}>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={selectedCount === 0}
              style={{
                padding: '10px 40px',
                opacity: selectedCount > 0 ? 1 : 0.5,
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Continue
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  )
}
