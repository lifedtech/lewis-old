import { create } from 'zustand'

// Load persisted auth from localStorage safely
let savedToken = null
let savedUser = null

if (typeof window !== 'undefined') {
  try {
    savedToken = localStorage.getItem('lewis_auth_token') || null
    const rawUser = localStorage.getItem('lewis_user')
    if (rawUser && rawUser !== 'undefined' && rawUser !== 'null') {
      savedUser = JSON.parse(rawUser)
    }
  } catch (e) {
    console.warn('Failed to parse saved auth from localStorage:', e)
    savedToken = null
    savedUser = null
  }
}

// Every piece of journey state lives here, so reset() can restore all of
// it in one call. Defaults use fresh objects/arrays per call (a shared
// constant would leak mutations across resets).
const initialState = () => ({
  currentScreen: 'landing',

  // Auth State
  isAuthenticated: !!savedToken,
  authUser: savedUser,
  authToken: savedToken || null,
  authPendingDownload: false,

  // Pre-Stage & Stage 0
  isOver18: null,
  sensoryCalibrationDone: false,

  // Journey Telemetry & Tracking
  journeySessionId: (typeof window !== 'undefined' && localStorage.getItem('lewis_journey_session_id')) || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
  journeyStartTime: (typeof window !== 'undefined' && Number(localStorage.getItem('lewis_journey_start_time'))) || Date.now(),

  // User Profile & Delivery (50% Milestone)
  email: savedUser?.email || '',
  phone: '',
  subscribeNewsletter: true,
  latestPaymentOrder: null,

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

  // Assessment Analysis Cache
  analysisData: null,
  analysisMissing: null,
  analysisError: null,

  // Payment & Report Entitlement State
  isReportUnlocked: false,
  unlockedReportId: null,
  paymentConfig: null,
  isPaymentProcessing: false,
  paymentError: null,
})

export const useLewisStore = create((set, get) => ({
  ...initialState(),

  setScreen: (screenName, options = {}) => {
    const target = (typeof screenName === 'string' && screenName.trim()) ? screenName.trim() : 'landing'
    set({ currentScreen: target })
    if (typeof window !== 'undefined' && (!options || !options.skipHistory)) {
      try {
        if (window.history.state?.screen !== target) {
          window.history.pushState({ screen: target }, '', `#${target}`)
        }
      } catch (e) {
        console.warn('History pushState error:', e)
      }
    }
  },

  setAuth: (user, token) => {
    if (token && user) {
      try {
        localStorage.setItem('lewis_auth_token', token)
        localStorage.setItem('lewis_user', JSON.stringify(user))
      } catch (e) {
        console.warn('Failed to save auth to localStorage:', e)
      }
    }
    set({ isAuthenticated: true, authUser: user, authToken: token })
  },

  logout: async () => {
    const token = get().authToken

    // Clear local state first so the user is logged out in the UI
    // immediately, even if the server-side revoke call below fails,
    // hangs, or the network is down entirely.
    try {
      localStorage.removeItem('lewis_auth_token')
      localStorage.removeItem('lewis_user')
    } catch (e) {
      console.warn('Failed to clear auth from localStorage:', e)
    }
    set({ isAuthenticated: false, authUser: null, authToken: null })

    // Best-effort server-side session revocation (SEC-003). If this
    // fails, the user is still logged out locally; the server-side
    // session simply expires on its own TTL instead of being revoked
    // immediately.
    if (token) {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (e) {
        console.warn('Server-side logout failed (session will expire on its own TTL):', e)
      }
    }
  },

  setAffect: (x, y) => set({ affect: { x, y } }),

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

  getJourneyDurationSeconds: () => {
    const start = get().journeyStartTime || Date.now()
    return Math.max(0, Math.floor((Date.now() - start) / 1000))
  },

  initJourneySession: () => {
    const sessId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const now = Date.now()
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lewis_journey_session_id', sessId)
        localStorage.setItem('lewis_journey_start_time', String(now))
      } catch (e) {
        console.warn('LocalStorage error:', e)
      }
    }
    set({ journeySessionId: sessId, journeyStartTime: now })
    return { sessionId: sessId, startTime: now }
  },

  fetchPaymentConfig: async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/payment/config`)
      if (res.ok) {
        const data = await res.json()
        set({ paymentConfig: data.config })
        return data.config
      }
    } catch (e) {
      console.warn('Could not fetch payment config:', e)
    }
    return null
  },

  checkReportEntitlement: async (reportUuid) => {
    if (!reportUuid) return false
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/reports/${reportUuid}/status`)
      if (res.ok) {
        const data = await res.json()
        if (data.is_unlocked) {
          set({ isReportUnlocked: true, unlockedReportId: reportUuid })
          return true
        }
      }
    } catch (e) {
      console.warn('Entitlement check error:', e)
    }
    return false
  },

  setPaymentSuccess: (details = {}) => {
    set({
      isReportUnlocked: true,
      unlockedReportId: details.reportUuid || details.report_uuid,
      latestPaymentOrder: details,
      isPaymentProcessing: false,
      paymentError: null
    })
  },

  // Full wipe: every answer and context field back to its default.
  reset: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('lewis_journey_session_id')
        localStorage.removeItem('lewis_journey_start_time')
      } catch (e) {
        console.warn('LocalStorage error:', e)
      }
    }
    set(initialState())
  },
}))
