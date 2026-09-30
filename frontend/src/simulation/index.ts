/**
 * KaalNetra — Simulation Engine Public API
 *
 * Re-exports all public engine functions and types.
 * Import from 'simulation/' to use the engine.
 *
 * The engine is INDEPENDENT of React, Phaser, and AI.
 */

// Engine functions
export {
  // Core API
  createInitialState,
  getAvailableDecisions,
  applyDecision,
  advanceTurn,
  calculateConsequences,
  checkEndConditions,
  resetSimulation,
  getSimulationHistory,
  createSession,
  replayDecisions,
  determineOutcomeTier,

  // Utilities
  clamp,
  cloneState,
  applyDelta,
  clampState,
  calculateSustainability,
  applyThresholdRules,
  evaluateEvents,

  // Constants
  PASSIVE_TURN_DELTA,
  MAX_TURNS,
} from './engine';

// Types
export type {
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
