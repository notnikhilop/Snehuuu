import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Volume2, VolumeX, Play, Pause, Compass } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

interface CinematicSurpriseProps {
  onReturn: () => void;
}

export const CinematicSurprise: React.FC<CinematicSurpriseProps> = ({ onReturn }) => {
  const config = birthdayContent.cinematicSurprise;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingManual, setIsPlayingManual] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // References for ultra-smooth video scrubbing
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update video currentTime safely without choking the browser decoder
  const updateVideoTime = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoDuration || isPlayingManual) return;

    const diff = Math.abs(video.currentTime - targetTimeRef.current);
    if (diff < 0.04) return;

    if (!isSeekingRef.current) {
      isSeekingRef.current = true;
      const target = Math.max(0, Math.min(videoDuration - 0.05, targetTimeRef.current));
      
      if ('fastSeek' in video && typeof (video as unknown as { fastSeek: (t: number) => void }).fastSeek === 'function') {
        try {
          (video as unknown as { fastSeek: (t: number) => void }).fastSeek(target);
        } catch {
          video.currentTime = target;
        }
      } else {
        video.currentTime = target;
      }
    }
  }, [videoDuration, isPlayingManual]);

  // Video loaded metadata handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setVideoDuration(video.duration);
        setIsVideoLoaded(true);
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      const diff = Math.abs(video.currentTime - targetTimeRef.current);
      if (diff >= 0.04 && !isPlayingManual) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(updateVideoTime);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);

    // Initial check in case video is already cached/loaded
    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateVideoTime, isPlayingManual]);

  // Scroll tracking to calculate normalized 0 -> 1 progress
  useEffect(() => {
    const calculateProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const normalized = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setProgress(normalized);

      if (!isPlayingManual && videoDuration > 0) {
        targetTimeRef.current = normalized * videoDuration;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(updateVideoTime);
      }
    };

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [videoDuration, isPlayingManual, updateVideoTime]);

  // Active milestone finder
  const activeMilestone = config.milestones.find(
    (m) => progress >= m.progressStart && progress <= m.progressEnd
  );

  // Manual playback toggle fallback
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingManual) {
      video.pause();
      setIsPlayingManual(false);
    } else {
      video.play().catch(() => {});
      setIsPlayingManual(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isEnding = progress >= 0.94;
  const isIntro = progress < 0.06;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#140810] text-[#FFF9F5] selection:bg-[#F7C8D9] selection:text-[#75445C] overflow-x-hidden"
      style={{ height: config.scrollDistance || '550vh' }}
    >
      {/* Dreamy Ambient Background Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[15%] left-[20%] w-[38rem] h-[38rem] rounded-full bg-[#D982A5]/15 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[42rem] h-[42rem] rounded-full bg-[#F7C8D9]/12 blur-[140px]" />
        <div className="absolute top-[60%] left-[50%] -translate-x-1/2 w-[35rem] h-[35rem] rounded-full bg-[#75445C]/20 blur-[130px]" />
      </div>

      {/* Sticky Stage: Perfectly centered viewport for Desktop & Mobile */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 md:px-10 py-5 select-none overflow-hidden">
        
        {/* Top Control Header */}
        <header className="w-full max-w-7xl flex items-center justify-between z-40">
          <button
            onClick={onReturn}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white transition-all shadow-md cursor-pointer active:scale-95"
            title="Return to main birthday page"
          >
            <ArrowLeft className="w-4 h-4 text-[#F7C8D9] group-hover:-translate-x-1 transition-transform" />
            <span>Birthday Page</span>
          </button>

          {/* Cinematic Title Pill */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs text-[#F7C8D9] font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />
            <span>Snehuu's Velocity Story</span>
            <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
          </div>

          {/* Progress Indicator & Scrub / Play Mode Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className={`p-2 rounded-full border text-xs transition-all cursor-pointer backdrop-blur-md ${
                isPlayingManual
                  ? 'bg-[#D982A5] text-white border-[#D982A5] shadow-[0_0_15px_rgba(217,130,165,0.6)]'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/20'
              }`}
              title={isPlayingManual ? 'Pause video (Return to scroll mode)' : 'Play video continuously'}
            >
              {isPlayingManual ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 text-xs transition-all cursor-pointer backdrop-blur-md"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#F7C8D9]" />}
            </button>

            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#F7C8D9] tracking-wider min-w-[50px] text-center">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </header>

        {/* =========================================================================
            DESKTOP & TABLET 3-COLUMN LAYOUT (md and up)
           ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-12 w-full max-w-7xl mx-auto flex-1 items-center gap-6 my-auto relative z-20">
          
          {/* LEFT COLUMN: Odd Milestones (1, 3, 5) */}
          <div className="md:col-span-4 flex flex-col items-end justify-center pr-2 lg:pr-6 h-full">
            <AnimatePresence mode="wait">
              {activeMilestone && activeMilestone.side === 'left' && !isEnding && (
                <motion.div
                  key={activeMilestone.id}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -25, y: 15 }}
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -15, y: -15 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full max-w-sm bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl text-right relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D982A5]/20 rounded-bl-full pointer-events-none blur-md" />
                  
                  {activeMilestone.title && (
                    <div className="flex items-center justify-end gap-2 mb-3 text-xs uppercase tracking-widest text-[#F7C8D9] font-semibold">
                      <span>{activeMilestone.title}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />
                    </div>
                  )}

                  <p className="font-serif text-xl lg:text-2xl leading-relaxed text-white font-medium italic">
                    "{activeMilestone.text}"
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-1.5 text-xs text-[#F7C8D9]/70 font-script text-base">
                    <span>Forever Yours</span>
                    <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CENTRE COLUMN: Portrait Velocity Video */}
          <div className="md:col-span-4 flex flex-col items-center justify-center relative">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#D982A5]/35 via-[#F7C8D9]/25 to-[#75445C]/35 rounded-[3rem] blur-2xl pointer-events-none -z-10" />

            {/* Video Container */}
            <div className="relative rounded-[2rem] overflow-hidden border-2 border-white/30 shadow-[0_25px_70px_-15px_rgba(217,130,165,0.45)] bg-black/80 aspect-[9/16] max-h-[75vh] w-auto flex items-center justify-center">
              <video
                ref={videoRef}
                src={config.videoSrc}
                poster={config.posterSrc}
                playsInline
                muted={isMuted}
                preload="auto"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {!isVideoLoaded && (
                <div className="absolute inset-0 bg-[#160B12] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-[#D982A5] border-t-transparent animate-spin mb-4" />
                  <p className="text-xs text-[#F7C8D9] tracking-wider uppercase">Loading Snehuu's Velocity Edit...</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Even Milestones (2, 4, 6) */}
          <div className="md:col-span-4 flex flex-col items-start justify-center pl-2 lg:pl-6 h-full">
            <AnimatePresence mode="wait">
              {activeMilestone && activeMilestone.side === 'right' && !isEnding && (
                <motion.div
                  key={activeMilestone.id}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 25, y: 15 }}
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 15, y: -15 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full max-w-sm bg-gradient-to-bl from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl text-left relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-[#F7C8D9]/20 rounded-br-full pointer-events-none blur-md" />
                  
                  {activeMilestone.title && (
                    <div className="flex items-center justify-start gap-2 mb-3 text-xs uppercase tracking-widest text-[#F7C8D9] font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />
                      <span>{activeMilestone.title}</span>
                    </div>
                  )}

                  <p className="font-serif text-xl lg:text-2xl leading-relaxed text-white font-medium italic">
                    "{activeMilestone.text}"
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-start gap-1.5 text-xs text-[#F7C8D9]/70 font-script text-base">
                    <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
                    <span>My Forever Favourite</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================================
            MOBILE LAYOUT (< md): Vertical Stack with Alternating Top/Bottom Cards
           ========================================================================= */}
        <div className="flex md:hidden flex-col items-center justify-between w-full flex-1 my-auto relative z-20 py-2">
          
          {/* Top Slot (for Left/Odd Milestones: 1, 3, 5) */}
          <div className="w-full min-h-[90px] flex items-center justify-center px-2">
            <AnimatePresence mode="wait">
              {activeMilestone && activeMilestone.side === 'left' && !isEnding && (
                <motion.div
                  key={activeMilestone.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-xs bg-white/15 backdrop-blur-lg border border-white/25 rounded-2xl p-4 shadow-xl text-center"
                >
                  <p className="font-serif text-base sm:text-lg leading-snug text-white font-medium italic">
                    "{activeMilestone.text}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Centered Portrait Video */}
          <div className="relative my-auto flex items-center justify-center">
            <div className="absolute -inset-3 bg-[#D982A5]/30 rounded-[2.5rem] blur-xl pointer-events-none -z-10" />
            <div className="relative rounded-[1.8rem] overflow-hidden border-2 border-white/30 shadow-2xl bg-black/80 aspect-[9/16] max-h-[50vh] sm:max-h-[54vh] w-auto">
              <video
                ref={videoRef}
                src={config.videoSrc}
                poster={config.posterSrc}
                playsInline
                muted={isMuted}
                preload="auto"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Bottom Slot (for Right/Even Milestones: 2, 4, 6) */}
          <div className="w-full min-h-[90px] flex items-center justify-center px-2">
            <AnimatePresence mode="wait">
              {activeMilestone && activeMilestone.side === 'right' && !isEnding && (
                <motion.div
                  key={activeMilestone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-xs bg-white/15 backdrop-blur-lg border border-white/25 rounded-2xl p-4 shadow-xl text-center"
                >
                  <p className="font-serif text-base sm:text-lg leading-snug text-white font-medium italic">
                    "{activeMilestone.text}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Gentle Scroll Invitation (Intro) */}
        <AnimatePresence>
          {isIntro && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center text-center z-30 pb-2 pointer-events-none"
            >
              <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-[#F7C8D9] mb-2 shadow-sm flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#D982A5] animate-spin" style={{ animationDuration: '10s' }} />
                <span>{config.invitationText}</span>
              </div>
              <div className="w-5 h-8 rounded-full border-2 border-white/40 flex justify-center p-1">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 rounded-full bg-[#D982A5]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Ending Card (When user reaches end of scroll) */}
        <AnimatePresence>
          {isEnding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-[#140810]/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center overflow-y-auto"
            >
              {/* Floating Heart Icon with Pulse */}
              <div className="relative mb-6">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#D982A5] to-[#F7C8D9] flex items-center justify-center shadow-[0_0_50px_rgba(217,130,165,0.7)]"
                >
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-white text-white" />
                </motion.div>
                <Sparkles className="w-6 h-6 text-[#FCE7F0] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '8s' }} />
              </div>

              <span className="text-xs uppercase tracking-widest text-[#F7C8D9] font-semibold mb-2">
                October 25 • Forever Yours
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white max-w-2xl leading-tight mb-4 tracking-tight">
                {config.ending.title}
              </h2>

              <p className="text-lg sm:text-2xl text-[#FCE7F0] font-serif italic max-w-xl leading-relaxed mb-8">
                "{config.ending.message}"
              </p>

              <button
                onClick={onReturn}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D982A5] to-[#F7C8D9] hover:from-[#C46D91] hover:to-[#EAAEC3] text-[#2A1722] font-semibold text-sm sm:text-base tracking-wide shadow-xl hover:shadow-[0_0_35px_rgba(217,130,165,0.6)] hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>{config.ending.returnButtonText}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
