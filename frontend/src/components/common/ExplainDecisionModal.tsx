/**
 * KaalNetra — Explain Decision Modal
 *
 * Historiographical analysis modal for tactical options.
 * Dark charcoal surfaces, antique gold trims, zero gradients.
 */

import { useEffect, useState } from 'react';
import type { DecisionOption, GameState, ChoiceDelta } from '../../data/types';
import { explainDecision, type GuideResponse } from '../../services/aiGuideService';
import { useGameplay } from '../../app/GameplayContext';
import KaalNetraEmblem from './KaalNetraEmblem';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#161412] border border-[#B99652] text-[#D8C9AA] p-6 flex flex-col gap-4 shadow-2xl corner-ornament"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2B251D] pb-3">
          <div className="flex items-center gap-3">
            <KaalNetraEmblem size={24} />
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-[#B99652] font-mono">
                Tactical Analysis &bull; {turn ? `Turn ${turn}` : 'Historical Guidance'}
              </div>
              <h2 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0] mt-0.5">
                {activeOption ? activeOption.title : 'Decision Guidance'}
              </h2>
              {decisionPrompt && (
                <p className="text-xs text-[#8F8270] mt-0.5 italic font-['Cormorant_Garamond']">
                  &ldquo;{decisionPrompt}&rdquo;
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8F8270] hover:text-[#D1B16A] text-xl font-bold leading-none p-1 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Selected Directive Summary */}
        {activeOption && (
          <div className="p-3.5 bg-[#11110F] border border-[#2B251D] text-xs space-y-1">
            <span className="font-bold text-[#D1B16A] block font-mono uppercase text-[10px]">
              Inspected Decree:
            </span>
            <p className="text-[#D8C9AA]">{activeOption.description}</p>
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="py-8 text-center text-xs text-[#8F8270] font-mono">
            Analyzing historical chronicles and tactical deltas...
          </div>
        ) : response ? (
          <div className="space-y-4 text-xs leading-relaxed">
            {/* Historical Fact */}
            <div className="space-y-1 p-3.5 bg-[#11110F] border border-[#2B251D]">
              <span className="font-bold uppercase tracking-wider text-[#B99652] block font-mono">
                Documented Precedent:
              </span>
              <p className="text-[#D8C9AA]">{response.historicalFact}</p>
            </div>

            {/* Strategic Analysis */}
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[#D1B16A] block font-mono">
                Systemic Evaluation:
              </span>
              <p className="text-[#F4E9D0] leading-relaxed">{response.aiExplanation}</p>
            </div>

            {/* Sources */}
            {response.sources && response.sources.length > 0 && (
              <div className="pt-2 border-t border-[#2B251D] text-[11px] text-[#8F8270] flex flex-wrap gap-2 items-center font-mono">
                <span className="font-semibold text-[#D1B16A]">Authoritative Chronicles:</span>
                {response.sources.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-[#11110F] border border-[#2B251D] text-[#D8C9AA]">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-xs text-[#8F8270] font-mono">
            Tactical analysis currently operating in offline rule-based mode.
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#2B251D] flex justify-end">
          <button
            type="button"
            className="btn-historical-secondary text-xs py-1.5 px-4"
            onClick={onClose}
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
