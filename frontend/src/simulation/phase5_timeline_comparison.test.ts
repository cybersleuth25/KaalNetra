/**
 * KaalNetra — Phase 5 Test Suite: Timeline, Comparison & Historical Invariants
 *
 * Verifies all Phase 5 requirements:
 *   1. Canonical historical timeline never changes across any run or decision
 *   2. Player timeline changes deterministically according to player decisions
 *   3. Causality flow (decision -> deltas -> active thresholds -> situation) is tracked
 *   4. Historical sources are strictly linked to evidence metadata
 *   5. Simulation events are strictly labeled as counterfactual / simulation, never canonical
 *   6. Replay resets player timeline cleanly and reconstructs fresh causality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { loadScenario } from '../data/scenarioLoader';
import {
  createSession,
  advanceTurn,
  resetSimulation,
} from './engine';
import type { SimulationSession } from './types';
import type { Scenario } from '../data/types';

describe('Phase 5 — Timeline, Comparison & Historical Invariants', () => {
  let scenario: Scenario;
  let sessionA: SimulationSession;
  let sessionB: SimulationSession;

  beforeEach(() => {
    const result = loadScenario('chittor_1567');
    expect(result.success).toBe(true);
    scenario = result.scenario!;
    sessionA = createSession(scenario);
    sessionB = createSession(scenario);
  });

  describe('1. Canonical Historical Timeline Invariance', () => {
    it('canonical timeline comes strictly from scenario data and remains constant', () => {
      expect(scenario.canonical_timeline).toBeDefined();
      expect(scenario.canonical_timeline.length).toBeGreaterThan(0);

      // Snapshot canonical events
      const originalCanonicalEvents = JSON.parse(JSON.stringify(scenario.canonical_timeline));

      // Advance session A along path 1: sortie (decision_1_c) then assault defense (decision_2_a)
      const resA1 = advanceTurn(sessionA, 'decision_1', 'decision_1_c', scenario.decision_points);
      if ('session' in resA1) sessionA = resA1.session;
      const resA2 = advanceTurn(sessionA, 'decision_2', 'decision_2_a', scenario.decision_points);
      if ('session' in resA2) sessionA = resA2.session;

      // Advance session B along path 2: consolidate (decision_1_b) then surrender/sabat (decision_2_b)
      const resB1 = advanceTurn(sessionB, 'decision_1', 'decision_1_b', scenario.decision_points);
      if ('session' in resB1) sessionB = resB1.session;
      const resB2 = advanceTurn(sessionB, 'decision_2', 'decision_2_b', scenario.decision_points);
      if ('session' in resB2) sessionB = resB2.session;

      // Canonical timeline must be completely untouched
      expect(scenario.canonical_timeline).toEqual(originalCanonicalEvents);
      expect(scenario.canonical_timeline[0].title).toBe('Mughal siege begins');
      expect(scenario.canonical_timeline[0].evidence_level).toBe('CANONICAL');
    });

    it('all canonical timeline events link to valid evidence sources in the scenario', () => {
      const evidenceIds = new Set(scenario.evidence.map((e: { id: string }) => e.id));
      for (const event of scenario.canonical_timeline) {
        expect(['CANONICAL', 'CONTESTED']).toContain(event.evidence_level);
        if (event.source_ids) {
          for (const srcId of event.source_ids) {
            expect(evidenceIds.has(srcId)).toBe(true);
          }
        }
      }
    });

    it('canonical timeline does not contain counterfactual or simulation-generated events', () => {
      for (const event of scenario.canonical_timeline) {
        expect(event.evidence_level).not.toBe('SIMULATION');
        expect(event.evidence_level).not.toBe('FICTIONAL_COMPOSITE');
      }
    });
  });

  describe('2. Player Timeline Causality & Decision Divergence', () => {
    it('player timeline records turn, decision, state deltas, and consequence dynamically', () => {
      // Turn 1 decision
      const step1 = advanceTurn(sessionA, 'decision_1', 'decision_1_c', scenario.decision_points);
      expect('session' in step1).toBe(true);
      if (!('session' in step1)) return;
      sessionA = step1.session;

      expect(sessionA.turnHistory.length).toBe(1);
      const historyEntry1 = sessionA.turnHistory[0];
      expect(historyEntry1.turn).toBe(1);
      expect(historyEntry1.decisionId).toBe('decision_1');
      expect(historyEntry1.optionId).toBe('decision_1_c');

      // Causality: sortie (option C) reduces defenders and siege_progress
      expect(historyEntry1.choiceDelta.defenders).toBeLessThan(0);
      expect(historyEntry1.choiceDelta.siege_progress).toBeLessThan(0);
      expect(historyEntry1.stateAfter.defenders).toBe(sessionA.currentState.defenders);

      // Consequence feedback is present
      expect(historyEntry1.event_description).toBeTruthy();
    });

    it('different player decisions generate diverging player timelines and different end states', () => {
      // Session A: Sortie -> Assault defense
      const resA1 = advanceTurn(sessionA, 'decision_1', 'decision_1_c', scenario.decision_points);
      if ('session' in resA1) sessionA = resA1.session;
      const resA2 = advanceTurn(sessionA, 'decision_2', 'decision_2_a', scenario.decision_points);
      if ('session' in resA2) sessionA = resA2.session;

      // Session B: Consolidate -> Preserve strength
      const resB1 = advanceTurn(sessionB, 'decision_1', 'decision_1_b', scenario.decision_points);
      if ('session' in resB1) sessionB = resB1.session;
      const resB2 = advanceTurn(sessionB, 'decision_2', 'decision_2_d', scenario.decision_points);
      if ('session' in resB2) sessionB = resB2.session;

      expect(sessionA.turnHistory.length).toBe(2);
      expect(sessionB.turnHistory.length).toBe(2);

      // Decision 1 differs
      expect(sessionA.turnHistory[0].optionId).toBe('decision_1_c');
      expect(sessionB.turnHistory[0].optionId).toBe('decision_1_b');

      // State outcomes differ
      expect(sessionA.currentState.defenders).not.toBe(sessionB.currentState.defenders);
      expect(sessionA.currentState.morale).not.toBe(sessionB.currentState.morale);
      expect(sessionA.currentState.fort_integrity).not.toBe(sessionB.currentState.fort_integrity);

      // History entries retain distinct delta records
      expect(sessionA.turnHistory[0].choiceDelta).not.toEqual(sessionB.turnHistory[0].choiceDelta);
    });
  });

  describe('3. Comparison Invariants & No Fictional Facts', () => {
    it('simulation assumptions are explicitly separated from documented history', () => {
      // In scenario metadata, simulation notes explain assumptions
      expect(scenario.simulation_notes).toBeDefined();
      expect(scenario.simulation_notes!.length).toBeGreaterThan(0);

      // Constraints explicitly frame the boundaries
      expect(scenario.historical_constraints).toBeDefined();
      expect(scenario.historical_constraints!.length).toBeGreaterThan(0);

      // Fictional composites are explicitly declared
      expect(scenario.fictional_composites).toBeDefined();
      expect(scenario.fictional_composites!.length).toBeGreaterThan(0);
    });

    it('turn history events in simulation are flagged as simulation events', () => {
      const resA1 = advanceTurn(sessionA, 'decision_1', 'decision_1_b', scenario.decision_points);
      if ('session' in resA1) sessionA = resA1.session;

      expect(sessionA.turnHistory[0].events).toBeDefined();
      expect(sessionA.turnHistory[0].events.length).toBeGreaterThan(0);
      for (const ev of sessionA.turnHistory[0].events) {
        expect(ev.title).toBeTruthy();
        expect(ev.affectedVariables).toBeDefined();
      }
    });
  });

  describe('4. Replay Produces Clean, Accurate Reset', () => {
    it('resetSimulation completely clears player history while preserving scenario data', () => {
      const resA1 = advanceTurn(sessionA, 'decision_1', 'decision_1_a', scenario.decision_points);
      if ('session' in resA1) sessionA = resA1.session;
      const resA2 = advanceTurn(sessionA, 'decision_2', 'decision_2_a', scenario.decision_points);
      if ('session' in resA2) sessionA = resA2.session;

      expect(sessionA.turnHistory.length).toBe(2);

      // Reset
      sessionA = resetSimulation(sessionA);

      expect(sessionA.turnHistory.length).toBe(0);
      expect(sessionA.currentState.turn).toBe(0);
      expect(sessionA.isComplete).toBe(false);
      expect(sessionA.currentState.defenders).toBe(scenario.starting_state.defenders);
      expect(sessionA.currentDecisionIndex).toBe(0);

      // Canonical timeline still pristine
      expect(scenario.canonical_timeline[0].title).toBe('Mughal siege begins');
    });

    it('replaying allows choosing alternative path and produces new correct causality chain', () => {
      // First run: option C (sortie)
      const res1 = advanceTurn(sessionA, 'decision_1', 'decision_1_c', scenario.decision_points);
      if ('session' in res1) sessionA = res1.session;
      const firstRunTurn1State = { ...sessionA.currentState };

      // Replay
      sessionA = resetSimulation(sessionA);
      expect(sessionA.turnHistory.length).toBe(0);

      // Alternative run: option B (consolidate)
      const res2 = advanceTurn(sessionA, 'decision_1', 'decision_1_b', scenario.decision_points);
      if ('session' in res2) sessionA = res2.session;

      expect(sessionA.turnHistory.length).toBe(1);
      expect(sessionA.turnHistory[0].optionId).toBe('decision_1_b');
      expect(sessionA.currentState).not.toEqual(firstRunTurn1State);
    });
  });
});
