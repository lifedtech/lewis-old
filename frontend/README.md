# LEWIS Frontend

React + Vite app — the full 10-stage LEWIS wellbeing assessment UI.

## Setup

```bash
cd frontend
npm install
```

## Dev server

```bash
npm run dev
```

Runs at http://localhost:5173  
Make sure the backend is running on port 8000 first.

## Build

```bash
npm run build
```

Output goes to `frontend/dist/`.

## Stack

- React 19 + Vite
- Framer Motion — animations, gestures, transitions
- Zustand — global state (answers, scores, stage routing)
- Recharts — radar, bar, pie charts on Results page
- CSS Modules — scoped per-component styles

## Stage map

| Stage | Component              | Description                        |
|-------|------------------------|------------------------------------|
| 0     | Stage0_Welcome         | Age gate + welcome sequence        |
| 1     | Stage1_Context         | Name, roles, stability, ranking    |
| 2     | Stage2_Attention       | 45s canvas attention drift task    |
| 3     | Stage3_Somatic         | Affect canvas, body map, breathing |
| 4     | Stage4_Energy          | Energy maze (60s)                  |
| 5     | Stage5_Scales          | Landscape sort + validated scales  |
| 6     | Stage6_Sharing         | Rapid-fire sharing prompts         |
| 7     | Stage7_Habits          | Current habits + support style     |
| 8     | Stage8_Patterns        | Energy arc + stress clusters       |
| 9     | Stage9_Sound           | Sound check + A/B quick choices    |
| 10    | Stage10_Generating     | Animated generating moment         |
| 11    | ResultsStage           | Full 9D report + charts            |
