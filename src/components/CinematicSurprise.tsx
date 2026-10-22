import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

interface CinematicSurpriseProps {
  onReturn: () => void;
}

export const CinematicSurprise: React.FC<CinematicSurpriseProps> = ({ onReturn }) => {
  const config = birthdayContent.cinematicSurprise;
  const totalFrames = config.totalFrames || 442;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [progress, setProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // In-memory cache for all 442 frames
  const framesCacheRef = useRef<(HTMLImageElement | null)[]>(new Array(totalFrames).fill(null));
  const loadedIndicesRef = useRef<Set<number>>(new Set());
  const requestedIndicesRef = useRef<Set<number>>(new Set());

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Frame URL generator: /frames/frame_0001.jpg -> /frames/frame_0442.jpg
  const getFrameUrl = useCallback((index: number) => {
    const frameNum = String(index + 1).padStart(4, '0');
    return `${config.framePrefix}${frameNum}${config.frameSuffix}`;
  }, [config.framePrefix, config.frameSuffix]);

  // Canvas drawing routine
  const renderFrameToCanvas = useCallback((targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = framesCacheRef.current[targetIndex];

    // If exact target frame isn't loaded yet, find nearest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      if (loadedIndicesRef.current.size > 0) {
        let bestDiff = Infinity;
        let bestIdx = -1;
        for (const loadedIdx of loadedIndicesRef.current) {
          const diff = Math.abs(loadedIdx - targetIndex);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = loadedIdx;
          }
        }
        if (bestIdx !== -1) {
          img = framesCacheRef.current[bestIdx];
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aspect cover calculation
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvas.width / canvas.height;
      let drawW = canvas.width;
      let drawH = canvas.height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawW = canvas.height * imgAspect;
        drawX = (canvas.width - drawW) / 2;
      } else {
        drawH = canvas.width / imgAspect;
        drawY = (canvas.height - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
  }, []);

  // Frame loading helper
  const loadSingleFrame = useCallback((index: number, isPriority = false) => {
    if (index < 0 || index >= totalFrames) return;
    if (requestedIndicesRef.current.has(index)) return;

    requestedIndicesRef.current.add(index);
    const img = new Image();
    if (isPriority) {
      img.fetchPriority = 'high';
    }
    img.src = getFrameUrl(index);
    img.onload = () => {
      framesCacheRef.current[index] = img;
      loadedIndicesRef.current.add(index);

      if (index === 0) {
        setIsFirstFrameReady(true);
      }

      // If this frame corresponds to the active target index, draw it immediately
      if (index === currentFrameIndex) {
        renderFrameToCanvas(index);
      }
    };
  }, [totalFrames, getFrameUrl, currentFrameIndex, renderFrameToCanvas]);

  // Initial load: Preload first frame immediately + initial buffer
  useEffect(() => {
    // Priority load frame 0
    loadSingleFrame(0, true);

    // Initial forward buffer
    for (let i = 1; i <= Math.min(25, totalFrames - 1); i++) {
      loadSingleFrame(i, true);
    }

    // Load keyframes spread across the reel so seeking is instantaneous
    for (let i = 30; i < totalFrames; i += 20) {
      loadSingleFrame(i, false);
    }

    // Background idle loader to progressively fetch the entire reel
    let idleIndex = 26;
    let idleHandle: number;

    const loadNextBatch = () => {
      let count = 0;
      while (idleIndex < totalFrames && count < 8) {
        loadSingleFrame(idleIndex, false);
        idleIndex++;
        count++;
      }

      if (idleIndex < totalFrames) {
        if ('requestIdleCallback' in window) {
          idleHandle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(loadNextBatch);
        } else {
          idleHandle = setTimeout(loadNextBatch, 80) as unknown as number;
        }
      }
    };

    if ('requestIdleCallback' in window) {
      idleHandle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(loadNextBatch);
    } else {
      idleHandle = setTimeout(loadNextBatch, 150) as unknown as number;
    }

    return () => {
      if ('cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleHandle);
      } else {
        clearTimeout(idleHandle);
      }
    };
  }, [loadSingleFrame, totalFrames]);

  // Window resize listener to re-render canvas cleanly
  useEffect(() => {
    const handleResize = () => {
      renderFrameToCanvas(currentFrameIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrameIndex, renderFrameToCanvas]);

  // Scroll handler: Calculate progress and map directly to frame index
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const normalized = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setProgress(normalized);

        // Core formula requested: frameIndex = floor(scrollProgress * (totalFrames - 1))
        const frameIdx = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(normalized * (totalFrames - 1)))
        );

        setCurrentFrameIndex(frameIdx);

        // Prioritize loading frames surrounding the current frame
        for (let offset = -5; offset <= 20; offset++) {
          const target = frameIdx + offset;
          if (target >= 0 && target < totalFrames) {
            loadSingleFrame(target, true);
          }
        }

        renderFrameToCanvas(frameIdx);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [totalFrames, loadSingleFrame, renderFrameToCanvas]);

  // When first frame is ready, draw it
  useEffect(() => {
    if (isFirstFrameReady) {
      renderFrameToCanvas(currentFrameIndex);
    }
  }, [isFirstFrameReady, currentFrameIndex, renderFrameToCanvas]);

  // Active cinematic milestone calculation
  const activeMilestone = config.milestones.find(
    (m) => progress >= m.progressStart && progress <= m.progressEnd
  );

  const isEnding = progress >= 0.97;
  const isIntro = progress < 0.06;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#12070E] text-[#FFF9F5] selection:bg-[#F7C8D9] selection:text-[#75445C] overflow-x-hidden"
      style={{ height: config.scrollDistance || '600vh' }}
    >
      {/* Dreamy Romantic Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[25%] w-[45rem] h-[45rem] rounded-full bg-[#D982A5]/12 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[50rem] h-[50rem] rounded-full bg-[#F7C8D9]/10 blur-[150px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-[#75445C]/18 blur-[120px]" />
      </div>

      {/* STICKY CINEMATIC VIEWPORT */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center px-4 sm:px-8 py-5 select-none overflow-hidden">
        
        {/* Top Minimal Navigation Bar */}
        <header className="w-full max-w-7xl flex items-center justify-between z-40">
          <button
            onClick={onReturn}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white transition-all shadow-md cursor-pointer active:scale-95"
            title="Return to birthday page"
          >
            <ArrowLeft className="w-4 h-4 text-[#F7C8D9] group-hover:-translate-x-1 transition-transform" />
            <span>Birthday Page</span>
          </button>

          {/* Center Title Badge */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs text-[#F7C8D9] font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />
            <span>Snehuu's Velocity Reel</span>
            <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
          </div>

          {/* Progress & Frame Counter Pill */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#F7C8D9] tracking-wider text-center">
              Frame {currentFrameIndex + 1} / {totalFrames}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#F7C8D9] tracking-wider text-center">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </header>

        {/* =========================================================================
            CENTRAL CINEMATIC STAGE: Centered Portrait Canvas + Overlapping Text
           ========================================================================= */}
        <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center my-auto z-20">
          
          {/* Ambient Glow Behind Portrait Animation */}
          <div className="absolute w-[320px] sm:w-[420px] md:w-[460px] h-[550px] sm:h-[680px] bg-gradient-to-tr from-[#D982A5]/30 via-[#F7C8D9]/20 to-[#75445C]/35 rounded-[3rem] blur-3xl pointer-events-none -z-10" />

          {/* Central Portrait Canvas Container */}
          <div className="relative rounded-[2rem] overflow-hidden border-2 border-white/25 shadow-[0_25px_70px_-15px_rgba(217,130,165,0.45)] bg-[#0A0307] aspect-[9/16] h-[64vh] sm:h-[72vh] md:h-[78vh] max-h-[820px] w-auto flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {!isFirstFrameReady && (
              <div className="absolute inset-0 bg-[#12070E] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#D982A5] border-t-transparent animate-spin mb-4" />
                <p className="text-xs text-[#F7C8D9] tracking-widest uppercase">Unfolding Snehuu's dance reel...</p>
              </div>
            )}
          </div>

          {/* =======================================================================
              CINEMATIC TEXT OVERLAYS: LEFT, RIGHT, LEFT, RIGHT
              Partially overlapping the central portrait canvas like cinema subtitles
             ======================================================================= */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
            <AnimatePresence mode="wait">
              {activeMilestone && !isEnding && (
                <motion.div
                  key={activeMilestone.id}
                  initial={
                    reducedMotion
                      ? { opacity: 0 }
                      : activeMilestone.side === 'left'
                      ? { opacity: 0, x: -60, y: 15 }
                      : { opacity: 0, x: 60, y: 15 }
                  }
                  animate={
                    reducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, x: 0, y: 0 }
                  }
                  exit={
                    reducedMotion
                      ? { opacity: 0 }
                      : activeMilestone.side === 'left'
                      ? { opacity: 0, x: -40, y: -15 }
                      : { opacity: 0, x: 40, y: -15 }
                  }
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute w-full px-4 sm:px-8 max-w-6xl flex ${
                    activeMilestone.side === 'left'
                      ? 'justify-start'
                      : 'justify-end'
                  }`}
                >
                  {/* The Glassmorphic Text Card with Soft Backdrop for Flawless Readability */}
                  <div
                    className={`max-w-md sm:max-w-lg lg:max-w-xl p-5 sm:p-7 md:p-8 rounded-3xl backdrop-blur-xl border border-white/25 shadow-2xl ${
                      activeMilestone.side === 'left'
                        ? 'bg-gradient-to-r from-[#140810]/92 via-[#1E0B19]/85 to-[#140810]/60 text-left -ml-2 sm:ml-4 lg:ml-12'
                        : 'bg-gradient-to-l from-[#140810]/92 via-[#1E0B19]/85 to-[#140810]/60 text-right -mr-2 sm:mr-4 lg:mr-12'
                    }`}
                  >
                    {/* Moment Badge */}
                    <div
                      className={`flex items-center gap-2 mb-3 text-xs uppercase tracking-widest text-[#F7C8D9] font-semibold ${
                        activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {activeMilestone.side === 'left' && <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />}
                      <span>{activeMilestone.title}</span>
                      {activeMilestone.side === 'right' && <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />}
                    </div>

                    {/* Romantic Message Text */}
                    <p
                      className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug sm:leading-relaxed text-white font-medium italic drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                      style={{
                        textShadow: '0 0 24px rgba(247,200,217,0.4), 0 2px 10px rgba(0,0,0,0.85)',
                      }}
                    >
                      "{activeMilestone.text}"
                    </p>

                    {/* Footer decoration */}
                    <div
                      className={`mt-4 pt-3 border-t border-white/15 flex items-center gap-1.5 text-xs text-[#F7C8D9]/80 font-script text-base ${
                        activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
                      <span>{activeMilestone.side === 'left' ? 'Forever Yours, Nikhil' : 'My Forever Biwi'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Gentle Scroll Invitation (Visible at top of section) */}
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

        {/* =========================================================================
            FINAL ENDING REVEAL: Exactly reaches final frame 442, then reveals ending
           ========================================================================= */}
        <AnimatePresence>
          {isEnding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-[#12070E]/94 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-6 text-center overflow-y-auto"
            >
              {/* Floating Heart with Pulse */}
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
