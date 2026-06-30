import { create } from 'zustand'

export const useLewisStore = create((set) => ({
  currentScreen: 'welcome',
  setScreen: (screenName) => set({ currentScreen: screenName }),

  // User Profile & Stage 1
  isOver18: null,
  name: '',
  ageCategory: '',
  gender: '',
  profession: '',
  roles: [],
  lifePressures: [],
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
  setProfileField: (field, value) => set({ [field]: value }),

  toggleArrayItem: (field, value) => set((s) => {
    const arr = s[field] || []
    return { [field]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value] }
  }),

  // Path selection
  door: null, // 'pulse' or 'full'
  setDoor: (doorVal) => set({ door: doorVal }),

  // Stage 5 Measurement Spine
  who5: {},
  pss10: {},
  ucla3: {},
  gse: {},
  promis: {},
  cfpb5_1: {},
  cfpb5_2: {},
  
  setScaleAnswer: (scaleName, qId, val) => set((s) => ({
    [scaleName]: { ...s[scaleName], [qId]: val }
  })),

  // Checkbox/chips (legacy prototype)
  chips: [],
  toggleChip: (chipText) => set((s) => {
    const arr = s.chips.includes(chipText)
      ? s.chips.filter(c => c !== chipText)
      : [...s.chips, chipText]
    return { chips: arr }
  }),

  // Somatic
  settled: null,
  setSettled: (val) => set({ settled: val }),
  affect: { x: null, y: null },
  setAffect: (x, y) => set({ affect: { x, y } }),

  reset: () => set({
    currentScreen: 'welcome',
    isOver18: null,
    name: '',
    ageCategory: '',
    gender: '',
    profession: '',
    door: null,
    who5: {},
    chips: [],
    settled: null,
  })
}))
