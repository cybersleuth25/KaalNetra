# KaalNetra — UI/UX Product Requirements

## 1. Visual Language

### Tone
Historical, premium, cinematic, serious, readable.

### Palette
- Parchment / warm stone neutrals.
- Deep maroon for Mewar defensive context.
- Emerald / dark green for Mughal context.
- Gold as accent.
- Neutral UI for generic controls.

### Typography
- Serif display font for historical headings.
- Highly legible sans-serif for data and controls.

---

## 2. Navigation

Linear story flow with a visible stage indicator:

`Context → Decision → Consequence → Decision → Outcome → Compare → Reflect`

No complex menus during the 5-minute demo.

---

## 3. Home

Hero background: Chittor fort at dusk.

Elements:
- KaalNetra logo.
- Tagline.
- “History is fixed. Your decisions are not.”
- Enter Scenario button.

---

## 4. Scenario Selection

MVP has only one playable card:

**The Siege of Chittor**
`1567–1568 | Mewar | Historical Simulation`

Button:
`Begin Simulation`

---

## 5. Historical Context Screen

Layout:
- Large image on left.
- Facts on right.
- Timeline strip at bottom.

Facts should be concise.

A “Historical Record” badge is present.

---

## 6. Briefing Screen

Character portrait on left; briefing text on right.

Use named figures carefully:
- Jaimal: defensive commander / contextual adviser.
- Patta: defensive commander.
- Udai Singh II: historical background / ruler context.
- Akbar: opposing commander context.
- Composite characters only for role representation.

CTA:
`Continue to Decision`

---

## 7. Decision Screen

Main component: 2×2 decision cards.

Each card contains:
- title
- 1-sentence description
- expected strategic trade-off
- no “correct/wrong” indicator

Optional:
`View historical constraints`

On selection:
- animate selected card;
- lock all cards;
- move to simulation.

---

## 8. Simulation Screen

### Layout
```text
┌───────────────────────────────────────────────┐
│ CHITTOR 1567                    TURN 2         │
├───────────────────────┬───────────────────────┤
│                       │ FOOD        56         │
│      MAP / SCENE      │ WATER       48         │
│                       │ DEFENDERS   72         │
│                       │ MORALE      68         │
│                       │ FORT        74         │
│                       │ SIEGE       45         │
├───────────────────────┴───────────────────────┤
│ EVENT LOG                                      │
│ Your sortie disrupted siege works...           │
└───────────────────────────────────────────────┘
```

### Requirements
- State values animate between turns.
- Show deltas.
- Show causal event sentence.
- Use icons sparingly.
- Do not overwhelm with charts.

---

## 9. Timeline UI

Vertical or horizontal timeline with nodes.

Simulation node example:
`Sortie → Siege progress reduced → Defender losses`

Causal click reveals:
- choice
- delta
- downstream consequence

---

## 10. Comparison Screen

This is the main presentation feature.

### Header
> YOUR SIMULATION vs DOCUMENTED HISTORY

### Left
Counterfactual path.

### Right
Canonical path.

### Center
Divergence marker:
> Decision Point 1

Use a subtle animated branch effect.

A “What differs?” panel lists the 3 largest causal differences.

---

## 11. Historical Evidence Drawer

Click `Evidence`.

Drawer contents:
- claim
- source
- source type
- caveat
- simulation note

Example:
> Simulation values are authored abstractions and are not historical measurements.

---

## 12. Reflection Screen

Show:
- biggest player decision
- biggest consequence
- biggest historical constraint

Prompt:
> What trade-off mattered most in your simulation?

AI button:
`Explain this outcome`

---

## 13. Accessibility

- Keyboard support.
- Focus styles.
- Minimum readable text size.
- Alt text for informative images.
- Do not encode state only by color.
- Motion reduction where practical.

---

## 14. Performance

- Lazy-load large images.
- Use compressed WebP where transparency isn't required; PNG for transparent character assets.
- Keep initial scene under reasonable network weight.
- Preload only the next scene's assets.

---

## 15. Demo Polish

High-value polish:
- smooth state-number animations;
- branch animation in comparison screen;
- atmospheric background motion;
- subtle sound effects;
- fast transitions.

Low-value polish to avoid:
- elaborate particles everywhere;
- 3D camera systems;
- large inventories;
- complex character animation rigs.
