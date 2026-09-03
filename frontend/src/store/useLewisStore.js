import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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

  // Theme State ('light' | 'dark')
  theme: (typeof window !== 'undefined' && localStorage.getItem('lewis_theme')) || 'light',

  // Auth State
  isAuthenticated: !!savedToken,
  authUser: savedUser,
  authToken: savedToken || null,
  authPendingDownload: false,

  // Flow Mode ('streamlined' | 'full')
  flowMode: 'streamlined',

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

  // Common Context (Shared Across Flows)
  name: '',
  ageCategory: '',
  gender: '',
  sexAtBirth: '',
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
  arrivalWord: '',
  arrivalMood: 50,
  financialPulse: {},
  environmentalPulse: {},
  intellectualPulse: '',
  culturalBelonging: {},
  culturalBelonging_1: '',
  culturalBelonging_2: null,
  transcendentConnection: '',
  financialStress: '',
  incomeRegularity: '',
  natureAccess: '',
  bodyRhythm: {},
  sensoryPauseDone: false,

  // Streamlined Spine & Instruments
  pss10: {},
  ucla3: {},
  gse: {},
  gse6: {},
  promis: {},
  purpose: {},
  cfpb5: {},
  diener: {},
  ins: null,
  growth: {},
  growthRecency: '',
  swls: {},

  // Gestalt & Selection
  lifeLandscape: { depleted: [], okay: [], strength: [] },
  domainSort: { depleted: [], okay: [], strength: [] },
  priorityTop3: [],
  tensionConfirmed: null,
  brightSpotTier: 1,
  brightSpotText: '',
  adaptiveDeepDives: {},
  deepdiveFlags: {},
  deepdiveTrajectories: {},
  deepdiveFrictions: {},

  // Stage 2 Attention (Full Flow)
  attentionDriftDone: false,

  // Stage 3 Nervous System
  affect: { x: null, y: null },
  bodyMapZones: [],
  dayRhythmMap: [],
  breathingBefore: '',
  breathingAfter: '',
  nervousSystemState: '',
  nsPortrait: 'Grounded',
  bodyAwareness: '',

  // Stage 4 Maze (Full Flow)
  mazeCompletionTime: null,

  // Stage 6 Sharing (Full Flow)
  everydaySharing: {},

  // Stage 7 Support & Planning
  externalConditions: {},
  priorAttempts: '',
  priorEffectiveness: '',
  aspirationLandscape: '',
  supportPreferences: [],
  supportPreference: '',
  contentPreference: '',
  plannerReadiness: '',
  valuesCheck: [],
  financialAspiration: '',

  // Stage 8 Stress & Load
  energyArc: { morning: '', afternoon: '', evening: '', night: '' },
  energyArcPattern: [{ k: 'Morning', v: 2 }, { k: 'Afternoon', v: 2 }, { k: 'Evening', v: 2 }, { k: 'Night', v: 1 }],
  sleepOnset: '',
  stressResponseStyle: '',
  recoveryResponsiveness: '',
  stressPatternClusters: [],
  stressCluster: 'The Surge',
  cumulativeLoad: {},
  cumulativeLoad5: {},

  // One Minute Breathing
  tensionBefore: 50,
  tensionAfter: 30,

  // Stage 9 Sensory
  soundPreference: '',
  quickChoices: {},

  // Assessment Analysis Cache & Streamlined RRO
  analysisData: null,
  analysisMissing: null,
  analysisError: null,
  streamlinedRRO: null,
  streamlinedReportId: null,

  // Payment & Report Entitlement State
  isReportUnlocked: false,
  unlockedReportId: null,
  paymentConfig: null,
  isPaymentProcessing: false,
  paymentError: null,
})

// A refresh used to wipe every answer and drop the user back on 'landing'
// — the store was pure in-memory with no persistence at all. sessionStorage
// (not localStorage) so it survives a refresh/back-forward within the same
// tab/test session but doesn't linger indefinitely across browser restarts.
// authToken/authUser/isAuthenticated already have their own dedicated
// localStorage handling above and in setAuth/logout — excluded here to
// avoid two sources of truth for auth. Transient in-flight/error flags are
// excluded so a refresh never resurrects a stuck spinner or stale error.
export const useLewisStore = create(persist((set, get) => ({
  ...initialState(),

  setScreen: (screenName, options = {}) => {
    const target = (typeof screenName === 'string' && screenName.trim()) ? screenName.trim() : 'landing'
    set({ currentScreen: target })
    if (typeof window !== 'undefined' && (!options || !options.skipHistory)) {
      try {
        const newUrl = target === 'landing'
          ? (window.location.pathname + window.location.search)
          : `#${target}`
        if (window.history.state?.screen !== target || (target === 'landing' && window.location.hash)) {
          window.history.pushState({ screen: target }, '', newUrl)
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

  setTheme: (newTheme) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lewis_theme', newTheme)
      } catch (e) {
        console.warn('LocalStorage error:', e)
      }
    }
    set({ theme: newTheme })
  },

  setStreamlinedRRO: (rro) => {
    set({
      streamlinedRRO: rro,
      streamlinedReportId: rro?.meta?.rro_id || null
    })
  },

  transitionToFullVersion: () => {
    // Preserve all shared profile data (name, age, sex, roles, stability, pressures)
    // and move smoothly into the extended flow without asking common questions again
    set((state) => ({
      flowMode: 'full',
      currentScreen: 'stage2Attention'
    }))
    if (typeof window !== 'undefined') {
      window.location.hash = '#stage2Attention'
    }
  },

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('lewis_theme', nextTheme)
        } catch (e) {
          console.warn('LocalStorage error:', e)
        }
      }
      return { theme: nextTheme }
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
}), {
  name: 'lewis-journey-store',
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state) => {
    const {
      authToken, authUser, isAuthenticated, authPendingDownload,
      isPaymentProcessing, paymentError, analysisError,
      ...persisted
    } = state
    return persisted
  },
}))
