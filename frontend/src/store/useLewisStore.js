/**
 * LEWIS Global State — Zustand
 * Stores all answers, background scores, flags, and routing state
 */
import { create } from 'zustand'

export const useLewisStore = create((set, get) => ({
  // ── Navigation ──────────────────────────────────────
  stage: 0,           // 0=Welcome, 1-10=Stages, 11=Generating, 12=Results
  subStage: 0,        // for stages with multiple sub-screens (e.g. Stage 3)

  // ── Safety flags ────────────────────────────────────
  safetyTriggered: false,
  distressFlags: [],

  // ── Age gate ────────────────────────────────────────
  ageConfirmed: false,
  ageBlocked: false,

  // ── All answers (flat map) ───────────────────────────
  answers: {},

  // ── Background computed scores (0-100) ──────────────
  scores: {
    emotional_wellbeing:  50,
    stress_load:          50,
    connection_isolation: 50,
    sleep_recovery:       50,
    physical_activity:    50,
    financial_peace:      50,
    purpose_meaning:      50,
    burnout_workload:     50,
    nutrition_hydration:  50,
  },

  // ── Adaptive deep-dive flags ─────────────────────────
  // Which dimensions scored < 55 (triggers sub-flow, max 4)
  deepDiveDimensions: [],

  // ── Somatic/interactive task data ────────────────────
  attentionData:   null,   // Stage 2: precision log
  affectPoint:     null,   // Stage 3.1: {x, y} on affect canvas
  bodyZones:       [],     // Stage 3.2: selected body zones
  breathingPre:    null,   // Stage 3.4: pre-breathing tension (0-10)
  breathingPost:   null,   // Stage 3.4: post-breathing tension (0-10)
  mazeDuration:    null,   // Stage 4: time taken (ms)

  // ── Actions ──────────────────────────────────────────
  setAnswer: (key, value) => set(state => ({
    answers: { ...state.answers, [key]: value },
  })),

  setAnswers: (obj) => set(state => ({
    answers: { ...state.answers, ...obj },
  })),

  setScore: (dim, value) => set(state => ({
    scores: { ...state.scores, [dim]: value },
  })),

  setScores: (obj) => set(state => ({
    scores: { ...state.scores, ...obj },
  })),

  nextStage: () => set(state => ({ stage: state.stage + 1, subStage: 0 })),
  prevStage: () => set(state => ({ stage: Math.max(0, state.stage - 1), subStage: 0 })),
  goToStage: (n) => set({ stage: n, subStage: 0 }),
  nextSubStage: () => set(state => ({ subStage: state.subStage + 1 })),
  prevSubStage: () => set(state => ({ subStage: Math.max(0, state.subStage - 1) })),

  confirmAge: () => set({ ageConfirmed: true }),
  blockAge:   () => set({ ageBlocked: true }),

  triggerSafety: (flag) => set(state => ({
    safetyTriggered: true,
    distressFlags: [...state.distressFlags, flag],
  })),

  setAttentionData:  (d)  => set({ attentionData: d }),
  setAffectPoint:    (pt) => set({ affectPoint: pt }),
  setBodyZones:      (z)  => set({ bodyZones: z }),
  setBreathingPre:   (v)  => set({ breathingPre: v }),
  setBreathingPost:  (v)  => set({ breathingPost: v }),
  setMazeDuration:   (ms) => set({ mazeDuration: ms }),
  setDeepDiveDimensions: (dims) => set({ deepDiveDimensions: dims }),

  reset: () => set({
    stage: 0, subStage: 0,
    ageConfirmed: false, ageBlocked: false,
    safetyTriggered: false, distressFlags: [],
    answers: {},
    scores: {
      emotional_wellbeing: 50, stress_load: 50, connection_isolation: 50,
      sleep_recovery: 50, physical_activity: 50, financial_peace: 50,
      purpose_meaning: 50, burnout_workload: 50, nutrition_hydration: 50,
    },
    deepDiveDimensions: [],
    attentionData: null, affectPoint: null, bodyZones: [],
    breathingPre: null, breathingPost: null, mazeDuration: null,
  }),
}))
