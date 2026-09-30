/**
 * KaalNetra — Character Portrait Component
 *
 * Implements Phase 6 Character Presentation:
 *   - Guaranteed 3:4 aspect ratio constraint (never stretched)
 *   - Object-fit cover with centered focus
 *   - Faction badges (Mewar deep maroon vs Mughal emerald)
 *   - Historical vs Fictional Composite indicator
 *   - Responsive image loading with graceful fallback
 */

import { useState } from 'react';
import { getCharacterAsset, type CharacterAsset } from '../../assets/registry';

interface CharacterPortraitProps {
  characterIdOrKey: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showQuote?: boolean;
  className?: string;
  eager?: boolean;
  onClick?: () => void;
}

export default function CharacterPortrait({
  characterIdOrKey,
  size = 'md',
  showBadge = true,
  showQuote = false,
  className = '',
  eager = false,
  onClick,
}: CharacterPortraitProps) {
  const char: CharacterAsset = getCharacterAsset(characterIdOrKey);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-32 h-44',
    lg: 'w-48 h-64',
    xl: 'w-64 h-84 md:w-72 md:h-96',
  }[size];

  const factionBadgeClass = char.faction === 'mewar'
    ? 'border-red-900/60 bg-red-950/80 text-amber-200'
    : 'border-emerald-800/60 bg-emerald-950/80 text-emerald-200';

  return (
    <div
      className={`character-portrait-wrapper relative group flex flex-col items-center ${className}`}
      onClick={onClick}
    >
      {/* Aspect Ratio Box (strictly 3:4) */}
      <div
        className={`portrait-frame relative overflow-hidden rounded-lg border border-amber-600/30 bg-stone-900/90 shadow-xl transition-all duration-300 group-hover:border-amber-500/70 group-hover:shadow-amber-500/10 ${sizeClasses}`}
        style={{ aspectRatio: '3/4' }}
      >
        {!imgError ? (
          <img
            src={char.src}
            alt={char.name}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-stone-800 text-stone-300">
            <span className="text-3xl mb-1">👤</span>
            <span className="text-xs font-serif font-bold text-amber-300">{char.name}</span>
          </div>
        )}

        {/* Ambient Dark-to-Transparent Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/20 pointer-events-none" />

        {/* Historicity Tag (Corner) */}
        <div className="absolute top-2 right-2">
          {char.historical ? (
            <span
              className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 backdrop-blur-sm"
              title="Documented Historical Figure"
            >
              Historical
            </span>
          ) : (
            <span
              className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 backdrop-blur-sm"
              title="Fictional Composite Character"
            >
              Composite
            </span>
          )}
        </div>

        {/* Lower Label in Frame */}
        <div className="absolute bottom-2 left-2 right-2 text-left pointer-events-none">
          <p className="text-xs font-serif font-bold text-parchment-100 drop-shadow-md truncate">
            {char.name}
          </p>
          <p className="text-[10px] text-amber-400/90 truncate">{char.role}</p>
        </div>
      </div>

      {/* Faction Badge below frame if requested */}
      {showBadge && (
        <span
          className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${factionBadgeClass}`}
        >
          {char.faction === 'mewar' ? '🛡️ Mewar Garrison' : '⚔️ Mughal Imperial Army'}
        </span>
      )}

      {/* Optional In-Character Quote */}
      {showQuote && (
        <blockquote className="mt-2 text-xs italic text-stone-300 text-center max-w-xs border-l-2 border-amber-500/40 pl-2">
          "{char.quote}"
        </blockquote>
      )}
    </div>
  );
}
