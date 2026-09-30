/**
 * KaalNetra — Explain Decision Modal
 *
 * Historiographical analysis modal for tactical options.
 * Dark fortress theme, antique gold trims, zero gradients.
 */

import { useEffect, useState } from 'react';
import type { DecisionOption, GameState, ChoiceDelta } from '../../data/types';
import { explainDecision, type GuideResponse } from '../../services/aiGuideService';
import { useGameplay } from '../../app/GameplayContext';

interface ExplainDecisionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  option?: DecisionOption | null;
  selectedOption?: DecisionOption | null;
  allOptions?: DecisionOption[];
  turn?: number;
  decisionPrompt?: string;
  currentState?: GameState | null;
  delta?: ChoiceDelta | Partial<Record<string, number>>;
}

export default function ExplainDecisionModal({
  isOpen = true,
  onClose,
  option,
  selectedOption,
  allOptions,
  turn,
  decisionPrompt,
  currentState: propState,
  delta = {},
}: ExplainDecisionModalProps) {
  const { session } = useGameplay();
  const activeOption = selectedOption ?? option ?? (allOptions && allOptions[0]) ?? null;
  const activeState = propState ?? session?.currentState ?? null;

  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<GuideResponse | null>(null);

  useEffect(() => {
    if (!isOpen || !activeOption || !activeState) {
      setResponse(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    explainDecision(activeOption, activeState, delta || activeOption.delta)
      .then((res) => {
        if (isMounted) {
          setResponse(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeOption, activeState, delta]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141720] border border-[#C5A059] text-[#F4EFE6] p-6 flex flex-col gap-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#272E3D] pb-3">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
              Tactical Analysis &bull; {turn ? `Turn ${turn}` : 'Historical Guide'}
            </div>
            <h2 className="serif-title text-xl text-[#F4EFE6] mt-0.5">
              {activeOption ? activeOption.title : 'Decision Guidance'}
            </h2>
            {decisionPrompt && (
              <p className="text-xs text-[#B8B09F] mt-1 italic">
                &ldquo;{decisionPrompt}&rdquo;
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#B8B09F] hover:text-[#DFBE76] text-xl font-bold leading-none p-1 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Selected Directive Summary */}
        {activeOption && (
          <div className="p-3 bg-[#0D0F14] border border-[#272E3D] text-xs space-y-1">
            <span className="font-bold text-[#DFBE76] block font-mono uppercase">Selected Order:</span>
            <p className="text-[#B8B09F]">{activeOption.description}</p>
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="py-8 text-center text-xs text-[#B8B09F]">
            Analyzing historical chronicles and tactical deltas...
          </div>
        ) : response ? (
          <div className="space-y-4 text-xs leading-relaxed">
            {/* Historical Fact */}
            <div className="space-y-1 p-3 bg-[#0D0F14] border border-[#272E3D]">
              <span className="font-bold uppercase tracking-wider text-[#C5A059] block font-mono">
                Documented Precedent:
              </span>
              <p className="text-[#B8B09F]">{response.historicalFact}</p>
            </div>

            {/* Strategic Analysis */}
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[#DFBE76] block font-mono">
                Systemic Evaluation:
              </span>
              <p className="text-[#F4EFE6] leading-relaxed">{response.aiExplanation}</p>
            </div>

            {/* Sources */}
            {response.sources && response.sources.length > 0 && (
              <div className="pt-2 border-t border-[#272E3D] text-[#788194] flex flex-wrap gap-2 items-center font-mono">
                <span className="font-semibold text-[#B8B09F]">Authoritative Chronicles:</span>
                {response.sources.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76]">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-xs text-[#B8B09F]">
            Tactical analysis currently operating in offline rule-based mode.
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#272E3D] flex justify-end">
          <button
            type="button"
            className="btn-secondary-clean text-xs py-1.5 px-4"
            onClick={onClose}
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
