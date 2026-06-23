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
├── backend/             # FastAPI backend application (the brain)
│   ├── main.py          # Application configuration, Pydantic models & endpoints
│   ├── scoring.py       # 9D scoring logic & cascade driver engine
│   ├── content.py       # Catalog of habits and routing algorithm
│   └── llm.py           # Groq Llama-3 AI narrative generation wrapper
├── frontend/            # React/Vite web application (user interface)
│   ├── src/             # React source files (App.jsx, pages, components)
│   ├── package.json     # Node.js dependencies and script configuration
│   └── index.html       # SPA HTML entrypoint
├── lewis doc.md         # Project documentation (this file)
├── workflow_uml.md      # UML sequence and activity flow diagrams
└── .venv/               # Python virtual environment (dependencies)
```

### Folder Descriptions

| Directory | Purpose |
|-----------|---------|
| **backend/** | Python backend hosting the FastAPI server, core scoring matrix calculations, and LLM communication |
| **frontend/** | React frontend application serving the 9-Phase check-in wizard and Results page |

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

    subgraph "Phase 1: Input Collection (React Web Frontend)"
        UI[User Interface / Sliders]:::frontend --> |"9D Inputs (WHO-5, PSS-10, UCLA-3, SQI, GSE-10, CFPB-5, Diener, BWI, NHI)"| Gather[Gather Answers & Logistics]:::frontend
        Logistics[Logistics:<br>- Time Available<br>- Current Environment<br>- Arrival Word]:::frontend --> Gather
        Gather -->|"POST /assessment/full (JSON)"| API[FastAPI Endpoint]:::backend
    end

    subgraph "Phase 2: Core Processing & Scoring (FastAPI Backend)"
        API --> |"Pydantic Validation"| Validator[FullAssessmentInput Model]:::backend
        Validator --> Scoring[Scoring & Normalization Engine]:::backend
        
        subgraph "Scoring Metrics (Normalized to 0-100)"
            Scoring --> |"Raw Sum * 4"| WHO5[WHO-5: Wellbeing]:::backend
            Scoring --> |"Reverse Score & Norm"| PSS10[PSS-10: Stress Load]:::backend
            Scoring --> |"Scale Normalization"| Others[UCLA-3, SQI, PAI, FSI, PMI, BWI, NHI]:::backend
        end
        
        WHO5 & PSS10 & Others --> Cascade[9D Cascade Matrix Analysis]:::backend
        
        subgraph "Cascade Calculations"
            Cascade --> Deficit[Wellbeing Deficit = 100 - WHO5]:::backend
            Cascade --> |"Apply Systemic Influence Weights"| Weights["Calculate Pressures:<br>- Stress * 0.80<br>- Sleep * 0.90<br>- Wellbeing Deficit * 0.50<br>- ...others"]:::backend
            Weights --> Max["Find Max Pressure"]:::backend
        end
        
        Max --> |"Primary Root Driver"| Router[Habit Router (route_content)]:::backend
        Router --> |"Filters by Time & Environment"| Prescribe[Selected Micro-Habit]:::backend
    end

    subgraph "Phase 3: AI Narration Generation (llm.py)"
        Max & Prescribe --> |"Diagnostic Package"| Package[JSON Context:<br>- primary_root_driver<br>- prescribed_habit<br>- action_steps]:::backend
        Package --> |"Empathetic System Prompt"| LLM[Groq OpenAI Client]:::ai
        LLM --> |"Model: llama-3.1-8b-instant"| Groq[Generate Empathetic Narrative]:::ai
        Groq --> |"3-4 Warm Sentences"| ResponseBuilder[Build Final API JSON Response]:::backend
    end

    subgraph "Phase 4: Output Rendering (React Web Frontend)"
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

The scoring engine in [scoring.py](file:///e:/lifed-LEWIS%20-%20Copy/backend/scoring.py) processes raw assessment questionnaire answers across 9 health and wellbeing dimensions, normalizes each dimension to a standard 0-100 scale, and computes the primary root driver using a weighted influence cascade matrix.

### 1. WHO-5 (World Health Organization Wellbeing Index)
- **Inputs**: 5 questions, rated 0–5 (where higher indicates better wellbeing).
- **Calculation**:
  1. Sum the 5 raw scores (Max: 25).
  2. Scale to 0-100 by multiplying by 4:
     $$\text{Wellbeing Score} = \text{Raw Sum} \times 4$$
- **Classification Bands**:
  - **70+**: Thriving
  - **55-69**: Steady
  - **40-54**: Stretched
  - **<40**: Asking for care

### 2. PSS-10 (Perceived Stress Scale)
- **Inputs**: 10 questions, rated 0–4 (where higher indicates higher stress).
- **Calculation**:
  1. Reverse-score questions 4, 5, 7, and 8 (indices 3, 4, 6, 7):
     $$\text{Score}_{\text{flipped}} = 4 - \text{Score}_{\text{original}}$$
  2. Sum all raw scores (Max: 40).
  3. Normalize to a 0-100 scale:
     $$\text{Normalized Stress} = \left(\frac{\text{Total Score}}{40}\right) \times 100$$

### 3. UCLA-3 (Loneliness & Connection Index)
- **Inputs**: 3 questions, rated 1–3 (where higher indicates higher isolation).
- **Calculation**:
  1. Sum the 3 raw scores (Range: 3 to 9).
  2. Normalize to a 0-100 scale:
     $$\text{Normalized Loneliness} = \left(\frac{\text{Raw Sum} - 3}{6}\right) \times 100$$

### 4. SQI-4 (Sleep Quality Index)
- **Inputs**: 4 questions, rated 0–3 (where higher indicates worse sleep).
- **Calculation**:
  1. Sum the 4 raw scores (Max: 12).
  2. Normalize to a 0-100 scale:
     $$\text{Normalized Sleep Deficit} = \left(\frac{\text{Raw Sum}}{12}\right) \times 100$$

### 5. Standard 3-Question Scales (PAI, FSI, PMI, BWI, NHI)
Used to calculate scores for the remaining five dimensions: Physical Activity Index (PAI), Financial Stability Index (FSI), Purpose Meaning Index (PMI), Burnout Workload Index (BWI), and Nutrition Hydration Index (NHI).
- **Inputs**: 3 questions, rated 0–4 (where higher indicates worse baseline/higher pressure).
- **Calculation**:
  1. Sum the 3 raw scores (Max: 12).
  2. Normalize to a 0-100 scale:
     $$\text{Normalized Score} = \left(\frac{\text{Raw Sum}}{12}\right) \times 100$$

---

### 6. Cascade Matrix (Root Driver Analysis)
Instead of returning a simple highest score, the core engine runs a weighted cascade matrix in `calculate_root_driver` to determine which dimension causes the most system-wide pressure.

1. **Calculate Wellbeing Deficit**:
   $$\text{Wellbeing Deficit} = 100 - \text{WHO-5 Scaled Score}$$

2. **Compute Pressure Scores**:
   Each normalized score (representing a deficit or load) is multiplied by its systemic influence weight:

   | Dimension | Weight | Meaning / Impact |
   |-----------|--------|------------------|
   | **Chronic Sleep & Recovery Deficit** | `0.90` | High biological impact on systemic baseline |
   | **Social Isolation & Disconnection** | `0.85` | High psychological driver of mental distress |
   | **Burnout & Workload** | `0.85` | High pressure exceeding active recovery capacity |
   | **Stress Load (PSS-10)** | `0.80` | High day-to-day cognitive and emotional impact |
   | **Financial Stress** | `0.75` | High impact on long-term cognitive bandwidth |
   | **Physical Sedentary Behavior** | `0.70` | Moderate biological and baseline impact |
   | **Lack of Purpose/Meaning** | `0.65` | Baseline driver of systemic apathy |
   | **Nutritional/Hydration Deficits** | `0.60` | Lower physical baseline and systemic energy |
   | **Low Emotional Wellbeing** | `0.50` | Feedback loop driver |

3. **Determine Root Driver**:
   The engine evaluates all weighted pressures and returns the text label corresponding to the **maximum calculated pressure value**:
   $$\text{Root Driver} = \operatorname{argmax}(\text{Pressures})$$

---

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
Navigate to the `backend` folder first:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### Interactive API Documentation
FastAPI automatically generates interactive documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

### React Frontend Setup (frontend)

The frontend is built using React, Vite, and modular CSS.

#### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

#### Step 1: Navigate to the Frontend Directory
```bash
cd frontend
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
