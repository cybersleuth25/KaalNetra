/**
 * KaalNetra — Phase 7 Verification Test Suite
 *
 * Verifies:
 * 1. Independent deterministic simulation engine: AI Guide cannot mutate simulation state.
 * 2. Canonical history immutability.
 * 3. Source-grounding across all answers (citing Akbarnama, Badayuni, Chandra, Somani).
 * 4. Specific required inquiry questions:
 *    - "Why was the siege difficult?"
 *    - "Why did my decision reduce stability?"
 *    - "What constraints existed for the defenders?"
 * 5. "Explain My Decision" for decision points and choice trade-offs.
 * 6. Historiographical Reflection Assistant prompts.
 * 7. Graceful offline fallback without crashing or throwing errors.
 * 8. Explicit distinction between Historical Fact, Simulation Result, and AI Explanation.
 */

import { describe, it, expect } from 'vitest';
import {
  explainDecision,
  askHistoricalGuide,
  askReflectionAssistant,
  getOfflineDecisionExplanation,
  getOfflineQuestionAnswer,
  getOfflineReflection,
  PRIMARY_SOURCES,
} from '../services/aiGuideService';
import { loadDefaultScenario } from '../data/scenarioLoader';
import { createInitialState } from './engine';
import type { GameState, Scenario } from '../data/types';

describe('Phase 7 — Source-Grounded AI Guide Verification', () => {
  const loadResult = loadDefaultScenario();
  const scenario: Scenario = loadResult.scenario!;
  const initialState: GameState = createInitialState(scenario.starting_state);

  describe('1. Engine Independence & State Immutability', () => {
    it('calling AI Guide functions does NOT mutate the simulation state', async () => {
      const stateSnapshot = JSON.parse(JSON.stringify(initialState));
      const scenarioSnapshot = JSON.parse(JSON.stringify(scenario));

      const option = scenario.decision_points[0].options[0];
      await explainDecision(option, initialState, option.delta, scenario);
      await askHistoricalGuide('Why was the siege difficult?', initialState, [], scenario);
      await askReflectionAssistant('why_different', initialState, [], scenario);

      // Verify gameState remains pristine
      expect(initialState).toEqual(stateSnapshot);
      // Verify scenario remains pristine
      expect(scenario).toEqual(scenarioSnapshot);
    });

    it('canonical history entries remain strictly immutable', async () => {
      const canonicalBefore = JSON.parse(JSON.stringify(scenario.canonical_timeline));

      await askHistoricalGuide('What constraints existed for the defenders?', initialState, [], scenario);

      expect(scenario.canonical_timeline).toEqual(canonicalBefore);
      expect(scenario.canonical_timeline.length).toBeGreaterThan(0);
      expect(scenario.canonical_timeline[0].evidence_level).toBe('CANONICAL');
    });
  });

  describe('2. Mandatory Historical Inquiries', () => {
    it('answers "Why was the siege difficult?" with grounded geographical & engineering facts', async () => {
      const res = await askHistoricalGuide('Why was the siege difficult?', initialState, [], scenario);

      expect(res).toBeDefined();
      expect(res.historicalFact).toMatch(/basalt|cliff|500-foot|sabats|engineering/i);
      expect(res.simulationResult).toMatch(/fort integrity|resilience|siege/i);
      expect(res.aiExplanation).toMatch(/sabats|attrition|relief/i);
      expect(res.sources.length).toBeGreaterThanOrEqual(2);
      expect(res.sources.some((s) => s.includes('Akbarnama') || s.includes('Chandra'))).toBe(true);
    });

    it('answers "Why did my decision reduce stability?" explaining zero-sum trade-offs', async () => {
      const res = await askHistoricalGuide('Why did my decision reduce stability?', initialState, [], scenario);

      expect(res).toBeDefined();
      expect(res.historicalFact).toMatch(/dilemma|sortie|relief|attrition|artillery/i);
      expect(res.simulationResult).toMatch(/defenders|morale|fort_integrity|threshold/i);
      expect(res.aiExplanation).toMatch(/trade-offs|decrements|resistance|price/i);
      expect(res.uncertaintyNote).toBeDefined();
    });

    it('answers "What constraints existed for the defenders?" detailing the 4 core historical constraints', async () => {
      const res = await askHistoricalGuide('What constraints existed for the defenders?', initialState, [], scenario);

      expect(res).toBeDefined();
      // Verifies mention of encirclement/no relief, asymmetric technology/sabats, finite water, finite food
      expect(res.historicalFact).toMatch(/Encirclement|relief force|Mughal sappers|Water|food/i);
      expect(res.simulationResult).toMatch(/deterministically|decrease|resupply/i);
      expect(res.aiExplanation).toMatch(/inevitability|delay|exhaustion/i);
      expect(res.sources.some((s) => s.includes('Somani') || s.includes('Chandra'))).toBe(true);
    });
  });

  describe('3. Decision Explanation ("Explain My Decision")', () => {
    it('explains Decision 1 Option A (Fortress battlements defense)', async () => {
      const optA = scenario.decision_points[0].options[0]; // decision_1_option_a
      const res = await explainDecision(optA, initialState, optA.delta, scenario);

      expect(res.historicalFact).toMatch(/Jaimal|Patta|curtain walls|escalade/i);
      expect(res.simulationResult).toMatch(/defenders/i);
      expect(res.aiExplanation).toMatch(/stone battlements|artillery targets/i);
      expect(res.sources.some((s) => s.includes('Akbarnama'))).toBe(true);
    });

    it('explains Decision 1 Option B (Water and ration conservation)', async () => {
      const optB = scenario.decision_points[0].options[1]; // decision_1_option_b
      const res = await explainDecision(optB, initialState, optB.delta, scenario);

      expect(res.historicalFact).toMatch(/Gaumukh Kund|cisterns|reservoir/i);
      expect(res.simulationResult).toMatch(/food|water|siege_progress/i);
      expect(res.aiExplanation).toMatch(/conservation|endurance|sabats/i);
    });

    it('explains Decision 1 Option C (Night sorties)', async () => {
      const optC = scenario.decision_points[0].options[2]; // decision_1_option_c
      const res = await explainDecision(optC, initialState, optC.delta, scenario);

      expect(res.historicalFact).toMatch(/sortie|night|trench/i);
      expect(res.simulationResult).toMatch(/siege_progress|defenders/i);
      expect(res.aiExplanation).toMatch(/covered sabats|tactical resistance/i);
    });

    it('explains Decision 2 Option A (Reinforcing the breach)', async () => {
      const opt2A = scenario.decision_points[1].options[0]; // decision_2_option_a
      const res = await explainDecision(opt2A, initialState, opt2A.delta, scenario);

      expect(res.historicalFact).toMatch(/Lakhota|mine|Jaimal/i);
      expect(res.simulationResult).toMatch(/defenders|assault/i);
      expect(res.aiExplanation).toMatch(/mine breach|kill zone/i);
      expect(res.uncertaintyNote).toMatch(/Akbarnama|Badayuni|Sangram/i);
    });
  });

  describe('4. Historical Reflection Assistant', () => {
    it('generates grounded reflection for "biggest_decision"', async () => {
      const res = await askReflectionAssistant('biggest_decision', initialState, [], scenario);

      expect(res.historicalFact).toMatch(/turning point|Lakhota|breach|Jaimal/i);
      expect(res.simulationResult).toMatch(/fort integrity|defenders/i);
      expect(res.aiExplanation).toMatch(/trajectory|aggressive|conservative/i);
    });

    it('generates grounded reflection for "historical_constraint"', async () => {
      const res = await askReflectionAssistant('historical_constraint', initialState, [], scenario);

      expect(res.historicalFact).toMatch(/absence of external relief|Mughal empire/i);
      expect(res.simulationResult).toMatch(/Water|food|dwindle/i);
      expect(res.aiExplanation).toMatch(/walls alone cannot defend/i);
    });

    it('generates grounded reflection for "why_different"', async () => {
      const res = await askReflectionAssistant('why_different', initialState, [], scenario);

      expect(res.historicalFact).toMatch(/immutable timeline|February 1568|sabats/i);
      expect(res.simulationResult).toMatch(/counterfactually|Siege Progress/i);
      expect(res.aiExplanation).toMatch(/strategic agency|parameter space/i);
    });
  });

  describe('5. Distinct Historiographical Layers & Graceful Fallback', () => {
    it('strictly separates Historical Fact, Simulation Result, and AI Explanation', () => {
      const res = getOfflineQuestionAnswer('How did Mughal sabats work?', initialState);

      expect(res.historicalFact).toBeDefined();
      expect(res.simulationResult).toBeDefined();
      expect(res.aiExplanation).toBeDefined();
      expect(res.uncertaintyNote).toBeDefined();

      // Ensure they are substantive and distinct
      expect(res.historicalFact).not.toEqual(res.simulationResult);
      expect(res.historicalFact).not.toEqual(res.aiExplanation);
      expect(res.simulationResult).not.toEqual(res.aiExplanation);
    });

    it('provides transparent historiographical caveats and citations', () => {
      const res = getOfflineDecisionExplanation(scenario.decision_points[0].options[0], {});

      expect(res.uncertaintyNote.length).toBeGreaterThan(10);
      expect(res.sources.length).toBeGreaterThan(0);
      expect(PRIMARY_SOURCES).toContain("Abu'l Fazl, Akbarnama (Chittor siege account)");

      const refRes = getOfflineReflection('biggest_decision', initialState);
      expect(refRes.historicalFact).toBeDefined();
      expect(refRes.isFallback).toBe(true);
    });

    it('handles empty questions gracefully without throwing errors', async () => {
      const res = await askHistoricalGuide('   ', initialState, [], scenario);

      expect(res).toBeDefined();
      expect(res.isFallback).toBe(true);
      expect(res.historicalFact).toMatch(/Please provide a historical question/i);
    });
  });
});
