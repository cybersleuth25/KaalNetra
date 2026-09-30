/**
 * KaalNetra — Historiographical Reflection Assistant
 *
 * Question/answer section to aid historiographical reflection.
 * Source-grounded and restrained.
 * Dark charcoal surfaces, antique gold framing, zero gradients.
 */

import { useState } from 'react';
import { useGameplay } from '../../app/GameplayContext';
import { askReflectionAssistant, type GuideResponse } from '../../services/aiGuideService';
import type { Scenario } from '../../data/types';

type PromptType = 'biggest_decision' | 'historical_constraint' | 'why_different';

interface ReflectionAssistantProps {
  scenario?: Scenario;
}

export default function ReflectionAssistant({ scenario: propScenario }: ReflectionAssistantProps) {
  const { scenario: contextScenario, session } = useGameplay();
  const scenario = propScenario ?? contextScenario;

  const [selectedPrompt, setSelectedPrompt] = useState<PromptType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<GuideResponse | null>(null);

  if (!session || !scenario) return null;

  const handleSelectPrompt = async (type: PromptType) => {
    setSelectedPrompt(type);
    setLoading(true);
    setResponse(null);

    try {
      const res = await askReflectionAssistant(
        type,
        session.currentState,
        session.turnHistory,
        scenario
      );
      setResponse(res);
    } catch {
      // Handled gracefully in service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#2B251D]">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#B99652] font-mono">
            Historiographical Inquiry
          </span>
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0] mt-0.5">
            Reflection Assistant
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#11110F] border border-[#B99652] text-[#D1B16A] font-mono">
          Source Grounded
        </span>
      </div>

      <p className="text-xs text-[#8F8270]">
        Select an inquiry focus to evaluate the causality of your simulation against scholarly sources:
      </p>

      {/* 3 Inquiry Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSelectPrompt('biggest_decision')}
          disabled={loading}
          className={`p-3.5 border text-xs text-left transition-all flex flex-col gap-1.5 ${
            selectedPrompt === 'biggest_decision'
              ? 'border-[#B99652] bg-[#1F1C16] text-[#F4E9D0] font-semibold shadow-[0_0_10px_rgba(209,177,106,0.15)]'
              : 'border-[#2B251D] bg-[#11110F] hover:bg-[#1A1815] text-[#8F8270] hover:text-[#D8C9AA]'
          }`}
        >
          <strong className="text-[#D1B16A] font-['Cinzel']">1. Explain Critical Turn</strong>
          <span className="leading-relaxed">Analyze the decisive tactical choice that governed garrison losses.</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPrompt('historical_constraint')}
          disabled={loading}
          className={`p-3.5 border text-xs text-left transition-all flex flex-col gap-1.5 ${
            selectedPrompt === 'historical_constraint'
              ? 'border-[#B99652] bg-[#1F1C16] text-[#F4E9D0] font-semibold shadow-[0_0_10px_rgba(209,177,106,0.15)]'
              : 'border-[#2B251D] bg-[#11110F] hover:bg-[#1A1815] text-[#8F8270] hover:text-[#D8C9AA]'
          }`}
        >
          <strong className="text-[#D1B16A] font-['Cinzel']">2. Explain Historical Constraint</strong>
          <span className="leading-relaxed">Examine why external relief absence and aquifers bound defense.</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPrompt('why_different')}
          disabled={loading}
          className={`p-3.5 border text-xs text-left transition-all flex flex-col gap-1.5 ${
            selectedPrompt === 'why_different'
              ? 'border-[#B99652] bg-[#1F1C16] text-[#F4E9D0] font-semibold shadow-[0_0_10px_rgba(209,177,106,0.15)]'
              : 'border-[#2B251D] bg-[#11110F] hover:bg-[#1A1815] text-[#8F8270] hover:text-[#D8C9AA]'
          }`}
        >
          <strong className="text-[#D1B16A] font-['Cinzel']">3. Contrast with Documented Canon</strong>
          <span className="leading-relaxed">Compare how this simulation diverged from Abu&rsquo;l Fazl&rsquo;s record.</span>
        </button>
      </div>

      {/* Feedback / Response Area */}
      {loading && (
        <div className="p-4 bg-[#11110F] border border-[#2B251D] text-xs text-[#8F8270] text-center font-mono">
          Synthesizing historical evidence and deterministic records...
        </div>
      )}

      {response && (
        <div className="p-5 bg-[#11110F] border border-[#B99652] space-y-3 text-xs leading-relaxed mt-4 shadow-md corner-ornament">
          <div className="space-y-1">
            <span className="font-bold text-[#B99652] uppercase tracking-wider block font-mono">
              Documented Grounding:
            </span>
            <p className="text-[#D8C9AA] leading-relaxed">{response.historicalFact}</p>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#2B251D]">
            <span className="font-bold text-[#D1B16A] uppercase tracking-wider block font-mono">
              Historiographical Interpretation:
            </span>
            <p className="text-[#F4E9D0] leading-relaxed font-medium">{response.aiExplanation}</p>
          </div>

          {response.sources && response.sources.length > 0 && (
            <div className="pt-2 border-t border-[#2B251D] text-[11px] text-[#8F8270] flex flex-wrap gap-2 items-center font-mono">
              <span className="font-semibold text-[#D1B16A]">Sources Cited:</span>
              {response.sources.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-[#161412] border border-[#2B251D] text-[#D8C9AA]">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
