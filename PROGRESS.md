# KaalNetra — Development Progress & Roadmap

## Project Overview
**KaalNetra (कालनेत्र — "The Eye of Time")** is an educational historical strategy game and counterfactual sandbox exploring turning points in Indian history.

---

## Phase Status Summary

| Phase | Description | Status | Verification |
|---|---|---|---|
| **Phase 1: Foundation** | React 19, TypeScript, Vite, Tailwind CSS, Phaser 3 | ✅ Complete | Build passes, dev server operational |
| **Phase 2: Scenario Loader** | Typed schema, Chittor 1567 dataset, validation engine | ✅ Complete | Schema validated, 0 errors, non-hardcoded |
| **Phase 3: Simulation Engine** | Pure deterministic rule engine, state clamping, threshold rules, 0 AI dependency | ✅ Complete | 71 deterministic tests passing, 0 randomness |
| **Phase 4: Core Gameplay Flow** | Home → Scenario → Context → Briefing → Decision → Simulation → Outcome | ✅ Complete | Full screen state machine, interactive turns |
| **Phase 5: Timeline & Comparison** | Player Timeline vs Immutable Canonical Timeline, divergence metrics, reflection | ✅ Complete | Side-by-side comparison, causality cards |
| **Phase 6: Visual Polish & Assets** | Authentic portraits, environments, responsive picture element, 0 stretched assets | ✅ Complete | WebP + PNG fallbacks, responsive layout |
| **Phase 7: Source-Grounded AI** | FastAPI Python backend, offline rule-based fallback, Explain My Decision, Q&A | ✅ Complete | 100% grounded in primary sources, zero hallucination |
| **Phase 8: Final QA & Demo Readiness** | Full flow audit, alternate paths, determinism, error recovery, documentation | ✅ Complete | 119/119 Vitest tests passing, production build 1.19s |
| **UI Redesign: Clean Historical Design** | Zero gradients, museum-grade parchment palette (#F7F4EE, #171717, #7A2626), Cormorant Garamond | ✅ Complete | Fully responsive, human-designed, 0 gradients |

---

## Architecture & Design Highlights
- **Deterministic Simulation Core**: Pure TypeScript engine operating on 6 bounded variables (`food`, `water`, `defenders`, `morale`, `fort_integrity`, `siege_progress`).
- **Strict Canon Separation**: Canonical historical data is immutable and never altered by player choices or AI outputs.
- **Source-Grounded AI Layer**: Explanations cite authoritative historians (Abu'l Fazl, Chandra, Somani) and primary manuscripts (V&A Akbarnama). AI is strictly explanatory and optional; the game continues seamlessly offline.
- **Clean Historical Product Design**: Archival parchment aesthetic (`#F7F4EE`), editorial typography (`Cormorant Garamond` + `Inter`), flat surfaces, thin `#D8D2C7` borders, zero neon/gradients, accessible for adults and children alike.
