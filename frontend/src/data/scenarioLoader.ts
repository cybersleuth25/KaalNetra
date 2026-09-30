/**
 * KaalNetra — Scenario Loader
 *
 * Provides a registry-based loader for scenario JSON data.
 * New scenarios can be added by:
 *   1. Creating a new JSON file in src/data/
 *   2. Registering it in the SCENARIO_REGISTRY below
 *
 * No game logic or UI code needs to change.
 *
 * Design:
 *   - Static imports for bundled scenarios (hackathon reliability)
 *   - Runtime validation on every load
 *   - Structured error/warning reporting
 *   - ScenarioEntry list for the scenario selection screen
 */

import type { Scenario, ScenarioEntry, ScenarioLoadResult } from './types';
import { validateScenario } from './scenarioValidator';
import chittorData from './chittor_1567.json';

// ---------------------------------------------------------------------------
// Scenario Registry
// ---------------------------------------------------------------------------

interface RegistryEntry {
  meta: ScenarioEntry;
  data: unknown;          // raw JSON — validated at load time
}

/**
 * Register all available scenarios here.
 * Future scenarios: import the JSON and add an entry.
 */
const SCENARIO_REGISTRY: RegistryEntry[] = [
  {
    meta: {
      id: 'chittor_1567',
      title: 'The Siege of Chittor',
      period: '1567–1568',
      location: 'Chittor, Mewar',
      available: true,
    },
    data: chittorData,
  },
  // {
  //   meta: { id: 'panipat_1761', title: 'Third Battle of Panipat', ... },
  //   data: panipatData,
  // },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * List all registered scenarios (for the scenario selection screen).
 * Does not load or validate the data — just returns metadata.
 */
export function listScenarios(): ScenarioEntry[] {
  return SCENARIO_REGISTRY.map((entry) => ({ ...entry.meta }));
}

/**
 * Load and validate a scenario by ID.
 *
 * Returns a ScenarioLoadResult with:
 *   - success: boolean
 *   - scenario: the validated Scenario or null
 *   - errors: array of validation errors (if any)
 *   - warnings: array of non-blocking warnings
 */
export function loadScenario(id: string): ScenarioLoadResult {
  const entry = SCENARIO_REGISTRY.find((e) => e.meta.id === id);

  if (!entry) {
    return {
      success: false,
      scenario: null,
      errors: [{
        path: '$',
        message: `Scenario "${id}" not found in registry. Available: ${SCENARIO_REGISTRY.map((e) => e.meta.id).join(', ')}`,
        kind: 'missing',
      }],
      warnings: [],
    };
  }

  if (!entry.meta.available) {
    return {
      success: false,
      scenario: null,
      errors: [{
        path: '$',
        message: `Scenario "${id}" is registered but not yet available`,
        kind: 'missing',
      }],
      warnings: [],
    };
  }

  return validateScenario(entry.data);
}

/**
 * Load the default / first available scenario.
 * Convenience for the MVP where only one scenario exists.
 */
export function loadDefaultScenario(): ScenarioLoadResult {
  const available = SCENARIO_REGISTRY.find((e) => e.meta.available);
  if (!available) {
    return {
      success: false,
      scenario: null,
      errors: [{
        path: '$',
        message: 'No available scenarios in registry',
        kind: 'missing',
      }],
      warnings: [],
    };
  }
  return loadScenario(available.meta.id);
}

/**
 * Get a validated scenario by ID (throws on validation failure).
 * Use in contexts where failure is not recoverable.
 */
export function getScenarioOrThrow(id: string): Scenario {
  const result = loadScenario(id);
  if (!result.success || !result.scenario) {
    const errorMessages = result.errors.map((e) => `  [${e.path}] ${e.message}`).join('\n');
    throw new Error(`Failed to load scenario "${id}":\n${errorMessages}`);
  }
  return result.scenario;
}
