/**
 * KaalNetra — Historiographical Reflection Assistant
 *
 * Question/answer section to aid historiographical reflection.
 * Source-grounded and restrained.
 * Dark fortress theme, antique gold trims, zero gradients.
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
      <div className="flex items-center justify-between pb-3 border-b border-[#272E3D]">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
            Historiographical Inquiry
          </span>
          <h3 className="serif-title text-xl text-[#F4EFE6] mt-0.5">
            Reflection Guide
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76] font-mono">
          Source Grounded
        </span>
      </div>

      <p className="text-xs text-[#B8B09F]">
        Select a reflective focus to evaluate the causality of your simulation against scholarly sources:
      </p>

      {/* 3 Inquiry Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSelectPrompt('biggest_decision')}
          disabled={loading}
          className={`p-3 border text-xs text-left transition-colors flex flex-col gap-1 ${
            selectedPrompt === 'biggest_decision'
              ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-semibold'
              : 'border-[#272E3D] bg-[#0D0F14] hover:bg-[#1B202B] text-[#B8B09F]'
          }`}
        >
          <strong className="text-[#DFBE76]">1. Explain Critical Turn</strong>
          <span>Analyze the decisive tactical choice that governed garrison losses.</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPrompt('historical_constraint')}
          disabled={loading}
          className={`p-3 border text-xs text-left transition-colors flex flex-col gap-1 ${
            selectedPrompt === 'historical_constraint'
              ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-semibold'
              : 'border-[#272E3D] bg-[#0D0F14] hover:bg-[#1B202B] text-[#B8B09F]'
          }`}
        >
          <strong className="text-[#DFBE76]">2. Explain Historical Constraint</strong>
          <span>Examine why external relief absence and aquifers bound defense.</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPrompt('why_different')}
          disabled={loading}
          className={`p-3 border text-xs text-left transition-colors flex flex-col gap-1 ${
            selectedPrompt === 'why_different'
              ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-semibold'
              : 'border-[#272E3D] bg-[#0D0F14] hover:bg-[#1B202B] text-[#B8B09F]'
          }`}
        >
          <strong className="text-[#DFBE76]">3. Contrast with Documented Canon</strong>
          <span>Compare how this simulation diverged from Abu&rsquo;l Fazl&rsquo;s record.</span>
        </button>
      </div>

      {/* Feedback / Response Area */}
      {loading && (
        <div className="p-4 bg-[#0D0F14] border border-[#272E3D] text-xs text-[#B8B09F] text-center">
          Synthesizing historical evidence and deterministic records...
        </div>
      )}

      {response && (
        <div className="p-5 bg-[#0D0F14] border border-[#272E3D] space-y-3 text-xs leading-relaxed mt-4 shadow-md">
          <div className="space-y-1">
            <span className="font-bold text-[#C5A059] uppercase tracking-wider block font-mono">
              Documented Grounding:
            </span>
            <p className="text-[#B8B09F]">{response.historicalFact}</p>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#272E3D]">
            <span className="font-bold text-[#DFBE76] uppercase tracking-wider block font-mono">
              Historical Interpretation:
            </span>
            <p className="text-[#F4EFE6]">{response.aiExplanation}</p>
          </div>

          {response.sources && response.sources.length > 0 && (
            <div className="pt-2 border-t border-[#272E3D] text-[#788194] flex flex-wrap gap-2 items-center font-mono">
              <span className="font-semibold text-[#B8B09F]">Sources Cited:</span>
              {response.sources.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-[#141720] border border-[#272E3D] text-[#DFBE76]">
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
