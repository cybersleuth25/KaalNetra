/**
 * KaalNetra — Player Counterfactual Timeline
 *
 * Vertical causal timeline:
 *   Decision → State Changes → Event / Consequence
 * Clean typography, solid fortress borders, antique gold accents.
 * Clearly labeled: "Your Simulation (Counterfactual)"
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
      <div className="p-8 text-center bg-[#141720] border border-[#272E3D]">
        <p className="text-[#B8B09F] text-sm">
          No simulated turns recorded. Complete a decision sequence to inspect your causal timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#272E3D]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-[#FFA3A3] font-mono">
            Your Simulation
          </span>
          <span className="text-xs text-[#B8B09F]">({history.length} Decision Turns)</span>
        </div>
        <span className="text-xs text-[#788194] font-mono uppercase">Counterfactual Model</span>
      </div>

      <div className="space-y-8">
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
            <div key={turn} className="bg-[#141720] border border-[#272E3D] p-5 space-y-4 shadow-md">
              {/* Turn Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#272E3D]">
                <span className="text-xs font-bold text-[#FFA3A3] font-mono uppercase">
                  Turn {turn} &bull; {state_after.date_label}
                </span>
                <span className="text-xs text-[#788194] font-mono">
                  {decision_id} &rarr; {option_id}
                </span>
              </div>

              {/* Step 1: Decision */}
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
                  1. Order Issued
                </div>
                <p className="text-sm font-medium text-[#F4EFE6] leading-relaxed">
                  {event_description}
                </p>
              </div>

              {/* Down Arrow */}
              <div className="text-center text-xs text-[#C5A059] py-0.5 font-mono">
                &darr; State Transition &darr;
              </div>

              {/* Step 2: State Changes */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
                  2. Parameter Impact
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STATE_VAR_KEYS.map((k: StateVarKey) => {
                    const net = effects[k] ?? (state_after[k] - state_before[k]);
                    if (net === 0) return null;
                    const isGood = k === 'siege_progress' ? net < 0 : net > 0;

                    return (
                      <div
                        key={k}
                        className="p-2 border border-[#272E3D] bg-[#0D0F14] text-xs flex justify-between items-center"
                      >
                        <span className="capitalize text-[#B8B09F]">{k.replace('_', ' ')}</span>
                        <span className={`font-bold ${isGood ? 'text-[#79D19E]' : 'text-[#FFA3A3]'}`}>
                          {formatDelta(net)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Down Arrow */}
              <div className="text-center text-xs text-[#C5A059] py-0.5 font-mono">
                &darr; Resulting Condition &darr;
              </div>

              {/* Step 3: Consequence */}
              <div className="space-y-1 bg-[#0D0F14] border border-[#272E3D] p-3 text-xs text-[#B8B09F] leading-relaxed">
                <span className="font-semibold text-[#DFBE76] block mb-0.5 font-mono">
                  Resulting Garrison State:
                </span>
                Morale at {state_after.morale}%, Fort Integrity at {state_after.fort_integrity}%, 
                Mughal Siege Progress at {state_after.siege_progress}%.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
