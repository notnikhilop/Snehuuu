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

export interface CinematicMilestone {
  id: string;
  side: 'left' | 'right';
  progressStart: number;
  progressEnd: number;
  title?: string;
  text: string;
}

export interface CinematicSurpriseConfig {
  totalFrames: number;
  framePrefix: string;
  frameSuffix: string;
  scrollDistance: string;
  invitationText: string;
  invitationSubtext: string;
  milestones: CinematicMilestone[];
  ending: {
    title: string;
    message: string;
    returnButtonText: string;
  };
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
  cinematicSurprise: CinematicSurpriseConfig;
  media: {
    musicSrc: string;
  };
}

export const birthdayContent: BirthdayContent = {
  recipient: {
    name: "Sneha",
    nicknames: ["Snehuu", "Jaan", "Babby", "Soan papdi"],
    displayName: "Mrs. Sneha Gupta Maurya",
    birthday: "October 25",
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
    message: `Happy Birthday to my beautiful Sneha, my Biwi, my Jaan. ❤️🎂

You know, jaan, you are one of the most beautiful things that has ever happened to me. Your smile makes my day better, your happiness means everything to me, and just knowing that you are a part of my life makes me feel so lucky. 🥹🫶🏻

Even though we're miles apart right now, you are always close to my heart. I wish I could be there with you today, hug you tightly, kiss your forehead, Aur Lips V💋🤤, and remind you again and again how much you mean to me. ❤️🫂

You are not just my wife; you are my happiness, my comfort, my favourite person, and the one I want beside me through every chapter of life. I hope this birthday brings you countless reasons to smile, makes your dreams come true, and gives you all the happiness you deserve.

And meri Snehuu, no matter how much time passes or how life changes, I will always wish to see you happy, keep that beautiful smile on your face, and make you feel loved in every possible way. 🥹💗

**Happy Birthday, Meri Biwi, Meri Jaan, Meri Forever Person.** 💍❤️

I love you more than these words could ever explain. Today, tomorrow, and in every tomorrow that comes after. 🎀🧿💋`,
    signature: "Forever yours, Nikhil ❤️",
    playfulNickname: "My favourite Soan papdi ♡",
  },

  memories: [
    {
      id: "photo-1",
      image: "/images/photo-01.webp",
      caption: "My beautiful wife and my favorite smile in the whole universe.",
      date: "October 25",
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
      title: "Our Sweet Moments",
      caption: "A special memory of us that always brings the biggest smile to my face.",
      video: "/videos/1.mp4",
      poster: "/images/photo-01.webp",
    },
    {
      id: "video-2",
      title: "Your Beautiful Smile",
      caption: "The happiest, sweetest moments with my favorite person.",
      video: "/videos/2.mp4",
      poster: "/images/photo-02.webp",
    },
    {
      id: "video-3",
      title: "Forever Close at Heart",
      caption: "No matter where we are, every moment with you is magic.",
      video: "/videos/3.mp4",
      poster: "/images/photo-03.webp",
    },
    {
      id: "video-4",
      title: "My Whole World",
      caption: "Little laughs and candid memories that mean everything to me.",
      video: "/videos/4.mp4",
      poster: "/images/photo-04.webp",
    },
    {
      id: "video-5",
      title: "Forever Yours, Snehuu",
      caption: "Counting every second until I can hold you again.",
      video: "/videos/5.mp4",
      poster: "/images/photo-05.webp",
    },
  ],

  voiceMessage: {
    title: "A message from me",
    subtitle: "Whenever you miss my voice, press play and listen close.",
    audioSrc: "/audio/voice-message.mp3",
  },

  finalSurprise: {
    heading: "💗 For the Girl Who Owns My Heart",
    message: `Happy Birthday Meri Sneha, Meri Biwi ❤️🥹🫶🏻

Bohat Bohat Bohat Khush hoon main aaj! I love you soo much, meri jaan. Meri Biwi ki birthday hai aaj, aur har baar main yahi chahunga ki main tumhare liye kuch special kar paaun, tumhe apni zindagi bhar khush rakh paaun. 🥹❤️

Pata hai jaan, mere liye aaj ka din kitna special hai? Kyunki aaj ke din meri duniya mein woh insaan aaya tha, jo aaj meri poori duniya hai. 🫶🏻 Tum sirf meri wife nahi ho, tum meri khushi ho, mera sukoon ho, meri favourite person ho, aur meri zindagi ka woh hissa ho jiske bina main apni life imagine bhi nahi kar sakta. 🥹💗

Main nahi jaanta ki main tumhe har baar utni khushi de paata hoon ya nahi, jitni tum deserve karti ho, lekin ek baat dil se kehna chahta hoon — **main hamesha tumhe khush rakhne ki koshish karta rahunga.** Tumhari smile mere liye bohat precious hai, aur tumhari aankhon mein khushi dekhne ke liye main kuch bhi karna chahunga. 🥺❤️

Kabhi-kabhi bura lagta hai ki main tumhare paas nahi hoon, tumhare birthday par tumhe hug nahi kar sakta, tumhara haath pakad kar tumhe wish nahi kar sakta, aur tumhare saath baith kar tumhara special day celebrate nahi kar sakta. 🥹💔 Lekin meri jaan, doori chahe kitni bhi ho, mera dil hamesha tumhare paas hi rehta hai. Kaash aaj main tumhare paas hota, tumhe apni baahon mein lekar bas itna kehta — *“Happy Birthday, meri jaan. Tum meri ho, aur main tumse bohat bohat bohat pyaar karta hoon.”* 🫂💗

Meri Snehuu, main chahta hoon ki tumhari life mein jitni bhi khushiyan hain, woh sab tumhe milein. Tumhare saare dreams poore hon, tum hamesha smile karti raho, aur tumhe kabhi bhi aisa feel na ho ki tum akeli ho. Main tumhare saath hoon, jaan — tumhari khushi mein bhi, tumhare sad days mein bhi, aur tumhare har us moment mein jab tumhe meri zaroorat ho. ❤️🫶🏻

Aur haan, meri Soan Papdi 🥺😘💗, tum jitna mujhe pareshan karti ho na, utna hi zyada pyaar bhi aata hai tum par. Tumhari chhoti-chhoti baatein, tumhara gussa, tumhara bachpana, tumhara pyaar — mujhe tumhari har ek cheez se pyaar hai. Main chahta hoon ki hum aise hi ek-doosre ko pareshan karte rahein, haste rahein, ladte rahein, phir ek-doosre ko manaate rahein, aur poori zindagi saath bitaayein. 🥹💋

**Happy Birthday, Meri Biwi, Meri Jaan, Meri Snehuu!** 🎂❤️

I love you more than I can ever explain in words. Thank you meri life mein aane ke liye, mujhe itna pyaar dene ke liye, aur meri duniya ko itna beautiful banaane ke liye. Main bas yahi chahta hoon ki aane wale har birthday par main tumhare saath rahoon, tumhe apne haathon se cake khilaaun, tumhe hug karoon, aur tumhare chehre par woh beautiful smile dekh saakuu. 🥹🫂❤️

**Tum meri aaj ki khushi ho, meri kal ki umeed ho, aur meri poori zindagi ka sabse pyaara hissa ho.** 🫶🏻💍

I LOVE YOU SOOO MUCH, MERI BIWI. HAPPY BIRTHDAY, MERI SNEHUUU! ❤️🎀💋🧿
💋😘😚😚😚😚Aur Bohat Sara Kissi Aapkoo😚😚😚😚😚😚😚😚😚😚😚💝💝💖💕💕😍💋💋😘😚😚😚😚
 Snehuu. Forever yours, Nikhil ❤️.`,
    signature: "Forever yours, Nikhil ❤️",
  },

  cinematicSurprise: {
    totalFrames: 442,
    framePrefix: "/frames/frame_",
    frameSuffix: ".jpg",
    scrollDistance: "600vh",
    invitationText: "Scroll gently to unveil our story ↓",
    invitationSubtext: "Watch the movements unfold frame by frame with your scroll",
    milestones: [
      {
        id: "moment-1",
        side: "left",
        progressStart: 0.08,
        progressEnd: 0.21,
        title: "My Home",
        text: "In this whole world, my heart found its home in you.",
      },
      {
        id: "moment-2",
        side: "right",
        progressStart: 0.24,
        progressEnd: 0.37,
        title: "Every Single Time",
        text: "If I could choose a thousand times, I'd choose you every single time.",
      },
      {
        id: "moment-3",
        side: "left",
        progressStart: 0.40,
        progressEnd: 0.53,
        title: "Always Beside You",
        text: "Even when I cannot hold you close, my heart is always beside you.",
      },
      {
        id: "moment-4",
        side: "right",
        progressStart: 0.56,
        progressEnd: 0.69,
        title: "Across The Miles",
        text: "One day, all these miles will turn into a hug, and I won't have to miss you from afar.",
      },
      {
        id: "moment-5",
        side: "left",
        progressStart: 0.72,
        progressEnd: 0.85,
        title: "My Safe Haven",
        text: "You are my favourite person, my safest place, and my forever.",
      },
      {
        id: "moment-6",
        side: "right",
        progressStart: 0.88,
        progressEnd: 0.96,
        title: "Through My Eyes",
        text: "Happy Birthday, Meri Snehuu. If you could see yourself through my eyes, you'd understand just how deeply you are loved.",
      },
    ],
    ending: {
      title: "Happy Birthday, Meri Biwi",
      message: "Every frame ends here, but my love for you doesn't. I would choose you in every lifetime. ❤️",
      returnButtonText: "Back to our birthday surprise ♡",
    },
  },

  media: {
    musicSrc: "/audio/love-story.mp3",
  },
};
