import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart, ChevronDown, Sparkles } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

export const LoveLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { letter, recipient } = birthdayContent;

  const handleContinue = () => {
    const el = document.getElementById('story-timeline');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="letter-section"
      className="relative min-h-screen py-20 px-4 sm:px-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF9F5] via-[#FCE7F0]/30 to-[#FFF9F5]"
    >
      {/* Background ambient elements */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#F7C8D9]/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#D982A5]/15 blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col items-center">
        
        {/* Section header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7C8D9]/50 text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" /> For Your Eyes Only
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight">
            {letter.title}
          </h2>
          <p className="text-sm sm:text-base text-[#75445C] mt-2 font-light">
            Tap the sealed envelope to unveil a handwritten message from across the miles.
          </p>
        </div>

        {/* Envelope Container */}
        <div className="w-full flex flex-col items-center">
          {!isOpen ? (
            /* Sealed Envelope */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsOpen(true)}
              className="relative w-full max-w-lg aspect-[16/10] bg-gradient-to-br from-[#FFF9F5] to-[#FCE7F0] rounded-2xl shadow-xl border border-[#F7C8D9] cursor-pointer p-6 flex flex-col items-center justify-center transition-all group overflow-hidden"
            >
              {/* Envelope flap lines */}
              <div className="absolute inset-0 border-[16px] border-[#FFF9F5]/80 pointer-events-none rounded-2xl" />
              
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#F7C8D9]/40 to-transparent pointer-events-none" />

              {/* Postal stamp */}
              <div className="absolute top-6 right-6 w-14 h-16 border-2 border-dashed border-[#D982A5] rounded-md p-1 flex flex-col items-center justify-center text-center bg-white/70 shadow-xs">
                <Heart className="w-5 h-5 text-[#D982A5] fill-[#D982A5]" />
                <span className="text-[9px] font-bold text-[#75445C] mt-0.5">OCT 23</span>
              </div>

              {/* Addressee text */}
              <div className="text-center z-10 space-y-1">
                <p className="text-xs tracking-widest text-[#75445C]/70 uppercase font-medium">To My Sweetest</p>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#2A1722] font-bold">
                  {recipient.displayName}
                </h3>
                <p className="text-xs text-[#D982A5] font-script text-xl pt-1">
                  "Miles apart, always in my heart"
                </p>
              </div>

              {/* Wax Seal / Heart Seal */}
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#75445C] via-[#945775] to-[#D982A5] flex items-center justify-center shadow-lg border-2 border-white/60 text-white z-20 group-hover:shadow-[#D982A5]/50 transition-shadow"
              >
                <Heart className="w-6 h-6 fill-white drop-shadow-xs animate-pulse" />
              </motion.div>

              <span className="text-xs text-[#75445C] font-medium mt-3 z-10 flex items-center gap-1 group-hover:text-[#D982A5] transition-colors">
                <Sparkles className="w-3 h-3" /> Tap to unseal letter
              </span>
            </motion.div>
          ) : (
            /* Unfolded Vintage Love Letter */
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-2xl bg-[#FFFDFB] rounded-2xl shadow-2xl border border-[#F7C8D9]/70 p-6 sm:p-10 relative overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#F7C8D9 0.75px, transparent 0.75px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Letter top metadata */}
              <div className="flex items-center justify-between border-b border-[#F7C8D9]/60 pb-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-[#D982A5] tracking-widest uppercase">
                    Air Mail • Express from Nikhil's Heart
                  </span>
                  <p className="text-sm text-[#75445C] font-medium">October 23 • Her Special Day</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FCE7F0] flex items-center justify-center border border-[#F7C8D9]">
                  <Heart className="w-5 h-5 text-[#D982A5] fill-[#D982A5]" />
                </div>
              </div>

              {/* Letter Content */}
              <div className="space-y-4 text-[#33222B] text-base sm:text-lg leading-relaxed font-serif">
                {letter.message.split('\n\n').map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 + 0.2, duration: 0.5 }}
                    className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#75445C] first-letter:mr-1"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-[#F7C8D9]/50 flex flex-col items-end">
                <span className="text-xs tracking-wider text-[#75445C] font-sans">With all my love across the oceans,</span>
                <p className="text-2xl sm:text-3xl font-script text-[#75445C] mt-1">
                  {letter.signature}
                </p>
              </div>

              {/* Continue button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D982A5] to-[#75445C] hover:from-[#c97194] hover:to-[#64384e] text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Continue our story</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
};
