import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUp, ArrowDown, Wind, Droplets, Compass, Eye, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { CurrentWeather, WeatherLocation, DayForecast, TemperatureUnit, WeatherTheme } from '../types';
import { DynamicWeatherIcon } from './DynamicWeatherIcon';

interface CurrentWeatherHeroProps {
  location: WeatherLocation;
  current: CurrentWeather;
  todayForecast?: DayForecast;
  unit: TemperatureUnit;
  theme: WeatherTheme;
  manualTheme: WeatherTheme | 'auto';
  onSetManualTheme: (theme: WeatherTheme | 'auto') => void;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  location,
  current,
  todayForecast,
  unit,
  theme,
  manualTheme,
  onSetManualTheme,
}) => {
  // Live ticking clock for location
  const [localTimeDisplay, setLocalTimeDisplay] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const date = new Date(location.localtime);
        setLocalTimeDisplay(
          date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        );
      } catch {
        setLocalTimeDisplay(location.localtime || '');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [location.localtime]);

  const temp = Math.round(unit === 'C' ? current.temp_c : current.temp_f);
  const feelsLike = Math.round(unit === 'C' ? current.feelslike_c : current.feelslike_f);
  const maxTemp = todayForecast
    ? Math.round(unit === 'C' ? todayForecast.maxtemp_c : todayForecast.maxtemp_f)
    : temp + 3;
  const minTemp = todayForecast
    ? Math.round(unit === 'C' ? todayForecast.mintemp_c : todayForecast.mintemp_f)
    : temp - 4;

  const THEME_OPTIONS: { id: WeatherTheme | 'auto'; label: string; icon: string }[] = [
    { id: 'auto', label: 'Live Weather', icon: '📡' },
    { id: 'sunny', label: 'Solar Bloom', icon: '☀️' },
    { id: 'clear-night', label: 'Starlight', icon: '🌙' },
    { id: 'rain', label: 'Rainfall', icon: '🌧️' },
    { id: 'thunderstorm', label: 'Storm Strike', icon: '⚡' },
    { id: 'snow', label: 'Arctic Frost', icon: '❄️' },
    { id: 'fog', label: 'Mist Matrix', icon: '🌫️' },
  ];

  // Dynamic advice based on temperature and condition
  const getAtmosphericAdvisory = () => {
    if (theme === 'thunderstorm') return 'Severe atmospheric charge. Exercise caution outdoors.';
    if (theme === 'rain') return 'Precipitation active. Carry waterproof gear.';
    if (theme === 'snow') return 'Freezing temperatures. Thermal insulation recommended.';
    if (current.temp_c > 32) return 'Extreme heat index. Maintain hydration & shade.';
    if (current.temp_c < 5) return 'Cold ambient atmosphere. Heavy layers recommended.';
    if (current.uv > 7) return 'High UV radiation. Sun protection is mandatory.';
    return 'Optimal ambient conditions for outdoor activities.';
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/15 p-6 md:p-8 shadow-2xl transition-all duration-500">
      {/* Futuristic Background Radial Gradient Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar: Location details + Scene Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-heading">
              {location.name}
            </h2>
            <span className="text-sm font-medium text-cyan-300/80 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              {location.country}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
            <span>{location.region || location.country}</span>
            <span className="text-slate-600">•</span>
            <span>
              LAT {location.lat?.toFixed(2)}° / LON {location.lon?.toFixed(2)}°
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold">{localTimeDisplay || location.localtime}</span>
          </div>
        </div>

        {/* Climate Simulation Controls Pill Selector */}
        <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Interactive Climate Scene:</span>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-2xl border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = manualTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSetManualTheme(opt.id)}
                  className={`px-2.5 py-1 text-xs rounded-xl whitespace-nowrap transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Core Weather Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6">
        {/* Left: Huge Temp & Condition */}
        <div className="lg:col-span-7 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Dynamic Weather Icon */}
          <div className="flex-shrink-0 relative">
            <DynamicWeatherIcon theme={theme} size="hero" isDay={Boolean(current.is_day)} />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 tracking-tighter font-heading">
                {temp}
              </span>
              <span className="text-3xl md:text-4xl font-bold text-cyan-400 font-heading">
                °{unit}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-lg md:text-xl font-semibold text-white">
                {current.condition.text}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/15">
                Feels like {feelsLike}°{unit}
              </span>
            </div>

            {/* High / Low Bar */}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1">
              <div className="flex items-center gap-1 text-emerald-400">
                <ArrowUp className="w-3.5 h-3.5" />
                <span>High: {maxTemp}°{unit}</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Low: {minTemp}°{unit}</span>
              </div>
              <div className="text-slate-400">
                <span>Humidity: {current.humidity}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Atmospheric Quick Matrix */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/30 transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind
              </span>
              <span className="font-mono text-cyan-300">{current.wind_dir}</span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-white font-mono">
                {unit === 'C' ? `${current.wind_kph} km/h` : `${current.wind_mph} mph`}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Gusts {unit === 'C' ? `${current.gust_kph} km/h` : `${current.gust_mph} mph`}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/30 transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Precipitation
              </span>
              <span className="font-mono text-blue-300">{current.cloud}% Clouds</span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-white font-mono">
                {unit === 'C' ? `${current.precip_mm} mm` : `${current.precip_in} in`}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Liquid accumulation</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/30 transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Visibility
              </span>
              <span className="font-mono text-emerald-300">
                {current.vis_km >= 10 ? 'Clear' : 'Reduced'}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-white font-mono">
                {unit === 'C' ? `${current.vis_km} km` : `${current.vis_miles} mi`}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Optical distance</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/30 transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> UV Index
              </span>
              <span className="font-mono text-amber-300">{current.uv}/11+</span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-white font-mono">
                {current.uv <= 2 ? 'Low' : current.uv <= 5 ? 'Moderate' : current.uv <= 8 ? 'High' : 'Very High'}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Solar intensity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Advisory Bar */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="font-medium">{getAtmosphericAdvisory()}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Updated: {current.last_updated?.split(' ')[1] || 'Live'}
        </span>
      </div>
    </div>
  );
};
