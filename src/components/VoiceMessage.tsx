import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Mic, Heart, Radio, RotateCcw } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';
import { useAudioCoordinator } from '../context/AudioCoordinator';

export const VoiceMessage: React.FC = () => {
  const { media, recipient } = birthdayContent;
  const { isVoicePlaying, setVoicePlaying } = useAudioCoordinator();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(90); // default 1:30 for simulation
  const [hasRealAudio, setHasRealAudio] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const simTimerRef = useRef<number | null>(null);

  // If playing, simulate or update audio progress
  useEffect(() => {
    if (isVoicePlaying) {
      if (audioRef.current && hasRealAudio) {
        audioRef.current.play().catch(() => {
          setHasRealAudio(false);
        });
      }

      // Simulated playback progress for demo/placeholder
      simTimerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setVoicePlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
      }
    }

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isVoicePlaying, hasRealAudio, duration, setVoicePlaying]);

  const toggleVoicePlay = () => {
    setVoicePlaying(!isVoicePlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // 36 simulated audio waveform bars
  const waveBars = [
    30, 45, 75, 60, 90, 40, 80, 100, 65, 85, 45, 95, 70, 50, 85, 100, 75, 55,
    90, 80, 60, 95, 85, 40, 70, 90, 55, 65, 80, 100, 70, 50, 40, 60, 35, 20
  ];

  return (
    <section
      id="voice-message-section"
      className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF9F5] via-[#FCE7F0]/30 to-[#FFF9F5] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7C8D9]/50 text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-2">
            <Mic className="w-3.5 h-3.5 text-[#D982A5]" /> Personal Audio Memo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight">
            When You Miss Me
          </h2>
          <p className="text-sm sm:text-base text-[#75445C] mt-2 font-normal">
            Whenever the silence feels too heavy or the distance feels too far, press play and let my voice hold you close.
          </p>
        </div>

        {/* Audio Cassette / Voice Note Player Card */}
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl border border-[#F7C8D9] relative overflow-hidden">
          
          {/* Hidden real audio element */}
          <audio
            ref={audioRef}
            src={media.voiceMessage}
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                if (audioRef.current.duration) {
                  setDuration(audioRef.current.duration);
                }
              }
            }}
            onEnded={() => {
              setVoicePlaying(false);
              setCurrentTime(0);
            }}
            onError={() => {
              setHasRealAudio(false);
            }}
          />

          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Play / Pause Circular Control Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoicePlay}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#75445C] to-[#D982A5] flex items-center justify-center text-white shadow-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F7C8D9] group"
              aria-label={isVoicePlaying ? 'Pause voice message' : 'Play voice message'}
            >
              {isVoicePlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              )}
            </motion.button>

            {/* Track Info & Progress */}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2A1722]">
                    Nikhil's Voice Note for {recipient.name}
                  </h3>
                  <p className="text-xs text-[#75445C]">Recorded with love across the miles</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRestart}
                    title="Restart"
                    className="p-2 text-[#75445C]/60 hover:text-[#75445C] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <Heart className={`w-5 h-5 text-[#D982A5] ${isVoicePlaying ? 'animate-bounce fill-[#D982A5]' : ''}`} />
                </div>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="h-12 flex items-center justify-between gap-1 my-4 px-2 py-1 bg-[#FFF9F5] rounded-xl border border-[#F7C8D9]/40">
                {waveBars.map((height, idx) => {
                  const progressPct = (currentTime / duration) * 100;
                  const barPct = (idx / waveBars.length) * 100;
                  const isPassed = barPct <= progressPct;

                  return (
                    <motion.div
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPassed ? 'bg-[#D982A5]' : 'bg-[#F7C8D9]/70'
                      }`}
                      style={{
                        height: isVoicePlaying
                          ? `${Math.max(15, (height * (Math.sin(idx + currentTime * 2) * 0.4 + 0.6)))}%`
                          : `${height * 0.6}%`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Timeline bar & counters */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#75445C]">
                <span>{formatTime(currentTime)}</span>
                <span className="text-[11px] font-normal text-[#D982A5]">
                  {isVoicePlaying ? 'Playing intimate note...' : 'Tap play to listen'}
                </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

          </div>

          {/* User note on voice recording */}
          <div className="mt-6 pt-4 border-t border-[#F7C8D9]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#75445C]/80 gap-2">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#D982A5]" />
              Voice memo file: <code className="bg-[#FFF9F5] px-2 py-0.5 rounded-sm border border-[#F7C8D9]">public/audio/voice-message.mp3</code>
            </span>
            <span className="text-[11px] text-[#D982A5]">Automatically pauses background music while playing</span>
          </div>

        </div>

      </div>
    </section>
  );
};
