import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface AudioContextType {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
  isVoicePlaying: boolean;
  setVoicePlaying: (playing: boolean) => void;
  isVideoSoundActive: boolean;
  setVideoSoundActive: (active: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVideoSoundActive, setIsVideoSoundActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<number | null>(null);

  // Stop background music if voice message or unmuted video plays
  useEffect(() => {
    if (isVoicePlaying || isVideoSoundActive) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      stopSynthMelody();
      setIsMusicPlaying(false);
    }
  }, [isVoicePlaying, isVideoSoundActive]);

  // Gentle romantic piano arpeggio synthesizer (royalty-free Web Audio fallback)
  const startSynthMelody = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [
        293.66, 349.23, 440.0, 523.25, // Dm
        349.23, 440.0, 523.25, 587.33,
        261.63, 329.63, 392.0, 523.25, // C
        329.63, 392.0, 523.25, 659.25,
        246.94, 293.66, 349.23, 440.0, // Bb
        220.0, 277.18, 329.63, 440.0   // A
      ];
      let step = 0;

      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
      }

      oscillatorIntervalRef.current = window.setInterval(() => {
        if (!audioContextRef.current || audioContextRef.current.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.25);

        step++;
      }, 550);
    } catch {
      // Ignored if audio context not permitted
    }
  }, []);

  const stopSynthMelody = useCallback(() => {
    if (oscillatorIntervalRef.current) {
      clearInterval(oscillatorIntervalRef.current);
      oscillatorIntervalRef.current = null;
    }
  }, []);

  const playMusic = useCallback(() => {
    setIsVoicePlaying(false);
    setIsVideoSoundActive(false);
    setIsMusicPlaying(true);

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        stopSynthMelody();
      }).catch(() => {
        // Fallback to synthesized melody
        startSynthMelody();
      });
    } else {
      startSynthMelody();
    }
  }, [startSynthMelody, stopSynthMelody]);

  const pauseMusic = useCallback(() => {
    setIsMusicPlaying(false);
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    stopSynthMelody();
  }, [stopSynthMelody]);

  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isMusicPlaying, pauseMusic, playMusic]);

  // Attempt autoplay on mount; if blocked by browser, start on first user interaction
  useEffect(() => {
    // Create audio element for love-story.mp3
    const audio = new Audio('/audio/love-story.mp3');
    audio.loop = true;
    audioRef.current = audio;

    let hasInteracted = false;
    const triggerAudioOnFirstInteraction = () => {
      if (hasInteracted) return;
      hasInteracted = true;
      playMusic();
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', triggerAudioOnFirstInteraction);
      window.removeEventListener('touchstart', triggerAudioOnFirstInteraction);
      window.removeEventListener('keydown', triggerAudioOnFirstInteraction);
      window.removeEventListener('scroll', triggerAudioOnFirstInteraction);
    };

    // Try initial autoplay
    audio.play().then(() => {
      setIsMusicPlaying(true);
    }).catch(() => {
      // Autoplay blocked by browser policy without user gesture
      window.addEventListener('pointerdown', triggerAudioOnFirstInteraction, { once: true });
      window.addEventListener('touchstart', triggerAudioOnFirstInteraction, { once: true });
      window.addEventListener('keydown', triggerAudioOnFirstInteraction, { once: true });
      window.addEventListener('scroll', triggerAudioOnFirstInteraction, { once: true });
    });

    return () => {
      cleanupListeners();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      stopSynthMelody();
    };
  }, [playMusic, stopSynthMelody]);

  return (
    <AudioContext.Provider
      value={{
        isMusicPlaying,
        toggleMusic,
        playMusic,
        pauseMusic,
        isVoicePlaying,
        setVoicePlaying: (playing: boolean) => {
          setIsVoicePlaying(playing);
          if (playing) {
            pauseMusic();
            setIsVideoSoundActive(false);
          }
        },
        isVideoSoundActive,
        setVideoSoundActive: (active: boolean) => {
          setIsVideoSoundActive(active);
          if (active) {
            pauseMusic();
            setIsVoicePlaying(false);
          }
        },
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioCoordinator = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioCoordinator must be used within an AudioProvider');
  }
  return context;
};
