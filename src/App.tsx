import { useState, useEffect } from 'react';
import { AudioProvider } from './context/AudioCoordinator';
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

export function App() {
  const [isCinematicOpen, setIsCinematicOpen] = useState(false);

  // Sync state with URL hash (#surprise or #cinematic)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      setIsCinematicOpen(hash === '#surprise' || hash === '#cinematic');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenSurprise = () => {
    const el = document.getElementById('birthday-wish');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCinematic = () => {
    window.location.hash = '#surprise';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnFromCinematic = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AudioProvider>
      {isCinematicOpen ? (
        /* Hidden Surprise Page: Scroll-controlled Cinematic Velocity Experience */
        <CinematicSurprise onReturn={handleReturnFromCinematic} />
      ) : (
        /* Main Birthday Experience */
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
        </div>
      )}

      {/* Floating Background Music Player remains active across views */}
      <MusicPlayer />
    </AudioProvider>
  );
}

export default App;
