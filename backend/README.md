# LEWIS Backend

FastAPI server — exposes the LEWIS 9D scoring engine and AI narrative generation.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

API docs available at http://127.0.0.1:8000/docs

## Endpoints

| Method | Path                  | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/`                   | Health check                       |
| POST   | `/assessment/full`    | Full 9D score + AI narrative       |
| POST   | `/pulse/calculate`    | Quick WHO-5 pulse check            |

## Files

| File          | Role                                              |
|---------------|---------------------------------------------------|
| `main.py`     | FastAPI app, route handlers, request/response models |
| `scoring.py`  | WHO-5, PSS-10, UCLA-3, SQI, and 9D cascade engine |
| `content.py`  | Habit prescription catalog and routing logic     |
| `llm.py`      | Groq/OpenAI client — generates the AI narrative  |
