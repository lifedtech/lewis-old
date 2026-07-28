// Run: node src/constants/instruments.check.js
//
// The screens write answers keyed by the ids in instruments.js; payload.js
// reads them back and resolves each label to an option index by exact
// string match. A typo'd id or a drifted scale label does not throw — it
// silently drops the instrument. This answers the one question that matters:
// if a user answers every question on screen, does the payload come out complete?

import assert from 'node:assert/strict'
import { INSTRUMENTS } from './instruments.js'
import { buildFullAssessmentPayload } from '../lib/payload.js'

// Simulate a user picking the first option on every item of every instrument.
const store = { isOver18: true, ins: 4 }
for (const spec of Object.values(INSTRUMENTS)) {
  store[spec.slice] = Object.fromEntries(
    spec.items.map((item) => [item.id, (item.scale || spec.scale)[0]]),
  )
}

const { payload, missing } = buildFullAssessmentPayload(store)

assert.deepEqual(missing, [], `payload.js could not read: ${missing.map((m) => m.label).join(', ')}`)

// Every instrument must land as a value per item, not a truncated list.
for (const spec of Object.values(INSTRUMENTS)) {
  const got = payload[spec.slice]
  assert.ok(Array.isArray(got), `${spec.slice} missing from payload`)
  assert.equal(got.length, spec.items.length, `${spec.slice} length mismatch`)
}

// Screen ordering must chain into a reachable next screen.
for (const [id, spec] of Object.entries(INSTRUMENTS)) {
  assert.ok(spec.next && spec.next !== id, `${id} has no forward transition`)
}

console.log(`ok — ${Object.keys(INSTRUMENTS).length} instruments map cleanly to the API payload`)
