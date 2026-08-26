import React from 'react';
import { WeatherTheme } from '../types';

interface DynamicWeatherIconProps {
  theme: WeatherTheme;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  isDay?: boolean;
}

export const DynamicWeatherIcon: React.FC<DynamicWeatherIconProps> = ({
  theme,
  size = 'md',
  className = '',
  isDay = true,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    hero: 'w-32 h-32 md:w-40 md:h-40',
  };

  const currentSize = sizeClasses[size];

  switch (theme) {
    case 'sunny':
      return (
        <div className={`relative flex items-center justify-center ${currentSize} ${className}`}>
          {/* Outer Sun Glow */}
          <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse-slow" />
          
          {/* Rotating Solar Corona Rays */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-spin-slow text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
            fill="none"
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="14"
                x2="50"
                y2="4"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
                className="opacity-90"
              />
            ))}
          </svg>

          {/* Core Sun Sphere */}
          <div className="absolute w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-300 shadow-[0_0_25px_rgba(251,191,36,0.9)] animate-pulse-slow flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-yellow-300 to-white opacity-80 blur-[1px]" />
          </div>
        </div>
      );

    case 'clear-night':
      return (
        <div className={`relative flex items-center justify-center ${currentSize} ${className}`}>
          {/* Moon Glow */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse-slow" />
          
          {/* Animated Twinkling Mini Stars */}
          <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-ping opacity-75" />
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-90" />
          
          {/* Crescent Moon */}
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-cyan-100 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] animate-float-gentle"
            fill="none"
          >
            <path
              d="M70 20C42.3858 20 20 42.3858 20 70C20 80.5 23.2 90.2 28.7 98.3C16.9 91.5 9 78.7 9 64C9 40.8 27.8 22 51 22C61.3 22 70.8 25.7 78.2 31.9C75.6 24.3 70 20 70 20Z"
              fill="url(#moon-gradient)"
            />
            <defs>
              <linearGradient id="moon-gradient" x1="10" y1="10" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E0F2FE" />
                <stop offset="0.5" stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'partly-cloudy-day':
      return (
        <div className={`relative flex items-center justify-center ${currentSize} ${className}`}>
          {/* Background Sun */}
          <div className="absolute -top-1 -right-1 w-2/3 h-2/3">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse-slow" />
          </div>
          {/* Foreground Cloud */}
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-slate-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-float-gentle z-10"
            fill="none"
          >
            <path
              d="M25 70h50a20 20 0 0 0 0-40 24 24 0 0 0-46-8 16 16 0 0 0-14 24 16 16 0 0 0 10 24z"
              fill="url(#partly-cloud-grad)"
            />
            <defs>
              <linearGradient id="partly-cloud-grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="1" stopColor="#94A3B8" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'partly-cloudy-night':
      return (
        <div className={`relative flex items-center justify-center ${currentSize} ${className}`}>
          {/* Background Moon */}
          <div className="absolute -top-1 -right-1 w-1/2 h-1/2">
            <div className="w-full h-full rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.7)] animate-pulse-slow" />
          </div>
          {/* Darker Cloud */}
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-slate-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-float-gentle z-10"
            fill="none"
          >
            <path
              d="M25 70h50a20 20 0 0 0 0-40 24 24 0 0 0-46-8 16 16 0 0 0-14 24 16 16 0 0 0 10 24z"
              fill="url(#night-cloud-grad)"
            />
            <defs>
              <linearGradient id="night-cloud-grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#CBD5E1" stopOpacity="0.9" />
                <stop offset="1" stopColor="#475569" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'rain':
      return (
        <div className={`relative flex flex-col items-center justify-center ${currentSize} ${className}`}>
          {/* Cloud Layer */}
          <svg
            viewBox="0 0 100 65"
            className="w-full h-3/5 text-cyan-200 drop-shadow-[0_4px_10px_rgba(14,165,233,0.4)] animate-float-gentle"
            fill="none"
          >
            <path
              d="M20 55h60a18 18 0 0 0 0-36 22 22 0 0 0-42-7 15 15 0 0 0-13 21 15 15 0 0 0-5 22z"
              fill="url(#rain-cloud-grad)"
            />
            <defs>
              <linearGradient id="rain-cloud-grad" x1="20" y1="10" x2="80" y2="60">
                <stop stopColor="#E2E8F0" />
                <stop offset="1" stopColor="#64748B" />
              </linearGradient>
            </defs>
          </svg>
          {/* Animated Rain Streaks */}
          <div className="flex gap-2 justify-center w-3/4 mt-1">
            <span className="w-1 h-3.5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-bounce [animation-delay:75ms]" />
          </div>
        </div>
      );

    case 'thunderstorm':
      return (
        <div className={`relative flex flex-col items-center justify-center ${currentSize} ${className}`}>
          {/* Dark Storm Cloud */}
          <svg
            viewBox="0 0 100 65"
            className="w-full h-3/5 text-purple-200 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-float-gentle"
            fill="none"
          >
            <path
              d="M20 55h60a18 18 0 0 0 0-36 22 22 0 0 0-42-7 15 15 0 0 0-13 21 15 15 0 0 0-5 22z"
              fill="url(#thunder-cloud-grad)"
            />
            <defs>
              <linearGradient id="thunder-cloud-grad" x1="20" y1="10" x2="80" y2="60">
                <stop stopColor="#94A3B8" />
                <stop offset="1" stopColor="#334155" />
              </linearGradient>
            </defs>
          </svg>
          {/* Animated Lightning Bolt */}
          <svg
            viewBox="0 0 40 50"
            className="w-2/5 h-1/2 -mt-3 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse z-20"
            fill="currentColor"
          >
            <path d="M22 2L6 28h12l-4 20 18-28H20l4-18z" />
          </svg>
        </div>
      );

    case 'snow':
      return (
        <div className={`relative flex flex-col items-center justify-center ${currentSize} ${className}`}>
          {/* Frost Cloud */}
          <svg
            viewBox="0 0 100 65"
            className="w-full h-3/5 text-cyan-100 drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)] animate-float-gentle"
            fill="none"
          >
            <path
              d="M20 55h60a18 18 0 0 0 0-36 22 22 0 0 0-42-7 15 15 0 0 0-13 21 15 15 0 0 0-5 22z"
              fill="url(#snow-cloud-grad)"
            />
            <defs>
              <linearGradient id="snow-cloud-grad" x1="20" y1="10" x2="80" y2="60">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
          </svg>
          {/* Animated Snowflake crystals */}
          <div className="flex gap-2.5 justify-center w-3/4 mt-1">
            <span className="text-white text-xs animate-spin-slow drop-shadow-[0_0_4px_#fff]">❄</span>
            <span className="text-cyan-200 text-xs animate-spin-slow [animation-duration:10s] drop-shadow-[0_0_4px_#fff]">✻</span>
            <span className="text-white text-xs animate-spin-slow [animation-duration:15s] drop-shadow-[0_0_4px_#fff]">❄</span>
          </div>
        </div>
      );

    case 'fog':
    case 'overcast':
    case 'cloudy':
    default:
      return (
        <div className={`relative flex items-center justify-center ${currentSize} ${className}`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-slate-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] animate-float-gentle"
            fill="none"
          >
            <path
              d="M25 70h50a20 20 0 0 0 0-40 24 24 0 0 0-46-8 16 16 0 0 0-14 24 16 16 0 0 0 10 24z"
              fill="url(#cloudy-grad)"
            />
            {/* Subtle atmospheric flow line */}
            <path
              d="M20 78h60"
              stroke="#94A3B8"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-70"
            />
            <path
              d="M30 85h40"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-50"
            />
            <defs>
              <linearGradient id="cloudy-grad" x1="20" y1="20" x2="80" y2="80">
                <stop stopColor="#F1F5F9" />
                <stop offset="1" stopColor="#64748B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
  }
};
