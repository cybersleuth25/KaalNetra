/**
 * KaalNetra — Scenario & Game Type Definitions
 *
 * Derived from:
 *   - schemas/scenario.schema.json
 *   - docs/GAME_LOGIC.md (state variables, turn model, thresholds, end conditions)
 *   - docs/MASTER_PRD.md (actors, evidence system, timeline system)
 *   - docs/HISTORICAL_CANON.md (evidence labels, source hierarchy)
 *
 * Every field below maps to a specific PRD requirement.
 * Types marked "optional" may be omitted in MVP scenarios but are supported
 * for future scenario packs.
 */

// ---------------------------------------------------------------------------
// Evidence & Source Labels
// ---------------------------------------------------------------------------

/** Evidence hierarchy from HISTORICAL_CANON.md §2 */
export type EvidenceLevel =
  | 'CANONICAL'
  | 'CONTESTED'
  | 'SIMULATION'
  | 'FICTIONAL_COMPOSITE';

/** Source type from HISTORICAL_CANON.md §5 */
export type SourceType =
  | 'Primary/near-contemporary court chronicle'
  | 'Near-contemporary chronicle'
  | 'Scholarly secondary work'
  | 'Museum/archive record'
  | 'Game design specification'
  | string; // Allow future source types

// ---------------------------------------------------------------------------
// Evidence System
// ---------------------------------------------------------------------------

/** MASTER_PRD.md §14 — Evidence card for historical claims */
export interface EvidenceEntry {
  id: string;
  claim: string;
  source: string;
  type: SourceType;
  evidence_level: EvidenceLevel;
  note?: string;
}

// ---------------------------------------------------------------------------
// Actor / Character System
// ---------------------------------------------------------------------------

/** Actor role from MASTER_PRD.md §9 — Character System */
export type ActorRole =
  | 'commander'
  | 'ruler'
  | 'adviser'
  | 'opponent'
  | 'siege_officer'
  | 'civilian'
  | string; // extensible for future scenarios

/** MASTER_PRD.md §9 — Character roster entry */
export interface Actor {
  id: string;
  name: string;
  role: ActorRole;
  /** true = documented historical figure, false = fictional composite */
  historical: boolean;
  /** Faction/party this actor belongs to */
  faction: string;
  /** Short description for briefing context */
  description: string;
  /** Portrait asset filename, if available */
  portrait?: string;
  /** Source IDs backing this actor's historicity */
  source_ids?: string[];
}

// ---------------------------------------------------------------------------
// State Variables
// ---------------------------------------------------------------------------

/** State variable metadata for UI display and information fog */
export interface StateVariableMeta {
  id: string;
  label: string;
  /** 0–100 interpretation: 'higher_better' or 'lower_better' */
  polarity: 'higher_better' | 'lower_better';
  /** Icon name for UI */
  icon?: string;
  /** Short tooltip description */
  description?: string;
}

/** The six core simulation state variables from GAME_LOGIC.md §2 */
export interface StartingState {
  food: number;         // 0–100
  water: number;        // 0–100
  defenders: number;    // 0–100 normalized index
  morale: number;       // 0–100
  fort_integrity: number; // 0–100
  siege_progress: number; // 0–100; higher = worse for defenders
}

/** Runtime game state including turn tracking and flags */
export interface GameState extends StartingState {
  turn: number;
  date_label: string;
  flags: Record<string, boolean>;
}

/** State variable key — the six core variables */
export type StateVarKey = keyof StartingState;

/** All six variable keys as an array for iteration */
export const STATE_VAR_KEYS: StateVarKey[] = [
  'food', 'water', 'defenders', 'morale', 'fort_integrity', 'siege_progress',
];

// ---------------------------------------------------------------------------
// Decision System
// ---------------------------------------------------------------------------

/** Numeric deltas applied to state variables by a choice */
export interface ChoiceDelta {
  food?: number;
  water?: number;
  defenders?: number;
  morale?: number;
  fort_integrity?: number;
  siege_progress?: number;
}

/** A single choice option within a decision point */
export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  delta: ChoiceDelta;
}

/** A decision point where the player makes a choice */
export interface DecisionPoint {
  id: string;
  prompt: string;
  options: DecisionOption[];
  /** Optional trigger condition description */
  trigger_condition?: string;
}

// ---------------------------------------------------------------------------
// Canonical Timeline
// ---------------------------------------------------------------------------

/** Immutable historical event from HISTORICAL_CANON.md §7 */
export interface CanonicalTimelineEvent {
  id: string;
  date_label: string;
  title: string;
  description: string;
  evidence_level: 'CANONICAL' | 'CONTESTED';
  source_ids?: string[];
}

// ---------------------------------------------------------------------------
// Simulation Timeline Event (runtime, not in scenario JSON)
// ---------------------------------------------------------------------------

/** Timeline event (player simulation or canonical) — GAME_LOGIC.md §13 */
export interface TimelineEvent {
  id: string;
  turn: number;
  timeline: 'simulation' | 'canonical';
  title: string;
  description: string;
  source_ids?: string[];
  caused_by?: string[];
  delta?: Partial<Record<StateVarKey, number>>;
}

// ---------------------------------------------------------------------------
// Historical Constraints
// ---------------------------------------------------------------------------

/** A constraint that limits player options — MASTER_PRD.md P6 */
export interface HistoricalConstraint {
  id: string;
  title: string;
  description: string;
  /** Which state variable(s) this constraint relates to */
  affects?: StateVarKey[];
  source_ids?: string[];
}

// ---------------------------------------------------------------------------
// Simulation Notes & Fictional Composites
// ---------------------------------------------------------------------------

/** Disclaimer / caveat about simulation mechanics */
export interface SimulationNote {
  id: string;
  content: string;
  /** Where this note applies */
  context?: string;
}

/** Fictional composite character declaration — HISTORICAL_CANON.md §8 */
export interface FictionalComposite {
  actor_id: string;
  rationale: string;
  /** What real-world role this composite represents */
  represents: string;
}

// ---------------------------------------------------------------------------
// Scenario — Top-Level
// ---------------------------------------------------------------------------

/**
 * The complete scenario data model.
 *
 * Designed to be loaded entirely from JSON — no hardcoded content in components.
 * Future scenarios can be added by creating a new JSON file conforming to this shape.
 *
 * From TECH_ARCHITECTURE.md §6 + MASTER_PRD.md §6 + user requirements.
 */
export interface Scenario {
  // --- Required core ---
  id: string;
  title: string;
  period: string;
  /** Location / region name (e.g., "Chittor, Mewar") */
  location?: string;
  historical_context: string[];
  starting_state: StartingState;
  decision_points: DecisionPoint[];
  canonical_timeline: CanonicalTimelineEvent[];
  evidence: EvidenceEntry[];

  // --- Extended (optional, enriched in Phase 2) ---
  /** Named characters / actors in this scenario */
  actors?: Actor[];
  /** Metadata about each state variable for UI rendering */
  state_variables?: StateVariableMeta[];
  /** Historical constraints that limit player options */
  historical_constraints?: HistoricalConstraint[];
  /** Fictional composite declarations */
  fictional_composites?: FictionalComposite[];
  /** Simulation design notes / caveats */
  simulation_notes?: SimulationNote[];
  /** Reflection prompts for the AI/end screen */
  reflection_prompts?: string[];
}

// ---------------------------------------------------------------------------
// Scenario Loading Result
// ---------------------------------------------------------------------------

/** Scenario registry entry — summary for selection UI */
export interface ScenarioEntry {
  id: string;
  title: string;
  period: string;
  location?: string;
  available: boolean;
}

/** Result of loading + validating a scenario */
export interface ScenarioLoadResult {
  success: boolean;
  scenario: Scenario | null;
  errors: ScenarioValidationError[];
  warnings: string[];
}

/** A single validation error */
export interface ScenarioValidationError {
  path: string;
  message: string;
  /** 'missing' | 'type' | 'range' | 'schema' | 'parse' */
  kind: string;
}

// ---------------------------------------------------------------------------
// Outcome Tier (runtime, from GAME_LOGIC.md §12)
// ---------------------------------------------------------------------------

export type OutcomeTier =
  | 'resilient_defense'
  | 'strained_defense'
  | 'critical_defense'
  | 'collapse';
