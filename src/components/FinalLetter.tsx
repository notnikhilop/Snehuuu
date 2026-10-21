import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowUp, Star } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

export const FinalLetter: React.FC = () => {
  const { finalLetter, recipient } = birthdayContent;
  const [isRevealed, setIsRevealed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="final-letter"
      className="relative min-h-screen py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF9F5] via-[#2A1722] to-[#160B12] text-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Starry Night particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-60 animate-pulse"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              animationDuration: `${(i % 4) + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full mx-auto relative z-10 flex flex-col items-center">
        
        {/* Subtle romantic badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F7C8D9] text-xs font-semibold uppercase tracking-wider mb-4">
          <Star className="w-3.5 h-3.5 fill-[#F7C8D9]" /> One Last Thought
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-center text-white tracking-tight mb-4">
          {finalLetter.heading}
        </h2>

        <p className="text-sm sm:text-base text-[#F7C8D9]/90 text-center max-w-lg mb-8 font-light">
          A promise sealed under the same stars that shine above both of us tonight.
        </p>

        {/* Sealed Card or Unfolded Letter */}
        <div className="w-full">
          {!isRevealed ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsRevealed(true)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl group transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D982A5] to-[#F7C8D9] flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 fill-white animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">
                A Letter for {recipient.displayName}
              </h3>
              <p className="text-xs text-[#F7C8D9] font-medium tracking-wider uppercase mt-1">
                October 23 • From Nikhil with all his heart
              </p>
              <span className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold tracking-wide border border-white/30 transition-all">
                <Sparkles className="w-3.5 h-3.5" /> Tap to open final letter
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full bg-[#FFF9F5] text-[#2A1722] rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#F7C8D9] relative overflow-hidden"
            >
              {/* Paper stamp decoration */}
              <div className="flex items-center justify-between border-b border-[#F7C8D9]/60 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-[#D982A5] uppercase tracking-widest">
                    Eternal Promise
                  </span>
                  <p className="text-xs text-[#75445C] mt-0.5">Written across the miles</p>
                </div>
                <Heart className="w-6 h-6 text-[#D982A5] fill-[#D982A5]" />
              </div>

              {/* Message */}
              <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed text-[#33222B]">
                {finalLetter.message.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Romantic Signature */}
              <div className="mt-10 pt-6 border-t border-[#F7C8D9]/60 flex flex-col items-end">
                <p className="text-xs text-[#75445C] font-sans">Forever and always,</p>
                <p className="text-3xl sm:text-4xl font-script text-[#75445C] mt-1">
                  {finalLetter.signature}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Replay / Scroll to Top Button */}
        <div className="mt-14 flex flex-col items-center">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md transition-all cursor-pointer group"
          >
            <span>Relive the magic from the start</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
          <p className="text-[11px] text-[#F7C8D9]/60 mt-3 font-light text-center">
            Made with endless love by Nikhil for Snehuu ♡ Happy Birthday, Jaan!
          </p>
        </div>

      </div>
    </section>
  );
};
