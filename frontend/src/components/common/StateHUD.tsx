/**
 * KaalNetra — State HUD (Heads-Up Display)
 *
 * Displays the 6 core simulation variables defined in GAME_LOGIC.md:
 *   - Food (0–100)
 *   - Water (0–100)
 *   - Defenders (0–100)
 *   - Morale (0–100)
 *   - Fort Integrity (0–100)
 *   - Siege Progress (0–100)
 *
 * Supports displaying real-time deltas and animated change feedback.
 */

import type { GameState, ChoiceDelta, StateVarKey } from '../../data/types';
import { STATE_VAR_KEYS } from '../../data/types';

interface StateHUDProps {
  state: GameState;
  deltas?: ChoiceDelta;
  sustainability?: number;
  compact?: boolean;
}

const VAR_METADATA: Record<StateVarKey, { label: string; icon: string; goodHigh: boolean }> = {
  food: { label: 'Food', icon: '🌾', goodHigh: true },
  water: { label: 'Water', icon: '💧', goodHigh: true },
  defenders: { label: 'Defenders', icon: '🛡️', goodHigh: true },
  morale: { label: 'Morale', icon: '🔥', goodHigh: true },
  fort_integrity: { label: 'Fort Integrity', icon: '🏰', goodHigh: true },
  siege_progress: { label: 'Siege Progress', icon: '⚔️', goodHigh: false },
};

function formatDelta(val: number | undefined): string | null {
  if (val === undefined || val === 0) return null;
  return val > 0 ? `+${val}` : `${val}`;
}

export default function StateHUD({ state, deltas, sustainability, compact = false }: StateHUDProps) {
  return (
    <div className={`state-hud ${compact ? 'state-hud-compact' : ''}`}>
      <div className="state-hud-header">
        <span className="state-hud-title">Defensive Parameters</span>
        {sustainability !== undefined && (
          <span className="state-hud-sustainability">
            Sustainability: <strong>{sustainability}%</strong>
          </span>
        )}
      </div>

      <div className="state-hud-grid">
        {STATE_VAR_KEYS.map((key) => {
          const val = state[key];
          const meta = VAR_METADATA[key];
          const delta = deltas ? deltas[key] : undefined;
          const formattedDelta = formatDelta(delta);

          // Health thresholds
          const isCritical = meta.goodHigh ? val <= 20 : val >= 80;
          const isWarning = meta.goodHigh ? val <= 35 : val >= 65;
          const statusClass = isCritical ? 'status-critical' : isWarning ? 'status-warning' : 'status-healthy';

          return (
            <div key={key} className={`state-card ${statusClass}`}>
              <div className="state-card-top">
                <span className="state-label">
                  <span className="state-icon">{meta.icon}</span>
                  {meta.label}
                </span>
                <span className="state-value">
                  {val}
                  {formattedDelta && (
                    <span
                      className={`state-delta ${(delta ?? 0) > 0 ? 'delta-positive' : 'delta-negative'}`}
                    >
                      {formattedDelta}
                    </span>
                  )}
                </span>
              </div>

              {/* Progress bar */}
              <div className="state-meter-track">
                <div
                  className="state-meter-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, val))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
