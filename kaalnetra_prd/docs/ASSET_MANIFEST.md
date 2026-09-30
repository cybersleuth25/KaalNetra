# KaalNetra — Asset Manifest

## 1. Asset Philosophy

Only generate and ship assets that appear in the playable demo.

Do not expand the asset list until the gameplay loop is complete.

---

## 2. Character Assets

### Historical characters
1. `jaimal_fullbody.png`
2. `patta_fullbody.png`
3. `udai_singh_fullbody.png`
4. `akbar_fullbody.png`

### Fictional composites
5. `mirza_yusuf_fullbody.png`
6. `resource_steward_fullbody.png`

### Optional dialogue portraits
Create cropped/consistent portrait variants only if dialogue UI needs them.

---

## 3. Environment Assets

1. `chittor_overview.webp`
2. `fort_interior.webp`
3. `fort_walls.webp`
4. `mughal_siege_camp.webp`
5. `strategic_map.webp`

The strategic map should be used as a functional visual aid, not treated as a survey-grade historical map.

---

## 4. UI Assets

Generate or create in code:
- resource icons
- timeline node icons
- historical record badge
- simulation badge
- evidence icon
- continue/back icons

Prefer SVG or icon library for UI icons.

---

## 5. Backgrounds / Scene Use

### Home
Use `chittor_overview.webp` with dark overlay.

### Historical Context
Use `chittor_overview.webp` or `fort_walls.webp`.

### Briefing
Use character portrait + soft fort background.

### Decision 1
Use strategic map.

### Simulation
Use fort walls or siege camp.

### Decision 2
Use fort wall + siege camp contextual imagery.

### Comparison
Use no busy full-screen scene; use a subdued parchment/stone background.

---

## 6. Character Rendering

For transparent game assets:
- head to toe visible;
- clean silhouette;
- no text;
- consistent scale;
- consistent lighting direction;
- transparent PNG/WebP where supported.

---

## 7. Generated Art Warnings

All AI-generated characters and environments are **illustrative interpretations**.

Do not use the generated art as proof of:
- exact armor designs;
- exact banners;
- exact troop formations;
- exact architecture in 1567;
- exact facial appearance.

Where a visual detail is historically important, prefer museum/archive imagery or clearly label it as a stylized reconstruction.
