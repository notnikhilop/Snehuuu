import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Cake, Sparkles, Heart, PartyPopper, RotateCcw } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

export const BirthdayWish: React.FC = () => {
  const { birthdayWish, recipient } = birthdayContent;
  const [candlesLit, setCandlesLit] = useState<[boolean, boolean, boolean]>([true, true, true]);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-[#75445C]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic text-[#75445C]">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const triggerCelebration = () => {
    setCandlesLit([false, false, false]);
    setHasCelebrated(true);

    try {
      const count = 220;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#FCE7F0', '#F7C8D9', '#D982A5', '#FFF9F5', '#75445C', '#F59E0B'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // Confetti fallback
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.001, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.95);
        });
      }
    } catch {
      // Audio fallback
    }
  };

  const toggleSingleCandle = (idx: number) => {
    const updated: [boolean, boolean, boolean] = [...candlesLit];
    updated[idx] = !updated[idx];
    setCandlesLit(updated);

    if (!updated.some(Boolean)) {
      triggerCelebration();
    }
  };

  const relightCandles = () => {
    setCandlesLit([true, true, true]);
  };

  const anyCandleLit = candlesLit.some(Boolean);

  return (
    <section
      id="birthday-wish"
      className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF9F5] via-[#FCE7F0]/35 to-[#FFF9F5] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Subtle Header Badge */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7C8D9]/60 text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-3">
            <Cake className="w-3.5 h-3.5 text-[#D982A5]" /> October 23 • Snehuu's Special Day
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight">
            {birthdayWish.heading}
          </h2>
          <p className="text-xs sm:text-sm text-[#D982A5] font-script text-2xl mt-1">
            {birthdayWish.playfulNickname}
          </p>
        </div>

        {/* Heartfelt Birthday Message Card (~80-120 words) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-xl border border-[#F7C8D9] mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FCE7F0]/60 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4 border-b border-[#F7C8D9]/50 pb-3">
            <span className="text-xs font-semibold text-[#D982A5] uppercase tracking-wider">
              From Nikhil's Heart
            </span>
            <span className="text-xs text-[#75445C] font-medium">October 23</span>
          </div>

          <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed text-[#33222B]">
            {birthdayWish.message.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {renderFormattedText(paragraph)}
              </p>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#F7C8D9]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {recipient.nicknames.map((nick, idx) => (
                <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFF9F5] border border-[#F7C8D9] text-[#75445C]">
                  {nick}
                </span>
              ))}
            </div>
            <span className="text-xl sm:text-2xl font-script text-[#75445C]">
              {birthdayWish.signature}
            </span>
          </div>
        </motion.div>

        {/* Interactive Pastel Birthday Cake with Candles */}
        <div className="relative w-full max-w-md flex flex-col items-center my-2 select-none">
          {/* Candles */}
          <div className="flex items-end justify-center gap-8 mb-[-4px] z-20">
            {candlesLit.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => toggleSingleCandle(idx)}
                className="relative flex flex-col items-center cursor-pointer group"
                title={isLit ? "Tap flame to blow out" : "Tap to relight"}
              >
                <AnimatePresence>
                  {isLit ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.15, 0.95, 1],
                        rotate: [-2, 2, -1, 1],
                      }}
                      exit={{ scale: 0, opacity: 0, y: -10 }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                      className="relative w-5 h-7 mb-1 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-amber-300 rounded-full blur-xs opacity-80" />
                      <div className="w-3.5 h-6 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full shadow-md transform -translate-y-0.5" />
                      <div className="w-1.5 h-3 bg-white rounded-full opacity-90" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -20, scale: 1.5 }}
                      transition={{ duration: 1.2 }}
                      className="w-4 h-6 mb-1 text-[#75445C]/40 flex items-center justify-center font-bold text-xs"
                    >
                      ~
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-0.5 h-2 bg-stone-600" />
                <div className="w-4 h-14 rounded-t-sm bg-gradient-to-b from-[#FFF9F5] via-[#FCE7F0] to-[#F7C8D9] border border-[#D982A5]/30 shadow-xs flex flex-col justify-around py-1 overflow-hidden">
                  <div className="w-full h-1 bg-[#D982A5]/40 transform -rotate-12 scale-125" />
                  <div className="w-full h-1 bg-[#D982A5]/40 transform -rotate-12 scale-125" />
                </div>
              </div>
            ))}
          </div>

          {/* Top Tier Cake */}
          <div className="relative w-48 h-16 rounded-t-3xl bg-gradient-to-b from-white to-[#FCE7F0] border-2 border-[#F7C8D9] shadow-sm z-10 flex flex-col justify-between items-center overflow-hidden">
            <div className="w-full flex justify-around">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-6 h-4 bg-white rounded-b-full shadow-xs" />
              ))}
            </div>
            <div className="text-xs font-serif italic text-[#75445C] font-semibold tracking-wider pb-2">
              For Snehuu ♡
            </div>
          </div>

          {/* Middle Tier Cake */}
          <div className="relative w-64 h-20 rounded-t-2xl bg-gradient-to-b from-[#FCE7F0] to-[#F7C8D9] border-2 border-[#F7C8D9] shadow-md z-0 flex flex-col justify-between items-center overflow-hidden -mt-1">
            <div className="w-full flex justify-around">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-6 h-4 bg-[#FCE7F0] rounded-b-full shadow-xs" />
              ))}
            </div>
            <div className="flex items-center gap-3 pb-2 text-[#75445C]">
              <Heart className="w-3.5 h-3.5 fill-[#D982A5] text-[#D982A5]" />
              <span className="text-xs font-bold uppercase tracking-widest">October 23</span>
              <Heart className="w-3.5 h-3.5 fill-[#D982A5] text-[#D982A5]" />
            </div>
          </div>

          {/* Bottom Tier Cake */}
          <div className="relative w-80 h-22 rounded-t-2xl bg-gradient-to-b from-[#F7C8D9] to-[#D982A5]/70 border-2 border-[#D982A5]/40 shadow-lg flex flex-col justify-between items-center overflow-hidden -mt-1">
            <div className="w-full flex justify-around">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-7 h-5 bg-[#F7C8D9] rounded-b-full shadow-xs" />
              ))}
            </div>
            <div className="text-xs text-white font-medium tracking-widest pb-3 font-serif">
              ✦ {recipient.displayName} ✦
            </div>
          </div>

          {/* Stand */}
          <div className="w-96 h-5 rounded-full bg-white border-2 border-[#F7C8D9] shadow-xl mt-[-2px] flex items-center justify-center">
            <div className="w-32 h-1 bg-[#D982A5]/20 rounded-full" />
          </div>
          <div className="w-28 h-6 bg-gradient-to-b from-white to-[#FCE7F0] rounded-b-xl border-x-2 border-b-2 border-[#F7C8D9] shadow-md" />
        </div>

        {/* Blow Out / Relight Candles Action Button */}
        <div className="mt-4">
          {anyCandleLit ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerCelebration}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D982A5] via-[#c97194] to-[#75445C] hover:opacity-95 text-white font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <PartyPopper className="w-5 h-5" />
              <span>Blow Out Candles &amp; Make A Wish 🎂</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={relightCandles}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FFF9F5] border border-[#F7C8D9] text-[#75445C] font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#D982A5]" />
              <span>Relight Candles to Wish Again 🕯️</span>
            </motion.button>
          )}
        </div>

        {/* Celebratory Wish Unlocked Box */}
        <AnimatePresence>
          {hasCelebrated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg bg-white rounded-2xl p-6 mt-8 shadow-xl border border-[#F7C8D9] text-center"
            >
              <Sparkles className="w-6 h-6 text-[#D982A5] mx-auto mb-2" />
              <h4 className="font-serif font-bold text-xl text-[#2A1722]">
                Your wish is sealed into the universe!
              </h4>
              <p className="text-sm text-[#75445C] mt-1 font-script text-xl">
                Happy Birthday to my sweetest {recipient.nicknames[3]} ♡
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
