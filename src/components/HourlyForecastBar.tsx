import React, { useState } from 'react';
import { HourlyForecast, TemperatureUnit } from '../types';
import { getWeatherTheme } from '../services/weatherApi';
import { DynamicWeatherIcon } from './DynamicWeatherIcon';

interface HourlyForecastBarProps {
  hourly: HourlyForecast[];
  unit: TemperatureUnit;
}

export const HourlyForecastBar: React.FC<HourlyForecastBarProps> = ({
  hourly,
  unit,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Take next 8 forecast hours (or sample across the next 24 hours at 3-hour intervals: Now, +3h, +6h, +9h, +12h, +15h, +18h, +21h)
  const displayHours = hourly.slice(0, 24);
  const sampledHours: { label: string; hour: HourlyForecast; originalIdx: number }[] = [];

  // Generate 8 evenly spaced intervals starting with Now
  for (let i = 0; i < 8; i++) {
    const idx = Math.min(i * 3, displayHours.length - 1);
    const h = displayHours[idx];
    if (!h) continue;

    let label = 'Now';
    if (i > 0) {
      try {
        const timePart = h.time.split(' ')[1] || '12:00';
        const [hhStr] = timePart.split(':');
        let hh = parseInt(hhStr, 10);
        const ampm = hh >= 12 ? 'PM' : 'AM';
        hh = hh % 12;
        hh = hh ? hh : 12;
        label = `${hh} ${ampm}`;
      } catch {
        label = `+${i * 3}h`;
      }
    }

    sampledHours.push({ label, hour: h, originalIdx: idx });
  }

  return (
    <div
      id="hourly-forecast-bar"
      className="w-full p-4 md:p-5 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-cyan-400/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]"
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
          HOURLY FORECAST
        </span>
      </div>

      {/* Horizontal 8-Item Cards Grid / Row */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sampledHours.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          const temp = unit === 'C' ? Math.round(item.hour.temp_c) : Math.round(item.hour.temp_f);
          const theme = getWeatherTheme(item.hour.condition.code, item.hour.is_day);

          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex flex-col items-center justify-between p-2.5 rounded-2xl transition-all duration-300 cursor-pointer text-center relative ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20'
              }`}
            >
              {/* Time Label */}
              <span className={`text-xs font-medium ${isSelected ? 'text-cyan-300 font-semibold' : 'text-slate-300'}`}>
                {item.label}
              </span>

              {/* Weather Icon */}
              <div className="my-2 flex items-center justify-center h-8">
                <DynamicWeatherIcon
                  theme={theme}
                  size="sm"
                  isDay={Boolean(item.hour.is_day)}
                  className="drop-shadow-sm"
                />
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold text-white tracking-tight">
                {temp}°
              </span>

              {/* Active Dot Indicator */}
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shadow-[0_0_6px_#22d3ee]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Scrubber / Slider Track */}
      <div className="w-full bg-white/5 h-1 rounded-full mt-2 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500 shadow-[0_0_10px_#22d3ee]"
          style={{
            width: `${((selectedIndex + 1) / sampledHours.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
