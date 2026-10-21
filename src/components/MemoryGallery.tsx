import React, { useState } from 'react';
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

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  // Subtle natural Polaroid rotation angles for realism
  const rotations = [-2, 1.5, -1, 2, -1.8, 1.2];

  return (
    <section
      id="memory-gallery"
      className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF9F5] via-[#FCE7F0]/25 to-[#FFF9F5] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7C8D9]/50 text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" /> Our Keepsakes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight">
            Moments I Hold Close
          </h2>
          <p className="text-sm sm:text-base text-[#75445C] mt-2 font-normal">
            Every snapshot carries a piece of my heart. Tap any photo to step inside the memory.
          </p>
        </div>

        {/* Polaroid Gallery Grid / Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {memories.map((item, index) => {
            const rot = rotations[index % rotations.length];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
                style={{ transform: `rotate(${rot}deg)` }}
                onClick={() => openLightbox(index)}
                className="relative bg-white p-4 pb-6 rounded-md shadow-lg border border-[#F7C8D9]/70 cursor-pointer transition-all duration-300 group hover:shadow-2xl"
              >
                {/* Vintage tape effect at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/70 backdrop-blur-xs border border-white/60 shadow-xs rotate-[-1deg] opacity-75 z-10" />

                {/* Photo frame */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-xs bg-[#FCE7F0]/30 mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/images/photo-0${(index % 6) + 1}.svg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-[#2A1722]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/80 text-[#75445C] shadow-md backdrop-blur-sm">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Polaroid handwritten caption */}
                <div className="text-center px-2">
                  <h3 className="font-serif font-bold text-[#2A1722] text-lg sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="font-script text-xl sm:text-2xl text-[#75445C] mt-1 line-clamp-1">
                    {item.date || 'Sweet moments together'}
                  </p>
                  <p className="text-xs text-[#75445C]/80 mt-1 line-clamp-2 font-light">
                    {item.caption}
                  </p>
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
            className="fixed inset-0 z-50 bg-[#0A0709]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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

              {/* Prev / Next Buttons */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-4 md:right-[320px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* High-res Image View */}
              <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px] sm:min-h-[450px]">
                <img
                  src={memories[activePhotoIndex].image}
                  alt={memories[activePhotoIndex].title}
                  className="max-h-[75vh] w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/images/photo-0${(activePhotoIndex % 6) + 1}.svg`;
                  }}
                />
              </div>

              {/* Sidebar Details */}
              <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-[#FFF9F5] border-t md:border-t-0 md:border-l border-[#F7C8D9]">
                <div>
                  <span className="text-xs font-semibold text-[#D982A5] tracking-wider uppercase">
                    Photo {activePhotoIndex + 1} of {memories.length}
                  </span>
                  <h4 className="text-2xl font-serif font-bold text-[#2A1722] mt-1">
                    {memories[activePhotoIndex].title}
                  </h4>
                  <p className="font-script text-2xl text-[#75445C] mt-1">
                    {memories[activePhotoIndex].date || 'Forever Loved'}
                  </p>
                  <p className="text-sm text-[#75445C] leading-relaxed mt-4">
                    {memories[activePhotoIndex].caption}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F7C8D9]/60 flex items-center justify-between text-xs text-[#75445C]">
                  <span className="flex items-center gap-1 text-[#D982A5] font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-[#D982A5]" /> Nikhil &amp; Snehuu
                  </span>
                  <span>October 23</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
