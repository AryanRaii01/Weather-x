import React from 'react';
import { CurrentWeather, Astro, TemperatureUnit } from '../types';
import { getAqiDescription, getUvDescription } from '../services/weatherApi';
import {
  Wind,
  Compass,
  Sun,
  Moon,
  Activity,
  Droplets,
  Gauge,
  Eye,
  Thermometer,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface AtmosphericBentoGridProps {
  current: CurrentWeather;
  astro?: Astro;
  unit: TemperatureUnit;
}

export const AtmosphericBentoGrid: React.FC<AtmosphericBentoGridProps> = ({
  current,
  astro,
  unit,
}) => {
  const aqi = current.air_quality;
  const aqiInfo = getAqiDescription(aqi?.['us-epa-index']);
  const uvInfo = getUvDescription(current.uv);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Air Quality Index Card */}
      <div className="rounded-3xl glass-panel border border-white/15 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition duration-500" />
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Air Quality Index (AQI)</h4>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${aqiInfo.badgeBg} ${aqiInfo.color} ${aqiInfo.badgeBorder}`}
            >
              {aqiInfo.level}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">{aqiInfo.description}</p>

          {/* Pollutant Matrix */}
          {aqi ? (
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">PM 2.5</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {aqi.pm2_5?.toFixed(1) || '--'} <span className="text-[9px] text-slate-400">μg</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">PM 10</span>
                <span className="text-xs font-bold text-emerald-300 font-mono">
                  {aqi.pm10?.toFixed(1) || '--'} <span className="text-[9px] text-slate-400">μg</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Ozone (O₃)</span>
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {aqi.o3?.toFixed(1) || '--'} <span className="text-[9px] text-slate-400">μg</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">NO₂</span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  {aqi.no2?.toFixed(1) || '--'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">SO₂</span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  {aqi.so2?.toFixed(1) || '--'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">CO</span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  {aqi.co?.toFixed(1) || '--'}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-xs text-slate-400 font-mono text-center p-3">
              Telemetry sensor syncing...
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Wind & Vector Compass HUD */}
      <div className="rounded-3xl glass-panel border border-white/15 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition duration-500" />
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Wind Dynamics & Vector</h4>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {current.wind_dir} ({current.wind_degree}°)
            </span>
          </div>

          <div className="flex items-center justify-around mt-4">
            {/* Animated Compass Rose */}
            <div className="relative w-28 h-28 rounded-full border border-cyan-500/30 flex items-center justify-center bg-slate-950/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              {/* Compass Cardinal Points */}
              <span className="absolute top-1 text-[10px] font-bold text-cyan-300 font-mono">N</span>
              <span className="absolute bottom-1 text-[10px] font-bold text-slate-400 font-mono">S</span>
              <span className="absolute left-1.5 text-[10px] font-bold text-slate-400 font-mono">W</span>
              <span className="absolute right-1.5 text-[10px] font-bold text-slate-400 font-mono">E</span>

              {/* Rotating Arrow Needle */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${current.wind_degree}deg)` }}
              >
                <div className="w-1 h-16 relative flex flex-col justify-between items-center">
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[14px] border-b-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[10px] border-t-slate-500 opacity-60" />
                </div>
              </div>
            </div>

            {/* Speeds */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Velocity</span>
                <span className="text-2xl font-black text-white font-mono">
                  {unit === 'C' ? `${current.wind_kph} km/h` : `${current.wind_mph} mph`}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Peak Gusts</span>
                <span className="text-base font-bold text-cyan-300 font-mono">
                  {unit === 'C' ? `${current.gust_kph} km/h` : `${current.gust_mph} mph`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Solar & Moon Astronomical Tracker */}
      <div className="rounded-3xl glass-panel border border-white/15 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition duration-500" />
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sun className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Astronomy & Daylight</h4>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {astro?.moon_phase || 'Waxing'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {/* Sunrise & Sunset Arch visualization */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 border border-amber-500/30">
                  <Sun className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Sunrise</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {astro?.sunrise || '06:15 AM'}
                  </span>
                </div>
              </div>

              <div className="flex-1 mx-4 h-[1px] bg-gradient-to-r from-amber-400/40 via-cyan-400/40 to-indigo-400/40 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Sunset</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {astro?.sunset || '07:45 PM'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/30">
                  <Moon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Moon Phase Details */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-mono block">Moon Phase & Light</span>
                <span className="text-xs font-bold text-cyan-200">
                  {astro?.moon_phase || 'Celestial Cycle'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                {astro?.moon_illumination || '85'}% Illumination
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. UV Radiation & Safety Gauge */}
      <div className="rounded-3xl glass-panel border border-white/15 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-rose-500/10 blur-2xl pointer-events-none group-hover:bg-rose-500/20 transition duration-500" />
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Gauge className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-heading">UV Solar Radiation</h4>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${uvInfo.color} bg-white/5 border-white/10`}
            >
              {uvInfo.level}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">{current.uv}</span>
                <span className="text-xs text-slate-400 font-mono">/ 11+ Max</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{uvInfo.advice}</p>
            </div>

            {/* Circular Progress Meter */}
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeDasharray={`${Math.min(current.uv * 9, 100)}, 100`}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                />
              </svg>
              <div className="absolute text-xs font-mono font-bold text-amber-300">
                {Math.round((current.uv / 11) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Humidity & Dew Point Thermal Comfort */}
      <div className="rounded-3xl glass-panel border border-white/15 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition duration-500" />
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Atmospheric Moisture</h4>
            </div>
            <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {current.humidity}% Rel
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-white font-mono">{current.humidity}%</span>
                <span className="text-xs text-slate-400 ml-2">
                  {current.humidity < 30 ? 'Dry' : current.humidity <= 60 ? 'Optimal' : 'Humid'}
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-300">
                Dew point ~
                {Math.round(
                  current.temp_c - (100 - current.humidity) / 5 * (unit === 'C' ? 1 : 1.8)
                )}
                °{unit}
              </span>
            </div>

            {/* Moisture Bar */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${current.humidity}%` }}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {current.humidity <= 50
                ? 'Comfortable atmospheric moisture index. Crisp air quality.'
                : 'Elevated water vapor pressure. Warm perceived temperature.'}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Barometric Pressure & Atmospheric Sight */}
      <div className="rounded-3xl glass-panel border border-white/15 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none group-hover:bg-violet-500/20 transition duration-500" />
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Thermometer className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Barometric Pressure</h4>
            </div>
            <span className="text-xs font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
              {current.pressure_mb} hPa
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[11px] text-slate-400 font-mono block">Atmospheric Mass</span>
              <span className="text-lg font-bold text-white font-mono">
                {current.pressure_mb} <span className="text-xs font-normal text-slate-400">mb</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                {current.pressure_mb > 1013 ? 'High pressure (Fair)' : 'Low pressure (Precipitation)'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[11px] text-slate-400 font-mono block">Clarity & Sight</span>
              <span className="text-lg font-bold text-emerald-300 font-mono">
                {unit === 'C' ? `${current.vis_km} km` : `${current.vis_miles} mi`}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Horizontal horizon range</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
