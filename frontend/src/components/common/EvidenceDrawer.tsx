/**
 * KaalNetra — Historical Evidence Drawer
 *
 * PRD §11:
 *   Drawer / Modal contents:
 *     - Claim
 *     - Source & Citation
 *     - Source Type
 *     - Status / Evidence Level
 *     - Caveat / Simulation Note
 */

import type { EvidenceEntry } from '../../data/types';

interface EvidenceDrawerProps {
  evidenceList: EvidenceEntry[];
  activeEvidenceId: string | null;
  onClose: () => void;
}

export default function EvidenceDrawer({
  evidenceList,
  activeEvidenceId,
  onClose,
}: EvidenceDrawerProps) {
  if (!activeEvidenceId) return null;

  const item = evidenceList.find((e) => e.id === activeEvidenceId);
  if (!item) return null;

  return (
    <div className="evidence-modal-backdrop" onClick={onClose}>
      <div className="evidence-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="evidence-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="evidence-icon">📜</span>
            <span className="evidence-modal-badge">{item.evidence_level}</span>
            <h3 className="evidence-modal-title">Historical Evidence Record</h3>
          </div>
          <button className="evidence-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="evidence-modal-body">
          <div className="evidence-field">
            <span className="field-label">Historical Claim:</span>
            <p className="field-claim">{item.claim}</p>
          </div>

          <div className="evidence-field">
            <span className="field-label">Source Citation:</span>
            <p className="field-source">
              <strong>{item.source}</strong>
            </p>
          </div>

          <div className="evidence-field">
            <span className="field-label">Source Classification:</span>
            <p className="field-type">{item.type}</p>
          </div>

          {item.note && (
            <div className="evidence-field evidence-note-box">
              <span className="field-label">Scholarly Caveat / Simulation Note:</span>
              <p>{item.note}</p>
            </div>
          )}
        </div>

        <div className="evidence-modal-footer">
          <span className="evidence-tagline">
            KaalNetra Archival Grounding &bull; Historical integrity strictly separated from counterfactual simulation.
          </span>
          <button className="game-btn game-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
