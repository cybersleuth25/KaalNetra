/**
 * KaalNetra — Imperial War Council Header
 *
 * Immersive historical navigation bar.
 * Deep fortress basalt background, antique gold trim, tactical stepper.
 * Zero gradients, zero generic styling.
 */

import { useState } from 'react';
import { useStage, type GameStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import HistoricalGuideModal from './HistoricalGuideModal';

const STAGE_LABELS: Record<GameStage, string> = {
  HOME: 'Home',
  SCENARIO: 'Scenario',
  CONTEXT: 'Historical Context',
  BRIEFING: 'War Council',
  DECISION_1: 'Decision 1',
  SIMULATION_1: 'Simulation',
  DECISION_2: 'Decision 2',
  OUTCOME: 'Final Outcome',
  COMPARE: 'Comparison',
  REFLECTION: 'Reflection',
};

const STAGES_ORDER: GameStage[] = [
  'SCENARIO',
  'CONTEXT',
  'BRIEFING',
  'DECISION_1',
  'SIMULATION_1',
  'DECISION_2',
  'OUTCOME',
  'COMPARE',
  'REFLECTION',
];

interface GameHeaderProps {
  currentStage?: GameStage;
  badge?: 'historical' | 'simulation' | 'result';
}

export default function GameHeader({ badge }: GameHeaderProps) {
  const { stage, prevStage, reset } = useStage();
  const { restart } = useGameplay();
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  const handleRestart = () => {
    restart();
    reset();
  };

  const currentIdx = STAGES_ORDER.indexOf(stage);

  return (
    <>
      <header className="w-full bg-[#0D0F14] border-b border-[#272E3D] sticky top-0 z-40">
        <div className="w-full max-w-[82rem] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand with Gold Leaf Accent */}
          <div
            className="flex items-baseline gap-2.5 cursor-pointer select-none"
            onClick={handleRestart}
          >
            <span className="serif-title text-xl sm:text-2xl font-extrabold tracking-widest text-[#F4EFE6]">
              KAALNETRA
            </span>
            <span className="hidden sm:inline text-[11px] uppercase tracking-widest text-[#C5A059] font-mono">
              Chittorgarh &bull; 1567
            </span>
          </div>

          {/* Context Badge */}
          <div className="flex items-center gap-3">
            {badge === 'historical' && (
              <span className="text-xs font-bold px-2.5 py-1 border border-[#C5A059] bg-[#141720] text-[#DFBE76] tracking-wider uppercase">
                Historical Record
              </span>
            )}
            {badge === 'simulation' && (
              <span className="text-xs font-bold px-2.5 py-1 border border-[#9E2A2B] bg-[#221010] text-[#FFA3A3] tracking-wider uppercase">
                Simulation Result
              </span>
            )}
            {badge === 'result' && (
              <span className="text-xs font-bold px-2.5 py-1 border border-[#C5A059] bg-[#241D12] text-[#E2C37E] tracking-wider uppercase">
                Comparative Analysis
              </span>
            )}

            {/* Tactical Actions */}
            {stage !== 'HOME' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-secondary-clean text-xs py-1.5 px-3"
                  onClick={prevStage}
                  title="Return to previous stage"
                >
                  &larr; Back
                </button>

                <button
                  type="button"
                  className="btn-secondary-clean text-xs py-1.5 px-3"
                  onClick={handleRestart}
                  title="Reset simulation to beginning"
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="btn-secondary-clean text-xs py-1.5 px-3 border-[#C5A059] text-[#DFBE76]"
                  onClick={() => setShowGuideModal(true)}
                  title="Open Historical Guide"
                >
                  Guide
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stepper Strip (When in scenario flow) */}
        {stage !== 'HOME' && currentIdx >= 0 && (
          <div className="w-full bg-[#11141B] border-t border-[#272E3D] px-4 py-2 overflow-x-auto">
            <div className="w-full max-w-[82rem] mx-auto flex items-center justify-between gap-2 text-xs text-[#B8B09F] whitespace-nowrap">
              {STAGES_ORDER.map((stg, idx) => {
                const isCurrent = stg === stage;
                const isPassed = idx < currentIdx;

                return (
                  <div key={stg} className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#9E2A2B] border border-[#C5A059] text-[#F4EFE6]'
                          : isPassed
                          ? 'bg-[#272E3D] text-[#DFBE76]'
                          : 'border border-[#272E3D] text-[#788194]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className={isCurrent ? 'font-bold text-[#F4EFE6]' : 'text-[#788194]'}>
                      {STAGE_LABELS[stg]}
                    </span>
                    {idx < STAGES_ORDER.length - 1 && (
                      <span className="text-[#272E3D] mx-1">&rsaquo;</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Historical Guide Modal */}
      {showGuideModal && (
        <HistoricalGuideModal onClose={() => setShowGuideModal(false)} />
      )}
    </>
  );
}
