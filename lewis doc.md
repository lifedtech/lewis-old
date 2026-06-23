# LEWIS Core Engine - Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Purpose](#project-purpose)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Assessment Instruments](#assessment-instruments)
6. [API Endpoints](#api-endpoints)
7. [Response Generation Logic](#response-generation-logic)
8. [Data Models](#data-models)
9. [Installation & Setup](#installation--setup)
10. [Usage Examples](#usage-examples)

---

## Overview

**LEWIS Core Engine** is a FastAPI-based backend service designed to assess and analyze human well-being and stress levels. The system uses validated psychological assessment instruments (WHO-5 and PSS-10) to provide comprehensive insights into a person's emotional well-being and stress load.

The engine generates intelligent cascade analysis to identify whether stress or poor well-being is the primary driver of a person's current state, enabling better-targeted interventions.

---

## Project Purpose

The LEWIS platform helps users understand their well-being status across multiple dimensions:
- **Emotional Well-being** - measured using WHO-5 (World Health Organization Well-Being Index)
- **Stress Load** - measured using PSS-10 (Perceived Stress Scale)
- **Root Cause Analysis** - cascade matrix to identify primary drivers

The goal is to provide actionable insights for personal health tracking, coaching, and intervention planning.

---

## Project Structure

```
lifed-LEWIS/
├── main.py              # FastAPI application & endpoint definitions
├── scoring.py           # Psychological assessment scoring algorithms
├── content.py           # Content database and micro-habit routing
├── llm.py               # AI narration client wrapper (Groq/OpenAI)
├── lewis doc.md         # Project documentation (this file)
├── lewis-ui/            # React/Vite web application (frontend)
│   ├── src/             # Frontend React source code
│   │   ├── pages/       # Phase-based multi-step form pages & Results
│   │   ├── components/  # Reusable React components (e.g. ProgressBar)
│   │   └── App.jsx      # Main layout and step state router
│   ├── package.json     # Node dependencies & run scripts
│   └── index.html       # Single-page app HTML template
└── .venv/               # Python virtual environment (dependencies)
```

### File Descriptions

| File / Directory | Purpose |
|------------------|---------|
| **main.py** | Core application entry point containing FastAPI configuration, Pydantic inputs, and handler functions |
| **scoring.py** | Scoring and normalization logic for 9 dimensions and cascade root driver calculation |
| **content.py** | Library of micro-habits and routing based on the primary root driver, time, and environment |
| **llm.py** | Empathetic narrative generation wrapper querying Groq Llama-3 API |
| **lewis-ui/** | User interface built using React, Vite, and modular CSS styling |

---

## Architecture

### Technology Stack
- **Framework**: FastAPI (modern Python web framework)
- **Server**: ASGI-compatible (can run with Uvicorn)
- **Language**: Python 3.7+
- **Key Dependencies**: fastapi, pydantic, cors middleware

### System Flow

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#eefaf7,stroke:#00B09B,stroke-width:2px,color:#1a2e30;
    classDef backend fill:#fdfcf7,stroke:#78C652,stroke-width:2px,color:#1a2e30;
    classDef ai fill:#f2f5fa,stroke:#4A90E2,stroke-width:2px,color:#1a2e30;
    classDef output fill:#f9f5ff,stroke:#9B5DE5,stroke-width:2px,color:#1a2e30;

    subgraph Phase 1: Input Collection (React Web Frontend)
        UI[User Interface / Sliders]:::frontend --> |"9D Inputs (WHO-5, PSS-10, UCLA-3, SQI, GSE-10, CFPB-5, Diener, BWI, NHI)"| Gather[Gather Answers & Logistics]:::frontend
        Logistics[Logistics:<br>- Time Available<br>- Current Environment<br>- Arrival Word]:::frontend --> Gather
        Gather -->|"POST /assessment/full (JSON)"| API[FastAPI Endpoint]:::backend
    end

    subgraph Phase 2: Core Processing & Scoring (FastAPI Backend)
        API --> |"Pydantic Validation"| Validator[FullAssessmentInput Model]:::backend
        Validator --> Scoring[Scoring & Normalization Engine]:::backend
        
        subgraph Scoring Metrics (Normalized to 0-100)
            Scoring --> |"Raw Sum * 4"| WHO5[WHO-5: Wellbeing]:::backend
            Scoring --> |"Reverse Score & Norm"| PSS10[PSS-10: Stress Load]:::backend
            Scoring --> |"Scale Normalization"| Others[UCLA-3, SQI, PAI, FSI, PMI, BWI, NHI]:::backend
        end
        
        WHO5 & PSS10 & Others --> Cascade[9D Cascade Matrix Analysis]:::backend
        
        subgraph Cascade Calculations
            Cascade --> Deficit[Wellbeing Deficit = 100 - WHO5]:::backend
            Cascade --> |"Apply Systemic Influence Weights"| Weights["Calculate Pressures:<br>- Stress * 0.80<br>- Sleep * 0.90<br>- Wellbeing Deficit * 0.50<br>- ...others"]:::backend
            Weights --> Max["Find Max Pressure"]:::backend
        end
        
        Max --> |"Primary Root Driver"| Router[Habit Router (route_content)]:::backend
        Router --> |"Filters by Time & Environment"| Prescribe[Selected Micro-Habit]:::backend
    end

    subgraph Phase 3: AI Narration Generation (llm.py)
        Max & Prescribe --> |"Diagnostic Package"| Package[JSON Context:<br>- primary_root_driver<br>- prescribed_habit<br>- action_steps]:::backend
        Package --> |"Empathetic System Prompt"| LLM[Groq OpenAI Client]:::ai
        LLM --> |"Model: llama-3.1-8b-instant"| Groq[Generate Empathetic Narrative]:::ai
        Groq --> |"3-4 Warm Sentences"| ResponseBuilder[Build Final API JSON Response]:::backend
    end

    subgraph Phase 4: Output Rendering (React Web Frontend)
        ResponseBuilder --> |"HTTP Response (JSON)"| UI_Display[UI Rendering]:::output
        UI_Display --> |"Empathetic Paragraph"| DisplayNarrative[Personal Narrative Card]:::output
        UI_Display --> |"Linear Gradient Banner"| DisplayDriver[Primary Root Driver Card]:::output
        UI_Display --> |"Action Steps Info Box"| DisplayHabit[Micro-Habit Prescription Card]:::output
        UI_Display --> |"Progress Bars (0-100)"| DisplayScores[9 Dimension Scores Progress Bars]:::output
    end
```

---

## Assessment Instruments

### 1. WHO-5 (World Health Organization Well-Being Index)

**What It Measures**: Emotional well-being and quality of life

**Format**:
- 5 questions/scores
- Each score: **0-5 scale**
- Higher score = Better well-being

**Scoring**:
- Raw sum of 5 scores (max 25)
- Scaled score = Raw sum × 4 (converts to 0-100 scale)
- **Bands**:
  - **70+**: Thriving
  - **55-69**: Steady
  - **40-54**: Stretched
  - **<40**: Asking for care

### 2. PSS-10 (Perceived Stress Scale)

**What It Measures**: Perceived stress and stress load

**Format**:
- 10 questions/scores
- Each score: **0-4 scale**
- Questions 4, 5, 7, 8 are reverse-scored
- Higher score = Higher stress

**Scoring**:
- Reverse-scoring (0→4, 1→3, 2→2, 3→1, 4→0) for questions 4, 5, 7, 8
- Raw sum of all scores (max 40)
- Normalized score = (Raw sum / 40) × 100 (converts to 0-100 scale)

**Formula**:
```
Total Score = Sum of all scores with reverse-scoring applied
Normalized Score = (Total Score / 40) × 100
```

---

## API Endpoints

### 1. Health Check
**Endpoint**: `GET /`

**Response**:
```json
{
  "status": "success",
  "message": "LEWIS Core Engine is Online"
}
```

**Purpose**: Verify that the API is running and accessible.

---

### 2. Quick Pulse Assessment
**Endpoint**: `POST /pulse/calculate`

**Request Payload**:
```json
{
  "who5": [4, 3, 5, 2, 3],
  "life_stability": "moderate",
  "active_pressures": ["work", "family"],
  "priority_rank": ["health", "career"],
  "arrival_word": "exhausted"
}
```

**Request Validation**:
- `who5`: Must be exactly 5 scores
- Each score: Must be between 0-5

**Response**:
```json
{
  "status": "success",
  "metrics": {
    "who5_scaled_score": 68,
    "wellbeing_band": "Steady"
  }
}
```

**Purpose**: Quick assessment focusing on emotional well-being. Returns scaled WHO-5 score and well-being classification band.

---

### 3. Full Comprehensive Assessment
**Endpoint**: `POST /assessment/full`

**Request Payload**:
```json
{
  "who5": [4, 3, 5, 2, 3],
  "pss10": [2, 1, 3, 2, 1, 2, 3, 2, 1, 2]
}
```

**Request Validation**:
- `who5`: Must be exactly 5 scores (0-5)
- `pss10`: Must be exactly 10 scores (0-4)

**Response**:
```json
{
  "status": "success",
  "cascade_analysis": {
    "primary_root_driver": "Stress Load is the primary driver of current state."
  },
  "dimensions": {
    "emotional_wellbeing": {
      "instrument": "WHO-5",
      "normalized_score": 68
    },
    "stress_load": {
      "instrument": "PSS-10",
      "raw_score": 19,
      "normalized_score": 47.5
    }
  }
}
```

**Purpose**: Comprehensive assessment combining WHO-5 and PSS-10 with cascade analysis to identify whether stress or poor well-being is driving the person's current state.

---

## Response Generation Logic

### WHO-5 Score Calculation

```
Step 1: Sum the 5 scores
  Raw Sum = score1 + score2 + score3 + score4 + score5
  Example: 4 + 3 + 5 + 2 + 3 = 17

Step 2: Scale to 0-100
  Scaled Score = Raw Sum × 4
  Example: 17 × 4 = 68

Step 3: Classify into Well-being Band
  if Scaled Score >= 70    → "Thriving"
  if Scaled Score >= 55    → "Steady"
  if Scaled Score >= 40    → "Stretched"
  else                     → "Asking for care"
  
  Example: 68 → "Steady"
```

### PSS-10 Score Calculation

```
Step 1: Identify questions to reverse (4, 5, 7, 8)
  These are array indices: 3, 4, 6, 7

Step 2: Apply reverse scoring
  For indices [3, 4, 6, 7]:
    Flipped Score = 4 - Original Score
  For other indices:
    Keep original score

Example input: [2, 1, 3, 2, 1, 2, 3, 2, 1, 2]
After reverse-scoring:
  Index 0: 2 (no flip)
  Index 1: 1 (no flip)
  Index 2: 3 (no flip)
  Index 3: 4-2 = 2 (flip)
  Index 4: 4-1 = 3 (flip)
  Index 5: 2 (no flip)
  Index 6: 4-3 = 1 (flip)
  Index 7: 4-2 = 2 (flip)
  Index 8: 1 (no flip)
  Index 9: 2 (no flip)
  
Step 3: Sum all scores
  Total Raw Score = 2 + 1 + 3 + 2 + 3 + 2 + 1 + 2 + 1 + 2 = 19

Step 4: Normalize to 0-100 scale
  Normalized Score = (Total Score / 40) × 100
  Example: (19 / 40) × 100 = 47.5
```

### Cascade Matrix (Root Driver Analysis)

The cascade matrix determines whether **stress is driving low well-being** or **low well-being is exacerbating stress**.

```
Step 1: Calculate Well-being Deficit
  Wellbeing Deficit = 100 - WHO5_Scaled_Score
  Example: 100 - 68 = 32

Step 2: Define Influence Weights
  Weight Stress→Wellbeing = 0.8 (stress has high impact on well-being)
  Weight Wellbeing→Stress = 0.5 (poor well-being moderately increases stress)

Step 3: Calculate Cascade Pressures
  Stress-Driven Pressure = PSS10_Normalized × Weight_Stress_on_Wellbeing
  Example: 47.5 × 0.8 = 38

  Wellbeing-Driven Pressure = Wellbeing_Deficit × Weight_Wellbeing_on_Stress
  Example: 32 × 0.5 = 16

Step 4: Determine Root Driver
  if Stress-Driven Pressure > Wellbeing-Driven Pressure:
    → "Stress Load is the primary driver of current state."
  
  elif Wellbeing-Driven Pressure > Stress-Driven Pressure:
    → "Low Emotional Wellbeing is exacerbating stress."
  
  else:
    → "Co-occurring dimensions (Feedback Loop)."
  
  Example: 38 > 16 → "Stress Load is the primary driver"
```

---

## Data Models

### PulseInput Model
Used for `/pulse/calculate` endpoint

```python
{
  "who5": [int, int, int, int, int],           # 5 scores, 0-5 each
  "life_stability": str,                        # e.g., "stable", "moderate", "unstable"
  "active_pressures": [str, ...],               # e.g., ["work", "family", "health"]
  "priority_rank": [str, ...],                  # e.g., ["health", "career", "relationships"]
  "arrival_word": str (optional)                # e.g., "exhausted", "overwhelmed"
}
```

### FullAssessmentInput Model
Used for `/assessment/full` endpoint

```python
{
  "who5": [int, int, int, int, int],           # 5 scores, 0-5 each
  "pss10": [int, int, ..., int]                # 10 scores, 0-4 each
}
```

---

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Step 1: Create Virtual Environment
```bash
python -m venv .venv
```

### Step 2: Activate Virtual Environment

**On Windows**:
```bash
.venv\Scripts\activate
```

**On macOS/Linux**:
```bash
source .venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install fastapi uvicorn pydantic python-multipart
```

### Step 4: Run the Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### Interactive API Documentation
FastAPI automatically generates interactive documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

### React Frontend Setup (lewis-ui)

The frontend is built using React, Vite, and modular CSS.

#### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

#### Step 1: Navigate to the Frontend Directory
```bash
cd lewis-ui
```

#### Step 2: Install Node Dependencies
```bash
npm install
```

#### Step 3: Run the Development Server
```bash
npm run dev
```

The frontend application will be hosted at `http://localhost:5173`. Make sure the FastAPI backend is running simultaneously on `http://localhost:8000` for API request routing.

---

## Usage Examples

### Example 1: Quick Pulse Check
```bash
curl -X POST "http://localhost:8000/pulse/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "who5": [4, 3, 5, 2, 3],
    "life_stability": "moderate",
    "active_pressures": ["work"],
    "priority_rank": ["health"],
    "arrival_word": "tired"
  }'
```

### Example 2: Full Assessment
```bash
curl -X POST "http://localhost:8000/assessment/full" \
  -H "Content-Type: application/json" \
  -d '{
    "who5": [4, 3, 5, 2, 3],
    "pss10": [2, 1, 3, 2, 1, 2, 3, 2, 1, 2]
  }'
```

### Example 3: Health Check
```bash
curl "http://localhost:8000/"
```

---

## Key Features

✅ **Validated Instruments**: Uses WHO-5 and PSS-10, recognized psychological assessment tools  
✅ **Intelligent Analysis**: Cascade matrix determines causality between stress and well-being  
✅ **Normalized Scoring**: All metrics converted to 0-100 scale for consistency  
✅ **CORS Enabled**: Can be called from any frontend domain  
✅ **Interactive Docs**: Swagger UI for easy testing  
✅ **Type-Safe**: Pydantic models ensure data validation  

---

## Notes

- All scores are normalized to 0-100 scale for consistency across instruments
- Reverse-scoring on PSS-10 is applied automatically
- The cascade matrix uses weighted influence calculation to determine root drivers
- CORS is enabled for cross-origin requests from frontend applications

---

## Future Enhancements

- Database integration for score history
- Longitudinal trend analysis
- Personalized recommendations based on root driver
- Multi-language support for assessment instruments
- Integration with external health APIs
- User authentication and profile management

---

**Last Updated**: June 2026
**Status**: Active Development
