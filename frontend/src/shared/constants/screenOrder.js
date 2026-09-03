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

export const STREAMLINED_ACTS = [
  { num: 1, name: 'Arrival', subtitle: 'A little about you, so the rest fits.' },
  { num: 2, name: 'How life feels', subtitle: 'Some of this is words. Some of it is not.' },
  { num: 3, name: 'The measured core', subtitle: 'The most researched part of LEWIS. Plainer on purpose.' },
  { num: 4, name: 'The shape of your life', subtitle: 'Now the part that is yours to arrange.' },
  { num: 5, name: "What's in the way", subtitle: 'A few short questions about the areas that felt hardest.' },
  { num: 6, name: 'How to help you', subtitle: 'Last few. Then one small thing, just for you.' }
]

export const STREAMLINED_SCREEN_ORDER = [
  'landing',
  'sl_gate',
  'sl_welcome',
  'sl_1_0About',
  'sl_1_1Identity',
  'sl_1_2Stability',
  'sl_1_3Pressures',
  'sl_1_8Arrival',
  'sl_1_5Who5',
  'sl_3_1Affect',
  'sl_3_2BodyMap',
  'sl_3_5NsState',
  'sl_3_6BodyAwareness',
  'sl_1_4Body',
  'sl_5_2Pss10',
  'sl_5_2Ucla3',
  'sl_5_2Gse',
  'sl_5_2Promis',
  'sl_5_2Cfpb5',
  'sl_5_2Ins',
  'sl_5_2Growth',
  'sl_5_1Landscape',
  'sl_5_1Priority',
  'sl_5_5PriorityTension',
  'sl_5_4BrightSpot',
  'sl_5_0Email',
  'sl_5_3DeepDives',
  'sl_7_4Support',
  'sl_7_2Prior',
  'sl_7_5Planner',
  'sl_8_1EnergyArc',
  'sl_8_3Recovery',
  'sl_8_2StressPattern',
  'sl_8_4Cumulative',
  'sl_3_4Breathing',
  'sl_10Generating',
  'sl_mirror',
  'sl_report'
]

export function getStreamlinedActInfo(screen) {
  if (!screen || screen === 'landing' || screen === 'sl_gate' || screen === 'sl_welcome') {
    return { actNum: 0, actName: 'Welcome', subtitle: '' }
  }
  if (['sl_1_0About', 'sl_1_1Identity', 'sl_1_2Stability', 'sl_1_3Pressures'].includes(screen)) {
    return { actNum: 1, actName: STREAMLINED_ACTS[0].name, subtitle: STREAMLINED_ACTS[0].subtitle }
  }
  if (['sl_1_8Arrival', 'sl_1_5Who5', 'sl_3_1Affect', 'sl_3_2BodyMap', 'sl_3_5NsState', 'sl_3_6BodyAwareness'].includes(screen)) {
    return { actNum: 2, actName: STREAMLINED_ACTS[1].name, subtitle: STREAMLINED_ACTS[1].subtitle }
  }
  if (['sl_1_4Body', 'sl_5_2Pss10', 'sl_5_2Ucla3', 'sl_5_2Gse', 'sl_5_2Promis', 'sl_5_2Cfpb5', 'sl_5_2Ins', 'sl_5_2Growth'].includes(screen)) {
    return { actNum: 3, actName: STREAMLINED_ACTS[2].name, subtitle: STREAMLINED_ACTS[2].subtitle }
  }
  if (['sl_5_1Landscape', 'sl_5_1Priority', 'sl_5_5PriorityTension', 'sl_5_4BrightSpot', 'sl_5_0Email'].includes(screen)) {
    return { actNum: 4, actName: STREAMLINED_ACTS[3].name, subtitle: STREAMLINED_ACTS[3].subtitle }
  }
  if (screen === 'sl_5_3DeepDives') {
    return { actNum: 5, actName: STREAMLINED_ACTS[4].name, subtitle: STREAMLINED_ACTS[4].subtitle }
  }
  if (['sl_7_4Support', 'sl_7_2Prior', 'sl_7_5Planner', 'sl_8_1EnergyArc', 'sl_8_3Recovery', 'sl_8_2StressPattern', 'sl_8_4Cumulative', 'sl_3_4Breathing'].includes(screen)) {
    return { actNum: 6, actName: STREAMLINED_ACTS[5].name, subtitle: STREAMLINED_ACTS[5].subtitle }
  }
  return { actNum: 6, actName: 'Reflection', subtitle: '' }
}

export function getStageInfo(screen) {
  if (screen && screen.startsWith('sl_')) {
    const act = getStreamlinedActInfo(screen)
    return { num: act.actNum, name: act.actName }
  }
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
