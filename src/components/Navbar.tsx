import React, { useState, useEffect } from 'react';
import { Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useAudioCoordinator } from '../context/AudioCoordinator';

interface NavbarProps {
  onOpenSurprise: () => void;
  onOpenCinematic?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSurprise, onOpenCinematic }) => {
  const { isMusicPlaying, toggleMusic } = useAudioCoordinator();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-3.5 ${
        scrolled
          ? 'bg-[#FFF9F5]/85 backdrop-blur-md shadow-sm border-b border-[#F7C8D9]/40 py-2.5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F7C8D9] to-[#D982A5] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
          </div>
          <span className="font-semibold tracking-wider text-sm sm:text-base text-[#2A1722] group-hover:text-[#75445C] transition-colors">
            SNEHUU <span className="text-[#D982A5]">♡</span>
          </span>
        </button>

        {/* Minimal Nav Links */}
        <nav className="flex items-center gap-2.5 sm:gap-5 text-xs sm:text-sm font-medium text-[#75445C]">
          <button
            onClick={() => {
              onOpenSurprise();
              scrollTo('birthday-wish');
            }}
            className="hover:text-[#2A1722] transition-colors cursor-pointer py-1 px-2 rounded-full hover:bg-white/50"
          >
            Wish
          </button>
          
          <button
            onClick={() => scrollTo('memories-section')}
            className="hover:text-[#2A1722] transition-colors cursor-pointer py-1 px-2 rounded-full hover:bg-white/50"
          >
            Memories
          </button>

          <button
            onClick={() => scrollTo('videos-section')}
            className="hidden sm:inline-block hover:text-[#2A1722] transition-colors cursor-pointer py-1 px-2 rounded-full hover:bg-white/50"
          >
            Moments
          </button>

          <button
            onClick={() => scrollTo('final-letter')}
            className="hover:text-[#2A1722] transition-colors cursor-pointer py-1 px-2 rounded-full hover:bg-white/50"
          >
            Letter
          </button>

          <button
            onClick={() => {
              if (onOpenCinematic) {
                onOpenCinematic();
              } else {
                window.location.hash = '#surprise';
              }
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#FCE7F0] to-[#F7C8D9] hover:from-[#F7C8D9] hover:to-[#D982A5] text-[#75445C] hover:text-[#2A1722] px-3 sm:px-4 py-1.5 rounded-full transition-all cursor-pointer font-medium shadow-xs group"
            title="Open Snehuu's Secret Cinematic Story"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D982A5] group-hover:rotate-12 transition-transform" />
            <span>Surprise 🎬</span>
          </button>

          {/* Quick Sound/Music Toggle */}
          <button
            onClick={toggleMusic}
            aria-label="Toggle background music"
            title={isMusicPlaying ? 'Pause background music' : 'Play background music'}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/70 hover:bg-white border border-[#F7C8D9] text-[#75445C] transition-all cursor-pointer shadow-xs"
          >
            {isMusicPlaying ? (
              <Volume2 className="w-4 h-4 text-[#D982A5] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#75445C]/70" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
