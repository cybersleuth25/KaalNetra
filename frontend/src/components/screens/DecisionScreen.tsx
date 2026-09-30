/**
 * KaalNetra — Historical Command Room Decision Screen
 *
 * Implements Section 8 of design specification:
 *   - Player must feel like they have entered a historical command room
 *   - Header: DECISION POINT
 *   - Below: Historical situation description
 *   - Then: WHAT WILL YOU DO?
 *   - Strategic choices as substantial dark cards
 *   - Each option includes:
 *       - title (in serif / monumental style)
 *       - short explanation
 *       - potential strategic consideration
 *   - Selected card: gold border, subtle gold background glow, small gold indicator
 *   - Click interaction: subtle elegant ripple, no arcade animation
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

const STRATEGIC_CONSIDERATIONS: Record<string, string> = {
  decision_1_a: 'Historical Choice: Conserves garrison lives behind ramparts; repair teams work under direct fire.',
  decision_1_b: 'Logistical Focus: Conserves finite granary stores and Gaumukh water; lower civilian unrest.',
  decision_1_c: 'Aggressive Interdiction: Disrupts covered sabat excavation; risks irreplaceable veteran defenders in open terrain.',
  decision_2_a: 'Fortress Masonry: Focuses on masonry revetments; delays enemy infantry surge into the breach.',
  decision_2_b: 'Tactical Deployment: Concentrates veteran archers and gunners at the breach choke-point; exhausts reserve lines.',
  decision_2_c: 'Shock Counter-Attack: High casualty risk; seeks to push Mughal assault columns entirely out of the ditch.',
};

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

  const dateLabel = decisionNumber === 1 ? 'Late November 1567 &bull; Early Investment' : 'February 22, 1568 &bull; Critical Breach Crisis';
  const situationDescription = decisionNumber === 1
    ? 'Imperial sappers are assembling bulletproof covered wooden galleries (sabats) creeping up the rocky hill toward the Lakhota gate. Akbar’s heavy bronze siege guns are bombarding the outer battlements day and night. The garrison must decide how to deploy its 8,000 warriors and ration stores.'
    : 'CRITICAL BREACH! An underground Mughal gunpowder mine has detonated beneath the northern bastion, blowing a forty-foot gap through the stone curtain! Dense smoke billows across the plateau and imperial storming columns are assembling for assault! How will the garrison hold the gap?';

  return (
    <div className="app-page-clean">
      <GameHeader badge="historical" />

      <main className="clean-container py-8 sm:py-10 space-y-6">
        {/* Command Room Header */}
        <div className="flex flex-wrap items-baseline justify-between pb-3 border-b border-[#2B251D] gap-3">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-bold text-[#B99652] font-mono flex items-center gap-2">
              <span>◈ Command Chamber Directive</span>
              <span>&bull;</span>
              <span>Turn {decisionNumber} of 2</span>
            </span>
            <h1 className="font-['Cinzel'] text-3xl sm:text-4xl text-[#F4E9D0] font-extrabold mt-1 tracking-wide">
              DECISION POINT
            </h1>
          </div>
          <div className="text-xs font-mono text-[#D8C9AA] bg-[#161412] px-3.5 py-1.5 border border-[#2B251D]">
            Historical Era: <strong className="text-[#D1B16A]">{dateLabel}</strong>
          </div>
        </div>

        {/* Compact State HUD for Garrison Parameters */}
        <section>
          <StateHUD state={session.currentState} compact={true} />
        </section>

        {error && (
          <div className="p-3.5 bg-[#221010] border border-[#8C2D2E] text-[#FFA5A5] text-xs font-mono">
            {error}
          </div>
        )}

        {/* 2-Column Command Room Layout */}
        <div className="layout-sidebar-grid">
          {/* Left Column: Situation Description & Tactical Artwork */}
          <div className="space-y-5">
            {/* Situation Card */}
            <div className="historical-card p-6 corner-ornament space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2B251D]">
                <span className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono flex items-center gap-2">
                  <span>⚔️</span> Historical Situation
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#11110F] border border-[#2B251D] text-[#8F8270]">
                  Garrison Dispatch
                </span>
              </div>

              <h2 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0] leading-snug">
                {decisionPoint.prompt}
              </h2>

              <p className="text-xs sm:text-sm text-[#D8C9AA] leading-relaxed">
                {situationDescription}
              </p>

              <div className="pt-2 border-t border-[#2B251D]">
                <button
                  type="button"
                  className="text-xs font-semibold text-[#D1B16A] hover:text-[#FFF2D1] flex items-center gap-1.5 font-mono transition-colors"
                  onClick={() => setShowExplainModal(true)}
                >
                  <span>&#9432;</span> Consult Historical Records &amp; Tactical Guidance
                </button>
              </div>
            </div>

            {/* Tactical Reference Artwork */}
            <div className="historical-card p-2.5 corner-ornament">
              <picture>
                <source srcSet={ENVIRONMENTS.fort_walls.src} type="image/webp" />
                <img
                  src={ENVIRONMENTS.fort_walls.fallbackSrc ?? ENVIRONMENTS.fort_walls.src}
                  alt="Fortress Ramparts and Stone Bastions"
                  className="w-full h-40 sm:h-48 object-cover border border-[#2B251D]"
                />
              </picture>
              <div className="text-[11px] text-[#8F8270] mt-2 text-center font-['Cormorant_Garamond'] italic">
                {decisionNumber === 1
                  ? 'Chittor’s stone ramparts looking toward the advancing Mughal siege galleries.'
                  : 'The breached curtain wall at Lakhota bastion under heavy artillery smoke.'}
              </div>
            </div>
          </div>

          {/* Right Column: Choices Deck (Substantial Dark Cards) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0] tracking-wide">
                WHAT WILL YOU DO?
              </div>
              <span className="text-xs text-[#8F8270] font-mono">Select a strategic order</span>
            </div>

            {/* Substantial Dark Choice Cards */}
            <div className="space-y-3.5">
              {decisionPoint.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const letter = String.fromCharCode(65 + idx);
                const consideration = STRATEGIC_CONSIDERATIONS[option.id] ?? 'Weigh this order against garrison morale and finite supplies.';

                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`command-choice-card corner-ornament ${
                      isSelected ? 'selected' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Strategic Letter / Indicator */}
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 text-xs font-bold font-mono shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-[#B99652] text-[#11110F] border-[#D1B16A]'
                            : 'bg-[#11110F] text-[#8F8270] border-[#2B251D]'
                        }`}
                      >
                        {letter}
                      </span>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-['Cinzel'] text-base sm:text-lg font-bold text-[#F4E9D0] leading-snug">
                            {option.title}
                          </h3>
                          {isSelected && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="command-indicator-dot" />
                              <span className="text-[10px] font-bold text-[#D1B16A] uppercase font-mono tracking-wider">
                                Order Selected
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Short Explanation */}
                        <p className="text-xs sm:text-sm text-[#D8C9AA] leading-relaxed">
                          {option.description}
                        </p>

                        {/* Potential Strategic Consideration */}
                        <div className="p-2.5 bg-[#11110F] border border-[#2B251D] text-[11px] text-[#8F8270] font-mono">
                          <strong className="text-[#D1B16A] uppercase text-[10px] block mb-0.5">
                            Strategic Consideration:
                          </strong>
                          {consideration}
                        </div>

                        {/* Direct In-Card Action Button */}
                        {isSelected && (
                          <div className="pt-1.5">
                            <button
                              type="button"
                              className="btn-historical-primary text-xs py-2 px-5"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmDecision();
                              }}
                            >
                              <span>Issue This Order</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prominent Command Confirmation Bar */}
            <div className="historical-card p-5 corner-ornament flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#8F8270]">
                {selectedOption ? (
                  <span>
                    Selected Decree: <strong className="text-[#D1B16A] font-bold font-['Cinzel']">{selectedOption.title}</strong>
                  </span>
                ) : (
                  <span>Select a strategic decree above to issue to the garrison.</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  className="btn-historical-secondary text-xs py-2 px-4"
                  onClick={prevStage}
                >
                  &larr; Back
                </button>

                <button
                  type="button"
                  className="btn-historical-primary text-xs py-2.5 px-6 font-bold"
                  disabled={!selectedOptionId || isConfirming}
                  onClick={handleConfirmDecision}
                >
                  {isConfirming ? 'Dispatching Decrees...' : 'Confirm Strategic Order \u2192'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Historical Guide Analysis Modal */}
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
