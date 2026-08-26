import React, { useState } from 'react';
import { HourlyForecast, TemperatureUnit, WeatherTheme } from '../types';
import { DynamicWeatherIcon } from './DynamicWeatherIcon';
import { getWeatherTheme } from '../services/weatherApi';
import { TrendingUp, CloudRain, Wind, Clock } from 'lucide-react';

interface HourlyForecastChartProps {
  hourlyData: HourlyForecast[];
  unit: TemperatureUnit;
  localTimeStr: string;
}

type ChartMetric = 'temperature' | 'precipitation' | 'wind';

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({
  hourlyData,
  unit,
  localTimeStr,
}) => {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('temperature');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!hourlyData || hourlyData.length === 0) return null;

  // Filter 24 hours starting from current local hour if possible, or entire day
  const currentHour = new Date(localTimeStr).getHours() || 0;
  // Get next 24 data points
  const displayHours = hourlyData.slice(0, 24);

  // SVG Chart Calculations for 24 points
  const svgWidth = 960;
  const svgHeight = 130;
  const paddingX = 30;
  const paddingY = 25;

  const temps = displayHours.map((h) => (unit === 'C' ? h.temp_c : h.temp_f));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const points = displayHours.map((h, i) => {
    const x = paddingX + (i / (displayHours.length - 1)) * (svgWidth - paddingX * 2);
    let valRatio = 0.5;

    if (activeMetric === 'temperature') {
      const val = unit === 'C' ? h.temp_c : h.temp_f;
      valRatio = (val - minTemp) / tempRange;
    } else if (activeMetric === 'precipitation') {
      valRatio = (h.chance_of_rain || 0) / 100;
    } else if (activeMetric === 'wind') {
      const maxWind = 50;
      valRatio = Math.min((unit === 'C' ? h.wind_kph : h.wind_mph) / maxWind, 1);
    }

    // Invert Y for SVG coordinates
    const y = svgHeight - paddingY - valRatio * (svgHeight - paddingY * 2);
    return { x, y, hour: h };
  });

  // Smooth SVG Bezier Path Generator
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div className="w-full rounded-3xl glass-panel border border-white/15 p-6 md:p-7 shadow-2xl relative overflow-hidden">
      {/* Header with Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading tracking-tight">
              24-Hour Atmospheric Trajectory
            </h3>
            <p className="text-xs text-slate-400">Continuous telemetry and hourly projections</p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-900/80 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('temperature')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              activeMetric === 'temperature'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>
          <button
            onClick={() => setActiveMetric('precipitation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              activeMetric === 'precipitation'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain Chance %</span>
          </button>
          <button
            onClick={() => setActiveMetric('wind')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              activeMetric === 'wind'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(20,184,166,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Flow</span>
          </button>
        </div>
      </div>

      {/* Futuristic Interactive SVG Curve */}
      <div className="mt-4 relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-28 sm:h-36 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curve-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={
                  activeMetric === 'temperature'
                    ? '#06b6d4'
                    : activeMetric === 'precipitation'
                    ? '#3b82f6'
                    : '#10b981'
                }
                stopOpacity="0.4"
              />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="curve-stroke-grad" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor={
                  activeMetric === 'temperature'
                    ? '#38bdf8'
                    : activeMetric === 'precipitation'
                    ? '#60a5fa'
                    : '#34d399'
                }
              />
              <stop
                offset="100%"
                stopColor={
                  activeMetric === 'temperature'
                    ? '#818cf8'
                    : activeMetric === 'precipitation'
                    ? '#a855f7'
                    : '#06b6d4'
                }
              />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#curve-area-grad)" />

          {/* Curve Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#curve-stroke-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
          />

          {/* Points and Tooltips on Curve */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={0}
                    x2={p.x}
                    y2={svgHeight}
                    stroke="rgba(255,255,255,0.25)"
                    strokeDasharray="3 3"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 3.5}
                  className={`${
                    isHovered
                      ? 'fill-white stroke-cyan-400 stroke-2'
                      : 'fill-slate-900 stroke-cyan-400 stroke-2'
                  } transition-all duration-200`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hourly Scroller Cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-2 mt-2 no-scrollbar">
        {displayHours.map((hour, idx) => {
          const isNow = idx === 0;
          const timeStr = hour.time.split(' ')[1];
          const [hVal, mVal] = timeStr.split(':');
          const hourNum = parseInt(hVal, 10);
          const formattedHour = isNow
            ? 'Now'
            : hourNum === 0
            ? '12 AM'
            : hourNum === 12
            ? '12 PM'
            : hourNum > 12
            ? `${hourNum - 12} PM`
            : `${hourNum} AM`;

          const itemTheme = getWeatherTheme(hour.condition.code, hour.is_day);
          const itemTemp = Math.round(unit === 'C' ? hour.temp_c : hour.temp_f);
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={hour.time_epoch}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-300 w-24 ${
                isNow
                  ? 'bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : isHovered
                  ? 'bg-white/10 border-white/30 scale-105'
                  : 'bg-slate-900/50 hover:bg-slate-800/70 border-white/5'
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  isNow ? 'text-cyan-300 font-bold' : 'text-slate-300'
                }`}
              >
                {formattedHour}
              </span>

              <div className="my-2">
                <DynamicWeatherIcon theme={itemTheme} size="sm" isDay={Boolean(hour.is_day)} />
              </div>

              <span className="text-base font-bold text-white font-mono">
                {itemTemp}°{unit}
              </span>

              {/* Secondary Metric Preview */}
              <div className="mt-2 flex flex-col items-center gap-0.5 text-[10px] font-mono">
                {activeMetric === 'precipitation' ? (
                  <span className="text-blue-300 flex items-center gap-0.5">
                    💧 {hour.chance_of_rain}%
                  </span>
                ) : activeMetric === 'wind' ? (
                  <span className="text-emerald-300">
                    {unit === 'C' ? `${Math.round(hour.wind_kph)}k` : `${Math.round(hour.wind_mph)}m`}
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-0.5">
                    {hour.chance_of_rain > 20 ? (
                      <span className="text-blue-400">{hour.chance_of_rain}%</span>
                    ) : (
                      <span className="text-slate-400">{hour.condition.text.slice(0, 7)}</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
