"""
qa_dataset.py — Comprehensive Question & Answer Catalog, Database Ingestion,
and Lewis OS Tabular Dataset & CSV Export Engine.

Normalizes each user's assessment answers into granular, queryable rows in the database
(lewis_user_stage_answers) mapped to the canonical question catalog (lewis_questions_catalog).
Supports matrix views and Excel-ready CSV generation for Lewis OS analytics and ML datasets.
"""

import io
import csv
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

logger = logging.getLogger("lewis.qa_dataset")

# -------------------------------------------------------------------------------
# Canonical Lewis Question Catalog (Stages 0 to 9)
# -------------------------------------------------------------------------------

QUESTIONS_CATALOG: List[Dict[str, Any]] = [
    # Stage 0: Pre-assessment
    {
        "question_key": "stage0_is_over_18",
        "stage_number": 0,
        "stage_name": "Stage 0: Pre-Assessment",
        "domain_key": "eligibility",
        "question_code": "ELIG_18_PLUS",
        "question_prompt": "Are you 18 years of age or older?",
        "question_type": "boolean",
        "options_json": ["Yes", "No"],
        "sort_order": 1,
    },
    # Demographics & Identity
    {
        "question_key": "profile_age_category",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "demographics",
        "question_code": "DEMO_AGE",
        "question_prompt": "What is your age category?",
        "question_type": "single_choice",
        "options_json": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        "sort_order": 2,
    },
    {
        "question_key": "profile_gender",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "demographics",
        "question_code": "DEMO_GENDER",
        "question_prompt": "What is your gender identity?",
        "question_type": "single_choice",
        "options_json": ["Female", "Male", "Non-binary", "Other", "Prefer not to say"],
        "sort_order": 3,
    },
    {
        "question_key": "stage1_identity_roles",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "identity",
        "question_code": "IDENT_ROLES",
        "question_prompt": "Which roles currently occupy most of your active energy and focus?",
        "question_type": "multi_choice",
        "options_json": ["Professional/Leader", "Creator/Builder", "Caregiver/Parent", "Student/Learner", "Partner/Companion", "Community Anchor"],
        "sort_order": 4,
    },
    {
        "question_key": "stage1_life_stability",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "stability",
        "question_code": "LIFE_STABILITY",
        "question_prompt": "Overall, how stable and predictable do your current life conditions feel? (0 = High Turbulence, 100 = Completely Stable)",
        "question_type": "scale_0_100",
        "options_json": ["0 to 100"],
        "sort_order": 5,
    },
    {
        "question_key": "stage1_active_pressures",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "stressors",
        "question_code": "ACTIVE_PRESSURES",
        "question_prompt": "What external pressures are currently demanding the most cognitive or emotional bandwidth?",
        "question_type": "multi_choice",
        "options_json": ["Workload & deadlines", "Financial security", "Health or physical concerns", "Relational complexity", "Life transitions", "Caregiving demands"],
        "sort_order": 6,
    },
    {
        "question_key": "stage1_body_movement",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "somatic",
        "question_code": "BODY_MOVEMENT",
        "question_prompt": "How regular and nourishing has your physical movement been over the past 2 weeks?",
        "question_type": "single_choice",
        "options_json": ["Daily intentional movement", "Moderate weekly activity", "Mostly sedentary", "Restricted / Exhausted"],
        "sort_order": 7,
    },
    {
        "question_key": "stage1_sleep_quality",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "somatic",
        "question_code": "SLEEP_QUALITY",
        "question_prompt": "How restorative has your sleep been recently?",
        "question_type": "single_choice",
        "options_json": ["Deep & consistently restorative", "Fair, but occasionally broken", "Fragmented / Restless", "Severe insomnia or exhaustion"],
        "sort_order": 8,
    },
    {
        "question_key": "stage1_body_context",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "somatic",
        "question_code": "BODY_CONTEXT",
        "question_prompt": "Physical background conditions or context affecting daily vitality:",
        "question_type": "multi_choice",
        "options_json": ["Chronic pain", "High screen time", "Irregular nutrition", "Desk/sedentary strain", "High physical exertion"],
        "sort_order": 9,
    },
    # Stage 1.5: WHO-5 Wellbeing Index (5 items)
    {
        "question_key": "who5_q0",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "who5",
        "question_code": "WHO5_Q1",
        "question_prompt": "I have felt cheerful and in good spirits (Last 2 weeks)",
        "question_type": "scale_1_5",
        "options_json": ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"],
        "sort_order": 10,
    },
    {
        "question_key": "who5_q1",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "who5",
        "question_code": "WHO5_Q2",
        "question_prompt": "I have felt calm and relaxed (Last 2 weeks)",
        "question_type": "scale_1_5",
        "options_json": ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"],
        "sort_order": 11,
    },
    {
        "question_key": "who5_q2",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "who5",
        "question_code": "WHO5_Q3",
        "question_prompt": "I have felt active and vigorous (Last 2 weeks)",
        "question_type": "scale_1_5",
        "options_json": ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"],
        "sort_order": 12,
    },
    {
        "question_key": "who5_q3",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "who5",
        "question_code": "WHO5_Q4",
        "question_prompt": "I woke up feeling fresh and rested (Last 2 weeks)",
        "question_type": "scale_1_5",
        "options_json": ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"],
        "sort_order": 13,
    },
    {
        "question_key": "who5_q4",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "who5",
        "question_code": "WHO5_Q5",
        "question_prompt": "My daily life has been filled with things that interest me (Last 2 weeks)",
        "question_type": "scale_1_5",
        "options_json": ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"],
        "sort_order": 14,
    },
    {
        "question_key": "stage1_relational_context",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "relational",
        "question_code": "RELATIONAL_CONTEXT",
        "question_prompt": "How supported and understood do you feel in your primary interpersonal circle?",
        "question_type": "single_choice",
        "options_json": ["Deeply anchored & supported", "Moderately connected", "Surface-level / Isolated", "Strained / High friction"],
        "sort_order": 15,
    },
    {
        "question_key": "stage1_priority_ranking",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "priorities",
        "question_code": "PRIORITY_RANK",
        "question_prompt": "Ranked order of 9 wellbeing dimensions by personal urgency and focus",
        "question_type": "ranking",
        "options_json": ["Physical ease & recovery", "Emotional calm & mental health", "Energy & engagement", "Connection & relationships", "Meaning & purpose", "Progress & contribution", "Financial security & peace", "Intellectual growth & curiosity", "Environment & belonging"],
        "sort_order": 16,
    },
    {
        "question_key": "stage1_arrival_word",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "affect",
        "question_code": "ARRIVAL_STATE",
        "question_prompt": "One word that best describes your state upon arrival at this assessment",
        "question_type": "text",
        "options_json": [],
        "sort_order": 17,
    },
    {
        "question_key": "stage1_financial_pulse",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "financial",
        "question_code": "FIN_PULSE",
        "question_prompt": "Immediate financial pulse reflection",
        "question_type": "single_choice",
        "options_json": ["Comfortable buffer", "Stable month-to-month", "Tight / Precarious", "High immediate distress"],
        "sort_order": 18,
    },
    {
        "question_key": "stage1_environmental_pulse",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "environment",
        "question_code": "ENV_PULSE",
        "question_prompt": "How supportive is your daily physical and living environment?",
        "question_type": "single_choice",
        "options_json": ["Restorative & quiet", "Functional", "Noisy / Overstimulating", "Chaotic / Depleting"],
        "sort_order": 19,
    },
    {
        "question_key": "stage1_intellectual_pulse",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "intellectual",
        "question_code": "INTEL_PULSE",
        "question_prompt": "Level of intellectual stimulation and creative curiosity in daily life:",
        "question_type": "single_choice",
        "options_json": ["Rich & expansive", "Adequate for work", "Monotonous / Stagnant", "Drained / Brain fog"],
        "sort_order": 20,
    },
    {
        "question_key": "stage1_cultural_belonging",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "belonging",
        "question_code": "CULTURAL_BELONGING",
        "question_prompt": "Sense of community and cultural resonance in current surroundings:",
        "question_type": "single_choice",
        "options_json": ["Strong sense of home & community", "Moderate connection", "Felt dissonance / Outsider", "Alienated / Displaced"],
        "sort_order": 21,
    },
    {
        "question_key": "stage1_body_rhythm",
        "stage_number": 1,
        "stage_name": "Stage 1: Context & Foundations",
        "domain_key": "somatic",
        "question_code": "BODY_RHYTHM",
        "question_prompt": "Circadian energy alignment and meal/wake regularity:",
        "question_type": "single_choice",
        "options_json": ["Predictable & aligned", "Somewhat irregular", "Constantly shifting / Jet-lagged"],
        "sort_order": 22,
    },

    # Stage 2: Attention & Cognitive Drift
    {
        "question_key": "stage2_attention_drift_completed",
        "stage_number": 2,
        "stage_name": "Stage 2: Attention & Calibration",
        "domain_key": "cognition",
        "question_code": "ATTENTION_DRIFT",
        "question_prompt": "Attentional calibration and sensory focal exercise completed",
        "question_type": "boolean",
        "options_json": ["Completed", "Skipped"],
        "sort_order": 23,
    },

    # Stage 3: Nervous System & Affect Grid
    {
        "question_key": "stage3_affect_valence",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "affect",
        "question_code": "AFFECT_VALENCE",
        "question_prompt": "Affect Valence coordinate (-1.0 Unpleasant to +1.0 Pleasant on Russell Grid)",
        "question_type": "numeric",
        "options_json": ["-1.0 to 1.0"],
        "sort_order": 24,
    },
    {
        "question_key": "stage3_affect_energy",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "affect",
        "question_code": "AFFECT_ENERGY",
        "question_prompt": "Affect Energy coordinate (-1.0 Low Arousal to +1.0 High Arousal on Russell Grid)",
        "question_type": "numeric",
        "options_json": ["-1.0 to 1.0"],
        "sort_order": 25,
    },
    {
        "question_key": "stage3_body_map_zones",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "somatic",
        "question_code": "BODY_MAP_ZONES",
        "question_prompt": "Selected somatic tension and holding zones on interactive body map:",
        "question_type": "multi_choice",
        "options_json": ["Head / Temples", "Jaw / Face", "Neck / Throat", "Shoulders", "Chest / Heart", "Stomach / Solar Plexus", "Lower Back", "Hips / Pelvis", "Arms / Hands", "Legs / Feet"],
        "sort_order": 26,
    },
    {
        "question_key": "stage3_day_rhythm_map",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "somatic",
        "question_code": "DAY_RHYTHM_ENERGY",
        "question_prompt": "Daily energy fluctuation trajectory across the day:",
        "question_type": "json_array",
        "options_json": ["Morning", "Midday", "Afternoon", "Evening", "Night"],
        "sort_order": 27,
    },
    {
        "question_key": "stage3_breathing_before",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "respiration",
        "question_code": "BREATH_PRE",
        "question_prompt": "Breathing state before paced vagal regulation exercise:",
        "question_type": "single_choice",
        "options_json": ["Shallow / Constricted", "Normal / Neutral", "Deep & steady"],
        "sort_order": 28,
    },
    {
        "question_key": "stage3_breathing_after",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "respiration",
        "question_code": "BREATH_POST",
        "question_prompt": "Breathing state after paced vagal regulation exercise:",
        "question_type": "single_choice",
        "options_json": ["Calmer & more open", "Unchanged", "Restless"],
        "sort_order": 29,
    },
    {
        "question_key": "stage3_nervous_system_state",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "autonomic",
        "question_code": "NS_STATE",
        "question_prompt": "Current dominant autonomic nervous system state:",
        "question_type": "single_choice",
        "options_json": ["Ventral Vagal (Safe & Social)", "Sympathetic (Fight/Flight Activation)", "Dorsal Vagal (Freeze/Numb Shutdown)", "Mixed Activation"],
        "sort_order": 30,
    },
    {
        "question_key": "stage3_body_awareness",
        "stage_number": 3,
        "stage_name": "Stage 3: Nervous System & Somatics",
        "domain_key": "somatic",
        "question_code": "BODY_AWARENESS",
        "question_prompt": "Clarity of interoceptive internal body signals:",
        "question_type": "single_choice",
        "options_json": ["High clarity (Immediate body awareness)", "Moderate awareness", "Distant / Hard to locate sensation"],
        "sort_order": 31,
    },

    # Stage 4: Cognitive Maze
    {
        "question_key": "stage4_maze_completion_time",
        "stage_number": 4,
        "stage_name": "Stage 4: Flow & Working Memory",
        "domain_key": "cognition",
        "question_code": "MAZE_TIME_SEC",
        "question_prompt": "Time in seconds to complete cognitive focus maze navigation:",
        "question_type": "numeric",
        "options_json": ["Seconds"],
        "sort_order": 32,
    },

    # Stage 5: Psychometric Deep Dives
    # PSS-10 (Perceived Stress Scale 10 items)
    {
        "question_key": "pss10_q0",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q1",
        "question_prompt": "In the last month, how often have you been upset because of something that happened unexpectedly?",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 33,
    },
    {
        "question_key": "pss10_q1",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q2",
        "question_prompt": "In the last month, how often have you felt that you were unable to control the important things in your life?",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 34,
    },
    {
        "question_key": "pss10_q2",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q3",
        "question_prompt": "In the last month, how often have you felt nervous and 'stressed'?",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 35,
    },
    {
        "question_key": "pss10_q3",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q4",
        "question_prompt": "In the last month, how often have you felt confident about your ability to handle your personal problems? (Reverse Scored)",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 36,
    },
    {
        "question_key": "pss10_q4",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q5",
        "question_prompt": "In the last month, how often have you felt that things were going your way? (Reverse Scored)",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 37,
    },
    {
        "question_key": "pss10_q5",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q6",
        "question_prompt": "In the last month, how often have you found that you could not cope with all the things that you had to do?",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 38,
    },
    {
        "question_key": "pss10_q6",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q7",
        "question_prompt": "In the last month, how often have you been able to control irritations in your life? (Reverse Scored)",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 39,
    },
    {
        "question_key": "pss10_q7",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q8",
        "question_prompt": "In the last month, how often have you felt that you were on top of things? (Reverse Scored)",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 40,
    },
    {
        "question_key": "pss10_q8",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q9",
        "question_prompt": "In the last month, how often have you been angered because of things that were outside of your control?",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 41,
    },
    {
        "question_key": "pss10_q9",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "pss10",
        "question_code": "PSS10_Q10",
        "question_prompt": "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
        "sort_order": 42,
    },

    # UCLA-3 Loneliness Scale
    {
        "question_key": "ucla3_q0",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "ucla3",
        "question_code": "UCLA3_Q1",
        "question_prompt": "How often do you feel that you lack companionship?",
        "question_type": "scale_1_3",
        "options_json": ["Hardly Ever", "Some of the time", "Often"],
        "sort_order": 43,
    },
    {
        "question_key": "ucla3_q1",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "ucla3",
        "question_code": "UCLA3_Q2",
        "question_prompt": "How often do you feel left out?",
        "question_type": "scale_1_3",
        "options_json": ["Hardly Ever", "Some of the time", "Often"],
        "sort_order": 44,
    },
    {
        "question_key": "ucla3_q2",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "ucla3",
        "question_code": "UCLA3_Q3",
        "question_prompt": "How often do you feel isolated from others?",
        "question_type": "scale_1_3",
        "options_json": ["Hardly Ever", "Some of the time", "Often"],
        "sort_order": 45,
    },

    # GSE: General Self-Efficacy (10 items)
    {
        "question_key": "gse_g1",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q1",
        "question_prompt": "I can always manage to solve difficult problems if I try hard enough.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 46,
    },
    {
        "question_key": "gse_g2",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q2",
        "question_prompt": "If someone opposes me, I can find the means and ways to get what I want.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 47,
    },
    {
        "question_key": "gse_g3",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q3",
        "question_prompt": "It is easy for me to stick to my aims and accomplish my goals.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 48,
    },
    {
        "question_key": "gse_g4",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q4",
        "question_prompt": "I am confident that I could deal efficiently with unexpected events.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 49,
    },
    {
        "question_key": "gse_g5",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q5",
        "question_prompt": "Thanks to my resourcefulness, I know how to handle unforeseen situations.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 50,
    },
    {
        "question_key": "gse_g6",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q6",
        "question_prompt": "I can solve most problems if I invest the necessary effort.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 51,
    },
    {
        "question_key": "gse_g7",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q7",
        "question_prompt": "I can remain calm when facing difficulties because I can rely on my coping abilities.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 52,
    },
    {
        "question_key": "gse_g8",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q8",
        "question_prompt": "When I am confronted with a problem, I can usually find several solutions.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 53,
    },
    {
        "question_key": "gse_g9",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q9",
        "question_prompt": "If I am in trouble, I can usually think of a solution.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 54,
    },
    {
        "question_key": "gse_g10",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "gse",
        "question_code": "GSE_Q10",
        "question_prompt": "I can usually handle whatever comes my way.",
        "question_type": "scale_1_4",
        "options_json": ["Not at all true", "Hardly true", "Moderately true", "Exactly true"],
        "sort_order": 55,
    },

    # PROMIS: Meaning & Purpose (4 items)
    {
        "question_key": "promis_pr1",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "promis",
        "question_code": "PROMIS_Q1",
        "question_prompt": "My life has meaning (Past 7 days)",
        "question_type": "scale_1_5",
        "options_json": ["Not at all", "A little bit", "Somewhat", "Quite a bit", "Very much"],
        "sort_order": 56,
    },
    {
        "question_key": "promis_pr2",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "promis",
        "question_code": "PROMIS_Q2",
        "question_prompt": "I have a sense of direction in my life (Past 7 days)",
        "question_type": "scale_1_5",
        "options_json": ["Not at all", "A little bit", "Somewhat", "Quite a bit", "Very much"],
        "sort_order": 57,
    },
    {
        "question_key": "promis_pr3",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "promis",
        "question_code": "PROMIS_Q3",
        "question_prompt": "My life has purpose (Past 7 days)",
        "question_type": "scale_1_5",
        "options_json": ["Not at all", "A little bit", "Somewhat", "Quite a bit", "Very much"],
        "sort_order": 58,
    },
    {
        "question_key": "promis_pr4",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "promis",
        "question_code": "PROMIS_Q4",
        "question_prompt": "The things I do in my life are worthwhile (Past 7 days)",
        "question_type": "scale_1_5",
        "options_json": ["Not at all", "A little bit", "Somewhat", "Quite a bit", "Very much"],
        "sort_order": 59,
    },

    # CFPB-5: Financial Wellbeing (5 items)
    {
        "question_key": "cfpb5_c1",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "cfpb5",
        "question_code": "CFPB5_Q1",
        "question_prompt": "Because of my money situation, I feel like I will never have the things I want in life.",
        "question_type": "scale_1_5",
        "options_json": ["Completely", "Very well", "Somewhat", "Very little", "Not at all"],
        "sort_order": 60,
    },
    {
        "question_key": "cfpb5_c2",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "cfpb5",
        "question_code": "CFPB5_Q2",
        "question_prompt": "I am just getting by financially.",
        "question_type": "scale_1_5",
        "options_json": ["Completely", "Very well", "Somewhat", "Very little", "Not at all"],
        "sort_order": 61,
    },
    {
        "question_key": "cfpb5_c3",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "cfpb5",
        "question_code": "CFPB5_Q3",
        "question_prompt": "I am concerned that the money I have or will save won't last.",
        "question_type": "scale_1_5",
        "options_json": ["Completely", "Very well", "Somewhat", "Very little", "Not at all"],
        "sort_order": 62,
    },
    {
        "question_key": "cfpb5_c4",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "cfpb5",
        "question_code": "CFPB5_Q4",
        "question_prompt": "I have money left over at the end of the month.",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Rarely", "Sometimes", "Often", "Always"],
        "sort_order": 63,
    },
    {
        "question_key": "cfpb5_c5",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "cfpb5",
        "question_code": "CFPB5_Q5",
        "question_prompt": "My finances control my life.",
        "question_type": "scale_1_5",
        "options_json": ["Never", "Rarely", "Sometimes", "Often", "Always"],
        "sort_order": 64,
    },

    # Diener Flourishing Scale (8 items)
    {
        "question_key": "diener_q0",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q1",
        "question_prompt": "I lead a purposeful and meaningful life",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 65,
    },
    {
        "question_key": "diener_q1",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q2",
        "question_prompt": "My social relationships are supportive and rewarding",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 66,
    },
    {
        "question_key": "diener_q2",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q3",
        "question_prompt": "I am engaged and interested in my daily activities",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 67,
    },
    {
        "question_key": "diener_q3",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q4",
        "question_prompt": "I actively contribute to the happiness and well-being of others",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 68,
    },
    {
        "question_key": "diener_q4",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q5",
        "question_prompt": "I am competent and capable in the activities that are important to me",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 69,
    },
    {
        "question_key": "diener_q5",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q6",
        "question_prompt": "I am a good person and live a good life",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 70,
    },
    {
        "question_key": "diener_q6",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q7",
        "question_prompt": "I am optimistic about my future",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 71,
    },
    {
        "question_key": "diener_q7",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "diener",
        "question_code": "DIENER_Q8",
        "question_prompt": "People respect me",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 72,
    },

    # INS: Inclusion of Nature in Self (1-7 scale)
    {
        "question_key": "stage5_ins",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "nature",
        "question_code": "INS_NATURE_1_7",
        "question_prompt": "Inclusion of Nature in Self: Degree of felt interconnectedness between self and nature (1 = Separate to 7 = Fully Interconnected)",
        "question_type": "scale_1_7",
        "options_json": ["1 (Completely separate)", "2", "3", "4 (Moderate overlap)", "5", "6", "7 (Complete oneness)"],
        "sort_order": 73,
    },

    # SWLS: Satisfaction with Life Scale (5 items)
    {
        "question_key": "swls_q0",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "swls",
        "question_code": "SWLS_Q1",
        "question_prompt": "In most ways my life is close to my ideal.",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 74,
    },
    {
        "question_key": "swls_q1",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "swls",
        "question_code": "SWLS_Q2",
        "question_prompt": "The conditions of my life are excellent.",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 75,
    },
    {
        "question_key": "swls_q2",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "swls",
        "question_code": "SWLS_Q3",
        "question_prompt": "I am satisfied with my life.",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 76,
    },
    {
        "question_key": "swls_q3",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "swls",
        "question_code": "SWLS_Q4",
        "question_prompt": "So far I have gotten the important things I want in life.",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 77,
    },
    {
        "question_key": "swls_q4",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "swls",
        "question_code": "SWLS_Q5",
        "question_prompt": "If I could live my life over, I would change almost nothing.",
        "question_type": "scale_1_5",
        "options_json": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "sort_order": 78,
    },
    {
        "question_key": "stage5_life_landscape",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "landscape",
        "question_code": "LIFE_LANDSCAPE_MAPPING",
        "question_prompt": "Domain tripartite sorting (Depleted vs Okay vs Strength domains)",
        "question_type": "json_object",
        "options_json": ["depleted", "okay", "strength"],
        "sort_order": 79,
    },
    {
        "question_key": "stage5_bright_spot_check",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "bright_spot",
        "question_code": "BRIGHT_SPOT",
        "question_prompt": "Confirmation and reflection on your highest-resource domain",
        "question_type": "text",
        "options_json": [],
        "sort_order": 80,
    },
    {
        "question_key": "stage5_priority_tension_check",
        "stage_number": 5,
        "stage_name": "Stage 5: Psychometric Deep Dives",
        "domain_key": "tensions",
        "question_code": "PRIORITY_TENSION",
        "question_prompt": "Identified primary friction tension point across conflicting life domains",
        "question_type": "text",
        "options_json": [],
        "sort_order": 81,
    },

    # Stage 6: Sharing & Social Expression
    {
        "question_key": "stage6_everyday_sharing",
        "stage_number": 6,
        "stage_name": "Stage 6: Expression & Sharing",
        "domain_key": "expression",
        "question_code": "EVERYDAY_SHARING",
        "question_prompt": "Patterns of emotional expression and externalizing vulnerability with others",
        "question_type": "json_object",
        "options_json": ["Open with close circle", "Held internally / Guarded", "Selective sharing"],
        "sort_order": 82,
    },

    # Stage 7: Action Readiness & Support Ecosystem
    {
        "question_key": "stage7_external_conditions",
        "stage_number": 7,
        "stage_name": "Stage 7: Context & Action Readiness",
        "domain_key": "readiness",
        "question_code": "EXTERNAL_CONDITIONS",
        "question_prompt": "External supportive vs limiting factors in immediate environment",
        "question_type": "json_object",
        "options_json": [],
        "sort_order": 83,
    },
    {
        "question_key": "stage7_prior_attempts",
        "stage_number": 7,
        "stage_name": "Stage 7: Context & Action Readiness",
        "domain_key": "readiness",
        "question_code": "PRIOR_ATTEMPTS",
        "question_prompt": "Prior wellbeing interventions or behavioral change habits attempted in the past year:",
        "question_type": "single_choice",
        "options_json": ["Multiple sustained attempts", "Tried occasionally but faded", "First intentional exploration"],
        "sort_order": 84,
    },
    {
        "question_key": "stage7_aspiration_landscape",
        "stage_number": 7,
        "stage_name": "Stage 7: Context & Action Readiness",
        "domain_key": "aspirations",
        "question_code": "ASPIRATION_HORIZON",
        "question_prompt": "Primary aspiration horizon for the upcoming 6-12 months:",
        "question_type": "text",
        "options_json": [],
        "sort_order": 85,
    },
    {
        "question_key": "stage7_support_preferences",
        "stage_number": 7,
        "stage_name": "Stage 7: Context & Action Readiness",
        "domain_key": "support",
        "question_code": "SUPPORT_PREF",
        "question_prompt": "Preferred modality of growth and accountability support:",
        "question_type": "multi_choice",
        "options_json": ["Self-directed micro-habits", "1-on-1 expert coaching", "Structured tracking tools", "Community / Peer support"],
        "sort_order": 86,
    },
    {
        "question_key": "stage7_planner_readiness",
        "stage_number": 7,
        "stage_name": "Stage 7: Context & Action Readiness",
        "domain_key": "readiness",
        "question_code": "PLANNER_READINESS",
        "question_prompt": "Readiness to commit to a 5-minute daily reflective anchor practice:",
        "question_type": "single_choice",
        "options_json": ["Ready immediately", "Needs gentle ramp-up", "Low capacity currently"],
        "sort_order": 87,
    },
    {
        "question_key": "stage7_values_check",
        "stage_number": 7,
        "stage_name": "Stage 7: Context & Action Readiness",
        "domain_key": "values",
        "question_code": "CORE_VALUES",
        "question_prompt": "Core guiding values anchoring long-term wellbeing:",
        "question_type": "multi_choice",
        "options_json": ["Authenticity", "Resilience", "Compassion", "Autonomy", "Connection", "Excellence", "Peace", "Vitality"],
        "sort_order": 88,
    },
    {
        "question_key": "stage7_financial_aspiration",
        "stage_number": 7,
        "stage_name": "Stage 7: Context & Action Readiness",
        "domain_key": "financial",
        "question_code": "FIN_ASPIRATION",
        "question_prompt": "Key financial milestone targeted for greater peace of mind:",
        "question_type": "text",
        "options_json": [],
        "sort_order": 89,
    },

    # Stage 8: Stress Dynamics, Energy Arc & Recovery
    {
        "question_key": "stage8_energy_arc_morning",
        "stage_number": 8,
        "stage_name": "Stage 8: Stress & Recovery Dynamics",
        "domain_key": "energy_arc",
        "question_code": "ENERGY_MORNING",
        "question_prompt": "Typical Morning energy and cognitive activation level:",
        "question_type": "single_choice",
        "options_json": ["Low / Sluggish", "Moderate / Steady", "High / Peak Activation"],
        "sort_order": 90,
    },
    {
        "question_key": "stage8_energy_arc_afternoon",
        "stage_number": 8,
        "stage_name": "Stage 8: Stress & Recovery Dynamics",
        "domain_key": "energy_arc",
        "question_code": "ENERGY_AFTERNOON",
        "question_prompt": "Typical Afternoon energy level (post-lunch dip vs sustained):",
        "question_type": "single_choice",
        "options_json": ["Deep slump / Brain fog", "Moderate steady focus", "High sustained drive"],
        "sort_order": 91,
    },
    {
        "question_key": "stage8_energy_arc_evening",
        "stage_number": 8,
        "stage_name": "Stage 8: Stress & Recovery Dynamics",
        "domain_key": "energy_arc",
        "question_code": "ENERGY_EVENING",
        "question_prompt": "Typical Evening energy level (wind-down vs second wind):",
        "question_type": "single_choice",
        "options_json": ["Exhausted / Depleted", "Relaxed & content", "Second wind / Wired & tired"],
        "sort_order": 92,
    },
    {
        "question_key": "stage8_energy_arc_night",
        "stage_number": 8,
        "stage_name": "Stage 8: Stress & Recovery Dynamics",
        "domain_key": "energy_arc",
        "question_code": "ENERGY_NIGHT",
        "question_prompt": "Typical Pre-sleep energy and mental state:",
        "question_type": "single_choice",
        "options_json": ["Calm transition into sleep", "Racing thoughts / Overstimulated", "Restless physical tension"],
        "sort_order": 93,
    },
    {
        "question_key": "stage8_stress_pattern_clusters",
        "stage_number": 8,
        "stage_name": "Stage 8: Stress & Recovery Dynamics",
        "domain_key": "stress_patterns",
        "question_code": "STRESS_CLUSTERS",
        "question_prompt": "Primary somatic & cognitive stress pattern clusters observed:",
        "question_type": "multi_choice",
        "options_json": ["Rumination / Overthinking", "Somatic tension / Headaches", "Emotional withdrawal", "Hyper-vigilance / Urgency", "Fatigue / Collapse"],
        "sort_order": 94,
    },
    {
        "question_key": "stage8_recovery_responsiveness",
        "stage_number": 8,
        "stage_name": "Stage 8: Stress & Recovery Dynamics",
        "domain_key": "recovery",
        "question_code": "RECOVERY_SPEED",
        "question_prompt": "How quickly do you bounce back after experiencing an intense acute stressor?",
        "question_type": "single_choice",
        "options_json": ["Rapid recovery (Hours)", "Moderate recovery (1-2 days)", "Prolonged hangover (Several days/weeks)"],
        "sort_order": 95,
    },
    {
        "question_key": "stage8_cumulative_load",
        "stage_number": 8,
        "stage_name": "Stage 8: Stress & Recovery Dynamics",
        "domain_key": "allostatic_load",
        "question_code": "CUMULATIVE_LOAD",
        "question_prompt": "Estimated multi-month allostatic cumulative stress load:",
        "question_type": "single_choice",
        "options_json": ["Light / Well managed", "Moderate / Noticeable strain", "Heavy / Near burnout threshold"],
        "sort_order": 96,
    },

    # Stage 9: Sensory & Completion
    {
        "question_key": "stage9_sound_preference",
        "stage_number": 9,
        "stage_name": "Stage 9: Sensory & Wrap-up",
        "domain_key": "sensory",
        "question_code": "SOUND_PREF",
        "question_prompt": "Preferred sound environment for restoration:",
        "question_type": "single_choice",
        "options_json": ["Complete silence", "Natural soundscapes (Rain/Forest)", "Ambient brown/white noise", "Acoustic music"],
        "sort_order": 97,
    },
    {
        "question_key": "stage9_quick_choices",
        "stage_number": 9,
        "stage_name": "Stage 9: Sensory & Wrap-up",
        "domain_key": "sensory",
        "question_code": "QUICK_CHOICES",
        "question_prompt": "Fast intuitive choice selections across restorative modalities",
        "question_type": "json_object",
        "options_json": [],
        "sort_order": 98,
    },
]

# Fast lookup map: question_key -> question definition dict
QUESTIONS_MAP: Dict[str, Dict[str, Any]] = {q["question_key"]: q for q in QUESTIONS_CATALOG}


# -------------------------------------------------------------------------------
# Schema Initialization
# -------------------------------------------------------------------------------

def init_qa_schema():
    """Ensure lewis_questions_catalog and lewis_user_stage_answers exist in PostgreSQL or SQLite."""
    from auth import has_pg, DATABASE_URL, DB_PATH, get_pg_conn
    import sqlite3

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS lewis_questions_catalog (
                            id SERIAL PRIMARY KEY,
                            question_key VARCHAR UNIQUE NOT NULL,
                            stage_number INTEGER NOT NULL,
                            stage_name TEXT NOT NULL,
                            domain_key VARCHAR NOT NULL,
                            question_code VARCHAR NOT NULL,
                            question_prompt TEXT NOT NULL,
                            question_type VARCHAR NOT NULL,
                            options_json TEXT,
                            sort_order INTEGER NOT NULL DEFAULT 0,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                        );
                        CREATE INDEX IF NOT EXISTS idx_qa_cat_stage ON lewis_questions_catalog (stage_number);
                        CREATE INDEX IF NOT EXISTS idx_qa_cat_domain ON lewis_questions_catalog (domain_key);

                        CREATE TABLE IF NOT EXISTS lewis_user_stage_answers (
                            id SERIAL PRIMARY KEY,
                            report_uuid TEXT NOT NULL,
                            session_id TEXT,
                            user_email_hash TEXT,
                            stage_number INTEGER NOT NULL,
                            stage_name TEXT NOT NULL,
                            domain_key VARCHAR NOT NULL,
                            question_key VARCHAR NOT NULL,
                            question_prompt TEXT NOT NULL,
                            answer_raw TEXT,
                            answer_numeric REAL,
                            answer_label TEXT,
                            answer_metadata_json TEXT,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                        );
                        CREATE INDEX IF NOT EXISTS idx_user_ans_report ON lewis_user_stage_answers (report_uuid);
                        CREATE INDEX IF NOT EXISTS idx_user_ans_session ON lewis_user_stage_answers (session_id);
                        CREATE INDEX IF NOT EXISTS idx_user_ans_qkey ON lewis_user_stage_answers (question_key);
                        CREATE INDEX IF NOT EXISTS idx_user_ans_stage ON lewis_user_stage_answers (stage_number);
                    """)
                    # Upsert canonical questions into catalog
                    for q in QUESTIONS_CATALOG:
                        cur.execute("""
                            INSERT INTO lewis_questions_catalog
                            (question_key, stage_number, stage_name, domain_key, question_code, question_prompt, question_type, options_json, sort_order, updated_at)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                            ON CONFLICT (question_key) DO UPDATE SET
                                stage_number = EXCLUDED.stage_number,
                                stage_name = EXCLUDED.stage_name,
                                domain_key = EXCLUDED.domain_key,
                                question_code = EXCLUDED.question_code,
                                question_prompt = EXCLUDED.question_prompt,
                                question_type = EXCLUDED.question_type,
                                options_json = EXCLUDED.options_json,
                                sort_order = EXCLUDED.sort_order,
                                updated_at = NOW();
                        """, (
                            q["question_key"], q["stage_number"], q["stage_name"],
                            q["domain_key"], q["question_code"], q["question_prompt"],
                            q["question_type"], json.dumps(q["options_json"]), q["sort_order"]
                        ))
                    conn.commit()
                conn.close()
                logger.info("Initialized lewis_questions_catalog and lewis_user_stage_answers in PostgreSQL")
                return
        except Exception as e:
            logger.error("PostgreSQL error initializing QA schema: %s", e)

    # SQLite Fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lewis_questions_catalog (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_key TEXT UNIQUE NOT NULL,
                stage_number INTEGER NOT NULL,
                stage_name TEXT NOT NULL,
                domain_key TEXT NOT NULL,
                question_code TEXT NOT NULL,
                question_prompt TEXT NOT NULL,
                question_type TEXT NOT NULL,
                options_json TEXT,
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lewis_user_stage_answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_uuid TEXT NOT NULL,
                session_id TEXT,
                user_email_hash TEXT,
                stage_number INTEGER NOT NULL,
                stage_name TEXT NOT NULL,
                domain_key TEXT NOT NULL,
                question_key TEXT NOT NULL,
                question_prompt TEXT NOT NULL,
                answer_raw TEXT,
                answer_numeric REAL,
                answer_label TEXT,
                answer_metadata_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        for q in QUESTIONS_CATALOG:
            cur.execute("""
                INSERT INTO lewis_questions_catalog
                (question_key, stage_number, stage_name, domain_key, question_code, question_prompt, question_type, options_json, sort_order, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT (question_key) DO UPDATE SET
                    stage_number = excluded.stage_number,
                    stage_name = excluded.stage_name,
                    domain_key = excluded.domain_key,
                    question_code = excluded.question_code,
                    question_prompt = excluded.question_prompt,
                    question_type = excluded.question_type,
                    options_json = excluded.options_json,
                    sort_order = excluded.sort_order,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                q["question_key"], q["stage_number"], q["stage_name"],
                q["domain_key"], q["question_code"], q["question_prompt"],
                q["question_type"], json.dumps(q["options_json"]), q["sort_order"]
            ))
        conn.commit()
        conn.close()
        logger.info("Initialized lewis_questions_catalog and lewis_user_stage_answers in SQLite")
    except Exception as e:
        logger.warning("SQLite error initializing QA schema: %s", e)


# -------------------------------------------------------------------------------
# Ingestion: Extract & Store Answers for an Assessment
# -------------------------------------------------------------------------------

def _safe_str(val: Any) -> Optional[str]:
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return json.dumps(val, default=str)
    return str(val).strip()


def _safe_float(val: Any) -> Optional[float]:
    if val is None or val == "":
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def extract_and_store_user_answers(
    report_uuid: str,
    session_id: Optional[str] = None,
    user_email: Optional[str] = None,
    answers_payload: Optional[Dict[str, Any]] = None
) -> int:
    """
    Decomposes a full assessment submission payload across all Lewis stages (0-9)
    and writes normalized question-answer records to lewis_user_stage_answers.
    Returns the total count of answers recorded.
    """
    if not report_uuid or not answers_payload:
        return 0

    from auth import blind_index_email, has_pg, DATABASE_URL, DB_PATH, get_pg_conn
    import sqlite3

    email_hash = blind_index_email(user_email) if user_email else None
    sess_id = session_id or answers_payload.get("session_id")
    rows_to_insert = []

    # Map of payload extractors for every canonical question key
    for q in QUESTIONS_CATALOG:
        q_key = q["question_key"]
        raw_val = None
        num_val = None
        label_val = None

        # Extract values based on question key
        if q_key == "stage0_is_over_18":
            val = answers_payload.get("is_over_18")
            raw_val = "Yes" if val is True else ("No" if val is False else None)
            num_val = 1.0 if val is True else 0.0
            label_val = raw_val

        elif q_key == "profile_age_category":
            raw_val = answers_payload.get("ageCategory")
            label_val = raw_val

        elif q_key == "profile_gender":
            raw_val = answers_payload.get("gender")
            label_val = raw_val

        elif q_key == "stage1_identity_roles":
            val = answers_payload.get("identityRoles")
            raw_val = _safe_str(val)
            label_val = ", ".join(val) if isinstance(val, list) else raw_val

        elif q_key == "stage1_life_stability":
            val = answers_payload.get("lifeStability")
            num_val = _safe_float(val)
            raw_val = str(num_val) if num_val is not None else None
            label_val = f"{num_val}/100" if num_val is not None else None

        elif q_key == "stage1_active_pressures":
            val = answers_payload.get("active_pressures") or answers_payload.get("activePressures")
            raw_val = _safe_str(val)
            label_val = ", ".join(val) if isinstance(val, list) else raw_val

        elif q_key == "stage1_body_movement":
            raw_val = answers_payload.get("bodyMovement")
            label_val = raw_val

        elif q_key == "stage1_sleep_quality":
            raw_val = answers_payload.get("sleepQuality")
            label_val = raw_val

        elif q_key == "stage1_body_context":
            val = answers_payload.get("bodyContext")
            raw_val = _safe_str(val)
            label_val = ", ".join(val) if isinstance(val, list) else raw_val

        # WHO-5 (q0..q4)
        elif q_key.startswith("who5_q"):
            idx = int(q_key.replace("who5_q", ""))
            who5_raw = answers_payload.get("who5")
            if isinstance(who5_raw, list) and len(who5_raw) > idx:
                num_val = float(who5_raw[idx])
                scale_opts = q["options_json"]
                label_val = scale_opts[int(num_val)] if 0 <= int(num_val) < len(scale_opts) else str(num_val)
                raw_val = str(num_val)
            elif isinstance(who5_raw, dict):
                val = who5_raw.get(f"q{idx}")
                raw_val = _safe_str(val)
                num_val = _safe_float(val)
                label_val = raw_val

        elif q_key == "stage1_relational_context":
            raw_val = answers_payload.get("relationalContext")
            label_val = raw_val

        elif q_key == "stage1_priority_ranking":
            val = answers_payload.get("priority_rank") or answers_payload.get("priorities")
            raw_val = _safe_str(val)
            label_val = " > ".join(val) if isinstance(val, list) else raw_val

        elif q_key == "stage1_arrival_word":
            raw_val = answers_payload.get("arrival_word") or answers_payload.get("arrivalState")
            label_val = raw_val

        elif q_key == "stage1_financial_pulse":
            raw_val = _safe_str(answers_payload.get("financialPulse"))
            label_val = raw_val

        elif q_key == "stage1_environmental_pulse":
            raw_val = _safe_str(answers_payload.get("environmentalPulse"))
            label_val = raw_val

        elif q_key == "stage1_intellectual_pulse":
            raw_val = _safe_str(answers_payload.get("intellectualPulse"))
            label_val = raw_val

        elif q_key == "stage1_cultural_belonging":
            raw_val = _safe_str(answers_payload.get("culturalBelonging"))
            label_val = raw_val

        elif q_key == "stage1_body_rhythm":
            raw_val = _safe_str(answers_payload.get("bodyRhythm"))
            label_val = raw_val

        elif q_key == "stage2_attention_drift_completed":
            val = answers_payload.get("attentionDriftDone")
            raw_val = "Completed" if val else "Skipped"
            num_val = 1.0 if val else 0.0
            label_val = raw_val

        # Stage 3
        elif q_key == "stage3_affect_valence":
            affect = answers_payload.get("affect") or {}
            num_val = _safe_float(affect.get("x"))
            raw_val = str(num_val) if num_val is not None else None
            label_val = f"Valence: {num_val}" if num_val is not None else None

        elif q_key == "stage3_affect_energy":
            affect = answers_payload.get("affect") or {}
            num_val = _safe_float(affect.get("y"))
            raw_val = str(num_val) if num_val is not None else None
            label_val = f"Energy: {num_val}" if num_val is not None else None

        elif q_key == "stage3_body_map_zones":
            val = answers_payload.get("bodyMapZones")
            raw_val = _safe_str(val)
            label_val = ", ".join(val) if isinstance(val, list) else raw_val

        elif q_key == "stage3_day_rhythm_map":
            raw_val = _safe_str(answers_payload.get("dayRhythmMap"))
            label_val = raw_val

        elif q_key == "stage3_breathing_before":
            raw_val = answers_payload.get("breathingBefore")
            label_val = raw_val

        elif q_key == "stage3_breathing_after":
            raw_val = answers_payload.get("breathingAfter")
            label_val = raw_val

        elif q_key == "stage3_nervous_system_state":
            raw_val = answers_payload.get("nervousSystemState")
            label_val = raw_val

        elif q_key == "stage3_body_awareness":
            raw_val = answers_payload.get("body_awareness") or answers_payload.get("bodyAwareness")
            label_val = raw_val

        # Stage 4
        elif q_key == "stage4_maze_completion_time":
            val = answers_payload.get("mazeCompletionTime")
            num_val = _safe_float(val)
            raw_val = str(num_val) if num_val is not None else None
            label_val = f"{num_val}s" if num_val is not None else None

        # PSS-10
        elif q_key.startswith("pss10_q"):
            idx = int(q_key.replace("pss10_q", ""))
            pss = answers_payload.get("pss10")
            if isinstance(pss, list) and len(pss) > idx:
                num_val = float(pss[idx])
                scale_opts = q["options_json"]
                label_val = scale_opts[int(num_val)] if 0 <= int(num_val) < len(scale_opts) else str(num_val)
                raw_val = str(num_val)
            elif isinstance(pss, dict):
                raw_val = _safe_str(pss.get(f"q{idx}"))
                label_val = raw_val

        # UCLA-3
        elif q_key.startswith("ucla3_q"):
            idx = int(q_key.replace("ucla3_q", ""))
            ucla = answers_payload.get("ucla3")
            if isinstance(ucla, list) and len(ucla) > idx:
                num_val = float(ucla[idx])
                scale_opts = q["options_json"]
                label_val = scale_opts[int(num_val)] if 0 <= int(num_val) < len(scale_opts) else str(num_val)
                raw_val = str(num_val)
            elif isinstance(ucla, dict):
                raw_val = _safe_str(ucla.get(f"q{idx}"))
                label_val = raw_val

        # GSE (1-10)
        elif q_key.startswith("gse_g"):
            idx = int(q_key.replace("gse_g", ""))
            gse = answers_payload.get("gse")
            if isinstance(gse, list) and len(gse) >= idx:
                num_val = float(gse[idx - 1])
                scale_opts = q["options_json"]
                mapped_idx = int(num_val) - 1
                label_val = scale_opts[mapped_idx] if 0 <= mapped_idx < len(scale_opts) else str(num_val)
                raw_val = str(num_val)
            elif isinstance(gse, dict):
                raw_val = _safe_str(gse.get(f"g{idx}"))
                label_val = raw_val

        # PROMIS (1-4)
        elif q_key.startswith("promis_pr"):
            idx = int(q_key.replace("promis_pr", ""))
            promis = answers_payload.get("promis")
            if isinstance(promis, list) and len(promis) >= idx:
                num_val = float(promis[idx - 1])
                scale_opts = q["options_json"]
                label_val = scale_opts[int(num_val)] if 0 <= int(num_val) < len(scale_opts) else str(num_val)
                raw_val = str(num_val)
            elif isinstance(promis, dict):
                raw_val = _safe_str(promis.get(f"pr{idx}"))
                label_val = raw_val

        # CFPB-5 (c1-c5)
        elif q_key.startswith("cfpb5_c"):
            idx = int(q_key.replace("cfpb5_c", ""))
            cfpb = answers_payload.get("cfpb5")
            if isinstance(cfpb, list) and len(cfpb) >= idx:
                num_val = float(cfpb[idx - 1])
                scale_opts = q["options_json"]
                label_val = scale_opts[int(num_val)] if 0 <= int(num_val) < len(scale_opts) else str(num_val)
                raw_val = str(num_val)
            elif isinstance(cfpb, dict):
                raw_val = _safe_str(cfpb.get(f"c{idx}"))
                label_val = raw_val

        # Diener (q0..q7)
        elif q_key.startswith("diener_q"):
            idx = int(q_key.replace("diener_q", ""))
            diener = answers_payload.get("diener")
            if isinstance(diener, list) and len(diener) > idx:
                num_val = float(diener[idx])
                raw_val = str(num_val)
                label_val = f"Agreement: {num_val}"
            elif isinstance(diener, dict):
                raw_val = _safe_str(diener.get(f"q{idx}"))
                label_val = raw_val

        # INS
        elif q_key == "stage5_ins":
            val = answers_payload.get("ins")
            num_val = _safe_float(val)
            raw_val = str(num_val) if num_val is not None else None
            label_val = f"Level {int(num_val)}/7" if num_val is not None else None

        # SWLS (q0..q4)
        elif q_key.startswith("swls_q"):
            idx = int(q_key.replace("swls_q", ""))
            swls = answers_payload.get("swls")
            if isinstance(swls, list) and len(swls) > idx:
                num_val = float(swls[idx])
                raw_val = str(num_val)
                label_val = f"Agreement: {num_val}"
            elif isinstance(swls, dict):
                raw_val = _safe_str(swls.get(f"q{idx}"))
                label_val = raw_val

        elif q_key == "stage5_life_landscape":
            raw_val = _safe_str(answers_payload.get("lifeLandscape"))
            label_val = raw_val

        elif q_key == "stage5_bright_spot_check":
            raw_val = answers_payload.get("brightSpotCheck")
            label_val = raw_val

        elif q_key == "stage5_priority_tension_check":
            raw_val = answers_payload.get("priorityTensionCheck")
            label_val = raw_val

        # Stage 6
        elif q_key == "stage6_everyday_sharing":
            raw_val = _safe_str(answers_payload.get("everydaySharing"))
            label_val = raw_val

        # Stage 7
        elif q_key == "stage7_external_conditions":
            raw_val = _safe_str(answers_payload.get("externalConditions"))
            label_val = raw_val

        elif q_key == "stage7_prior_attempts":
            raw_val = answers_payload.get("priorAttempts")
            label_val = raw_val

        elif q_key == "stage7_aspiration_landscape":
            raw_val = answers_payload.get("aspirationLandscape")
            label_val = raw_val

        elif q_key == "stage7_support_preferences":
            val = answers_payload.get("supportPreferences")
            raw_val = _safe_str(val)
            label_val = ", ".join(val) if isinstance(val, list) else raw_val

        elif q_key == "stage7_planner_readiness":
            raw_val = answers_payload.get("plannerReadiness")
            label_val = raw_val

        elif q_key == "stage7_values_check":
            val = answers_payload.get("valuesCheck")
            raw_val = _safe_str(val)
            label_val = ", ".join(val) if isinstance(val, list) else raw_val

        elif q_key == "stage7_financial_aspiration":
            raw_val = answers_payload.get("financialAspiration")
            label_val = raw_val

        # Stage 8
        elif q_key.startswith("stage8_energy_arc_"):
            slot = q_key.replace("stage8_energy_arc_", "")
            energy_arc = answers_payload.get("energyArc") or {}
            raw_val = energy_arc.get(slot)
            label_val = raw_val

        elif q_key == "stage8_stress_pattern_clusters":
            val = answers_payload.get("stressPatternClusters")
            raw_val = _safe_str(val)
            label_val = ", ".join(val) if isinstance(val, list) else raw_val

        elif q_key == "stage8_recovery_responsiveness":
            raw_val = answers_payload.get("recoveryResponsiveness")
            label_val = raw_val

        elif q_key == "stage8_cumulative_load":
            raw_val = _safe_str(answers_payload.get("cumulativeLoad"))
            label_val = raw_val

        # Stage 9
        elif q_key == "stage9_sound_preference":
            raw_val = answers_payload.get("soundPreference")
            label_val = raw_val

        elif q_key == "stage9_quick_choices":
            raw_val = _safe_str(answers_payload.get("quickChoices"))
            label_val = raw_val

        # Scored Instrument Answers override (human-readable label if available)
        scored_answers = answers_payload.get("scored_instrument_answers") or {}
        if isinstance(scored_answers, dict):
            for inst_name, qa_list in scored_answers.items():
                if isinstance(qa_list, list):
                    for item in qa_list:
                        if isinstance(item, dict) and item.get("question") == q["question_prompt"] and item.get("answer"):
                            label_val = str(item["answer"])

        if raw_val is not None or num_val is not None:
            rows_to_insert.append((
                report_uuid, sess_id, email_hash,
                q["stage_number"], q["stage_name"], q["domain_key"],
                q["question_key"], q["question_prompt"],
                raw_val, num_val, label_val or raw_val, None
            ))

    if not rows_to_insert:
        return 0

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    # Clear existing answers for idempotency on re-submission
                    cur.execute("DELETE FROM lewis_user_stage_answers WHERE report_uuid = %s", (report_uuid,))
                    cur.executemany("""
                        INSERT INTO lewis_user_stage_answers
                        (report_uuid, session_id, user_email_hash, stage_number, stage_name, domain_key, question_key, question_prompt, answer_raw, answer_numeric, answer_label, answer_metadata_json, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    """, rows_to_insert)
                    conn.commit()
                conn.close()
                logger.info("Saved %d stage Q&A answers for report %s to PostgreSQL", len(rows_to_insert), report_uuid)
                return len(rows_to_insert)
        except Exception as e:
            logger.error("PostgreSQL error saving stage Q&A answers: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("DELETE FROM lewis_user_stage_answers WHERE report_uuid = ?", (report_uuid,))
        cur.executemany("""
            INSERT INTO lewis_user_stage_answers
            (report_uuid, session_id, user_email_hash, stage_number, stage_name, domain_key, question_key, question_prompt, answer_raw, answer_numeric, answer_label, answer_metadata_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        """, rows_to_insert)
        conn.commit()
        conn.close()
        logger.info("Saved %d stage Q&A answers for report %s to SQLite", len(rows_to_insert), report_uuid)
        return len(rows_to_insert)
    except Exception as e:
        logger.warning("SQLite error saving stage Q&A answers: %s", e)

    return len(rows_to_insert)


# -------------------------------------------------------------------------------
# Retroactive Sync for Existing Assessment Submissions
# -------------------------------------------------------------------------------

def retroactive_sync_existing_records() -> int:
    """
    Parses all existing lewis_assessment_records that haven't yet been normalized into
    lewis_user_stage_answers and populates them automatically.
    """
    from auth import has_pg, DATABASE_URL, DB_PATH, get_pg_conn
    import sqlite3

    synced_count = 0
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT r.report_uuid, r.user_email_hash, r.answers_json
                        FROM lewis_assessment_records r
                        WHERE r.answers_json IS NOT NULL
                          AND NOT EXISTS (
                              SELECT 1 FROM lewis_user_stage_answers a WHERE a.report_uuid = r.report_uuid
                          )
                    """)
                    records = cur.fetchall()
                conn.close()

                for rec in records:
                    raw_answers = rec.get("answers_json") if isinstance(rec, dict) else rec[2]
                    rep_uuid = rec.get("report_uuid") if isinstance(rec, dict) else rec[0]
                    if raw_answers:
                        try:
                            parsed = json.loads(raw_answers) if isinstance(raw_answers, str) else raw_answers
                            extract_and_store_user_answers(rep_uuid, answers_payload=parsed)
                            synced_count += 1
                        except Exception as parse_err:
                            logger.warning("Could not sync record %s: %s", rep_uuid, parse_err)
                logger.info("Retroactively synced %d existing assessment records to PostgreSQL QA table", synced_count)
                return synced_count
        except Exception as e:
            logger.error("PostgreSQL error in retroactive sync: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("""
            SELECT r.report_uuid, r.user_email_hash, r.answers_json
            FROM lewis_assessment_records r
            WHERE r.answers_json IS NOT NULL
              AND NOT EXISTS (
                  SELECT 1 FROM lewis_user_stage_answers a WHERE a.report_uuid = r.report_uuid
              )
        """)
        records = cur.fetchall()
        conn.close()

        for rec in records:
            raw_answers = rec["answers_json"]
            rep_uuid = rec["report_uuid"]
            if raw_answers:
                try:
                    parsed = json.loads(raw_answers) if isinstance(raw_answers, str) else raw_answers
                    extract_and_store_user_answers(rep_uuid, answers_payload=parsed)
                    synced_count += 1
                except Exception as parse_err:
                    logger.warning("Could not sync record %s: %s", rep_uuid, parse_err)
        logger.info("Retroactively synced %d existing assessment records to SQLite QA table", synced_count)
    except Exception as e:
        logger.warning("SQLite error in retroactive sync: %s", e)

    return synced_count


# -------------------------------------------------------------------------------
# Matrix & Excel/CSV Dataset Generation for Lewis OS
# -------------------------------------------------------------------------------

def get_dataset_matrix(limit: int = 500) -> Dict[str, Any]:
    """
    Constructs a complete matrix suitable for Lewis OS spreadsheet/table display:
    - Headers: Demographic & Session metadata + All Question Codes & Prompts across stages.
    - Rows: Each attendee with their session timestamp, ID, and their specific answer corresponding to each question.
    """
    from auth import has_pg, DATABASE_URL, DB_PATH, get_pg_conn, decrypt_pii
    import sqlite3

    assessments = []
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT 
                            r.report_uuid,
                            r.user_name_encrypted,
                            r.user_email_encrypted,
                            r.user_email_hash,
                            r.age_category,
                            r.gender,
                            r.wellbeing_band,
                            r.overall_score,
                            r.started_at,
                            r.completed_at,
                            r.duration_seconds,
                            r.is_unlocked,
                            r.paid_plan
                        FROM lewis_assessment_records r
                        ORDER BY r.completed_at DESC
                        LIMIT %s;
                    """, (limit,))
                    assessments = cur.fetchall()
                conn.close()
        except Exception as e:
            logger.error("PostgreSQL error fetching assessments for matrix: %s", e)
    else:
        try:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("""
                SELECT 
                    r.report_uuid,
                    r.user_name_encrypted,
                    r.user_email_encrypted,
                    r.user_email_hash,
                    r.age_category,
                    r.gender,
                    r.wellbeing_band,
                    r.overall_score,
                    r.started_at,
                    r.completed_at,
                    r.duration_seconds,
                    r.is_unlocked,
                    r.paid_plan
                FROM lewis_assessment_records r
                ORDER BY r.completed_at DESC
                LIMIT ?;
            """, (limit,))
            assessments = cur.fetchall()
            conn.close()
        except Exception as e:
            logger.warning("SQLite error fetching assessments for matrix: %s", e)

    # Fetch all answers for these assessments
    report_uuids = [dict(a)["report_uuid"] if isinstance(a, dict) else a[0] for a in assessments]
    answers_by_report: Dict[str, Dict[str, Any]] = {u: {} for u in report_uuids}

    if report_uuids:
        if has_pg and DATABASE_URL:
            try:
                conn = get_pg_conn()
                if conn:
                    with conn.cursor() as cur:
                        cur.execute("""
                            SELECT report_uuid, question_key, answer_label, answer_raw, answer_numeric
                            FROM lewis_user_stage_answers
                            WHERE report_uuid = ANY(%s);
                        """, (report_uuids,))
                        ans_rows = cur.fetchall()
                        for row in ans_rows:
                            r_dict = dict(row) if isinstance(row, dict) else {"report_uuid": row[0], "question_key": row[1], "answer_label": row[2], "answer_raw": row[3], "answer_numeric": row[4]}
                            answers_by_report[r_dict["report_uuid"]][r_dict["question_key"]] = r_dict["answer_label"] or r_dict["answer_raw"]
                    conn.close()
            except Exception as e:
                logger.error("PostgreSQL error fetching answers for matrix: %s", e)
        else:
            try:
                conn = sqlite3.connect(DB_PATH)
                conn.row_factory = sqlite3.Row
                cur = conn.cursor()
                placeholders = ",".join(["?"] * len(report_uuids))
                cur.execute(f"""
                    SELECT report_uuid, question_key, answer_label, answer_raw, answer_numeric
                    FROM lewis_user_stage_answers
                    WHERE report_uuid IN ({placeholders});
                """, report_uuids)
                ans_rows = cur.fetchall()
                conn.close()
                for row in ans_rows:
                    answers_by_report[row["report_uuid"]][row["question_key"]] = row["answer_label"] or row["answer_raw"]
            except Exception as e:
                logger.warning("SQLite error fetching answers for matrix: %s", e)

    # Build columns list
    columns = [
        {"key": "user_id", "label": "User / Assessment ID", "stage": "Metadata"},
        {"key": "user_name", "label": "Customer Name", "stage": "Metadata"},
        {"key": "user_email", "label": "Customer Email", "stage": "Metadata"},
        {"key": "completed_at", "label": "Time Attended", "stage": "Metadata"},
        {"key": "duration_minutes", "label": "Duration (Minutes)", "stage": "Metadata"},
        {"key": "wellbeing_band", "label": "Wellbeing Band", "stage": "Summary"},
        {"key": "overall_score", "label": "WHO-5 Score", "stage": "Summary"},
    ]

    for q in QUESTIONS_CATALOG:
        columns.append({
            "key": q["question_key"],
            "label": f"[{q['question_code']}] {q['question_prompt']}",
            "stage": q["stage_name"],
            "domain": q["domain_key"],
            "type": q["question_type"]
        })

    # Build rows
    rows = []
    for a in assessments:
        rec = dict(a) if isinstance(a, dict) else {
            "report_uuid": a[0], "user_name_encrypted": a[1], "user_email_encrypted": a[2],
            "user_email_hash": a[3], "age_category": a[4], "gender": a[5],
            "wellbeing_band": a[6], "overall_score": a[7], "started_at": a[8],
            "completed_at": a[9], "duration_seconds": a[10], "is_unlocked": a[11], "paid_plan": a[12]
        }
        rep_uuid = rec["report_uuid"]
        dur_sec = rec.get("duration_seconds") or 0
        dur_min = round(dur_sec / 60.0, 1) if dur_sec else 0.0

        user_name = decrypt_pii(rec.get("user_name_encrypted")) or "Anonymous"
        user_email = decrypt_pii(rec.get("user_email_encrypted")) or (f"anon_{rec.get('user_email_hash')[:8]}" if rec.get("user_email_hash") else "N/A")
        completed_time = rec.get("completed_at")
        time_str = completed_time.isoformat() if hasattr(completed_time, "isoformat") else str(completed_time or "")

        row_data = {
            "user_id": rep_uuid,
            "user_name": user_name,
            "user_email": user_email,
            "completed_at": time_str,
            "duration_minutes": dur_min,
            "wellbeing_band": rec.get("wellbeing_band") or "N/A",
            "overall_score": rec.get("overall_score") or 0.0,
        }

        user_answers = answers_by_report.get(rep_uuid, {})
        for q in QUESTIONS_CATALOG:
            row_data[q["question_key"]] = user_answers.get(q["question_key"], "")

        rows.append(row_data)

    return {
        "status": "success",
        "total_records": len(rows),
        "total_questions": len(QUESTIONS_CATALOG),
        "columns": columns,
        "rows": rows,
    }


def generate_dataset_csv(limit: int = 1000) -> str:
    """
    Generates a full Excel-compatible CSV string with BOM, where rows represent attendees
    and columns list user metadata and all questions with their corresponding answers.
    """
    matrix = get_dataset_matrix(limit=limit)
    columns = matrix["columns"]
    rows = matrix["rows"]

    output = io.StringIO()
    # Write UTF-8 BOM so Microsoft Excel correctly parses UTF-8 strings
    output.write('\ufeff')

    writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)
    # Header row
    headers = [col["label"] for col in columns]
    writer.writerow(headers)

    for row in rows:
        row_values = [row.get(col["key"], "") for col in columns]
        writer.writerow(row_values)

    return output.getvalue()
