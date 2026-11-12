import React from 'react';
import { AsadoRoleId } from '../logic/asadoTaxEngine';

/**
 * Plays a realistic physical rubber-stamp "THUD / CLACK" using Web Audio API (zero external files)
 */
export function playRubberStampSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Low mechanical desk thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.09);

    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Ignore audio restrictions if browser blocks autoplay
  }
}

/**
 * Sol de Mayo Argentine Emblem SVG (16 symmetrical rays; only rays rotate so the face stays upright)
 */
export const SolDeMayoIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Rotating 16-ray crown */}
      <g className="animate-sol-mayo" style={{ transformOrigin: '32px 32px' }}>
        {rays.map((angle, idx) => (
          <g key={angle} transform={`rotate(${angle} 32 32)`}>
            {idx % 2 === 0 ? (
              <line
                x1="32"
                y1="3"
                x2="32"
                y2="15"
                stroke="#eab308"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M32 5 C30 9, 34 11, 32 15"
                stroke="#f59e0b"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>
        ))}
      </g>
      {/* Upright Sun Disc & Face */}
      <circle cx="32" cy="32" r="14.5" fill="#facc15" stroke="#b45309" strokeWidth="2.2" />
      <circle cx="27.5" cy="29.5" r="1.6" fill="#78350f" />
      <circle cx="36.5" cy="29.5" r="1.6" fill="#78350f" />
      <path
        d="M27.5 36.2C29.2 38 34.8 38 36.5 36.2"
        stroke="#78350f"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Subtle Argentine Stamp Seal Ornament (replaces the old 3 bent lines corner)
 */
export const FileteadoCorner: React.FC<{ className?: string }> = () => null;

/**
 * Custom Argentine Role Badge Icon (Parrilla, Quincho, Carnicería, Fernet, Hielo, Parásito)
 */
export const RoleCulturalBadge: React.FC<{ role: AsadoRoleId }> = ({ role }) => {
  switch (role) {
    case 'grill_master':
      return (
        <span
          title="Asador Oficial"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 shrink-0 animate-brasa-glow"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 1 1-8 0c0-2 1-3.5 2-5" stroke="#fb923c" />
            <path d="M4 14h16M6 14v5M18 14v5M4 18h16" strokeLinecap="round" />
          </svg>
        </span>
      );
    case 'house_host':
      return (
        <span
          title="Puso el Quincho / Casa"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 9.5V20h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 20v-6h6v6" />
          </svg>
        </span>
      );
    case 'fernet_sommelier':
      return (
        <span
          title="Sommelier de Fernet con Coca"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/50 text-sky-200 shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M7 4h10l-1.2 15a2 2 0 0 1-2 1.8h-3.6a2 2 0 0 1-2-1.8L7 4Z" />
            <path d="M7.5 8h9" stroke="#fde047" strokeWidth="2.5" />
          </svg>
        </span>
      );
    case 'butcher_buyer':
      return (
        <span
          title="Fue a la Carnicería"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/50 text-orange-200 shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
        </span>
      );
    case 'regular_guest':
      return (
        <span
          title="Invitado Cumplidor / Comensal Normal"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-500/20 border border-slate-400/50 text-slate-200 shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" />
            <circle cx="9" cy="7" r="4" />
            <path d="m16 11 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="#4ade80" />
          </svg>
        </span>
      );
    case 'ice_bringer':
      return (
        <span
          title="Cayó con 1 Bolsa de Hielo"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="7" height="7" rx="1.5" />
            <rect x="13" y="5" width="7" height="7" rx="1.5" />
            <rect x="8" y="13" width="7" height="7" rx="1.5" />
          </svg>
        </span>
      );
    default:
      return (
        <span
          title="Parásito VIP / Manos Vacías"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/25 border border-rose-400/60 text-rose-200 shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a8 8 0 0 0-8 8v11l2.5-2 2.5 2 3-2 3 2 2.5-2 2.5 2V10a8 8 0 0 0-8-8Z" />
            <circle cx="9.5" cy="10" r="1" fill="currentColor" />
            <circle cx="14.5" cy="10" r="1" fill="currentColor" />
          </svg>
        </span>
      );
  }
};

/**
 * Deterministic SVG Matrix QR Code generator so the receipt has a realistic, sharp fiscal QR
 */
export const FiscalMatrixQrSvg: React.FC<{ seedText: string; size?: number }> = ({
  seedText,
  size = 76,
}) => {
  const grid = 15;
  const cells: boolean[][] = Array.from({ length: grid }, () => Array(grid).fill(false));

  // Draw standard QR finder patterns in 3 corners
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
        const isCenter = r === 2 && c === 2;
        cells[r0 + r][c0 + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, grid - 5);
  drawFinder(grid - 5, 0);

  // Fill data cells deterministically from seedText
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const inTopLeft = r < 6 && c < 6;
      const inTopRight = r < 6 && c >= grid - 6;
      const inBottomLeft = r >= grid - 6 && c < 6;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      const bit = ((hash >>> ((r * grid + c) % 24)) ^ (r * 13 + c * 7)) & 1;
      cells[r][c] = bit === 1;
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      className="border-2 border-[#1c1613] bg-[#fcf7eb] p-1 rounded"
      aria-label="Código QR Fiscal de Liquidación"
    >
      {cells.map((row, rIdx) =>
        row.map((filled, cIdx) =>
          filled ? (
            <rect key={`${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width={1} height={1} fill="#1c1613" />
          ) : null
        )
      )}
    </svg>
  );
};
