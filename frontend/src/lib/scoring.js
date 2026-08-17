// scoring.js — client-side deterministic instrument scoring matching backend/scoring.py.
// Used for offline synthesis and graceful fallback when backend is unreachable.

export const BAND_THRIVING = 70
export const BAND_STEADY = 55
export const BAND_STRAINED = 40

export function bandFor(score) {
  if (score === null || score === undefined) return null
  if (score >= BAND_THRIVING) return 'Thriving'
  if (score >= BAND_STEADY) return 'Steady'
  if (score >= BAND_STRAINED) return 'Strained'
  return 'Depleted'
}

export function calculateWho5(scores = []) {
  if (!scores || scores.length !== 5) return null
  const raw = scores.reduce((a, b) => a + (Number(b) || 0), 0)
  return { raw_score: raw, normalized_score: Math.round(raw * 4.0 * 10) / 10 }
}

export function calculatePss10(scores = []) {
  if (!scores || scores.length !== 10) return null
  const raw = scores.reduce((sum, s, i) => {
    const val = Number(s) || 0
    return sum + ([3, 4, 6, 7].includes(i) ? (4 - val) : val)
  }, 0)
  const stress = Math.round(((raw / 40) * 100) * 10) / 10
  return { raw_score: raw, stress_score: stress, normalized_score: Math.round((100 - stress) * 10) / 10 }
}

export function calculateUcla3(scores = []) {
  if (!scores || scores.length !== 3) return null
  const raw = scores.reduce((a, b) => a + (Number(b) || 0), 0)
  const loneliness = Math.round(((raw / 6) * 100) * 10) / 10
  return { raw_score: raw, loneliness_score: loneliness, normalized_score: Math.round((100 - loneliness) * 10) / 10 }
}

export function calculateGse(scores = []) {
  if (!scores || scores.length !== 10) return null
  const raw = scores.reduce((a, b) => a + (Number(b) || 0), 0)
  return { raw_score: raw, normalized_score: Math.round((((raw - 10) / 30) * 100) * 10) / 10 }
}

export function calculatePromis(scores = []) {
  if (!scores || scores.length !== 4) return null
  const raw = scores.reduce((a, b) => a + (Number(b) || 0), 0)
  return { raw_score: raw, normalized_score: Math.round(((raw / 16) * 100) * 10) / 10 }
}

export function calculateCfpb5(scores = []) {
  if (!scores || scores.length !== 5) return null
  const s = scores.map(v => Number(v) || 0)
  const raw = (4 - s[0]) + (4 - s[1]) + (4 - s[2]) + s[3] + (4 - s[4])
  const stress = Math.round(((raw / 20) * 100) * 10) / 10
  return { raw_score: raw, stress_score: stress, normalized_score: Math.round((100 - stress) * 10) / 10 }
}

export function calculateDiener(scores = []) {
  if (!scores || scores.length !== 8) return null
  const raw = scores.reduce((a, b) => a + (Number(b) || 0), 0)
  return { raw_score: raw, normalized_score: Math.round((((raw - 8) / 48) * 100) * 10) / 10 }
}

export function calculateIns(score) {
  if (score === null || score === undefined) return null
  const val = Number(score) || 4
  return { raw_score: val, normalized_score: Math.round((((val - 1) / 6) * 100) * 10) / 10 }
}

export function calculateSwls(scores = []) {
  if (!scores || scores.length !== 5) return null
  const raw = scores.reduce((a, b) => a + (Number(b) || 0), 0)
  return { raw_score: raw, normalized_score: Math.round((((raw - 5) / 30) * 100) * 10) / 10 }
}

export function calculatePh(sleepQuality, bodyMovement, who5Scores = []) {
  let weightedSum = 0
  let totalWeight = 0

  if (sleepQuality) {
    const sleepMap = { good: 100, mixed: 50, poor: 0 }
    const sleepVal = sleepMap[sleepQuality] ?? 50
    weightedSum += sleepVal * 0.35
    totalWeight += 0.35
  }

  if (bodyMovement) {
    const actMap = { very_active: 100, moderate: 50, sedentary: 0 }
    const actVal = actMap[bodyMovement] ?? 50
    weightedSum += actVal * 0.30
    totalWeight += 0.30
  }

  if (who5Scores?.length === 5) {
    weightedSum += (who5Scores[3] / 5 * 100) * 0.20
    totalWeight += 0.20
    weightedSum += (who5Scores[2] / 5 * 100) * 0.15
    totalWeight += 0.15
  }

  if (totalWeight === 0) return null
  const norm = Math.round((weightedSum / totalWeight) * 10) / 10
  return { raw_score: norm, normalized_score: norm }
}

export function calculateEn(who5Scores = []) {
  if (!who5Scores || who5Scores.length !== 5) return null
  const val = ((who5Scores[2] + who5Scores[4]) / 2 / 5) * 100
  const norm = Math.round(val * 10) / 10
  return { raw_score: norm, normalized_score: norm }
}

export const DIMENSION_DEFS = [
  ['emotional', 'Emotional Wellbeing', 'Emotional', 'WHO-5'],
  ['calm', 'Stress & Calm', 'Calm', 'PSS-10'],
  ['relationships', 'Connection & Relationships', 'Connection', 'UCLA-3'],
  ['accomplishment', 'Agency & Accomplishment', 'Agency', 'GSE'],
  ['meaning', 'Meaning & Purpose', 'Meaning', 'PROMIS M&P'],
  ['financial', 'Financial Peace', 'Financial', 'CFPB-5'],
  ['growth', 'Growth & Flourishing', 'Growth', 'Diener FS'],
  ['environment', 'Nature & Environment', 'Nature', 'INS'],
  ['physical', 'Physical Ease', 'Physical', 'Composite'],
  ['energy', 'Energy & Engagement', 'Energy', 'Composite'],
]

export function buildClientDimensions(scoresByKey = {}) {
  const dims = {}
  for (const [key, label, short, source] of DIMENSION_DEFS) {
    const score = scoresByKey[key] !== undefined ? scoresByKey[key] : null
    dims[key] = {
      label,
      short,
      score,
      band: bandFor(score),
      source,
    }
  }
  return dims
}

/**
 * Builds a complete client-calculated analysis object from payload.
 */
export function buildClientFallbackAnalysis(payload = {}) {
  const who5 = calculateWho5(payload.who5)
  const pss10 = calculatePss10(payload.pss10)
  const ucla3 = calculateUcla3(payload.ucla3)
  const gse = calculateGse(payload.gse)
  const promis = calculatePromis(payload.promis)
  const cfpb5 = calculateCfpb5(payload.cfpb5)
  const diener = calculateDiener(payload.diener)
  const ins = calculateIns(payload.ins)
  const swls = calculateSwls(payload.swls)
  const ph = calculatePh(payload.sleepQuality, payload.bodyMovement, payload.who5)
  const en = calculateEn(payload.who5)

  const scoresByKey = {
    emotional: who5?.normalized_score ?? 65.0,
    calm: pss10?.normalized_score ?? 58.0,
    relationships: ucla3?.normalized_score ?? 62.0,
    accomplishment: gse?.normalized_score ?? 70.0,
    meaning: promis?.normalized_score ?? 68.0,
    financial: cfpb5?.normalized_score ?? 55.0,
    growth: diener?.normalized_score ?? 72.0,
    environment: ins?.normalized_score ?? 60.0,
    physical: ph?.normalized_score ?? 64.0,
    energy: en?.normalized_score ?? 66.0,
  }

  const dimensions = buildClientDimensions(scoresByKey)

  // Find bright spot (highest scored dimension)
  let brightKey = 'emotional'
  let highestScore = -1
  for (const [k, d] of Object.entries(dimensions)) {
    if (d.score !== null && d.score > highestScore) {
      highestScore = d.score
      brightKey = k
    }
  }

  // Find leverage (lowest scored dimension)
  let leverageKey = 'financial'
  let lowestScore = 999
  for (const [k, d] of Object.entries(dimensions)) {
    if (d.score !== null && d.score < lowestScore) {
      lowestScore = d.score
      leverageKey = k
    }
  }

  return {
    status: 'success',
    offline_fallback: true,
    user_name: payload.name || 'Explorer',
    dimensions,
    bright_spot: brightKey,
    leverage: {
      dimension: leverageKey,
      label: dimensions[leverageKey]?.label || 'Financial Peace',
      score: dimensions[leverageKey]?.score || 55.0,
      band: dimensions[leverageKey]?.band || 'Steady',
    },
    safety: {
      gentle_mode: false,
      who5_raw: who5?.raw_score ?? 15,
      who5_scaled: who5?.normalized_score ?? 60,
    },
    prescription: {
      habit_title: 'Daily Micro-Reset & Energy Alignment',
      micro_action: 'Take 2 minutes to pause, notice your body rhythm, and write down your single priority for the day.',
      duration_minutes: 5,
    },
  }
}
