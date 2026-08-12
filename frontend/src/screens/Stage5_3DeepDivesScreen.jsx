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
        gridTemplateColumns: '1fr 1.65fr',
        gap: 'clamp(24px, 4vw, 52px)',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}>

        {/* LEFT — Eyebrow + Title (2 Lines) + Subtitle + Topic Line Art */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#00ae9d',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
            }}>
              PRIORITY FOCUS
            </p>
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#414242',
              textAlign: 'left',
            }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Adaptive Deep</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Dives</span>
            </h1>
            <p style={{
              margin: '12px 0 0 2px',
              fontSize: 'clamp(13px, 1.5vw, 15.5px)',
              color: '#414242',
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.5,
              maxWidth: '350px',
              textAlign: 'left',
            }}>
              Select the core areas you feel are most critical to examine and improve right now.
            </p>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <TopicLineIllustration topic="swls" />
          </div>
        </div>

        {/* RIGHT — Multi-select Card List */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #f4f4f4',
              borderRadius: '20px',
              padding: '18px 22px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#00ae9d', textTransform: 'uppercase' }}>
                SELECT CORE FOCUS AREAS
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#414242' }}>
                {selectedCount} SELECTED
              </span>
            </div>

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
                      border: active ? '1.5px solid #00ae9d' : '1.5px solid #d2e7e0',
                      background: active ? '#e4f4ee' : '#f2f9f6',
                      color: active ? '#414242' : '#3a3a3a',
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
                      border: active ? '2px solid #00ae9d' : '2px solid #c2ceca',
                      background: active ? '#00ae9d' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.18s ease',
                    }}>
                      {active && <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800, lineHeight: 1 }}>✓</span>}
                    </div>

                    <span style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: active ? 700 : 600,
                      fontSize: '14.5px',
                      color: active ? '#414242' : '#414242',
                      textAlign: 'left',
                      flex: 1,
                    }}>
                      {a.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#414242', fontFamily: "'Nunito', sans-serif", fontStyle: 'italic', textAlign: 'center' }}>
              Select one or more areas to prioritize for deeper adaptive exploration.
            </p>
          </div>

          {/* Action Button directly below card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '14px', flexShrink: 0 }}>
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
