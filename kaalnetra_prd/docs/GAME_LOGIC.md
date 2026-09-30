# KaalNetra — Game Logic Specification

## 1. Objective

Build a small deterministic simulation engine where player decisions change a constrained world state and later conditions depend on the resulting state.

The engine must be independent of the UI and independent of the LLM.

---

## 2. State

```ts
export interface GameState {
  turn: number;
  date_label: string;
  food: number;              // 0–100
  water: number;             // 0–100
  defenders: number;         // 0–100 normalized index
  morale: number;             // 0–100
  fort_integrity: number;     // 0–100
  siege_progress: number;     // 0–100
  flags: Record<string, boolean>;
}
```

### Interpretation
- Higher `food`, `water`, `defenders`, `morale`, `fort_integrity` = better for defenders.
- Higher `siege_progress` = worse for defenders.

---

## 3. Bounds

After every transition:

```ts
clamp(value, 0, 100)
```

Do not permit NaN, Infinity or missing values to enter state.

---

## 4. Rule Order

The order must always be:

```text
1. Apply choice delta
2. Apply passive turn delta
3. Apply threshold modifiers
4. Evaluate events
5. Evaluate end conditions
6. Append timeline event
```

Do not reorder these in the MVP because order affects reproducibility.

---

## 5. Passive Turn Effects

Baseline per turn:

```text
food            -4
water           -5
defenders       -2
morale           0
fort_integrity  -1
siege_progress  +5
```

These are **gameplay abstractions**, not historical measurements. They exist to make the simulation playable. They must not be described as empirical historical rates.

---

## 6. Threshold Rules

### Food shortage
If `food < 30`:
- morale -4
- defenders -2

If `food < 15`:
- morale -7
- defenders -4

### Water shortage
If `water < 30`:
- morale -5

If `water < 15`:
- morale -8
- defenders -3

### Low morale
If `morale < 35`:
- defenders -3
- fort_integrity -1

### Low defenders
If `defenders < 30`:
- fort_integrity -2

### High siege pressure
If `siege_progress > 70`:
- fort_integrity -2
- morale -3

---

## 7. Derived Sustainability Signal

For UI only:

```ts
sustainability = Math.round(
  (food + water + defenders + morale + fort_integrity + (100 - siege_progress)) / 6
);
```

This should be displayed as a compact indicator, not as a “historical score.”

---

## 8. Decision Point 1

### Context
Mughal siege operations are progressing. The player chooses a defensive priority.

### Option A — Concentrate Defenders
Delta:
```text
fort_integrity   +4
siege_progress   -8
food             -3
defenders        -2
morale           +2
```

### Option B — Reinforce Threatened Sectors
Delta:
```text
fort_integrity   +6
siege_progress   -3
defenders        -1
morale           +1
```

### Option C — Limited Sortie
Delta:
```text
siege_progress   -10
defenders        -7
morale            +7
food              -1
```

### Option D — Conserve Strength
Delta:
```text
siege_progress   +5
food              +2
defenders         +1
morale             0
fort_integrity    +1
```

These are counterfactual game mechanics, not claims about exact historical orders.

---

## 9. Decision Point 2

### Trigger
Reach turn 3, or `fort_integrity <= 55`, or `siege_progress >= 60`.

### Situation
A breach / major defensive pressure is represented in the simulation.

### Option A — Concentrate at Breach
```text
fort_integrity   +7
morale            +4
defenders        -5
siege_progress   -8
```

### Option B — Defensive Redistribution
```text
fort_integrity   +3
defenders        -2
morale            +2
siege_progress   -5
```

### Option C — Counterattack Siege Works
```text
siege_progress   -12
defenders        -8
morale            +6
food              -2
```

### Option D — Preserve Remaining Strength
```text
siege_progress   +6
defenders        +2
morale            -4
fort_integrity    -3
```

---

## 10. Historical Anchor Event

The canonical timeline contains a fixed late-siege event:

```text
Jaimal is killed during the final stage of the siege,
according to accounts including Abu'l Fazl and Badayuni.
```

Player timeline:
- It may show a simulated alternate commander outcome.
- It must not replace the canonical event.
- It must be labeled as counterfactual.

Recommended UI label:
> Historical anchor: Jaimal's death is fixed in the documented timeline.

---

## 11. End Conditions

The simulation ends when:

### Defender collapse
Any of:
```text
fort_integrity <= 0
morale <= 0
defenders <= 0
```

### Critical resource collapse
```text
water <= 0 AND food <= 10
```

### Siege threshold
```text
siege_progress >= 100
```

### MVP time limit
```text
turn >= 5
```

If no collapse occurs by turn 5, resolve as a survival-state outcome rather than claiming a historical victory.

---

## 12. Outcome Tiers

Outcome tiers describe the **simulation only**:

- `resilient_defense`
- `strained_defense`
- `critical_defense`
- `collapse`

Do not use “won history” or “changed history.”

Example copy:
> Simulation outcome: strained defense.

---

## 13. Causal Timeline

Store a causal edge for each choice and major consequence.

```ts
interface TimelineEvent {
  id: string;
  turn: number;
  timeline: 'simulation' | 'canonical';
  title: string;
  description: string;
  source_ids?: string[];
  caused_by?: string[];
  delta?: Partial<Record<keyof GameState, number>>;
}
```

The UI uses `caused_by` to draw causal links.

---

## 14. Simulation Pseudocode

```ts
function resolveTurn(state: GameState, choice: Choice): TurnResult {
  let next = clone(state);

  next = applyDelta(next, choice.delta);
  next = applyDelta(next, BASELINE_PASSIVE_DELTA);
  next = applyThresholdRules(next);

  const events = evaluateEvents(next);
  next = applyEventEffects(next, events);

  next = clampState(next);

  const end = evaluateEndConditions(next);

  return {
    previousState: state,
    nextState: next,
    events,
    end
  };
}
```

---

## 15. Determinism Requirements

Given:
```text
same scenario
same seed (if ever introduced)
same starting state
same choices
```

The result must be identical.

For MVP, avoid randomness entirely.

If later adding uncertainty, use seeded pseudo-randomness and save the seed in the replay.

---

## 16. Save / Replay

MVP can use browser local storage.

Persist:
- scenario_id
- current_state
- decision history
- timeline events
- timestamp

A replay button resets to the scenario starting state.

---

## 17. Validation

Unit tests must cover:
- bounds
- each decision option
- threshold rules
- end conditions
- timeline events
- deterministic replay
- comparison output

Minimum test target:
- 20 deterministic unit tests.
