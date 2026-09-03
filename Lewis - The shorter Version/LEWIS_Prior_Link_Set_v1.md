# LEWIS Prior Link Set v1
## Companion 3. The evidence base for the connection map and root driver

This document supplies the one part of the inference engine that cannot be authored from product judgement: the fixed graph of dimension pairs that LEWIS is allowed to draw a link between, each with its source, its evidence tier, and the exact language permitted when it renders.

It amends Part 5.1 and Part 5.2 of `LEWIS_Scoring_Inference_Report_v1.md`.

---

# Part 1. Research question and method

**Question.** Which relationships between the nine LEWIS dimensions are supported well enough by published research that LEWIS can responsibly show them to a person as a pattern, and what exactly may it say about each one?

**Method.**
1. For each candidate pair, search for the highest available evidence: systematic reviews, meta-analyses and umbrella reviews first, then longitudinal and cross-lagged designs, then cross-sectional.
2. Grade each edge on the tier scheme in Part 2.
3. Record the direction the evidence actually supports, separately from the direction that feels intuitive.
4. Write the permitted rendering language per edge, so no writer has to improvise it later.
5. Exclude any pair that shares items with itself by construction.

**A constraint that governs everything below.** All of this evidence is population level. It describes what tends to be true across many people. It does not establish what is true for the person holding the report. The prior link set is a filter on what LEWIS is allowed to notice, not a claim about causation in an individual.

---

# Part 2. Evidence tiers

| Tier | Standard | What LEWIS may do with it |
|---|---|---|
| **1. Established** | Multiple systematic reviews or meta-analyses, including experimental or randomised evidence | Draw the link, **with a direction arrow** |
| **2. Supported** | Systematic review or meta-analysis of observational or longitudinal work, no experimental evidence | Draw the link, **without a direction arrow** |
| **3. Emerging** | Primary longitudinal or cross-lagged studies, no consolidated review | Narrative mention only. Never drawn on the map |
| **4. Inference** | Plausible, theorised, not directly evidenced | Never appears in the product in any form |

**RULE, and this is the important one.** Most of the relevant literature is correlational or bidirectional. **A direction arrow is permitted only on Tier 1 edges where the evidence includes experimental manipulation of the source.** Every other edge renders as an undirected link and is described with "travel together", never with "leads to".

**RULE.** Only Tier 1 and Tier 2 edges may be drawn on the connection map in v1. This produces a deliberately sparse graph. A sparse honest map is worth more than a dense invented one, and the "not clustering" fallback copy already exists for the case where fewer than two edges activate.

---

# Part 3. The v1 edge set

## Edge 1. PH to EM, via sleep. **Tier 1, directional**

**Claim.** Reduced or disrupted sleep degrades mood and the capacity to regulate emotion.

**Evidence.** A preregistered systematic review and meta-analysis of over fifty years of experimental research pooled <cite index="5-1">1,338 effect sizes across 154 studies (N = 5,717, ages 7 to 79), and found that all forms of sleep loss reduced positive affect (SMD −0.27 to −1.14), increased anxiety symptoms (SMD 0.57 to 0.63), and blunted arousal in response to emotional stimuli (SMD −0.20 to −0.53)</cite>. A separate set of meta-analyses found that <cite index="2-1">sleep restriction had a small negative effect on adaptive emotion regulation (g = −0.32), while showing no significant impact on maladaptive emotion regulation</cite>.

- Palmer et al. (2024), *Psychological Bulletin*: https://pubmed.ncbi.nlm.nih.gov/38127505/
- Tomaso, Johnson & Nelson (2021), *SLEEP*: https://academic.oup.com/sleep/article/44/6/zsaa289/6053003

**Strength.** Strong. Experimental, preregistered, large, and consistent in direction.

**Limitations.** Effect sizes vary widely by outcome and by sleep manipulation. Most studies use acute laboratory deprivation, not the chronic, partial, caregiving-shaped sleep disruption a LEWIS user is likely reporting. <cite index="2-1">The adaptive emotion regulation finding rested entirely on youth samples</cite>, which limits its extension to adults. Direction is supported experimentally, but the real-world relationship is almost certainly reciprocal.

**Activation requires** PH below 55, EM below 55, and one of: `sleep_quality` = "Generally poor", the Sleep depletion pressure selected at screen 05, or the PH flag "Sleep isn't restoring me".

**Permitted rendering.**
> Your sleep and your emotional load are showing up together. In research, short or broken sleep reliably makes it harder to regulate mood the next day. That does not mean sleep is the whole story here, but it is the thread worth pulling first.

---

## Edge 2. PH to EM, via physical activity. **Tier 1, directional**

**Claim.** Physical activity reduces depressive and anxious symptoms and psychological distress.

**Evidence.** An umbrella review of systematic reviews found that <cite index="32-1">physical activity had medium effects on depression (median effect size −0.43, IQR −0.66 to −0.27), anxiety (median −0.42, IQR −0.66 to −0.26) and psychological distress (−0.60, 95% CI −0.78 to −0.42), compared with usual care across all populations</cite>.

- Singh et al. (2023), *British Journal of Sports Medicine*, doi:10.1136/bjsports-2022-106195
- Noetel et al. (2024), *BMJ*, network meta-analysis of exercise for depression: https://pmc.ncbi.nlm.nih.gov/articles/PMC11131084/

**Strength.** Strong. Randomised evidence, large body, consistent direction.

**Limitations.** A live and unresolved dispute sits underneath this. <cite index="38-1">Some analyses restricted to randomised trials rated as low risk of bias have found no significant antidepressant effect of exercise, while other recent reviews have found a significant impact</cite>. Trials also measure structured exercise programmes, not the "am I moving at all" question LEWIS asks. Blinding is effectively impossible in exercise trials, which inflates effect estimates.

**Activation requires** PH below 55, EM below 55, and `activity_level` in {Mostly sedentary, Dropped recently}.

**Permitted rendering.**
> Movement and mood are moving together in your answers. Across randomised trials, regular activity has a consistent effect on low mood and distress. Worth naming that the evidence is stronger for structured activity than for movement in general.

---

## Edge 3. FW to EM. **Tier 2, undirected**

**Claim.** Financial strain and psychological distress travel together, and the relationship runs in both directions over time.

**Evidence.** A systematic review of financial stress and depression found that <cite index="11-1">all eleven studies examining subjective financial strain, financial dissatisfaction or financial stress reported a positive relationship with depression, across four cross-sectional and seven longitudinal studies, holding after adjustment for covariates</cite>. A separate systematic review of 39 studies found that <cite index="9-1">debt was consistently linked to higher symptoms of anxiety, depression and suicidality, with financial strain, debt collection pressure and diminished sense of control identified as mechanisms</cite>. A longitudinal population study found that <cite index="14-1">increasing difficulty in repaying debts predicted the onset of common mental disorder at follow-up in those without one at baseline</cite>.

- Guan et al. (2022), *PLOS ONE*: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0264041
- Richardson, Elliott & Roberts (2013), *Clinical Psychology Review*: https://pubmed.ncbi.nlm.nih.gov/24121465/
- Bijlsma et al. (2021), *Administration and Policy in Mental Health*: https://pmc.ncbi.nlm.nih.gov/articles/PMC8043431/

**Strength.** Moderate to strong for association. Weak for direction.

**Limitations.** <cite index="9-1">The majority of studies are cross-sectional, limiting conclusions about temporal ordering, and causal inference remains limited</cite>. The evidence base is heavily concentrated in the United States, the United Kingdom and Europe, which matters for an India-first product. <cite index="9-1">Some secured debt, such as mortgages, appeared protective rather than harmful in certain contexts</cite>, so "debt" is not one thing. **No direction arrow.**

**Activation requires** FW below 55, EM below 55, and one of: Financial pressure selected at screen 05, `financial_stress` in {High anxiety, Avoiding}, or an FW flag.

**Permitted rendering.**
> Money and emotional load are sitting together in your answers. Research finds these two travel together consistently, and that each can feed the other. Which came first is not something this reflection can tell you, and it may not be the useful question.

---

## Edge 4. RS and MS. **Tier 2, undirected**

**Claim.** Loneliness and sense of meaning are reciprocally related.

**Evidence.** A prospective cohort of <cite index="19-1">1,077 primary care patients aged 60 and above used cross-lagged panel models across two follow-ups to examine meaning in life against depression, anxiety and loneliness</cite>, and that paper notes <cite index="19-1">a longitudinal study with over 16,000 middle-aged and older adults across European countries finding bidirectional, prospective associations of meaning in life with depression and loneliness</cite>. A cross-sectional study of 2,240 people found that <cite index="24-1">health status and meaning in life were the most important predictors of loneliness, ahead of social connectedness itself</cite>.

- Meaning in life and loneliness cohort: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11931759/
- Meaning in Life as a predictor of loneliness: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7943478/

**Strength.** Moderate. Longitudinal and cross-lagged, but no meta-analysis, and the strongest cohorts are older adults.

**Limitations.** Both landmark cohorts are 60-plus, which is not the LEWIS user base. The 2,240-person study is cross-sectional and cannot support direction. Meaning was measured in the cohort with <cite index="19-1">a single item from the Chinese Purpose in Life test</cite>, which is thin. **No direction arrow, and this edge is age-caveated internally.**

**Activation requires** RS below 55, MS below 55, and one of: an RS flag naming isolation, an MS flag naming disconnection, or `transcendent_connection` in {Not at all, Painful}.

**Permitted rendering.**
> Connection and meaning are both sitting low for you right now. In the research these two tend to move together, each supporting the other, and neither reliably comes first. For many people the practical entry point is the one that feels less locked.

---

## Edge 5. EC to EM and EC to PH, via nature contact. **Tier 2, undirected**

**Claim.** Contact with natural environments is associated with reduced negative affect and improved restoration.

**Evidence.** A meta-analysis of randomised controlled trials found that <cite index="29-1">compared with non-green-space conditions, green space exposure was associated with decreased fatigue (−0.84, 95% CI −1.15 to −0.54) and increased vitality (0.85, 95% CI 0.52 to 1.18), with large and statistically significant effect sizes and good overall evidence quality</cite>. A dose-focused review reported that <cite index="27-1">shorter nature exposure delivered in intervals showed positive significant effects, even more than one-time exposure, with as little as ten minutes outside, including in urban nature, improving adults' mental health</cite>.

- Song et al. (2022), *IJERPH*: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9658851/
- Bettmann et al. (2025), *Behavioral Sciences*: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11851813/
- Credibility grading umbrella review, *eBioMedicine* (2024): https://www.thelancet.com/journals/ebiom/article/PIIS2352-3964(24)00297-4/fulltext

**Strength.** Moderate. RCT evidence exists for acute restorative effects, which is why the practical suggestion is well grounded even though the edge is not.

**Limitations.** This is the most heterogeneous literature in the set. <cite index="25-1">A major source of variability is how exposure and outcome are operationalised, and more stringent methods produce more conservative estimates</cite>. The RCTs measure acute state change over minutes, not the trait-level environmental satisfaction that EC actually captures, so the evidence supports the **suggestion** more strongly than it supports the **link**. **No direction arrow.**

**Activation requires** EC below 55, the target dimension below 55, and `nature_access` in {Rarely, No} or an EC flag naming environment.

**Permitted rendering.**
> Your surroundings and your [emotional load / physical recovery] are showing up together. The clearest finding in this area is small and practical: short, repeated time outdoors, even ten minutes, even in a city, moves fatigue and vitality measurably. The wider link between environment and wellbeing is real but much messier.

---

# Part 4. Edges held at Tier 3, narrative only

These may be mentioned in prose when a person's own answers name them. They are **never drawn on the map** and never counted in the root driver out-degree.

| Edge | Position |
|---|---|
| EM to RS, strain producing withdrawal | Clinically familiar and theoretically strong. I did not find a systematic review isolating this direction at the general population level. Narrative only until one is located |
| EM to IG, depletion suppressing curiosity | Plausible and matches your own item design. No consolidated evidence found. Narrative only |
| AC to MS, agency supporting direction | Self-efficacy is well evidenced as a predictor of performance and goal attainment (Stajkovic & Luthans, 1998, *Psychological Bulletin*, 114 studies, k = 157, N = 21,616, weighted average r = .38), but performance is not meaning. The bridge from agency to sense of purpose is an inference, not a finding |
| FW to RS, money as household tension | Named as a mechanism in the debt reviews but not isolated as an effect. Narrative only |

**RULE.** A Tier 3 mention must be phrased as a question or an observation about the person's own words, never as a research claim. Example: "You described money as a source of tension at home, and your connection reading is low. Those two may be related for you."

---

# Part 5. Pairs permanently excluded

## 5.1 Structural exclusions, from Part 4.4 of the scoring document

| Pair | Reason |
|---|---|
| PH and EN | WHO-5 item 3 feeds both |
| EM and EN | WHO-5 items feed both blends |
| EM and PH | WHO-5 items feed both blends |

Drawing any of these would report an arithmetic artefact back to the person as a discovery.

**Note on Edges 1 and 2.** Both are PH to EM, which is on the structural exclusion list. This is resolved as follows: **the PH to EM edge is drawn only from its non-WHO-5 components.** Activation requires the sleep or activity context items, or a PH texture flag, and never fires on the WHO-5 overlap alone. The engine computes a shadow PH score excluding WHO-5 items for the sole purpose of testing this edge. If that shadow score is at or above 55, the edge does not fire.

This is fiddly and it is necessary. It is the difference between a real finding and a circular one.

## 5.2 Judgement exclusions

| Pair | Reason |
|---|---|
| Any edge involving IG as a source | IG is a bespoke, unvalidated module at Tier C confidence. It may receive a narrative mention but may not be the source of a drawn link |
| Any edge involving EC cultural belonging as a source | Same reason, plus cultural belonging carries a safety flag and should not be positioned as a cause of anything |
| Any edge to or from a dimension in `Not enough to say` | Nothing to link |

---

# Part 6. Amendments to the scoring document

## 6.1 Root driver, revised out-degree

Part 5.2 of the scoring document defines `weighted_out_degree(d)`. Given that most edges are now undirected, revise to:

```
weighted_out_degree(d) =
    1.0 * count(Tier 1 directional edges leaving d)
  + 0.5 * count(Tier 2 undirected edges touching d)
  + 0.0 * Tier 3 mentions
```

An undirected edge contributes at half weight to both of its endpoints. This means an undirected pair cannot, on its own, distinguish which of the two is the leverage point. That distinction has to come from the other four terms in `leverage()`: depletion, priority, trajectory and friction actionability. Which is correct. Where the evidence cannot tell you which way it runs, the person's own situation should decide.

## 6.2 Consequence to expect

With only five Tier 1 and Tier 2 edges available, most reports will draw **one to three** links, and a meaningful minority will draw fewer than two and hit the "not clustering" fallback.

That is the honest yield of the current evidence base. Two responses are available and I recommend the first:

1. **Ship it sparse.** Two or three well-sourced links, each with a real citation behind it, is a stronger product than a nine-node web that a research reviewer could dismantle in an afternoon. It is also more usable: a person can act on two connections and cannot act on nine.
2. **Widen the tiers.** Allow Tier 3 edges onto the map. I do not recommend this. It would make the visual denser and the product weaker, and it is precisely the move that turns a research-informed tool into a horoscope with citations.

---

# Part 7. Governance

**Ownership.** This file has a named owner. No edge may be added, retiered, or have its rendering copy changed without that owner's sign-off and a source link.

**Versioning.** The edge set is versioned independently of the app. Every generated report stores the `link_set_version` it was produced under, so any report can be reconstructed and audited later.

**Review cadence.** Reannually, and immediately on publication of any new umbrella review touching a listed pair.

**Test requirement.** A fixture test per edge: a synthetic person constructed to activate exactly that edge, asserting that it fires, that no other edge fires, and that the rendered copy matches the approved string. A second fixture per structural exclusion asserting the excluded edge never fires, including the PH to EM shadow score logic in 5.1.

**Verification standing.** Every claim in Part 3 has been checked against the cited source in this session. Where I could reach only an abstract or a review's description of a primary study rather than the primary study itself, that is visible in how the claim is worded. Before publication, someone should read the full text of Palmer et al. (2024), Singh et al. (2023), Guan et al. (2022) and Song et al. (2022), because those four carry most of the weight.

---

# Part 8. What this changes in the report

Section 6 of the report, currently headed "How Strain in One Area Is Arriving in the Next", becomes governed entirely by this file. Three consequences:

1. **The section can be empty.** Fallback copy is mandatory, not optional.
2. **Every drawn link carries its evidence tier**, visible to the person. A Tier 1 link and a Tier 2 link should not look identical, because they are not.
3. **Section 11, "What We Used", gains the link set.** The instruments are already named there. The connection evidence should be too, with the same citations, because it is doing just as much work in what the person is told.

## Open items

1. **Owner needed** for this file before it can govern anything.
2. **Tier 3 to Tier 2 promotions.** Four edges are sitting at Tier 3 for want of a systematic review I did not find. A focused literature search on EM to RS and EM to IG specifically would be roughly two days of work and could plausibly promote both, which would meaningfully thicken the map without weakening it.
3. **India-specific evidence.** Every source in Part 3 is drawn predominantly from high-income Western populations. For an India-first product this is a real limitation and it should be stated in the report's methodology note, not just in internal documents. A search for South Asian cohort evidence on the financial strain and loneliness edges in particular would be worth commissioning.
4. **Direction arrows in the UI.** Design needs to render two visually distinct link types, directional and undirected, without making the undirected ones look like a weaker version of the same thing. They are different claims, not weaker claims.
