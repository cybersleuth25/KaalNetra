/**
 * KaalNetra — Canonical Historical Timeline
 *
 * Implements Right Pane of Section 10:
 *   - Aged parchment aesthetic
 *   - Dark ink typography (#29231B)
 *   - Warm gold accents
 *   - Clearly labeled: "DOCUMENTED HISTORY — Immutable Record"
 *   - "Historical records show..."
 */

import type { CanonicalTimelineEvent, EvidenceEntry } from '../../data/types';

interface CanonicalTimelineProps {
  timeline: CanonicalTimelineEvent[];
  evidenceList: EvidenceEntry[];
  onSelectEvidence?: (evidenceId: string) => void;
}

export default function CanonicalTimeline({
  timeline,
  evidenceList,
  onSelectEvidence,
}: CanonicalTimelineProps) {
  const evidenceMap = new Map<string, EvidenceEntry>();
  for (const ev of evidenceList) {
    evidenceMap.set(ev.id, ev);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#A38C65]/50">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#54493B] font-mono block">
            Archival Record
          </span>
          <span className="text-xs text-[#54493B] font-mono">
            {timeline.length} Documented Historical Epochs
          </span>
        </div>
        <span className="text-[10px] text-[#29231B] bg-[#E0CEA4] border border-[#A38C65] px-2 py-0.5 font-mono uppercase font-bold tracking-wider">
          Immutable Canon
        </span>
      </div>

      <div className="space-y-6">
        {timeline.map((event, idx) => {
          return (
            <div
              key={event.id}
              className="bg-[#F2E5C5] border border-[#A38C65] p-5 space-y-3 shadow-md corner-ornament"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#A38C65]/50">
                <span className="text-xs font-bold text-[#29231B] font-mono uppercase">
                  Phase {idx + 1} &bull; {event.date_label}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E8D7B3] border border-[#A38C65] text-[#29231B] font-mono">
                  {event.evidence_level}
                </span>
              </div>

              <h4 className="font-['Cinzel'] text-lg font-bold text-[#29231B]">
                {event.title}
              </h4>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#54493B] block">
                  Documented History:
                </span>
                <p className="font-['Cormorant_Garamond'] text-base text-[#29231B] leading-relaxed">
                  &ldquo;Historical records show {event.description.charAt(0).toLowerCase() + event.description.slice(1)}&rdquo;
                </p>
              </div>

              {/* Source Attribution Chips */}
              {event.source_ids && event.source_ids.length > 0 && (
                <div className="pt-2 border-t border-[#A38C65]/40 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#54493B]">
                    Primary Chronicles:
                  </span>
                  {event.source_ids.map((srcId: string) => {
                    const meta = evidenceMap.get(srcId);
                    return (
                      <button
                        key={srcId}
                        type="button"
                        onClick={() => onSelectEvidence && onSelectEvidence(srcId)}
                        className="text-xs px-2 py-0.5 bg-[#E8D7B3] border border-[#A38C65] text-[#29231B] hover:border-[#29231B] font-mono transition-colors"
                        title={meta ? `${meta.source} (${meta.type})` : srcId}
                      >
                        {meta ? meta.source.split(',')[0] : srcId}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
