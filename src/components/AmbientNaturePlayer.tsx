import React, { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { ambientSound } from '../utils/audioSynth';

export const AmbientNaturePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (ambientSound.getIsPlaying()) {
        ambientSound.stop();
      }
    };
  }, []);

  const handleToggle = () => {
    const newState = ambientSound.toggle();
    setIsPlaying(newState);
  };

  return (
    <button
      id="ambient-nature-btn"
      onClick={handleToggle}
      title={isPlaying ? 'Pause ambient nature soundscape' : 'Play ambient nature soundscape'}
      className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl border border-white/15 hover:border-cyan-500/40 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] transition group text-left cursor-pointer"
    >
      <div className={`p-2 rounded-xl border transition ${isPlaying ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]' : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-white'}`}>
        <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
      </div>

      <div className="flex flex-col pr-1">
        <span className="text-xs font-semibold text-white tracking-tight leading-tight">
          Ambient Nature
        </span>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          {isPlaying ? (
            <>
              <span className="text-cyan-400 font-medium">Playing...</span>
            </>
          ) : (
            <span>Tap to play</span>
          )}
        </span>
      </div>

      {/* Animated Sound Equalizer Bars */}
      <div className="flex items-end gap-0.5 h-4 ml-auto pl-2">
        <span className={`w-1 bg-cyan-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-3.5 animate-pulse [animation-delay:0ms]' : 'h-1.5 opacity-40'}`} />
        <span className={`w-1 bg-cyan-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-4 animate-pulse [animation-delay:150ms]' : 'h-2 opacity-40'}`} />
        <span className={`w-1 bg-cyan-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-2.5 animate-pulse [animation-delay:300ms]' : 'h-1 opacity-40'}`} />
        <span className={`w-1 bg-cyan-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-4 animate-pulse [animation-delay:75ms]' : 'h-1.5 opacity-40'}`} />
      </div>
    </button>
  );
};
