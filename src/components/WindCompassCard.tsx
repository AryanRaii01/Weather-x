import React from 'react';
import { SpeedUnit } from '../types';

interface WindCompassCardProps {
  speedKph: number;
  speedMph: number;
  degree: number;
  direction: string;
  unit: SpeedUnit;
  gustKph?: number;
}

export const WindCompassCard: React.FC<WindCompassCardProps> = ({
  speedKph,
  speedMph,
  degree,
  direction,
  unit,
}) => {
  const currentSpeed = unit === 'kph' ? Math.round(speedKph) : Math.round(speedMph);
  const speedUnitLabel = unit === 'kph' ? 'km/h' : 'mph';

  // Degree ticks
  const tickCount = 36; // Every 10 degrees

  return (
    <div
      id="wind-compass-widget"
      className="flex flex-col items-center justify-center p-3 bg-slate-900/50 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] relative overflow-hidden group hover:border-cyan-500/40 transition duration-300"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      {/* Compass Circular Dial */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Outer Ring & Tick Marks */}
        <svg viewBox="0 0 140 140" className="w-full h-full text-slate-500/60" fill="none">
          <circle cx="70" cy="70" r="62" stroke="currentColor" strokeWidth="1" strokeDasharray="1 3" className="opacity-40" />
          <circle cx="70" cy="70" r="54" stroke="currentColor" strokeWidth="1.5" className="opacity-50" />

          {/* Tick lines */}
          {Array.from({ length: tickCount }).map((_, i) => {
            const isMajor = i % 9 === 0;
            const angle = i * 10;
            return (
              <line
                key={i}
                x1="70"
                y1={isMajor ? "16" : "20"}
                x2="70"
                y2="24"
                stroke={isMajor ? "rgba(6,182,212,0.8)" : "rgba(255,255,255,0.25)"}
                strokeWidth={isMajor ? "2" : "1"}
                transform={`rotate(${angle} 70 70)`}
              />
            );
          })}
        </svg>

        {/* Cardinal Points */}
        <span className="absolute top-2 text-[10px] font-semibold text-slate-300">N</span>
        <span className="absolute right-2 text-[10px] font-semibold text-slate-400">E</span>
        <span className="absolute bottom-2 text-[10px] font-semibold text-slate-400">S</span>
        <span className="absolute left-2 text-[10px] font-semibold text-slate-400">W</span>

        {/* Rotating Cyan Arrow Pointer */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out pointer-events-none"
          style={{ transform: `rotate(${degree}deg)` }}
        >
          <div className="absolute top-4 flex flex-col items-center">
            {/* Arrowhead */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-cyan-400 filter drop-shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>

        {/* Center Speed Display */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-bold text-white tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {currentSpeed}
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">
            {speedUnitLabel}
          </span>
        </div>
      </div>

      {/* Caption info below */}
      <div className="text-center mt-1">
        <div className="text-[11px] text-slate-400 font-medium">Wind Direction</div>
        <div className="text-sm font-semibold text-cyan-300 tracking-wide mt-0.5">
          {direction || 'SW'}
        </div>
      </div>
    </div>
  );
};
