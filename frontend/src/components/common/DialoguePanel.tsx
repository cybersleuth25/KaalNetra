/**
 * KaalNetra — Character Dialogue & Tactical Counsel Panel
 *
 * Implements Phase 6 Dialogue presentation:
 *   - Character portrait on left with consistent aspect ratio
 *   - Speaker name, role, and faction banner
 *   - Dialogue / counsel text in serif font with quotation styling
 *   - Interactive tab/button to cycle between advisers if multiple exist
 */

import { useState } from 'react';
import CharacterPortrait from './CharacterPortrait';
import { getCharacterAsset } from '../../assets/registry';

export interface DialogueEntry {
  characterId: string;
  speakerName?: string;
  title?: string;
  text: string;
  perspectiveTag?: string; // e.g. "Tactical Counsel", "Logistical Reality", "Imperial Intel"
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
    <div className={`dialogue-panel-container bg-stone-900/85 border border-amber-600/30 rounded-lg p-4 shadow-xl backdrop-blur-md ${className}`}>
      {/* Header with Title and Adviser Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-700/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-sm">📜</span>
          <h4 className="text-xs uppercase tracking-widest font-serif font-bold text-amber-300">
            {title}
          </h4>
        </div>

        {/* Multi-speaker Switcher Tabs if > 1 speaker */}
        {entries.length > 1 && (
          <div className="flex gap-1 overflow-x-auto py-0.5">
            {entries.map((entry, idx) => {
              const speakerChar = getCharacterAsset(entry.characterId);
              const isActive = idx === activeIndex;
              return (
                <button
                  key={entry.characterId + idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-[11px] font-sans px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-amber-200 border border-stone-700/50'
                  }`}
                >
                  <span>{speakerChar.faction === 'mewar' ? '🛡️' : '⚔️'}</span>
                  <span>{speakerChar.name.split(' ')[0]}</span>
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
              <span className="font-serif font-bold text-amber-200 text-sm md:text-base">
                {currentEntry.speakerName || char.name}
              </span>
              <span className="text-[11px] text-stone-400">
                — {currentEntry.title || char.role}
              </span>
            </div>

            {currentEntry.perspectiveTag && (
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-700/40 px-2 py-0.5 rounded mb-2">
                {currentEntry.perspectiveTag}
              </span>
            )}

            <div className="relative pl-3 border-l-2 border-amber-500/50 my-1">
              <p className="text-xs md:text-sm text-parchment-200 font-serif italic leading-relaxed">
                "{currentEntry.text}"
              </p>
            </div>
          </div>

          {/* Character Sub-note / Context */}
          <div className="mt-3 pt-2 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
            <span>
              {char.historical
                ? 'Documented in primary chronicles (Akbarnama, Bada\'uni)'
                : 'Fictional composite representing institutional role'}
            </span>
            <span className="text-stone-500 font-mono text-[10px]">
              Chittorgarh Defensive Council
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
