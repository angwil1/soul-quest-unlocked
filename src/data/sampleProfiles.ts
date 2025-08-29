export interface SampleProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  vibeTag: string;
  location: string;
  occupation: string;
  emotionalSoundtrack: string;
  tiktokUrl: string;
  photos: string[];
  interests: string[];
  conversationStarters: string[];
  poeticMicrocopy: string;
  aestheticPreference: string;
  personalityType: string;
  loveLanguage: string;
  vibeGallery: {
    mood: string;
    description: string;
    tags: string[];
    image: string;
  }[];
}

export const founderCuratedProfiles: SampleProfile[] = [];

export const conversationStarters = [
  "What book made you cry in public?",
  "How do you hold space for your own healing?", 
  "What's your secret ritual for connecting with nature?",
  "What question do you wish someone would ask you?",
  "What does your soul crave that your mind can't name?",
  "How does the ocean make you feel?",
  "What lyric lives in your bones?",
  "What place has changed you the most?",
  "What does the earth whisper to you?",
  "What would you whisper to your younger self?",
  "How do you find meaning in mundane moments?",
  "What story is your heart trying to tell?",
  "What does freedom mean to your soul?",
  "How do you celebrate your own growth?",
  "What adventure is calling your name?"
];

export const vibeTags = [
  "Wistful Explorer",
  "Trust Builder", 
  "Private Flame",
  "Authentic Rebel",
  "Gentle Philosopher",
  "Mystical Romantic",
  "Free Spirit",
  "Poetic Soul",
  "Global Heart",
  "Earth Guardian"
];

export const poeticMicrocopy = [
  "seeking someone who reads between the lines of life",
  "authentic connection over perfect performance", 
  "wild hearts that choose each other daily",
  "done shrinking to fit into small love",
  "believing in love that feels like coming home",
  "love that honors both shadow and light",
  "seeking a love as deep as the ocean",
  "love that feels like the perfect verse",
  "collecting hearts across continents",
  "cultivating love that regenerates the world"
];