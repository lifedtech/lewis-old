export const STAGE_NAMES = [
  'Setup',
  'Life Context',
  'Cognitive Focus',
  'ANS & Somatic',
  'Maze Task',
  'Core Assessment',
  'Sharing Context',
  'Action & Support',
  'Cumulative Load',
  'Sensory Choices',
  'The Mirror'
]

export const SCREEN_ORDER = [
  'landing',
  'stage1_0About',
  'stage1_1Identity',
  'stage1_2Stability',
  'stage1_3Pressures',
  'stage1_4Body',
  'stage1_5Who5',
  'stage1_6Relational',
  'stage1_7Priority',
  'stage1_8Arrival',
  'stage1_9Financial',
  'stage1_10Environment',
  'stage1_11Intellectual',
  'stage1_12Cultural',
  'stage1_13BodyRhythm',
  'stage1_14SensoryPause',
  'stage2Attention',
  'stage3_1Affect',
  'stage3_2BodyMap',
  'stage3_3DayRhythm',
  'stage3_4Breathing',
  'stage3_5NsState',
  'stage3_6BodyAwareness',
  'stage4Maze',
  'stage5_1Landscape',
  'stage5_0Email',
  'stage5_2Pss10',
  'stage5_2Ucla3',
  'stage5_2Gse',
  'stage5_2Promis',
  'stage5_2Cfpb5',
  'stage5_2Diener',
  'stage5_2Ins',
  'stage5_2Swls',
  'stage5_3DeepDives',
  'stage5_4BrightSpot',
  'stage5_5PriorityTension',
  'stage6Sharing',
  'stage7_1External',
  'stage7_2Prior',
  'stage7_3Aspiration',
  'stage7_4Support',
  'stage7_5Planner',
  'stage7_6Values',
  'stage7_7FinancialAsp',
  'stage7_8Friction',
  'stage8_1EnergyArc',
  'stage8_2StressPattern',
  'stage8_3Recovery',
  'stage8_4Cumulative',
  'stage9Sensory',
  'stage10Generating',
  'mirror'
]

export function getStageInfo(screen) {
  if (!screen || screen === 'landing' || screen === 'stage1_0About') {
    return { num: 0, name: STAGE_NAMES[0] }
  }
  if (screen.startsWith('stage1_')) return { num: 1, name: STAGE_NAMES[1] }
  if (screen.startsWith('stage2')) return { num: 2, name: STAGE_NAMES[2] }
  if (screen.startsWith('stage3_')) return { num: 3, name: STAGE_NAMES[3] }
  if (screen.startsWith('stage4')) return { num: 4, name: STAGE_NAMES[4] }
  if (screen.startsWith('stage5_')) return { num: 5, name: STAGE_NAMES[5] }
  if (screen.startsWith('stage6')) return { num: 6, name: STAGE_NAMES[6] }
  if (screen.startsWith('stage7_')) return { num: 7, name: STAGE_NAMES[7] }
  if (screen.startsWith('stage8_')) return { num: 8, name: STAGE_NAMES[8] }
  if (screen.startsWith('stage9')) return { num: 9, name: STAGE_NAMES[9] }
  if (screen.startsWith('stage10') || screen === 'mirror' || screen === 'payment') return { num: 10, name: STAGE_NAMES[10] }
  return { num: 0, name: STAGE_NAMES[0] }
}
