'use client'

interface MenuPROIconProps {
  size?: number;
  className?: string;
}

export function MenuPROIcon({ size = 32, className = "" }: MenuPROIconProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-sm" style={{ fontSize: `${size * 0.4}px` }}>
        M
      </span>
    </div>
  );
}
