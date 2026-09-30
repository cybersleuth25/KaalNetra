# KaalNetra — Antigravity Master Build Prompt

You are the lead engineer implementing KaalNetra, a 24-hour hackathon web game.

## Goal
Build a polished playable MVP of a historical simulation called KaalNetra.

## Read first
1. `docs/MASTER_PRD.md`
2. `docs/GAME_LOGIC.md`
3. `docs/HISTORICAL_CANON.md`
4. `docs/UI_UX_PRD.md`
5. `docs/TECH_ARCHITECTURE.md`
6. `docs/ASSET_MANIFEST.md`
7. `scenario/chittor_1567.json`
8. `schemas/scenario.schema.json`

Do not change the product concept or historical integrity rules without an explicit request.

---

## Phase 1 — Project setup

Create:
- React + TypeScript + Vite frontend.
- Tailwind CSS.
- Phaser 3.
- Framer Motion if needed.
- Python FastAPI backend only if necessary.

Make the frontend runnable immediately.

Do not add unnecessary packages.

---

## Phase 2 — Scenario loader

Load `scenario/chittor_1567.json`.
Validate it against the JSON schema.
Display the scenario context from data rather than hard-coding it in components.

---

## Phase 3 — Deterministic simulation engine

Implement the exact state variables and rules in `docs/GAME_LOGIC.md`.

Rules:
- No LLM inside the state transition logic.
- No random state changes in MVP.
- Clamp every value.
- Record every decision and delta.
- Generate timeline events.

Add unit tests for core rules.

---

## Phase 4 — Game flow

Implement these stages:

`HOME`
→ `SCENARIO`
→ `CONTEXT`
→ `BRIEFING`
→ `DECISION_1`
→ `SIMULATION_1`
→ `DECISION_2`
→ `OUTCOME`
→ `COMPARE`
→ `REFLECTION`

Use a central stage controller so navigation cannot accidentally bypass required history/simulation steps.

---

## Phase 5 — UI

Build a premium historical-game interface.

Use:
- sandstone/parchment neutrals;
- maroon defensive accents;
- emerald/Mughal accents;
- gold as highlight;
- serif display headings;
- readable sans-serif body text.

Avoid clutter.

---

## Phase 6 — Asset integration

The project assets will be placed in the appropriate asset folders.

Do not assume filenames if they exist under different names. Inspect the folder first.

Use:
- Jaimal
- Patta
- Udai Singh II
- Akbar
- Mirza Yusuf
- Resource Steward
- Chittor overview
- fort interior
- fort walls
- siege camp
- strategic map

Do not invent additional assets unless necessary.

---

## Phase 7 — Comparison screen

This is the most important screen.

Implement:
- two parallel timelines;
- visible divergence node;
- causal links;
- simulation badge;
- historical record badge;
- evidence drawer;
- 3 largest differences.

The player must immediately understand that one side is the historical record and the other is a simulation.

---

## Phase 8 — Historical evidence

For historical claims, use only the curated content in `docs/HISTORICAL_CANON.md` and scenario data.

Never invent sources.

Do not present generated dialogue as a historical quote.

---

## Phase 9 — AI reflection (optional feature flag)

Implement only after the core simulation works.

The AI receives curated scenario context and player results.

It may explain:
- what happened in the player's simulation;
- relevant historical constraints;
- why the two timelines differ.

It must not:
- change simulation state;
- invent historical facts;
- invent quotations.

If no AI API key is present, the game must still function using authored fallback explanations.

---

## Phase 10 — QA

Test:
- fresh load;
- scenario loading;
- each decision option;
- state changes;
- threshold rules;
- timeline generation;
- reset/replay;
- comparison screen;
- evidence drawer;
- mobile/tablet/desktop layouts;
- missing AI key fallback;
- broken image fallback.

Run the app in the browser.

Fix all console errors that are caused by the implementation.

---

## Demo acceptance test

A judge should be able to:
1. start the scenario;
2. understand the historical setup;
3. make a decision;
4. observe state changes;
5. make a second decision;
6. see a counterfactual outcome;
7. compare with canonical history;
8. open evidence explaining at least one historical claim.

That complete flow is the MVP definition of done.
