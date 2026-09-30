/**
 * KaalNetra — Player Counterfactual Timeline
 *
 * Implements Left Pane of Section 10:
 *   - Dark charcoal background
 *   - Subtle red/brown accents
 *   - Clearly labeled: "SIMULATED OUTCOME — Hypothetical Model"
 *   - "Your decision produced..."
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
      <div className="p-8 text-center bg-[#11110F] border border-[#2B251D]">
        <p className="text-[#8F8270] text-xs font-mono">
          No simulated turns recorded. Complete a decision sequence to inspect your causal timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#2B251D]">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#FFA5A5] font-mono block">
            Hypothetical Branch
          </span>
          <span className="text-xs text-[#8F8270] font-mono">
            {history.length} Simulated Command Turns
          </span>
        </div>
        <span className="text-[10px] text-[#FFA5A5] bg-[#221010] border border-[#8C2D2E] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">
          Counterfactual Model
        </span>
      </div>

      <div className="space-y-6">
        {history.map((turnRes) => {
          const {
            turn,
            decision_id,
            option_id,
            event_description,
            effects,
            state_before,
            state_after,
          } = turnRes;

          return (
            <div
              key={turn}
              className="bg-[#11110F] border border-[#2B251D] p-5 space-y-4 shadow-md corner-ornament"
            >
              {/* Turn Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#2B251D]">
                <span className="text-xs font-bold text-[#FFA5A5] font-mono uppercase">
                  Turn {turn} &bull; {state_after.date_label}
                </span>
                <span className="text-[10px] text-[#8F8270] font-mono">
                  {decision_id} &rarr; {option_id}
                </span>
              </div>

              {/* Step 1: Decision */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#D1B16A] font-mono block">
                  Your Command Decision:
                </span>
                <p className="text-sm font-medium text-[#F4E9D0] leading-relaxed">
                  {event_description}
                </p>
              </div>

              {/* Causal transition */}
              <div className="text-center text-xs text-[#B99652] py-0.5 font-mono">
                &darr; Simulated Consequence &darr;
              </div>

              {/* Step 2: Parameter Impact */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8F8270] font-mono block">
                  Citadel Parameter Impact:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STATE_VAR_KEYS.map((k: StateVarKey) => {
                    const net = effects[k] ?? (state_after[k] - state_before[k]);
                    if (net === 0) return null;
                    const isGood = k === 'siege_progress' ? net < 0 : net > 0;

                    return (
                      <div
                        key={k}
                        className="p-2 border border-[#2B251D] bg-[#161412] text-xs flex justify-between items-center"
                      >
                        <span className="capitalize text-[#8F8270] text-[11px] font-mono">
                          {k.replace('_', ' ')}
                        </span>
                        <span
                          className={`font-bold font-mono text-[11px] ${
                            isGood ? 'text-[#79D19E]' : 'text-[#FFA5A5]'
                          }`}
                        >
                          {formatDelta(net)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Consequence Text */}
              <div className="space-y-1 bg-[#161412] border-l-2 border-l-[#8C2D2E] border-[#2B251D] p-3 text-xs text-[#D8C9AA] leading-relaxed">
                <span className="font-semibold text-[#FFA5A5] block mb-0.5 font-mono text-[10px] uppercase">
                  Simulated Outcome:
                </span>
                &ldquo;Your decision produced garrison morale at {state_after.morale}%, stone integrity at {state_after.fort_integrity}%, and enemy siege works progress at {state_after.siege_progress}%.&rdquo;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
