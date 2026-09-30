/**
 * KaalNetra — State HUD (Garrison Defense Console)
 *
 * Tactical fortress defense console:
 *   - Food Supply (0–100)
 *   - Fresh Water (0–100)
 *   - Soldiers (0–100)
 *   - Morale (0–100)
 *   - Wall Health (0–100)
 *   - Enemy Danger (0–100)
 *
 * Dark charcoal surfaces, antique gold seams, restrained indicators.
 */

import type { GameState, ChoiceDelta, StateVarKey } from '../../data/types';
import { STATE_VAR_KEYS } from '../../data/types';

interface StateHUDProps {
  state: GameState;
  deltas?: ChoiceDelta;
  sustainability?: number;
  compact?: boolean;
}

interface VarMeta {
  label: string;
  icon: string;
  goodHigh: boolean;
  unit?: string;
}

const VAR_METADATA: Record<StateVarKey, VarMeta> = {
  food: { label: 'Food Stores', icon: '🍞', goodHigh: true },
  water: { label: 'Gaumukh Water', icon: '💧', goodHigh: true },
  defenders: { label: 'Warriors', icon: '⚔️', goodHigh: true },
  morale: { label: 'Morale', icon: '🛡️', goodHigh: true },
  fort_integrity: { label: 'Wall Health', icon: '🧱', goodHigh: true },
  siege_progress: { label: 'Enemy Danger', icon: '⚠️', goodHigh: false },
};

function formatDelta(val: number | undefined): string | null {
  if (val === undefined || val === 0) return null;
  return val > 0 ? `+${val}` : `${val}`;
}

function getBarColor(key: StateVarKey, val: number): string {
  if (key === 'siege_progress') {
    if (val <= 35) return '#2E6B47'; // low danger
    if (val <= 65) return '#B99652'; // moderate danger
    return '#8C2D2E'; // high danger
  }
  if (val >= 60) return '#2E6B47'; // healthy
  if (val >= 35) return '#B99652'; // warning
  return '#8C2D2E'; // danger
}

export default function StateHUD({ state, deltas, sustainability, compact = false }: StateHUDProps) {
  return (
    <div className={`historical-card corner-ornament ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#2B251D] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#B99652] inline-block shadow-[0_0_6px_#D1B16A]"></span>
          <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#F4E9D0] font-mono">
            Fortress Defense Status &bull; Vital Garrison Parameters
          </span>
        </div>
        {sustainability !== undefined && (
          <div className="text-xs text-[#8F8270] bg-[#11110F] px-3 py-1 border border-[#2B251D] font-mono">
            Overall Fort Integrity: <strong className="text-[#D1B16A] font-bold text-sm">{sustainability}%</strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATE_VAR_KEYS.map((key) => {
          const val = state[key];
          const meta = VAR_METADATA[key];
          const delta = deltas ? deltas[key] : undefined;
          const formattedDelta = formatDelta(delta);
          const barColor = getBarColor(key, val);

          return (
            <div
              key={key}
              className="p-3 bg-[#11110F] border border-[#2B251D] hover:border-[#B99652]/50 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#8F8270] font-semibold flex items-center gap-1.5 font-mono">
                  <span className="text-xs">{meta.icon}</span>
                  <span className="truncate">{meta.label}</span>
                </span>
                {formattedDelta && (
                  <span
                    className={`text-[10px] font-bold font-mono px-1 py-0.2 border ${(delta ?? 0) > 0
                      ? (meta.goodHigh ? 'text-[#79D19E] bg-[#122419] border-[#2E6B47]' : 'text-[#FFA3A3] bg-[#221010] border-[#8C2D2E]')
                      : (meta.goodHigh ? 'text-[#FFA3A3] bg-[#221010] border-[#8C2D2E]' : 'text-[#79D19E] bg-[#122419] border-[#2E6B47]')
                      }`}
                  >
                    {formattedDelta}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between my-1">
                <span className="text-lg font-bold text-[#F4E9D0] font-mono">
                  {val}
                  <span className="text-xs font-normal text-[#8F8270] ml-0.5">%</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold font-mono" style={{ color: barColor }}>
                  {key === 'siege_progress'
                    ? (val >= 65 ? 'Critical' : val >= 35 ? 'Advancing' : 'Distant')
                    : (val >= 60 ? 'Secure' : val >= 35 ? 'Strained' : 'Critical')}
                </span>
              </div>

              {/* Tactical Meter Track */}
              <div className="tactical-meter-track mt-1">
                <div
                  className="tactical-meter-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, val))}%`,
                    backgroundColor: barColor,
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
