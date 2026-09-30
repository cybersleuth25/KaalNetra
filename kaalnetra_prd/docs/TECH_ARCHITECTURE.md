# KaalNetra — Technical Architecture

## 1. Recommended Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Phaser 3
- Framer Motion
- Recharts

### Backend
- FastAPI
- Python 3.12+
- SQLite

### Storage
MVP can function entirely from JSON files and localStorage. Backend persistence is optional.

### AI
Use a provider available to the team. The provider can be Gemini, Groq or OpenAI.

AI is an explanation layer, not part of the deterministic simulation core.

---

## 2. Architecture

```text
                    ┌───────────────────────┐
                    │      React UI         │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │ Simulation Controller │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │ Deterministic Engine  │
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼────────────────────┐
          ▼                     ▼                    ▼
   Scenario Data          Rule Definitions      Timeline Store
       JSON                    JSON                   RAM
          │
          ▼
   Historical Canon
          │
          ▼
   Evidence Metadata

Optional side service:

React → FastAPI → AI Provider
             ↓
      curated scenario context only
```

---

## 3. Folder Structure

```text
kaalnetra/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── game/
│   │   ├── simulation/
│   │   ├── timeline/
│   │   ├── data/
│   │   └── assets/
│   └── public/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
├── scenario/
│   └── chittor_1567.json
├── schemas/
│   └── scenario.schema.json
├── docs/
└── tests/
```

---

## 4. Frontend State

Recommended store:
- React Context for small MVP, or Zustand if already familiar.

Required slices:
- scenario
- gameState
- decisionHistory
- timeline
- uiStage

Do not over-engineer state management.

---

## 5. Game Engine API

```ts
loadScenario(scenario): void
startSimulation(): GameState
getAvailableDecisions(): Choice[]
applyChoice(choiceId: string): TurnResult
getTimeline(): TimelineEvent[]
getComparison(): ComparisonModel
reset(): void
```

---

## 6. Scenario Data Model

Scenario must be content-driven.

It contains:
- metadata
- historical context
- actors
- starting state
- decision points
- rules
- canonical timeline
- evidence
- reflection prompts

See `schemas/scenario.schema.json`.

---

## 7. Phaser Usage

Use Phaser only where interactive scene rendering materially helps.

Suggested Phaser responsibilities:
- map scene
- lightweight environmental animation
- simple event transitions
- character position / scene composition

React responsibilities:
- menus
- decision cards
- state dashboard
- comparison view
- evidence drawer
- AI reflection

Do not force the entire UI into Phaser.

---

## 8. Backend Endpoints

MVP optional endpoints:

```text
GET /api/scenarios/chittor_1567
POST /api/reflection/explain
POST /api/session/save
```

The simulation engine may remain client-side for hackathon simplicity.

---

## 9. AI Endpoint Contract

Input:
```json
{
  "scenario_id": "chittor_1567",
  "player_choices": ["decision_1_c", "decision_2_a"],
  "final_state": {},
  "relevant_events": [],
  "historical_context": [],
  "source_notes": []
}
```

Output:
```json
{
  "simulation_explanation": "...",
  "historical_context": "...",
  "difference": "...",
  "source_notes": ["..."],
  "warnings": []
}
```

The frontend should sanitize and label AI text as generated explanation.

---

## 10. Security / Reliability

- API keys must never be stored in frontend source.
- No secrets in Git.
- Validate scenario JSON before loading.
- Validate choice IDs against allowed scenario data.
- Never trust client-provided state on a server endpoint without validation.

---

## 11. Deployment

Suggested:
- Frontend → Vercel
- Optional FastAPI backend → Render / Railway / equivalent

But a static frontend-only demo is acceptable if the team needs maximum reliability.
