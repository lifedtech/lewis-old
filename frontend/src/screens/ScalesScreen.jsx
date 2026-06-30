import React, { useState } from 'react'
import { useLewisStore } from '../store/useLewisStore.js'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  WHO5_SCALE, PSS10_SCALE, UCLA3_SCALE, GSE_SCALE, PROMIS_SCALE, CFPB5_1_SCALE, CFPB5_2_SCALE 
} from '../constants/scales.js'

const WHO5_ITEMS = [
  { id: 'w1', text: 'I have felt cheerful and in good spirits.' },
  { id: 'w2', text: 'I have felt calm and relaxed.' },
  { id: 'w3', text: 'I have felt active and vigorous.' },
  { id: 'w4', text: 'I woke up feeling fresh and rested.' },
  { id: 'w5', text: 'My daily life has been filled with things that interest me.' }
]

const PSS10_ITEMS = [
  { id: 'p1', text: '...been upset because of something that happened unexpectedly?' },
  { id: 'p2', text: '...felt unable to control the important things in your life?' },
  { id: 'p3', text: '...felt nervous and stressed?' },
  { id: 'p4', text: '...felt confident about your ability to handle your personal problems?' },
  { id: 'p5', text: '...felt that things were going your way?' },
  { id: 'p6', text: '...found that you could not cope with all the things you had to do?' },
  { id: 'p7', text: '...been able to control irritations in your life?' },
  { id: 'p8', text: '...felt that you were on top of things?' },
  { id: 'p9', text: '...been angered because of things outside your control?' },
  { id: 'p10', text: '...felt difficulties were piling up so high you could not overcome them?' }
]

const UCLA3_ITEMS = [
  { id: 'u1', text: '...that you lack companionship?' },
  { id: 'u2', text: '...left out?' },
  { id: 'u3', text: '...isolated from others?' }
]

const GSE_ITEMS = [
  { id: 'g1', text: 'I can always manage to solve difficult problems if I try hard enough.' },
  { id: 'g2', text: 'If someone opposes me, I can find the means and ways to get what I want.' },
  { id: 'g3', text: 'It is easy for me to stick to my aims and accomplish my goals.' },
  { id: 'g4', text: 'I am confident that I could deal efficiently with unexpected events.' },
  { id: 'g5', text: 'Thanks to my resourcefulness, I know how to handle unforeseen situations.' },
  { id: 'g6', text: 'I can solve most problems if I invest the necessary effort.' },
  { id: 'g7', text: 'I can remain calm when facing difficulties because I can rely on my coping abilities.' },
  { id: 'g8', text: 'When I am confronted with a problem, I can usually find several solutions.' },
  { id: 'g9', text: 'If I am in trouble, I can usually think of a solution.' },
  { id: 'g10', text: 'I can usually handle whatever comes my way.' }
]

const PROMIS_ITEMS = [
  { id: 'pr1', text: 'My life has meaning.' },
  { id: 'pr2', text: 'I have a sense of direction in my life.' },
  { id: 'pr3', text: 'My life has purpose.' },
  { id: 'pr4', text: 'The things I do in my life are worthwhile.' }
]

const CFPB5_1_ITEMS = [
  { id: 'c1', text: 'Because of my money situation, I feel like I will never have the things I want in life.' },
  { id: 'c2', text: 'I am just getting by financially.' },
  { id: 'c3', text: 'I am concerned that the money I have or will save won\'t last.' }
]

const CFPB5_2_ITEMS = [
  { id: 'c4', text: 'I have money left over at the end of the month.' },
  { id: 'c5', text: 'My finances control my life.' }
]

export default function ScalesScreen() {
  const { setScaleAnswer, who5, pss10, ucla3, gse, promis, cfpb5_1, cfpb5_2, door, setScreen } = useLewisStore()
  const [scaleIdx, setScaleIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)

  const allPages = [
    { title: 'Overall Wellbeing', prompt: 'Over the last two weeks...', items: WHO5_ITEMS, scale: WHO5_SCALE, storeKey: 'who5', stateVal: who5 },
    { title: 'Emotional & Mental', prompt: 'In the last month, how often have you...', items: PSS10_ITEMS, scale: PSS10_SCALE, storeKey: 'pss10', stateVal: pss10 },
    { title: 'Relationships & Social', prompt: 'How often do you feel...', items: UCLA3_ITEMS, scale: UCLA3_SCALE, storeKey: 'ucla3', stateVal: ucla3 },
    { title: 'Accomplishment & Agency', prompt: 'How true is each of these for you?', items: GSE_ITEMS, scale: GSE_SCALE, storeKey: 'gse', stateVal: gse },
    { title: 'Meaning & Spiritual', prompt: 'How much do you agree with each, thinking about the past 7 days?', items: PROMIS_ITEMS, scale: PROMIS_SCALE, storeKey: 'promis', stateVal: promis },
    { title: 'Financial Wellness', prompt: 'How well does each describe you?', items: CFPB5_1_ITEMS, scale: CFPB5_1_SCALE, storeKey: 'cfpb5_1', stateVal: cfpb5_1 },
    { title: 'Financial Wellness', prompt: 'How often is each true?', items: CFPB5_2_ITEMS, scale: CFPB5_2_SCALE, storeKey: 'cfpb5_2', stateVal: cfpb5_2 }
  ]

  const pages = door === 'pulse' ? [allPages[0]] : allPages

  const currentScale = pages[scaleIdx]
  const currentItem = currentScale.items[qIdx]
  const currentAnswer = currentScale.stateVal[currentItem.id]

  const handleNext = () => {
    if (qIdx < currentScale.items.length - 1) {
      setQIdx(qIdx + 1)
    } else if (scaleIdx < pages.length - 1) {
      setScaleIdx(scaleIdx + 1)
      setQIdx(0)
    } else {
      setScreen('mindgames')
    }
  }

  const handleSelect = (val) => {
    setScaleAnswer(currentScale.storeKey, currentItem.id, val)
    setTimeout(() => {
      handleNext()
    }, 400) // Auto-advance for a conversational feel
  }

  // Calculate overall progress
  const totalQuestions = pages.reduce((acc, p) => acc + p.items.length, 0)
  let currentQuestionOverall = 0
  for (let i = 0; i < scaleIdx; i++) {
    currentQuestionOverall += pages[i].items.length
  }
  currentQuestionOverall += qIdx + 1

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>
        {currentScale.title} · {currentQuestionOverall} / {totalQuestions}
      </p>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentItem.id}
          initial={{opacity:0, y: 10}} 
          animate={{opacity:1, y: 0}} 
          exit={{opacity:0, y: -10}} 
          transition={{ duration: 0.3 }}
          className="q-card"
          style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}
        >
          <p className="q-caption" style={{textAlign:'center', marginBottom:'12px'}}>{currentScale.prompt}</p>
          <h1 className="q-text" style={{textAlign:'center', marginBottom:'40px'}}>{currentItem.text}</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentScale.scale.map((opt, idx) => (
              <button
                key={idx}
                className={`scale-opt ${currentAnswer === opt ? 'selected' : ''}`}
                onClick={() => handleSelect(opt)}
                style={{
                  background: currentAnswer === opt ? 'var(--dawn-glow)' : 'var(--panel-2)',
                  border: `1px solid ${currentAnswer === opt ? 'var(--dawn)' : 'var(--panel-border)'}`,
                  color: currentAnswer === opt ? 'var(--dawn)' : 'var(--text-mute)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}
