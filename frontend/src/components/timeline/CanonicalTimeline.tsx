/**
 * KaalNetra — Canonical Historical Timeline
 *
 * Renders the immutable, documented sequence of historical events.
 *
 * CRITICAL RULE:
 * This timeline must come ONLY from canonical historical data in the scenario.
 * It is NEVER dynamically generated or modified by player actions.
 * Clearly labeled: "Documented Historical Record".
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
  // Map evidence by id for quick lookup
  const evidenceMap = new Map<string, EvidenceEntry>();
  for (const ev of evidenceList) {
    evidenceMap.set(ev.id, ev);
  }

  return (
    <div className="canonical-timeline-container">
      <div className="timeline-heading-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge-historical">📜 Documented Historical Record</span>
          <span className="timeline-node-count">{timeline.length} Documented Epochs</span>
        </div>
        <span className="timeline-disclaimer-pill">Primary &amp; Scholarly Source Attributed</span>
      </div>

      <div className="canonical-events-track">
        {timeline.map((event, idx) => {
          return (
            <div key={event.id} className="canonical-event-card">
              <div className="canonical-event-header">
                <span className="canonical-epoch-marker">Phase {idx + 1}</span>
                <span className="canonical-event-date">{event.date_label}</span>
                <span className="canonical-evidence-badge">{event.evidence_level}</span>
              </div>

              <h3 className="canonical-event-title">{event.title}</h3>
              <p className="canonical-event-desc">{event.description}</p>

              {/* Source Attribution Chips */}
              {event.source_ids && event.source_ids.length > 0 && (
                <div className="canonical-sources-row">
                  <span className="sources-label">Sources:</span>
                  <div className="source-chips">
                    {event.source_ids.map((srcId: string) => {
                      const meta = evidenceMap.get(srcId);
                      return (
                        <button
                          key={srcId}
                          className="source-chip-btn"
                          onClick={() => onSelectEvidence && onSelectEvidence(srcId)}
                          title={meta ? `${meta.source} (${meta.type})` : srcId}
                        >
                          📖 {meta ? meta.source.split(',')[0] : srcId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
