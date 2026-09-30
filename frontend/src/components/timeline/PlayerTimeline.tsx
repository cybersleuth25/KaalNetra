/**
 * KaalNetra — Player Counterfactual Timeline
 *
 * Visually displays the causal chain of the player's simulated orders:
 *   Decision → State Deltas → Thresholds / Sub-events → Situation Evolution
 *
 * Clearly labeled: "Counterfactual Simulation"
 * Does NOT claim that these simulated events historically occurred.
 */

import type { TurnResult } from '../../simulation';
import type { StateVarKey } from '../../data/types';
import { STATE_VAR_KEYS } from '../../data/types';

interface PlayerTimelineProps {
  history: TurnResult[];
}

function formatDelta(val: number | undefined): string {
  if (val === undefined || val === 0) return '0';
  return val > 0 ? `+${val}` : `${val}`;
}

export default function PlayerTimeline({ history }: PlayerTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="timeline-empty-card">
        <p>No simulated turns recorded. Complete a decision sequence to inspect your causal timeline.</p>
      </div>
    );
  }

  return (
    <div className="player-timeline-container">
      <div className="timeline-heading-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge-simulation">⚔️ Counterfactual Simulation</span>
          <span className="timeline-node-count">{history.length} Turn(s) Evaluated</span>
        </div>
        <span className="timeline-disclaimer-pill">Simulation Assumption &bull; Pure Rule Engine</span>
      </div>

      <div className="causal-nodes-flow">
        {history.map((turnRes) => {
          const {
            turn,
            decision_id,
            option_id,
            event_description,
            effects,
            thresholdEffects,
            state_before,
            state_after,
          } = turnRes;

          return (
            <div key={turn} className="causal-turn-block">
              {/* Turn Header */}
              <div className="causal-turn-header">
                <span className="causal-turn-badge">Turn {turn}</span>
                <span className="causal-turn-date">{state_after.date_label}</span>
                <span className="causal-order-id">
                  Order: <code>{decision_id} &rarr; {option_id}</code>
                </span>
              </div>

              {/* Step 1: Decision Input */}
              <div className="causal-step step-decision">
                <div className="step-indicator">
                  <span className="step-dot" />
                  <span className="step-label">1. Order Issued</span>
                </div>
                <div className="step-body">
                  <p className="step-description">{event_description}</p>
                </div>
              </div>

              {/* Causal Link Arrow */}
              <div className="causal-arrow">&darr; <span>Generates Resource Deltas</span> &darr;</div>

              {/* Step 2: State Deltas */}
              <div className="causal-step step-deltas">
                <div className="step-indicator">
                  <span className="step-dot" />
                  <span className="step-label">2. Net State Transition</span>
                </div>
                <div className="step-body">
                  <div className="causal-delta-grid">
                    {STATE_VAR_KEYS.map((k: StateVarKey) => {
                      const net = effects[k] ?? (state_after[k] - state_before[k]);
                      if (net === 0) return null;
                      const isGood = k === 'siege_progress' ? net < 0 : net > 0;

                      return (
                        <div key={k} className={`causal-delta-pill ${isGood ? 'pill-beneficial' : 'pill-adverse'}`}>
                          <span className="delta-key">{k.replace('_', ' ')}:</span>
                          <span className="delta-val">{formatDelta(net)}</span>
                          <span className="delta-transition">({state_before[k]} &rarr; {state_after[k]})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Triggered Thresholds (if any) */}
              {thresholdEffects.length > 0 && (
                <>
                  <div className="causal-arrow">&darr; <span>Crosses Threshold Limits</span> &darr;</div>
                  <div className="causal-step step-thresholds">
                    <div className="step-indicator">
                      <span className="step-dot dot-warning" />
                      <span className="step-label">3. Threshold Rules Activated</span>
                    </div>
                    <div className="step-body">
                      {thresholdEffects.map((te, idx) => (
                        <div key={idx} className="threshold-rule-line">
                          <strong>⚠️ {te.description}:</strong> Condition <code>{te.condition}</code> triggered additional strain.
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Downstream Situation */}
              <div className="causal-arrow">&darr; <span>Determines Next Situation</span> &darr;</div>
              <div className="causal-step step-situation">
                <div className="step-indicator">
                  <span className="step-dot" />
                  <span className="step-label">4. Subsequent Defense Posture</span>
                </div>
                <div className="step-body">
                  <p>
                    Fort Integrity at <strong>{state_after.fort_integrity}%</strong>,
                    Mughal Siege Progress at <strong>{state_after.siege_progress}%</strong>,
                    with <strong>{state_after.defenders}%</strong> garrison strength remaining.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
