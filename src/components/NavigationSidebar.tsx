import React from 'react';
import {
  Home,
  CloudSun,
  LineChart,
  Umbrella,
  Heart,
} from 'lucide-react';

export type NavTab = 'home' | 'forecast' | 'analytics' | 'radar' | 'favorites';

interface NavigationSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount?: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount = 0,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Main Dashboard', icon: Home },
    { id: 'forecast', label: 'Detailed Forecast', icon: CloudSun },
    { id: 'analytics', label: 'Climate Analytics', icon: LineChart },
    { id: 'radar', label: 'Precipitation & Radar', icon: Umbrella },
    { id: 'favorites', label: 'Saved Locations', icon: Heart },
  ];

  return (
    <nav
      id="main-navigation-dock"
      aria-label="Navigation"
      className="flex flex-col items-center gap-3 p-2 bg-slate-900/60 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`nav-btn-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            title={item.label}
            className={`relative group w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isActive
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

            {/* Notification badge for favorites */}
            {item.id === 'favorites' && favoritesCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}

            {/* Hover Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900/90 text-white text-xs font-medium rounded-xl border border-white/15 backdrop-blur-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
