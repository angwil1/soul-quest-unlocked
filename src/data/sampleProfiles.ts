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

export const founderCuratedProfiles: SampleProfile[] = [
  {
    id: "sample-1",
    name: "Alex",
    age: 28,
    bio: "Love exploring new places and trying different cuisines. Looking for someone genuine to share adventures with.",
    vibeTag: "Adventurous",
    location: "Portland, OR",
    occupation: "Software Engineer",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/alex-profile-main.jpg"],
    interests: ["Hiking", "Photography", "Travel"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  },
  {
    id: "sample-2",
    name: "Jordan",
    age: 25,
    bio: "Artist and coffee enthusiast. Always up for deep conversations and weekend market visits.",
    vibeTag: "Creative",
    location: "Austin, TX",
    occupation: "Graphic Designer",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/jordan-profile-main.jpg"],
    interests: ["Art", "Coffee", "Music"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  },
  {
    id: "sample-3",
    name: "Casey",
    age: 30,
    bio: "Marine biologist who loves the ocean and environmental conservation. Seeking like-minded connections.",
    vibeTag: "Nature Lover",
    location: "San Diego, CA",
    occupation: "Marine Biologist",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/casey-profile.jpg"],
    interests: ["Ocean Conservation", "Diving", "Yoga"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  },
  {
    id: "sample-4",
    name: "River",
    age: 27,
    bio: "Yoga instructor and mindfulness coach. Believe in authentic connections and personal growth.",
    vibeTag: "Mindful",
    location: "Boulder, CO",
    occupation: "Yoga Instructor",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/river-profile-1.jpg"],
    interests: ["Yoga", "Meditation", "Hiking"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  },
  {
    id: "sample-5",
    name: "Sage",
    age: 29,
    bio: "Documentary filmmaker passionate about storytelling and travel. Always have a camera ready.",
    vibeTag: "Storyteller",
    location: "Brooklyn, NY",
    occupation: "Filmmaker",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/sage-profile-1.jpg"],
    interests: ["Film", "Travel", "Photography"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  },
  {
    id: "sample-6",
    name: "Phoenix",
    age: 26,
    bio: "Therapist who loves reading, hiking, and helping others. Looking for meaningful connections.",
    vibeTag: "Caring",
    location: "Seattle, WA",
    occupation: "Therapist",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/phoenix-profile-1.jpg"],
    interests: ["Psychology", "Reading", "Hiking"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  },
  {
    id: "sample-7",
    name: "Dev",
    age: 28,
    bio: "Software engineer who loves cricket, cooking traditional recipes, and exploring fusion cuisines. Always up for philosophical discussions over chai.",
    vibeTag: "Cultural Bridge",
    location: "San Francisco, CA",
    occupation: "Software Engineer",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/dev-profile-main.jpg"],
    interests: ["Cricket", "Cooking", "Philosophy", "Travel"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  },
  {
    id: "sample-8",
    name: "Marcus",
    age: 31,
    bio: "Jazz musician and music teacher who believes in the power of rhythm to bring people together. Love exploring different neighborhoods and finding hidden gems.",
    vibeTag: "Soulful Connector",
    location: "New Orleans, LA",
    occupation: "Music Teacher",
    emotionalSoundtrack: "",
    tiktokUrl: "",
    photos: ["/src/assets/marcus-profile-main.jpg"],
    interests: ["Jazz", "Teaching", "Architecture", "Food Culture"],
    conversationStarters: [],
    poeticMicrocopy: "",
    aestheticPreference: "",
    personalityType: "",
    loveLanguage: "",
    vibeGallery: []
  }
];

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