import React, { useState, useEffect } from 'react';

interface NexgenLogoProps {
  variant?: 'full' | 'crest' | 'icon' | 'horizontal';
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showTagline?: boolean;
  customLogoUrl?: string;
}

export const NexgenLogo: React.FC<NexgenLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  showTagline = true,
  customLogoUrl
}) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(customLogoUrl || null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (customLogoUrl) {
      setLogoSrc(customLogoUrl);
      setImageError(false);
    } else {
      const stored = localStorage.getItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO');
      if (stored) {
        setLogoSrc(stored);
        setImageError(false);
      }
    }
  }, [customLogoUrl]);
  // Size mapper
  let dimension = 48;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 24;
        break;
      case 'sm':
        dimension = 32;
        break;
      case 'md':
        dimension = 44;
        break;
      case 'lg':
        dimension = 64;
        break;
      case 'xl':
        dimension = 96;
        break;
    }
  }

  // Pure SVG Emblem of the Official Nexgen Computer Academy Logo
  const ShieldEmblem = ({ width = dimension, height = dimension }: { width?: number; height?: number }) => (
    <svg
      viewBox="0 0 400 320"
      width={width}
      height={height}
      className="shrink-0 select-none drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Shield Drop Shadow */}
        <filter id="ncaShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
        </filter>

        {/* Shield Clip Path for 4 Quadrants */}
        <clipPath id="shieldInnerClip">
          <path d="M140 40 L200 24 L260 40 C274 70 278 120 274 165 C268 205 235 235 200 252 C165 235 132 205 126 165 C122 120 126 70 140 40 Z" />
        </clipPath>

        {/* Subtle Gradients */}
        <linearGradient id="shieldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E4B82" />
          <stop offset="50%" stopColor="#163A6B" />
          <stop offset="100%" stopColor="#0F2B52" />
        </linearGradient>

        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A437C" />
          <stop offset="100%" stopColor="#102E59" />
        </linearGradient>
      </defs>

      {/* 1. LEFT LAUREL LEAVES (Green wreath) */}
      <g fill="#38B283" stroke="#2D8C67" strokeWidth="0.5">
        {/* Branch stem */}
        <path d="M125 210 C105 180 102 120 122 65 C123 62 125 63 124 66 C106 118 109 176 128 206 Z" />
        {/* Left leaves */}
        <path d="M118 68 C108 55 120 40 124 55 C125 62 122 66 118 68 Z" />
        <path d="M106 88 C94 80 98 64 112 73 C117 77 114 84 106 88 Z" />
        <path d="M100 114 C86 110 87 93 103 98 C109 101 107 110 100 114 Z" />
        <path d="M98 142 C84 142 82 125 99 126 C105 127 105 137 98 142 Z" />
        <path d="M101 170 C88 174 83 158 99 154 C106 153 107 164 101 170 Z" />
        <path d="M108 196 C96 204 88 189 104 180 C110 177 113 189 108 196 Z" />
        <path d="M122 216 C112 227 101 213 114 202 C119 198 126 208 122 216 Z" />
      </g>

      {/* 2. RIGHT LAUREL LEAVES (Green wreath) */}
      <g fill="#38B283" stroke="#2D8C67" strokeWidth="0.5">
        {/* Branch stem */}
        <path d="M275 210 C295 180 298 120 278 65 C277 62 275 63 276 66 C294 118 291 176 272 206 Z" />
        {/* Right leaves */}
        <path d="M282 68 C292 55 280 40 276 55 C275 62 278 66 282 68 Z" />
        <path d="M294 88 C306 80 302 64 288 73 C283 77 286 84 294 88 Z" />
        <path d="M300 114 C314 110 313 93 297 98 C291 101 293 110 300 114 Z" />
        <path d="M302 142 C316 142 318 125 301 126 C295 127 295 137 302 142 Z" />
        <path d="M299 170 C312 174 317 158 301 154 C294 153 293 164 299 170 Z" />
        <path d="M292 196 C304 204 312 189 296 180 C290 177 287 189 292 196 Z" />
        <path d="M278 216 C288 227 299 213 286 202 C281 198 274 208 278 216 Z" />
      </g>

      {/* 3. MAIN SHIELD OUTER BODY */}
      <g filter="url(#ncaShadow)">
        {/* Outer Navy Border */}
        <path
          d="M136 34 L200 18 L264 34 C282 66 286 122 282 170 C274 214 238 248 200 266 C162 248 126 214 118 170 C114 122 118 66 136 34 Z"
          fill="url(#shieldBorderGrad)"
          stroke="#0E2344"
          strokeWidth="2"
        />

        {/* White Inner Rim */}
        <path
          d="M140 40 L200 25 L260 40 C276 70 280 120 276 165 C269 206 235 238 200 254 C165 238 131 206 124 165 C120 120 124 70 140 40 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* 4. FOUR INNER QUADRANTS (Clipped inside Shield) */}
      <g clipPath="url(#shieldInnerClip)">
        {/* Top-Left Quadrant: Sky Blue (Open Book) */}
        <rect x="120" y="20" width="80" height="116" fill="#34B3F1" />
        {/* Top-Right Quadrant: Crimson Red (Globe) */}
        <rect x="200" y="20" width="80" height="116" fill="#E52E2D" />
        {/* Bottom-Left Quadrant: Vivid Orange (Lightbulb) */}
        <rect x="120" y="136" width="80" height="130" fill="#F58220" />
        {/* Bottom-Right Quadrant: Green (Pencil) */}
        <rect x="200" y="136" width="80" height="130" fill="#2EB086" />

        {/* Crisp White Cross Divider */}
        <rect x="197" y="20" width="6" height="245" fill="#FFFFFF" />
        <rect x="120" y="133" width="160" height="6" fill="#FFFFFF" />

        {/* QUADRANT 1 ICON: OPEN BOOK (Top-Left) */}
        <g fill="#FFFFFF" transform="translate(150, 68) scale(0.9)">
          <path d="M22 6 C17 3 9 3 0 6 L0 30 C9 27 17 27 22 30 C27 27 35 27 44 30 L44 6 C35 3 27 3 22 6 Z" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
          <path d="M22 6 L22 30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M6 13 C11 11 16 11 20 13 M6 18 C11 16 16 16 20 18 M6 23 C11 21 16 21 20 23" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 13 C28 11 33 11 38 13 M24 18 C28 16 33 16 38 18 M24 23 C28 21 33 21 38 23" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* QUADRANT 2 ICON: GLOBE (Top-Right) */}
        <g stroke="#FFFFFF" strokeWidth="2" fill="none" transform="translate(225, 68) scale(0.95)">
          <circle cx="16" cy="16" r="14" strokeWidth="2.5" />
          {/* Equator & Horizontal parallels */}
          <line x1="2" y1="16" x2="30" y2="16" />
          <path d="M4 10 Q16 14 28 10" />
          <path d="M4 22 Q16 18 28 22" />
          {/* Prime Meridian & vertical ellipses */}
          <line x1="16" y1="2" x2="16" y2="30" />
          <ellipse cx="16" cy="16" rx="7" ry="14" />
        </g>

        {/* QUADRANT 3 ICON: LIGHTBULB (Bottom-Left) */}
        <g fill="#FFFFFF" stroke="#FFFFFF" transform="translate(156, 148) scale(0.95)">
          {/* Bulb Outline */}
          <path
            d="M15 2 C8.5 2 4 6.8 4 13 C4 17 6.5 20.5 8 23 L8 27 C8 27.5 8.5 28 9 28 L21 28 C21.5 28 22 27.5 22 27 L22 23 C23.5 20.5 26 17 26 13 C26 6.8 21.5 2 15 2 Z"
            fill="none"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Filament */}
          <path d="M11 13 L13 7 L17 7 L19 13 M13 13 L17 13" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Base screw lines */}
          <line x1="9" y1="31" x2="21" y2="31" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="11" y1="34" x2="19" y2="34" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="15" cy="37" r="1.5" strokeWidth="0" />
        </g>

        {/* QUADRANT 4 ICON: PENCIL (Bottom-Right) */}
        <g fill="#FFFFFF" transform="translate(225, 148) scale(0.95)">
          {/* Angled pencil pointing bottom-left */}
          <g transform="rotate(-45 16 16)">
            {/* Eraser and ferrule */}
            <rect x="13" y="1" width="6" height="4" rx="1" fill="#FFFFFF" />
            <line x1="13" y1="7" x2="19" y2="7" stroke="#2EB086" strokeWidth="1" />
            {/* Pencil Shaft */}
            <path d="M13 5 L19 5 L19 22 L13 22 Z" fill="#FFFFFF" stroke="#2EB086" strokeWidth="0.5" />
            <line x1="16" y1="5" x2="16" y2="22" stroke="#2EB086" strokeWidth="0.8" />
            {/* Sharp Point */}
            <path d="M13 22 L19 22 L16 29 Z" fill="#FFFFFF" />
            {/* Graphite tip */}
            <polygon points="15,26.5 17,26.5 16,29" fill="#153C6F" />
          </g>
        </g>
      </g>

      {/* 5. RIBBON / BANNER ACROSS SHIELD BOTTOM */}
      <g filter="url(#ncaShadow)">
        {/* Ribbon folded tails left */}
        <path d="M96 244 L138 214 L138 246 L96 268 L114 254 Z" fill="#0F2B52" />
        {/* Ribbon folded tails right */}
        <path d="M304 244 L262 214 L262 246 L304 268 L286 254 Z" fill="#0F2B52" />

        {/* Main Ribbon Arch */}
        <path
          d="M106 244 C150 226 250 226 294 244 L290 274 C246 256 154 256 110 274 Z"
          fill="url(#ribbonGrad)"
          stroke="#0E2344"
          strokeWidth="1.5"
        />

        {/* Ribbon Edge Highlights */}
        <path
          d="M108 246 C152 229 248 229 292 246"
          stroke="#5C93D6"
          strokeWidth="1.2"
          fill="none"
        />

        {/* "NEXGEN" Typography on Ribbon */}
        <text
          x="200"
          y="259"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="4"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          NEXGEN
        </text>
      </g>

      {/* 6. SUB-TEXT "COMPUTER ACADEMY" */}
      <text
        x="200"
        y="298"
        textAnchor="middle"
        fill="#123B70"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="14.5"
        letterSpacing="2.5"
      >
        COMPUTER ACADEMY
      </text>
    </svg>
  );

  // Compact Crest without side laurels or text (ideal for avatar size)
  const CrestOnly = ({ width = dimension, height = dimension }: { width?: number; height?: number }) => (
    <svg
      viewBox="100 15 200 275"
      width={width}
      height={height}
      className="shrink-0 select-none drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="crestInnerClip">
          <path d="M140 40 L200 24 L260 40 C274 70 278 120 274 165 C268 205 235 235 200 252 C165 235 132 205 126 165 C122 120 126 70 140 40 Z" />
        </clipPath>
        <linearGradient id="crestBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E4B82" />
          <stop offset="100%" stopColor="#0F2B52" />
        </linearGradient>
      </defs>

      {/* Main Outer Shield */}
      <path
        d="M136 34 L200 18 L264 34 C282 66 286 122 282 170 C274 214 238 248 200 266 C162 248 126 214 118 170 C114 122 118 66 136 34 Z"
        fill="url(#crestBorderGrad)"
      />
      <path
        d="M140 40 L200 25 L260 40 C276 70 280 120 276 165 C269 206 235 238 200 254 C165 238 131 206 124 165 C120 120 124 70 140 40 Z"
        fill="#FFFFFF"
      />

      {/* Quadrants */}
      <g clipPath="url(#crestInnerClip)">
        <rect x="120" y="20" width="80" height="116" fill="#34B3F1" />
        <rect x="200" y="20" width="80" height="116" fill="#E52E2D" />
        <rect x="120" y="136" width="80" height="130" fill="#F58220" />
        <rect x="200" y="136" width="80" height="130" fill="#2EB086" />
        <rect x="197" y="20" width="6" height="245" fill="#FFFFFF" />
        <rect x="120" y="133" width="160" height="6" fill="#FFFFFF" />

        {/* Book */}
        <g fill="#FFFFFF" transform="translate(150, 68) scale(0.9)">
          <path d="M22 6 C17 3 9 3 0 6 L0 30 C9 27 17 27 22 30 C27 27 35 27 44 30 L44 6 C35 3 27 3 22 6 Z" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          <path d="M22 6 L22 30" stroke="#FFFFFF" strokeWidth="2.5" />
        </g>
        {/* Globe */}
        <g stroke="#FFFFFF" strokeWidth="2" fill="none" transform="translate(225, 68) scale(0.95)">
          <circle cx="16" cy="16" r="14" strokeWidth="2.5" />
          <line x1="2" y1="16" x2="30" y2="16" />
          <ellipse cx="16" cy="16" rx="7" ry="14" />
        </g>
        {/* Bulb */}
        <g fill="#FFFFFF" stroke="#FFFFFF" transform="translate(156, 148) scale(0.95)">
          <path d="M15 2 C8.5 2 4 6.8 4 13 C4 17 6.5 20.5 8 23 L8 27 L22 27 L22 23 C23.5 20.5 26 17 26 13 C26 6.8 21.5 2 15 2 Z" fill="none" strokeWidth="2.5" />
          <line x1="9" y1="31" x2="21" y2="31" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Pencil */}
        <g fill="#FFFFFF" transform="translate(225, 148) scale(0.95)">
          <g transform="rotate(-45 16 16)">
            <rect x="13" y="1" width="6" height="4" rx="1" fill="#FFFFFF" />
            <path d="M13 5 L19 5 L19 22 L13 22 Z" fill="#FFFFFF" stroke="#2EB086" strokeWidth="0.5" />
            <path d="M13 22 L19 22 L16 29 Z" fill="#FFFFFF" />
            <polygon points="15,26.5 17,26.5 16,29" fill="#153C6F" />
          </g>
        </g>
      </g>

      {/* Ribbon */}
      <g>
        <path d="M106 244 C150 226 250 226 294 244 L290 274 C246 256 154 256 110 274 Z" fill="#163A6B" />
        <text
          x="200"
          y="259"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="4"
        >
          NEXGEN
        </text>
      </g>
    </svg>
  );

  // If custom logo image is provided and valid
  const CustomImageLogo = ({ width = dimension, height = dimension }: { width?: number; height?: number }) => (
    <img
      src={logoSrc!}
      alt="Institute Logo"
      referrerPolicy="no-referrer"
      onError={() => setImageError(true)}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="object-contain shrink-0 drop-shadow-xs"
    />
  );

  const hasCustomImg = !!logoSrc && !imageError;

  // Variant routing
  if (variant === 'crest' || variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {hasCustomImg ? (
          <CustomImageLogo width={dimension} height={dimension} />
        ) : (
          <CrestOnly width={dimension} height={dimension} />
        )}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center space-x-3 ${className}`}>
        {hasCustomImg ? (
          <CustomImageLogo width={dimension} height={dimension} />
        ) : (
          <CrestOnly width={dimension} height={dimension} />
        )}
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">
              Nexgen Computer Academy
            </span>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.2 rounded-full">
              EST. 2018
            </span>
          </div>
          {showTagline && (
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              Center for IT, Software & Professional Skills
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      {hasCustomImg ? (
        <CustomImageLogo width={dimension} height={Math.round(dimension * 0.85)} />
      ) : (
        <ShieldEmblem width={dimension} height={Math.round(dimension * 0.8)} />
      )}
    </div>
  );
};
