/**
 * KaalNetra — Simulation Engine Debug / Development Screen (Phase 3)
 *
 * Implements developer inspection controls required by Phase 3 prompt:
 *   - Inspect current state (food, water, defenders, morale, fort_integrity, siege_progress)
 *   - Select an available decision & preview consequences
 *   - Advance one turn (calls pure simulation engine)
 *   - Inspect generated events & complete event history
 *   - Reset the simulation (calls resetSimulation)
 *   - Test invalid decision rejection
 *   - Determinism verification (runs multiple replays and confirms identical state)
 *
 * CRITICAL ARCHITECTURAL RULE:
 * NO simulation logic exists in this component.
 * All state calculations, deltas, clamping, thresholds, and end condition checks
 * are handled exclusively by the simulation engine in `../../simulation`.
 */

import { useState, useEffect } from 'react';
import { useStage } from '../../app/StageContext';
import { loadScenario } from '../../data/scenarioLoader';
import type { Scenario, StateVarKey } from '../../data/types';
import { STATE_VAR_KEYS } from '../../data/types';
import {
  createSession,
  getAvailableDecisions,
  advanceTurn,
  calculateConsequences,
  resetSimulation,
  getSimulationHistory,
  calculateSustainability,
  replayDecisions,
  PASSIVE_TURN_DELTA,
  MAX_TURNS,
} from '../../simulation';
import type {
  SimulationSession,
  ThresholdEffect,
} from '../../simulation';

const STAT_CONFIG: Record<StateVarKey, { label: string; goodHigh: boolean }> = {
  food: { label: 'Food', goodHigh: true },
  water: { label: 'Water', goodHigh: true },
  defenders: { label: 'Defenders', goodHigh: true },
  morale: { label: 'Morale', goodHigh: true },
  fort_integrity: { label: 'Fort Integrity', goodHigh: true },
  siege_progress: { label: 'Siege Progress', goodHigh: false },
};

function formatDelta(val: number | undefined): string {
  if (val === undefined || val === 0) return '0';
  return val > 0 ? `+${val}` : `${val}`;
}

export default function SimulationDebugScreen() {
  const { goToStage, reset: resetStage } = useStage();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>('');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [lastError, setLastError] = useState<string | null>(null);
  const [invalidTestResult, setInvalidTestResult] = useState<string | null>(null);
  const [determinismResult, setDeterminismResult] = useState<{
    success: boolean;
    replays: number;
    matchHash: string;
    details: string;
  } | null>(null);

  // Load Chittor 1567 scenario on mount
  useEffect(() => {
    const res = loadScenario('chittor_1567');
    if (res.success && res.scenario) {
      setScenario(res.scenario);
      const newSession = createSession(res.scenario);
      setSession(newSession);

      // Default to first available decision
      const available = getAvailableDecisions(
        newSession.currentState,
        res.scenario.decision_points,
        []
      );
      if (available.length > 0) {
        setSelectedDecisionId(available[0].id);
        if (available[0].options.length > 0) {
          setSelectedOptionId(available[0].options[0].id);
        }
      }
    } else {
      setLastError('Failed to load default scenario');
    }
  }, []);

  // Update selection when state or available decisions change
  useEffect(() => {
    if (!scenario || !session) return;
    const usedIds = session.turnHistory.map((t) => t.decisionId);
    const available = getAvailableDecisions(session.currentState, scenario.decision_points, usedIds);
    if (available.length > 0) {
      if (!available.some((d) => d.id === selectedDecisionId)) {
        setSelectedDecisionId(available[0].id);
        setSelectedOptionId(available[0].options[0]?.id ?? '');
      }
    } else {
      setSelectedDecisionId('');
      setSelectedOptionId('');
    }
  }, [session, scenario]);

  if (!scenario || !session) {
    return (
      <div className="debug-container">
        <p>Loading simulation engine...</p>
      </div>
    );
  }

  const usedIds = session.turnHistory.map((t) => t.decisionId);
  const availableDecisions = getAvailableDecisions(session.currentState, scenario.decision_points, usedIds);
  const currentDecision = availableDecisions.find((d) => d.id === selectedDecisionId) ?? availableDecisions[0];
  const currentOption = currentDecision?.options.find((o) => o.id === selectedOptionId) ?? currentDecision?.options[0];

  // Calculate consequence preview using pure engine function
  let preview: { stateAfter: typeof session.currentState; thresholdEffects: ThresholdEffect[] } | null = null;
  if (currentOption && !session.isComplete) {
    preview = calculateConsequences(session.currentState, currentOption);
  }

  const sustainability = calculateSustainability(session.currentState);
  const history = getSimulationHistory(session);

  // Advance turn handler — delegates purely to engine advanceTurn
  const handleAdvanceTurn = () => {
    if (!currentDecision || !currentOption) return;
    setLastError(null);
    setInvalidTestResult(null);

    const result = advanceTurn(session, currentDecision.id, currentOption.id, scenario.decision_points);
    if ('error' in result) {
      setLastError(result.error);
    } else {
      setSession(result.session);
    }
  };

  // Reset handler — delegates purely to engine resetSimulation
  const handleReset = () => {
    const fresh = resetSimulation(session);
    setSession(fresh);
    setLastError(null);
    setInvalidTestResult(null);
    setDeterminismResult(null);

    const available = getAvailableDecisions(fresh.currentState, scenario.decision_points, []);
    if (available.length > 0) {
      setSelectedDecisionId(available[0].id);
      setSelectedOptionId(available[0].options[0]?.id ?? '');
    }
  };

  // Test invalid decision rejection
  const handleTestInvalidDecision = () => {
    setLastError(null);
    const testCases = [
      { decisionId: 'fake_decision_999', optionId: 'opt_1', desc: 'Non-existent decision ID' },
      { decisionId: 'decision_1', optionId: 'fake_option_xyz', desc: 'Non-existent option ID' },
    ];

    const results: string[] = [];
    for (const tc of testCases) {
      const res = advanceTurn(session, tc.decisionId, tc.optionId, scenario.decision_points);
      if ('error' in res) {
        results.push(`[REJECTED] ${tc.desc}: "${res.error}"`);
      } else {
        results.push(`[FAILED] ${tc.desc} was unexpectedly accepted`);
      }
    }
    setInvalidTestResult(results.join('\n'));
  };

  // Run determinism verification (3 replays)
  const handleVerifyDeterminism = () => {
    try {
      const firstDp = scenario.decision_points[0];
      const firstOpt = firstDp.options[0];
      const sequence = [
        { decisionId: firstDp.id, optionId: firstOpt.id },
      ];

      const r1 = replayDecisions(scenario, sequence);
      const r2 = replayDecisions(scenario, sequence);
      const r3 = replayDecisions(scenario, sequence);

      const s1 = JSON.stringify(r1);
      const s2 = JSON.stringify(r2);
      const s3 = JSON.stringify(r3);

      const matches = s1 === s2 && s2 === s3;
      setDeterminismResult({
        success: matches,
        replays: 3,
        matchHash: `CRC-${Math.abs(s1.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
        details: matches
          ? `3 identical runs evaluated. Turn 1 state: Food ${r1.currentState.food}, Water ${r1.currentState.water}, Defenders ${r1.currentState.defenders}, Morale ${r1.currentState.morale}, Fort ${r1.currentState.fort_integrity}, Siege ${r1.currentState.siege_progress}. 100% byte-for-byte identical.`
          : 'Determinism failure: replays produced differing states!',
      });
    } catch (err: unknown) {
      setDeterminismResult({
        success: false,
        replays: 3,
        matchHash: 'ERROR',
        details: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return (
    <div className="debug-container">
      <div className="debug-content">
        {/* Header with Mode Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="debug-badge" style={{ background: 'var(--color-gold-500)', color: 'var(--color-stone-900)', fontWeight: 'bold' }}>
              Phase 3
            </span>
            <h1 style={{ display: 'inline', marginLeft: '0.75rem', fontSize: '1.75rem' }}>
              Deterministic Simulation Engine Debug
            </h1>
            <p style={{ color: 'var(--color-parchment-300)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Scenario: <strong>{scenario.title}</strong> ({scenario.period}) &middot; Max Turns: {MAX_TURNS}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="debug-btn"
              onClick={() => goToStage('SCENARIO')}
              title="Switch to Phase 2 Scenario Data Inspector"
            >
              Phase 2: Scenario Data
            </button>
            <button
              className="debug-btn debug-btn-primary"
              title="Active: Phase 3 Simulation Engine Debug"
            >
              Phase 3: Simulation Engine
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {lastError && (
          <div className="debug-error-list" style={{ marginBottom: '1.5rem' }}>
            <h4>Simulation Error</h4>
            <p>{lastError}</p>
          </div>
        )}

        {/* SECTION 1: Current State Inspection */}
        <section className="debug-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2>1. Current Simulation State</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span className="debug-badge" style={{ background: session.isComplete ? '#8b1a2b' : '#1a7a52' }}>
                {session.isComplete ? `COMPLETE (${session.endCondition?.type ?? 'ended'})` : `ACTIVE — Turn ${session.currentState.turn} / ${MAX_TURNS}`}
              </span>
              <span className="debug-badge" style={{ background: '#4a3f35' }}>
                Date: {session.currentState.date_label}
              </span>
              <span className="debug-badge" style={{ background: sustainability >= 50 ? '#1a7a52' : '#b8901e' }}>
                Sustainability: {sustainability}%
              </span>
              {session.outcomeTier && (
                <span className="debug-badge" style={{ background: '#d4a72c', color: '#1a1614', fontWeight: 'bold' }}>
                  Outcome: {session.outcomeTier}
                </span>
              )}
            </div>
          </div>

          {/* End condition banner */}
          {session.isComplete && session.endCondition && (
            <div className="debug-card" style={{ borderColor: 'var(--color-maroon-400)', background: 'rgba(139, 26, 43, 0.25)', marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--color-gold-400)' }}>
                End Condition Triggered: {session.endCondition.type}
              </h4>
              <p>{session.endCondition.description}</p>
            </div>
          )}

          {/* State Variables Grid */}
          <table className="debug-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Current Value</th>
                <th>Passive Drain / Turn</th>
                <th>Status Bar (0–100)</th>
              </tr>
            </thead>
            <tbody>
              {STATE_VAR_KEYS.map((key) => {
                const val = session.currentState[key];
                const cfg = STAT_CONFIG[key];
                const drain = PASSIVE_TURN_DELTA[key];
                const isCritical = cfg.goodHigh ? val <= 20 : val >= 80;
                const isWarning = cfg.goodHigh ? val <= 35 : val >= 65;
                const barColor = isCritical ? '#a3344a' : isWarning ? '#d4a72c' : '#2d9b6e';

                return (
                  <tr key={key}>
                    <td>
                      <code>{key}</code>
                      <span style={{ marginLeft: '0.5rem', color: 'var(--color-parchment-300)', fontSize: '0.8rem' }}>
                        ({cfg.label})
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1.05rem', color: isCritical ? '#f57888' : isWarning ? '#f5d778' : '#faf6f0' }}>
                        {val}
                      </strong>
                      <span style={{ color: 'var(--color-stone-500)', fontSize: '0.8rem' }}> / 100</span>
                    </td>
                    <td>
                      <span style={{ color: drain && drain < 0 ? '#f57888' : drain && drain > 0 ? '#e8c84a' : 'inherit' }}>
                        {formatDelta(drain)}
                      </span>
                    </td>
                    <td style={{ width: '40%' }}>
                      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '4px', height: '14px', width: '100%', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.max(0, Math.min(100, val))}%`,
                            background: barColor,
                            height: '100%',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* SECTION 2: Decision Selection & Advance Turn */}
        <section className="debug-section">
          <h2>2. Decision Control & Turn Advancement</h2>

          {session.isComplete ? (
            <div className="debug-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                The simulation has reached its conclusion. Reset to start a new simulation run.
              </p>
              <button className="debug-btn debug-btn-primary" onClick={handleReset}>
                ↺ Reset Simulation
              </button>
            </div>
          ) : availableDecisions.length === 0 ? (
            <div className="debug-card">
              <p>No decision points currently available in this turn state.</p>
            </div>
          ) : (
            <div>
              {/* Decision selection tabs if multiple */}
              {availableDecisions.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {availableDecisions.map((dp) => (
                    <button
                      key={dp.id}
                      className={`debug-btn ${dp.id === selectedDecisionId ? 'debug-btn-primary' : ''}`}
                      onClick={() => {
                        setSelectedDecisionId(dp.id);
                        setSelectedOptionId(dp.options[0]?.id ?? '');
                      }}
                    >
                      {dp.id}
                    </button>
                  ))}
                </div>
              )}

              {currentDecision && (
                <div className="debug-card" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: 'var(--color-gold-400)' }}>
                      {currentDecision.id}: {currentDecision.prompt}
                    </h3>
                    {currentDecision.trigger_condition && (
                      <span className="debug-trigger">Trigger: {currentDecision.trigger_condition}</span>
                    )}
                  </div>

                  {/* Options Selection */}
                  <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                    {currentDecision.options.map((opt) => {
                      const isSelected = opt.id === (currentOption?.id ?? '');
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedOptionId(opt.id)}
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '4px',
                            border: `1px solid ${isSelected ? 'var(--color-gold-500)' : 'rgba(191, 165, 122, 0.2)'}`,
                            background: isSelected ? 'rgba(212, 167, 44, 0.12)' : 'rgba(42, 36, 32, 0.6)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <strong style={{ color: isSelected ? 'var(--color-gold-400)' : 'var(--color-parchment-100)' }}>
                              <input
                                type="radio"
                                name="decision_option"
                                checked={isSelected}
                                onChange={() => setSelectedOptionId(opt.id)}
                                style={{ marginRight: '0.5rem' }}
                              />
                              [{opt.id}] {opt.title}
                            </strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-parchment-400)' }}>
                              Option Delta
                            </span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-parchment-300)', marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                            {opt.description}
                          </p>
                          <div style={{ marginLeft: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Object.entries(opt.delta).map(([k, v]) => (
                              <span
                                key={k}
                                className="debug-badge"
                                style={{
                                  background: (v ?? 0) > 0 ? 'rgba(45, 155, 110, 0.3)' : 'rgba(163, 52, 74, 0.3)',
                                  borderColor: (v ?? 0) > 0 ? 'var(--color-emerald-400)' : 'var(--color-maroon-400)',
                                }}
                              >
                                {k}: {formatDelta(v)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Consequence Preview (calculated via pure engine calculateConsequences) */}
              {preview && currentOption && (
                <div className="debug-card" style={{ marginBottom: '1.25rem', borderColor: 'var(--color-stone-500)' }}>
                  <h4>Predicted Next State Preview (Choice + Passive + Thresholds)</h4>
                  <table className="debug-table" style={{ marginTop: '0.5rem' }}>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Current</th>
                        <th>Option Δ</th>
                        <th>Passive Δ</th>
                        <th>Predicted Next</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STATE_VAR_KEYS.map((k) => {
                        const cur = session.currentState[k];
                        const next = preview!.stateAfter[k];
                        const optDelta = currentOption.delta[k] ?? 0;
                        const passDelta = PASSIVE_TURN_DELTA[k] ?? 0;
                        const diff = next - cur;
                        return (
                          <tr key={k}>
                            <td><code>{k}</code></td>
                            <td>{cur}</td>
                            <td>{formatDelta(optDelta)}</td>
                            <td>{formatDelta(passDelta)}</td>
                            <td>
                              <strong style={{ color: diff > 0 ? 'var(--color-emerald-400)' : diff < 0 ? 'var(--color-maroon-400)' : 'inherit' }}>
                                {next} ({formatDelta(diff)})
                              </strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {preview.thresholdEffects.length > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>
                        Triggered Threshold Rules:
                      </span>
                      <ul style={{ fontSize: '0.85rem', color: 'var(--color-parchment-300)', paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                        {preview.thresholdEffects.map((te, i) => (
                          <li key={i}>
                            <strong>{te.ruleId}</strong>: {te.description} ({te.condition})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className="debug-btn debug-btn-primary"
                  onClick={handleAdvanceTurn}
                  disabled={!currentDecision || !currentOption}
                >
                  ▶ Advance 1 Turn (Apply Decision)
                </button>
                <button className="debug-btn" onClick={handleReset}>
                  ↺ Reset Simulation
                </button>
                <button className="debug-btn" onClick={handleTestInvalidDecision}>
                  Test Invalid Decision Rejection
                </button>
                <button className="debug-btn" onClick={handleVerifyDeterminism}>
                  Run Determinism Check (3 Replays)
                </button>
              </div>

              {/* Invalid test result display */}
              {invalidTestResult && (
                <div className="debug-card" style={{ marginTop: '1rem', background: 'rgba(74, 63, 53, 0.4)' }}>
                  <h4>Validation Test Output</h4>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--color-gold-300)' }}>
                    {invalidTestResult}
                  </pre>
                </div>
              )}

              {/* Determinism test output */}
              {determinismResult && (
                <div
                  className="debug-card"
                  style={{
                    marginTop: '1rem',
                    borderColor: determinismResult.success ? 'var(--color-emerald-400)' : 'var(--color-maroon-400)',
                    background: determinismResult.success ? 'rgba(26, 122, 82, 0.15)' : 'rgba(139, 26, 43, 0.25)',
                  }}
                >
                  <h4 style={{ color: determinismResult.success ? 'var(--color-emerald-400)' : 'var(--color-maroon-400)' }}>
                    {determinismResult.success ? '✓ Determinism Verified' : '✗ Determinism Check Failed'}
                    <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', opacity: 0.8 }}>
                      ({determinismResult.replays} replays, {determinismResult.matchHash})
                    </span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{determinismResult.details}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION 3: Event History Inspection */}
        <section className="debug-section">
          <h2>3. Generated Events & History Log ({history.length} turns)</h2>

          {history.length === 0 ? (
            <p style={{ color: 'var(--color-stone-500)', fontStyle: 'italic' }}>
              No turns resolved yet. Select a decision above and advance one turn.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {history.map((turnRes) => (
                <div key={turnRes.turn} className="debug-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <h4>
                      Turn {turnRes.turn}: {turnRes.decision_id} &rarr; {turnRes.option_id}
                    </h4>
                    <span className="debug-badge" style={{ background: '#4a3f35' }}>
                      {turnRes.state_after.date_label}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-parchment-200)', marginBottom: '0.5rem' }}>
                    {turnRes.event_description}
                  </p>

                  {/* Affected variables */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-stone-500)', alignSelf: 'center' }}>
                      Affected:
                    </span>
                    {turnRes.affected_variables.map((v) => (
                      <span key={v} className="debug-badge" style={{ background: 'rgba(74, 63, 53, 0.6)' }}>
                        {v} ({formatDelta(turnRes.effects[v])})
                      </span>
                    ))}
                  </div>

                  {/* State Before vs After comparison */}
                  <table className="debug-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Var</th>
                        <th>Before</th>
                        <th>Choice Δ</th>
                        <th>Passive Δ</th>
                        <th>Net Δ</th>
                        <th>After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STATE_VAR_KEYS.map((k) => {
                        const before = turnRes.state_before[k];
                        const after = turnRes.state_after[k];
                        const net = (turnRes.effects[k] ?? (after - before));
                        const isChanged = net !== 0;

                        return (
                          <tr key={k} style={{ background: isChanged ? 'rgba(212, 167, 44, 0.05)' : 'transparent' }}>
                            <td><code>{k}</code></td>
                            <td>{before}</td>
                            <td>{formatDelta(turnRes.choiceDelta[k])}</td>
                            <td>{formatDelta(turnRes.passiveDelta[k])}</td>
                            <td>
                              <span style={{ color: net > 0 ? 'var(--color-emerald-400)' : net < 0 ? 'var(--color-maroon-400)' : 'inherit', fontWeight: isChanged ? 'bold' : 'normal' }}>
                                {formatDelta(net)}
                              </span>
                            </td>
                            <td><strong>{after}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Generated Sub-events & Thresholds */}
                  {turnRes.events.length > 0 && (
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(191, 165, 122, 0.1)', paddingTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>
                        Engine Events ({turnRes.events.length}):
                      </span>
                      <ul style={{ fontSize: '0.8rem', color: 'var(--color-parchment-300)', paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                        {turnRes.events.map((ev) => (
                          <li key={ev.id}>
                            <strong>{ev.title}</strong> — {ev.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* End condition on this turn */}
                  {turnRes.endCondition && (
                    <div style={{ marginTop: '0.5rem', color: 'var(--color-gold-400)', fontSize: '0.85rem' }}>
                      <strong>End Condition Met:</strong> {turnRes.endCondition.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Navigation bar */}
        <div className="debug-nav">
          <button className="debug-btn" onClick={resetStage}>
            ← Back to Home
          </button>
          <button className="debug-btn" onClick={() => goToStage('SCENARIO')}>
            ← Scenario Data Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
