import React, { useState } from 'react';
import { ForecastDay, TemperatureUnit } from '../types';
import { getWeatherTheme } from '../services/weatherApi';
import { DynamicWeatherIcon } from './DynamicWeatherIcon';

interface DailyForecastBarProps {
  days: ForecastDay[];
  unit: TemperatureUnit;
}

export const DailyForecastBar: React.FC<DailyForecastBarProps> = ({
  days,
  unit,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  const formatWeekday = (dateStr: string, idx: number) => {
    try {
      const date = new Date(dateStr + 'T12:00:00');
      return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    } catch {
      const fallbackDays = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
      return fallbackDays[idx % 7];
    }
  };

  // Ensure 7 days array
  const displayDays = days.slice(0, 7);

  return (
    <div
      id="seven-day-forecast-bar"
      className="w-full p-4 md:p-5 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-cyan-400/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]"
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
          7 DAY FORECAST
        </span>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {displayDays.map((dayItem, idx) => {
          const isSelected = selectedDayIdx === idx;
          const weekday = formatWeekday(dayItem.date, idx);
          const maxTemp = unit === 'C' ? Math.round(dayItem.day.maxtemp_c) : Math.round(dayItem.day.maxtemp_f);
          const minTemp = unit === 'C' ? Math.round(dayItem.day.mintemp_c) : Math.round(dayItem.day.mintemp_f);
          const theme = getWeatherTheme(dayItem.day.condition.code, 1);

          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIdx(idx)}
              className={`flex flex-col items-center justify-between py-3 px-1 sm:px-2 rounded-2xl transition-all duration-300 cursor-pointer text-center relative ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20'
              }`}
            >
              {/* Day Label */}
              <span className={`text-[11px] sm:text-xs font-semibold tracking-wider ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                {weekday}
              </span>

              {/* 3D Weather Icon */}
              <div className="my-2 flex items-center justify-center h-8">
                <DynamicWeatherIcon
                  theme={theme}
                  size="sm"
                  isDay={true}
                  className="drop-shadow-sm"
                />
              </div>

              {/* High & Low Temp */}
              <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {maxTemp}°
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                  {minTemp}°
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
