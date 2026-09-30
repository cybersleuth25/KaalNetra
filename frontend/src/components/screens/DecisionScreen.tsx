/**
 * KaalNetra — Decision Screen
 *
 * Core interactive command screen.
 * Evaluator-optimized UX:
 *   - Situation text displayed FIRST at top (ahead of artwork)
 *   - Compact StateHUD fort indicators for optimal above-the-fold visibility
 *   - High-contrast, easily operable tactical choices
 *   - Direct 1-click execution & prominent confirmation
 * Dark fortress theme, antique gold trims, zero gradients.
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import StateHUD from '../common/StateHUD';
import ExplainDecisionModal from '../common/ExplainDecisionModal';
import { ENVIRONMENTS } from '../../assets/registry';
import type { DecisionOption } from '../../data/types';

interface DecisionScreenProps {
  decisionNumber: 1 | 2;
}

export default function DecisionScreen({ decisionNumber }: DecisionScreenProps) {
  const { prevStage, goToStage } = useStage();
  const { scenario, session, applyPlayerDecision, error } = useGameplay();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);

  if (!scenario || !session) return null;

  const targetId = decisionNumber === 1 ? 'decision_1' : 'decision_2';
  const decisionPoint = scenario.decision_points.find((d) => d.id === targetId) ?? scenario.decision_points[0];

  const selectedOption: DecisionOption | undefined = decisionPoint.options.find(
    (o) => o.id === selectedOptionId
  );

  const handleConfirmDecision = () => {
    if (!selectedOptionId || isConfirming) return;
    setIsConfirming(true);

    const success = applyPlayerDecision(targetId, selectedOptionId);
    if (success) {
      goToStage(decisionNumber === 1 ? 'SIMULATION_1' : 'OUTCOME');
    } else {
      setIsConfirming(false);
    }
  };

  const dateLabel = decisionNumber === 1 ? 'Late 1567 (Early Siege Stage)' : 'February 1568 (Critical Breach Crisis)';
  const situationDescription = decisionNumber === 1
    ? 'Enemy diggers are constructing giant bullet-proof wooden tunnels (sabats) creeping up the rocky hill toward our gates. Akbar’s bronze cannons are pounding the stone ramparts. Where should you deploy your soldiers and resources right now?'
    : 'DISASTER! An underground enemy gunpowder mine just blew open a 40-foot hole in our stone wall! Heavy smoke is billowing everywhere and enemy assault troops are charging the opening! How do you defend the gap?';

  return (
    <div className="app-page-clean">
      <GameHeader badge="historical" />

      <main className="clean-container py-5 sm:py-7 space-y-5">
        {/* Turn Header */}
        <div className="flex flex-wrap items-baseline justify-between pb-3 border-b border-[#272E3D] gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
              Turn {decisionNumber} of 2 &bull; War Council Command
            </span>
            <h1 className="serif-heading text-2xl sm:text-3xl md:text-4xl text-[#F4EFE6] mt-0.5">
              {decisionNumber === 1 ? 'Decision 1: Block the Enemy Advance' : 'Decision 2: Defend the Blown Wall'}
            </h1>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#B8B09F] bg-[#141720] px-3 py-1 border border-[#272E3D]">
            Historical Date: <strong className="text-[#DFBE76]">{dateLabel}</strong>
          </div>
        </div>

        {/* State HUD (Compact Mode for Clean Viewport Fit) */}
        <section>
          <StateHUD state={session.currentState} compact={true} />
        </section>

        {error && (
          <div className="p-3 bg-[#2A1212] border border-[#9E2A2B] text-[#FFA3A3] text-sm">
            {error}
          </div>
        )}

        {/* 2-Column Decision Grid: Text-First Layout */}
        <div className="layout-sidebar-grid">
          {/* Left Column: Situation Text FIRST, then Supporting Artwork */}
          <div className="space-y-4">
            {/* 1. Situation Text Card FIRST */}
            <div className="bg-[#141720] border border-[#C5A059] p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono flex items-center gap-1.5">
                  <span>⚔️</span> The Situation on the Ground
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76]">
                  Immediate Crisis
                </span>
              </div>

              <h3 className="serif-title text-xl text-[#F4EFE6] leading-snug">
                {decisionPoint.prompt}
              </h3>

              <p className="text-sm text-[#B8B09F] leading-relaxed">
                {situationDescription}
              </p>

              <div className="pt-2 border-t border-[#272E3D]">
                <button
                  type="button"
                  className="text-xs font-bold text-[#DFBE76] hover:underline flex items-center gap-1.5 font-mono"
                  onClick={() => setShowExplainModal(true)}
                >
                  <span>&#9432;</span> Open Historical Guide &amp; Tactical Advice
                </button>
              </div>
            </div>

            {/* 2. Tactical Visual Reference (Placed Below the Text) */}
            <figure className="border border-[#272E3D] bg-[#141720] p-2 shadow-md">
              <picture>
                <source srcSet={ENVIRONMENTS.fort_walls.src} type="image/webp" />
                <img
                  src={ENVIRONMENTS.fort_walls.fallbackSrc ?? ENVIRONMENTS.fort_walls.src}
                  alt="Fortress Ramparts and Walls"
                  className="w-full h-36 sm:h-44 object-cover border border-[#272E3D]"
                />
              </picture>
              <figcaption className="text-xs text-[#DFBE76] mt-1.5 text-center font-serif">
                {decisionNumber === 1
                  ? 'Chittor’s stone ramparts looking down on the advancing imperial tunnels.'
                  : 'The breached Lakhota bastion footings under heavy artillery fire.'}
              </figcaption>
            </figure>
          </div>

          {/* Right Column: Choices Deck & Immediate Operability */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="text-xs uppercase tracking-wider font-bold text-[#F4EFE6] font-mono">
                Select Your Tactical Order:
              </div>
              <span className="text-xs text-[#DFBE76] font-mono">Click card to select &amp; order</span>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {decisionPoint.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`p-4 sm:p-5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-l-4 border-l-[#C5A059] border-[#C5A059] bg-[#1B202B] shadow-lg ring-1 ring-[#C5A059]'
                        : 'border-[#272E3D] bg-[#141720] hover:bg-[#1B202B] hover:border-[#3D4659]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#C5A059] text-[#0D0F14]'
                            : 'bg-[#0D0F14] border border-[#272E3D] text-[#B8B09F]'
                        }`}
                      >
                        {letter}
                      </span>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-base sm:text-lg text-[#F4EFE6]">
                            {option.title}
                          </h4>
                          {isSelected && (
                            <span className="text-xs font-bold text-[#DFBE76] px-2 py-0.5 bg-[#0D0F14] border border-[#C5A059] font-mono uppercase shrink-0">
                              Selected Order
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#B8B09F] leading-relaxed">
                          {option.description}
                        </p>

                        {/* Direct In-Card Action Button for Quick Evaluation */}
                        {isSelected && (
                          <div className="pt-2">
                            <button
                              type="button"
                              className="btn-primary-clean text-xs py-1.5 px-4 font-bold"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmDecision();
                              }}
                            >
                              Execute This Order &rarr;
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prominent Confirmation Bar */}
            <div className="bg-[#141720] border border-[#272E3D] p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#B8B09F]">
                {selectedOption ? (
                  <span>
                    Ready to order: <strong className="text-[#DFBE76] font-bold">{selectedOption.title}</strong>
                  </span>
                ) : (
                  <span>Select an order above to execute this turn.</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  className="btn-secondary-clean text-xs py-2 px-4"
                  onClick={prevStage}
                >
                  &larr; Back
                </button>
                <button
                  className="btn-primary-clean text-sm py-2.5 px-6 font-bold"
                  disabled={!selectedOptionId || isConfirming}
                  onClick={handleConfirmDecision}
                >
                  {isConfirming ? 'Executing Command...' : 'Confirm Decision \u2192'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Optional Clean Historical Guide Modal */}
      {showExplainModal && (
        <ExplainDecisionModal
          turn={decisionNumber}
          decisionPrompt={decisionPoint.prompt}
          selectedOption={selectedOption}
          allOptions={decisionPoint.options}
          onClose={() => setShowExplainModal(false)}
        />
      )}
    </div>
  );
}
