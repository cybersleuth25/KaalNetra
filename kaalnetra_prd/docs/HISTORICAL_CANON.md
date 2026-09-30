# KaalNetra — Historical Canon & Evidence Specification

## 1. Purpose

This file defines what KaalNetra treats as historical fact, what it treats as uncertain/contested, and what belongs only to the simulation.

The game must never blur the three.

---

## 2. Evidence Labels

Every historical content item should be marked internally as:

- `CANONICAL` — strongly supported by reliable historical sources used by the project.
- `CONTESTED` — sources disagree materially or chronology/details are uncertain.
- `SIMULATION` — authored counterfactual mechanics.
- `FICTIONAL_COMPOSITE` — invented helper character used to embody a historical role.

---

## 3. Core Chittor Facts for MVP

### C1 — Campaign and siege
**Canonical:** Akbar led a Mughal campaign against Chittor in 1567–1568; the siege lasted several months and the fort was captured in February 1568.

### C2 — Defensive command
**Canonical:** Udai Singh II, ruler of Mewar, did not remain in Chittor for the final siege; the defence was associated with commanders including Jaimal and Patta.

### C3 — Siege engineering
**Canonical:** Mughal operations included covered approaches / sabats and mining/siege engineering.

### C4 — Jaimal's death
**Canonical claim with source attribution:** Abu'l Fazl's account and Badayuni describe Jaimal being shot by Akbar during the final stage of the siege. The V&A's Akbarnama manuscript description also depicts this episode.

### C5 — Final fall
**Canonical:** The fort fell to Mughal forces in February 1568 after prolonged resistance.

---

## 4. Details That Must Be Treated Carefully

### Casualty totals
Do not use a single exact casualty number as uncontested fact. Historical accounts and later historians give differing figures and descriptions.

Recommended UI language:
> Accounts describe extensive casualties after the capture; reported numbers vary by source.

### Siege duration
Different sources and summaries may use different start/end conventions or approximate months.

Recommended UI language:
> The siege began in late 1567 and ended in February 1568.

### Exact troop numbers
Do not put a precise army size into the core gameplay unless the source and scope are clear. If shown, use an approximate figure with a source note.

### Exact dialogue
Never use generated dialogue as a quotation from a historical person.

---

## 5. Source Hierarchy

### Primary / near-contemporary
1. Abu'l Fazl, *Akbarnama* — especially the Chittor siege account.
2. Abdul Qadir Badayuni, *Muntakhab-ut-Tawarikh* — useful corroborating and contrasting account.
3. *Fathnama-i-Chitor* / victory letter material where a reliable edition/translation is available.

### Scholarly works
1. Satish Chandra — *Medieval India: From Sultanat to the Mughals, Part II*.
2. R. V. Somani — *History of Mewar, from Earliest Times to 1751 A.D.*
3. John F. Richards — *The Mughal Empire*.
4. Gopinath Sharma — *Mewar and the Mughal Emperors, 1526–1707 A.D.*

### Museum/archive evidence
- Victoria and Albert Museum records for relevant *Akbarnama* illustrations, including the depiction of Akbar shooting Jaimal.

---

## 6. Current Verification Notes

Web research used during PRD preparation located supporting material for:
- the 1567–1568 siege timeline;
- Jaimal and Patta as principal defenders;
- Mughal siege works / sabats / mining;
- the Akbarnama depiction of Akbar shooting Jaimal;
- modern scholarly citations to Chandra, Richards, Somani and Sharma.

The project team should still obtain and read the relevant book passages / source editions before submitting a final historical-content claim to judges.

---

## 7. Canonical Event Data

Canonical event objects must be immutable in the scenario file:

```json
{
  "timeline": "canonical",
  "event_id": "canon_jaimal_death",
  "title": "Jaimal is killed",
  "evidence_level": "CANONICAL",
  "source_ids": ["akbarnama", "badayuni"],
  "date_label": "Late February 1568",
  "description": "Accounts by Abu'l Fazl and Badayuni describe Jaimal being shot during the final stage of the siege."
}
```

---

## 8. Simulation Boundary

The following are intentionally not historical claims:
- exact effects assigned to player choices;
- numerical depletion rates;
- hypothetical survival or collapse outcomes;
- invented dialogue;
- invented composite characters;
- alternative troop movements created by the engine.

These should be labeled `SIMULATION` or `FICTIONAL_COMPOSITE`.

---

## 9. Recommended Evidence UI

Every evidence card:

```text
HISTORICAL RECORD
Claim: Mughal siege operations used covered approaches and mining.
Source: Abu'l Fazl, Akbarnama
Status: Canonical historical account
Note: Simulation effects are game abstractions.
```

---

## 10. Bibliography / Research Links

- Victoria and Albert Museum, relevant *Akbarnama* artwork record: “Akbar shoots Jaimal at the siege of Chitor.”
- Satish Chandra, *Medieval India: From Sultanat to the Mughals, Part II*.
- R. V. Somani, *History of Mewar, from Earliest Times to 1751 A.D.*
- John F. Richards, *The Mughal Empire*.
- Gopinath Sharma, *Mewar and the Mughal Emperors, 1526–1707 A.D.*
- Abu'l Fazl, *Akbarnama*, relevant Chittor siege section.
- Abdul Qadir Badayuni, *Muntakhab-ut-Tawarikh*, relevant Chittor siege section.

Useful online verification sources consulted during preparation:
- https://commons.wikimedia.org/wiki/File:Akbar_shoots_Jaimal_at_the_siege_of_Chitor.jpg
- https://www.rarebooksocietyofindia.org/book_archive/196174216674_10151107322061675.pdf
- https://en.wikipedia.org/wiki/Siege_of_Chittorgarh_(1567%E2%80%931568)

Use primary / scholarly sources in the final product, not Wikipedia, where a claim is material.
