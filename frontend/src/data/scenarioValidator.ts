/**
 * KaalNetra — Scenario Validator
 *
 * Runtime validation for scenario JSON data.
 * Checks required fields, types, ranges, and structural integrity
 * without requiring a third-party JSON Schema library.
 *
 * Design rationale: For a hackathon MVP, a hand-written validator
 * gives clear error messages and avoids adding a schema library dependency.
 * The validator mirrors the rules in schemas/scenario.schema.json.
 */

import type {
  Scenario,
  ScenarioValidationError,
  ScenarioLoadResult,
  StartingState,
  StateVarKey,
} from './types';
import { STATE_VAR_KEYS } from './types';

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

function err(path: string, message: string, kind: string): ScenarioValidationError {
  return { path, message, kind };
}

function checkString(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  errors: ScenarioValidationError[],
  required = true,
): void {
  if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
    if (required) errors.push(err(`${path}.${field}`, `Missing required field "${field}"`, 'missing'));
    return;
  }
  if (typeof obj[field] !== 'string') {
    errors.push(err(`${path}.${field}`, `Expected string, got ${typeof obj[field]}`, 'type'));
  }
}

function checkStringArray(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  errors: ScenarioValidationError[],
  required = true,
): void {
  if (!(field in obj) || obj[field] === undefined) {
    if (required) errors.push(err(`${path}.${field}`, `Missing required field "${field}"`, 'missing'));
    return;
  }
  if (!Array.isArray(obj[field])) {
    errors.push(err(`${path}.${field}`, `Expected array, got ${typeof obj[field]}`, 'type'));
    return;
  }
  const arr = obj[field] as unknown[];
  arr.forEach((item, i) => {
    if (typeof item !== 'string') {
      errors.push(err(`${path}.${field}[${i}]`, `Expected string, got ${typeof item}`, 'type'));
    }
  });
}

function checkNumber(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  errors: ScenarioValidationError[],
  min?: number,
  max?: number,
): void {
  if (!(field in obj) || obj[field] === undefined) {
    errors.push(err(`${path}.${field}`, `Missing required field "${field}"`, 'missing'));
    return;
  }
  if (typeof obj[field] !== 'number' || Number.isNaN(obj[field])) {
    errors.push(err(`${path}.${field}`, `Expected number, got ${typeof obj[field]}`, 'type'));
    return;
  }
  const val = obj[field] as number;
  if (min !== undefined && val < min) {
    errors.push(err(`${path}.${field}`, `Value ${val} is below minimum ${min}`, 'range'));
  }
  if (max !== undefined && val > max) {
    errors.push(err(`${path}.${field}`, `Value ${val} is above maximum ${max}`, 'range'));
  }
}

// ---------------------------------------------------------------------------
// Section validators
// ---------------------------------------------------------------------------

function validateStartingState(
  data: Record<string, unknown>,
  errors: ScenarioValidationError[],
): void {
  const path = 'starting_state';
  if (!data.starting_state || typeof data.starting_state !== 'object') {
    errors.push(err(path, 'Missing or invalid starting_state object', 'missing'));
    return;
  }
  const state = data.starting_state as Record<string, unknown>;
  for (const key of STATE_VAR_KEYS) {
    checkNumber(state, key, path, errors, 0, 100);
  }
}

function validateDecisionPoints(
  data: Record<string, unknown>,
  errors: ScenarioValidationError[],
): void {
  const path = 'decision_points';
  if (!Array.isArray(data.decision_points)) {
    errors.push(err(path, 'Missing or invalid decision_points array', 'missing'));
    return;
  }
  const points = data.decision_points as Record<string, unknown>[];
  if (points.length === 0) {
    errors.push(err(path, 'decision_points must contain at least one entry', 'missing'));
  }
  points.forEach((dp, i) => {
    const dpPath = `${path}[${i}]`;
    checkString(dp, 'id', dpPath, errors);
    checkString(dp, 'prompt', dpPath, errors);
    if (!Array.isArray(dp.options)) {
      errors.push(err(`${dpPath}.options`, 'Missing or invalid options array', 'missing'));
      return;
    }
    const options = dp.options as Record<string, unknown>[];
    if (options.length < 2) {
      errors.push(err(`${dpPath}.options`, 'Each decision point must have at least 2 options', 'range'));
    }
    options.forEach((opt, j) => {
      const optPath = `${dpPath}.options[${j}]`;
      checkString(opt, 'id', optPath, errors);
      checkString(opt, 'title', optPath, errors);
      checkString(opt, 'description', optPath, errors);
      if (!opt.delta || typeof opt.delta !== 'object') {
        errors.push(err(`${optPath}.delta`, 'Missing or invalid delta object', 'missing'));
      } else {
        // Validate delta keys are known state variable names
        const delta = opt.delta as Record<string, unknown>;
        for (const [key, value] of Object.entries(delta)) {
          if (!STATE_VAR_KEYS.includes(key as StateVarKey)) {
            errors.push(err(`${optPath}.delta.${key}`, `Unknown state variable key "${key}" in delta`, 'schema'));
          }
          if (typeof value !== 'number') {
            errors.push(err(`${optPath}.delta.${key}`, `Delta value must be a number, got ${typeof value}`, 'type'));
          }
        }
      }
    });
  });
}

function validateCanonicalTimeline(
  data: Record<string, unknown>,
  errors: ScenarioValidationError[],
): void {
  const path = 'canonical_timeline';
  if (!Array.isArray(data.canonical_timeline)) {
    errors.push(err(path, 'Missing or invalid canonical_timeline array', 'missing'));
    return;
  }
  const events = data.canonical_timeline as Record<string, unknown>[];
  events.forEach((event, i) => {
    const ePath = `${path}[${i}]`;
    checkString(event, 'id', ePath, errors);
    checkString(event, 'date_label', ePath, errors);
    checkString(event, 'title', ePath, errors);
    checkString(event, 'description', ePath, errors);
    if (!event.evidence_level || !['CANONICAL', 'CONTESTED'].includes(event.evidence_level as string)) {
      errors.push(err(`${ePath}.evidence_level`, 'evidence_level must be "CANONICAL" or "CONTESTED"', 'schema'));
    }
  });
}

function validateEvidence(
  data: Record<string, unknown>,
  errors: ScenarioValidationError[],
): void {
  const path = 'evidence';
  if (!Array.isArray(data.evidence)) {
    errors.push(err(path, 'Missing or invalid evidence array', 'missing'));
    return;
  }
  const entries = data.evidence as Record<string, unknown>[];
  const validLevels = ['CANONICAL', 'CONTESTED', 'SIMULATION', 'FICTIONAL_COMPOSITE'];
  entries.forEach((entry, i) => {
    const ePath = `${path}[${i}]`;
    checkString(entry, 'id', ePath, errors);
    checkString(entry, 'claim', ePath, errors);
    checkString(entry, 'source', ePath, errors);
    checkString(entry, 'type', ePath, errors);
    if (!entry.evidence_level || !validLevels.includes(entry.evidence_level as string)) {
      errors.push(err(
        `${ePath}.evidence_level`,
        `evidence_level must be one of: ${validLevels.join(', ')}`,
        'schema',
      ));
    }
  });
}

// ---------------------------------------------------------------------------
// Cross-reference validation (warnings, not errors)
// ---------------------------------------------------------------------------

function crossReferenceChecks(
  data: Record<string, unknown>,
  warnings: string[],
): void {
  // Check that source_ids in canonical_timeline reference existing evidence IDs
  const evidenceIds = new Set<string>();
  if (Array.isArray(data.evidence)) {
    for (const e of data.evidence as Record<string, unknown>[]) {
      if (typeof e.id === 'string') evidenceIds.add(e.id);
    }
  }

  if (Array.isArray(data.canonical_timeline)) {
    for (const event of data.canonical_timeline as Record<string, unknown>[]) {
      if (Array.isArray(event.source_ids)) {
        for (const sid of event.source_ids as string[]) {
          if (!evidenceIds.has(sid)) {
            warnings.push(`canonical_timeline event "${event.id}" references unknown source_id "${sid}"`);
          }
        }
      }
    }
  }

  // Check that fictional_composites reference existing actor IDs
  if (Array.isArray(data.actors) && Array.isArray(data.fictional_composites)) {
    const actorIds = new Set<string>();
    for (const a of data.actors as Record<string, unknown>[]) {
      if (typeof a.id === 'string') actorIds.add(a.id);
    }
    for (const fc of data.fictional_composites as Record<string, unknown>[]) {
      if (typeof fc.actor_id === 'string' && !actorIds.has(fc.actor_id)) {
        warnings.push(`fictional_composite references unknown actor_id "${fc.actor_id}"`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main validate function
// ---------------------------------------------------------------------------

/**
 * Validate raw scenario data.
 * Returns a ScenarioLoadResult with errors and warnings.
 */
export function validateScenario(raw: unknown): ScenarioLoadResult {
  const errors: ScenarioValidationError[] = [];
  const warnings: string[] = [];

  // Top-level type check
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      success: false,
      scenario: null,
      errors: [err('$', 'Scenario data must be a non-null object', 'type')],
      warnings: [],
    };
  }

  const data = raw as Record<string, unknown>;

  // Required top-level string fields
  checkString(data, 'id', '$', errors);
  checkString(data, 'title', '$', errors);
  checkString(data, 'period', '$', errors);

  // Optional top-level string fields
  checkString(data, 'location', '$', errors, false);

  // Required array fields
  checkStringArray(data, 'historical_context', '$', errors);

  // Complex sections
  validateStartingState(data, errors);
  validateDecisionPoints(data, errors);
  validateCanonicalTimeline(data, errors);
  validateEvidence(data, errors);

  // Cross-reference checks (non-blocking)
  crossReferenceChecks(data, warnings);

  // Optional enrichment warnings
  if (!data.actors) warnings.push('No actors defined — briefing screen will lack character data');
  if (!data.state_variables) warnings.push('No state_variables metadata — UI will use default labels');
  if (!data.historical_constraints) warnings.push('No historical_constraints defined');

  return {
    success: errors.length === 0,
    scenario: errors.length === 0 ? (data as unknown as Scenario) : null,
    errors,
    warnings,
  };
}

/**
 * Parse a JSON string and validate it as a scenario.
 * Handles parse errors gracefully.
 */
export function parseAndValidateScenario(jsonString: string): ScenarioLoadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown parse error';
    return {
      success: false,
      scenario: null,
      errors: [err('$', `JSON parse error: ${message}`, 'parse')],
      warnings: [],
    };
  }
  return validateScenario(parsed);
}

/**
 * Validate starting state values are within bounds.
 * Utility for the simulation engine to use before processing.
 */
export function isValidStartingState(state: StartingState): boolean {
  for (const key of STATE_VAR_KEYS) {
    const val = state[key];
    if (typeof val !== 'number' || Number.isNaN(val) || val < 0 || val > 100) {
      return false;
    }
  }
  return true;
}
