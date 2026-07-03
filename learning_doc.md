# LEWIS - Developer Learning Guide

Welcome to the **LEWIS Core Engine**! This guide is designed to help you quickly understand the project architecture, tech stack, and how the different pieces fit together so you can start contributing effectively.

## 🌟 1. High-Level Overview
LEWIS (The Lifed Everyday Wellbeing Intelligence System) is a full-stack application that acts as a personalized wellbeing and stress-assessment tool. 
- It assesses users across 9 life dimensions (emotional, physical, financial, etc.).
- It uses a custom **Cascade Matrix** to determine the user's primary "root driver" of stress.
- It leverages an **AI Narrative Engine** (Llama 3.1 via Hugging Face) to provide deeply empathetic, non-clinical insight reports.
- It recommends actionable micro-habits based on the user's available time and environment.

## 🛠️ 2. Tech Stack
**Frontend:**
- **React & Vite:** Fast frontend rendering and bundling.
- **Framer Motion:** Used heavily for interactive, smooth, and calming UI animations.
- **Zustand:** (`useLewisStore.js`) Handles global state management to collect answers across multiple assessment stages without complex prop-drilling.
- **Vanilla CSS:** Custom styling (`index.css`) focused on modern, dark-mode-first aesthetics.

**Backend:**
- **FastAPI (Python):** High-performance backend framework serving REST APIs.
- **Pydantic:** Validates incoming JSON payloads and enforces strict data models.
- **Uvicorn:** ASGI server running the FastAPI app.
- **OpenAI SDK / Hugging Face:** Used in `llm.py` to generate AI narratives.

## 📂 3. Codebase Structure Walkthrough

### Frontend (`/frontend`)
The frontend is structured as a series of progressive "Stages". 
- **`src/App.jsx`**: The main router. It conditionally renders different screens based on the `currentScreen` state stored in Zustand.
- **`src/screens/`**: Contains all the interactive UI screens (e.g., `Stage1_1ArrivalScreen.jsx`, `Stage4MazeScreen.jsx`).
- **`src/store/useLewisStore.js`**: The central brain of the frontend. It holds all user responses (e.g., `who5` scores, `pss10` scores, `arrival_word`) and handles the API call to the backend when the assessment is complete.

### Backend (`/backend`)
- **`main.py`**: Contains the API endpoints (`/pulse/calculate` and `/assessment/full`). It acts as the traffic controller, taking frontend data, sending it to the scoring engine, and returning the final payload.
- **`scoring.py`**: The math engine. It normalizes scores from various psychological scales (WHO-5, PSS-10, etc.) to a 0-100 range and runs the "Cascade Matrix" to find the user's primary stress driver.
- **`content.py`**: The recommendation engine. It maps the root driver to specific micro-habits depending on user context.
- **`llm.py`**: The AI engine. Contains the strict system prompts used to generate the 6-movement insight reports while adhering to a non-clinical, compassionate voice.

## 🧠 4. Core Mechanics: How an Assessment Works

1. **Data Collection (Frontend):** The user progresses through various interactive screens. Each screen saves data to the Zustand store (`setProfileField`).
2. **Submission:** On the final screen, the frontend sends a giant JSON payload containing all answers to `POST /assessment/full`.
3. **Scoring (Backend):** `main.py` receives the payload and passes it to `scoring.py`. 
4. **Analysis (Backend):** The backend identifies the highest priority issue (Root Driver) and the strongest positive area (Bright Spot).
5. **AI Generation (Backend):** The scored data is sent to the LLM (`llm.py`) to generate a personalized, empathetic narrative.
6. **Response:** The backend returns the scores, the AI narrative, and the recommended habit back to the frontend to be displayed.

## 🚀 5. Getting Started Locally

**Backend:**
1. Navigate to `backend/`.
2. Activate your virtual environment (`.venv\Scripts\activate` or `source .venv/bin/activate`).
3. Set your API keys in the `.env` file (e.g., `HUGGINGFACE_API_KEY`).
4. Run the server: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`.

**Frontend:**
1. Navigate to `frontend/`.
2. Run `npm install` (if you haven't already).
3. Run `npm run dev` to start the Vite server (usually on `localhost:5173`).

## 💡 6. Key Development Rules to Remember
- **Do not diagnose:** When working on the AI prompts in `llm.py`, remember the strict non-clinical charter. Never use words like "patient", "diagnose", or "treatment".
- **Agentless AI:** The AI should never refer to itself as "I" or "we". 
- **Animations matter:** The UI is designed to be calming. When building new screens, ensure you wrap elements in `framer-motion` (`<motion.div>`) with appropriate enter/exit transitions.
