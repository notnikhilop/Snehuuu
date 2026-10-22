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

  // Full-bleed responsive canvas drawing routine
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

    if (!img || !img.complete || img.naturalWidth === 0) return;

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
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH; // 0.5625 (9:16)
    const canvasAspect = cW / cH;

    ctx.clearRect(0, 0, cW, cH);

    // =========================================================================
    // MOBILE / PORTRAIT SCREENS (canvasAspect <= 0.75)
    // Direct full-bleed cover filling the entire phone screen seamlessly
    // =========================================================================
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
        // Bias slightly upwards so face/headroom is protected on tall mobile screens
        drawY = (cH - drawH) * 0.35;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      // =======================================================================
      // DESKTOP & WIDESCREEN LAPTOPS (GTA VI Style Full-Screen Cinematic Canvas)
      // 1. Ambient blurred motion background covering 100vw x 100vh
      // 2. Center hero portrait frame scaled to full viewport height
      // =======================================================================
      
      // 1. Ambient Background Layer (Full-Bleed Cover + Soft Cinematic Glow)
      ctx.save();
      ctx.filter = 'blur(35px) brightness(0.32) saturate(1.35)';
      let bgW = cW;
      let bgH = cW / imgAspect;
      let bgX = 0;
      let bgY = (cH - bgH) / 2;
      ctx.drawImage(img, bgX, bgY, bgW, bgH);
      ctx.restore();

      // 2. Cinematic Vignette Gradient over ambient layer
      const radialGrad = ctx.createRadialGradient(
        cW / 2, cH / 2, cH * 0.25,
        cW / 2, cH / 2, cW * 0.65
      );
      radialGrad.addColorStop(0, 'rgba(18, 7, 14, 0.15)');
      radialGrad.addColorStop(0.7, 'rgba(18, 7, 14, 0.7)');
      radialGrad.addColorStop(1, 'rgba(18, 7, 14, 0.95)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, cW, cH);

      // 3. Hero Visual Stage (Crisp Portrait Frame Filling Viewport Height)
      // Height fills 100% of viewport with a subtle grand scale (1.02x)
      const fgH = cH * 1.02;
      const fgW = fgH * imgAspect;
      const fgX = (cW - fgW) / 2;
      const fgY = (cH - fgH) / 2;

      ctx.save();
      // Soft ambient drop-shadow around the central subject
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 45 * dpr;
      ctx.drawImage(img, fgX, fgY, fgW, fgH);
      ctx.restore();
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

  // Initial load: Preload first frame immediately + buffer
  useEffect(() => {
    // Priority load frame 0
    loadSingleFrame(0, true);

    // Initial forward buffer
    for (let i = 1; i <= Math.min(25, totalFrames - 1); i++) {
      loadSingleFrame(i, true);
    }

    // Load keyframes spread across the reel for instant seeking
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

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      renderFrameToCanvas(currentFrameIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrameIndex, renderFrameToCanvas]);

  // Scroll handler: Maps window scroll directly to normalized progress and frame index
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

        // Core formula: frameIndex = floor(scrollProgress * (totalFrames - 1))
        const frameIdx = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(normalized * (totalFrames - 1)))
        );

        setCurrentFrameIndex(frameIdx);

        // Prioritize loading frames surrounding the current frame
        for (let offset = -6; offset <= 24; offset++) {
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

  // Draw first frame when ready
  useEffect(() => {
    if (isFirstFrameReady) {
      renderFrameToCanvas(currentFrameIndex);
    }
  }, [isFirstFrameReady, currentFrameIndex, renderFrameToCanvas]);

  // Active cinematic milestone
  const activeMilestone = config.milestones.find(
    (m) => progress >= m.progressStart && progress <= m.progressEnd
  );

  const isEnding = progress >= 0.95;
  const isIntro = progress < 0.06;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#12070E] text-[#FFF9F5] selection:bg-[#F7C8D9] selection:text-[#75445C] overflow-x-hidden"
      style={{ height: config.scrollDistance || '600vh' }}
    >
      {/* =========================================================================
          FULL-SCREEN FIXED CINEMATIC STAGE (100vw x 100svh / 100vh)
          The canvas fills the entire viewport and remains locked during scroll.
          Zero small cards, zero black boxes, zero blank areas.
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

          {/* Center Title */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-xl border border-white/15 text-xs text-[#F7C8D9] font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />
            <span>Snehuu's Cinematic Reel</span>
            <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
          </div>

          {/* Progress & Frame Counter */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-[11px] font-semibold text-[#F7C8D9] tracking-wider text-center">
              Frame {currentFrameIndex + 1} / {totalFrames}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-[11px] font-semibold text-[#F7C8D9] tracking-wider text-center">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </header>

        {/* =========================================================================
            CINEMATIC TEXT OVERLAYS: LEFT <-> RIGHT (GTA VI Style)
            Rendered directly over the moving frames with film title typography
           ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30 px-4 sm:px-8 md:px-16 lg:px-24">
          <AnimatePresence mode="wait">
            {activeMilestone && !isEnding && (
              <motion.div
                key={activeMilestone.id}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : activeMilestone.side === 'left'
                    ? { opacity: 0, x: -70 }
                    : { opacity: 0, x: 70 }
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
                    ? { opacity: 0, x: -50 }
                    : { opacity: 0, x: 50 }
                }
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-7xl flex ${
                  activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Cinema Overlay Container: Overlaps the visual with grand typography */}
                <div
                  className={`max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 md:p-10 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] ${
                    activeMilestone.side === 'left'
                      ? 'bg-gradient-to-r from-black/85 via-black/70 to-transparent text-left'
                      : 'bg-gradient-to-l from-black/85 via-black/70 to-transparent text-right'
                  }`}
                >
                  {/* Moment Subtitle */}
                  <div
                    className={`flex items-center gap-2 mb-3 text-xs uppercase tracking-widest text-[#F7C8D9] font-semibold ${
                      activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {activeMilestone.side === 'left' && <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />}
                    <span>{activeMilestone.title}</span>
                    {activeMilestone.side === 'right' && <Sparkles className="w-3.5 h-3.5 text-[#D982A5]" />}
                  </div>

                  {/* Large Cinematic Title */}
                  <h2
                    className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight"
                    style={{
                      textShadow: '0 0 35px rgba(247,200,217,0.45), 0 4px 16px rgba(0,0,0,0.95)',
                    }}
                  >
                    "{activeMilestone.text}"
                  </h2>

                  {/* Elegant Signature Stamp */}
                  <div
                    className={`mt-5 pt-3 border-t border-white/15 flex items-center gap-2 text-xs text-[#F7C8D9]/90 font-script text-lg ${
                      activeMilestone.side === 'left' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-[#D982A5] fill-[#D982A5]" />
                    <span>{activeMilestone.side === 'left' ? 'Forever Yours, Nikhil' : 'My Forever Biwi'}</span>
                  </div>
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
