# LEWIS Generation Rulebook v1
## Companion 7. The ordered procedure that turns one person's session into one report

The engineering spec says how the system is built. The copy layer says what strings exist. **This document is the decision procedure**: what gets decided, in what order, under what conditions, for every person who completes LEWIS.

It is written to be followed by a person with the session data in front of them and no code. If a human cannot produce the same report the engine produced, the rulebook is wrong.

**How to read the rules.** Each is numbered `R-xx`, stated as a single decision, with its condition, its output, and what happens when the condition does not hold. There is no rule without a defined negative branch. The most common failure in report generation is a path nobody specified because it seemed unlikely.

---

# Part 1. The order is the rulebook

Decisions are made in this order and never reordered. Later decisions read earlier ones. Earlier decisions never read later ones.

```
 1. Eligibility          R-01 to R-03
 2. Completeness         R-04 to R-08
 3. Scores               R-09 to R-13
 4. Bands                R-14 to R-15
 5. Confidence           R-16 to R-20
 6. Safety               R-21 to R-27      ← everything downstream reads this
 7. Divergence           R-28 to R-30
 8. Links                R-31 to R-37
 9. Root driver          R-38 to R-42
10. Priority tension     R-43 to R-45
11. Bright spot          R-46 to R-48
12. Reflections          R-49 to R-51
13. Suggestion           R-52 to R-59
14. Composition          R-60 to R-66
```

**Why safety sits at position 6 and not position 1.** It needs the scores to compute WHO-5 percentage and the all-below-40 check. It sits as early as it possibly can, and every subsequent stage reads it.

---

# Part 2. Eligibility

**R-01.** If the age gate was not passed, no report is generated. Terminal.

**R-02.** If the session did not reach the generating screen, no report is generated. Partial sessions produce no artefact. There is no partial report.

**R-03.** If the person has an earlier RRO, load `suggestion_history` for use at R-58. If none exists, treat as a first report and set `is_retake = false`.

---

# Part 3. Completeness

**R-04.** For each instrument block of five or more items: zero missing proceeds normally, exactly one missing prorates with the block mean and sets `prorated`, two or more missing sets that dimension to `Not enough to say`.

**R-05.** For blocks of four or fewer items, any missing item sets the dimension to `Not enough to say`. There is no proration on short blocks. A single missing item in a four-item block is 25 percent of the evidence.

**R-06.** If `sleep_quality` is "I haven't been tracking it", redistribute the PH component weights proportionally across the remaining three and drop PH confidence one step. Do not impute.

**R-07.** If a dimension is `Not enough to say`, it is excluded from: links, root driver, priority tension, bright spot, and the distribution comment count. It still renders on page 4 with its own copy and as an unfilled lane on page 3.

**R-08.** If four or more dimensions are `Not enough to say`, generate the report but set the global caution. Below four, no caution on this ground alone.

---

# Part 4. Scores

**R-09.** Reverse-score before summing. PSS-10 items 4, 5, 7, 8. CFPB items 1, 2, 3, 5. Nothing else in the battery is reverse-scored.

**R-10.** Compute each dimension by its formula. Round once, at the end, half up.

**R-11.** Apply nudges. A nudge fires only when its direction agrees with the self-report, is capped at 4 points, and is truncated at a band boundary rather than crossing it.

**R-12.** `breath.settle_change` does not enter any score. If it appears in a scoring input, that is a defect.

**R-13.** Clamp every score to 0 to 100.

---

# Part 5. Bands

**R-14.** Assign bands: 0 to 39 is band 1, 40 to 54 is band 2, 55 to 69 is band 3, 70 to 100 is band 4.

**R-15.** RS is assigned a band and its number is never displayed. UCLA-3 produces only seven possible values and one item step moves RS by 17 points.

---

# Part 6. Confidence

**R-16.** Base tiers: EM and AC are A. EN, RS, MS and FW are B. PH, IG and EC are C.

**R-17.** Drop one tier for each of: an item was prorated in that dimension, that dimension shows divergence over 20 at R-28, or PH with a null `sleep_quality`.

**R-18.** If the verbatim PROMIS swap has not shipped, MS drops to C and the word PROMIS does not appear anywhere in the report.

**R-19.** Confidence sets the interval half-width used on page 3: A is ±5, B is ±9, C is ±15. This is a display convention, not a computed standard error, and the report describes it as room for error rather than as a confidence interval.

**R-20.** Set the global caution if any of: four or more divergences, straight-lining across eight or more consecutive Act 3 items, or completion time below the tenth percentile. Only one caution renders; if more than one condition holds, use the first in that order.

---

# Part 7. Safety

Everything after this point reads these outputs.

**R-21.** Compute WHO-5 percentage. At or below 50 sets compassion level 2. At or below 28 sets compassion level 3.

**R-22.** All nine dimensions below 40 sets compassion level 3.

**R-23.** `support_preference` of "fragile right now" sets compassion level 3.

**R-24.** Compassion level is the maximum of R-21, R-22 and R-23. It never decreases.

**R-25.** Set suppression flags:

| Input | Suppresses |
|---|---|
| `transcendent_connection` = painful | The entire MS suggestion library |
| `cultural_belonging` = real pain | All belonging content and suggestions |
| Any disordered eating signal | All nutrition-adjacent content, everywhere |
| `recovery_responsiveness` = more anxious when I stop | All activation suggestions until down-regulation |
| `breath.settle_change` negative | All slow-breathing suggestions |
| A relationship strain flag | The relational contact suggestions |

**R-26.** Set the support block position: level 1 none, level 2 after the suggestion, level 3 before the suggestion.

**R-27.** No WHO-5 number, threshold, or the words screening, cut-off, clinical or depression appear anywhere in the report. Compassion level governs tone and routing and is never a finding.

---

# Part 8. Divergence

**R-28.** For each dimension with a sort placement, compute `score - zone_midpoint` using 25, 55 and 85. Flag when the absolute value exceeds 20.

**R-29.** A flagged dimension drops one confidence tier at R-17.

**R-30.** At most one divergence renders on page 9, selected by largest absolute value. The rest inform confidence only. Two divergence paragraphs on one page reads as the report arguing with itself.

---

# Part 9. Links

**R-31.** Consider only the five edges in the v1 prior link set. No edge outside it may be drawn under any condition.

**R-32.** An edge activates only when both endpoints are below 55, neither is `Not enough to say`, and at least one person-level confirmation exists naming the source side: a selected pressure, a texture flag, a friction answer, or a worsening trajectory.

**R-33.** Apply structural exclusions before anything else. PH–EN, EM–EN and EM–PH are never drawn. For PH to EM, compute the shadow PH score excluding WHO-5 items and require it to be below 55.

**R-34.** Merge edges sharing a source and target into one link. The confirmation count is the union, not the sum.

**R-35.** Rank by `prior_weight × confirmations × depletion(source)`. Draw at most five.

**R-36.** A directional arrow renders only on Tier 1 edges with experimental evidence. Everything else renders as a plain link described as travelling together.

**R-37.** If fewer than two links activate, `links` is empty and the "not clustering" fallback renders. Do not relax R-32 to reach a minimum.

---

# Part 10. Root driver

**R-38.** Compute leverage over every dimension that is not `Not enough to say`:

```
0.35·normalised_out_degree + 0.25·depletion + 0.15·priority
+ 0.15·worsening + 0.10·friction_actionability
```

Out-degree counts a Tier 1 directional edge leaving the dimension as 1.0 and a Tier 2 undirected edge touching it as 0.5, then normalises to the maximum across dimensions.

**R-39.** Select the maximum.

**R-40.** If the selection is confidence Tier C, apply the override test: it may stand if it is the source of an active Tier 1 directional edge and carries at least two person-level confirmations. If it stands, set `override_applied` and render the honesty rider. If it does not, fall through to the highest-leverage Tier A or B candidate and add the line about reading it with reasonable confidence.

**R-41.** If no dimension has a leverage above zero, or fewer than two links activated, there is no root driver. The fallback renders and page 8 becomes short rather than absent.

**R-42.** A Tier C root driver with a null honesty rider is a defect. The rider is not optional prose.

---

# Part 11. Priority tension

**R-43.** For each of the person's top three priorities, compute `max(0, 55 - score) / 55`. Select the maximum above zero.

**R-44.** Apply the screen 22 answer. Yes makes it the opening frame. Partly includes it as a softened section. Not quite suppresses it from the headline entirely and halves its weight in the plan.

**R-45.** If no priority scores below 55, no tension exists. The opening frame uses the "what you care about is not currently what is costing you" variant, which is a real finding and should not be treated as an empty state.

---

# Part 12. Bright spot

**R-46.** Select the highest scoring dimension that is not `Not enough to say`.

**R-47.** Assign the tier: 55 or above is tier 1, 40 to 54 is tier 2, all dimensions below 40 is tier 3.

**R-48.** Tier 1 with free text uses the quoted variant. Tier 1 without text uses the unquoted variant. Tier 3 requests no text and none is shown.

---

# Part 13. Reflections

**R-49.** Evaluate the four contradiction checks in the scoring document. Each either fires or does not.

**R-50.** At most two render, selected by strength: relational contradiction first, then breath, then energy, then somatic.

**R-51.** Every reflection ends in an observation or an open question. None ends in a conclusion.

---

# Part 14. Suggestion

**R-52.** Candidates are the library entries for the root driver dimension. If there is no root driver, use the lowest scoring dimension with confidence Tier A or B.

**R-53.** Gate 1. Reject any entry with an active suppression flag. If compassion level is 3, keep only S0. If the candidate set is now empty, set `no_suggestion` and render its copy. Do not proceed to Gate 2.

**R-54.** Gate 2. Keep entries whose `friction_fit` contains the person's named friction. If empty and the friction is money, set `deliberate_exclusion` and render the "not asking of you" block. If empty for any other friction, move to the next dimension by leverage and return to R-53.

**R-55.** Never relax the friction filter to keep the root driver. A suggestion that does not fit the barrier is worse than a suggestion for a different area.

**R-56.** Gate 3. Compute the capacity ceiling. Base is S3 for a seven-day plan, S2 for one thing, S0 for too overwhelmed. Drop one tier for each of: prior attempts did not stick, cumulative load at or above 60 percent. Hard set to S0 for fragile, compassion 3, or bright spot tier 3. The raise modifier can never override a hard set. Filter to entries at or below the ceiling; if empty, filter to S0.

**R-57.** Gate 4. Sort by evidence tier, established before supported before emerging before practice-based. Tiebreak on support preference fit, then on whether the cue slot matches a cue the person actually reported, then on lower delivered dose.

**R-58.** If `is_retake`, drop any entry in `suggestion_history` unless the person reported it worked, in which case it may be re-offered once with the continuation framing.

**R-59.** Attach the mandatory blocks. Dose honesty when doses differ. Evidence note when the tier is emerging. Lifed disclosure when the entry is linked. The "why this one" block always.

---

# Part 15. Composition

**R-60.** Opening frame variant by compassion level and arrival word presence. Four combinations, all defined.

**R-61.** Page 4 renders in three registers: band 1 areas get band descriptor, flag sentence and trajectory clause. Band 2 areas get the band descriptor and at most one context line. Bands 3 and 4 collapse into one grouped paragraph.

**R-62.** The bespoke-instrument rider renders once, on the first Tier C dimension in reading order, never repeated.

**R-63.** Flag sentences use the report forms from the copy layer Part 4. Two flags join with "and". Three or more use the two highest-weighted and append "among other things".

**R-64.** The fixed line renders in every report without exception: *This describes the season you are in, not the kind of person you are.*

**R-65.** Run the banned lexicon check against the fully composed RRO. Any hit halts generation and raises an incident. The report is not produced.

**R-66.** Assert twelve pages. A thirteenth means content overflowed. Reject rather than ship.

---

# Part 16. Worked trace, Devaraj K

The rulebook applied end to end, showing which branch each rule took.

| Rule | Branch taken |
|---|---|
| R-01 to R-03 | Eligible, complete, first report |
| R-04 to R-08 | No missing items, no proration, no `Not enough to say` |
| R-09 to R-13 | Scores computed. Nudges fired on PH (−4, four body zones) and EM (−3, unpleasant and activated). Neither crossed a band boundary |
| R-14 | PH 23 b1, FW 25 b1, EM 27 b1, IG 37 b1, EC 44 b2, EN 50 b2, AC 56 b3, MS 65 b3, RS 67 b3 |
| R-16, R-17 | EN dropped B to C by divergence. All others at base |
| R-21 | WHO-5 36 percent, at or below 50, compassion level 2 |
| R-22, R-23 | Not triggered |
| R-25 | No suppression flags active |
| R-28 to R-30 | EN divergence +25, flagged. IG at −18, under threshold. One renders |
| R-31 to R-35 | Four links: PH to EM merged from two edges, FW–EM, EC–EM, EC–PH |
| R-33 | Shadow PH computed at 24.5, below 55, so PH to EM is permitted |
| R-36 | One arrow, on PH to EM. Three plain links |
| R-38, R-39 | PH at 0.896, highest |
| R-40 | PH is Tier C. Override test: source of a Tier 1 directional edge, three confirmations. **Override applies.** Honesty rider renders |
| R-43, R-44 | PH tension 0.582, highest of the top three. Confirmed yes. Opens the report |
| R-46 to R-48 | RS at 67, tier 1, free text present |
| R-49, R-50 | One reflection: relational contradiction |
| R-52 | Candidates are the PH library |
| R-53 | No suppressions. Compassion 2, so no S0 restriction |
| R-54 | Friction is time. Filter holds |
| R-56 | Base S2 for "one thing". Minus one for "didn't stick". Minus one for cumulative load at 73 percent. Ceiling is **S0**. Filter to S0 |
| R-57 | PH-S0-003, outdoors after the last meal, established tier |
| R-59 | Dose honesty renders. No evidence note. No Lifed link |
| R-60 to R-66 | Compassion 2 with arrival word. Four band 1 blocks, two band 2, three grouped. Rider on PH. Twelve pages |

**One discrepancy worth naming.** The rulebook run lands on the S0 entry, "step outside the front door and stand there for a minute". The designed report shows the S1 entry, five minutes. R-56 is stricter than the worked example in the scoring document was.

**Both are defensible and you have to pick one.** The rulebook is more conservative and more likely to be done. The five-minute version reaches the researched dose faster. My recommendation is to keep R-56 as written and change the reference report to the S0 entry, because the whole architecture of Gate 3 exists to stop LEWIS from over-asking, and the first time it is tested, it should not be overridden for a nicer sentence.

This is exactly the kind of disagreement the rulebook is for: it made a silent judgement call visible.

---

# Part 17. What has no rule yet

Named honestly, because an unspecified path is worse than a bad one.

1. **Retake comparison.** R-03 and R-58 handle suggestion memory. Nothing handles score comparison across sessions, which is what the slope graph needs. It requires a rule for what counts as a meaningful change, and that is a psychometric question answered by the test-retest study, not by design.

2. **The second report's opening.** A returning person should not be greeted as if this is their first. No rule exists.

3. **Partial retakes.** Someone who takes LEWIS twice in a week and answers differently. No rule for whether to surface the inconsistency or absorb it.

4. **The bright spot on a floor profile with a strong single flag.** Tier 3 says start gently. It does not say what to do when someone at floor also names something that is genuinely working. Currently the text is not requested at tier 3, which may be over-cautious.

5. **Multi-language.** The flag report forms in the copy layer are grammatical constructions that will not survive machine translation. Every target language needs its own set authored by a native speaker, and no rule governs what LEWIS does in the interval between launching a language and having that set.
