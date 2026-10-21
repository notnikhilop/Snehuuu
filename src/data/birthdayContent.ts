export interface MemoryItem {
  id: string;
  title: string;
  date?: string;
  caption: string;
  image: string;
  video?: string;
  category?: string;
  note?: string;
}

export interface BirthdayContent {
  recipient: {
    name: string;
    nicknames: string[];
    displayName: string;
    birthday: string;
  };
  theme: {
    title: string;
    musicTitle: string;
    musicArtist: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  opening: {
    chapter: string;
    eyebrow: string;
    message: string;
    buttonText: string;
  };
  letter: {
    chapter: string;
    title: string;
    message: string;
    signature: string;
  };
  memories: MemoryItem[];
  reasonsILoveYou: string[];
  voiceSection: {
    chapter: string;
    title: string;
    subtitle: string;
  };
  birthday: {
    chapter: string;
    heading: string;
    message: string;
    playfulNickname: string;
  };
  finalLetter: {
    chapter: string;
    heading: string;
    message: string;
    signature: string;
  };
  media: {
    voiceMessage: string;
    musicMode: 'embedded-player' | 'local-audio' | 'ambient-synth';
    musicEmbedUrl: string;
  };
}

export const birthdayContent: BirthdayContent = {
  recipient: {
    name: "Sneha",
    nicknames: ["Snehuu", "Jaan", "Babby", "Soan papdi"],
    displayName: "Mrs. Sneha Gupta Maurya",
    birthday: "October 23",
  },

  theme: {
    title: "Miles Apart, Close at Heart",
    musicTitle: "Love Story",
    musicArtist: "Indila",
    primaryColor: "#FCE7F0",
    accentColor: "#D982A5",
    backgroundColor: "#FFF9F5",
  },

  opening: {
    chapter: "Chapter 1 — For my Snehuu",
    eyebrow: "A little world made just for you",
    message: "Hey, Snehuu… even though I can't always be beside you, I made a little world where it's just you and me.",
    buttonText: "Open your surprise, Jaan ♡",
  },

  letter: {
    chapter: "Chapter 2 — A letter across the miles",
    title: "A letter across the miles",
    message: `My dearest Snehuu,\n\nEven with miles separating us today, not a single second goes by where you aren't wrapped in my heart, Jaan. Every morning begins with checking for your text, and every night ends with wishing I could pull you into my arms and whisper how much you mean to me, Babby.\n\nBeing apart has only shown me how boundless our love truly is. Distance cannot dim the warmth of your smile, nor can it hush the sweet sound of your laughter that lives permanently in my soul.\n\nOn this October 23, I celebrate the day my universe became complete because you were born. Happy Birthday, my beautiful wife, my Jaan.\n\nForever yours, Nikhil ❤️`,
    signature: "Forever yours, Nikhil ❤️",
  },

  memories: [
    {
      id: "memory-1",
      title: "The Moment Everything Began",
      date: "Our First Hello",
      caption: "That very first conversation where seconds turned into hours and I realized I had found my home in your heart.",
      note: "The exact moment my life changed for the better, Jaan.",
      image: "/images/photo-01.webp",
      category: "First Chapter",
    },
    {
      id: "memory-2",
      title: "Late Night Calls Across Time Zones",
      date: "Midnight Conversations",
      caption: "Falling asleep together on voice calls, listening to each other breathe through the quiet hours.",
      note: "Distance was powerless against our voices, Babby.",
      image: "/images/photo-02.webp",
      category: "Long Distance",
    },
    {
      id: "memory-3",
      title: "Airport Hugs & Racing Heartbeats",
      date: "Running Into Your Arms",
      caption: "Dropping my bags and holding you tight after months apart — that moment makes every mile worth it.",
      note: "The best feeling in the entire universe.",
      image: "/images/photo-03.webp",
      video: "/videos/memory-01.mp4",
      category: "Reunion",
    },
    {
      id: "memory-4",
      title: "Quiet Strolls & Holding Hands",
      date: "Golden Hour Glow",
      caption: "Walking beside you with your hand gently tucked into mine, wishing the clocks would just stop.",
      note: "Just you, me, and endless peace.",
      image: "/images/photo-04.webp",
      category: "Everyday Magic",
    },
    {
      id: "memory-5",
      title: "Our Shared Smiles & Secret Jokes",
      date: "Pure Joy",
      caption: "You laughing uncontrollably at my silly jokes. Your happiness is my absolute favorite sound in this world.",
      note: "My sweetest Soan papdi smiling.",
      image: "/images/photo-05.webp",
      category: "Laughter",
    },
    {
      id: "memory-6",
      title: "Building Our Beautiful Tomorrow",
      date: "Forever & Always",
      caption: "Looking toward the future where distance is just a story we tell, and every tomorrow begins right beside you.",
      note: "Soon, Jaan. Zero miles forever.",
      image: "/images/photo-06.webp",
      category: "Our Future",
    },
  ],

  reasonsILoveYou: [
    "The way you make ordinary moments feel like poetry.",
    "Your sweet laugh that instantly washes away all my stress.",
    "The peaceful comfort and warmth I find just hearing your voice, Babby.",
    "Your radiant smile and the gentle kindness you carry everywhere.",
    "The unwavering courage and love you pour into us across the miles, Jaan.",
    "A million little reasons I cannot wait to hold you and whisper in person.",
  ],

  voiceSection: {
    chapter: "Chapter 4 — When you miss me",
    title: "When you miss me",
    subtitle: "Listen to my voice whenever the distance feels too quiet.",
  },

  birthday: {
    chapter: "Chapter 5 — Happy birthday, Soan papdi! 🎂",
    heading: "Happy birthday, Soan papdi! 🎂",
    message: "May this year bring you endless sunshine, gentle laughter, and all the magical dreams your pure heart deserves. You are my greatest blessing, my favorite person, and my forever home.",
    playfulNickname: "My favourite Soan papdi ♡",
  },

  finalLetter: {
    chapter: "Chapter 6 — Until I can hold you again",
    heading: "Until I can hold you again",
    message: `Snehuu,\n\nUntil the day I can wrap my arms around you and not have to say goodbye at an airport terminal, please remember that you have every single beat of my heart.\n\nWhenever the night feels too quiet, close your eyes and remember: I am right here with you, loving you more with every passing dawn.\n\nCount the days, Jaan, because soon the distance will be zero, and I'll never let you go.`,
    signature: "Forever yours,\nNikhil ❤️",
  },

  media: {
    voiceMessage: "/audio/voice-message.mp3",
    musicMode: "embedded-player",
    musicEmbedUrl: "",
  },
};
