/**
 * KaalNetra — Historical Eye of Time / Astronomical Compass Emblem
 *
 * Antique gold astrolabe & temporal iris emblem symbolizing the "Eye of Time".
 */

interface KaalNetraEmblemProps {
  size?: number | string;
  className?: string;
  glow?: boolean;
}

export default function KaalNetraEmblem({
  size = 32,
  className = '',
  glow = false,
}: KaalNetraEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${glow ? 'drop-shadow-[0_0_8px_rgba(209,177,106,0.4)]' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* Outer Astronomical Ring */}
      <circle cx="32" cy="32" r="30" stroke="#B99652" strokeWidth="1.25" strokeDasharray="3 3" opacity="0.8" />
      <circle cx="32" cy="32" r="26" stroke="#B99652" strokeWidth="1" opacity="0.9" />

      {/* Four Cardinal Diamond Points */}
      <polygon points="32,2 34.5,8 32,10 29.5,8" fill="#D1B16A" />
      <polygon points="32,62 34.5,56 32,54 29.5,56" fill="#D1B16A" />
      <polygon points="2,32 8,34.5 10,32 8,29.5" fill="#D1B16A" />
      <polygon points="62,32 56,34.5 54,32 56,29.5" fill="#D1B16A" />

      {/* Eye of Time Outer Curve */}
      <path
        d="M10 32 C17 19, 47 19, 54 32 C47 45, 17 45, 10 32 Z"
        stroke="#D1B16A"
        strokeWidth="1.75"
        fill="#1A1815"
      />

      {/* Inner Iris Ring */}
      <circle cx="32" cy="32" r="8.5" stroke="#B99652" strokeWidth="1.25" fill="#11110F" />
      <circle cx="32" cy="32" r="3.5" fill="#D1B16A" />

      {/* Temporal Compass Lines */}
      <line x1="32" y1="12" x2="32" y2="52" stroke="#B99652" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="#B99652" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}
