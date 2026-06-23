# LEWIS Core Engine - Workflow UML Diagrams

This document contains formal UML representations of the **LEWIS Core Engine** workflow. It details how inputs are collected, how calculations and matrix diagnostics are processed in the backend, and how AI-driven narration is integrated.

---

## 1. UML Sequence Diagram
This diagram shows the chronological order of interaction and message-passing between the user, the frontend, the FastAPI backend, scoring engine modules, habit routing modules, and the Groq LLM wrapper.

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant FE as React Frontend (frontend)
    participant BE as FastAPI Backend (backend/main.py)
    participant SC as Scoring Engine (backend/scoring.py)
    participant CO as Content Router (backend/content.py)
    participant AI as AI Narration (backend/llm.py)
    participant Groq as Llama-3 API (Groq)

    User->>FE: Fill 9D Sliders & Logistics
    User->>FE: Click "Run My Assessment"
    activate FE
    FE->>BE: HTTP POST /assessment/full (JSON Payload)
    activate BE
    BE->>BE: Validate Payload (FullAssessmentInput)
    
    BE->>SC: calculate_pss10(scores)
    activate SC
    SC-->>BE: Return stress metrics (raw & normalized)
    deactivate SC

    BE->>SC: calculate_ucla3(scores), calculate_sqi(scores), etc.
    activate SC
    SC-->>BE: Return connection, sleep, & standard indices
    deactivate SC

    BE->>SC: calculate_root_driver(who5, pss10, ...)
    activate SC
    Note over SC: Calculates pressure for each dimension.<br>Selects dimension with maximum pressure.
    SC-->>BE: Return primary_root_driver string
    deactivate SC

    BE->>CO: route_content(root_driver, max_time, environment)
    activate CO
    CO-->>BE: Return recommended_habit (title, action_steps)
    deactivate CO

    BE->>AI: generate_user_narrative(diagnostic_package)
    activate AI
    AI->>Groq: Request Chat Completion (empathetic prompt + diagnostic payload)
    activate Groq
    Groq-->>AI: Return empathetic narrative response
    deactivate Groq
    AI-->>BE: Return narrative string
    deactivate AI

    BE-->>FE: HTTP Response 200 OK (JSON with metrics, driver, prescription, & narrative)
    deactivate BE
    FE->>FE: Parse JSON & Render Output
    FE-->>User: Display Personal Narrative, Driver, Habit Card, & 9 Progress Bars
    deactivate FE
```

---

## 2. UML Activity Diagram
This activity diagram models the control flow, decisions, and sequential calculations performed within the engine from start to end.

```mermaid
flowchart TD
    %% Styling
    classDef start_end fill:#333,stroke:#333,stroke-width:2px,color:#fff;
    classDef process fill:#eefaf7,stroke:#00B09B,stroke-width:2px,color:#1a2e30;
    classDef decision fill:#fff9e6,stroke:#F5A623,stroke-width:2px,color:#1a2e30;
    classDef endpoint fill:#f9f5ff,stroke:#9B5DE5,stroke-width:2px,color:#1a2e30;

    Start([Start Check-In]):::start_end --> Init[Input 9D Assessment Scores & Logistics]:::process
    Init --> Submit[Submit to /assessment/full]:::process
    Submit --> Validate{Input Valid?}:::decision
    
    Validate -->|No| Err[Return HTTP 400 Bad Request]:::process
    Err --> End([End]):::start_end
    
    Validate -->|Yes| ScoreAll[Compute Normalized Scores]:::process
    
    subgraph Dimension Calculations
        ScoreAll --> WHO5[WHO-5: sum * 4]:::process
        ScoreAll --> PSS10[PSS-10: apply reverse scoring on indices 3, 4, 6, 7]:::process
        ScoreAll --> Others[Calculate standard 3-question indexes: UCLA-3, SQI, PAI, FSI, PMI, BWI, NHI]:::process
    end

    WHO5 & PSS10 & Others --> Cascade[Compute 9D Cascade Pressures]:::process
    Cascade --> MaxPressure[Determine Primary Root Driver]:::process
    
    MaxPressure --> HabitRoute[Route Habit based on Driver, Time, and Environment]:::process
    
    HabitRoute --> Bundle[Bundle data package: Driver, Habit Title, Action Steps]:::process
    
    Bundle --> LLMCall[Invoke Groq Llama-3 API with Empathetic System Prompt]:::process
    
    LLMCall --> LLMSuccess{API Success?}:::decision
    LLMSuccess -->|Yes| Output[Include Generated Narrative Paragraph]:::process
    LLMSuccess -->|No| Fallback[Include Fallback Error Message]:::process
    
    Output & Fallback --> Compose[Compose Final Response JSON]:::process
    Compose --> Respond[HTTP Response 200 OK]:::process
    Respond --> Render[React Frontend renders components: Personal Narrative, Root Driver, Micro-Prescription, Dimension Progress Bars]:::endpoint
    Render --> End
```
