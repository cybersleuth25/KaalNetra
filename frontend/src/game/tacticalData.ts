/**
 * KaalNetra — Tactical Map Data & Point-of-Interest Model
 *
 * Decoupled data definitions for cartography, coordinates, and tactical notes.
 * Can be safely imported in both Node (tests/SSR) and browser (Phaser/React).
 */

export interface TacticalPoint {
  id: string;
  name: string;
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  type: 'defense' | 'danger' | 'resource' | 'enemy';
  description: string;
  tacticalNote: string;
}

export const TACTICAL_POINTS: TacticalPoint[] = [
  {
    id: 'lakhota',
    name: 'Lakhota Bastion (North Flank)',
    x: 0.32,
    y: 0.28,
    type: 'danger',
    description: 'Northern salient targeted by Mughal sappers driving subterranean gunpowder mines.',
    tacticalNote: 'Critical masonry breach point. Guarded by Jaimal Rathore.',
  },
  {
    id: 'suraj_pol',
    name: 'Suraj Pol (Sun Gate)',
    x: 0.68,
    y: 0.45,
    type: 'defense',
    description: 'The great eastern portal guarding the steep switchback ascent into the fort.',
    tacticalNote: 'Defended by Rawat Patta Chundawat and frontline archers.',
  },
  {
    id: 'gaumukh',
    name: 'Gaumukh Kund Reservoir',
    x: 0.48,
    y: 0.62,
    type: 'resource',
    description: 'Natural spring emerging from a cow-shaped rock carving, supplying pure drinking water.',
    tacticalNote: 'Vital lifeline for 38,000 souls during protracted siege.',
  },
  {
    id: 'sabat_line',
    name: 'Imperial Sabat Galleries',
    x: 0.22,
    y: 0.52,
    type: 'enemy',
    description: 'Covered wooden tunnels wide enough for 10 horsemen, shielding sappers with raw hide.',
    tacticalNote: 'Creeping within 50 yards of the outer curtain walls.',
  },
  {
    id: 'akbar_camp',
    name: 'Imperial Royal Encampment',
    x: 0.82,
    y: 0.72,
    type: 'enemy',
    description: 'The vast pavilion complex of Emperor Akbar commanding the siege.',
    tacticalNote: 'Supplied by continuous caravan trains from Delhi and Malwa.',
  },
];
