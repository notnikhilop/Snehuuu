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

export function App() {
  const handleOpenSurprise = () => {
    const el = document.getElementById('birthday-wish');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AudioProvider>
      <div className="min-h-screen bg-[#FFF9F5] text-[#2A1722] relative selection:bg-[#F7C8D9] selection:text-[#75445C]">
        {/* Reading progress indicator */}
        <NavigationProgress />

        {/* Minimal Header */}
        <Navbar onOpenSurprise={handleOpenSurprise} />

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

          {/* 6. Final Surprise Closing Message */}
          <FinalLetter />
        </main>

        {/* Floating Background Music Player */}
        <MusicPlayer />
      </div>
    </AudioProvider>
  );
}

export default App;
