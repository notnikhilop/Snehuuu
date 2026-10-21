import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

export const ReasonsILoveYou: React.FC = () => {
  const { reasonsILoveYou } = birthdayContent;
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleCard = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const unlockedCount = Object.values(flippedCards).filter(Boolean).length;

  return (
    <section
      id="reasons-section"
      className="relative py-24 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FCE7F0]/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7C8D9]/50 text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" /> Six Sweet Secrets
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight">
            Little Things I Love About You
          </h2>
          <p className="text-sm sm:text-base text-[#75445C] mt-2 font-normal">
            Out of a million reasons why you hold my heart, here are six that make me smile every day. Tap each card to reveal what I cherish about you.
          </p>

          {/* Progress indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#F7C8D9] text-xs font-medium text-[#75445C] shadow-xs">
            <Heart className="w-3.5 h-3.5 text-[#D982A5] fill-[#D982A5]" />
            <span>Unlocked {unlockedCount} of 6 little secrets</span>
          </div>
        </div>

        {/* 6 Interactive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasonsILoveYou.map((reason, index) => {
            const isFlipped = !!flippedCards[index];
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

            return (
              <div
                key={index}
                className="perspective-1000 h-64 cursor-pointer select-none"
                onClick={() => toggleCard(index)}
              >
                <motion.div
                  className="relative w-full h-full transition-transform duration-700 preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card Front (Hidden Secret) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between items-center text-center bg-gradient-to-br from-white via-[#FFF9F5] to-[#FCE7F0]/60 border border-[#F7C8D9] shadow-md hover:shadow-xl transition-all backface-hidden group"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-full flex justify-between items-center text-xs font-semibold text-[#D982A5]">
                      <span>No. 0{index + 1}</span>
                      <span className="font-serif tracking-widest">{romanNumerals[index]}</span>
                    </div>

                    <div className="my-auto flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FCE7F0] to-[#F7C8D9] flex items-center justify-center text-[#75445C] mb-3 shadow-inner group-hover:scale-110 transition-transform">
                        <Heart className="w-7 h-7 text-[#D982A5] fill-[#F7C8D9] group-hover:fill-[#D982A5] transition-colors" />
                      </div>
                      <h4 className="font-serif font-bold text-lg text-[#2A1722]">
                        Secret #{index + 1}
                      </h4>
                      <p className="text-xs text-[#75445C]/80 mt-1">Tap to unfold this memory</p>
                    </div>

                    <div className="w-full pt-3 border-t border-[#F7C8D9]/40 flex items-center justify-center text-[11px] text-[#D982A5] font-medium gap-1">
                      <Sparkles className="w-3 h-3" /> Tap to reveal
                    </div>
                  </div>

                  {/* Card Back (Revealed Reason) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between items-center text-center bg-gradient-to-br from-[#75445C] to-[#552E41] text-white shadow-xl border border-white/20 backface-hidden"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full flex justify-between items-center text-xs font-medium text-[#F7C8D9]">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F7C8D9]" /> Revealed
                      </span>
                      <span>No. 0{index + 1}</span>
                    </div>

                    <div className="my-auto px-2">
                      <p className="text-base sm:text-lg font-serif italic leading-relaxed text-[#FFF9F5]">
                        "{reason}"
                      </p>
                    </div>

                    <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F7C8D9]/80 font-sans">
                      <span>Forever Loved</span>
                      <span className="font-script text-base text-white">Nikhil &amp; Snehuu</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
