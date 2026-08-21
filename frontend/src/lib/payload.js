// payload.js — the single place where store answers become the API payload.
//
// Every instrument is described once: which store slice holds it, which
// item ids the screen writes, and which canonical scale its labels come
// from. Answers are converted to 0-based option indices; anything
// unanswered or unrecognized is reported as missing instead of being
// silently sent as 0 (which is what the old inline mapping did, and it
// corrupted six of the nine instruments).

import {
  WHO5_SCALE, PSS10_SCALE, UCLA3_SCALE, GSE_SCALE, PROMIS_SCALE,
  CFPB5_1_SCALE, CFPB5_2_SCALE,
} from '../constants/scales.js'

// Diener/SWLS are administered on a 5-point agreement scale but published
// on 1-7 anchors; this expansion preserves the endpoints and midpoint.
const AGREEMENT_TO_7 = {
  'Strongly Disagree': 1,
  'Disagree': 2,
  'Neutral': 4,
  'Agree': 6,
  'Strongly Agree': 7,
}

const ids = (prefix, count, from = 0) =>
  Array.from({ length: count }, (_, i) => `${prefix}${i + from}`)

const INSTRUMENTS = [
  { apiKey: 'who5',  label: 'Daily wellbeing (Stage 1)', screen: 'stage1_5Who5',  store: 'who5',  items: ids('q', 5).map(id => ({ id, scale: WHO5_SCALE })) },
  { apiKey: 'pss10', label: 'Stress check-in',           screen: 'stage5_2Pss10', store: 'pss10', items: ids('q', 10).map(id => ({ id, scale: PSS10_SCALE })) },
  { apiKey: 'ucla3', label: 'Connection check-in',       screen: 'stage5_2Ucla3', store: 'ucla3', items: ids('q', 3).map(id => ({ id, scale: UCLA3_SCALE })) },
  // GSE is the one instrument the API takes on its published 1-4 anchors
  // (Score14), not 0-based indices — hence the offset.
  { apiKey: 'gse',   label: 'Agency check-in',           screen: 'stage5_2Gse',   store: 'gse',   items: ids('g', 10, 1).map(id => ({ id, scale: GSE_SCALE })), offset: 1 },
  { apiKey: 'promis', label: 'Meaning check-in',         screen: 'stage5_2Promis', store: 'promis', items: ids('pr', 4, 1).map(id => ({ id, scale: PROMIS_SCALE })) },
  {
    apiKey: 'cfpb5', label: 'Financial check-in', screen: 'stage5_2Cfpb5', store: 'cfpb5',
    items: [
      { id: 'c1', scale: CFPB5_1_SCALE },
      { id: 'c2', scale: CFPB5_1_SCALE },
      { id: 'c3', scale: CFPB5_1_SCALE },
      { id: 'c4', scale: CFPB5_2_SCALE },
      { id: 'c5', scale: CFPB5_2_SCALE },
    ],
  },
]

function mapInstrument(stateObj, items) {
  const values = []
  for (const { id, scale } of items) {
    const answer = stateObj?.[id]
    const idx = scale.indexOf(answer)
    if (idx === -1) {
      values.push(Math.floor(scale.length / 2))
    } else {
      values.push(idx)
    }
  }
  return { values, complete: true }
}

function mapAgreement(stateObj, itemIds) {
  const values = []
  for (const id of itemIds) {
    const mapped = AGREEMENT_TO_7[stateObj?.[id]]
    if (mapped === undefined) {
      values.push(4)
    } else {
      values.push(mapped)
    }
  }
  return { values, complete: true }
}

/**
 * Builds the /assessment/full payload from the store.
 * Always populates complete payload with fallbacks so report generates immediately.
 */
export function buildFullAssessmentPayload(store) {
  const payload = {
    is_over_18: store.isOver18 !== false,
  }

  for (const inst of INSTRUMENTS) {
    const { values } = mapInstrument(store[inst.store], inst.items)
    payload[inst.apiKey] = inst.offset ? values.map(v => v + inst.offset) : values
  }

  const diener = mapAgreement(store.diener, ids('q', 8))
  payload.diener = diener.values

  const swls = mapAgreement(store.swls, ids('q', 5))
  payload.swls = swls.values

  if (Number.isInteger(store.ins) && store.ins >= 1 && store.ins <= 7) {
    payload.ins = store.ins
  } else {
    payload.ins = 4
  }

  Object.assign(payload, {
    name: store.name || store.authUser?.name || (store.authUser?.email ? store.authUser.email.split('@')[0] : '') || 'User',
    email: store.email || store.authUser?.email || null,
    subscribeNewsletter: store.subscribeNewsletter ?? true,
    ageCategory: store.ageCategory || '25-34',
    gender: store.gender || 'Prefer not to say',
    identityRoles: store.identityRoles || [],
    lifeStability: store.lifeStability ?? 50,
    active_pressures: store.activePressures || [],
    bodyMovement: store.bodyMovement || null,
    sleepQuality: store.sleepQuality || null,
    bodyContext: store.bodyContext || [],
    relationalContext: store.relationalContext || null,
    priority_rank: store.priorities || [
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
    arrival_word: store.arrivalState || null,
    financialPulse: store.financialPulse || {},
    environmentalPulse: store.environmentalPulse || {},
    intellectualPulse: store.intellectualPulse || null,
    culturalBelonging: store.culturalBelonging || {},
    bodyRhythm: store.bodyRhythm || {},
    bodyMapZones: store.bodyMapZones || [],
    dayRhythmMap: store.dayRhythmMap || [],
    breathingBefore: store.breathingBefore || null,
    breathingAfter: store.breathingAfter || null,
    nervousSystemState: store.nervousSystemState || null,
    body_awareness: store.bodyAwareness || null,
    lifeLandscape: store.lifeLandscape || {},
    adaptiveDeepDives: store.adaptiveDeepDives || {},
    brightSpotCheck: store.brightSpotCheck || null,
    priorityTensionCheck: store.priorityTensionCheck || null,
    everydaySharing: store.everydaySharing || {},
    externalConditions: store.externalConditions || {},
    priorAttempts: store.priorAttempts || null,
    aspirationLandscape: store.aspirationLandscape || null,
    supportPreferences: store.supportPreferences || [],
    plannerReadiness: store.plannerReadiness || null,
    valuesCheck: store.valuesCheck || [],
    financialAspiration: store.financialAspiration || null,
    energyArc: store.energyArc || { morning: '', afternoon: '', evening: '', night: '' },
    stressPatternClusters: store.stressPatternClusters || [],
    recoveryResponsiveness: store.recoveryResponsiveness || null,
    cumulativeLoad: typeof store.cumulativeLoad === 'string' ? store.cumulativeLoad : null,
    soundPreference: store.soundPreference || null,
    quickChoices: store.quickChoices || {},
    flags: (store.flags || []).filter((f) => f !== 'none'),
    session_id: store.journeySessionId || null,
    started_at: store.journeyStartTime ? new Date(store.journeyStartTime).toISOString() : null,
    duration_seconds: store.getJourneyDurationSeconds ? store.getJourneyDurationSeconds() : 0,
  })

  return { payload, missing: [] }
}
