/**
 * KaalNetra — Character Dialogue & Tactical Counsel Panel
 *
 * Immersive historical dialogue panel:
 *   - Character portrait on left with consistent 3:4 aspect ratio
 *   - Speaker name, role, and historical context
 *   - Dialogue in clean typography with gold quote bar
 *   - Simple solid tab buttons to cycle between advisers
 *   - Zero gradients, zero glassmorphism, solid palette
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
    <div className={`bg-[#141720] border border-[#272E3D] p-4 shadow-md ${className}`}>
      {/* Header with Title and Adviser Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#272E3D] pb-2 mb-3">
        <div className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
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
                      ? 'border-[#C5A059] bg-[#9E2A2B] text-[#F4EFE6] font-bold'
                      : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
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
              <span className="serif-title font-bold text-[#F4EFE6] text-base">
                {currentEntry.speakerName || char.name}
              </span>
              <span className="text-xs text-[#B8B09F]">
                &mdash; {currentEntry.title || char.role}
              </span>
            </div>

            {currentEntry.perspectiveTag && (
              <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-[#DFBE76] bg-[#0D0F14] border border-[#272E3D] px-2 py-0.5 mb-2 font-mono">
                {currentEntry.perspectiveTag}
              </span>
            )}

            <div className="pl-3 border-l-2 border-[#C5A059] my-1 bg-[#0D0F14] p-2">
              <p className="text-sm text-[#F4EFE6] italic leading-relaxed font-serif">
                &ldquo;{currentEntry.text}&rdquo;
              </p>
            </div>
          </div>

          {/* Character Sub-note */}
          <div className="mt-3 pt-2 border-t border-[#272E3D] text-xs text-[#788194] flex items-center justify-between font-mono">
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
