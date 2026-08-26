import React, { useState, useEffect, useRef } from 'react';
import { SearchLocationResult, TemperatureUnit, SpeedUnit, WeatherTheme } from '../types';
import { searchLocations } from '../services/weatherApi';
import {
  Search,
  MapPin,
  Navigation,
  Settings,
  Menu,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
  CloudSun,
} from 'lucide-react';

interface HeaderSearchProps {
  currentCity: string;
  onSearch: (city: string) => void;
  isLoading: boolean;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  speedUnit?: SpeedUnit;
  onToggleSpeedUnit?: () => void;
  manualTheme: WeatherTheme | 'auto';
  onSelectTheme: (theme: WeatherTheme | 'auto') => void;
  savedCities?: string[];
  onAddFavorite?: (city: string) => void;
  onRemoveFavorite?: (city: string) => void;
  onOpenDrawer?: () => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  currentCity,
  onSearch,
  isLoading,
  unit,
  onToggleUnit,
  speedUnit = 'kph',
  onToggleSpeedUnit,
  manualTheme,
  onSelectTheme,
  savedCities = [],
  onAddFavorite,
  onOpenDrawer,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length >= 2) {
      setIsSearching(true);
      debounceTimerRef.current = setTimeout(async () => {
        const results = await searchLocations(value);
        setSuggestions(results);
        setIsSearching(false);
        setIsOpen(true);
      }, 350);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSelectSuggestion = (loc: SearchLocationResult) => {
    onSearch(`${loc.name}, ${loc.country}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
        onSearch(coords);
      },
      () => {
        onSearch('London');
      }
    );
  };

  return (
    <header className="relative w-full z-40">
      <div className="flex items-center justify-between gap-3 md:gap-6 py-2 px-1">
        {/* Left: WEATHER X Brand Logo */}
        <div className="flex items-center gap-2.5 select-none cursor-pointer" onClick={() => onSearch('London')}>
          {/* Logo Icon */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/40 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
              <CloudSun className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_#22d3ee]" />
            </div>
          </div>

          {/* Logo Typography */}
          <div className="flex items-center text-xl font-bold tracking-tight text-white drop-shadow-md">
            <span>WEATHER</span>
            <span className="text-cyan-400 font-extrabold ml-1 drop-shadow-[0_0_12px_#22d3ee]">
              X
            </span>
          </div>
        </div>

        {/* Center: Search Bar Pill Container */}
        <div ref={wrapperRef} className="relative flex-1 max-w-xl">
          <form onSubmit={handleLocationSubmit} className="relative flex items-center">
            {/* Map Pin Icon */}
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
            </div>

            {/* Input Field */}
            <input
              id="city-search-input"
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                if (suggestions.length > 0) setIsOpen(true);
              }}
              placeholder="Enter city name..."
              className="w-full pl-11 pr-14 py-3 bg-slate-900/50 hover:bg-slate-900/70 focus:bg-slate-900/80 text-white placeholder-slate-400 text-sm rounded-full border border-white/15 focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl transition outline-none"
            />

            {/* Clear Button if query is typed */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-12 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Round Glowing Magnifying Glass Search Button */}
            <button
              id="search-action-btn"
              type="submit"
              disabled={isLoading}
              title="Search"
              className="absolute right-1.5 w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center transition shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/90 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden z-50 divide-y divide-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
              {isSearching && (
                <div className="p-3 text-xs text-cyan-400 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning satellite stations...</span>
                </div>
              )}

              {!isSearching && suggestions.length > 0 && (
                <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                  {suggestions.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectSuggestion(loc)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-cyan-500/15 flex items-center justify-between text-sm text-slate-200 hover:text-white transition group border border-transparent hover:border-cyan-500/30 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                        <div>
                          <span className="font-medium text-white">{loc.name}</span>
                          <span className="text-slate-400 text-xs"> ({loc.country})</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Circular Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Current Location Button */}
          <button
            id="current-location-btn"
            onClick={handleCurrentLocation}
            title="Use Current Location"
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition shadow-lg group cursor-pointer"
          >
            <Navigation className={`w-4 h-4 text-cyan-400 group-hover:rotate-45 transition duration-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Settings Gear Button */}
          <button
            id="settings-gear-btn"
            onClick={() => setShowSettingsModal(true)}
            title="Preferences & Settings"
            className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition shadow-lg group cursor-pointer"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition duration-500 text-slate-300 group-hover:text-cyan-300" />
          </button>

          {/* Menu Drawer Button */}
          <button
            id="menu-drawer-btn"
            onClick={onOpenDrawer}
            title="Menu & Saved Cities"
            className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition shadow-lg group cursor-pointer"
          >
            <Menu className="w-4 h-4 text-slate-300 group-hover:text-cyan-300" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-slate-900/90 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <span className="text-base font-bold">Preferences</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Temperature Unit */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Temperature Unit</div>
                  <div className="text-xs text-slate-400">Toggle Celsius or Fahrenheit</div>
                </div>
                <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-white/10">
                  <button
                    onClick={unit === 'F' ? onToggleUnit : undefined}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${unit === 'C' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_#22d3ee]' : 'text-slate-400'}`}
                  >
                    °C
                  </button>
                  <button
                    onClick={unit === 'C' ? onToggleUnit : undefined}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${unit === 'F' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_#22d3ee]' : 'text-slate-400'}`}
                  >
                    °F
                  </button>
                </div>
              </div>

              {/* Wind Speed Unit */}
              {onToggleSpeedUnit && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Wind Unit</div>
                    <div className="text-xs text-slate-400">Kilometers or Miles per hour</div>
                  </div>
                  <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-white/10">
                    <button
                      onClick={speedUnit === 'mph' ? onToggleSpeedUnit : undefined}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${speedUnit === 'kph' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_#22d3ee]' : 'text-slate-400'}`}
                    >
                      km/h
                    </button>
                    <button
                      onClick={speedUnit === 'kph' ? onToggleSpeedUnit : undefined}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${speedUnit === 'mph' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_#22d3ee]' : 'text-slate-400'}`}
                    >
                      mph
                    </button>
                  </div>
                </div>
              )}

              {/* Climate Atmosphere Theme Override */}
              <div>
                <div className="text-sm font-semibold mb-1">Atmosphere Simulation</div>
                <div className="text-xs text-slate-400 mb-2">Simulate climate environments</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: '⚡ Real Live' },
                    { id: 'sunny', label: '☀️ Solar Flare' },
                    { id: 'rain', label: '🌧️ Rainfall' },
                    { id: 'thunderstorm', label: '⚡ Lightning' },
                    { id: 'snow', label: '❄️ Arctic Frost' },
                    { id: 'clear-night', label: '✨ Starlight' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onSelectTheme(t.id as any)}
                      className={`p-2 rounded-xl text-xs font-medium border transition ${
                        manualTheme === t.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
