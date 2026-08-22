// Every stepped questionnaire as pure data. Item ids and scales must stay
// in lockstep with payload.js, which maps answers to option indices by
// exact string match — instruments.check.js enforces that.
//
// Stage5_2Ins is NOT here — it is a diagram picker, not a stepped list.

import {
  WHO5_SCALE, PSS10_SCALE, UCLA3_SCALE, GSE_SCALE, PROMIS_SCALE,
  CFPB5_1_SCALE, CFPB5_2_SCALE, AGREEMENT_5,
} from './scales.js'

export const INSTRUMENTS = {
  stage1_5Who5: {
    slice: 'who5', next: 'stage1_6Relational', topic: 'who5',
    eyebrow: 'CHOOSE ONE',
    title: ['Overall', 'Wellbeing'],
    progress: 'LAST 2 WEEKS',
    hint: 'Select how often you felt this way over the last two weeks.',
    scale: WHO5_SCALE,
    items: [
      { id: 'q0', text: 'I have felt cheerful and in good spirits' },
      { id: 'q1', text: 'I have felt calm and relaxed' },
      { id: 'q2', text: 'I have felt active and vigorous' },
      { id: 'q3', text: 'I woke up feeling fresh and rested' },
      { id: 'q4', text: 'My daily life has been filled with things that interest me' },
    ],
  },

  stage5_2Pss10: {
    slice: 'pss10', next: 'stage5_2Ucla3', topic: 'pss10',
    eyebrow: 'PERCEIVED STRESS',
    title: ['Emotional &', 'Mental Stress'],
    subtitle: 'In the last month, how often have you experienced these thoughts or feelings?',
    progress: 'IN THE LAST MONTH',
    hint: 'Select how often you experienced this in the past month.',
    scale: PSS10_SCALE,
    // Item order is load-bearing: the backend reverse-scores items 4, 5, 7
    // and 8 (q3, q4, q6, q7) — the positively stated ones. Do not reorder.
    items: [
      { id: 'q0', text: 'Been upset because of something that happened unexpectedly?' },
      { id: 'q1', text: 'Felt that you were unable to control the important things in your life?' },
      { id: 'q2', text: "Felt nervous and 'stressed'?" },
      { id: 'q3', text: 'Felt confident about your ability to handle your personal problems?' },
      { id: 'q4', text: 'Felt that things were going your way?' },
      { id: 'q5', text: 'Found that you could not cope with all the things that you had to do?' },
      { id: 'q6', text: 'Been able to control irritations in your life?' },
      { id: 'q7', text: 'Felt that you were on top of things?' },
      { id: 'q8', text: 'Been angered because of things that were outside of your control?' },
      { id: 'q9', text: 'Felt difficulties were piling up so high that you could not overcome them?' },
    ],
  },

  stage5_2Ucla3: {
    slice: 'ucla3', next: 'stage5_2Gse', topic: 'ucla3',
    eyebrow: 'SOCIAL & RELATIONAL',
    title: ['Relationships &', 'Social Connection'],
    subtitle: 'Reflecting on your feelings of connection and companionship.',
    progress: 'HOW OFTEN DO YOU FEEL',
    hint: 'Select the response that best describes your relational experience.',
    scale: UCLA3_SCALE,
    items: [
      { id: 'q0', text: 'That you lack companionship?' },
      { id: 'q1', text: 'Left out?' },
      { id: 'q2', text: 'Isolated from others?' },
    ],
  },

  stage5_2Gse: {
    slice: 'gse', next: 'stage5_2Promis', topic: 'gse',
    eyebrow: 'ACCOMPLISHMENT & AGENCY',
    title: ['Accomplishment', '& Agency'],
    subtitle: 'How true is each of these statements for your daily agency and goals?',
    progress: 'AGENCY & CAPABILITY',
    hint: 'Select how accurately this statement describes your outlook.',
    scale: GSE_SCALE,
    items: [
      { id: 'g1', text: 'I can always manage to solve difficult problems if I try hard enough.' },
      { id: 'g2', text: 'If someone opposes me, I can find the means and ways to get what I want.' },
      { id: 'g3', text: 'It is easy for me to stick to my aims and accomplish my goals.' },
      { id: 'g4', text: 'I am confident that I could deal efficiently with unexpected events.' },
      { id: 'g5', text: 'Thanks to my resourcefulness, I know how to handle unforeseen situations.' },
      { id: 'g6', text: 'I can solve most problems if I invest the necessary effort.' },
      { id: 'g7', text: 'I can remain calm when facing difficulties because I can rely on my coping abilities.' },
      { id: 'g8', text: 'When I am confronted with a problem, I can usually find several solutions.' },
      { id: 'g9', text: 'If I am in trouble, I can usually think of a solution.' },
      { id: 'g10', text: 'I can usually handle whatever comes my way.' },
    ],
  },

  stage5_2Promis: {
    slice: 'promis', next: 'stage5_2Cfpb5', topic: 'promis',
    eyebrow: 'PAST 7 DAYS',
    title: ['Meaning &', 'Purpose'],
    subtitle: 'Reflecting on your sense of direction and personal fulfillment.',
    progress: 'PAST 7 DAYS',
    hint: 'Select how much this reflects your experience over the past week.',
    scale: PROMIS_SCALE,
    items: [
      { id: 'pr1', text: 'My life has meaning.' },
      { id: 'pr2', text: 'I have a sense of direction in my life.' },
      { id: 'pr3', text: 'My life has purpose.' },
      { id: 'pr4', text: 'The things I do in my life are worthwhile.' },
    ],
  },

  stage5_2Cfpb5: {
    slice: 'cfpb5', next: 'stage5_2Diener', topic: 'cfpb5',
    eyebrow: 'FINANCIAL WELLBEING',
    title: ['Financial', 'Peace'],
    subtitle: 'Assessing financial security and freedom of choice.',
    progress: 'FINANCIAL PEACE',
    // CFPB-5 switches both scale and hint partway through the instrument.
    items: [
      { id: 'c1', text: 'Because of my money situation, I feel like I will never have the things I want in life.', scale: CFPB5_1_SCALE, hint: 'How well does this describe you?' },
      { id: 'c2', text: 'I am just getting by financially.', scale: CFPB5_1_SCALE, hint: 'How well does this describe you?' },
      { id: 'c3', text: "I am concerned that the money I have or will save won't last.", scale: CFPB5_1_SCALE, hint: 'How well does this describe you?' },
      { id: 'c4', text: 'I have money left over at the end of the month.', scale: CFPB5_2_SCALE, hint: 'How often is this true?' },
      { id: 'c5', text: 'My finances control my life.', scale: CFPB5_2_SCALE, hint: 'How often is this true?' },
    ],
  },

  stage5_2Diener: {
    slice: 'diener', next: 'stage5_2Ins', topic: 'diener',
    eyebrow: 'FLOURISHING & GROWTH',
    title: ['Intellectual &', 'Growth'],
    subtitle: 'Evaluating competence, optimism, and overall flourishing.',
    progress: 'FLOURISHING & GROWTH',
    hint: 'Select how strongly you agree with this reflection.',
    scale: AGREEMENT_5,
    items: [
      { id: 'q0', text: 'I lead a purposeful and meaningful life' },
      { id: 'q1', text: 'My social relationships are supportive and rewarding' },
      { id: 'q2', text: 'I am engaged and interested in my daily activities' },
      { id: 'q3', text: 'I actively contribute to the happiness and well-being of others' },
      { id: 'q4', text: 'I am competent and capable in the activities that are important to me' },
      { id: 'q5', text: 'I am a good person and live a good life' },
      { id: 'q6', text: 'I am optimistic about my future' },
      { id: 'q7', text: 'People respect me' },
    ],
  },

  stage5_2Swls: {
    slice: 'swls', next: 'stage5_3DeepDives', topic: 'swls',
    eyebrow: 'OVERALL WELLBEING',
    title: ['Life', 'Satisfaction'],
    subtitle: 'Reflecting on how close your life conditions match your expectations.',
    progress: 'SATISFACTION WITH LIFE',
    hint: 'Select how accurately this reflects your current life context.',
    scale: AGREEMENT_5,
    items: [
      { id: 'q0', text: 'In most ways my life is close to my ideal.' },
      { id: 'q1', text: 'The conditions of my life are excellent.' },
      { id: 'q2', text: 'I am satisfied with my life.' },
      { id: 'q3', text: 'So far I have gotten the important things I want in life.' },
      { id: 'q4', text: 'If I could live my life over, I would change almost nothing.' },
    ],
  },
}
