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
    id: "alex-1",
    name: "Alex",
    age: 28,
    bio: "Digital nomad who finds magic in everyday moments. Currently exploring Southeast Asia while building sustainable tech solutions. Love deep conversations under starlit skies.",
    vibeTag: "Wistful Explorer",
    location: "Portland, OR",
    occupation: "UX Designer",
    emotionalSoundtrack: "Bon Iver - Holocene",
    tiktokUrl: "",
    photos: ["/src/assets/alex-profile-main.jpg", "/src/assets/alex-hiking-realistic.jpg"],
    interests: ["Hiking", "Photography", "Sustainable Living", "Meditation", "Coffee", "Travel"],
    conversationStarters: [
      "What's the most beautiful sunrise you've ever witnessed?",
      "If you could have dinner with any historical figure, who would it be?"
    ],
    poeticMicrocopy: "seeking someone who reads between the lines of life",
    aestheticPreference: "Minimalist with earthy tones",
    personalityType: "INFP",
    loveLanguage: "Quality Time",
    vibeGallery: [
      {
        mood: "Adventurous",
        description: "Mountain peak at golden hour",
        tags: ["nature", "adventure", "peaceful"],
        image: "/src/assets/vibe-adventurous-7.jpg"
      }
    ]
  },
  {
    id: "jordan-2",
    name: "Jordan",
    age: 32,
    bio: "Artist and community organizer passionate about social justice and creative expression. Building bridges through art therapy workshops in underserved communities.",
    vibeTag: "Authentic Rebel",
    location: "Austin, TX", 
    occupation: "Art Therapist",
    emotionalSoundtrack: "Solange - Cranes in the Sky",
    tiktokUrl: "",
    photos: ["/src/assets/jordan-profile-main.jpg", "/src/assets/jordan-profile-realistic.jpg"],
    interests: ["Social Justice", "Art Therapy", "Live Music", "Cooking", "Community Gardens", "Poetry"],
    conversationStarters: [
      "What's a cause that lights a fire in your soul?",
      "How do you express your creativity when words aren't enough?"
    ],
    poeticMicrocopy: "done shrinking to fit into small love",
    aestheticPreference: "Bold colors and eclectic patterns",
    personalityType: "ENFJ",
    loveLanguage: "Acts of Service",
    vibeGallery: [
      {
        mood: "Creative",
        description: "Vibrant street art inspiration",
        tags: ["creative", "bold", "expressive"],
        image: "/src/assets/vibe-creative-8.jpg"
      }
    ]
  },
  {
    id: "casey-3",
    name: "Casey",
    age: 26,
    bio: "Marine biologist diving deep into ocean conservation. When I'm not underwater studying coral reefs, you'll find me writing grant proposals or teaching kids about marine life.",
    vibeTag: "Earth Guardian",
    location: "San Diego, CA",
    occupation: "Marine Biologist",
    emotionalSoundtrack: "Ólafur Arnalds - Near Light",
    tiktokUrl: "",
    photos: ["/src/assets/casey-profile.jpg", "/src/assets/casey-profile-realistic.jpg"],
    interests: ["Ocean Conservation", "Scuba Diving", "Environmental Activism", "Marine Photography", "Yoga", "Surfing"],
    conversationStarters: [
      "What's your favorite way to connect with nature?",
      "If you could protect one ecosystem, which would it be?"
    ],
    poeticMicrocopy: "cultivating love that regenerates the world",
    aestheticPreference: "Ocean-inspired blues and greens",
    personalityType: "ISFJ",
    loveLanguage: "Physical Touch",
    vibeGallery: [
      {
        mood: "Connected",
        description: "Ocean waves at sunset",
        tags: ["nature", "peaceful", "connected"],
        image: "/src/assets/vibe-connected-5.jpg"
      }
    ]
  },
  {
    id: "river-4",
    name: "River",
    age: 30,
    bio: "Yoga instructor and mindfulness coach helping others find inner peace. Believer in the healing power of movement, breath, and authentic connection.",
    vibeTag: "Gentle Philosopher",
    location: "Boulder, CO",
    occupation: "Yoga Instructor",
    emotionalSoundtrack: "Kiasmos - Blurred EP",
    tiktokUrl: "",
    photos: ["/src/assets/river-profile-1.jpg", "/src/assets/river-profile-2.jpg"],
    interests: ["Yoga", "Meditation", "Philosophy", "Hiking", "Plant-Based Cooking", "Sound Healing"],
    conversationStarters: [
      "What practice helps you stay centered?",
      "How do you find peace in chaos?"
    ],
    poeticMicrocopy: "love that honors both shadow and light",
    aestheticPreference: "Warm earth tones and natural textures",
    personalityType: "INFJ",
    loveLanguage: "Words of Affirmation",
    vibeGallery: [
      {
        mood: "Meditative",
        description: "Peaceful meditation space",
        tags: ["calm", "centered", "peaceful"],
        image: "/src/assets/vibe-meditative-10.jpg"
      }
    ]
  },
  {
    id: "sage-5",
    name: "Sage",
    age: 29,
    bio: "Traveling documentary filmmaker capturing untold stories from around the world. Currently working on a series about indigenous wisdom traditions and climate resilience.",
    vibeTag: "Global Heart",
    location: "Brooklyn, NY",
    occupation: "Documentary Filmmaker",
    emotionalSoundtrack: "Nils Frahm - Says",
    tiktokUrl: "",
    photos: ["/src/assets/sage-profile-1.jpg", "/src/assets/sage-profile-2.jpg"],
    interests: ["Documentary Film", "Travel", "Cultural Anthropology", "Storytelling", "Languages", "World Music"],
    conversationStarters: [
      "What's a story that changed your perspective on life?",
      "Which culture has taught you the most about yourself?"
    ],
    poeticMicrocopy: "collecting hearts across continents",
    aestheticPreference: "Rich textures and global influences",
    personalityType: "ENFP",
    loveLanguage: "Quality Time",
    vibeGallery: [
      {
        mood: "Reflective",
        description: "Golden hour contemplation",
        tags: ["thoughtful", "wandering", "inspired"],
        image: "/src/assets/vibe-reflective-9.jpg"
      }
    ]
  },
  {
    id: "phoenix-6",
    name: "Phoenix",
    age: 31,
    bio: "Trauma therapist and somatic healer supporting others in their healing journey. Passionate about breaking cycles and creating spaces for authentic vulnerability.",
    vibeTag: "Trust Builder",
    location: "Seattle, WA",
    occupation: "Trauma Therapist",
    emotionalSoundtrack: "Max Richter - On The Nature of Daylight",
    tiktokUrl: "",
    photos: ["/src/assets/phoenix-profile-1.jpg", "/src/assets/phoenix-profile-2.jpg"],
    interests: ["Somatic Healing", "Psychology", "Reading", "Forest Bathing", "Pottery", "Journaling"],
    conversationStarters: [
      "What helps you feel most like yourself?",
      "How do you practice self-compassion?"
    ],
    poeticMicrocopy: "authentic connection over perfect performance",
    aestheticPreference: "Soft colors and comforting textures",
    personalityType: "ISFP",
    loveLanguage: "Physical Touch",
    vibeGallery: [
      {
        mood: "Healing",
        description: "Gentle morning light",
        tags: ["gentle", "healing", "nurturing"],
        image: "/src/assets/vibe-healing-2.jpg"
      }
    ]
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