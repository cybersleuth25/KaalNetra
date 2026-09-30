/**
 * KaalNetra — Historical Guide Modal
 *
 * Immersive historical inquiry dialog.
 * Grounded explanatory Q&A layer with primary source attribution.
 * Dark charcoal surfaces, antique gold trims, zero gradients.
 */

import React, { useState } from 'react';
import { useGameplay } from '../../app/GameplayContext';
import { askHistoricalGuide, type GuideResponse } from '../../services/aiGuideService';
import KaalNetraEmblem from './KaalNetraEmblem';

interface HistoricalGuideModalProps {
  isOpen?: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

const QUICK_INQUIRIES = [
  'Why was the siege difficult?',
  'What constraints existed for the defenders?',
  'Why did my decision reduce stability?',
  'How did Mughal sabats and mines work?',
  'Why did Rana Udai Singh II withdraw to the hills?',
];

export default function HistoricalGuideModal({
  isOpen = true,
  onClose,
  initialQuestion = '',
}: HistoricalGuideModalProps) {
  const { scenario, session } = useGameplay();
  const [question, setQuestion] = useState<string>(initialQuestion);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<GuideResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || !session || !scenario) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await askHistoricalGuide(
        queryText,
        session.currentState,
        session.turnHistory,
        scenario
      );
      setResponse(res);
    } catch {
      setErrorMsg('Operating in offline source-grounded mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickClick = (q: string) => {
    setQuestion(q);
    handleAsk(q);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#161412] border border-[#B99652] text-[#D8C9AA] p-6 flex flex-col gap-5 shadow-2xl corner-ornament"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2B251D] pb-3">
          <div className="flex items-center gap-3">
            <KaalNetraEmblem size={24} />
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-[#B99652] font-mono">
                Primary Archival Inquiry
              </div>
              <h2 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0] mt-0.5">
                Historical Library &amp; Guide
              </h2>
              <p className="text-xs text-[#8F8270] mt-0.5 font-mono">
                Source-grounded chronicles for the Siege of Chittorgarh (1567&ndash;1568 CE).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8F8270] hover:text-[#D1B16A] text-xl font-bold leading-none p-1 transition-colors"
            aria-label="Close Guide"
          >
            &times;
          </button>
        </div>

        {/* Quick Inquiries */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#8F8270] uppercase tracking-wider block font-mono">
            Suggested Historical Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_INQUIRIES.map((q) => (
              <button
                key={q}
                type="button"
                className="text-xs px-2.5 py-1 border border-[#2B251D] bg-[#11110F] hover:border-[#B99652] text-[#D1B16A] transition-colors"
                onClick={() => handleQuickClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Search / Question Input */}
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the historical siege..."
            className="flex-1 text-sm p-2.5 border border-[#2B251D] bg-[#11110F] text-[#F4E9D0] focus:outline-none focus:border-[#B99652]"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn-historical-primary text-xs py-2 px-4"
          >
            {loading ? 'Consulting...' : 'Ask Guide'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-[#11110F] border border-[#2B251D] text-xs text-[#8F8270]">
            {errorMsg}
          </div>
        )}

        {/* Response Panel */}
        {response && (
          <div className="space-y-4 pt-4 border-t border-[#2B251D] text-sm leading-relaxed">
            {/* Fact */}
            <div className="p-3.5 bg-[#11110F] border border-[#2B251D] space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#B99652] block font-mono">
                Documented Historical Fact:
              </span>
              <p className="text-[#D8C9AA] text-xs leading-relaxed">{response.historicalFact}</p>
            </div>

            {/* Explanation */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] block font-mono">
                Analysis:
              </span>
              <p className="text-[#F4E9D0] text-xs leading-relaxed">{response.aiExplanation}</p>
            </div>

            {/* Sources */}
            {response.sources && response.sources.length > 0 && (
              <div className="pt-2 border-t border-[#2B251D] text-xs text-[#8F8270] flex flex-wrap gap-2 items-center font-mono">
                <span className="font-semibold text-[#D1B16A]">Authoritative Citations:</span>
                {response.sources.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-[#11110F] border border-[#2B251D] text-[#D8C9AA]">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#2B251D] flex justify-end">
          <button
            type="button"
            className="btn-historical-secondary text-xs py-1.5 px-4"
            onClick={onClose}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
