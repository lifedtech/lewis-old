import { create } from 'zustand'

export const useLewisStore = create((set) => ({
  currentScreen: 'landing',
  setScreen: (screenName) => set({ currentScreen: screenName }),

  // Pre-Stage & Stage 0
  isOver18: null,
  sensoryCalibrationDone: false,
  
  // Stage 1 Context
  name: '',
  ageCategory: '',
  gender: '',
  identityRoles: [],
  lifeStability: 50, // 0-100 slider
  activePressures: [],
  bodyMovement: '',
  sleepQuality: '',
  bodyContext: [],
  who5: {},
  relationalContext: '',
  priorities: [
    'Physical ease & recovery',
    'Emotional calm & mental health',
    'Energy & engagement',
    'Connection & relationships',
    'Meaning & purpose',
    'Progress & contribution',
    'Financial security & peace',
    'Intellectual growth & curiosity',
    'Environment & belonging'
  ],
  arrivalState: '',
  financialPulse: {},
  environmentalPulse: {},
  intellectualPulse: '',
  culturalBelonging: {},
  bodyRhythm: {},
  sensoryPauseDone: false,
  
  // Stage 2 Attention
  attentionDriftDone: false,

  // Stage 3 Nervous System
  affect: { x: null, y: null },
  setAffect: (x, y) => set({ affect: { x, y } }),
  bodyMapZones: [],
  dayRhythmMap: [], 
  breathingBefore: '',
  breathingAfter: '',
  nervousSystemState: '',
  bodyAwareness: '',

  // Stage 4 Maze
  mazeCompletionTime: null,

  // Stage 5 Domains
  lifeLandscape: { depleted: [], okay: [], strength: [] },
  pss10: {},
  ucla3: {},
  gse: {},
  promis: {},
  cfpb5: {},
  diener: {},
  ins: null, 
  swls: {},
  adaptiveDeepDives: {}, 
  brightSpotCheck: '',
  priorityTensionCheck: '',

  // Stage 6 Sharing
  everydaySharing: {},

  // Stage 7 Context
  externalConditions: {},
  priorAttempts: '',
  aspirationLandscape: '',
  supportPreferences: [],
  plannerReadiness: '',
  valuesCheck: [],
  financialAspiration: '',

  // Stage 8 Stress
  energyArc: { morning: '', afternoon: '', evening: '', night: '' },
  stressPatternClusters: [],
  recoveryResponsiveness: '',
  cumulativeLoad: {},

  // Stage 9 Sensory
  soundPreference: '',
  quickChoices: {},

  // Generic helpers
  setProfileField: (field, value) => set({ [field]: value }),

  toggleArrayItem: (field, value) => set((s) => {
    const arr = s[field] || []
    return { [field]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value] }
  }),

  setScaleAnswer: (scaleName, qId, val) => set((s) => ({
    [scaleName]: { ...s[scaleName], [qId]: val }
  })),

  updateObjectField: (objName, key, val) => set((s) => ({
    [objName]: { ...s[objName], [key]: val }
  })),

  reset: () => set({
    currentScreen: 'landing',
    isOver18: null,
    // reset rest to initial...
  })
}))
