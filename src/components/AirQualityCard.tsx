import React, { useState } from 'react';
import { AirQuality } from '../types';
import { getAqiDescription } from '../services/weatherApi';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface AirQualityCardProps {
  airQuality?: AirQuality;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const epaIndex = airQuality?.['us-epa-index'] || 1;
  const aqiInfo = getAqiDescription(epaIndex);

  // Approximate numerical AQI value if not present:
  const aqiScore = aqiInfo.score;

  // Arc calculation: circumference for r=46
  // Radius = 46, Circumference = 2 * PI * 46 = 289
  // 75% arc gauge (270 degrees): strokeDasharray = 289 * 0.75 = 216.7
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const percentage = Math.min(Math.max((epaIndex - 1) / 5, 0.1), 1.0);
  const strokeOffset = arcLength - arcLength * percentage;

  return (
    <div
      id="air-quality-card"
      className="w-full p-5 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-cyan-400/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
          AIR QUALITY
        </span>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-slate-400 hover:text-cyan-300 p-1 rounded-lg hover:bg-white/5 transition"
          title="Toggle pollutant telemetry"
        >
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Circular Gauge Centerpiece */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-135">
            {/* Background Track Arc */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />

            {/* Gradient Arc Fill */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#aqi-gradient)"
              strokeWidth="10"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            <defs>
              <linearGradient id="aqi-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text: AQI Score & Status */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-3xl font-extrabold text-white tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {aqiScore}
            </span>
            <span className={`text-xs font-semibold mt-1 ${aqiInfo.textColor}`}>
              {aqiInfo.level}
            </span>
          </div>
        </div>

        {/* Status Description Text */}
        <p className="text-[11px] text-slate-300 text-center font-normal px-2 mt-1 leading-relaxed opacity-90">
          {aqiInfo.description}
        </p>
      </div>

      {/* Expandable Detailed Pollutant Readings */}
      {showDetails && airQuality && (
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center animate-in fade-in duration-200">
          <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-slate-400">PM2.5</div>
            <div className="text-xs font-semibold text-white mt-0.5">{Math.round(airQuality.pm2_5 || 8)} µg/m³</div>
          </div>
          <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-slate-400">PM10</div>
            <div className="text-xs font-semibold text-white mt-0.5">{Math.round(airQuality.pm10 || 14)} µg/m³</div>
          </div>
          <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-slate-400">O3 (Ozone)</div>
            <div className="text-xs font-semibold text-white mt-0.5">{Math.round(airQuality.o3 || 45)} µg/m³</div>
          </div>
        </div>
      )}
    </div>
  );
};
