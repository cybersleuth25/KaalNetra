/**
 * KaalNetra — Archival Character Portrait Component
 *
 * Implements Section 7 of design specification:
 *   - Guaranteed 3:4 aspect ratio constraint (never stretched)
 *   - Object-fit cover with centered focus
 *   - Antique gold framing, archival corner rivets
 *   - Historical vs Composite status label
 *   - Clean archival character record presentation
 */

import { useState } from 'react';
import { getCharacterAsset, type CharacterAsset } from '../../assets/registry';

interface CharacterPortraitProps {
  characterIdOrKey: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showQuote?: boolean;
  showDetails?: boolean;
  className?: string;
  eager?: boolean;
  onClick?: () => void;
}

export default function CharacterPortrait({
  characterIdOrKey,
  size = 'md',
  showBadge = true,
  showQuote = false,
  showDetails = false,
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
    xl: 'w-60 h-80',
  }[size];

  return (
    <div
      className={`character-portrait-wrapper flex flex-col items-center ${className}`}
      onClick={onClick}
    >
      {/* 3:4 Aspect Ratio Archival Frame with Antique Gold Border */}
      <div
        className={`archival-portrait-frame relative overflow-hidden ${sizeClasses}`}
        style={{ aspectRatio: '3/4' }}
      >
        {!imgError ? (
          <img
            src={char.src}
            alt={char.name}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#11110F] text-[#8F8270]">
            <span className="text-xs font-['Cinzel'] font-bold text-[#F4E9D0]">{char.name}</span>
          </div>
        )}

        {/* Historicity Tag (Corner Label) */}
        {showBadge && (
          <div className="absolute top-2 right-2 z-10">
            {char.historical ? (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 border border-[#B99652] bg-[#11110F]/90 text-[#D1B16A] font-mono uppercase tracking-wider"
                title="Documented Historical Figure"
              >
                Historical Record
              </span>
            ) : (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 border border-[#2B251D] bg-[#11110F]/90 text-[#8F8270] font-mono uppercase tracking-wider"
                title="Fictional Composite Character"
              >
                Composite Character
              </span>
            )}
          </div>
        )}
      </div>

      {/* Optional Details below Portrait */}
      {showDetails && (
        <div className="mt-3 text-center space-y-1">
          <h4 className="font-['Cinzel'] font-bold text-base text-[#F4E9D0] leading-snug">
            {char.name}
          </h4>
          <span className="text-xs uppercase tracking-wider text-[#D1B16A] font-medium block">
            {char.title}
          </span>
          {char.historical && (
            <span className="text-[10px] text-[#8F8270] font-mono block">
              Documented Record
            </span>
          )}
        </div>
      )}

      {/* Optional Spoken Quote */}
      {showQuote && char.quote && (
        <blockquote className="mt-2 text-xs italic text-[#D1B16A] text-center max-w-xs leading-relaxed font-['Cormorant_Garamond']">
          &ldquo;{char.quote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}
