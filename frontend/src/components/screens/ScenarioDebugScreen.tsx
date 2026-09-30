/**
 * KaalNetra — Scenario Debug / Preview Screen
 *
 * Proves the scenario data loads correctly. Shows:
 *   - Load status (success/failure)
 *   - Validation errors and warnings
 *   - All scenario sections with data
 *   - Starting state values
 *   - Decision points with deltas
 *   - Canonical timeline
 *   - Evidence entries
 *   - Actors, constraints, fictional composites, simulation notes
 *
 * Also includes a "Test Invalid Data" button that deliberately feeds
 * broken data to the validator and shows the resulting errors.
 */

import { useState, useEffect } from 'react';
import { useStage } from '../../app/StageContext';
import { loadScenario, listScenarios } from '../../data/scenarioLoader';
import { validateScenario } from '../../data/scenarioValidator';
import type { Scenario, ScenarioLoadResult, ScenarioValidationError } from '../../data/types';

// ---------------------------------------------------------------------------
// Test invalid scenario data — for verification requirement #3
// ---------------------------------------------------------------------------

const INVALID_SCENARIOS: { label: string; data: unknown }[] = [
  {
    label: 'Missing required fields',
    data: { id: 'test', title: 'Test' },
  },
  {
    label: 'Wrong types',
    data: {
      id: 123,
      title: null,
      period: 'ok',
      historical_context: 'not-an-array',
      starting_state: { food: 'not-a-number', water: 50, defenders: 50, morale: 50, fort_integrity: 50, siege_progress: 50 },
      decision_points: [],
      canonical_timeline: [],
      evidence: [],
    },
  },
  {
    label: 'Values out of range',
    data: {
      id: 'test',
      title: 'Test',
      period: '2000',
      historical_context: ['fact'],
      starting_state: { food: 150, water: -10, defenders: 50, morale: 50, fort_integrity: 50, siege_progress: 200 },
      decision_points: [{ id: 'd1', prompt: 'test', options: [{ id: 'o1', title: 't', description: 'd', delta: { food: 5 } }] }],
      canonical_timeline: [{ id: 'c1', date_label: 'now', title: 't', description: 'd', evidence_level: 'INVALID' }],
      evidence: [{ id: 'e1', claim: 'c', source: 's', type: 't', evidence_level: 'CANONICAL' }],
    },
  },
  {
    label: 'Null input',
    data: null,
  },
  {
    label: 'Array instead of object',
    data: [1, 2, 3],
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ success }: { success: boolean }) {
  return (
    <span className={`debug-badge ${success ? 'debug-badge-ok' : 'debug-badge-err'}`}>
      {success ? '✓ VALID' : '✗ INVALID'}
    </span>
  );
}

function ErrorList({ errors }: { errors: ScenarioValidationError[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="debug-error-list">
      <h4>Validation Errors ({errors.length})</h4>
      <ul>
        {errors.map((e, i) => (
          <li key={i}>
            <code>[{e.kind}]</code> <strong>{e.path}</strong>: {e.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;
  return (
    <div className="debug-warning-list">
      <h4>Warnings ({warnings.length})</h4>
      <ul>
        {warnings.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
}

function StateTable({ state }: { state: Scenario['starting_state'] }) {
  return (
    <table className="debug-table">
      <thead>
        <tr><th>Variable</th><th>Value</th><th>Range</th></tr>
      </thead>
      <tbody>
        {Object.entries(state).map(([key, val]) => (
          <tr key={key}>
            <td><code>{key}</code></td>
            <td>{val}</td>
            <td>0–100</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function ScenarioDebugScreen() {
  const { prevStage, goToStage } = useStage();
  const [result, setResult] = useState<ScenarioLoadResult | null>(null);
  const [invalidResults, setInvalidResults] = useState<{ label: string; result: ScenarioLoadResult }[]>([]);
  const [showInvalid, setShowInvalid] = useState(false);

  // Load the default scenario on mount
  useEffect(() => {
    const loadResult = loadScenario('chittor_1567');
    setResult(loadResult);

    // Log to console for dev verification
    if (loadResult.success) {
      console.log('[KaalNetra] Scenario loaded successfully:', loadResult.scenario?.id);
      if (loadResult.warnings.length > 0) {
        console.warn('[KaalNetra] Warnings:', loadResult.warnings);
      }
    } else {
      console.error('[KaalNetra] Scenario validation failed:', loadResult.errors);
    }
  }, []);

  // Run invalid data tests
  const runInvalidTests = () => {
    const results = INVALID_SCENARIOS.map(({ label, data }) => ({
      label,
      result: validateScenario(data),
    }));
    setInvalidResults(results);
    setShowInvalid(true);
    console.log('[KaalNetra] Invalid scenario test results:', results);
  };

  if (!result) return <div className="debug-screen">Loading…</div>;

  const scenario = result.scenario;
  const entries = listScenarios();

  return (
    <div className="debug-screen">
      <div className="debug-container">
        {/* Header */}
        <div className="debug-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Scenario Debug / Preview</h1>
            <p className="debug-subtitle">Phase 2 — Verifying scenario data layer</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="debug-btn debug-btn-primary" title="Active: Phase 2">
              Phase 2: Scenario Data
            </button>
            <button className="debug-btn" onClick={() => goToStage('SIMULATION_1')} title="Switch to Phase 3 Simulation Engine">
              Phase 3: Simulation Engine &rarr;
            </button>
          </div>
        </div>

        {/* Load Status */}
        <section className="debug-section">
          <h2>Load Status</h2>
          <StatusBadge success={result.success} />
          <ErrorList errors={result.errors} />
          <WarningList warnings={result.warnings} />
        </section>

        {/* Registry */}
        <section className="debug-section">
          <h2>Scenario Registry ({entries.length} scenarios)</h2>
          <table className="debug-table">
            <thead>
              <tr><th>ID</th><th>Title</th><th>Period</th><th>Location</th><th>Status</th></tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td><code>{e.id}</code></td>
                  <td>{e.title}</td>
                  <td>{e.period}</td>
                  <td>{e.location ?? '—'}</td>
                  <td>{e.available ? '✓ Available' : '✗ Coming soon'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {scenario && (
          <>
            {/* Scenario Identity */}
            <section className="debug-section">
              <h2>Scenario: {scenario.title}</h2>
              <dl className="debug-dl">
                <dt>ID</dt><dd><code>{scenario.id}</code></dd>
                <dt>Period</dt><dd>{scenario.period}</dd>
                <dt>Location</dt><dd>{scenario.location ?? '(not set)'}</dd>
              </dl>
            </section>

            {/* Historical Context */}
            <section className="debug-section">
              <h2>Historical Context ({scenario.historical_context.length} entries)</h2>
              <ol className="debug-ol">
                {scenario.historical_context.map((ctx, i) => (
                  <li key={i}>{ctx}</li>
                ))}
              </ol>
            </section>

            {/* Actors */}
            {scenario.actors && (
              <section className="debug-section">
                <h2>Actors ({scenario.actors.length} characters)</h2>
                <table className="debug-table">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Role</th><th>Faction</th><th>Historical</th></tr>
                  </thead>
                  <tbody>
                    {scenario.actors.map((a) => (
                      <tr key={a.id}>
                        <td><code>{a.id}</code></td>
                        <td>{a.name}</td>
                        <td>{a.role}</td>
                        <td>{a.faction}</td>
                        <td>{a.historical ? '✓ Historical' : '△ Composite'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Starting State */}
            <section className="debug-section">
              <h2>Starting State</h2>
              <StateTable state={scenario.starting_state} />
            </section>

            {/* State Variable Metadata */}
            {scenario.state_variables && (
              <section className="debug-section">
                <h2>State Variable Metadata</h2>
                <table className="debug-table">
                  <thead>
                    <tr><th>ID</th><th>Label</th><th>Polarity</th><th>Icon</th></tr>
                  </thead>
                  <tbody>
                    {scenario.state_variables.map((sv) => (
                      <tr key={sv.id}>
                        <td><code>{sv.id}</code></td>
                        <td>{sv.label}</td>
                        <td>{sv.polarity}</td>
                        <td>{sv.icon ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Decision Points */}
            <section className="debug-section">
              <h2>Decision Points ({scenario.decision_points.length})</h2>
              {scenario.decision_points.map((dp) => (
                <div key={dp.id} className="debug-card">
                  <h3><code>{dp.id}</code>: {dp.prompt}</h3>
                  {dp.trigger_condition && (
                    <p className="debug-trigger">Trigger: {dp.trigger_condition}</p>
                  )}
                  <table className="debug-table">
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Title</th>
                        <th>Delta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dp.options.map((opt) => (
                        <tr key={opt.id}>
                          <td><code>{opt.id}</code></td>
                          <td>{opt.title}</td>
                          <td>
                            <code>
                              {Object.entries(opt.delta)
                                .map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`)
                                .join(', ')}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </section>

            {/* Canonical Timeline */}
            <section className="debug-section">
              <h2>Canonical Timeline ({scenario.canonical_timeline.length} events)</h2>
              <div className="debug-timeline">
                {scenario.canonical_timeline.map((event) => (
                  <div key={event.id} className="debug-timeline-event">
                    <span className="debug-timeline-date">{event.date_label}</span>
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <span className="debug-badge debug-badge-canon">{event.evidence_level}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Historical Constraints */}
            {scenario.historical_constraints && (
              <section className="debug-section">
                <h2>Historical Constraints ({scenario.historical_constraints.length})</h2>
                {scenario.historical_constraints.map((hc) => (
                  <div key={hc.id} className="debug-card">
                    <h4>{hc.title}</h4>
                    <p>{hc.description}</p>
                    {hc.affects && <p><strong>Affects:</strong> {hc.affects.join(', ')}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Fictional Composites */}
            {scenario.fictional_composites && (
              <section className="debug-section">
                <h2>Fictional Composites ({scenario.fictional_composites.length})</h2>
                <table className="debug-table">
                  <thead>
                    <tr><th>Actor ID</th><th>Represents</th><th>Rationale</th></tr>
                  </thead>
                  <tbody>
                    {scenario.fictional_composites.map((fc) => (
                      <tr key={fc.actor_id}>
                        <td><code>{fc.actor_id}</code></td>
                        <td>{fc.represents}</td>
                        <td>{fc.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Simulation Notes */}
            {scenario.simulation_notes && (
              <section className="debug-section">
                <h2>Simulation Notes ({scenario.simulation_notes.length})</h2>
                {scenario.simulation_notes.map((sn) => (
                  <div key={sn.id} className="debug-card">
                    <p>{sn.content}</p>
                    {sn.context && <p className="debug-trigger">Context: {sn.context}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Evidence */}
            <section className="debug-section">
              <h2>Evidence Entries ({scenario.evidence.length})</h2>
              <table className="debug-table">
                <thead>
                  <tr><th>ID</th><th>Claim</th><th>Source</th><th>Level</th></tr>
                </thead>
                <tbody>
                  {scenario.evidence.map((ev) => (
                    <tr key={ev.id}>
                      <td><code>{ev.id}</code></td>
                      <td>{ev.claim}</td>
                      <td>{ev.source}</td>
                      <td>
                        <span className={`debug-badge debug-badge-${ev.evidence_level === 'SIMULATION' ? 'sim' : 'canon'}`}>
                          {ev.evidence_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Reflection Prompts */}
            {scenario.reflection_prompts && (
              <section className="debug-section">
                <h2>Reflection Prompts ({scenario.reflection_prompts.length})</h2>
                <ol className="debug-ol">
                  {scenario.reflection_prompts.map((prompt, i) => (
                    <li key={i}>"{prompt}"</li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}

        {/* Invalid Data Tests */}
        <section className="debug-section">
          <h2>Validation Tests</h2>
          <button className="debug-btn" onClick={runInvalidTests}>
            Run Invalid Data Tests ({INVALID_SCENARIOS.length} cases)
          </button>
          {showInvalid && (
            <div className="debug-invalid-results">
              {invalidResults.map(({ label, result: r }, i) => (
                <div key={i} className="debug-card">
                  <h4>
                    <StatusBadge success={r.success} />
                    {' '}{label}
                  </h4>
                  <ErrorList errors={r.errors} />
                  <WarningList warnings={r.warnings} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Navigation */}
        <div className="debug-nav">
          <button className="debug-btn" onClick={prevStage}>← Back to Home</button>
          <button className="debug-btn debug-btn-primary" onClick={() => goToStage('SIMULATION_1')}>
            Go to Simulation Engine (Phase 3) →
          </button>
        </div>
      </div>
    </div>
  );
}
