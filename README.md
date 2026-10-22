# Project Snehuu 💗 — Personal Birthday Experience

A romantic, intimate birthday website for **Mrs. Sneha Gupta Maurya** (*Snehuu*, *Jaan*, *Babby*, *Soan papdi*), crafted by **Nikhil** for her birthday on **October 25**.

> *"My favourite person, my forever favourite ♡"*

---

## ✨ Features & Journey

1. **Hero Section**
   - Oversized, editorial typography **`SNEHUU`**.
   - 3D translucent pink glass heart with realistic highlights, refractions, and floating pulse.
   - Flowing iridescent ribbons and pastel gradient background.
   - Subtitle: *"My favourite person, my forever favourite ♡"*.
   - Call to action: *"A little surprise for you"*.

2. **Birthday Wish**
   - Beautiful, heartfelt birthday message celebrating Sneha on October 25 (~100 words, no fictional backstories).
   - Interactive pastel cake with tap-to-blowout candles.
   - Extinguish smoke puff, celebration chime, and confetti explosion (`canvas-confetti`).
   - Playful nickname reveal: *"My favourite Soan papdi ♡"*.

3. **Our Memories (Main Attraction)**
   - 12 replaceable photo slots with Polaroid framing and soft romantic drop shadows.
   - Short, sweet captions.
   - Full-screen photo viewer (Lightbox) with zoom and keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`).

4. **Little Moments**
   - 1–3 short video clips.
   - **Silent viewport autoplay:** Videos autoplay silently when they enter the screen, and pause when scrolled past.
   - Dedicated, clear **Mute / Unmute** toggle button on each video.
   - Audio coordinator automatically pauses the background song whenever a video is unmuted!

5. **A Message From Me**
   - Intimate voice note player with animated waveform bars.
   - Real-time scrubber, play/pause, and restart controls.
   - Automatically pauses background music during playback.

6. **Final Surprise**
   - Starry night sky with twinkling particles.
   - Closing love note:
     > *"No matter how many miles are between us, you will always have a special place in my heart. Happy Birthday, Snehuu. Forever yours, Nikhil ❤️."*

7. **Theme Song ("Love Story" by Indila)**
   - Attempts to autoplay on page load.
   - If browser blocks autoplay without prior interaction, starts automatically on the first tap/click/scroll!
   - Floating compact music player with vinyl spin animation and visible toggle.

---

## 📁 Exact Folders for Your Media Files

All media files are stored locally in the `public/` directory:

| Media Type | Exact Folder | Expected Filenames |
|---|---|---|
| **Photographs** (8–15 slots) | `public/images/` | `photo-01.webp` through `photo-12.webp` (or `.jpg` / `.png`) |
| **Video Clips** (1–3 clips) | `public/videos/` | `video-01.mp4`, `video-02.mp4` |
| **Voice Recording** | `public/audio/` | `voice-message.mp3` |
| **Theme Song** | `public/audio/` | `love-story.mp3` |

> **Tip on Image Formats:** If your photos are `.jpg` or `.png`, either rename them to `.webp` or update the file extensions in `src/data/birthdayContent.ts`.

---

## ✏️ How to Edit Text & Captions

All text is kept in a single configuration file:
👉 **`src/data/birthdayContent.ts`**

In this file, you can edit:
- `birthdayWish.message`: Your personal birthday wish.
- `memories`: Captions and dates for each of the 12 photo slots.
- `videos`: Titles and captions for your video memories.
- `voiceMessage.title` & `subtitle`: Audio memo labels.
- `finalSurprise.message`: Closing note.

---

## 🚀 How to Redeploy the Updated Site to Vercel

Whenever you add new photos, videos, or change messages:

1. Open PowerShell or Command Prompt inside `d:\Antigravity\Snehuu`.
2. Stage and commit your new files:
   ```powershell
   git add .
   git commit -m "Update personal photos, videos and messages for Snehuu"
   ```
3. Push to your GitHub repository:
   ```powershell
   git push origin main
   ```
4. **Vercel will automatically detect your push and redeploy your live website in approximately 30 seconds!**
   You can view the deployment progress on your [vercel.com](https://vercel.com) dashboard.
