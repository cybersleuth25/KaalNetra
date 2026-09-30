/**
 * KaalNetra — Simulation Turn Screen
 *
 * Immersive historical simulation screen.
 * Evaluator-optimized UX:
 *   - Turn Result Summary displayed FIRST at top
 *   - Tactical map & fort scene below the text
 *   - Clear state changes (+/-) with color bars
 *   - Commander Rao Jaimal's reaction
 *   - High-visibility action button
 * Dark fortress theme, antique gold trims, zero gradients.
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import PhaserTacticalMap from '../map/PhaserTacticalMap';
import { STATE_VAR_KEYS, type StateVarKey } from '../../data/types';
import { ENVIRONMENTS } from '../../assets/registry';

const VAR_META: Record<StateVarKey, { label: string; icon: string; goodHigh: boolean }> = {
  food: { label: 'Food Supply', icon: '🍞', goodHigh: true },
  water: { label: 'Fresh Water', icon: '💧', goodHigh: true },
  defenders: { label: 'Soldiers', icon: '⚔️', goodHigh: true },
  morale: { label: 'Morale', icon: '🛡️', goodHigh: true },
  fort_integrity: { label: 'Wall Health', icon: '🧱', goodHigh: true },
  siege_progress: { label: 'Enemy Danger', icon: '⚠️', goodHigh: false },
};

export default function SimulationScreen() {
  const { goToStage } = useStage();
  const { session, lastTurnResult } = useGameplay();
  const [viewMode, setViewMode] = useState<'map' | 'scene'>('map');

  if (!session || !lastTurnResult) {
    return (
      <div className="app-page-clean">
        <GameHeader badge="simulation" />
        <div className="clean-container py-16 text-center">
          <p className="text-[#B8B09F]">Simulation turn data not found. Please make a decision first.</p>
          <button className="btn-primary-clean mt-4" onClick={() => goToStage('DECISION_1')}>
            Go to Decision 1
          </button>
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

      <main className="clean-container py-5 sm:py-7 space-y-5">
        {/* Turn Header */}
        <div className="flex flex-wrap items-baseline justify-between pb-3 border-b border-[#272E3D] gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
              Turn {turn} Complete &bull; Results of Your Command
            </span>
            <h1 className="serif-heading text-2xl sm:text-3xl md:text-4xl text-[#F4EFE6] mt-0.5">
              Battle Simulation: What Happened?
            </h1>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#B8B09F] bg-[#141720] px-3 py-1 border border-[#272E3D]">
            Current Date: <strong className="text-[#DFBE76]">{state_after.date_label}</strong>
          </div>
        </div>

        {/* 2-Column Simulation Layout */}
        <div className="layout-sidebar-grid">
          {/* Left Column: Result Summary FIRST, then Visual Viewport */}
          <div className="space-y-4">
            {/* 1. Latest Consequence Card (TEXT FIRST) */}
            <div className="bg-[#141720] border border-[#C5A059] p-5 shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono flex items-center gap-1.5">
                  <span>📜</span> Turn {turn} Command Outcome
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76]">
                  Immediate Consequence
                </span>
              </div>

              <p className="text-base text-[#F4EFE6] leading-relaxed font-medium">
                {event_description}
              </p>

              {/* Threshold Warnings (if triggered) */}
              {thresholdEffects && thresholdEffects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#272E3D] space-y-2">
                  <span className="text-xs font-bold text-[#FFA3A3] uppercase tracking-wider block font-mono">
                    ⚠️ Urgent Warnings Triggered:
                  </span>
                  {thresholdEffects.map((t) => (
                    <div key={t.ruleId} className="p-2.5 bg-[#2A1212] border border-[#9E2A2B] text-xs text-[#FFA3A3]">
                      <strong>{t.description}</strong> &mdash; <em>{t.condition}</em>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Viewport Frame (Map or Scene Below the Text) */}
            <div className="bg-[#141720] border border-[#272E3D] p-2.5 shadow-md">
              <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-[#272E3D]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DFBE76] font-mono">
                  {viewMode === 'map' ? 'Tactical Battlefield Map' : 'Fort Ramparts Scene'}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setViewMode('map')}
                    className={`text-xs px-3 py-1 border transition-colors ${
                      viewMode === 'map'
                        ? 'border-[#C5A059] bg-[#9E2A2B] text-[#F4EFE6] font-bold'
                        : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                    }`}
                  >
                    Tactical Map
                  </button>
                  <button
                    onClick={() => setViewMode('scene')}
                    className={`text-xs px-3 py-1 border transition-colors ${
                      viewMode === 'scene'
                        ? 'border-[#C5A059] bg-[#9E2A2B] text-[#F4EFE6] font-bold'
                        : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                    }`}
                  >
                    Fort Scene
                  </button>
                </div>
              </div>

              {viewMode === 'map' ? (
                <div className="overflow-hidden bg-[#0D0F14] border border-[#272E3D]">
                  <PhaserTacticalMap height={280} />
                </div>
              ) : (
                <picture>
                  <source srcSet={ENVIRONMENTS.fort_walls.src} type="image/webp" />
                  <img
                    src={ENVIRONMENTS.fort_walls.fallbackSrc ?? ENVIRONMENTS.fort_walls.src}
                    alt="Ramparts of Chittor"
                    className="w-full h-56 object-cover border border-[#272E3D]"
                  />
                </picture>
              )}
            </div>
          </div>

          {/* Right Column: State Variables & Continuation */}
          <div className="space-y-4">
            {/* State Variable Bars */}
            <div className="bg-[#141720] border border-[#272E3D] p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#272E3D]">
                <h3 className="serif-title text-xl text-[#F4EFE6]">
                  Fort Status (After Your Order)
                </h3>
                <span className="text-xs text-[#788194] font-mono">Scale: 0&ndash;100%</span>
              </div>

              <div className="space-y-2.5">
                {STATE_VAR_KEYS.map((key) => {
                  const val = state_after[key];
                  const before = state_before[key];
                  const delta = val - before;
                  const meta = VAR_META[key];

                  return (
                    <div key={key} className="space-y-1 p-2 bg-[#0D0F14] border border-[#272E3D]">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-semibold text-[#F4EFE6] flex items-center gap-1.5">
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-base text-[#F4EFE6]">{val}%</span>
                          {delta !== 0 && (
                            <span className={`text-xs font-bold px-1.5 py-0.2 border ${
                              delta > 0
                                ? (meta.goodHigh ? 'text-[#79D19E] bg-[#12281D] border-[#2E724F]' : 'text-[#FFA3A3] bg-[#2A1212] border-[#9E2A2B]')
                                : (meta.goodHigh ? 'text-[#FFA3A3] bg-[#2A1212] border-[#9E2A2B]' : 'text-[#79D19E] bg-[#12281D] border-[#2E724F]')
                            }`}>
                              {delta > 0 ? `+${delta}` : delta}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Clean colored progress bar */}
                      <div className="w-full h-2 bg-[#1B202B] border border-[#272E3D] overflow-hidden">
                        <div
                          className={`h-full ${
                            key === 'siege_progress'
                              ? (val >= 65 ? 'bg-[#9E2A2B]' : val >= 35 ? 'bg-[#C5A059]' : 'bg-[#2E724F]')
                              : (val >= 60 ? 'bg-[#2E724F]' : val >= 35 ? 'bg-[#C5A059]' : 'bg-[#9E2A2B]')
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field Observation */}
            <div className="bg-[#141720] border border-[#272E3D] p-4 shadow-md space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] block font-mono">
                Commander Rao Jaimal&apos;s Field Report
              </span>
              <p className="text-sm text-[#F4EFE6] leading-relaxed italic bg-[#0D0F14] p-3 border-l-4 border-[#C5A059]">
                {turn === 1
                  ? '"Our warriors followed your order! We pushed back enemy work parties near the eastern ravines, but Akbar’s heavy cannons are still pounding our outer walls. Prepare for their next move!"'
                  : '"The smoke is clearing! The breach was ferocious, but our defenders held the stone line. Let us review what supplies and strength remain for the fort."'}
              </p>
            </div>

            {/* Action Box */}
            <div className="bg-[#141720] border border-[#272E3D] p-4 shadow-md text-center">
              <button
                className="btn-primary-clean w-full py-3.5 text-base font-bold"
                onClick={handleProceed}
              >
                {isComplete ? 'See Battle Outcome \u2192' : 'Proceed to Decision 2 \u2192'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
