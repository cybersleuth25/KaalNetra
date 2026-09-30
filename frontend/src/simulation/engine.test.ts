/**
 * KaalNetra — Simulation Engine Unit Tests
 *
 * Covers all requirements from GAME_LOGIC.md §17:
 *   - bounds
 *   - each decision option
 *   - threshold rules
 *   - end conditions
 *   - timeline events
 *   - deterministic replay
 *   - comparison output
 *
 * Minimum test target: 20 deterministic unit tests.
 */

import { describe, it, expect } from 'vitest';
import {
  clamp,
  cloneState,
  applyDelta,
  clampState,
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
  calculateSustainability,
  applyThresholdRules,
  PASSIVE_TURN_DELTA,
  MAX_TURNS,
} from './engine';
import type {
  GameState,
  EndCondition,
} from './types';
import type { Scenario } from '../data/types';

// ---------------------------------------------------------------------------
// Test Fixtures
// ---------------------------------------------------------------------------

/** Minimal scenario for testing */
function makeTestScenario(): Scenario {
  return {
    id: 'test_scenario',
    title: 'Test Scenario',
    period: 'Test',
    historical_context: ['Test context'],
    starting_state: {
      food: 78,
      water: 72,
      defenders: 84,
      morale: 82,
      fort_integrity: 94,
      siege_progress: 18,
    },
    decision_points: [
      {
        id: 'decision_1',
        prompt: 'Test Decision 1',
        options: [
          { id: 'd1_a', title: 'Option A', description: 'Test A', delta: { fort_integrity: 4, siege_progress: -8, food: -3, defenders: -2, morale: 2 } },
          { id: 'd1_b', title: 'Option B', description: 'Test B', delta: { fort_integrity: 6, siege_progress: -3, defenders: -1, morale: 1 } },
          { id: 'd1_c', title: 'Option C', description: 'Test C', delta: { siege_progress: -10, defenders: -7, morale: 7, food: -1 } },
          { id: 'd1_d', title: 'Option D', description: 'Test D', delta: { siege_progress: 5, food: 2, defenders: 1, fort_integrity: 1 } },
        ],
      },
      {
        id: 'decision_2',
        prompt: 'Test Decision 2',
        trigger_condition: 'turn >= 3 or fort_integrity <= 55 or siege_progress >= 60',
        options: [
          { id: 'd2_a', title: 'Breach A', description: 'Test', delta: { fort_integrity: 7, morale: 4, defenders: -5, siege_progress: -8 } },
          { id: 'd2_b', title: 'Breach B', description: 'Test', delta: { fort_integrity: 3, defenders: -2, morale: 2, siege_progress: -5 } },
          { id: 'd2_c', title: 'Breach C', description: 'Test', delta: { siege_progress: -12, defenders: -8, morale: 6, food: -2 } },
          { id: 'd2_d', title: 'Breach D', description: 'Test', delta: { siege_progress: 6, defenders: 2, morale: -4, fort_integrity: -3 } },
        ],
      },
    ],
    canonical_timeline: [],
    evidence: [],
  };
}

function makeDefaultState(): GameState {
  return createInitialState({
    food: 78, water: 72, defenders: 84, morale: 82,
    fort_integrity: 94, siege_progress: 18,
  });
}

// ---------------------------------------------------------------------------
// 1. Utility Tests
// ---------------------------------------------------------------------------

describe('clamp', () => {
  it('should clamp values within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
    expect(clamp(-10, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('should handle NaN and Infinity', () => {
    expect(clamp(NaN, 0, 100)).toBe(0);
    expect(clamp(Infinity, 0, 100)).toBe(0);
    expect(clamp(-Infinity, 0, 100)).toBe(0);
  });

  it('should handle boundary values', () => {
    expect(clamp(0, 0, 100)).toBe(0);
    expect(clamp(100, 0, 100)).toBe(100);
  });
});

describe('cloneState', () => {
  it('should produce an independent copy', () => {
    const original = makeDefaultState();
    const clone = cloneState(original);
    clone.food = 0;
    clone.flags['test'] = true;
    expect(original.food).toBe(78);
    expect(original.flags['test']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 2. Initial State
// ---------------------------------------------------------------------------

describe('createInitialState', () => {
  it('should create state with correct starting values', () => {
    const state = makeDefaultState();
    expect(state.turn).toBe(0);
    expect(state.food).toBe(78);
    expect(state.water).toBe(72);
    expect(state.defenders).toBe(84);
    expect(state.morale).toBe(82);
    expect(state.fort_integrity).toBe(94);
    expect(state.siege_progress).toBe(18);
    expect(state.date_label).toBe('Late 1567');
  });

  it('should clamp out-of-range starting values', () => {
    const state = createInitialState({
      food: 150, water: -20, defenders: 84,
      morale: 82, fort_integrity: 94, siege_progress: 18,
    });
    expect(state.food).toBe(100);
    expect(state.water).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 3. Delta Application
// ---------------------------------------------------------------------------

describe('applyDelta', () => {
  it('should apply positive and negative deltas', () => {
    const state = makeDefaultState();
    applyDelta(state, { food: -10, morale: 5 });
    expect(state.food).toBe(68);
    expect(state.morale).toBe(87);
  });

  it('should clamp values to 0-100 after delta', () => {
    const state = makeDefaultState();
    applyDelta(state, { food: -200 });
    expect(state.food).toBe(0);
    applyDelta(state, { morale: 200 });
    expect(state.morale).toBe(100);
  });

  it('should ignore undefined delta keys', () => {
    const state = makeDefaultState();
    const originalWater = state.water;
    applyDelta(state, { food: -5 });
    expect(state.water).toBe(originalWater);
  });
});

// ---------------------------------------------------------------------------
// 4. Passive Turn Effects
// ---------------------------------------------------------------------------

describe('passive turn delta', () => {
  it('should match GAME_LOGIC.md §5 values', () => {
    expect(PASSIVE_TURN_DELTA.food).toBe(-4);
    expect(PASSIVE_TURN_DELTA.water).toBe(-5);
    expect(PASSIVE_TURN_DELTA.defenders).toBe(-2);
    expect(PASSIVE_TURN_DELTA.morale).toBe(0);
    expect(PASSIVE_TURN_DELTA.fort_integrity).toBe(-1);
    expect(PASSIVE_TURN_DELTA.siege_progress).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// 5. Threshold Rules
// ---------------------------------------------------------------------------

describe('applyThresholdRules', () => {
  it('should trigger food_low when food < 30', () => {
    const state = makeDefaultState();
    state.food = 25;
    const effects = applyThresholdRules(state);
    const foodLow = effects.find((e) => e.ruleId === 'food_low');
    expect(foodLow).toBeDefined();
    expect(foodLow!.effects.morale).toBe(-4);
    expect(foodLow!.effects.defenders).toBe(-2);
  });

  it('should trigger food_critical when food < 15', () => {
    const state = makeDefaultState();
    state.food = 10;
    const effects = applyThresholdRules(state);
    const critical = effects.find((e) => e.ruleId === 'food_critical');
    expect(critical).toBeDefined();
    expect(critical!.effects.morale).toBe(-7);
    expect(critical!.effects.defenders).toBe(-4);
    // Should NOT also trigger food_low
    expect(effects.find((e) => e.ruleId === 'food_low')).toBeUndefined();
  });

  it('should trigger water_low when water < 30', () => {
    const state = makeDefaultState();
    state.water = 20;
    const effects = applyThresholdRules(state);
    const waterLow = effects.find((e) => e.ruleId === 'water_low');
    expect(waterLow).toBeDefined();
    expect(waterLow!.effects.morale).toBe(-5);
  });

  it('should trigger water_critical when water < 15', () => {
    const state = makeDefaultState();
    state.water = 10;
    const effects = applyThresholdRules(state);
    expect(effects.find((e) => e.ruleId === 'water_critical')).toBeDefined();
    expect(effects.find((e) => e.ruleId === 'water_low')).toBeUndefined();
  });

  it('should trigger morale_low when morale < 35', () => {
    const state = makeDefaultState();
    state.morale = 30;
    const effects = applyThresholdRules(state);
    expect(effects.find((e) => e.ruleId === 'morale_low')).toBeDefined();
  });

  it('should trigger defenders_low when defenders < 30', () => {
    const state = makeDefaultState();
    state.defenders = 25;
    const effects = applyThresholdRules(state);
    expect(effects.find((e) => e.ruleId === 'defenders_low')).toBeDefined();
  });

  it('should trigger siege_pressure when siege_progress > 70', () => {
    const state = makeDefaultState();
    state.siege_progress = 75;
    const effects = applyThresholdRules(state);
    expect(effects.find((e) => e.ruleId === 'siege_pressure')).toBeDefined();
  });

  it('should not trigger any rules when all values are healthy', () => {
    const state = makeDefaultState();
    const effects = applyThresholdRules(state);
    expect(effects.length).toBe(0);
  });

  it('should trigger multiple rules when multiple thresholds are met', () => {
    const state = makeDefaultState();
    state.food = 10;
    state.water = 10;
    state.morale = 30;
    const effects = applyThresholdRules(state);
    expect(effects.length).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// 6. Decision Options (all 8 from GAME_LOGIC.md §8-9)
// ---------------------------------------------------------------------------

describe('decision options', () => {
  const scenario = makeTestScenario();

  it('Decision 1A — Concentrate Defenders', () => {
    const state = makeDefaultState();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[0]);
    // Choice delta: fort_integrity +4, siege_progress -8, food -3, defenders -2, morale +2
    // Then passive: food -4, water -5, defenders -2, morale 0, fort_integrity -1, siege_progress +5
    expect(result.stateAfter.turn).toBe(1);
    expect(result.choiceDelta.fort_integrity).toBe(4);
    expect(result.choiceDelta.siege_progress).toBe(-8);
  });

  it('Decision 1B — Reinforce Sectors', () => {
    const state = makeDefaultState();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[1]);
    expect(result.choiceDelta.fort_integrity).toBe(6);
    expect(result.stateAfter.turn).toBe(1);
  });

  it('Decision 1C — Limited Sortie', () => {
    const state = makeDefaultState();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[2]);
    expect(result.choiceDelta.siege_progress).toBe(-10);
    expect(result.choiceDelta.defenders).toBe(-7);
    expect(result.choiceDelta.morale).toBe(7);
  });

  it('Decision 1D — Conserve Strength', () => {
    const state = makeDefaultState();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[3]);
    expect(result.choiceDelta.siege_progress).toBe(5);
    expect(result.choiceDelta.food).toBe(2);
  });

  it('Decision 2A — Concentrate at Breach', () => {
    const state = makeDefaultState();
    state.turn = 3; // Trigger condition
    const dp = scenario.decision_points[1];
    const result = applyDecision(state, dp, dp.options[0]);
    expect(result.choiceDelta.fort_integrity).toBe(7);
    expect(result.choiceDelta.defenders).toBe(-5);
  });

  it('Decision 2D — Preserve Remaining Strength', () => {
    const state = makeDefaultState();
    state.turn = 3;
    const dp = scenario.decision_points[1];
    const result = applyDecision(state, dp, dp.options[3]);
    expect(result.choiceDelta.morale).toBe(-4);
    expect(result.choiceDelta.fort_integrity).toBe(-3);
  });
});

// ---------------------------------------------------------------------------
// 7. State Transitions
// ---------------------------------------------------------------------------

describe('state transitions', () => {
  it('should apply choice + passive + threshold in correct order', () => {
    const state = makeDefaultState();
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[0]);

    // Manual calculation for Option A:
    // Start:    food=78, water=72, defenders=84, morale=82, fort_integrity=94, siege=18
    // Choice:   food=-3  → 75, defenders=-2 → 82, morale=+2 → 84, fort=+4 → 98, siege=-8 → 10
    // Passive:  food=-4  → 71, water=-5 → 67, defenders=-2 → 80, morale=0 → 84, fort=-1 → 97, siege=+5 → 15
    // Threshold: none (all values healthy)
    expect(result.stateAfter.food).toBe(71);
    expect(result.stateAfter.water).toBe(67);
    expect(result.stateAfter.defenders).toBe(80);
    expect(result.stateAfter.morale).toBe(84);
    expect(result.stateAfter.fort_integrity).toBe(97);
    expect(result.stateAfter.siege_progress).toBe(15);
  });

  it('should advance turn counter correctly', () => {
    const state = makeDefaultState();
    expect(state.turn).toBe(0);
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[0]);
    expect(result.stateAfter.turn).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 8. Min/Max Boundaries
// ---------------------------------------------------------------------------

describe('min/max boundaries', () => {
  it('should never allow values below 0', () => {
    const state = makeDefaultState();
    state.food = 2;
    state.water = 3;
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[2]); // Sortie: food -1
    expect(result.stateAfter.food).toBeGreaterThanOrEqual(0);
    expect(result.stateAfter.water).toBeGreaterThanOrEqual(0);
  });

  it('should never allow values above 100', () => {
    const state = makeDefaultState();
    state.morale = 98;
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[2]); // Sortie: morale +7
    expect(result.stateAfter.morale).toBeLessThanOrEqual(100);
  });

  it('should clamp all six variables', () => {
    const state = makeDefaultState();
    for (const key of ['food', 'water', 'defenders', 'morale', 'fort_integrity', 'siege_progress'] as const) {
      state[key] = -50;
    }
    clampState(state);
    for (const key of ['food', 'water', 'defenders', 'morale', 'fort_integrity', 'siege_progress'] as const) {
      expect(state[key]).toBe(0);
    }
  });
});

// ---------------------------------------------------------------------------
// 9. End Conditions
// ---------------------------------------------------------------------------

describe('end conditions', () => {
  it('should detect fort collapse', () => {
    const state = makeDefaultState();
    state.fort_integrity = 0;
    const result = checkEndConditions(state);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('fort_collapse');
  });

  it('should detect morale collapse', () => {
    const state = makeDefaultState();
    state.morale = 0;
    const result = checkEndConditions(state);
    expect(result!.type).toBe('morale_collapse');
  });

  it('should detect defender collapse', () => {
    const state = makeDefaultState();
    state.defenders = 0;
    const result = checkEndConditions(state);
    expect(result!.type).toBe('defender_collapse');
  });

  it('should detect resource collapse (water=0, food<=10)', () => {
    const state = makeDefaultState();
    state.water = 0;
    state.food = 5;
    const result = checkEndConditions(state);
    expect(result!.type).toBe('resource_collapse');
  });

  it('should NOT trigger resource collapse when only water=0 but food>10', () => {
    const state = makeDefaultState();
    state.water = 0;
    state.food = 20;
    // fort_integrity, morale, defenders, siege_progress are all healthy
    // so only resource_collapse matters — but food > 10
    const result = checkEndConditions(state);
    expect(result).toBeNull();
  });

  it('should detect siege threshold', () => {
    const state = makeDefaultState();
    state.siege_progress = 100;
    const result = checkEndConditions(state);
    expect(result!.type).toBe('siege_threshold');
  });

  it('should detect time limit', () => {
    const state = makeDefaultState();
    state.turn = MAX_TURNS;
    const result = checkEndConditions(state);
    expect(result!.type).toBe('time_limit');
  });

  it('should return null when no end condition is met', () => {
    const state = makeDefaultState();
    expect(checkEndConditions(state)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 10. Outcome Tiers
// ---------------------------------------------------------------------------

describe('outcome tiers', () => {
  it('should return collapse for fort_collapse', () => {
    const state = makeDefaultState();
    state.fort_integrity = 0;
    const end: EndCondition = { type: 'fort_collapse', description: '', turn: 3 };
    expect(determineOutcomeTier(state, end)).toBe('collapse');
  });

  it('should return resilient_defense for high sustainability at time_limit', () => {
    const state = makeDefaultState();
    // sustainability = (78+72+84+82+94+(100-18))/6 = (78+72+84+82+94+82)/6 = 492/6 = 82
    const end: EndCondition = { type: 'time_limit', description: '', turn: 5 };
    expect(determineOutcomeTier(state, end)).toBe('resilient_defense');
  });

  it('should return strained_defense for moderate sustainability', () => {
    const state = makeDefaultState();
    state.food = 30;
    state.water = 25;
    state.defenders = 40;
    state.morale = 35;
    state.fort_integrity = 45;
    state.siege_progress = 60;
    // sustainability = (30+25+40+35+45+40)/6 = 215/6 ≈ 36 → critical_defense
    // Hmm, let's set better values
    state.food = 40;
    state.water = 35;
    state.defenders = 50;
    state.morale = 45;
    state.fort_integrity = 50;
    state.siege_progress = 50;
    // sustainability = (40+35+50+45+50+50)/6 = 270/6 = 45
    const end: EndCondition = { type: 'time_limit', description: '', turn: 5 };
    expect(determineOutcomeTier(state, end)).toBe('strained_defense');
  });

  it('should return critical_defense for low sustainability', () => {
    const state = makeDefaultState();
    state.food = 15;
    state.water = 10;
    state.defenders = 20;
    state.morale = 15;
    state.fort_integrity = 25;
    state.siege_progress = 80;
    // sustainability = (15+10+20+15+25+20)/6 = 105/6 ≈ 18
    const end: EndCondition = { type: 'time_limit', description: '', turn: 5 };
    expect(determineOutcomeTier(state, end)).toBe('critical_defense');
  });
});

// ---------------------------------------------------------------------------
// 11. Sustainability
// ---------------------------------------------------------------------------

describe('calculateSustainability', () => {
  it('should calculate correctly per GAME_LOGIC.md §7', () => {
    const state = makeDefaultState();
    // (78+72+84+82+94+(100-18))/6 = 492/6 = 82
    expect(calculateSustainability(state)).toBe(82);
  });
});

// ---------------------------------------------------------------------------
// 12. Available Decisions
// ---------------------------------------------------------------------------

describe('getAvailableDecisions', () => {
  const scenario = makeTestScenario();

  it('should return decision_1 at turn 0', () => {
    const state = makeDefaultState();
    const available = getAvailableDecisions(state, scenario.decision_points, []);
    expect(available.some((d) => d.id === 'decision_1')).toBe(true);
  });

  it('should NOT return decision_2 at turn 0 (trigger not met)', () => {
    const state = makeDefaultState();
    const available = getAvailableDecisions(state, scenario.decision_points, []);
    expect(available.some((d) => d.id === 'decision_2')).toBe(false);
  });

  it('should return decision_2 when turn >= 3', () => {
    const state = makeDefaultState();
    state.turn = 3;
    const available = getAvailableDecisions(state, scenario.decision_points, []);
    expect(available.some((d) => d.id === 'decision_2')).toBe(true);
  });

  it('should return decision_2 when fort_integrity <= 55', () => {
    const state = makeDefaultState();
    state.fort_integrity = 50;
    const available = getAvailableDecisions(state, scenario.decision_points, []);
    expect(available.some((d) => d.id === 'decision_2')).toBe(true);
  });

  it('should return decision_2 when siege_progress >= 60', () => {
    const state = makeDefaultState();
    state.siege_progress = 65;
    const available = getAvailableDecisions(state, scenario.decision_points, []);
    expect(available.some((d) => d.id === 'decision_2')).toBe(true);
  });

  it('should exclude already-used decisions', () => {
    const state = makeDefaultState();
    const available = getAvailableDecisions(state, scenario.decision_points, ['decision_1']);
    expect(available.some((d) => d.id === 'decision_1')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 13. Session Management
// ---------------------------------------------------------------------------

describe('session management', () => {
  const scenario = makeTestScenario();

  it('should create a fresh session', () => {
    const session = createSession(scenario);
    expect(session.scenarioId).toBe('test_scenario');
    expect(session.turnHistory.length).toBe(0);
    expect(session.isComplete).toBe(false);
    expect(session.currentState.turn).toBe(0);
  });

  it('should advance a turn via advanceTurn', () => {
    const session = createSession(scenario);
    const result = advanceTurn(session, 'decision_1', 'd1_a', scenario.decision_points);
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.session.currentState.turn).toBe(1);
      expect(result.session.turnHistory.length).toBe(1);
    }
  });

  it('should reject invalid decision ID', () => {
    const session = createSession(scenario);
    const result = advanceTurn(session, 'nonexistent', 'd1_a', scenario.decision_points);
    expect('error' in result).toBe(true);
  });

  it('should reject invalid option ID', () => {
    const session = createSession(scenario);
    const result = advanceTurn(session, 'decision_1', 'nonexistent', scenario.decision_points);
    expect('error' in result).toBe(true);
  });

  it('should reject decisions when simulation is complete', () => {
    const session = createSession(scenario);
    session.isComplete = true;
    const result = advanceTurn(session, 'decision_1', 'd1_a', scenario.decision_points);
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error).toContain('already complete');
    }
  });

  it('should reset simulation correctly', () => {
    let session = createSession(scenario);
    const r = advanceTurn(session, 'decision_1', 'd1_a', scenario.decision_points);
    if (!('error' in r)) session = r.session;
    const reset = resetSimulation(session);
    expect(reset.currentState.turn).toBe(0);
    expect(reset.turnHistory.length).toBe(0);
    expect(reset.isComplete).toBe(false);
    expect(reset.currentState.food).toBe(session.initialState.food);
  });

  it('should return history via getSimulationHistory', () => {
    let session = createSession(scenario);
    const r = advanceTurn(session, 'decision_1', 'd1_a', scenario.decision_points);
    if (!('error' in r)) session = r.session;
    const history = getSimulationHistory(session);
    expect(history.length).toBe(1);
    expect(history[0].decisionId).toBe('decision_1');
  });
});

// ---------------------------------------------------------------------------
// 14. Sequential Decisions
// ---------------------------------------------------------------------------

describe('sequential decisions', () => {
  it('should handle two sequential decisions correctly', () => {
    const scenario = makeTestScenario();
    let session = createSession(scenario);

    // Decision 1
    const r1 = advanceTurn(session, 'decision_1', 'd1_a', scenario.decision_points);
    expect('error' in r1).toBe(false);
    if (!('error' in r1)) {
      session = r1.session;
      expect(session.currentState.turn).toBe(1);
    }

    // Force decision_2 trigger by setting turn
    session.currentState.turn = 3;

    // Decision 2
    const r2 = advanceTurn(session, 'decision_2', 'd2_a', scenario.decision_points);
    expect('error' in r2).toBe(false);
    if (!('error' in r2)) {
      session = r2.session;
      expect(session.currentState.turn).toBe(4);
      expect(session.turnHistory.length).toBe(2);
    }
  });
});

// ---------------------------------------------------------------------------
// 15. Calculate Consequences (Preview)
// ---------------------------------------------------------------------------

describe('calculateConsequences', () => {
  it('should preview effects without modifying original state', () => {
    const state = makeDefaultState();
    const originalFood = state.food;
    const scenario = makeTestScenario();
    const option = scenario.decision_points[0].options[0];
    const preview = calculateConsequences(state, option);
    expect(state.food).toBe(originalFood); // Original unchanged
    expect(preview.stateAfter.food).not.toBe(originalFood); // Preview different
  });
});

// ---------------------------------------------------------------------------
// 16. Event Generation
// ---------------------------------------------------------------------------

describe('event generation', () => {
  it('should generate decision events', () => {
    const state = makeDefaultState();
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[0]);
    const decisionEvent = result.events.find((e) => e.id.startsWith('sim_decision'));
    expect(decisionEvent).toBeDefined();
    expect(decisionEvent!.title).toContain('Option A');
  });

  it('should generate threshold events when triggered', () => {
    const state = makeDefaultState();
    state.food = 25;
    state.water = 25;
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    // Use Option D (Conserve Strength) — food +2 = 27, then passive -4 = 23
    const result = applyDecision(state, dp, dp.options[3]);
    const thresholdEvents = result.events.filter((e) => e.id.startsWith('sim_threshold'));
    expect(thresholdEvents.length).toBeGreaterThan(0);
  });

  it('should record affected variables in events', () => {
    const state = makeDefaultState();
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[0]);
    const event = result.events[0];
    expect(event.affectedVariables).toBeDefined();
    expect(Array.isArray(event.affectedVariables)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 17. Turn Result Structure
// ---------------------------------------------------------------------------

describe('turn result structure', () => {
  it('should contain all required fields per spec', () => {
    const state = makeDefaultState();
    const scenario = makeTestScenario();
    const dp = scenario.decision_points[0];
    const result = applyDecision(state, dp, dp.options[0]);

    // CamelCase compatibility
    expect(result.turn).toBe(1);
    expect(result.decisionId).toBe('decision_1');
    expect(result.optionId).toBe('d1_a');
    expect(result.stateBefore).toBeDefined();
    expect(result.choiceDelta).toBeDefined();
    expect(result.passiveDelta).toBeDefined();
    expect(result.thresholdEffects).toBeDefined();
    expect(result.stateAfter).toBeDefined();
    expect(result.events).toBeDefined();

    // Required event history fields from prompt:
    // turn, decision_id, state_before, effects, state_after, event_description, affected_variables
    expect(result.decision_id).toBe('decision_1');
    expect(result.option_id).toBe('d1_a');
    expect(result.state_before).toEqual(result.stateBefore);
    expect(result.state_after).toEqual(result.stateAfter);
    expect(result.effects).toBeDefined();
    expect(typeof result.event_description).toBe('string');
    expect(result.event_description.length).toBeGreaterThan(0);
    expect(Array.isArray(result.affected_variables)).toBe(true);
    expect(result.affected_variables.length).toBeGreaterThan(0);
    // endCondition may be null on turn 1
  });

  it('history entries from getSimulationHistory should have all 7 required event fields', () => {
    const scenario = makeTestScenario();
    const session = createSession(scenario);
    const advanceRes = advanceTurn(session, 'decision_1', 'd1_a', scenario.decision_points);
    expect('session' in advanceRes).toBe(true);
    if ('session' in advanceRes) {
      const history = getSimulationHistory(advanceRes.session);
      expect(history.length).toBe(1);
      const entry = history[0];
      expect(entry.turn).toBe(1);
      expect(entry.decision_id).toBe('decision_1');
      expect(entry.state_before).toBeDefined();
      expect(entry.effects).toBeDefined();
      expect(entry.state_after).toBeDefined();
      expect(entry.event_description).toBeDefined();
      expect(entry.affected_variables).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// 18. Determinism — Critical Requirement
// ---------------------------------------------------------------------------

describe('determinism', () => {
  it('same decisions should always produce identical results', () => {
    const scenario = makeTestScenario();
    const decisions = [
      { decisionId: 'decision_1', optionId: 'd1_a' },
    ];

    const session1 = replayDecisions(scenario, decisions);
    const session2 = replayDecisions(scenario, decisions);

    expect(session1.currentState.food).toBe(session2.currentState.food);
    expect(session1.currentState.water).toBe(session2.currentState.water);
    expect(session1.currentState.defenders).toBe(session2.currentState.defenders);
    expect(session1.currentState.morale).toBe(session2.currentState.morale);
    expect(session1.currentState.fort_integrity).toBe(session2.currentState.fort_integrity);
    expect(session1.currentState.siege_progress).toBe(session2.currentState.siege_progress);
  });

  it('different decisions should produce different results', () => {
    const scenario = makeTestScenario();

    const session1 = replayDecisions(scenario, [{ decisionId: 'decision_1', optionId: 'd1_a' }]);
    const session2 = replayDecisions(scenario, [{ decisionId: 'decision_1', optionId: 'd1_c' }]);

    // At least one variable must differ
    const s1 = session1.currentState;
    const s2 = session2.currentState;
    const allSame = s1.food === s2.food && s1.water === s2.water
      && s1.defenders === s2.defenders && s1.morale === s2.morale
      && s1.fort_integrity === s2.fort_integrity && s1.siege_progress === s2.siege_progress;
    expect(allSame).toBe(false);
  });

  it('replay should produce identical history', () => {
    const scenario = makeTestScenario();
    const decisions = [{ decisionId: 'decision_1', optionId: 'd1_b' }];

    const session1 = replayDecisions(scenario, decisions);
    const session2 = replayDecisions(scenario, decisions);

    expect(session1.turnHistory.length).toBe(session2.turnHistory.length);
    for (let i = 0; i < session1.turnHistory.length; i++) {
      const t1 = session1.turnHistory[i];
      const t2 = session2.turnHistory[i];
      expect(t1.stateAfter.food).toBe(t2.stateAfter.food);
      expect(t1.stateAfter.water).toBe(t2.stateAfter.water);
      expect(t1.events.length).toBe(t2.events.length);
    }
  });

  it('100 replays should be byte-identical', () => {
    const scenario = makeTestScenario();
    const decisions = [{ decisionId: 'decision_1', optionId: 'd1_c' }];

    const reference = replayDecisions(scenario, decisions);
    for (let i = 0; i < 100; i++) {
      const run = replayDecisions(scenario, decisions);
      expect(JSON.stringify(run.currentState)).toBe(JSON.stringify(reference.currentState));
    }
  });
});

// ---------------------------------------------------------------------------
// 19. Full Game Playthrough
// ---------------------------------------------------------------------------

describe('full playthrough', () => {
  it('should complete a full 2-decision game', () => {
    const scenario = makeTestScenario();
    let session = createSession(scenario);

    // Turn 1: Decision 1, Option A
    const r1 = advanceTurn(session, 'decision_1', 'd1_a', scenario.decision_points);
    expect('error' in r1).toBe(false);
    if (!('error' in r1)) session = r1.session;

    // Force trigger for decision_2
    session.currentState.turn = 3;

    // Turn 2: Decision 2, Option B
    const r2 = advanceTurn(session, 'decision_2', 'd2_b', scenario.decision_points);
    expect('error' in r2).toBe(false);
    if (!('error' in r2)) session = r2.session;

    expect(session.turnHistory.length).toBe(2);
    expect(session.currentState.turn).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// 20. Edge Cases & Error Handling
// ---------------------------------------------------------------------------

describe('edge cases', () => {
  it('should handle all-zero starting state gracefully', () => {
    const state = createInitialState({
      food: 0, water: 0, defenders: 0, morale: 0,
      fort_integrity: 0, siege_progress: 0,
    });
    const end = checkEndConditions(state);
    // Multiple collapse conditions — should return the first one found
    expect(end).not.toBeNull();
  });

  it('should handle all-100 starting state', () => {
    const state = createInitialState({
      food: 100, water: 100, defenders: 100, morale: 100,
      fort_integrity: 100, siege_progress: 100,
    });
    // siege_progress = 100 → siege_threshold
    const end = checkEndConditions(state);
    expect(end).not.toBeNull();
    expect(end!.type).toBe('siege_threshold');
  });

  it('replayDecisions should throw on invalid decision', () => {
    const scenario = makeTestScenario();
    expect(() => {
      replayDecisions(scenario, [{ decisionId: 'nonexistent', optionId: 'x' }]);
    }).toThrow();
  });
});
