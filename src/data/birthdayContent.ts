export interface MemoryPhoto {
  id: string;
  image: string;
  caption: string;
  date?: string;
}

export interface VideoClip {
  id: string;
  title: string;
  caption: string;
  video: string;
  poster?: string;
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
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  birthdayWish: {
    heading: string;
    message: string;
    signature: string;
    playfulNickname: string;
  };
  memories: MemoryPhoto[];
  videos: VideoClip[];
  voiceMessage: {
    title: string;
    subtitle: string;
    audioSrc: string;
  };
  finalSurprise: {
    heading: string;
    message: string;
    signature: string;
  };
  media: {
    musicSrc: string;
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
    title: "Forever Close at Heart",
    musicTitle: "Love Story",
    musicArtist: "Indila",
    primaryColor: "#FCE7F0",
    accentColor: "#D982A5",
    backgroundColor: "#FFF9F5",
  },

  hero: {
    title: "SNEHUU",
    subtitle: "My favourite person, my forever favourite ♡",
    buttonText: "A little surprise for you",
  },

  birthdayWish: {
    heading: "Happy Birthday, My Snehuu!",
    message:
      "Happy Birthday to the most wonderful part of my life, my dearest Sneha. Every single day, your smile lights up my world, and hearing your laugh brings me a sense of peace that words can hardly describe. Even with the miles between us right now, my love for you only grows deeper, stronger, and more certain with every sunrise. You are my best friend, my warmth, and my forever home. May this year bring you all the gentle joy, big dreams, and pure happiness that your kind heart gives to everyone around you. Happy Birthday, my beautiful wife.",
    signature: "Forever yours, Nikhil ❤️",
    playfulNickname: "My favourite Soan papdi ♡",
  },

  memories: [
    {
      id: "photo-1",
      image: "/images/photo-01.webp",
      caption: "My beautiful wife and my favorite smile in the whole universe.",
      date: "October 23",
    },
    {
      id: "photo-2",
      image: "/images/photo-02.webp",
      caption: "That radiant happiness you bring into every room you walk into.",
      date: "Forever Loved",
    },
    {
      id: "photo-3",
      image: "/images/photo-03.webp",
      caption: "Every memory with you is a little piece of heaven I hold onto.",
      date: "Us",
    },
    {
      id: "photo-4",
      image: "/images/photo-04.webp",
      caption: "The quiet moments together that mean the absolute most to me.",
      date: "Golden Moments",
    },
    {
      id: "photo-5",
      image: "/images/photo-05.webp",
      caption: "Your infectious laugh that instantly makes any bad day disappear.",
      date: "Pure Joy",
    },
    {
      id: "photo-6",
      image: "/images/photo-06.webp",
      caption: "Looking forward to every tomorrow, knowing you are in my life.",
      date: "Together",
    },
    {
      id: "photo-7",
      image: "/images/photo-07.webp",
      caption: "My forever favorite person, my partner, my everything.",
      date: "Always",
    },
    {
      id: "photo-8",
      image: "/images/photo-08.webp",
      caption: "Holding you close in my heart, no matter the distance.",
      date: "Close at Heart",
    },
    {
      id: "photo-9",
      image: "/images/photo-09.webp",
      caption: "Every little glance and sweet memory that makes me fall in love all over again.",
      date: "Sweet Memories",
    },
    {
      id: "photo-10",
      image: "/images/photo-10.webp",
      caption: "The sweetest smile of my favorite Soan papdi.",
      date: "Jaan ♡",
    },
    {
      id: "photo-11",
      image: "/images/photo-11.webp",
      caption: "Two souls connected across any miles.",
      date: "One Heart",
    },
    {
      id: "photo-12",
      image: "/images/photo-12.webp",
      caption: "To you, my Snehuu, with all my love today and every day.",
      date: "Forever Yours",
    },
  ],

  videos: [
    {
      id: "video-1",
      title: "Our Sweet Little Moment",
      caption: "A little video memory that always brings a warm smile to my face.",
      video: "/videos/video-01.mp4",
      poster: "/images/photo-01.webp",
    },
    {
      id: "video-2",
      title: "Your Precious Laugh",
      caption: "The happiest sound in the world, caught on camera.",
      video: "/videos/video-02.mp4",
      poster: "/images/photo-02.webp",
    },
  ],

  voiceMessage: {
    title: "A message from me",
    subtitle: "Whenever you miss my voice, press play and listen close.",
    audioSrc: "/audio/voice-message.mp3",
  },

  finalSurprise: {
    heading: "Until I can hold you again",
    message:
      "No matter how many miles are between us, you will always have a special place in my heart. Happy Birthday, Snehuu. Forever yours, Nikhil ❤️.",
    signature: "Forever yours, Nikhil ❤️",
  },

  media: {
    musicSrc: "/audio/love-story.mp3",
  },
};
