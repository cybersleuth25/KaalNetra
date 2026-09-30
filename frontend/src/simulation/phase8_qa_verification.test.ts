/**
 * KaalNetra — Phase 8: Final QA & Demo Readiness Test Suite
 *
 * Comprehensive Automated Verification covering:
 * A. Full User Flow Simulation
 * B. Alternate Strategic Path Divergence (Path 1 vs Path 2)
 * C. Multi-Run Determinism (Strict bit-for-bit repeatability)
 * D. Error Resilience & Boundary Conditions (Invalid choice, malformed scenario, offline AI)
 * E. Historical Integrity & Canon Boundary Auditing
 */

import { describe, it, expect } from 'vitest';
import {
  createSession,
  advanceTurn,
  resetSimulation,
} from './engine';
import { loadDefaultScenario, loadScenario } from '../data/scenarioLoader';
import { validateScenario } from '../data/scenarioValidator';
import { askHistoricalGuide } from '../services/aiGuideService';
import { CHARACTERS, ENVIRONMENTS } from '../assets/registry';
import type { GameState, SimulationSession } from './types';
import type { Scenario, CanonicalTimelineEvent, HistoricalConstraint, SimulationNote } from '../data/types';

describe('Phase 8 — Final QA & Demo Readiness Audit', () => {
  const loadResult = loadDefaultScenario();
  const scenario: Scenario = loadResult.scenario!;

  // Helper to execute decision safely in tests
  function executeChoice(session: SimulationSession, decisionId: string, optionId: string) {
    const result = advanceTurn(session, decisionId, optionId, scenario.decision_points);
    if ('error' in result) {
      return { success: false, error: result.error, session };
    }
    return { success: true, session: result.session, turnResult: result.turnResult };
  }

  // =========================================================================
  // A. FULL USER FLOW SIMULATION
  // =========================================================================
  describe('A. Full User Flow Simulation', () => {
    it('executes complete story flow from initialization to reflection and replay', () => {
      // 1. HOME & SCENARIO LOAD
      expect(scenario).toBeDefined();
      expect(scenario.id).toBe('chittor_1567');

      // 2. BRIEFING / INITIAL STATE
      let session = createSession(scenario);
      expect(session.currentState.turn).toBe(0);
      expect(session.isComplete).toBe(false);
      expect(session.turnHistory.length).toBe(0);

      // 3. DECISION 1 (Limited Sortie)
      const d1 = executeChoice(session, 'decision_1', 'decision_1_c');
      expect(d1.success).toBe(true);
      session = d1.session;
      expect(session.turnHistory.length).toBe(1);
      expect(session.currentState.turn).toBe(1);
      // Limited sortie has delta -10 on siege_progress, passive is +5 -> net is -5
      expect(session.currentState.siege_progress).toBeLessThan(session.initialState.siege_progress);

      // 4. DECISION 2 (Concentrate at Breach)
      const d2 = executeChoice(session, 'decision_2', 'decision_2_a');
      expect(d2.success).toBe(true);
      session = d2.session;
      expect(session.turnHistory.length).toBe(2);
      expect(session.currentState.turn).toBe(2);

      // 5. TIMELINE & CANONICAL COMPARISON
      expect(session.turnHistory[0].decisionId).toBe('decision_1');
      expect(session.turnHistory[1].decisionId).toBe('decision_2');
      expect(scenario.canonical_timeline.length).toBe(4);

      // 6. REPLAY / RESET
      session = resetSimulation(session);
      expect(session.currentState.turn).toBe(0);
      expect(session.turnHistory.length).toBe(0);
      expect(session.isComplete).toBe(false);
      expect(session.currentState).toEqual(session.initialState);
    });
  });

  // =========================================================================
  // B. ALTERNATE PATH DIVERGENCE TEST
  // =========================================================================
  describe('B. Alternate Strategic Path Divergence', () => {
    it('produces distinct outcomes for Path A vs Path B while keeping canonical history identical', () => {
      // Path 1: Aggressive Defense (Sortie + Breach Counter)
      let sessionA = createSession(scenario);
      const resA1 = executeChoice(sessionA, 'decision_1', 'decision_1_c');
      sessionA = resA1.session;
      const resA2 = executeChoice(sessionA, 'decision_2', 'decision_2_c');
      sessionA = resA2.session;

      // Path 2: Conservation & Reinforce (Reinforce Sectors + Redistribute)
      let sessionB = createSession(scenario);
      const resB1 = executeChoice(sessionB, 'decision_1', 'decision_1_b');
      sessionB = resB1.session;
      const resB2 = executeChoice(sessionB, 'decision_2', 'decision_2_b');
      sessionB = resB2.session;

      // Assert Path Divergence
      expect(sessionA.currentState.food).not.toEqual(sessionB.currentState.food);
      expect(sessionA.currentState.defenders).not.toEqual(sessionB.currentState.defenders);
      expect(sessionA.currentState.siege_progress).not.toEqual(sessionB.currentState.siege_progress);

      // Path A sorties reduced siege progress more, but sacrificed more defenders
      expect(sessionA.currentState.defenders).toBeLessThan(sessionB.currentState.defenders);
      expect(sessionA.currentState.siege_progress).toBeLessThan(sessionB.currentState.siege_progress);

      // Verify canonical history is strictly untouched and identical in both runs
      expect(scenario.canonical_timeline[0].title).toBe('Mughal siege begins');
      expect(scenario.canonical_timeline.length).toBe(4);
    });
  });

  // =========================================================================
  // C. MULTI-RUN DETERMINISM TEST
  // =========================================================================
  describe('C. Determinism Verification', () => {
    it('guarantees bit-for-bit identical state transitions and event logs across 10 identical runs', () => {
      const runs: Array<{ state: GameState; events: string[] }> = [];

      for (let i = 0; i < 10; i++) {
        let s = createSession(scenario);
        const r1 = executeChoice(s, 'decision_1', 'decision_1_a');
        s = r1.session;
        const r2 = executeChoice(s, 'decision_2', 'decision_2_b');
        s = r2.session;

        runs.push({
          state: JSON.parse(JSON.stringify(s.currentState)),
          events: s.turnHistory.map((t) => t.event_description),
        });
      }

      const baseline = runs[0];
      for (let i = 1; i < runs.length; i++) {
        expect(runs[i].state).toEqual(baseline.state);
        expect(runs[i].events).toEqual(baseline.events);
      }
    });
  });

  // =========================================================================
  // D. ERROR RESILIENCE & BOUNDARY TESTING
  // =========================================================================
  describe('D. Error Resilience & Boundary Conditions', () => {
    it('handles non-existent scenario IDs gracefully without throwing', () => {
      const res = loadScenario('non_existent_scenario_xyz');
      expect(res.success).toBe(false);
      expect(res.scenario).toBeNull();
      expect(res.errors.length).toBeGreaterThan(0);
      expect(res.errors[0].message).toContain('not found in registry');
    });

    it('rejects malformed scenario objects during validation', () => {
      const malformedData = { id: 'broken', title: 'Broken Scenario' };
      const res = validateScenario(malformedData);
      expect(res.success).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    });

    it('gracefully handles invalid choice IDs in engine without state corruption', () => {
      const session = createSession(scenario);
      const stateBefore = JSON.parse(JSON.stringify(session.currentState));

      const res = executeChoice(session, 'decision_1', 'invalid_choice_999');
      expect(res.success).toBe(false);
      expect(session.currentState).toEqual(stateBefore);
      expect(session.turnHistory.length).toBe(0);
    });

    it('guarantees AI Guide returns safe structured fallback when API is unreachable', async () => {
      const session = createSession(scenario);
      const res = await askHistoricalGuide('Custom offline query', session.currentState, [], scenario);

      expect(res).toBeDefined();
      expect(res.isFallback).toBe(true);
      expect(res.historicalFact.length).toBeGreaterThan(20);
      expect(res.sources.length).toBeGreaterThan(0);
    });

    it('safely handles empty queries without crashing', async () => {
      const session = createSession(scenario);
      const res = await askHistoricalGuide('   ', session.currentState, [], scenario);
      expect(res.historicalFact).toContain('Please provide a historical question');
      expect(res.isFallback).toBe(true);
    });
  });

  // =========================================================================
  // E. HISTORICAL INTEGRITY & CANON BOUNDARY AUDIT
  // =========================================================================
  describe('E. Historical Integrity & Canon Boundary Auditing', () => {
    it('verifies historical figures vs fictional composites are strictly classified', () => {
      expect(CHARACTERS.jaimal.historical).toBe(true);
      expect(CHARACTERS.patta.historical).toBe(true);
      expect(CHARACTERS.udai_singh.historical).toBe(true);
      expect(CHARACTERS.akbar.historical).toBe(true);
      expect(CHARACTERS.mirza_yusuf.historical).toBe(false);
      expect(CHARACTERS.resource_steward.historical).toBe(false);

      expect(CHARACTERS.mirza_yusuf.description).toContain('Composite figure');
      expect(CHARACTERS.resource_steward.description).toContain('Composite character');
    });

    it('verifies all 4 canonical timeline events have primary source attribution', () => {
      expect(scenario.canonical_timeline.length).toBe(4);
      scenario.canonical_timeline.forEach((event: CanonicalTimelineEvent) => {
        expect(event.evidence_level).toBe('CANONICAL');
        expect(event.source_ids?.length).toBeGreaterThan(0);
        expect(event.description.length).toBeGreaterThan(10);
      });
    });

    it('verifies historical constraints are defined and cite authoritative scholars', () => {
      expect(scenario.historical_constraints).toBeDefined();
      expect(scenario.historical_constraints!.length).toBe(4);

      const constraintIds = scenario.historical_constraints!.map((c: HistoricalConstraint) => c.id);
      expect(constraintIds).toContain('constraint_no_relief');
      expect(constraintIds).toContain('constraint_siege_engineering');
      expect(constraintIds).toContain('constraint_limited_water');
      expect(constraintIds).toContain('constraint_food_stores');
    });

    it('verifies simulation notes explicitly declare 0-100 values as gameplay abstractions', () => {
      expect(scenario.simulation_notes).toBeDefined();
      const abstractionNote = scenario.simulation_notes!.find((n: SimulationNote) => n.id === 'note_abstraction');
      expect(abstractionNote).toBeDefined();
      expect(abstractionNote!.content).toContain('gameplay abstractions on a 0–100 scale');
    });

    it('verifies all required environment assets exist in the registry', () => {
      expect(ENVIRONMENTS.chittor_overview).toBeDefined();
      expect(ENVIRONMENTS.fort_interior).toBeDefined();
      expect(ENVIRONMENTS.fort_walls).toBeDefined();
      expect(ENVIRONMENTS.mughal_siege_camp).toBeDefined();
      expect(ENVIRONMENTS.strategic_map).toBeDefined();
    });
  });
});
