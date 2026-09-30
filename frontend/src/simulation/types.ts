/**
 * KaalNetra — Simulation Engine Types
 *
 * Types specific to the simulation engine.
 * Kept separate from scenario types to enforce the architecture boundary:
 * the engine operates on these types; React/UI never imports from here directly.
 *
 * From GAME_LOGIC.md §2, §4, §11, §12, §13, §14
 */

import type {
  GameState,
  StartingState,
  DecisionPoint,
  DecisionOption,
  ChoiceDelta,
  StateVarKey,
  OutcomeTier,
} from '../data/types';

// Re-export what the engine needs
export type {
  GameState,
  StartingState,
  DecisionPoint,
  DecisionOption,
  ChoiceDelta,
  StateVarKey,
  OutcomeTier,
};

// ---------------------------------------------------------------------------
// Turn Result
// ---------------------------------------------------------------------------

/** Result of resolving a single turn — GAME_LOGIC.md §14 */
export interface TurnResult {
  turn: number;
  decisionId: string;
  decision_id: string;
  optionId: string;
  option_id: string;
  stateBefore: GameState;
  state_before: GameState;
  choiceDelta: ChoiceDelta;
  passiveDelta: ChoiceDelta;
  thresholdEffects: ThresholdEffect[];
  effects: ChoiceDelta;
  stateAfter: GameState;
  state_after: GameState;
  event_description: string;
  affected_variables: StateVarKey[];
  events: SimulationEvent[];
  endCondition: EndCondition | null;
  end_condition: EndCondition | null;
}

// ---------------------------------------------------------------------------
// Threshold Effects
// ---------------------------------------------------------------------------

/** A threshold rule that triggered — GAME_LOGIC.md §6 */
export interface ThresholdEffect {
  ruleId: string;
  description: string;
  condition: string;
  effects: ChoiceDelta;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

/** A simulation event generated during a turn */
export interface SimulationEvent {
  id: string;
  turn: number;
  title: string;
  description: string;
  affectedVariables: StateVarKey[];
  delta?: ChoiceDelta;
}

// ---------------------------------------------------------------------------
// End Conditions
// ---------------------------------------------------------------------------

/** End condition type — GAME_LOGIC.md §11 */
export type EndConditionType =
  | 'fort_collapse'
  | 'morale_collapse'
  | 'defender_collapse'
  | 'resource_collapse'
  | 'siege_threshold'
  | 'time_limit';

/** An end condition that was met */
export interface EndCondition {
  type: EndConditionType;
  description: string;
  turn: number;
}

// ---------------------------------------------------------------------------
// Simulation Session
// ---------------------------------------------------------------------------

/** Complete simulation session state */
export interface SimulationSession {
  scenarioId: string;
  initialState: GameState;
  currentState: GameState;
  turnHistory: TurnResult[];
  currentDecisionIndex: number;
  isComplete: boolean;
  endCondition: EndCondition | null;
  outcomeTier: OutcomeTier | null;
}
