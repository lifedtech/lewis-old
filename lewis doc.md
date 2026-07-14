# LEWIS Core Engine - Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Purpose](#project-purpose)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Assessment Instruments](#assessment-instruments)
6. [API Endpoints](#api-endpoints)
7. [Response & scoring Logic](#response-and-scoring-logic)
8. [AI Narrative System](#ai-narrative-system)
9. [Data Models](#data-models)
10. [Installation & Setup](#installation--setup)
11. [Usage Examples](#usage-examples)

---

## Overview

**LEWIS Core Engine** (The Lifed Everyday Wellbeing Intelligence System) is a FastAPI-based backend service designed to assess, analyze, and track human well-being and stress levels across 9 dimensions of life. The system integrates standard, validated psychological assessment instruments with a weighted cascade root driver matrix and AI-powered narrative generators (Llama 3.1 via Hugging Face) to deliver hyper-personalized "Insight Reports" and small micro-habit prescriptions.

---

## Project Purpose

LEWIS helps users understand and improve their well-being by:
1. **Multi-Dimensional Assessment**: Measuring emotional, physical, cognitive, social, and financial domains.
2. **Root Cause Analysis**: Computing which dimensions exert the most systemic pressure using a weighted cascade matrix.
3. **AI Narratives**: Generating structured, compassionate, and non-clinical insight summaries.
4. **Behavioral Prescriptions**: Routing users to actionable micro-habits based on their primary root drivers, available time, and environment.

---

## Project Structure

```
lifed-LEWIS/
├── backend/
│   ├── main.py              # FastAPI application, route handlers & Pydantic models
│   ├── scoring.py           # Scoring algorithms for all 9 core and optional scales
│   ├── content.py           # Habit recommendation catalog and routing logic
│   ├── llm.py               # AI narrative generation and Llama-3 integrations
│   ├── tests/
│   │   └── test_scoring.py  # Unit tests for scoring logic
│   ├── .env                 # Environment configurations (HUGGINGFACE_API_KEY, FRONTEND_URL)
│   ├── .env.example         # Example env configuration
│   ├── .gitignore           # Backend file ignore list
│   └── requirements.txt     # Python dependency list
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Frontend screen routing
│   │   ├── screens/         # Interactive UI screens (Pre-stages, Stages 1-10)
│   │   └── store/
│   │       └── useLewisStore.js # State management for assessment responses
│   ├── build_screens.py      # Automated screens build/generator script
│   ├── create_screens.py     # Screens generation template tool
│   ├── standardize_screens.py# Styles/layout standardizer for JSX screens
│   ├── fix_syntax.py         # Syntax fix utility script for JSX styles
│   ├── fix_syntax2.py        # Margin fix utility script for buttons
│   ├── eslint.config.js      # JS lint rules
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite config
│   └── .gitignore            # Frontend file ignore list
└── lewis doc.md             # This documentation file
```

---

## Architecture

### Technology Stack
- **Backend Framework**: FastAPI
- **Web Server**: ASGI-compatible (Uvicorn)
- **Language**: Python 3.7+
- **AI Engine**: meta-llama/Meta-Llama-3.1-8B-Instruct (via Hugging Face Inference API)
- **Frontend Core**: React + Vite (Vanilla CSS styling)
- **State Management**: Zustand (`useLewisStore.js`)

### System Flow

```
┌─────────────────────────────────────────────────────────┐
│                 React Client (Frontend)                 │
│  - Captures 9D inputs, contextual fields, and physical  │
└──────────┬──────────────────────────────────────────────┘
           │
           ▼ POST /assessment/full
┌─────────────────────────────────────────────────────────┐
│               FastAPI Backend (main.py)                 │
│  - Parses & validates payload via Pydantic              │
└──────────┬──────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│               Scoring Engine (scoring.py)               │
│  - Scores scales: WHO-5, PSS-10, UCLA-3, GSE, PROMIS,   │
│    CFPB-5, Diener, INS, SWLS                            │
│  - Inverts stress/loneliness scales for wellness metrics│
│  - Runs Cascade Matrix to select Primary Root Driver    │
└──────────┬──────────────────────────────────────────────┘
           │
           ├─────────────────────────┐
           ▼                         ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│ Content Router       │   │ LLM Narrative (llm.py)       │
│ - Recommends Habit   │   │ - Generates Insight Report   │
│   based on driver,   │   │   (6-Movement layout)        │
│   time & environment │   │ - Enforces Non-Clinical charter│
└──────────┬───────────┘   └─────────┬────────────────────┘
           │                         │
           └────────────┬────────────┘
                        │
                        ▼ JSON Response
┌─────────────────────────────────────────────────────────┐
│ - Wellness/Stress Scores & Selected Root Driver         │
│ - Prescribed Habit & Micro-action steps                 │
│ - Deeply empathetic Llama-3 AI Insight Narrative        │
└─────────────────────────────────────────────────────────┘
```

---

## Assessment Instruments

LEWIS utilizes standard validated scales alongside customized context fields:

### Core Validated Scales
1. **WHO-5 (World Health Organization Well-Being Index)**: Measures overall emotional well-being. (5 items, 0-5 scale. Max Raw: 25. Scaled: Raw * 4).
2. **PSS-10 (Perceived Stress Scale)**: Measures stress load. (10 items, 0-4 scale. Q4, Q5, Q7, Q8 reverse-scored. Max Raw: 40. Normalized: `(Raw/40) * 100`).
3. **UCLA-3 (Three-Item Loneliness Scale)**: Measures social isolation & disconnection. (3 items, 0-2 scale. Max Raw: 6. Normalized: `(Raw/6) * 100`).
4. **GSE (General Self-Efficacy Scale)**: Measures agency and efficacy. (10 items, 0-3 scale. Max Raw: 30. Normalized: `(Raw/30) * 100`).
5. **PROMIS (Meaning and Purpose Scale)**: Measures meaning, purpose, and spiritual outlook. (4 items, 0-4 scale. Max Raw: 16. Normalized: `(Raw/16) * 100`).
6. **CFPB-5 (Consumer Financial Protection Bureau - Well-being Scale)**: Measures financial stress and security. (5 items, 0-4 scale. Scores mapped specifically to identify financial stress points. Max Raw: 20. Normalized: `(Raw/20) * 100`).

### Optional Expanded Scales
7. **Diener Flourishing Scale**: Measures intellectual growth, self-esteem, and relationship quality. (8 items, 1-7 scale. Min Raw: 8, Max Raw: 56. Normalized: `((Raw - 8) / 48) * 100`).
8. **INS (Inclusion of Nature in Self)**: Measures connection to the surrounding environment and nature. (1 item, 1-7 scale. Min Raw: 1, Max Raw: 7. Normalized: `((Raw - 1) / 6) * 100`).
9. **SWLS (Satisfaction with Life Scale)**: Measures cognitive evaluation of life satisfaction. (5 items, 1-7 scale. Min Raw: 5, Max Raw: 35. Normalized: `((Raw - 5) / 30) * 100`).

---

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /`
- **Response**:
  ```json
  {"status": "success", "message": "LEWIS 9D Core Engine is Online"}
  ```

### 2. Quick Pulse Assessment
- **Endpoint**: `POST /pulse/calculate`
- **Description**: Fast check-in evaluating overall well-being band (WHO-5) alongside environment, arrival word, and primary stressors. Automatically uses LLM to generate a warm, concise pulse summary.
- **Request Payload**: See [Data Models](#data-models).
- **Response**:
  ```json
  {
    "status": "success",
    "metrics": {
      "who5_scaled_score": 68,
      "wellbeing_band": "Steady"
    },
    "ai_narrative": "A warm, 1-2 paragraph description that validates your state...",
    "cascade_analysis": {
      "primary_root_driver": "General Stress (Pulse Estimate)"
    },
    "bright_spot": "Overall Adaptability",
    "prescription": {
      "habit_title": "Mindful Check-in",
      "micro_action": "Take a moment to breathe and observe your state."
    },
    "dimensions": {
      "emotional_wellbeing": 68,
      "stress_load": 42,
      "connection_isolation": 37,
      "agency_efficacy": 68,
      "purpose_meaning": 63,
      "financial_stress": 52
    }
  }
  ```

### 3. Full Comprehensive Assessment
- **Endpoint**: `POST /assessment/full`
- **Description**: Receives the complete inputs from all stages (psychological scales + physical context + environmental details). Performs multi-dimensional scoring, selects a root driver and bright spot, and triggers Llama 3.1 to write a multi-stage Insight Report.
- **Request Payload**: See [Data Models](#data-models).
- **Response**:
  ```json
  {
    "status": "success",
    "cascade_analysis": {
      "primary_root_driver": "Stress Load is the primary driver of the current state."
    },
    "bright_spot": "Accomplishment & Agency",
    "ai_narrative": "Detailed 6-Movement Insight Report...",
    "prescription": {
      "habit_title": "Box Breathing Reset",
      "micro_action": "Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 3 times."
    },
    "dimensions": {
      "emotional_wellbeing": 68.0,
      "stress_load": 47.5,
      "connection_isolation": 33.3,
      "agency_efficacy": 80.0,
      "purpose_meaning": 75.0,
      "financial_stress": 40.0
    }
  }
  ```

---

## Response and Scoring Logic

### Scale Normalization
All scale scores are normalized to a consistent `0-100` range to allow comparison across different answer scales (e.g., 0-5, 0-4, 1-7).
- **Inverted Scoring**: For scales measuring negative conditions (stress, isolation, financial stress), the raw values are computed as stress metrics. For the **Bright Spot** analysis, these are inverted: `Wellness Score = 100 - Normalized Score`.

### The Cascade Matrix (Root Driver)
The engine evaluates the primary driver of systemic pressure by applying custom weights based on how different dimensions affect the overall human system:
- **Stress-Driven Impact** = `PSS-10 Normalized * 0.80`
- **Social Isolation Impact** = `UCLA-3 Normalized * 0.85`
- **Financial Stress Impact** = `CFPB-5 Normalized * 0.75`
- **Agency Deficit Impact** = `(100 - GSE Normalized) * 0.70`
- **Purpose Deficit Impact** = `(100 - PROMIS Normalized) * 0.65`
- **Emotional Wellbeing Deficit** = `(100 - WHO-5 Normalized) * 0.50`

The system selects the maximum impact score as the **Primary Root Driver** and matches it to the content router for habit prescription.

---

## AI Narrative System

LEWIS generates summaries using Hugging Face. The engine utilizes meta-llama/Meta-Llama-3.1-8B-Instruct to build the reports.

### Strict Voice & Language Charter
- **Perspective**: Always refer to the user in the second person ("you"). Never use "I" or the system "we".
- **Agentless Description**: Refer to LEWIS in the third person, descriptively only. (e.g. "LEWIS uses, draws on, checks"). Never use mental-state verbs for the system (e.g., "LEWIS thinks you are, believes, knows, notices").
- **Non-Clinical Line**: Do not diagnose, screen, or treat.
- **Banned Lexicon**: Banned words include: *diagnosis, disorder, depression, anxiety, clinical, patient, symptom, treatment, burnout (as a condition), cortisol, hormone, vagal tone*.
- **Compassionate Anchoring**: Always normalize low scores by acknowledging that needing care is a normal part of the human experience.

### 6-Movement Insight Report Structure
For the full assessment, the AI generates an output split into:
1. **The Mirror**: Reflects the user's arrival state and word.
2. **Your Bright Spot**: Focuses on their highest wellness score to foster positive reinforcement.
3. **Your Wellbeing Landscape**: A concise narrative outlining the overall dimension balance.
4. **Your Nervous System & Physicality**: Integrates sleep quality, physical movement, day rhythms, and body map tension zones.
5. **The Connections**: Discusses the root driver hypothesis and links it to identity roles, active pressures, and life stability.
6. **Patterns Worth Noticing**: Surfaces flagged details such as relational guarding, sharing hesitations, or priorities.
7. **Your Path Forward**: A hopeful wrap-up guiding the user to their prescribed small micro-habit.

---

## Data Models

### PulseInput (Pydantic Model)
```json
{
  "who5": [3, 4, 2, 5, 4],
  "life_stability": "moderate",
  "active_pressures": ["work", "family"],
  "priority_rank": ["health", "finances"],
  "arrival_word": "tired"
}
```

### FullAssessmentInput (Pydantic Model)
```json
{
  "who5": [4, 3, 5, 2, 3],
  "pss10": [2, 1, 3, 2, 1, 2, 3, 2, 1, 2],
  "ucla3": [1, 2, 0],
  "gse": [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
  "promis": [4, 3, 4, 3],
  "cfpb5": [2, 1, 3, 2, 1],
  "diener": {"q1": 6, "q2": 5, "q3": 6, "q4": 5, "q5": 6, "q6": 5, "q7": 6, "q8": 7},
  "ins": 5,
  "swls": {"q1": 5, "q2": 6, "q3": 5, "q4": 4, "q5": 5},
  "ageCategory": "25-34",
  "gender": "Non-binary",
  "identityRoles": ["parent", "engineer"],
  "lifeStability": 3,
  "active_pressures": ["work", "time-management"],
  "bodyMovement": "moderate",
  "sleepQuality": "poor",
  "bodyContext": ["neck tension"],
  "relationalContext": "guarded",
  "priority_rank": ["health", "career"],
  "arrival_word": "overwhelmed",
  "financialPulse": {},
  "environmentalPulse": {},
  "intellectualPulse": "seeking learning opportunities",
  "culturalBelonging": {},
  "bodyRhythm": {},
  "bodyMapZones": ["shoulders", "neck"],
  "dayRhythmMap": [1, 2, 1, 0, 1],
  "breathingBefore": "fast",
  "breathingAfter": "calm",
  "nervousSystemState": "activated",
  "body_awareness": "moderate",
  "lifeLandscape": {},
  "adaptiveDeepDives": {},
  "brightSpotCheck": "mindfulness",
  "priorityTensionCheck": "high friction",
  "everydaySharing": {},
  "externalConditions": {},
  "priorAttempts": "tried breathing exercises before",
  "aspirationLandscape": "long term focus",
  "supportPreferences": ["independent"],
  "plannerReadiness": "high",
  "valuesCheck": ["growth", "stability"],
  "financialAspiration": "savings buffer",
  "energyArc": {"morning": "low", "evening": "high"},
  "stressPatternClusters": ["physical stress", "work pressure"],
  "recoveryResponsiveness": "slow",
  "cumulativeLoad": {},
  "soundPreference": "nature sounds",
  "quickChoices": {},
  "max_time_available": 5,
  "current_environment": "Desk",
  "flags": []
}
```

---

## Installation & Setup

### Backend Setup
1. **Create Virtual Environment**:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate # On Windows
   source .venv/bin/activate # On macOS/Linux
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment Variables**:
   Create a `.env` file inside `backend/` with:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```
4. **Run the Server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
5. **Swagger UI**: Visit `http://localhost:8000/docs` to test endpoints.

### Frontend Setup
1. **Install Node Packages**:
   ```bash
   cd frontend
   npm install
   ```
2. **Configure Host**:
   Ensure `vite.config.js` is set to talk to the backend port.
3. **Run Dev Client**:
   ```bash
   npm run dev
   ```

---

## Usage Examples

### Example Curl Request: Full Assessment
```bash
curl -X POST "http://localhost:8000/assessment/full" \
  -H "Content-Type: application/json" \
  -d '{
    "who5": [4, 3, 5, 2, 3],
    "pss10": [2, 1, 3, 2, 1, 2, 3, 2, 1, 2],
    "ucla3": [1, 2, 0],
    "gse": [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
    "promis": [4, 3, 4, 3],
    "cfpb5": [2, 1, 3, 2, 1],
    "max_time_available": 5,
    "current_environment": "Desk"
  }'
```

---

**Last Updated**: July 2026  
**Status**: Active Development  
