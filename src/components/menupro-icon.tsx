'use client'

interface MenuPROIconProps {
  size?: number;
  className?: string;
}

export function MenuPROIcon({ size = 32, className = "" }: MenuPROIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradient Background */}
        <linearGradient id={`grad-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316" /> {/* Orange */}
          <stop offset="100%" stopColor="#dc2626" /> {/* Red */}
        </linearGradient>
      </defs>

      {/* Circle */}
      <circle cx="60" cy="60" r="55" fill={`url(#grad-${size})`} />

      {/* Spoon */}
      <path
        d="M30 35 C30 27, 40 27, 40 35 C40 43, 30 43, 30 35 Z M35 43 V75"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Fork (3 tines, beside spoon) */}
      <line x1="50" y1="28" x2="50" y2="75" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="46" y1="28" x2="46" y2="42" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="54" y1="28" x2="54" y2="42" stroke="white" strokeWidth="3" strokeLinecap="round" />

      {/* QR Code (3x3 dots, beside fork with equal spacing) */}
      <circle cx="72" cy="44" r="3" fill="white" />
      <circle cx="84" cy="44" r="3" fill="white" />
      <circle cx="96" cy="44" r="3" fill="white" />

      <circle cx="72" cy="56" r="3" fill="white" />
      <circle cx="84" cy="56" r="3" fill="white" />
      <circle cx="96" cy="56" r="3" fill="white" />

      <circle cx="72" cy="68" r="3" fill="white" />
      <circle cx="84" cy="68" r="3" fill="white" />
      <circle cx="96" cy="68" r="3" fill="white" />
    </svg>
  );
}
