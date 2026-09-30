/**
 * KaalNetra — State HUD (Fort Defense Status)
 *
 * Tactical fortress defense console:
 *   - Food Supply (0–100)
 *   - Fresh Water (0–100)
 *   - Soldiers (0–100)
 *   - Morale (0–100)
 *   - Wall Health (0–100)
 *   - Enemy Danger (0–100)
 *
 * Solid colors, architectural borders, antique gold accents, zero gradients.
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
  food: { label: 'Food Supply', icon: '🍞', goodHigh: true },
  water: { label: 'Fresh Water', icon: '💧', goodHigh: true },
  defenders: { label: 'Soldiers', icon: '⚔️', goodHigh: true },
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
    if (val <= 35) return '#2E724F'; // low danger
    if (val <= 65) return '#C5A059'; // moderate danger
    return '#9E2A2B'; // high danger
  }
  if (val >= 60) return '#2E724F'; // healthy
  if (val >= 35) return '#C5A059'; // warning
  return '#9E2A2B'; // danger
}

export default function StateHUD({ state, deltas, sustainability, compact = false }: StateHUDProps) {
  return (
    <div className={`bg-[#141720] border border-[#272E3D] shadow-md ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#272E3D] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C5A059] inline-block"></span>
          <span className="text-xs uppercase tracking-widest font-bold text-[#F4EFE6] font-mono">
            Fort Defense Status &bull; Vital Garrison Resources
          </span>
        </div>
        {sustainability !== undefined && (
          <div className="text-xs text-[#B8B09F] bg-[#0D0F14] px-3 py-1 border border-[#272E3D]">
            Overall Fort Integrity: <strong className="text-[#DFBE76] font-bold text-sm">{sustainability}%</strong>
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
              className="p-3 bg-[#1B202B] border border-[#272E3D] hover:border-[#3D4659] transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#B8B09F] font-semibold flex items-center gap-1.5">
                  <span className="text-sm">{meta.icon}</span>
                  <span>{meta.label}</span>
                </span>
                {formattedDelta && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 border ${
                      (delta ?? 0) > 0
                        ? (meta.goodHigh ? 'text-[#79D19E] bg-[#12281D] border-[#2E724F]' : 'text-[#FFA3A3] bg-[#2A1212] border-[#9E2A2B]')
                        : (meta.goodHigh ? 'text-[#FFA3A3] bg-[#2A1212] border-[#9E2A2B]' : 'text-[#79D19E] bg-[#12281D] border-[#2E724F]')
                    }`}
                  >
                    {formattedDelta}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between my-1">
                <span className="text-xl font-bold text-[#F4EFE6]">
                  {val}
                  <span className="text-xs font-normal text-[#788194] ml-0.5">%</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: barColor }}>
                  {key === 'siege_progress'
                    ? (val >= 65 ? 'Critical' : val >= 35 ? 'Advancing' : 'Distant')
                    : (val >= 60 ? 'Secure' : val >= 35 ? 'Strained' : 'Critical')}
                </span>
              </div>

              {/* Solid Progress Bar (NO GRADIENTS) */}
              <div className="w-full h-2 bg-[#0D0F14] border border-[#272E3D] overflow-hidden mt-1">
                <div
                  className="h-full transition-all duration-300"
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
