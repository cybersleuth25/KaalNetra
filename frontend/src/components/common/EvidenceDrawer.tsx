/**
 * KaalNetra — Historical Evidence Drawer / Modal
 *
 * Contents:
 *   - Claim
 *   - Source & Citation
 *   - Source Type
 *   - Status / Evidence Level
 *   - Scholarly Caveat / Simulation Note
 */

import type { EvidenceEntry } from '../../data/types';
import KaalNetraEmblem from './KaalNetraEmblem';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#161412] border border-[#B99652] text-[#D8C9AA] p-7 shadow-2xl space-y-5 corner-ornament"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#2B251D] pb-3">
          <div className="flex items-center gap-3">
            <KaalNetraEmblem size={24} />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#B99652] font-mono">
                Archival Evidence Dossier &bull; {item.evidence_level}
              </div>
              <h3 className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0] mt-0.5">
                Primary Historical Source Record
              </h3>
            </div>
          </div>
          <button
            className="text-[#8F8270] hover:text-[#D1B16A] text-xl font-bold p-1 leading-none transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-1 p-3.5 bg-[#11110F] border border-[#2B251D]">
            <span className="font-bold uppercase tracking-wider text-[#B99652] block font-mono text-[10px]">
              Documented Historical Claim:
            </span>
            <p className="text-[#F4E9D0] text-sm leading-relaxed">{item.claim}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[#D1B16A] block font-mono text-[10px]">
              Source &amp; Citation:
            </span>
            <p className="text-[#D1B16A] font-['Cormorant_Garamond'] text-base italic">
              {item.source}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#8F8270] font-mono">
            <span>Classification: <strong className="text-[#D8C9AA]">{item.type}</strong></span>
            <span>&bull;</span>
            <span>Level: <strong className="text-[#D1B16A]">{item.evidence_level}</strong></span>
          </div>

          {item.note && (
            <div className="p-3.5 bg-[#11110F] border border-[#2B251D] text-xs text-[#8F8270] space-y-1">
              <span className="font-bold uppercase tracking-wider text-[#B99652] block font-mono text-[10px]">
                Historiographical Caveat / Simulation Note:
              </span>
              <p className="leading-relaxed">{item.note}</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#2B251D] flex items-center justify-between">
          <span className="text-[11px] text-[#8F8270] font-mono">
            KaalNetra Archival Grounding
          </span>
          <button
            type="button"
            className="btn-historical-secondary text-xs py-1.5 px-4"
            onClick={onClose}
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
