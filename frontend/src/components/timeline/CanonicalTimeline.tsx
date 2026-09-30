/**
 * KaalNetra — Canonical Historical Timeline
 *
 * Renders the immutable, documented sequence of historical events.
 * Clearly labeled: "Documented History"
 * Primary and scholarly source attributed.
 * Antique Rajput Gold framing, dark basalt background, zero gradients.
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
      <div className="flex items-center justify-between pb-3 border-b border-[#272E3D]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-[#DFBE76] font-mono">
            Documented History
          </span>
          <span className="text-xs text-[#B8B09F]">({timeline.length} Historical Epochs)</span>
        </div>
        <span className="text-xs text-[#C5A059] font-mono uppercase">Immutable Canon</span>
      </div>

      <div className="space-y-6">
        {timeline.map((event, idx) => {
          return (
            <div key={event.id} className="bg-[#141720] border border-[#C5A059] p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-[#272E3D]">
                <span className="text-xs font-bold text-[#DFBE76] font-mono uppercase">
                  Phase {idx + 1} &bull; {event.date_label}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#B8B09F] font-mono">
                  {event.evidence_level}
                </span>
              </div>

              <h4 className="serif-title text-lg text-[#F4EFE6]">
                {event.title}
              </h4>

              <p className="text-sm text-[#B8B09F] leading-relaxed">
                {event.description}
              </p>

              {/* Source Attribution */}
              {event.source_ids && event.source_ids.length > 0 && (
                <div className="pt-2 border-t border-[#272E3D] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#DFBE76]">Sources:</span>
                  {event.source_ids.map((srcId: string) => {
                    const meta = evidenceMap.get(srcId);
                    return (
                      <button
                        key={srcId}
                        type="button"
                        onClick={() => onSelectEvidence && onSelectEvidence(srcId)}
                        className="text-xs px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76] hover:border-[#C5A059] transition-colors"
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
