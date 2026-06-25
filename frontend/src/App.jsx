/**
 * App.jsx — LEWIS main router
 * Stage navigation is driven entirely by the Zustand store's `stage` field.
 *
 * Stage map:
 *  0  — Welcome & Age Gate      (Stage0_Welcome)
 *  1  — Context & Personalization (Stage1_Context)
 *  2  — Attention Drift          (Stage2_Attention)
 *  3  — Somatic / Body           (Stage3_Somatic)
 *  4  — Energy Maze              (Stage4_Energy)
 *  5  — Validated Measurements   (Stage5_Scales)
 *  6  — Everyday Sharing         (Stage6_Sharing)
 *  7  — Habits & Preferences     (Stage7_Habits)
 *  8  — Patterns                 (Stage8_Patterns)
 *  9  — Sound & Quick Choices    (Stage9_Sound)
 * 10  — [Final Reflection stub]  (Stage10_Generating — used as reflection/final)
 * 11  — Generating Moment        (Stage10_Generating — transition screen)
 * 11  — Results                  (ResultsStage)
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useLewisStore } from './store/useLewisStore.js'
import AmbientBackground from './components/AmbientBackground.jsx'

// Stage components
import Stage0_Welcome    from './stages/Stage0_Welcome.jsx'
import Stage1_Context    from './stages/Stage1_Context.jsx'
import Stage2_Attention  from './stages/Stage2_Attention.jsx'
import Stage3_Somatic    from './stages/Stage3_Somatic.jsx'
import Stage4_Energy     from './stages/Stage4_Energy.jsx'
import Stage5_Scales     from './stages/Stage5_Scales.jsx'
import Stage6_Sharing    from './stages/Stage6_Sharing.jsx'
import Stage7_Habits     from './stages/Stage7_Habits.jsx'
import Stage8_Patterns   from './stages/Stage8_Patterns.jsx'
import Stage9_Sound      from './stages/Stage9_Sound.jsx'
import Stage10_Generating from './stages/Stage10_Generating.jsx'
import ResultsStage      from './stages/ResultsStage.jsx'

import styles from './App.module.css'

const STAGE_COMPONENTS = {
  0:  Stage0_Welcome,
  1:  Stage1_Context,
  2:  Stage2_Attention,
  3:  Stage3_Somatic,
  4:  Stage4_Energy,
  5:  Stage5_Scales,
  6:  Stage6_Sharing,
  7:  Stage7_Habits,
  8:  Stage8_Patterns,
  9:  Stage9_Sound,
  10: Stage10_Generating, // generating/transition moment
  11: ResultsStage,
}

export default function App() {
  const stage = useLewisStore(s => s.stage)
  const StageComponent = STAGE_COMPONENTS[stage] ?? Stage0_Welcome

  return (
    <>
      <AmbientBackground />
      <div className={styles.appShell}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <StageComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
