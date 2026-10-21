import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
  isVoicePlaying: boolean;
  setVoicePlaying: (playing: boolean) => void;
  isVideoPlaying: boolean;
  setVideoPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Audio synthesizer fallback for romantic background melody
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<number | null>(null);

  // Stop background music if voice message or video starts
  useEffect(() => {
    if (isVoicePlaying || isVideoPlaying) {
      if (isMusicPlaying) {
        setIsMusicPlaying(false);
      }
      stopSynthMelody();
    }
  }, [isVoicePlaying, isVideoPlaying]);

  // Gentle romantic piano arpeggio synthesizer (royalty-free Web Audio fallback)
  const startSynthMelody = () => {
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

      // Romantic chord notes in Hz (Love Story inspired arpeggios: Dm - Gm - C - F - Bb - A)
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
        
        // Soft chime envelope
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 1.25);
        
        step++;
      }, 550);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const stopSynthMelody = () => {
    if (oscillatorIntervalRef.current) {
      clearInterval(oscillatorIntervalRef.current);
      oscillatorIntervalRef.current = null;
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  const playMusic = () => {
    // If voice or video is playing, stop them first
    setIsVoicePlaying(false);
    setIsVideoPlaying(false);
    setIsMusicPlaying(true);
    startSynthMelody();
  };

  const pauseMusic = () => {
    setIsMusicPlaying(false);
    stopSynthMelody();
  };

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
            setIsVideoPlaying(false);
          }
        },
        isVideoPlaying,
        setVideoPlaying: (playing: boolean) => {
          setIsVideoPlaying(playing);
          if (playing) {
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
