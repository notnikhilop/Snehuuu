# Project Snehuu 💗 — A Romantic Long-Distance Birthday Experience

An intimate, elegant, and interactive birthday website for **Mrs. Sneha Gupta Maurya** (*Snehuu*, *Jaan*, *Babby*, *Soan papdi*), crafted with love by **Nikhil** for her birthday on **October 23**.

> *"Miles apart, but always close to my heart."*

---

## ✨ Features & Journey

1. **Editorial Hero Section (Redesigned from Reference)**
   - Oversized bold condensed typography: **`SNEHUU`** (70–85% desktop width).
   - 3D-effect translucent pink glass heart with realistic specular highlights, refractions, floating motion, and subtle pulse.
   - Iridescent, silky waves in white, pale pink, and light cyan emerging from both sides.
   - Editorial tags: `October 23`, `Miles Apart, Close at Heart`, `Mrs. Sneha Gupta Maurya`, `Forever Yours`.
   - Romantic subtitle: *"To my favourite person in the whole universe ♡"*.
   - Minimal header with tiny heart logo and *"Open Your Surprise"* call to action.

2. **Personal Love Letter (`A letter across the miles`)**
   - Sealed postal envelope with stamp and heart wax seal.
   - Tap-to-unseal unfolding animation revealing a vintage parchment letter.
   - Dedicated "Continue our story" transition button.

3. **Interactive Long-Distance Timeline (`Miles Apart, Close at Heart`)**
   - Alternating desktop timeline and vertical mobile line with glowing heart nodes.
   - Long-distance relationship connection stats (miles, endless calls, infinite love).
   - Dedicated chapters with dates, memories, photos, and short video preview.

4. **Polaroid Memory Gallery & Fullscreen Lightbox**
   - Realistic Polaroid frames with subtle tilt angles, vintage tape, and captions.
   - Fullscreen Photo Viewer (Lightbox) with zoom, keyboard navigation (Esc, Arrow keys), and previous/next controls.

5. **"Little Things I Love About You" (Six Interactive Cards)**
   - 6 tap-to-reveal cards with smooth 3D flip animation.
   - Roman numeral badges and rose-gold card backs.
   - Progress tracker showing unlocked secrets.

6. **Voice Message Player ("When you miss me")**
   - Intimate audio player with animated waveform bars.
   - Real-time scrubber, play/pause, and restart controls.
   - Automatic sound coordinator: pauses background music whenever voice memo is playing.

7. **Interactive Birthday Cake & Celebration**
   - Pastel multi-tiered cake with 3 interactive glowing candles.
   - Tap individual flames or click *"Blow Out Candles & Make A Wish 🎂"*.
   - Extinguish smoke puff, celebratory Web Audio chime, and colorful confetti burst (`canvas-confetti`).
   - Celebratory wish reveal with the playful nickname **"My favourite Soan papdi ♡"**.
   - Option to relight candles to wish again.

8. **Starry Final Letter & Closing ("Until I can hold you again")**
   - Starry night sky with twinkling particles.
   - Sealed letter with personal closing message.
   - Handwritten cursive signature: *"Your Nikhil, always ❤️"*.
   - Replay button to smoothly return to the beginning.

9. **Smart Music Player**
   - Intended song: *"Love Story"* by Indila.
   - Floating compact player with vinyl spinning animation.
   - Built-in soothing ambient synthesizer fallback so music always plays even before local MP3 is added.
   - Audio coordinator prevents music from overlapping with voice note or video clips.

---

## 🛠️ Tech Stack

- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS v4** + Custom Glassmorphism Utilities
- **Framer Motion** for smooth, cinematic animations
- **Lucide React** for minimal icons
- **Canvas-Confetti** for lightweight birthday celebrations
- **Web Audio API** for synthesized romantic melodies and celebration chimes

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized static build will be generated in `dist/`.

---

## 💌 How to Personalize Your Website

All text and configurations are centralized in a single file for easy maintenance:

### 1. Edit Messages & Details: `src/data/birthdayContent.ts`
Open `src/data/birthdayContent.ts` to customize:
- `recipient`: Sneha's names, nicknames, and birthday date.
- `letter`: The main opening love letter and signature.
- `memories`: Titles, dates, captions, and media paths for your timeline & gallery.
- `reasonsILoveYou`: The 6 reasons revealed by the interactive cards.
- `birthday`: The birthday message and playful nickname (*"My favourite Soan papdi ♡"*).
- `finalLetter`: The closing letter.

### 2. Add Your Photos
Drop your photos into `public/images/`:
- `photo-01.webp` (or `.jpg` / `.png` / `.svg`)
- `photo-02.webp`
- `photo-03.webp`
- `photo-04.webp`
- `photo-05.webp`
- `photo-06.webp`

> *Tip:* If using `.jpg` or `.png`, simply update the file extension in `src/data/birthdayContent.ts`.

### 3. Add Your Videos
Place short video clips (MP4 format recommended) in:
- `public/videos/memory-01.mp4`

### 4. Record Your Voice Message
Record a sweet voice note (MP3 format) and place it at:
- `public/audio/voice-message.mp3`

### 5. Configure the Song ("Love Story" by Indila)
Place your licensed MP3 at:
- `public/audio/love-story.mp3`
*(If no file is placed, the website automatically plays a soothing romantic piano arpeggio via the built-in Web Audio synthesizer).*

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Vercel automatically detects Vite.
4. Click **"Deploy"**. Your site will be live with a secure HTTPS link in seconds!

### Deploy to Netlify
1. Run `npm run build`.
2. Drag and drop the `dist/` folder into [app.netlify.com/drop](https://app.netlify.com/drop).

### 🔒 Privacy Note
Since this is a client-side static site, any public URL can be viewed by anyone with the link. If you prefer extra privacy:
- Use password protection available on Vercel/Netlify Pro, or
- Share the link exclusively with Snehuu!
