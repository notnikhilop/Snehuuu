import { useState, useEffect } from 'react';
import { AudioProvider, useAudioCoordinator } from './context/AudioCoordinator';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BirthdayWish } from './components/BirthdayWish';
import { MemoryGallery } from './components/MemoryGallery';
import { LittleMoments } from './components/LittleMoments';
import { VoiceMessage } from './components/VoiceMessage';
import { FinalLetter } from './components/FinalLetter';
import { MusicPlayer } from './components/MusicPlayer';
import { NavigationProgress } from './components/NavigationProgress';
import { CinematicSurprise } from './components/CinematicSurprise';

function AppInner() {
  // When website first opens, start with the cinematic Frame One opening sequence!
  const [view, setView] = useState<'cinematic' | 'birthday'>(() => {
    const hash = window.location.hash.toLowerCase();
    return hash === '#birthday' || hash === '#main' ? 'birthday' : 'cinematic';
  });

  const { pauseMusic } = useAudioCoordinator();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#birthday' || hash === '#main') {
        setView('birthday');
      } else {
        setView('cinematic');
        pauseMusic();
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pauseMusic]);

  const handleOpenSurprise = () => {
    const el = document.getElementById('birthday-wish');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCinematic = () => {
    pauseMusic();
    window.location.hash = '#surprise';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToBirthday = () => {
    window.location.hash = '#birthday';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'cinematic') {
    /* Full-screen Cinematic Sequence: Frame One -> Smooth Transition -> Frames -> Ending */
    return <CinematicSurprise onReturn={handleReturnToBirthday} />;
  }

  return (
    /* Main Birthday Website */
    <div className="min-h-screen bg-[#FFF9F5] text-[#2A1722] relative selection:bg-[#F7C8D9] selection:text-[#75445C]">
      {/* Reading progress indicator */}
      <NavigationProgress />

      {/* Minimal Header */}
      <Navbar onOpenSurprise={handleOpenSurprise} onOpenCinematic={handleOpenCinematic} />

      <main className="relative z-10">
        {/* 1. Hero Section (SNEHUU, 3D Glass Heart, Ribbons) */}
        <Hero onOpenSurprise={handleOpenSurprise} />

        {/* 2. Heartfelt Birthday Wish & Interactive Cake */}
        <BirthdayWish />

        {/* 3. Our Memories Gallery (Main feature: 12 replaceable slots + full-screen viewer) */}
        <MemoryGallery />

        {/* 4. Little Moments (Short videos with viewport silent autoplay + mute toggle) */}
        <LittleMoments />

        {/* 5. A Message From Me (Voice Recording Player) */}
        <VoiceMessage />

        {/* 6. Final Surprise Closing Message & Secret Story Portal */}
        <FinalLetter onOpenCinematic={handleOpenCinematic} />
      </main>

      {/* Floating Background Music Player only on main birthday page */}
      <MusicPlayer />
    </div>
  );
}

export function App() {
  return (
    <AudioProvider>
      <AppInner />
    </AudioProvider>
  );
}

export default App;
