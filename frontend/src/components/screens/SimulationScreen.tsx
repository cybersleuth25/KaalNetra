/**
 * KaalNetra — Cinematic Simulation Screen (Command Desk)
 *
 * Implements Section 9 of design specification:
 *   - Cinematic historical command desk aesthetic
 *   - Dark translucent panels with antique gold framing
 *   - Large strategic map / environment viewport toggle
 *   - Resource panels with small gold/neutral indicators
 *   - Incoming battlefield event notifications & commander field reports
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import PhaserTacticalMap from '../map/PhaserTacticalMap';
import { STATE_VAR_KEYS, type StateVarKey } from '../../data/types';
import { ENVIRONMENTS } from '../../assets/registry';

const VAR_META: Record<StateVarKey, { label: string; icon: string; goodHigh: boolean }> = {
  food: { label: 'Food Stores', icon: '🍞', goodHigh: true },
  water: { label: 'Gaumukh Cisterns', icon: '💧', goodHigh: true },
  defenders: { label: 'Garrison Warriors', icon: '⚔️', goodHigh: true },
  morale: { label: 'Garrison Morale', icon: '🛡️', goodHigh: true },
  fort_integrity: { label: 'Stone Bastions', icon: '🧱', goodHigh: true },
  siege_progress: { label: 'Imperial Siege Works', icon: '⚠️', goodHigh: false },
};

export default function SimulationScreen() {
  const { goToStage } = useStage();
  const { session, lastTurnResult } = useGameplay();
  const [viewMode, setViewMode] = useState<'map' | 'scene'>('map');

  if (!session || !lastTurnResult) {
    return (
      <div className="app-page-clean">
        <GameHeader badge="simulation" />
        <div className="clean-container py-24 text-center">
          <div className="inline-block p-8 bg-[#161412] border border-[#B99652] shadow-2xl">
            <p className="font-['Cinzel'] text-lg text-[#D1B16A]">Awaiting Simulation Turn Data...</p>
            <p className="text-xs text-[#8F8270] mt-1 font-mono">Issue a command in the War Council first.</p>
            <button
              className="btn-historical-primary text-xs mt-4"
              onClick={() => goToStage('DECISION_1')}
            >
              Go to Decision Point &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    turn,
    state_before,
    state_after,
    event_description,
    thresholdEffects,
    endCondition,
  } = lastTurnResult;

  const isComplete = session.isComplete || endCondition !== null;

  const handleProceed = () => {
    if (isComplete) {
      goToStage('OUTCOME');
    } else {
      goToStage('DECISION_2');
    }
  };

  return (
    <div className="app-page-clean">
      <GameHeader badge="simulation" />

      <main className="clean-container py-8 sm:py-10 space-y-6">
        {/* Turn Header */}
        <div className="flex flex-wrap items-baseline justify-between pb-3 border-b border-[#2B251D] gap-2">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-bold text-[#B99652] font-mono flex items-center gap-2">
              <span>◈ Command Desk Dispatch</span>
              <span>&bull;</span>
              <span>Turn {turn} Complete</span>
            </span>
            <h1 className="font-['Cinzel'] text-2xl sm:text-3xl md:text-4xl text-[#F4E9D0] font-extrabold mt-0.5">
              Simulated Consequence
            </h1>
          </div>
          <div className="text-xs font-mono text-[#D8C9AA] bg-[#161412] px-3.5 py-1.5 border border-[#2B251D]">
            Current Date: <strong className="text-[#D1B16A]">{state_after.date_label}</strong>
          </div>
        </div>

        {/* 2-Column Command Desk Layout */}
        <div className="layout-sidebar-grid">
          {/* Left Column: Immediate Consequence & Viewport Frame */}
          <div className="space-y-5">
            {/* Event Notification (Parchment Dispatch Style) */}
            <div className="parchment-panel p-6 corner-ornament space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#A38C65]/50">
                <span className="parchment-meta flex items-center gap-2">
                  <span>📜</span> Incoming Battle Dispatch &bull; Turn {turn}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#E0CEA4] border border-[#A38C65] text-[#29231B]">
                  Simulated Outcome
                </span>
              </div>

              <p className="parchment-body text-base leading-relaxed font-semibold text-[#29231B]">
                {event_description}
              </p>

              {/* Threshold Warnings (if triggered) */}
              {thresholdEffects && thresholdEffects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#A38C65]/50 space-y-2">
                  <span className="text-[11px] font-bold text-[#8C2D2E] uppercase tracking-wider block font-mono">
                    ⚠️ Urgent Citadel Conditions:
                  </span>
                  {thresholdEffects.map((t) => (
                    <div
                      key={t.ruleId}
                      className="p-2.5 bg-[#EAC9C9] border border-[#8C2D2E] text-xs text-[#521C1C]"
                    >
                      <strong>{t.description}</strong> &mdash; <em>{t.condition}</em>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tactical Viewport Frame (Map or Fort Scene) */}
            <div className="historical-card p-3 corner-ornament">
              <div className="flex items-center justify-between px-2 py-1.5 mb-2.5 border-b border-[#2B251D]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D1B16A] font-mono">
                  {viewMode === 'map' ? 'Tactical Topography & Bastions' : 'Citadel Ramparts Observation'}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`text-xs px-3 py-1 border transition-colors ${
                      viewMode === 'map'
                        ? 'border-[#B99652] bg-[#1F1C16] text-[#D1B16A] font-bold'
                        : 'border-[#2B251D] bg-[#11110F] text-[#8F8270] hover:text-[#D8C9AA]'
                    }`}
                  >
                    Tactical Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('scene')}
                    className={`text-xs px-3 py-1 border transition-colors ${
                      viewMode === 'scene'
                        ? 'border-[#B99652] bg-[#1F1C16] text-[#D1B16A] font-bold'
                        : 'border-[#2B251D] bg-[#11110F] text-[#8F8270] hover:text-[#D8C9AA]'
                    }`}
                  >
                    Fort Scene
                  </button>
                </div>
              </div>

              {viewMode === 'map' ? (
                <div className="overflow-hidden bg-[#11110F] border border-[#2B251D]">
                  <PhaserTacticalMap height={280} />
                </div>
              ) : (
                <picture>
                  <source srcSet={ENVIRONMENTS.fort_walls.src} type="image/webp" />
                  <img
                    src={ENVIRONMENTS.fort_walls.fallbackSrc ?? ENVIRONMENTS.fort_walls.src}
                    alt="Ramparts of Chittorgarh"
                    className="w-full h-64 object-cover border border-[#2B251D]"
                  />
                </picture>
              )}
            </div>
          </div>

          {/* Right Column: Resource Gauges & Commander Field Report */}
          <div className="space-y-5">
            {/* Historical Command Desk Resource Panels */}
            <div className="historical-card p-6 corner-ornament space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2B251D]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B99652] font-mono block">
                    Garrison Audit
                  </span>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
                    Fortress Resources
                  </h3>
                </div>
                <span className="text-xs text-[#8F8270] font-mono">Scale: 0&ndash;100%</span>
              </div>

              {/* Resource Panels with Small Gold / Neutral Indicators */}
              <div className="space-y-3">
                {STATE_VAR_KEYS.map((key) => {
                  const val = state_after[key];
                  const before = state_before[key];
                  const delta = val - before;
                  const meta = VAR_META[key];

                  return (
                    <div key={key} className="p-3 bg-[#11110F] border border-[#2B251D] space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-medium text-[#D8C9AA] flex items-center gap-2">
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </span>
                        
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-sm text-[#F4E9D0] font-mono">{val}%</span>
                          {delta !== 0 && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 border font-mono ${
                                delta > 0
                                  ? (meta.goodHigh ? 'text-[#79D19E] bg-[#122419] border-[#2E6B47]' : 'text-[#FFA3A3] bg-[#221010] border-[#8C2D2E]')
                                  : (meta.goodHigh ? 'text-[#FFA3A3] bg-[#221010] border-[#8C2D2E]' : 'text-[#79D19E] bg-[#122419] border-[#2E6B47]')
                              }`}
                            >
                              {delta > 0 ? `+${delta}` : delta}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tactical Meter Track */}
                      <div className="tactical-meter-track">
                        <div
                          className="tactical-meter-fill"
                          style={{
                            width: `${Math.max(0, Math.min(100, val))}%`,
                            backgroundColor:
                              key === 'siege_progress'
                                ? (val >= 65 ? '#8C2D2E' : val >= 35 ? '#B99652' : '#2E6B47')
                                : (val >= 60 ? '#2E6B47' : val >= 35 ? '#B99652' : '#8C2D2E'),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commander's Field Dispatch */}
            <div className="historical-card p-5 corner-ornament space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] block font-mono">
                Commander Rao Jaimal&apos;s Field Dispatch
              </span>
              <p className="text-xs sm:text-sm text-[#D8C9AA] leading-relaxed italic bg-[#11110F] p-3.5 border-l-2 border-l-[#B99652] font-['Cormorant_Garamond']">
                {turn === 1
                  ? '"Your commands were carried out across the perimeter! We checked enemy working parties near the ravines, but Akbar’s heavy guns continue to shatter our masonry. The garrison prepares for their next assault!"'
                  : '"The smoke clears over the ramparts! The breach was defended with desperate courage. Review our remaining munitions and stores as we face the culmination of this siege."'}
              </p>
            </div>

            {/* Command Action Box */}
            <div className="historical-card p-5 corner-ornament text-center">
              <button
                type="button"
                className="btn-historical-primary w-full py-3.5 text-sm"
                onClick={handleProceed}
              >
                <span>{isComplete ? 'Inspect Siege Outcome' : 'Proceed to Turn 2 Decision'}</span>
                <span className="text-[#D1B16A]">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
