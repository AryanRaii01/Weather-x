import React from 'react';
import { CurrentWeather, WeatherLocation, TemperatureUnit, WeatherTheme, SpeedUnit } from '../types';
import { MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { DynamicWeatherIcon } from './DynamicWeatherIcon';

interface HeroWeatherCardProps {
  location: WeatherLocation;
  current: CurrentWeather;
  unit: TemperatureUnit;
  speedUnit?: SpeedUnit;
  theme: WeatherTheme;
}

export const HeroWeatherCard: React.FC<HeroWeatherCardProps> = ({
  location,
  current,
  unit,
  speedUnit = 'kph',
  theme,
}) => {
  // Format date and time
  const formatTimeAndDate = () => {
    try {
      const date = location.localtime ? new Date(location.localtime.replace(' ', 'T')) : new Date();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

      return `${dayName}, ${dayNum} ${monthName} ${year} • ${formattedTime}`;
    } catch {
      return 'Saturday, 17 May 2025 • 08:45 AM';
    }
  };

  const rawTemp = unit === 'C' ? current.temp_c : current.temp_f;
  const tempInt = Math.floor(rawTemp);
  const tempDec = Math.abs(Math.round((rawTemp - tempInt) * 10));

  const feelsLike = unit === 'C' ? Math.round(current.feelslike_c) : Math.round(current.feelslike_f);
  const windVal = speedUnit === 'kph' ? Math.round(current.wind_kph) : Math.round(current.wind_mph);
  const windUnitLabel = speedUnit === 'kph' ? 'km/h' : 'mph';
  const visibilityVal = speedUnit === 'kph' ? Math.round(current.vis_km) : Math.round(current.vis_miles);
  const visUnitLabel = speedUnit === 'kph' ? 'km' : 'mi';

  return (
    <div
      id="hero-weather-card"
      className="relative w-full p-6 md:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3),0_0_40px_rgba(6,182,212,0.15)] overflow-hidden transition-all duration-300"
    >
      {/* Ambient Top Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-cyan-400/20 to-transparent blur-3xl pointer-events-none" />

      {/* Header: Location & Formatted Date/Time */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 text-white font-medium text-lg md:text-xl drop-shadow-md">
          <MapPin className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]" />
          <span>
            {location.name}, {location.country}
          </span>
        </div>
        <div className="text-xs md:text-sm text-slate-300 font-normal mt-1 opacity-90">
          {formatTimeAndDate()}
        </div>
      </div>

      {/* Main Temperature & 3D Celestial Weather Centerpiece */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4 md:my-6">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Luminous Weather Icon */}
          <div className="relative flex items-center justify-center">
            {/* 3D Sun Corona Glow / Volumetric Aura */}
            <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-2xl animate-pulse-slow" />
            <DynamicWeatherIcon
              theme={theme}
              size="hero"
              isDay={Boolean(current.is_day)}
              className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Temperature Typography */}
          <div className="flex items-baseline select-none">
            <span className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              {tempInt}
            </span>
            <div className="flex flex-col ml-1 -translate-y-4 md:-translate-y-6">
              <span className="text-3xl md:text-4xl lg:text-5xl font-light text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                °{unit}
              </span>
              <span className="text-2xl md:text-3xl font-normal text-slate-300/80 -mt-1">
                .{tempDec}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Text */}
        <div className="text-xl md:text-2xl font-semibold text-slate-100 tracking-wide mt-2 drop-shadow-md">
          {current.condition.text}
        </div>
      </div>

      {/* Bottom 4 Key Atmospheric Metric Pills */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
        {/* Feels Like */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-md transition">
          <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-slate-400 font-medium">Feels like</span>
            <span className="text-sm font-semibold text-white">
              {feelsLike}°{unit}
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-md transition">
          <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-slate-400 font-medium">Humidity</span>
            <span className="text-sm font-semibold text-white">
              {current.humidity}%
            </span>
          </div>
        </div>

        {/* Wind */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-md transition">
          <div className="p-1.5 rounded-xl bg-teal-500/10 text-teal-400">
            <Wind className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-slate-400 font-medium">Wind</span>
            <span className="text-sm font-semibold text-white">
              {windVal} {windUnitLabel}
            </span>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-md transition">
          <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Eye className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-slate-400 font-medium">Visibility</span>
            <span className="text-sm font-semibold text-white">
              {visibilityVal} {visUnitLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
