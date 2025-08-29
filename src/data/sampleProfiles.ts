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

export const conversationStarters = [];

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