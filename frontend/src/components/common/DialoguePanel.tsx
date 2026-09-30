/**
 * KaalNetra — Character Dialogue & Tactical Counsel Panel
 *
 * Immersive historical dialogue panel:
 *   - Character portrait on left with consistent 3:4 aspect ratio
 *   - Speaker name, role, and historical context
 *   - Dialogue in clean typography with gold quote bar
 *   - Simple solid tab buttons to cycle between advisers
 *   - Dark charcoal surfaces, antique gold framing
 */

import { useState } from 'react';
import CharacterPortrait from './CharacterPortrait';
import { getCharacterAsset } from '../../assets/registry';

export interface DialogueEntry {
  characterId: string;
  speakerName?: string;
  title?: string;
  text: string;
  perspectiveTag?: string;
}

interface DialoguePanelProps {
  entries: DialogueEntry[];
  title?: string;
  className?: string;
}

export default function DialoguePanel({
  entries,
  title = 'Council of War Deliberation',
  className = '',
}: DialoguePanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!entries || entries.length === 0) return null;

  const currentEntry = entries[activeIndex] || entries[0];
  const char = getCharacterAsset(currentEntry.characterId);

  return (
    <div className={`historical-card p-4 sm:p-5 corner-ornament ${className}`}>
      {/* Header with Title and Adviser Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B251D] pb-2 mb-3">
        <div className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono">
          {title}
        </div>

        {/* Multi-speaker Switcher Tabs */}
        {entries.length > 1 && (
          <div className="flex gap-1 overflow-x-auto py-0.5">
            {entries.map((entry, idx) => {
              const speakerChar = getCharacterAsset(entry.characterId);
              const isActive = idx === activeIndex;
              return (
                <button
                  key={entry.characterId + idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`text-xs px-2.5 py-1 border transition-colors ${
                    isActive
                      ? 'border-[#B99652] bg-[#1F1C16] text-[#D1B16A] font-bold'
                      : 'border-[#2B251D] bg-[#11110F] text-[#8F8270] hover:text-[#D8C9AA]'
                  }`}
                >
                  {speakerChar.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Dialogue Box */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Character Portrait */}
        <div className="flex-shrink-0">
          <CharacterPortrait
            characterIdOrKey={currentEntry.characterId}
            size="md"
            showBadge={false}
          />
        </div>

        {/* Content Column */}
        <div className="flex-1 flex flex-col justify-between self-stretch text-left">
          <div>
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <span className="font-['Cinzel'] font-bold text-[#F4E9D0] text-base">
                {currentEntry.speakerName || char.name}
              </span>
              <span className="text-xs text-[#8F8270] font-mono">
                &mdash; {currentEntry.title || char.role}
              </span>
            </div>

            {currentEntry.perspectiveTag && (
              <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-[#D1B16A] bg-[#11110F] border border-[#2B251D] px-2 py-0.5 mb-2 font-mono">
                {currentEntry.perspectiveTag}
              </span>
            )}

            <div className="pl-3 border-l-2 border-l-[#B99652] my-1 bg-[#11110F] p-3">
              <p className="text-sm text-[#D8C9AA] italic leading-relaxed font-['Cormorant_Garamond']">
                &ldquo;{currentEntry.text}&rdquo;
              </p>
            </div>
          </div>

          {/* Character Sub-note */}
          <div className="mt-3 pt-2 border-t border-[#2B251D] text-[11px] text-[#8F8270] flex items-center justify-between font-mono">
            <span>
              {char.historical
                ? 'Documented in primary chronicles (Akbarnama, Badauni)'
                : 'Fictional composite representing institutional administrative role'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
