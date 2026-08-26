import React from 'react';
import { CurrentWeather, Astro, TemperatureUnit } from '../types';
import { Gauge, Sun, Droplets, Cloud, Sunrise, Sunset } from 'lucide-react';
import { getUvDescription, calculateDewPoint } from '../services/weatherApi';

interface WeatherDetailsCardProps {
  current: CurrentWeather;
  astro?: Astro;
  unit: TemperatureUnit;
}

export const WeatherDetailsCard: React.FC<WeatherDetailsCardProps> = ({
  current,
  astro,
  unit,
}) => {
  const uvInfo = getUvDescription(current.uv);

  // Calculate dew point if not directly given
  const dewC = (current as any).dewpoint_c ?? calculateDewPoint(current.temp_c, current.humidity);
  const dewVal = unit === 'C' ? Math.round(dewC) : Math.round(dewC * 9/5 + 32);

  const sunriseTime = astro?.sunrise || '05:12 AM';
  const sunsetTime = astro?.sunset || '08:56 PM';

  const rows = [
    {
      label: 'Pressure',
      value: `${Math.round(current.pressure_mb)} hPa`,
      icon: Gauge,
      badge: null,
    },
    {
      label: 'UV Index',
      value: `${Math.round(current.uv)}`,
      icon: Sun,
      badge: {
        text: uvInfo.level,
        color: uvInfo.textColor,
      },
    },
    {
      label: 'Dew Point',
      value: `${dewVal}°${unit}`,
      icon: Droplets,
      badge: null,
    },
    {
      label: 'Cloud Cover',
      value: `${current.cloud}%`,
      icon: Cloud,
      badge: null,
    },
    {
      label: 'Sunrise',
      value: sunriseTime,
      icon: Sunrise,
      badge: null,
    },
    {
      label: 'Sunset',
      value: sunsetTime,
      icon: Sunset,
      badge: null,
    },
  ];

  return (
    <div
      id="weather-details-card"
      className="w-full p-5 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-cyan-400/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
          WEATHER DETAILS
        </span>
      </div>

      {/* Atmospheric Metrics List */}
      <div className="flex flex-col divide-y divide-white/5 space-y-2.5">
        {rows.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between pt-2.5 first:pt-0 group"
            >
              {/* Left label & Icon */}
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition" />
                <span className="text-xs font-medium text-slate-300">
                  {item.label}
                </span>
              </div>

              {/* Right Value & Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                  {item.value}
                </span>
                {item.badge && (
                  <span className={`text-[10px] font-semibold ${item.badge.color}`}>
                    {item.badge.text}
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
