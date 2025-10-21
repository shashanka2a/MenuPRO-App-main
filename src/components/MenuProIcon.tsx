import * as React from "react";

export default function MenuOSIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="32" fill="#FF5A1F" />

      {/* QR-like squares */}
      <rect x="16" y="16" width="8" height="8" rx="2" fill="white" />
      <rect x="40" y="16" width="8" height="8" rx="2" fill="white" />
      <rect x="16" y="40" width="8" height="8" rx="2" fill="white" />
      <rect x="40" y="40" width="8" height="8" rx="2" fill="white" />

      {/* Fork symbol */}
      <path
        d="M30 22v8l-2 2 2 2v8c0 1.1.9 2 2 2s2-.9 2-2V22c0-1.1-.9-2-2-2s-2 .9-2 2z"
        fill="white"
      />
    </svg>
  );
}


