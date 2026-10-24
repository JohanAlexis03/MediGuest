import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'icon-only';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}) => {
  // Dimension scales
  const dimensions = {
    sm: { width: 140, height: 42, iconSize: 'h-8' },
    md: { width: 190, height: 58, iconSize: 'h-10' },
    lg: { width: 250, height: 76, iconSize: 'h-14' },
    xl: { width: 320, height: 96, iconSize: 'h-20' },
  };

  const dim = dimensions[size];

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <svg 
          viewBox="0 0 160 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={dim.iconSize}
        >
          {/* Siren */}
          <rect x="52" y="12" width="16" height="10" rx="3" fill="#DC2626" />
          
          {/* Ambulance Body Outline */}
          <path
            d="M 28 32 H 78 V 46 H 112 L 136 78 H 144 V 104 H 126"
            stroke="#DC2626"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 28 32 V 88 H 40"
            stroke="#DC2626"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Rear Wheel */}
          <circle cx="58" cy="92" r="14" fill="#DC2626" />

          {/* Front Wheel */}
          <circle cx="118" cy="92" r="14" fill="#DC2626" />

          {/* Central ECG Pulse */}
          <path
            d="M 72 92 H 78 L 84 104 L 92 64 L 98 116 L 104 84 L 108 92 H 116"
            stroke="#DC2626"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${dim.width}px`, height: 'auto', maxHeight: `${dim.height}px` }}
        className="overflow-visible"
      >
        {/* ============================================================ */}
        {/* 1. ROD OF ASCLEPIUS / CADUCEUS (Staff in Blue, Snake in Black) */}
        {/* ============================================================ */}
        <g id="rod-of-asclepius" transform="translate(10, 10)">
          {/* Central Blue Staff */}
          <path
            d="M 38 12 V 152"
            stroke="#1D4ED8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Staff Top Knop */}
          <circle cx="38" cy="12" r="4.5" fill="#1D4ED8" />

          {/* Asclepius Snake winding around the staff */}
          {/* Wing/head crest at the top */}
          <path
            d="M 22 28 C 22 20, 38 18, 48 24 C 54 28, 54 36, 46 40 C 38 44, 22 46, 22 56 C 22 66, 48 64, 52 74 C 56 84, 24 88, 26 100 C 28 112, 50 114, 48 126 C 46 136, 36 142, 38 152"
            stroke="#111827"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 54 28 C 54 20, 38 18, 28 24 C 22 28, 22 36, 30 40 C 38 44, 54 46, 54 56 C 54 66, 28 64, 24 74 C 20 84, 52 88, 50 100 C 48 112, 26 114, 28 126 C 30 136, 40 142, 38 152"
            stroke="#111827"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ============================================================ */}
        {/* 2. WORDMARK: "MediQuest" & SLOGAN: "Aprende. Practica. Salva vidas" */}
        {/* ============================================================ */}
        <g id="brand-typography">
          {/* Wordmark */}
          <text
            x="85"
            y="88"
            fill="#111827"
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            fontSize="54"
            fontWeight="700"
            letterSpacing="-1.2px"
          >
            MediQuest
          </text>

          {/* Slogan */}
          <text
            x="90"
            y="118"
            fill="#1F2937"
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            fontSize="18"
            fontWeight="500"
            letterSpacing="-0.2px"
          >
            Aprende. Practica. Salva vidas
          </text>
        </g>

        {/* ============================================================ */}
        {/* 3. RED AMBULANCE SILHOUETTE WITH INTEGRATED ECG HEARTBEAT */}
        {/* ============================================================ */}
        <g id="ambulance-ecg" transform="translate(190, 0)">
          {/* Emergency Siren on Roof */}
          <path
            d="M 126 32 C 126 26, 138 26, 138 32 V 42 H 126 Z"
            fill="#DC2626"
          />

          {/* Ambulance Body Contour (Roof, Cabin, Windshield, Hood, Bumper) */}
          <path
            d="M 98 44 
               H 156 
               V 58 
               H 194 
               L 224 96 
               H 244 
               V 136 
               H 220"
            stroke="#DC2626"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Rear Box & Tailgate of Ambulance */}
          <path
            d="M 28 136 
               V 112 
               H 42 
               V 136"
            stroke="#DC2626"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Rear Wheel (Solid Red Circle) */}
          <circle cx="70" cy="136" r="22" fill="#DC2626" />

          {/* Front Wheel (Solid Red Circle) */}
          <circle cx="186" cy="136" r="22" fill="#DC2626" />

          {/* Rear Bumper & Chassis Base Line */}
          <path
            d="M 6 150 H 68"
            stroke="#DC2626"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Front Chassis Base Line */}
          <path
            d="M 194 150 H 228"
            stroke="#DC2626"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Red ECG Pulse Waveform: Between Rear and Front Wheels */}
          {/* P-wave, Q dip, R high spike, S deep plunge, T wave */}
          <path
            d="M 88 136 
               H 98 
               L 106 142 
               L 112 72 
               L 126 172 
               L 140 108 
               L 150 144 
               L 156 136 
               H 176"
            stroke="#DC2626"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
