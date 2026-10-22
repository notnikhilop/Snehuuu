import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

interface CinematicSurpriseProps {
  onReturn: () => void;
}

export const CinematicSurprise: React.FC<CinematicSurpriseProps> = ({ onReturn }) => {
  const config = birthdayContent.cinematicSurprise;
  const openingConfig = config.openingSequence || {
    totalFrames: 344,
    framePrefix: '/frames-one/frame_',
    frameSuffix: '.jpg',
  };
  const mainConfig = config.mainSequence || {
    totalFrames: 442,
    framePrefix: '/frames/frame_',
    frameSuffix: '.jpg',
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState<'opening' | 'transition' | 'main'>('opening');
  const [frameIndexOne, setFrameIndexOne] = useState(0);
  const [frameIndexTwo, setFrameIndexTwo] = useState(0);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // In-memory caches for both sequences
  const cacheOneRef = useRef<(HTMLImageElement | null)[]>(new Array(openingConfig.totalFrames).fill(null));
  const cacheTwoRef = useRef<(HTMLImageElement | null)[]>(new Array(mainConfig.totalFrames).fill(null));
  const requestedOneRef = useRef<Set<number>>(new Set());
  const requestedTwoRef = useRef<Set<number>>(new Set());
  const loadedOneRef = useRef<Set<number>>(new Set());
  const loadedTwoRef = useRef<Set<number>>(new Set());

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Frame URL helpers
  const getFrameOneUrl = useCallback((index: number) => {
    const num = String(index + 1).padStart(4, '0');
    return `${openingConfig.framePrefix}${num}${openingConfig.frameSuffix}`;
  }, [openingConfig]);

  const getFrameTwoUrl = useCallback((index: number) => {
    const num = String(index + 1).padStart(4, '0');
    return `${mainConfig.framePrefix}${num}${mainConfig.frameSuffix}`;
  }, [mainConfig]);

  // Frame load helpers
  const loadFrameOne = useCallback((index: number, isPriority = false) => {
    if (index < 0 || index >= openingConfig.totalFrames) return;
    if (requestedOneRef.current.has(index)) return;

    requestedOneRef.current.add(index);
    const img = new Image();
    if (isPriority) img.fetchPriority = 'high';
    img.src = getFrameOneUrl(index);
    img.onload = () => {
      cacheOneRef.current[index] = img;
      loadedOneRef.current.add(index);
      if (index === 0) setIsFirstFrameReady(true);
    };
  }, [openingConfig.totalFrames, getFrameOneUrl]);

  const loadFrameTwo = useCallback((index: number, isPriority = false) => {
    if (index < 0 || index >= mainConfig.totalFrames) return;
    if (requestedTwoRef.current.has(index)) return;

    requestedTwoRef.current.add(index);
    const img = new Image();
    if (isPriority) img.fetchPriority = 'high';
    img.src = getFrameTwoUrl(index);
    img.onload = () => {
      cacheTwoRef.current[index] = img;
      loadedTwoRef.current.add(index);
    };
  }, [mainConfig.totalFrames, getFrameTwoUrl]);

  // Preloading & initial buffer
  useEffect(() => {
    // Priority load frame 0 of Sequence 1
    loadFrameOne(0, true);
    for (let i = 1; i <= Math.min(30, openingConfig.totalFrames - 1); i++) {
      loadFrameOne(i, true);
    }
    // Also preload frame 0 of Sequence 2 in background for seamless crossfade
    loadFrameTwo(0, false);
    loadFrameTwo(1, false);

    // Idle batch loader for Sequence 1
    let idleIndex = 31;
    let idleHandle: number;
    const loadNextBatch = () => {
      let count = 0;
      while (idleIndex < openingConfig.totalFrames && count < 8) {
        loadFrameOne(idleIndex, false);
        idleIndex++;
        count++;
      }
      if (idleIndex < openingConfig.totalFrames) {
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
  }, [loadFrameOne, loadFrameTwo, openingConfig.totalFrames]);

  // Initial 1-Second Automatic Scroll: only runs once on initial open
  useEffect(() => {
    const hasAutoScrolled = sessionStorage.getItem('snehuu_auto_scrolled_v3');
    if (hasAutoScrolled) return;

    let isCancelled = false;
    let rafId: number | null = null;

    const cancelAutoScroll = () => {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      sessionStorage.setItem('snehuu_auto_scrolled_v3', 'true');
    };

    window.addEventListener('wheel', cancelAutoScroll, { passive: true, once: true });
    window.addEventListener('touchstart', cancelAutoScroll, { passive: true, once: true });
    window.addEventListener('pointerdown', cancelAutoScroll, { passive: true, once: true });
    window.addEventListener('keydown', cancelAutoScroll, { passive: true, once: true });

    // Begin gentle auto-scroll after a 300ms pause on frame 1
    const timer = setTimeout(() => {
      if (isCancelled || !containerRef.current) return;
      const startY = window.scrollY;
      const targetDelta = Math.min(window.innerHeight * 0.9, 700);
      const targetY = startY + targetDelta;
      const duration = 1000; // approximately 1 second
      const startTime = performance.now();

      const animateScroll = (now: number) => {
        if (isCancelled) return;
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        // Smooth easeInOutQuad
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        window.scrollTo(0, startY + (targetY - startY) * ease);

        if (t < 1) {
          rafId = requestAnimationFrame(animateScroll);
        } else {
          sessionStorage.setItem('snehuu_auto_scrolled_v3', 'true');
        }
      };

      rafId = requestAnimationFrame(animateScroll);
    }, 350);

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', cancelAutoScroll);
      window.removeEventListener('touchstart', cancelAutoScroll);
      window.removeEventListener('pointerdown', cancelAutoScroll);
      window.removeEventListener('keydown', cancelAutoScroll);
    };
  }, []);

  // Helper to draw an image to canvas with cover/desktop-bleed
  const drawImageOnCanvas = useCallback((
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cW: number,
    cH: number,
    dpr: number,
    alpha = 1
  ) => {
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const canvasAspect = cW / cH;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Mobile / Portrait
    if (canvasAspect <= 0.75) {
      let drawW: number;
      let drawH: number;
      let drawX: number;
      let drawY: number;

      if (imgAspect > canvasAspect) {
        drawH = cH;
        drawW = cH * imgAspect;
        drawX = (cW - drawW) / 2;
        drawY = 0;
      } else {
        drawW = cW;
        drawH = cW / imgAspect;
        drawX = 0;
        drawY = (cH - drawH) * 0.35;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      // Desktop: Ambient motion background + Centered full-height hero
      ctx.save();
      ctx.filter = 'blur(35px) brightness(0.32) saturate(1.35)';
      const bgW = cW;
      const bgH = cW / imgAspect;
      const bgX = 0;
      const bgY = (cH - bgH) / 2;
      ctx.drawImage(img, bgX, bgY, bgW, bgH);
      ctx.restore();

      // Cinematic Vignette
      const radialGrad = ctx.createRadialGradient(
        cW / 2, cH / 2, cH * 0.25,
        cW / 2, cH / 2, cW * 0.65
      );
      radialGrad.addColorStop(0, 'rgba(18, 7, 14, 0.15)');
      radialGrad.addColorStop(0.7, 'rgba(18, 7, 14, 0.7)');
      radialGrad.addColorStop(1, 'rgba(18, 7, 14, 0.95)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, cW, cH);

      // Hero Frame
      const fgH = cH * 1.02;
      const fgW = fgH * imgAspect;
      const fgX = (cW - fgW) / 2;
      const fgY = (cH - fgH) / 2;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 45 * dpr;
      ctx.drawImage(img, fgX, fgY, fgW, fgH);
      ctx.restore();
    }

    ctx.restore();
  }, []);

  // Main Canvas Render
  const renderCanvas = useCallback((
    stage: 'opening' | 'transition' | 'main',
    idxOne: number,
    idxTwo: number,
    transitionRatio = 0
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const targetW = Math.round(winW * dpr);
    const targetH = Math.round(winH * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const cW = canvas.width;
    const cH = canvas.height;
    ctx.clearRect(0, 0, cW, cH);

    // Sequence 1 Image
    let imgOne = cacheOneRef.current[idxOne];
    if (!imgOne || !imgOne.complete || imgOne.naturalWidth === 0) {
      for (const loaded of loadedOneRef.current) {
        imgOne = cacheOneRef.current[loaded];
        break;
      }
    }

    // Sequence 2 Image
    let imgTwo = cacheTwoRef.current[idxTwo];
    if (!imgTwo || !imgTwo.complete || imgTwo.naturalWidth === 0) {
      for (const loaded of loadedTwoRef.current) {
        imgTwo = cacheTwoRef.current[loaded];
        break;
      }
    }

    if (stage === 'opening' && imgOne && imgOne.complete && imgOne.naturalWidth > 0) {
      drawImageOnCanvas(ctx, imgOne, cW, cH, dpr, 1);
    } else if (stage === 'main' && imgTwo && imgTwo.complete && imgTwo.naturalWidth > 0) {
      drawImageOnCanvas(ctx, imgTwo, cW, cH, dpr, 1);
    } else if (stage === 'transition') {
      // Smooth cinematic crossfade between the final frame of Sequence 1 and first frame of Sequence 2
      if (imgOne && imgOne.complete && imgOne.naturalWidth > 0) {
        drawImageOnCanvas(ctx, imgOne, cW, cH, dpr, Math.max(0, 1 - transitionRatio));
      }
      if (imgTwo && imgTwo.complete && imgTwo.naturalWidth > 0) {
        drawImageOnCanvas(ctx, imgTwo, cW, cH, dpr, Math.min(1, transitionRatio));
      }
    }
  }, [drawImageOnCanvas]);

  // Scroll Handler: Progress calculation, stage mapping, and frame synchronization
  useEffect(() => {
    let rafId: number | null = null;
    const SPLIT = 0.40; // 40% scroll runway for Frame One, 60% for Frames
    const TRANS_WINDOW = 0.025; // 2.5% crossfade window

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

        if (normalized < SPLIT - TRANS_WINDOW) {
          // =================================================================
          // STAGE 1: Frame One (344 frames)
          // =================================================================
          setActiveStage('opening');
          const p1 = normalized / (SPLIT - TRANS_WINDOW);
          const idx1 = Math.min(
            openingConfig.totalFrames - 1,
            Math.max(0, Math.floor(p1 * (openingConfig.totalFrames - 1)))
          );
          setFrameIndexOne(idx1);

          // Priority buffer for Frame One
          for (let o = -5; o <= 20; o++) {
            const target = idx1 + o;
            if (target >= 0 && target < openingConfig.totalFrames) {
              loadFrameOne(target, true);
            }
          }

          // Preload start of Sequence 2 when approaching transition
          if (p1 > 0.7) {
            loadFrameTwo(0, true);
            loadFrameTwo(1, true);
            loadFrameTwo(2, true);
          }

          renderCanvas('opening', idx1, 0, 0);
        } else if (normalized <= SPLIT + TRANS_WINDOW) {
          // =================================================================
          // TRANSITION: Subtle crossfade between Sequence 1 and Sequence 2
          // =================================================================
          setActiveStage('transition');
          const tRatio = (normalized - (SPLIT - TRANS_WINDOW)) / (TRANS_WINDOW * 2);
          const idx1 = openingConfig.totalFrames - 1;
          const idx2 = 0;
          setFrameIndexOne(idx1);
          setFrameIndexTwo(idx2);

          loadFrameOne(idx1, true);
          loadFrameTwo(0, true);
          loadFrameTwo(1, true);

          renderCanvas('transition', idx1, idx2, tRatio);
        } else {
          // =================================================================
          // STAGE 2: Frames (442 frames)
          // =================================================================
          setActiveStage('main');
          const p2 = (normalized - (SPLIT + TRANS_WINDOW)) / (1 - (SPLIT + TRANS_WINDOW));
          const idx2 = Math.min(
            mainConfig.totalFrames - 1,
            Math.max(0, Math.floor(p2 * (mainConfig.totalFrames - 1)))
          );
          setFrameIndexTwo(idx2);

          // Priority buffer for Frames
          for (let o = -5; o <= 22; o++) {
            const target = idx2 + o;
            if (target >= 0 && target < mainConfig.totalFrames) {
              loadFrameTwo(target, true);
            }
          }

          renderCanvas('main', openingConfig.totalFrames - 1, idx2, 1);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [openingConfig.totalFrames, mainConfig.totalFrames, loadFrameOne, loadFrameTwo, renderCanvas]);

  // Redraw on resize
  useEffect(() => {
    const handleResize = () => {
      renderCanvas(activeStage, frameIndexOne, frameIndexTwo);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeStage, frameIndexOne, frameIndexTwo, renderCanvas]);

  // Initial render when first frame is ready
  useEffect(() => {
    if (isFirstFrameReady) {
      renderCanvas('opening', 0, 0, 0);
    }
  }, [isFirstFrameReady, renderCanvas]);

  // Stage 2 Progress for the 6 cinematic milestones
  const SPLIT_MAIN = 0.425;
  const mainProgress = progress > SPLIT_MAIN
    ? Math.max(0, Math.min(1, (progress - SPLIT_MAIN) / (1 - SPLIT_MAIN)))
    : 0;

  // Active milestone for Sequence 2 ONLY (No text overlays in Sequence 1!)
  const activeMilestone = activeStage === 'main'
    ? config.milestones.find((m) => mainProgress >= m.progressStart && mainProgress <= m.progressEnd)
    : null;

  const isEnding = activeStage === 'main' && mainProgress >= 0.95;
  const isIntro = progress < 0.04;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#12070E] text-[#FFF9F5] selection:bg-[#F7C8D9] selection:text-[#75445C] overflow-x-hidden"
      style={{ height: config.scrollDistance || '850vh' }}
    >
      {/* =========================================================================
          FULL-SCREEN FIXED CINEMATIC STAGE (100vw x 100svh / 100vh)
          The canvas fills the entire viewport and remains locked during scroll.
         ========================================================================= */}
      <div className="fixed inset-0 w-screen h-screen h-[100svh] overflow-hidden z-10 select-none">
        
        {/* Fullscreen Canvas Renderer */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-cover"
        />

        {/* First Frame Loading Shimmer */}
        {!isFirstFrameReady && (
          <div className="absolute inset-0 bg-[#12070E] flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-12 h-12 rounded-full border-2 border-[#D982A5] border-t-transparent animate-spin mb-4" />
            <p className="text-xs text-[#F7C8D9] tracking-widest uppercase">Opening Snehuu's Cinematic Reel...</p>
          </div>
        )}

        {/* Ambient Top & Bottom Film Edge Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#12070E]/70 via-transparent to-[#12070E]/80" />

        {/* Minimal Floating Top Header */}
        <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex items-center justify-between z-40 pointer-events-auto">
          <button
            onClick={onReturn}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 text-xs sm:text-sm font-medium text-white transition-all shadow-xl cursor-pointer active:scale-95"
            title="Return to birthday page"
          >
            <ArrowLeft className="w-4 h-4 text-[#F7C8D9] group-hover:-translate-x-1 transition-transform" />
            <span>Birthday Page</span>
          </button>

          {/* Sequence Indicator Title */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-xl border border-white/15 text-xs text-[#F7C8D9] font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />
            <span>{activeStage === 'opening' ? "Snehuu's Melody Opening" : "Snehuu's Dance Reel"}</span>
            <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
          </div>

          {/* Progress & Frame Counter */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-[11px] font-semibold text-[#F7C8D9] tracking-wider text-center">
              {activeStage === 'opening'
                ? `Act I • ${frameIndexOne + 1} / ${openingConfig.totalFrames}`
                : activeStage === 'transition'
                ? '✦ Crossfade'
                : `Act II • ${frameIndexTwo + 1} / ${mainConfig.totalFrames}`}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-[11px] font-semibold text-[#F7C8D9] tracking-wider text-center">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </header>

        {/* =========================================================================
            CINEMATIC TEXT OVERLAYS: LEFT <-> RIGHT (Sequence 2 ONLY)
            Positioned in lower viewport (70-78% height), completely transparent
            No text overlays are rendered during Sequence 1 (Frame One).
           ========================================================================= */}
        <div className="absolute inset-x-0 bottom-[18vh] sm:bottom-[20vh] pointer-events-none z-30 px-6 sm:px-12 md:px-16 lg:px-24">
          <AnimatePresence mode="wait">
            {activeMilestone && !isEnding && (
              <motion.div
                key={activeMilestone.id}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : activeMilestone.side === 'left'
                    ? { opacity: 0, x: -35 }
                    : { opacity: 0, x: 35 }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, x: 0 }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : activeMilestone.side === 'left'
                    ? { opacity: 0, x: -25 }
                    : { opacity: 0, x: 25 }
                }
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-7xl mx-auto flex ${
                  activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Pure Transparent Typography Container (25-35% viewport width on desktop, 320-420px max) */}
                <div
                  className={`w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] bg-transparent p-0 m-0 border-0 shadow-none ${
                    activeMilestone.side === 'left' ? 'text-left' : 'text-right'
                  }`}
                >
                  {/* Moment Subtitle Label */}
                  <div
                    className={`flex items-center gap-1.5 mb-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#F7C8D9]/90 font-medium ${
                      activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                    }`}
                    style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.9)' }}
                  >
                    {activeMilestone.side === 'left' && <Sparkles className="w-3 h-3 text-[#D982A5]" />}
                    <span>{activeMilestone.title}</span>
                    {activeMilestone.side === 'right' && <Sparkles className="w-3 h-3 text-[#D982A5]" />}
                  </div>

                  {/* Refined Cinematic Serif Message */}
                  <h2
                    className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-semibold text-[#FFF9F5] leading-snug tracking-tight"
                    style={{
                      textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 24px rgba(247, 200, 217, 0.35)',
                    }}
                  >
                    "{activeMilestone.text}"
                  </h2>

                  {/* Minimal Supporting Romantic Label */}
                  <p
                    className={`mt-2 flex items-center gap-1.5 text-xs text-[#F7C8D9]/80 font-script text-base ${
                      activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                    }`}
                    style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.9)' }}
                  >
                    <Heart className="w-2.5 h-2.5 text-[#D982A5] fill-[#D982A5]" />
                    <span>{activeMilestone.side === 'left' ? 'Forever Yours, Nikhil' : 'My Forever Biwi'}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gentle Scroll Invitation (Only at start) */}
        <AnimatePresence>
          {isIntro && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center text-center z-30 pointer-events-none"
            >
              <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-xs sm:text-sm font-medium text-[#F7C8D9] mb-2 shadow-lg flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D982A5] animate-spin" style={{ animationDuration: '10s' }} />
                <span>{config.invitationText}</span>
              </div>
              <div className="w-5 h-8 rounded-full border-2 border-white/50 flex justify-center p-1">
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
            FINAL ENDING REVEAL: Reaches Final Frame 442, Smoothly Overlays Screen
           ========================================================================= */}
        <AnimatePresence>
          {isEnding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-[#12070E]/92 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-6 text-center overflow-y-auto pointer-events-auto"
            >
              {/* Floating Glowing Heart */}
              <div className="relative mb-6">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#D982A5] to-[#F7C8D9] flex items-center justify-center shadow-[0_0_55px_rgba(217,130,165,0.7)]"
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
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D982A5] to-[#F7C8D9] hover:from-[#C46D91] hover:to-[#EAAEC3] text-[#2A1722] font-semibold text-sm sm:text-base tracking-wide shadow-2xl hover:shadow-[0_0_40px_rgba(217,130,165,0.6)] hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
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
