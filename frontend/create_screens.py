import os

screens = [
    "PreStage0Age",
    "PreStage0Sensory",
    "Stage1_0About",
    "Stage1_1Identity",
    "Stage1_2Stability",
    "Stage1_3Pressures",
    "Stage1_4Body",
    "Stage1_5Who5",
    "Stage1_6Relational",
    "Stage1_7Priority",
    "Stage1_8Arrival",
    "Stage1_9Financial",
    "Stage1_10Environment",
    "Stage1_11Intellectual",
    "Stage1_12Cultural",
    "Stage1_13BodyRhythm",
    "Stage1_14SensoryPause",
    "Stage2Attention",
    "Stage3_1Affect",
    "Stage3_2BodyMap",
    "Stage3_3DayRhythm",
    "Stage3_4Breathing",
    "Stage3_5NsState",
    "Stage3_6BodyAwareness",
    "Stage4Maze",
    "Stage5_1Landscape",
    "Stage5_2Pss10",
    "Stage5_2Ucla3",
    "Stage5_2Gse",
    "Stage5_2Promis",
    "Stage5_2Cfpb5",
    "Stage5_2Diener",
    "Stage5_2Ins",
    "Stage5_2Swls",
    "Stage5_3DeepDives",
    "Stage5_4BrightSpot",
    "Stage5_5PriorityTension",
    "Stage6Sharing",
    "Stage7_1External",
    "Stage7_2Prior",
    "Stage7_3Aspiration",
    "Stage7_4Support",
    "Stage7_5Planner",
    "Stage7_6Values",
    "Stage7_7FinancialAsp",
    "Stage8_1EnergyArc",
    "Stage8_2StressPattern",
    "Stage8_3Recovery",
    "Stage8_4Cumulative",
    "Stage9Sensory",
    "Stage9QuickChoices",
    "Stage10Generating",
]

template = """import React from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function %sScreen() {
  const { setScreen } = useLewisStore()

  const handleNext = () => {
    setScreen('%s')
  }

  return (
    <motion.div
      className="screen-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-wrapper">
        <h2 className="question-text">Placeholder for %s</h2>
        
        {/* Implementation goes here */}
        
        <div className="button-group" style={{ marginTop: 'auto' }}>
          <button className="btn-primary" onClick={handleNext}>
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}
"""

screens_dir = r"e:\lifed-LEWIS\frontend\src\screens"
os.makedirs(screens_dir, exist_ok=True)

app_imports = ""
app_screens_map = ""
app_screen_order = []

for i, screen in enumerate(screens):
    next_screen = screens[i+1] if i + 1 < len(screens) else "Mirror"
    
    camel_name = screen[0].lower() + screen[1:]
    next_camel = next_screen[0].lower() + next_screen[1:] if next_screen != "Mirror" else "mirror"
    
    file_path = os.path.join(screens_dir, f"{screen}Screen.jsx")
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            f.write(template % (screen, next_camel, screen))
            
    app_imports += f"import {screen}Screen from './screens/{screen}Screen.jsx'\n"
    app_screens_map += f"  {camel_name}: {screen}Screen,\n"
    app_screen_order.append(f"'{camel_name}'")

app_screen_order.append("'mirror'")

print("IMPORTS:\n" + app_imports)
print("MAP:\n" + app_screens_map)
print("ORDER:\nconst SCREEN_ORDER = [\n  " + ",\n  ".join(app_screen_order) + "\n]")
