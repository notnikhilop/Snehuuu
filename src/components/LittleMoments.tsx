import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';
import { useAudioCoordinator } from '../context/AudioCoordinator';

export const LittleMoments: React.FC = () => {
  const { videos } = birthdayContent;
  const { setVideoSoundActive } = useAudioCoordinator();

  return (
    <section
      id="videos-section"
      className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF9F5] via-[#FCE7F0]/25 to-[#FFF9F5] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7C8D9]/50 text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5 text-[#D982A5]" /> Little Moments
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight">
            Memories in Motion
          </h2>
          <p className="text-sm sm:text-base text-[#75445C] mt-2 font-normal">
            Short clips of your smiles and our favorite memories. Autoplays silently as you scroll, with sound under your control.
          </p>
        </div>

        {/* Video Clips Grid with adaptive aspect ratios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {videos.map((vid) => (
            <SingleVideoCard
              key={vid.id}
              videoItem={vid}
              onAudioStateChange={(isAudible) => setVideoSoundActive(isAudible)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

interface SingleVideoCardProps {
  videoItem: {
    id: string;
    title: string;
    caption: string;
    video: string;
    poster?: string;
  };
  onAudioStateChange: (isAudible: boolean) => void;
}

const SingleVideoCard: React.FC<SingleVideoCardProps> = ({ videoItem, onAudioStateChange }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Viewport intersection observer: autoplay silently when in view, pause when out of view
  useEffect(() => {
    const videoEl = videoRef.current;
    const container = containerRef.current;
    if (!videoEl || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Autoplay silently in viewport
            videoEl.muted = isMuted;
            videoEl.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              // Browser prevented autoplay
            });
          } else {
            // Pause when out of view
            videoEl.pause();
            setIsPlaying(false);
            onAudioStateChange(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isMuted, onAudioStateChange]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted && isPlaying) {
        onAudioStateChange(true);
      } else {
        onAudioStateChange(false);
      }
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = isMuted;
      video.play().then(() => {
        setIsPlaying(true);
        if (!isMuted) onAudioStateChange(true);
      });
    } else {
      video.pause();
      setIsPlaying(false);
      onAudioStateChange(false);
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as unknown as { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
      (video as unknown as { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  };

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight) {
      setAspectRatio(v.videoWidth / v.videoHeight);
    }
  };

  // Determine whether video is portrait, square, or landscape
  const isLandscape = aspectRatio ? aspectRatio > 1.25 : false;
  const isPortrait = aspectRatio ? aspectRatio < 0.85 : true; // Default to portrait (reels/smartphone)

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-[#F7C8D9] flex flex-col justify-between overflow-hidden group ${
        isLandscape ? 'md:col-span-2' : ''
      }`}
    >
      {/* Video Container with adapted aspect ratio */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden bg-[#160B12] mb-4 flex items-center justify-center ${
          isLandscape
            ? 'aspect-[16/9]'
            : isPortrait
            ? 'aspect-[9/16] max-h-[540px]'
            : 'aspect-[3/4] max-h-[500px]'
        }`}
      >
        {!hasError ? (
          <>
            {/* Ambient blurred backdrop so letterboxing has a soft dreamy glow */}
            {videoItem.poster && (
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-35 transform scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${videoItem.poster})` }}
              />
            )}

            <video
              ref={videoRef}
              src={videoItem.video}
              poster={videoItem.poster}
              loop
              playsInline
              muted={isMuted}
              preload="metadata"
              onLoadedMetadata={handleMetadata}
              onPlay={() => {
                setIsPlaying(true);
                if (!isMuted) onAudioStateChange(true);
              }}
              onPause={() => {
                setIsPlaying(false);
                onAudioStateChange(false);
              }}
              onError={() => {
                setHasError(true);
              }}
              className="relative z-10 w-full h-full object-contain"
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FCE7F0]/40">
            <Video className="w-10 h-10 text-[#D982A5] mb-2" />
            <h4 className="font-serif font-bold text-[#2A1722] text-base">{videoItem.title}</h4>
            <p className="text-xs text-[#75445C] mt-1">
              Video source: <code className="bg-white/80 px-1.5 py-0.5 rounded text-[11px]">{videoItem.video}</code>
            </p>
          </div>
        )}

        {/* Clear Mute / Unmute Button Overlay */}
        {!hasError && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-md transition-all cursor-pointer ${
                isMuted
                  ? 'bg-black/65 hover:bg-black/85 text-white'
                  : 'bg-[#D982A5] hover:bg-[#c97194] text-white shadow-[#D982A5]/50 scale-105'
              }`}
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Sound On</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Bottom Quick Controls: Play/Pause and Fullscreen */}
        {!hasError && (
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <button
              onClick={togglePlay}
              className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
            </button>

            <button
              onClick={handleFullscreen}
              className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
              aria-label="View fullscreen"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Video Caption & Info */}
      <div className="px-2 pt-1">
        <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2A1722] mb-1">
          {videoItem.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#75445C] leading-relaxed">
          {videoItem.caption}
        </p>
      </div>
    </motion.div>
  );
};
