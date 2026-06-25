# LEWIS — Life Everyday Wellbeing Intelligence System

```
lifed-LEWIS/
├── backend/          ← FastAPI server (Python)
│   ├── main.py       ← API routes
│   ├── scoring.py    ← 9D scoring engine
│   ├── content.py    ← Habit prescription catalog
│   ├── llm.py        ← AI narrative (Groq / LLaMA-3)
│   └── requirements.txt
│
└── frontend/         ← React + Vite app
    ├── src/
    │   ├── stages/   ← Stage0 – Stage10 + Results
    │   ├── components/
    │   ├── store/    ← Zustand global state
    │   └── pages/
    └── package.json
```

## Quick start

**Terminal 1 — Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
