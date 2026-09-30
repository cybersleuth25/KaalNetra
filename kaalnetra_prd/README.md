# KaalNetra PRD Package

This package is the implementation-ready product specification for **KaalNetra**, an interactive historical simulation game for SIH 26208.

## Core concept
KaalNetra places the player inside a documented historical situation, gives them historically grounded constraints, lets them make counterfactual decisions, simulates the consequences with deterministic rules, and then returns to the documented historical timeline for comparison and explanation.

### Non-negotiable principle
**Canonical history never changes.** Only the player's simulation branches.

## Files
- `docs/MASTER_PRD.md` — complete product requirements document.
- `docs/GAME_LOGIC.md` — deterministic simulation rules, formulas, state transitions, validation rules.
- `docs/HISTORICAL_CANON.md` — history source-of-truth, evidence hierarchy, fact/counterfactual separation.
- `docs/UI_UX_PRD.md` — screen-by-screen UI/UX requirements and demo flow.
- `docs/TECH_ARCHITECTURE.md` — recommended technical architecture and folder structure.
- `docs/ASSET_MANIFEST.md` — exact asset inventory and usage.
- `docs/ANTIGRAVITY_BUILD_PROMPT.md` — staged instructions to give the coding agent.
- `docs/IMPLEMENTATION_CHECKLIST.md` — build checklist for the 24-hour hackathon.
- `schemas/scenario.schema.json` — schema for scenario data.
- `scenario/chittor_1567.json` — initial scenario data skeleton with the first playable loop.

## Recommended implementation stack
- Frontend: React + TypeScript + Vite
- Game/simulation presentation: Phaser 3
- UI: Tailwind CSS
- Backend: FastAPI + SQLite (optional for MVP; local JSON is acceptable)
- Charts: Recharts
- Animation: Framer Motion
- AI: Gemini/Groq/OpenAI only for explanation/reflection, never for simulation state transitions

## Critical build order
1. Scenario JSON
2. Deterministic simulation engine
3. Decision screen
4. Simulation state screen
5. Historical comparison
6. Historical evidence panel
7. Asset integration
8. AI explanation
9. Polish and browser testing

## Historical integrity rule
AI-generated artwork is illustrative. It is **not evidence**. Historical facts must come from curated source material listed in `HISTORICAL_CANON.md`.
