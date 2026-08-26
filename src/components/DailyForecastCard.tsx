import React, { useState } from 'react';
import { ForecastDay, TemperatureUnit } from '../types';
import { DynamicWeatherIcon } from './DynamicWeatherIcon';
import { getWeatherTheme } from '../services/weatherApi';
import { Calendar, Droplets, Sun, Wind, ChevronDown, ChevronUp } from 'lucide-react';

interface DailyForecastCardProps {
  forecastDays: ForecastDay[];
  unit: TemperatureUnit;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  forecastDays,
  unit,
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (!forecastDays || forecastDays.length === 0) return null;

  // Calculate global min and max across all days for normalized temperature bar
  const allMins = forecastDays.map((d) => (unit === 'C' ? d.day.mintemp_c : d.day.mintemp_f));
  const allMaxs = forecastDays.map((d) => (unit === 'C' ? d.day.maxtemp_c : d.day.maxtemp_f));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalSpan = globalMax - globalMin || 1;

  const toggleExpand = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="w-full rounded-3xl glass-panel border border-white/15 p-6 md:p-7 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading tracking-tight">
              Extended Multi-Day Forecast
            </h3>
            <p className="text-xs text-slate-400">Atmospheric trend prediction for upcoming cycles</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
          {forecastDays.length} Days Outlook
        </span>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {forecastDays.map((dayData, index) => {
          const dateObj = new Date(dayData.date + 'T00:00:00');
          const dayName =
            index === 0
              ? 'Today'
              : index === 1
              ? 'Tomorrow'
              : dateObj.toLocaleDateString([], { weekday: 'short' });
          const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

          const dayTheme = getWeatherTheme(dayData.day.condition.code, 1);
          const maxTemp = Math.round(unit === 'C' ? dayData.day.maxtemp_c : dayData.day.maxtemp_f);
          const minTemp = Math.round(unit === 'C' ? dayData.day.mintemp_c : dayData.day.mintemp_f);

          // Bar calculation
          const leftPercent = Math.max(0, ((minTemp - globalMin) / globalSpan) * 100);
          const widthPercent = Math.max(12, ((maxTemp - minTemp) / globalSpan) * 100);

          const isExpanded = expandedDate === dayData.date;

          return (
            <div
              key={dayData.date}
              className={`rounded-2xl border transition-all duration-300 ${
                isExpanded
                  ? 'bg-slate-900/90 border-cyan-500/30 shadow-lg'
                  : 'bg-slate-900/40 hover:bg-slate-800/60 border-white/5'
              }`}
            >
              {/* Main Summary Row */}
              <div
                onClick={() => toggleExpand(dayData.date)}
                className="flex items-center justify-between p-4 cursor-pointer"
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 flex-shrink-0">
                  <div className="font-bold text-sm text-white font-heading">{dayName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{formattedDate}</div>
                </div>

                {/* Weather condition & icon */}
                <div className="flex items-center gap-3 flex-1 px-2">
                  <DynamicWeatherIcon theme={dayTheme} size="sm" isDay={true} />
                  <span className="text-xs sm:text-sm text-slate-200 truncate font-medium max-w-[130px] sm:max-w-[200px]">
                    {dayData.day.condition.text}
                  </span>
                </div>

                {/* Rain probability pill */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-blue-300 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mr-4">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>{dayData.day.daily_chance_of_rain}%</span>
                </div>

                {/* Temperature Range Bar */}
                <div className="flex items-center gap-3 w-40 sm:w-56 justify-end">
                  <span className="text-xs font-mono text-cyan-300 w-8 text-right font-medium">
                    {minTemp}°
                  </span>
                  <div className="relative w-20 sm:w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-yellow-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-rose-300 w-8 text-left font-bold">
                    {maxTemp}°
                  </span>

                  <button className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Atmospheric Breakdown Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Max Wind</span>
                    <span className="text-xs font-bold text-white font-mono">
                      {unit === 'C' ? `${dayData.day.maxwind_kph} km/h` : `${dayData.day.maxwind_mph} mph`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Precipitation</span>
                    <span className="text-xs font-bold text-blue-300 font-mono">
                      {unit === 'C' ? `${dayData.day.totalprecip_mm} mm` : `${dayData.day.totalprecip_in} in`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">UV Solar Index</span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      {dayData.day.uv} / 11+
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Sun Transit</span>
                    <span className="text-xs font-bold text-cyan-200 font-mono">
                      {dayData.astro?.sunrise || '06:00 AM'} - {dayData.astro?.sunset || '07:30 PM'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
