import React, { useState, useEffect, useCallback } from 'react';
import { ForecastData, TemperatureUnit, SpeedUnit, WeatherTheme } from './types';
import { fetchWeatherForecast, getWeatherTheme } from './services/weatherApi';
import { WeatherCanvasBackground } from './components/WeatherCanvasBackground';
import { HeaderSearch } from './components/HeaderSearch';
import { NavigationSidebar, NavTab } from './components/NavigationSidebar';
import { WindCompassCard } from './components/WindCompassCard';
import { AmbientNaturePlayer } from './components/AmbientNaturePlayer';
import { HeroWeatherCard } from './components/HeroWeatherCard';
import { HourlyForecastBar } from './components/HourlyForecastBar';
import { DailyForecastBar } from './components/DailyForecastBar';
import { WeatherDetailsCard } from './components/WeatherDetailsCard';
import { AirQualityCard } from './components/AirQualityCard';
import { SavedLocationsDrawer } from './components/SavedLocationsDrawer';
import {
  SunMedium,
  CloudLightning,
  Activity,
  Droplets,
  RotateCw,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [locationQuery, setLocationQuery] = useState<string>(() => {
    return localStorage.getItem('weatherx_last_city') || 'London, United Kingdom';
  });
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem('weatherx_unit') as TemperatureUnit) || 'C';
  });
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => {
    return (localStorage.getItem('weatherx_speed_unit') as SpeedUnit) || 'kph';
  });
  const [manualTheme, setManualTheme] = useState<WeatherTheme | 'auto'>('auto');
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [savedCities, setSavedCities] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('weatherx_saved_cities');
      return stored ? JSON.parse(stored) : ['London, United Kingdom', 'Tokyo, Japan', 'New York, USA', 'Paris, France'];
    } catch {
      return ['London, United Kingdom', 'Tokyo, Japan', 'New York, USA', 'Paris, France'];
    }
  });

  const [weatherData, setWeatherData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch weather data
  const loadWeatherData = useCallback(async (query: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeatherForecast(query, 7);
      setWeatherData(data);
      localStorage.setItem('weatherx_last_city', query);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setErrorMessage(err.message || 'Failed to establish satellite telemetry link.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData(locationQuery);
  }, [locationQuery, loadWeatherData]);

  const handleToggleUnit = () => {
    const nextUnit = unit === 'C' ? 'F' : 'C';
    setUnit(nextUnit);
    localStorage.setItem('weatherx_unit', nextUnit);
  };

  const handleToggleSpeedUnit = () => {
    const nextSpeed = speedUnit === 'kph' ? 'mph' : 'kph';
    setSpeedUnit(nextSpeed);
    localStorage.setItem('weatherx_speed_unit', nextSpeed);
  };

  const handleSelectLocation = (newQuery: string) => {
    setLocationQuery(newQuery);
  };

  const handleAddFavorite = (city: string) => {
    if (!savedCities.includes(city)) {
      const updated = [...savedCities, city];
      setSavedCities(updated);
      localStorage.setItem('weatherx_saved_cities', JSON.stringify(updated));
    }
  };

  const handleRemoveFavorite = (city: string) => {
    const updated = savedCities.filter((c) => c !== city);
    setSavedCities(updated);
    localStorage.setItem('weatherx_saved_cities', JSON.stringify(updated));
  };

  // Determine active climate theme
  const computedTheme: WeatherTheme = weatherData
    ? getWeatherTheme(weatherData.current.condition.code, weatherData.current.is_day)
    : 'partly-cloudy-day';

  const activeTheme: WeatherTheme = manualTheme === 'auto' ? computedTheme : manualTheme;

  // Prepare hourly data
  const hourlyData = weatherData?.forecast?.forecastday?.[0]?.hour || [];
  const forecastDays = weatherData?.forecast?.forecastday || [];
  const astroData = weatherData?.forecast?.forecastday?.[0]?.astro;

  return (
    <div className="relative min-h-screen text-slate-100 font-sans select-none overflow-x-hidden antialiased flex flex-col justify-between">
      {/* Dynamic Photographic Background & Canvas Particles */}
      <WeatherCanvasBackground
        theme={activeTheme}
        windSpeedKph={weatherData?.current?.wind_kph || 14}
        isDay={weatherData ? Boolean(weatherData.current.is_day) : true}
      />

      {/* Main Glass Application Container */}
      <div className="relative z-10 w-full max-w-[1520px] mx-auto p-3 sm:p-5 md:p-6 lg:p-8 flex flex-col min-h-screen justify-between gap-4 md:gap-6">
        {/* Top Header Navigation Bar */}
        <HeaderSearch
          currentCity={weatherData?.location?.name || locationQuery}
          onSearch={handleSelectLocation}
          isLoading={isLoading}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          speedUnit={speedUnit}
          onToggleSpeedUnit={handleToggleSpeedUnit}
          manualTheme={manualTheme}
          onSelectTheme={setManualTheme}
          savedCities={savedCities}
          onAddFavorite={handleAddFavorite}
          onRemoveFavorite={handleRemoveFavorite}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Loading / Error States */}
        {isLoading && !weatherData && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#22d3ee]" />
            <span className="text-cyan-300 font-medium text-sm mt-4 tracking-wide">
              Connecting to Global Meteorological Satellite...
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm backdrop-blur-xl flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => loadWeatherData(locationQuery)}
              className="px-3 py-1 bg-rose-500/40 hover:bg-rose-500/60 rounded-xl font-semibold text-xs transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3-Column Weather Dashboard Layout */}
        {weatherData && (
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start flex-1">
            {/* LEFT COLUMN: Floating Dock, Wind Direction Radar, Ambient Nature Player */}
            <div className="lg:col-span-2 flex flex-col gap-4 items-center lg:items-start justify-between h-full">
              <div className="w-full flex flex-col gap-4 items-center lg:items-start">
                {/* Vertical Navigation Dock */}
                <NavigationSidebar
                  activeTab={activeNavTab}
                  onSelectTab={(tab) => {
                    setActiveNavTab(tab);
                    if (tab === 'favorites') {
                      setIsDrawerOpen(true);
                    }
                  }}
                  favoritesCount={savedCities.length}
                />

                {/* Wind Direction Radar Widget */}
                <div className="w-full max-w-[200px] lg:max-w-none">
                  <WindCompassCard
                    speedKph={weatherData.current.wind_kph}
                    speedMph={weatherData.current.wind_mph}
                    degree={weatherData.current.wind_degree}
                    direction={weatherData.current.wind_dir}
                    unit={speedUnit}
                    gustKph={weatherData.current.gust_kph}
                  />
                </div>
              </div>

              {/* Ambient Nature Soundscape Bar */}
              <div className="w-full mt-auto pt-2">
                <AmbientNaturePlayer />
              </div>
            </div>

            {/* CENTER COLUMN: Hero Card, Hourly Forecast, 7-Day Forecast */}
            <div className="lg:col-span-7 flex flex-col gap-4 md:gap-5">
              {/* Centerpiece Hero Weather Card */}
              <HeroWeatherCard
                location={weatherData.location}
                current={weatherData.current}
                unit={unit}
                speedUnit={speedUnit}
                theme={activeTheme}
              />

              {/* Hourly Forecast Bar */}
              <HourlyForecastBar
                hourly={hourlyData}
                unit={unit}
              />

              {/* 7 Day Forecast Bar */}
              <DailyForecastBar
                days={forecastDays}
                unit={unit}
              />
            </div>

            {/* RIGHT COLUMN: Weather Details, Air Quality, Footer Badge */}
            <div className="lg:col-span-3 flex flex-col gap-4 md:gap-5 justify-between h-full">
              <div className="flex flex-col gap-4 md:gap-5">
                {/* Weather Details Card */}
                <WeatherDetailsCard
                  current={weatherData.current}
                  astro={astroData}
                  unit={unit}
                />

                {/* Air Quality Radial Gauge Card */}
                <AirQualityCard
                  airQuality={weatherData.current.air_quality}
                />
              </div>

              {/* Powered by weatherapi.com Attribution Badge */}
              <div className="w-full flex justify-end mt-auto pt-2">
                <a
                  href="https://www.weatherapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/40 rounded-2xl shadow-lg transition group text-right"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400 font-medium leading-none">
                      Powered by
                    </span>
                    <span className="text-xs font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition">
                      weatherapi.com
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <SunMedium className="w-4 h-4 animate-spin-slow" />
                  </div>
                </a>
              </div>
            </div>
          </main>
        )}

        {/* Saved Locations & Metros Drawer */}
        <SavedLocationsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          savedCities={savedCities}
          currentCity={weatherData?.location ? `${weatherData.location.name}, ${weatherData.location.country}` : locationQuery}
          onSelectCity={handleSelectLocation}
          onRemoveCity={handleRemoveFavorite}
          onAddCurrentCity={() => {
            if (weatherData?.location) {
              handleAddFavorite(`${weatherData.location.name}, ${weatherData.location.country}`);
            }
          }}
        />
      </div>
    </div>
  );
}
