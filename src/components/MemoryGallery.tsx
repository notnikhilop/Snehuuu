import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Maximize2, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

export const MemoryGallery: React.FC = () => {
  const { memories } = birthdayContent;
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % memories.length);
    }
  };

  const prevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + memories.length) % memories.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  const rotations = [-1.5, 1.2, -1, 1.5, -0.8, 1.4, -1.2, 0.9, -1.4, 1.1, -0.9, 1.3];

  return (
    <section
      id="memories-section"
      className="relative py-24 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden"
    >
      {/* Soft ambient blur backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[600px] bg-[#FCE7F0]/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7C8D9]/50 text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5 text-[#D982A5]" /> Our Memories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight">
            Moments I Hold Close
          </h2>
          <p className="text-sm sm:text-base text-[#75445C] mt-2 font-normal">
            Every snapshot carries a piece of my heart. Tap any photo to see it in full view.
          </p>
        </div>

        {/* 12-Slot Photo Grid with Polaroid Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {memories.map((item, index) => {
            const rot = rotations[index % rotations.length];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                style={{ transform: `rotate(${rot}deg)` }}
                onClick={() => openLightbox(index)}
                className="relative bg-white p-3.5 pb-5 rounded-xl shadow-md hover:shadow-2xl border border-[#F7C8D9]/70 cursor-pointer transition-all duration-300 group"
              >
                {/* Photo frame */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-lg bg-[#FCE7F0]/30 mb-3">
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/images/photo-${String(index + 1).padStart(2, '0')}.svg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-[#2A1722]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-[#75445C] shadow-md backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Short Caption */}
                <div className="px-1 text-center">
                  <p className="text-xs sm:text-sm text-[#33222B] font-medium leading-snug line-clamp-2">
                    {item.caption}
                  </p>
                  {item.date && (
                    <span className="inline-block text-[11px] font-script text-base text-[#D982A5] mt-1">
                      {item.date} ♡
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Full-screen Photo Viewer (Lightbox Modal) */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0709]/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev Button */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextPhoto}
                className="absolute right-4 md:right-[320px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* High-res Image View */}
              <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[460px]">
                <img
                  src={memories[activePhotoIndex].image}
                  alt={memories[activePhotoIndex].caption}
                  className="max-h-[75vh] w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/images/photo-${String(activePhotoIndex + 1).padStart(2, '0')}.svg`;
                  }}
                />
              </div>

              {/* Sidebar Details */}
              <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-[#FFF9F5] border-t md:border-t-0 md:border-l border-[#F7C8D9]">
                <div>
                  <span className="text-xs font-semibold text-[#D982A5] tracking-wider uppercase">
                    Photo {activePhotoIndex + 1} of {memories.length}
                  </span>
                  <h4 className="text-xl font-serif font-bold text-[#2A1722] mt-2">
                    {memories[activePhotoIndex].date || 'Special Memory'}
                  </h4>
                  <p className="text-sm text-[#75445C] leading-relaxed mt-3">
                    {memories[activePhotoIndex].caption}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F7C8D9]/60 flex items-center justify-between text-xs text-[#75445C]">
                  <span className="flex items-center gap-1 text-[#D982A5] font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-[#D982A5]" /> Nikhil &amp; Snehuu
                  </span>
                  <span>Slot {activePhotoIndex + 1}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
