# KaalNetra — Master Product Requirements Document

## 1. Product Overview

### Product name
**KaalNetra**

### One-line pitch
> KaalNetra lets students make different decisions during real historical events, experience simulated consequences, and compare their alternate timeline with what actually happened—without changing the historical record.

### Tagline
**Change the decision. Experience the consequence. Remember what really happened.**

### Product type
Interactive historical simulation / serious game / experiential learning web application.

### Target
24-hour hackathon MVP for SIH 26208, with an architecture that can later support additional historical scenarios.

---

## 2. Problem

Traditional history learning often presents an event as a fixed sequence of facts. Learners can remember dates and names without understanding the constraints, trade-offs and causal relationships behind historical decisions.

KaalNetra changes the learning interaction from:

`Read → Memorize → Answer`

to:

`Understand → Decide → Experience consequences → Compare with history → Reflect`

---

## 3. Core Innovation

KaalNetra is a **constrained counterfactual learning system**.

It combines:
1. Historical canon.
2. Historically grounded constraints.
3. Player agency at decision points.
4. Deterministic state-based simulation.
5. Branching counterfactual timelines.
6. Comparison against the canonical timeline.
7. Evidence-backed historical explanation.

The innovation is **not** “AI-generated history” and not ordinary branching fiction.

---

## 4. Product Principles

### P1 — Canonical history is immutable
The documented historical outcome is stored as a fixed canonical timeline.

### P2 — Simulation is explicitly counterfactual
Every non-historical player result is labeled as a simulation or hypothetical outcome.

### P3 — No invented historical quotations
Original game dialogue must never be presented as a verbatim quote from a historical figure unless sourced and explicitly cited.

### P4 — Deterministic core
The same starting state + same choices should produce the same simulation outcome in the MVP.

### P5 — AI explains, not decides
The simulation engine, historical facts and causal rules are authored data/rules. An LLM can explain these but cannot silently alter them.

### P6 — Constraints matter
Choices are limited by resources, technology, geography, institutions, information availability and other historically grounded constraints.

### P7 — Evidence is visible
Important historical claims have an Evidence panel containing source, claim and note/caveat.

---

## 5. User Role

The player is **not** Jaimal, Patta, Akbar or Udai Singh II.

The player acts as a **Defender's Council decision-maker operating within the defensive command structure of Chittor**.

Reason: this permits counterfactual decisions without pretending that the historical figures made game-menu choices which are not documented.

Named characters serve as advisers, narrators, commanders or historical anchors.

---

## 6. MVP Scenario

### Scenario 1
**The Siege of Chittor — 1567–1568**

### MVP scope
- 1 historical scenario.
- 2 major decision points.
- 5–7 simulation variables.
- 3–5 turns total.
- 6 character assets.
- 4 environment assets.
- 1 strategic map.
- 1 final historical-comparison screen.
- Optional AI explanation.

### Estimated player session
5–10 minutes.

---

## 7. Core Gameplay Loop

```text
Historical Context
      ↓
Defender Briefing
      ↓
Decision Point 1
      ↓
Simulation Turn(s)
      ↓
Consequences
      ↓
Decision Point 2
      ↓
Simulation Resolution
      ↓
Your Timeline
      ↓
Canonical Historical Timeline
      ↓
Why They Differ
      ↓
Reflection
```

---

## 8. Scenario Flow

### Screen 1 — Home
Purpose: establish identity and explain the concept.

Key copy:
> History is fixed. Your decisions are not.

CTA:
> Enter Chittor

---

### Screen 2 — Scenario Introduction
Show date, location, parties and a short context block.

Display:
- Chittor / Mewar.
- Mughal siege.
- 1567–1568.
- Named historical figures.
- “Historical Record” badge.

---

### Screen 3 — Historical Context
Present only curated facts.

Sections:
- What was happening?
- Who was involved?
- What resources and technology were available?
- What is known vs uncertain?

Include Evidence buttons.

---

### Screen 4 — Defender Briefing
Jaimal or the council context presents the situation.

Important: dialogue is written for the game; it is not a historical quotation unless sourced.

---

### Screen 5 — Decision Point 1
The player chooses how to respond to an advancing Mughal siege operation.

Decision categories should include historically plausible strategic priorities rather than “correct answer” trivia.

Example options:
- Concentrate defenders against siege works.
- Preserve manpower and reinforce threatened positions.
- Conduct a limited sortie.
- Conserve strength for a prolonged siege.

Each option must have authored effects across multiple state variables.

---

### Screen 6 — Simulation Turn
Animate a short state transition.

Display:
- Food
- Water
- Defenders
- Morale
- Fort Integrity
- Siege Progress

Show `previous → change → new value`.

Example:
> Fort Integrity 82 → -6 → 76

Never display a hidden mathematical formula to the player.

---

### Screen 7 — Decision Point 2
Historical situation has deteriorated or evolved.

Example:
> A breach has appeared in a defensive sector. Your remaining forces and supplies are limited.

Choices again modify several state variables.

---

### Screen 8 — Outcome
Summarize the player's counterfactual path.

Use explicit label:
> **SIMULATION RESULT — NOT THE HISTORICAL RECORD**

Display final state and major causes.

---

### Screen 9 — Timeline Comparison
Primary wow screen.

Left: `YOUR SIMULATION`
Right: `CANONICAL HISTORY`

Both timelines begin from the same historical starting point and diverge at the first decision.

The player can inspect each divergence event.

---

### Screen 10 — Why Different?
Explain differences using curated historical constraints.

Three explanation layers:
1. Historical fact.
2. Simulation rule.
3. Interpretation/learning lesson.

Example:
> Historical fact: Mughal forces used covered approaches and mining during the siege.
>
> Simulation rule: repeated investment in siege engineering increases siege progress.
>
> Learning lesson: defensive decisions had to account for both immediate pressure and sustained siege capability.

---

### Screen 11 — Reflection / AI Guide (Optional)
Prompt:
> Why do you think your outcome diverged from history?

Suggested buttons:
- Explain my biggest decision.
- Explain a historical constraint.
- Why was the historical path different?

AI responses must be grounded in scenario data and source-backed notes.

---

## 9. Character System

### Character roster
1. Rao Jaimal Rathore — documented historical figure, principal defender/commander.
2. Patta Chundawat — documented historical figure, principal defender/commander.
3. Rana Udai Singh II — documented ruler of Mewar during the siege.
4. Emperor Akbar — documented Mughal emperor and leader of the campaign.
5. Mirza Yusuf — fictional composite siege officer representing siege-engineering personnel; not a historical individual.
6. Mewar Resource Steward — fictional composite civilian/logistics perspective; not a historical individual.

### Character rules
- Historical figures: facts must be source-backed.
- Fictional composites: explicitly labeled internally as fictional composites.
- Avoid assigning unsupported decisions, statements or motivations to historical figures.
- Use game-authored dialogue unless a quote has a source.

---

## 10. Simulation Model

### Variables
Use exactly six primary variables for MVP:

- `food` — 0–100
- `water` — 0–100
- `defenders` — 0–100 normalized manpower index
- `morale` — 0–100
- `fort_integrity` — 0–100
- `siege_progress` — 0–100; higher is worse for defenders

Optional derived values:
- `civilian_pressure`
- `sustainability`

Do not introduce these unless needed by gameplay.

### Constraints
All variables clamp to their bounds.

### Turn model
Each turn executes:
1. Player choice effects.
2. Passive historical-state effects.
3. Rule interactions.
4. Threshold event checks.
5. New state calculation.
6. Narrative event generation.
7. Timeline entry.

---

## 11. Historical Anchors

Canonical anchors for Chittor scenario:
- Akbar led the Mughal campaign against Chittor.
- Udai Singh II withdrew from Chittor before/ during the siege while the defence was entrusted to commanders including Jaimal and Patta.
- Mughal siege engineering included covered approaches / sabats and mining operations.
- The siege lasted several months and the fort was captured in February 1568.
- Accounts including Abu'l Fazl's Akbarnama describe Jaimal being shot by Akbar during the final stage of the siege.

The game should preserve these as canonical facts; player simulation can branch around them but must not relabel a counterfactual as what happened historically.

---

## 12. Information Fog

The player should not have perfect information.

Each variable can have one of three display states:
- Exact
- Approximate
- Uncertain

Example:
> Water stores: ~60
> Enemy siege progress: uncertain
> Next major assault: unknown

This supports historical reasoning under incomplete information without claiming the exact uncertainty level is historically measurable unless the source supports it.

---

## 13. Timeline System

Every significant state change creates a timeline event object:

```json
{
  "turn": 2,
  "type": "simulation",
  "title": "Sortie disrupted siege works",
  "causes": ["decision_1_option_c"],
  "state_delta": {
    "siege_progress": -8,
    "defenders": -6
  }
}
```

Canonical timeline events are stored separately.

The comparison UI must never merge simulation and canonical events into one undifferentiated history stream.

---

## 14. Evidence System

Every historical claim shown to the player can optionally have:

```text
Claim
Source
Source type
Date/edition
Notes / caveat
```

Evidence hierarchy:
1. Primary/near-contemporary source.
2. Scholarly monograph / academic work.
3. Museum / archive record.
4. Reputable reference work.
5. Secondary web summary only if necessary.

Generated AI text is not an historical source.

---

## 15. AI Requirements

### Allowed
- Historical Q&A grounded in curated scenario notes.
- Explanation of player outcomes.
- Reflection prompts.
- Adaptive hints.

### Not allowed
- Choosing state deltas.
- Inventing historical facts.
- Generating unsupported names or quotes.
- Overriding canonical timeline.
- Producing an “official” alternative history.

### Recommended response format
```text
WHAT HAPPENED IN YOUR SIMULATION
...

HISTORICAL CONTEXT
...

WHY THEY DIFFERED
...

SOURCE NOTE
...
```

---

## 16. UX / Accessibility

Requirements:
- Desktop-first but responsive.
- Keyboard-accessible decision controls.
- High contrast text.
- Icon + label, not icon only.
- Every simulation change has textual explanation.
- Reduce motion option if practical.

---

## 17. Visual Direction

### Style
Cinematic historical strategy-game illustration, 2D/2.5D presentation, warm parchment UI, sandstone, maroon, emerald and gold accents.

### Do not
- Use fantasy armor as historical fact.
- Use modern uniforms or modern objects.
- Present generated artwork as historical evidence.
- Add excessive VFX that obscure information.

---

## 18. Demo / Judge Story

Target demo length: 3–5 minutes.

### Script
1. Start on historical context.
2. Show that the event is documented.
3. Reach decision point.
4. Make a non-historical choice.
5. Let the simulation run.
6. Show state changes.
7. Make second decision.
8. Show counterfactual outcome.
9. Press Compare.
10. Reveal canonical timeline.
11. Explain one divergence with evidence.

The strongest moment should be the side-by-side timeline divergence.

---

## 19. Out of Scope for MVP

- 3D open world.
- Multiplayer.
- Procedural generation of full civilizations.
- Dozens of scenarios.
- Voice assistant.
- Full VR/AR.
- AI-generated simulation rules.
- Authentication unless necessary.
- Social feed.
- Leaderboards.
- Complex economy model.
- Real-time multiplayer combat.

---

## 20. Success Criteria

KaalNetra MVP is successful when a judge can understand within five minutes:

1. The event is historical.
2. The player makes a decision.
3. The decision changes a simulation state.
4. Later consequences depend on earlier decisions.
5. The simulation is clearly separate from history.
6. The real historical outcome is shown and sourced.
7. The player learns why the historical outcome unfolded within its constraints.

---

## 21. Post-MVP Expansion

After the Chittor scenario works, add scenario packs using the same engine.

Future architecture:

```text
KaalNetra Engine
 ├── Chittor 1567–1568
 ├── Scenario 2
 └── Scenario 3
```

Scenario content should be data-driven so the engine remains unchanged.
