import React from 'react';
import { motion } from 'framer-motion';
import { GlassHeart } from './GlassHeart';
import { IridescentRibbon } from './IridescentRibbon';
import { birthdayContent } from '../data/birthdayContent';
import { Heart } from 'lucide-react';

interface HeroProps {
  onOpenSurprise: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSurprise }) => {
  const { recipient, hero } = birthdayContent;

  const scrollToWish = () => {
    onOpenSurprise();
    const el = document.getElementById('birthday-wish');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between items-center overflow-hidden pt-20 pb-12 sm:pb-16 select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #FBF0F6 0%, #F5EEF8 45%, #FCF5F8 75%, #FFF9F5 100%)',
      }}
    >
      {/* Ambient background glow & subtle dreamy atmospheric gradient aura */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(247, 200, 217, 0.7) 0%, rgba(220, 195, 245, 0.45) 50%, transparent 75%)',
        }}
      />

      {/* Floating dreamy micro-sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[18%] left-[12%] text-[#D982A5]/30 animate-pulse text-xs">✦</div>
        <div className="absolute top-[28%] right-[15%] text-[#75445C]/25 animate-pulse text-sm">✧</div>
        <div className="absolute top-[68%] left-[18%] text-[#D982A5]/40 animate-pulse text-xs">✦</div>
        <div className="absolute top-[75%] right-[22%] text-[#D982A5]/35 animate-pulse text-sm">✧</div>
      </div>

      {/* Iridescent pearlescent flowing ribbons on left and right */}
      <IridescentRibbon side="left" />
      <IridescentRibbon side="right" />

      {/* Top Editorial Pills */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="z-20 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-4 mb-2 max-w-2xl text-center"
      >
        <span className="glass-pill px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-[#D982A5] tracking-wide border border-white/70">
          {recipient.birthday}
        </span>
        <span className="glass-pill px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-medium text-[#75445C] tracking-wide border border-white/70 flex items-center gap-1">
          <Heart className="w-2.5 h-2.5 text-[#D982A5] fill-[#D982A5]" />
          Happy Birthday
        </span>
        <span className="glass-pill px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-medium text-[#75445C] tracking-wide border border-white/70 hidden sm:inline-block">
          {recipient.displayName}
        </span>
        <span className="glass-pill px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-medium text-[#75445C] tracking-wide border border-white/70">
          With Love, Nikhil
        </span>
      </motion.div>

      {/* Main Center Composition: Oversized Bold Editorial Typography + Floating 3D Glass Heart */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center px-4 my-auto">
        <div className="relative w-full flex items-center justify-center">
          
          {/* Oversized Bold Typography: "SNEHUU" (70–85% width on desktop) */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center font-black tracking-[-0.05em] sm:tracking-[-0.06em] text-[#0A0709] leading-none select-none z-10 uppercase transition-all"
            style={{
              fontFamily: '"Playfair Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: 'clamp(3.8rem, 16.5vw, 15.5rem)',
              textShadow: '0 10px 40px rgba(117, 68, 92, 0.06)',
            }}
          >
            {hero.title}
          </motion.h1>

          {/* Floating Translucent Glass Heart layered directly in front of the typography */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <GlassHeart size={window.innerWidth < 640 ? 210 : window.innerWidth < 1024 ? 280 : 340} />
          </div>

        </div>
      </div>

      {/* Bottom Supporting Line & Call-to-Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="z-20 flex flex-col items-center text-center px-4 gap-4 mt-2 sm:mt-4 max-w-lg mx-auto"
      >
        <p className="text-sm sm:text-base md:text-lg font-medium text-[#75445C] tracking-normal">
          {hero.subtitle}
        </p>

        {/* Small rounded black button with white text */}
        <button
          onClick={scrollToWish}
          className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#0A0709] hover:bg-[#20151C] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D982A5] focus:ring-offset-2"
        >
          <span>{hero.buttonText}</span>
          <span className="text-[#F7C8D9] group-hover:translate-x-0.5 transition-transform duration-200">
            ♡
          </span>
        </button>

        <p className="text-[11px] text-[#75445C]/60 tracking-wider font-light">
          Scroll down to see your birthday surprise ↓
        </p>
      </motion.div>
    </section>
  );
};
