/**
 * KaalNetra — Character Portrait Component
 *
 * Immersive historical character presentation:
 *   - Guaranteed 3:4 aspect ratio constraint (never stretched)
 *   - Object-fit cover with centered focus
 *   - Antique gold framing, historical vs composite status
 *   - Zero gradients, zero blur overlays, solid borders
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
    xl: 'w-60 h-80',
  }[size];

  return (
    <div
      className={`character-portrait-wrapper flex flex-col items-center ${className}`}
      onClick={onClick}
    >
      {/* Aspect Ratio Box (strictly 3:4) with Antique Gold Trim */}
      <div
        className={`portrait-frame relative overflow-hidden border border-[#C5A059] bg-[#141720] shadow-md ${sizeClasses}`}
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
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#0D0F14] text-[#B8B09F]">
            <span className="text-xs font-serif font-bold text-[#F4EFE6]">{char.name}</span>
          </div>
        )}

        {/* Historicity Tag (Corner) */}
        {showBadge && (
          <div className="absolute top-2 right-2">
            {char.historical ? (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 border border-[#C5A059] bg-[#0D0F14] text-[#DFBE76] font-mono uppercase"
                title="Documented Historical Figure"
              >
                Historical
              </span>
            ) : (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 border border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] font-mono uppercase"
                title="Fictional Composite Character"
              >
                Composite
              </span>
            )}
          </div>
        )}
      </div>

      {/* Optional Quote / Name Below Frame */}
      {showQuote && char.quote && (
        <blockquote className="mt-2 text-xs italic text-[#DFBE76] text-center max-w-xs leading-snug font-serif">
          &ldquo;{char.quote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}
