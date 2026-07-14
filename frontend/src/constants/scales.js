// Canonical answer-option labels for every instrument.
// Screens MUST import these (never redeclare inline) and the payload
// builder maps answers to indices against these exact strings — any
// drift between a screen and this file silently zeroes answers.

export const WHO5_SCALE = ['At no time', 'Some of the time', 'Less than half the time', 'More than half the time', 'Most of the time', 'All of the time']

export const PSS10_SCALE = ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often']

export const UCLA3_SCALE = ['Hardly ever', 'Some of the time', 'Often']

export const GSE_SCALE = ['Not at all true', 'Hardly true', 'Moderately true', 'Exactly true']

export const PROMIS_SCALE = ['Not at all', 'A little bit', 'Somewhat', 'Quite a bit', 'Very much']

export const CFPB5_1_SCALE = ['Describes me completely', 'Describes me very well', 'Describes me somewhat', 'Describes me very little', 'Not at all']

export const CFPB5_2_SCALE = ['Always', 'Often', 'Sometimes', 'Rarely', 'Never']

// 5-point agreement scale used for Diener Flourishing and SWLS
// (administered condensed; expanded to published 1-7 anchors in payload.js).
export const AGREEMENT_5 = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
