import { AudioProvider } from './context/AudioCoordinator';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoveLetter } from './components/LoveLetter';
import { StoryTimeline } from './components/StoryTimeline';
import { MemoryGallery } from './components/MemoryGallery';
import { ReasonsILoveYou } from './components/ReasonsILoveYou';
import { VoiceMessage } from './components/VoiceMessage';
import { BirthdayCake } from './components/BirthdayCake';
import { FinalLetter } from './components/FinalLetter';
import { MusicPlayer } from './components/MusicPlayer';
import { NavigationProgress } from './components/NavigationProgress';

export function App() {
  const handleOpenSurprise = () => {
    const el = document.getElementById('letter-section');
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
          {/* 1. Redesigned Hero Section */}
          <Hero onOpenSurprise={handleOpenSurprise} />

          {/* 2. Personal Love Letter with Envelope animation */}
          <LoveLetter />

          {/* 3. Interactive Long-Distance Love-Story Timeline */}
          <StoryTimeline />

          {/* 4. Swipeable Memory Gallery with Fullscreen Lightbox */}
          <MemoryGallery />

          {/* 5. Six Tap-to-Reveal Cards: "Little things I love about you" */}
          <ReasonsILoveYou />

          {/* 6. Voice Message Section: "When you miss me" */}
          <VoiceMessage />

          {/* 7. Birthday Celebration & Interactive Cake with Candles & Confetti */}
          <BirthdayCake />

          {/* 8. Final Closing Letter & Stars */}
          <FinalLetter />
        </main>

        {/* Floating Background Music Player */}
        <MusicPlayer />
      </div>
    </AudioProvider>
  );
}

export default App;
