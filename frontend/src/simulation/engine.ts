/**
 * KaalNetra — Deterministic Simulation Engine
 *
 * Implements the core game loop from GAME_LOGIC.md:
 *   1. Apply choice delta
 *   2. Apply passive turn delta
 *   3. Apply threshold modifiers
 *   4. Evaluate events
 *   5. Evaluate end conditions
 *   6. Append timeline event
 *
 * This module is INDEPENDENT of React, Phaser, and AI.
 * It is a pure function-based engine operating on typed data.
 *
 * Determinism guarantee:
 *   Same scenario + same starting state + same decision sequence
 *   → always produces identical state changes, events, and final result.
 *   No randomness. No side effects. No external state.
 */

import type { Scenario } from '../data/types';
import { STATE_VAR_KEYS } from '../data/types';
import type {
  GameState,
  StartingState,
  DecisionPoint,
  DecisionOption,
  ChoiceDelta,
  StateVarKey,
  OutcomeTier,
  TurnResult,
  ThresholdEffect,
  SimulationEvent,
  EndCondition,
  EndConditionType,
  SimulationSession,
} from './types';

// ---------------------------------------------------------------------------
// Constants — from GAME_LOGIC.md §5
// ---------------------------------------------------------------------------

/** Passive turn effects — GAME_LOGIC.md §5 */
export const PASSIVE_TURN_DELTA: Readonly<ChoiceDelta> = {
  food: -4,
  water: -5,
  defenders: -2,
  morale: 0,
  fort_integrity: -1,
  siege_progress: 5,
};

/** MVP time limit — GAME_LOGIC.md §11 */
export const MAX_TURNS = 5;

/** Date labels for turns (MVP) */
const TURN_DATE_LABELS: readonly string[] = [
  'Late 1567',
  'Early December 1567',
  'Late December 1567',
  'January 1568',
  'Early February 1568',
  'Late February 1568',
];

// ---------------------------------------------------------------------------
// Pure Utility Functions
// ---------------------------------------------------------------------------

/** Clamp a number between min and max — GAME_LOGIC.md §3 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/** Deep clone a GameState (no circular references) */
export function cloneState(state: GameState): GameState {
  return {
    turn: state.turn,
    date_label: state.date_label,
    food: state.food,
    water: state.water,
    defenders: state.defenders,
    morale: state.morale,
    fort_integrity: state.fort_integrity,
    siege_progress: state.siege_progress,
    flags: { ...state.flags },
  };
}

/** Apply a delta to state (mutates), then clamp all variables to 0-100 */
export function applyDelta(state: GameState, delta: ChoiceDelta): GameState {
  for (const key of STATE_VAR_KEYS) {
    if (delta[key] !== undefined) {
      state[key] = clamp(state[key] + delta[key], 0, 100);
    }
  }
  return state;
}

/** Clamp all state variables to 0-100 — GAME_LOGIC.md §3 */
export function clampState(state: GameState): GameState {
  for (const key of STATE_VAR_KEYS) {
    state[key] = clamp(state[key], 0, 100);
  }
  return state;
}

/**
 * Calculate sustainability signal — GAME_LOGIC.md §7
 * For UI only, not part of simulation logic.
 */
export function calculateSustainability(state: GameState): number {
  return Math.round(
    (state.food + state.water + state.defenders + state.morale
      + state.fort_integrity + (100 - state.siege_progress)) / 6
  );
}

// ---------------------------------------------------------------------------
// Threshold Rules — GAME_LOGIC.md §6
// ---------------------------------------------------------------------------

/** Evaluate and apply all threshold rules. Returns the list of triggered effects. */
export function applyThresholdRules(state: GameState): ThresholdEffect[] {
  const triggered: ThresholdEffect[] = [];

  // Food shortage (severe first, then moderate — both can apply)
  if (state.food < 15) {
    const effects: ChoiceDelta = { morale: -7, defenders: -4 };
    triggered.push({
      ruleId: 'food_critical',
      description: 'Critical food shortage',
      condition: 'food < 15',
      effects,
    });
    applyDelta(state, effects);
  } else if (state.food < 30) {
    const effects: ChoiceDelta = { morale: -4, defenders: -2 };
    triggered.push({
      ruleId: 'food_low',
      description: 'Food supplies running low',
      condition: 'food < 30',
      effects,
    });
    applyDelta(state, effects);
  }

  // Water shortage (severe first, then moderate)
  if (state.water < 15) {
    const effects: ChoiceDelta = { morale: -8, defenders: -3 };
    triggered.push({
      ruleId: 'water_critical',
      description: 'Critical water shortage',
      condition: 'water < 15',
      effects,
    });
    applyDelta(state, effects);
  } else if (state.water < 30) {
    const effects: ChoiceDelta = { morale: -5 };
    triggered.push({
      ruleId: 'water_low',
      description: 'Water supplies running low',
      condition: 'water < 30',
      effects,
    });
    applyDelta(state, effects);
  }

  // Low morale
  if (state.morale < 35) {
    const effects: ChoiceDelta = { defenders: -3, fort_integrity: -1 };
    triggered.push({
      ruleId: 'morale_low',
      description: 'Low morale weakening defence',
      condition: 'morale < 35',
      effects,
    });
    applyDelta(state, effects);
  }

  // Low defenders
  if (state.defenders < 30) {
    const effects: ChoiceDelta = { fort_integrity: -2 };
    triggered.push({
      ruleId: 'defenders_low',
      description: 'Insufficient defenders to hold fortifications',
      condition: 'defenders < 30',
      effects,
    });
    applyDelta(state, effects);
  }

  // High siege pressure
  if (state.siege_progress > 70) {
    const effects: ChoiceDelta = { fort_integrity: -2, morale: -3 };
    triggered.push({
      ruleId: 'siege_pressure',
      description: 'Overwhelming siege pressure',
      condition: 'siege_progress > 70',
      effects,
    });
    applyDelta(state, effects);
  }

  return triggered;
}

// ---------------------------------------------------------------------------
// Event Evaluation
// ---------------------------------------------------------------------------

/** Generate simulation events based on the current state */
export function evaluateEvents(
  state: GameState,
  turn: number,
  thresholdEffects: ThresholdEffect[],
  decisionTitle: string,
): SimulationEvent[] {
  const events: SimulationEvent[] = [];

  // Decision event
  events.push({
    id: `sim_decision_t${turn}`,
    turn,
    title: `Decision: ${decisionTitle}`,
    description: `The defenders chose: ${decisionTitle}`,
    affectedVariables: STATE_VAR_KEYS.filter(() => true),
  });

  // Threshold-triggered events
  for (const effect of thresholdEffects) {
    const affected: StateVarKey[] = [];
    for (const key of STATE_VAR_KEYS) {
      if (effect.effects[key] !== undefined) affected.push(key);
    }
    events.push({
      id: `sim_threshold_${effect.ruleId}_t${turn}`,
      turn,
      title: effect.description,
      description: `Condition met: ${effect.condition}`,
      affectedVariables: affected,
      delta: effect.effects,
    });
  }

  // Critical state warnings
  if (state.fort_integrity <= 20 && state.fort_integrity > 0) {
    events.push({
      id: `sim_fort_critical_t${turn}`,
      turn,
      title: 'Fort defences near collapse',
      description: `Fort integrity at ${state.fort_integrity}%. Structural failure imminent.`,
      affectedVariables: ['fort_integrity'],
    });
  }

  if (state.morale <= 20 && state.morale > 0) {
    events.push({
      id: `sim_morale_critical_t${turn}`,
      turn,
      title: 'Garrison morale collapsing',
      description: `Morale at ${state.morale}%. Garrison cohesion failing.`,
      affectedVariables: ['morale'],
    });
  }

  return events;
}

// ---------------------------------------------------------------------------
// End Conditions — GAME_LOGIC.md §11
// ---------------------------------------------------------------------------

/** Check if any end condition is met */
export function checkEndConditions(state: GameState): EndCondition | null {
  // Defender collapse
  if (state.fort_integrity <= 0) {
    return {
      type: 'fort_collapse',
      description: 'Fort defences have collapsed. The fort falls.',
      turn: state.turn,
    };
  }
  if (state.morale <= 0) {
    return {
      type: 'morale_collapse',
      description: 'Garrison morale has collapsed. Resistance ends.',
      turn: state.turn,
    };
  }
  if (state.defenders <= 0) {
    return {
      type: 'defender_collapse',
      description: 'No defenders remain. The fort is undefended.',
      turn: state.turn,
    };
  }

  // Critical resource collapse
  if (state.water <= 0 && state.food <= 10) {
    return {
      type: 'resource_collapse',
      description: 'Water exhausted and food nearly gone. Survival impossible.',
      turn: state.turn,
    };
  }

  // Siege threshold
  if (state.siege_progress >= 100) {
    return {
      type: 'siege_threshold',
      description: 'Mughal siege has fully overwhelmed defences.',
      turn: state.turn,
    };
  }

  // MVP time limit
  if (state.turn >= MAX_TURNS) {
    return {
      type: 'time_limit',
      description: 'Simulation period concluded.',
      turn: state.turn,
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Outcome Tier — GAME_LOGIC.md §12
// ---------------------------------------------------------------------------

/** Determine outcome tier from final state */
export function determineOutcomeTier(state: GameState, endCondition: EndCondition): OutcomeTier {
  // Any collapse = collapse tier
  const collapseTypes: EndConditionType[] = [
    'fort_collapse', 'morale_collapse', 'defender_collapse',
    'resource_collapse', 'siege_threshold',
  ];
  if (collapseTypes.includes(endCondition.type)) {
    return 'collapse';
  }

  // Time limit reached — evaluate sustainability
  const sustainability = calculateSustainability(state);
  if (sustainability >= 55) return 'resilient_defense';
  if (sustainability >= 40) return 'strained_defense';
  return 'critical_defense';
}

// ---------------------------------------------------------------------------
// Core Engine API
// ---------------------------------------------------------------------------

/**
 * Create the initial game state from a scenario's starting state.
 */
export function createInitialState(startingState: StartingState): GameState {
  return {
    turn: 0,
    date_label: TURN_DATE_LABELS[0],
    food: clamp(startingState.food, 0, 100),
    water: clamp(startingState.water, 0, 100),
    defenders: clamp(startingState.defenders, 0, 100),
    morale: clamp(startingState.morale, 0, 100),
    fort_integrity: clamp(startingState.fort_integrity, 0, 100),
    siege_progress: clamp(startingState.siege_progress, 0, 100),
    flags: {},
  };
}

/**
 * Get available decision points for the current state.
 * Returns the decision point(s) that should be presented.
 */
export function getAvailableDecisions(
  state: GameState,
  decisionPoints: DecisionPoint[],
  usedDecisionIds: string[],
): DecisionPoint[] {
  const available: DecisionPoint[] = [];

  for (const dp of decisionPoints) {
    // Skip already-used decisions
    if (usedDecisionIds.includes(dp.id)) continue;

    // Check trigger conditions (parse from trigger_condition string)
    if (dp.id === 'decision_1' && state.turn >= 0) {
      available.push(dp);
    } else if (dp.id === 'decision_2') {
      // Available after decision_1 is used (sequential flow), or when trigger condition is met
      if (usedDecisionIds.includes('decision_1') || state.turn >= 3 || state.fort_integrity <= 55 || state.siege_progress >= 60) {
        available.push(dp);
      }
    } else {
      // Generic fallback: decision available if not used
      available.push(dp);
    }
  }

  return available;
}

/**
 * Apply a decision and advance one turn.
 *
 * Implements the rule order from GAME_LOGIC.md §4:
 *   1. Apply choice delta
 *   2. Apply passive turn delta
 *   3. Apply threshold modifiers
 *   4. Evaluate events
 *   5. Evaluate end conditions
 *   6. Append timeline event
 *
 * Returns a TurnResult with complete before/after state and all effects.
 */
export function applyDecision(
  currentState: GameState,
  decisionPoint: DecisionPoint,
  option: DecisionOption,
): TurnResult {
  // Snapshot state before
  const stateBefore = cloneState(currentState);
  const newTurn = currentState.turn + 1;

  // Clone state for mutation
  const next = cloneState(currentState);
  next.turn = newTurn;
  next.date_label = TURN_DATE_LABELS[Math.min(newTurn, TURN_DATE_LABELS.length - 1)];

  // Step 1: Apply choice delta
  applyDelta(next, option.delta);

  // Step 2: Apply passive turn delta
  applyDelta(next, PASSIVE_TURN_DELTA);

  // Step 3: Apply threshold modifiers
  const thresholdEffects = applyThresholdRules(next);

  // Step 4: Evaluate events
  const events = evaluateEvents(next, newTurn, thresholdEffects, option.title);

  // Final clamp (safety net)
  clampState(next);

  // Calculate net effects and affected variables for event history
  const effects: ChoiceDelta = {};
  const affected_variables: StateVarKey[] = [];
  for (const key of STATE_VAR_KEYS) {
    const diff = next[key] - stateBefore[key];
    if (diff !== 0) {
      effects[key] = diff;
      affected_variables.push(key);
    }
  }

  const event_description = `Turn ${newTurn}: Defenders chose "${option.title}". ${option.description}`;

  // Step 5: Evaluate end conditions
  const endCondition = checkEndConditions(next);

  // Return complete turn result
  return {
    turn: newTurn,
    decisionId: decisionPoint.id,
    decision_id: decisionPoint.id,
    optionId: option.id,
    option_id: option.id,
    stateBefore,
    state_before: stateBefore,
    choiceDelta: { ...option.delta },
    passiveDelta: { ...PASSIVE_TURN_DELTA },
    thresholdEffects,
    effects,
    stateAfter: next,
    state_after: next,
    event_description,
    affected_variables,
    events,
    endCondition,
    end_condition: endCondition,
  };
}

/**
 * Advance a turn with a specific option ID (convenience wrapper).
 * Validates that the decision and option exist.
 */
export function advanceTurn(
  session: SimulationSession,
  decisionId: string,
  optionId: string,
  decisionPoints: DecisionPoint[],
): { session: SimulationSession; turnResult: TurnResult } | { error: string } {
  if (session.isComplete) {
    return { error: 'Simulation is already complete' };
  }

  // Find the decision point
  const dp = decisionPoints.find((d) => d.id === decisionId);
  if (!dp) {
    return { error: `Decision point "${decisionId}" not found` };
  }

  // Find the option
  const option = dp.options.find((o) => o.id === optionId);
  if (!option) {
    return { error: `Option "${optionId}" not found in decision "${decisionId}"` };
  }

  // Check the decision is available
  const usedIds = session.turnHistory.map((t) => t.decisionId);
  const available = getAvailableDecisions(session.currentState, decisionPoints, usedIds);
  if (!available.some((a) => a.id === decisionId)) {
    return { error: `Decision "${decisionId}" is not available in current state` };
  }

  // Apply the decision
  const turnResult = applyDecision(session.currentState, dp, option);

  // Update session
  const updatedSession: SimulationSession = {
    ...session,
    currentState: turnResult.stateAfter,
    turnHistory: [...session.turnHistory, turnResult],
    currentDecisionIndex: session.currentDecisionIndex + 1,
    isComplete: turnResult.endCondition !== null,
    endCondition: turnResult.endCondition,
    outcomeTier: turnResult.endCondition
      ? determineOutcomeTier(turnResult.stateAfter, turnResult.endCondition)
      : null,
  };

  return { session: updatedSession, turnResult };
}

/**
 * Calculate consequences of a hypothetical decision without modifying state.
 * Used for previewing effects before committing.
 */
export function calculateConsequences(
  currentState: GameState,
  option: DecisionOption,
): { stateAfter: GameState; thresholdEffects: ThresholdEffect[] } {
  const next = cloneState(currentState);
  next.turn = currentState.turn + 1;

  applyDelta(next, option.delta);
  applyDelta(next, PASSIVE_TURN_DELTA);
  const thresholdEffects = applyThresholdRules(next);
  clampState(next);

  return { stateAfter: next, thresholdEffects };
}

/**
 * Create a new simulation session from a scenario.
 */
export function createSession(scenario: Scenario): SimulationSession {
  return {
    scenarioId: scenario.id,
    initialState: createInitialState(scenario.starting_state),
    currentState: createInitialState(scenario.starting_state),
    turnHistory: [],
    currentDecisionIndex: 0,
    isComplete: false,
    endCondition: null,
    outcomeTier: null,
  };
}

/**
 * Reset the simulation to the initial state.
 */
export function resetSimulation(session: SimulationSession): SimulationSession {
  return {
    ...session,
    currentState: cloneState(session.initialState),
    turnHistory: [],
    currentDecisionIndex: 0,
    isComplete: false,
    endCondition: null,
    outcomeTier: null,
  };
}

/**
 * Get the complete simulation history.
 */
export function getSimulationHistory(session: SimulationSession): TurnResult[] {
  return [...session.turnHistory];
}

/**
 * Replay a sequence of decisions from scratch (for determinism verification).
 * Returns the final session state.
 */
export function replayDecisions(
  scenario: Scenario,
  decisions: { decisionId: string; optionId: string }[],
): SimulationSession {
  let session = createSession(scenario);

  for (const { decisionId, optionId } of decisions) {
    const result = advanceTurn(session, decisionId, optionId, scenario.decision_points);
    if ('error' in result) {
      throw new Error(`Replay failed at decision "${decisionId}": ${result.error}`);
    }
    session = result.session;
  }

  return session;
}
