import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Disc3 } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';
import { useAudioCoordinator } from '../context/AudioCoordinator';

export const MusicPlayer: React.FC = () => {
  const { theme } = birthdayContent;
  const { isMusicPlaying, toggleMusic } = useAudioCoordinator();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xl flex items-center gap-3 border border-white/80 max-w-[280px] sm:max-w-xs"
      >
        {/* Spinning Disc / Vinyl Icon */}
        <motion.div
          animate={isMusicPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#75445C] to-[#D982A5] flex items-center justify-center text-white shadow-xs shrink-0"
        >
          <Disc3 className="w-5 h-5 text-white" />
        </motion.div>

        {/* Track Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#2A1722] truncate block">
              {theme.musicTitle}
            </span>
            {isMusicPlaying && (
              <span className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-full bg-[#D982A5] animate-pulse" />
                <span className="w-0.5 h-1.5 bg-[#D982A5] animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-0.5 h-2 bg-[#D982A5] animate-pulse" style={{ animationDelay: '0.4s' }} />
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#75445C] truncate block">
            {theme.musicArtist}
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={toggleMusic}
          className="w-8 h-8 rounded-full bg-[#0A0709] hover:bg-[#20151C] text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
          aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
          title={isMusicPlaying ? 'Pause background music' : 'Play background music'}
        >
          {isMusicPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
          )}
        </button>
      </motion.div>
    </div>
  );
};
