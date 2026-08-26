import React, { useState } from 'react';
import { X, MapPin, Trash2, Heart, Plus, Compass } from 'lucide-react';

interface SavedLocationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCities: string[];
  currentCity: string;
  onSelectCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
  onAddCurrentCity: () => void;
}

export const SavedLocationsDrawer: React.FC<SavedLocationsDrawerProps> = ({
  isOpen,
  onClose,
  savedCities,
  currentCity,
  onSelectCity,
  onRemoveCity,
  onAddCurrentCity,
}) => {
  const [newCityInput, setNewCityInput] = useState('');

  if (!isOpen) return null;

  const popularCities = ['Tokyo, Japan', 'New York, USA', 'Paris, France', 'Sydney, Australia', 'Dubai, UAE', 'Reykjavik, Iceland'];

  const isCurrentSaved = savedCities.some(
    (c) => c.toLowerCase() === currentCity.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-full bg-slate-900/90 border-l border-white/20 shadow-2xl backdrop-blur-2xl p-6 flex flex-col justify-between text-white overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="text-base font-bold">Saved & Explore</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current City Bookmark */}
          <div className="mt-4 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs text-slate-400 font-medium">Viewing Now</div>
                <div className="text-sm font-semibold text-white">{currentCity}</div>
              </div>
            </div>
            {!isCurrentSaved ? (
              <button
                onClick={onAddCurrentCity}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-[0_0_10px_#22d3ee]"
              >
                <Heart className="w-3.5 h-3.5 fill-slate-950" />
                <span>Save</span>
              </button>
            ) : (
              <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-cyan-400" />
                <span>Saved</span>
              </span>
            )}
          </div>

          {/* Saved Cities List */}
          <div className="mt-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Favorites ({savedCities.length})
            </div>
            {savedCities.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">
                No saved cities yet. Bookmark locations for instant access.
              </div>
            ) : (
              <div className="space-y-1.5">
                {savedCities.map((city) => (
                  <div
                    key={city}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 transition group"
                  >
                    <button
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-cyan-300 text-left flex-1"
                    >
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>{city}</span>
                    </button>
                    <button
                      onClick={() => onRemoveCity(city)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick World Cities */}
          <div className="mt-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              World Metros
            </div>
            <div className="grid grid-cols-2 gap-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-400/40 text-xs font-medium text-slate-300 hover:text-white transition text-left"
                >
                  {city.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 text-center text-slate-500 text-[11px]">
          WEATHER X • Live Global Climate Network
        </div>
      </div>
    </div>
  );
};
