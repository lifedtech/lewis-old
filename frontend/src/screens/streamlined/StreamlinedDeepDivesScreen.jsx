import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../../store/useLewisStore.js'
import ActTransitionCard from './ActTransitionCard.jsx'

const TEXTURE_FLAGS = {
  PH: {
    label: 'Body & recovery',
    prompt: "What's been hardest for your body lately?",
    flags: [
      "Sleep isn't restoring me",
      "There's no time to rest or recover",
      "Movement feels like a chore right now",
      "I'm not eating in a way that nourishes me",
      "My body holds a lot of tension or pain",
      "I'm running on empty whatever I do"
    ]
  },
  EM: {
    label: 'Emotional calm',
    prompt: "What does the strain feel like most?",
    flags: [
      "My mind feels constantly busy or racing",
      "I'm carrying more stress than I can hold",
      "I feel low or flat more often than not",
      "Small things overwhelm me easily",
      "It's hard to switch off or settle",
      "I've been hard on myself"
    ]
  },
  EN: {
    label: 'Energy & drive',
    prompt: "What fits how your energy feels?",
    flags: [
      "Most days feel like going through the motions",
      "I've lost interest in things I used to enjoy",
      "My energy runs out long before the day does",
      "Nothing feels genuinely exciting right now",
      "I'm doing a lot, but none of it lights me up",
      "It's hard to get started on anything"
    ]
  },
  RS: {
    label: 'Relationships',
    prompt: "What's true about your connections right now?",
    flags: [
      "I feel more alone than I'd like",
      "I have people around, but don't feel truly seen",
      "My relationships feel like hard work right now",
      "I find it hard to reach out or open up",
      "I don't have time for the people who matter",
      "A relationship is causing me real strain"
    ]
  },
  MS: {
    label: 'Meaning & purpose',
    prompt: "What's closest to how meaning feels right now?",
    flags: [
      "I'm not sure what really matters to me right now",
      "Day-to-day life feels a bit empty or aimless",
      "I'm doing what is expected, not what feels true",
      "I miss feeling connected to something bigger",
      "It's hard to see where any of this is going",
      "I've had to put what I value on hold"
    ]
  },
  AC: {
    label: 'Progress & agency',
    prompt: "What's been in the way of feeling effective?",
    flags: [
      "I start a lot of things and struggle to finish",
      "Other people's needs keep crowding mine out",
      "I don't trust myself to follow through",
      "The demands on me are unreasonable",
      "I feel stuck and don't know the next move",
      "I'm doing fine on paper, but it doesn't feel like it"
    ]
  },
  FW: {
    label: 'Money & security',
    prompt: "What is the financial weight mostly about?",
    flags: [
      "There isn't enough coming in for what goes out",
      "The uncertainty or instability is what exhausts me",
      "I can't build any reserve or safety net",
      "Money creates tension in my close relationships",
      "I feel constant low-level dread about the future",
      "I'm working constantly just to stay level"
    ]
  },
  IG: {
    label: 'Curiosity & learning',
    prompt: "What's been true of your curiosity lately?",
    flags: [
      "There's no mental space for anything new",
      "My days are too routine or repetitive",
      "I want to learn or make something, but can't find time",
      "I feel intellectually under-stimulated",
      "Tiredness kills my curiosity before I start",
      "I haven't felt genuinely interested in a while"
    ]
  },
  EC: {
    label: 'Surroundings & belonging',
    prompt: "What's missing from your surroundings?",
    flags: [
      "My physical environment drains or stresses me",
      "I don't feel I belong where I'm living or working",
      "I almost never get outside or near nature",
      "I feel out of place in the culture around me",
      "My space doesn't support the life I want",
      "I feel disconnected from where I live"
    ]
  }
}

const TRAJECTORY_OPTIONS = [
  'Getting better',
  'Staying about the same',
  'Getting harder',
  'It varies a lot week to week'
]

const FRICTION_OPTIONS = [
  'Time or capacity',
  'Energy or physical limits',
  'Money or resources',
  'Other people / external demands',
  'Emotional weight or motivation',
  'Not knowing what to do'
]

export default function StreamlinedDeepDivesScreen() {
  const {
    domainSort,
    deepdiveFlags,
    deepdiveTrajectories,
    deepdiveFrictions,
    updateObjectField,
    setScreen
  } = useLewisStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  // subStep: 0 for flags, 1 for trajectory, 2 for friction
  const [subStep, setSubStep] = useState(0)
  const [showAct6, setShowAct6] = useState(false)

  const DOMAIN_TO_KEY = {
    'Body & recovery': 'PH',
    'Emotional calm': 'EM',
    'Energy & drive': 'EN',
    'Relationships': 'RS',
    'Meaning & purpose': 'MS',
    'Progress & agency': 'AC',
    'Money & security': 'FW',
    'Curiosity & learning': 'IG',
    'Surroundings & belonging': 'EC'
  }

  const depletedDomains = domainSort?.depleted || []
  let qualifyingKeys = depletedDomains.map((d) => DOMAIN_TO_KEY[d]).filter(Boolean)
  if (qualifyingKeys.length === 0) qualifyingKeys = ['EM']

  const activeKey = qualifyingKeys[currentIndex] || 'EM'
  const activeSpec = TEXTURE_FLAGS[activeKey] || TEXTURE_FLAGS.EM

  const currentFlags = deepdiveFlags?.[activeKey] || []
  const currentTraj = deepdiveTrajectories?.[activeKey]
  const currentFriction = deepdiveFrictions?.[activeKey]

  const handleToggleFlag = (flag) => {
    let updated = [...currentFlags]
    if (updated.includes(flag)) {
      updated = updated.filter((f) => f !== flag)
    } else {
      updated.push(flag)
    }
    updateObjectField('deepdiveFlags', activeKey, updated)
  }

  const handleSelectTraj = (traj) => {
    updateObjectField('deepdiveTrajectories', activeKey, traj)
    setTimeout(() => {
      setSubStep(2)
    }, 180)
  }

  const handleSelectFriction = (friction) => {
    updateObjectField('deepdiveFrictions', activeKey, friction)
    setTimeout(() => {
      if (currentIndex < qualifyingKeys.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSubStep(0)
      } else {
        setShowAct6(true)
      }
    }, 180)
  }

  const handleBack = () => {
    if (subStep === 2) {
      setSubStep(1)
    } else if (subStep === 1) {
      setSubStep(0)
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSubStep(2)
    } else {
      setScreen('sl_5_0Email')
    }
  }

  const handleAct6Dismiss = () => {
    setScreen('sl_7_4Support')
  }

  if (showAct6) {
    return (
      <ActTransitionCard
        actNumber={6}
        title="Looking forward"
        subtitle="Support, pacing, and rhythms"
        onDismiss={handleAct6Dismiss}
      />
    )
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '740px',
        margin: '0 auto',
        minHeight: '70vh',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {/* ============================================================ */}
        {/* SUBSTEP 0: TEXTURE FLAGS                                     */}
        {/* ============================================================ */}
        {subStep === 0 && (
          <motion.div
            key={`flags-${activeKey}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Eyebrow */}
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
            }}>
              ACT 5 · DEEPER LOOK ({currentIndex + 1} OF {qualifyingKeys.length})
            </p>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 3.6vw, 44px)',
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              margin: '0 0 8px 0',
              color: 'var(--text-main, #414242)',
            }}>
              {activeSpec.label}
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: '0 0 28px 0',
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              {activeSpec.prompt} (Select any that apply)
            </p>

            {/* 6 Flag Check Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '10px',
              width: '100%',
              maxWidth: '680px',
              marginBottom: '28px',
            }}>
              {activeSpec.flags.map((flag) => {
                const isSelected = currentFlags.includes(flag)
                return (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => handleToggleFlag(flag)}
                    className={`flag-choice-card option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: isSelected ? 700 : 600,
                      border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                      background: isSelected ? 'rgba(0, 174, 157, 0.12)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                      color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      boxShadow: isSelected ? '0 0 0 1.5px var(--dawn, #00ae9d), 0 4px 14px rgba(0, 174, 157, 0.18)' : 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{ textAlign: 'left', flex: 1, paddingRight: '12px', lineHeight: 1.35 }}>{flag}</span>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid var(--dawn, #00ae9d)' : '2px solid var(--border-strong, #cbd5e1)',
                      background: isSelected ? 'var(--dawn, #00ae9d)' : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Continue to Trajectory */}
            <button
              type="button"
              onClick={() => setSubStep(1)}
              className="btn-primary"
              style={{
                padding: '12px 38px',
                borderRadius: '100px',
                fontSize: '14.5px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.02em',
                border: 'none',
                background: 'var(--dawn, #00ae9d)',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 174, 157, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* SUBSTEP 1: TRAJECTORY                                        */}
        {/* ============================================================ */}
        {subStep === 1 && (
          <motion.div
            key={`traj-${activeKey}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
            }}>
              TRAJECTORY · {activeSpec.label}
            </p>

            <p style={{
              margin: '0 0 24px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Looking across recent weeks.
            </p>

            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(24px, 3.4vw, 40px)',
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              margin: '0 0 32px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '620px',
              textAlign: 'center',
            }}>
              Is this getting better, worse, staying the same, or varying?
            </h1>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '440px',
              marginBottom: '20px',
            }}>
              {TRAJECTORY_OPTIONS.map((opt) => {
                const isSelected = currentTraj === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectTraj(opt)}
                    className={`option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      padding: '13px 20px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: isSelected ? 700 : 600,
                      border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                      background: isSelected ? 'rgba(0, 174, 157, 0.14)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                      color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 0 1.5px var(--dawn, #00ae9d), 0 4px 14px rgba(0, 174, 157, 0.18)' : 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {isSelected && <span style={{ fontSize: '13px', lineHeight: 1 }}>✓</span>}
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* SUBSTEP 2: FRICTION & OBSTACLE                               */}
        {/* ============================================================ */}
        {subStep === 2 && (
          <motion.div
            key={`friction-${activeKey}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--dawn, #00ae9d)',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
            }}>
              OBSTACLES &amp; FRICTIONS · {activeSpec.label}
            </p>

            <p style={{
              margin: '0 0 24px 0',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'var(--text-sub, #657370)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              What feels like the biggest blocker right now?
            </p>

            <h1 style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(24px, 3.4vw, 40px)',
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              margin: '0 0 32px 0',
              color: 'var(--text-main, #414242)',
              maxWidth: '620px',
              textAlign: 'center',
            }}>
              What's most in the way right now?
            </h1>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '460px',
              marginBottom: '20px',
            }}>
              {FRICTION_OPTIONS.map((opt) => {
                const isSelected = currentFriction === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectFriction(opt)}
                    className={`option-pill ${isSelected ? 'selected active' : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      padding: '13px 20px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: isSelected ? 700 : 600,
                      border: isSelected ? '1.5px solid var(--dawn, #00ae9d)' : '1px solid var(--card-border, #e5e7eb)',
                      background: isSelected ? 'rgba(0, 174, 157, 0.14)' : 'var(--card-bg, rgba(255, 255, 255, 0.7))',
                      color: isSelected ? 'var(--dawn, #00ae9d)' : 'var(--text-main, #414242)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 0 1.5px var(--dawn, #00ae9d), 0 4px 14px rgba(0, 174, 157, 0.18)' : 'var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.04))',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {isSelected && <span style={{ fontSize: '13px', lineHeight: 1 }}>✓</span>}
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
