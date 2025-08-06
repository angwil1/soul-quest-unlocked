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
  echoStarters: string[];
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
    id: "demo-1",
    name: "Luna Celestine",
    age: 26,
    bio: "I find poetry in Tuesday afternoons and magic in mundane moments. My heart speaks in metaphors, my soul dances to rainfall symphonies. Currently reading Neruda while my coffee goes cold, dreaming of conversations that feel like coming home.",
    vibeTag: "Wistful Explorer",
    location: "Portland, OR",
    occupation: "Literary Editor & Weekend Poet",
    emotionalSoundtrack: "Melancholic wonder: Bon Iver's falsetto meets library silence",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo1",
    photos: [
      "/src/assets/luna-profile-1.jpg",
      "/src/assets/luna-profile-2.jpg"
    ],
    interests: ["Vintage bookstores", "Rainy day photography", "Handwritten letters", "Vinyl collecting", "Philosophy cafés"],
    echoStarters: [
      "What's a book that made you cry in public?",
      "Tell me about a moment when time stood still for you",
      "What does your soul sound like when no one's listening?"
    ],
    poeticMicrocopy: "seeking someone who reads between the lines of life",
    aestheticPreference: "Muted earth tones, film grain, golden hour lighting",
    personalityType: "INFP - The Dreamer",
    loveLanguage: "Words of Affirmation",
    vibeGallery: [
      {
        mood: "contemplative",
        description: "Reading poetry by the window while rain traces stories on glass",
        tags: ["melancholy", "peaceful", "introspective"],
        image: "/src/assets/vibe-contemplative-1.jpg"
      },
      {
        mood: "enchanted",
        description: "Found this hidden bookstore that feels like Narnia's library",
        tags: ["magical", "discovery", "wonder"],
        image: "/src/assets/vibe-enchanted-1.jpg"
      }
    ]
  },
  {
    id: "demo-2", 
    name: "River Ashford",
    age: 29,
    bio: "I speak fluent sunrise and find God in guitar strings. Building bridges between broken hearts and forgotten dreams. My therapist says I'm 'emotionally available' - whatever that means. Looking for someone brave enough to be real.",
    vibeTag: "Trust Builder",
    location: "Austin, TX",
    occupation: "Music Therapist & Session Musician",
    emotionalSoundtrack: "Vulnerable strength: Johnny Cash's honesty wrapped in Phoebe Bridgers' tenderness",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo2",
    photos: [
      "/src/assets/river-profile-1.jpg",
      "/src/assets/river-profile-2.jpg"
    ],
    interests: ["Therapy research", "Open mic nights", "Emotional archaeology", "Sacred activism", "Sunrise hikes"],
    echoStarters: [
      "What's the most honest thing you've never said out loud?",
      "How do you hold space for your own healing?",
      "What song plays when your heart feels too full?"
    ],
    poeticMicrocopy: "authentic connection over perfect performance",
    aestheticPreference: "Raw textures, natural lighting, honest moments",
    personalityType: "ENFJ - The Protagonist", 
    loveLanguage: "Quality Time",
    vibeGallery: [
      {
        mood: "healing",
        description: "Today's therapy session: helping someone find their voice again",
        tags: ["purpose", "compassion", "growth"],
        image: "/src/assets/vibe-healing-2.jpg"
      },
      {
        mood: "raw",
        description: "3AM songwriting session - sometimes vulnerability sounds like this",
        tags: ["creative", "honest", "midnight"],
        image: "/src/assets/vibe-raw-2.jpg"
      }
    ]
  },
  {
    id: "demo-3",
    name: "Sage Wildwater",
    age: 24,
    bio: "Forest child with city dreams. I collect stories like seashells and believe in love letters written on napkins. My heart beats in seasons - currently autumn melancholy with hints of spring hope. Seeking a co-conspirator for beautiful adventures.",
    vibeTag: "Private Flame",
    location: "Seattle, WA", 
    occupation: "Environmental Artist & Weekend Barista",
    emotionalSoundtrack: "Gentle rebellion: Fleet Foxes harmonies dancing with Billie Eilish whispers",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo3",
    photos: [
      "/src/assets/sage-profile-1.jpg",
      "/src/assets/sage-profile-2.jpg"
    ],
    interests: ["Forest bathing", "Climate art", "Pressed flower journals", "Thrift store treasures", "Moonrise ceremonies"],
    echoStarters: [
      "What's your secret ritual for connecting with nature?",
      "Tell me about a time you felt most alive",
      "What would you whisper to your younger self?"
    ],
    poeticMicrocopy: "wild hearts that choose each other daily",
    aestheticPreference: "Forest greens, soft textures, ethereal lighting",
    personalityType: "ISFP - The Adventurer",
    loveLanguage: "Acts of Service",
    vibeGallery: [
      {
        mood: "mystical",
        description: "Creating art from fallen leaves - everything has a second life",
        tags: ["creative", "earth", "transformation"],
        image: "/src/assets/vibe-mystical-3.jpg"
      },
      {
        mood: "intimate",
        description: "Secret garden where I go to remember who I am",
        tags: ["private", "sacred", "solitude"],
        image: "/src/assets/vibe-intimate-3.jpg"
      }
    ]
  },
  {
    id: "demo-4",
    name: "Phoenix Merritt",
    age: 31,
    bio: "Reformed people-pleaser learning to love my own voice. I write thank-you notes to my mistakes and paint with my tears. Currently in my 'choosing myself' era while keeping my heart wide open. Seeking someone who isn't afraid of my light.",
    vibeTag: "Authentic Rebel",
    location: "Denver, CO",
    occupation: "Trauma-Informed Life Coach",
    emotionalSoundtrack: "Empowered vulnerability: Lianne La Havas meets Joni Mitchell's fearless truth",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo4", 
    photos: [
      "/src/assets/phoenix-profile-1.jpg",
      "/src/assets/phoenix-profile-2.jpg"
    ],
    interests: ["Boundary setting", "Expressive art therapy", "Mountain meditation", "Conscious communication", "Sacred rage"],
    echoStarters: [
      "What's something you're unlearning about love?",
      "How do you celebrate your own growth?",
      "What does your intuition sound like?"
    ],
    poeticMicrocopy: "done shrinking to fit into small love",
    aestheticPreference: "Bold colors, honest expressions, dramatic lighting",
    personalityType: "ENFP - The Campaigner",
    loveLanguage: "Words of Affirmation",
    vibeGallery: [
      {
        mood: "fierce",
        description: "Setting boundaries feels like coming home to myself",
        tags: ["empowered", "strong", "self-love"],
        image: "/src/assets/vibe-fierce-4.jpg"
      },
      {
        mood: "soft",
        description: "Some mornings I just need to paint my feelings instead of explaining them",
        tags: ["creative", "gentle", "processing"],
        image: "/src/assets/vibe-soft-4.jpg"
      }
    ]
  },
  {
    id: "demo-5",
    name: "Atlas Driftwood",
    age: 27,
    bio: "Professional question-asker, amateur philosopher. I find God in good coffee and deep conversations. My heart is a library of stories I'm still writing. Looking for someone who sees wonder in ordinary Tuesdays and isn't afraid to be seen.",
    vibeTag: "Gentle Philosopher", 
    location: "Asheville, NC",
    occupation: "Podcast Producer & Weekend Farmer",
    emotionalSoundtrack: "Thoughtful presence: Nils Frahm's piano meets the sound of pages turning",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo5",
    photos: [
      "/src/assets/atlas-profile-1.jpg",
      "/src/assets/atlas-profile-2.jpg"
    ],
    interests: ["Slow living", "Philosophy podcasts", "Sourdough bread", "Stargazing", "Handwritten journals"],
    echoStarters: [
      "What question do you wish someone would ask you?",
      "How do you find meaning in mundane moments?",
      "What does your heart know that your mind hasn't figured out yet?"
    ],
    poeticMicrocopy: "believing in love that feels like coming home",
    aestheticPreference: "Warm wood tones, natural light, comfortable textures",
    personalityType: "INTP - The Thinker",
    loveLanguage: "Quality Time",
    vibeGallery: [
      {
        mood: "contemplative",
        description: "Morning coffee ritual: where philosophy meets gratitude",
        tags: ["peaceful", "mindful", "morning"],
        image: "/src/assets/vibe-contemplative-5.jpg"
      },
      {
        mood: "connected",
        description: "Best conversations happen when hands are busy with soil",
        tags: ["grounded", "present", "growth"],
        image: "/src/assets/vibe-connected-5.jpg"
      }
    ]
  },
  {
    id: "demo-6",
    name: "Iris Moonchild",
    age: 25,
    bio: "Cosmic romantic with earthbound dreams. I read tarot for my houseplants and believe in love that feels like magic. Currently learning to trust my intuition while keeping my feet on solid ground. Seeking someone who believes in everyday enchantment.",
    vibeTag: "Mystical Romantic",
    location: "Santa Fe, NM",
    occupation: "Holistic Wellness Practitioner",
    emotionalSoundtrack: "Ethereal grounding: FKA twigs' otherworldly vocals wrapped in forest sounds",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo6",
    photos: [
      "/src/assets/iris-profile-1.jpg",
      "/src/assets/iris-profile-2.jpg"
    ],
    interests: ["Crystal healing", "Moon rituals", "Herbal medicine", "Sacred geometry", "Energy work"],
    echoStarters: [
      "What's your relationship with magic and mystery?",
      "How do you honor the cycles in your life?",
      "What does your soul crave that your mind can't name?"
    ],
    poeticMicrocopy: "love that honors both shadow and light",
    aestheticPreference: "Crystalline textures, soft pastels, mystical lighting",
    personalityType: "INFJ - The Advocate",
    loveLanguage: "Physical Touch",
    vibeGallery: [
      {
        mood: "ritualistic",
        description: "New moon intention setting with my crystal collection",
        tags: ["mystical", "intentional", "sacred"],
        image: "/src/assets/vibe-ritualistic-6.jpg"
      },
      {
        mood: "nurturing",
        description: "Tending to my plant babies - they tell me their secrets",
        tags: ["gentle", "caring", "connected"],
        image: "/src/assets/vibe-nurturing-6.jpg"
      }
    ]
  },
  {
    id: "demo-7",
    name: "Ocean Clearwater",
    age: 28,
    bio: "Salt-water soul with wanderlust bones. I collect sunrise photos and believe in love letters written in the sand. My heart speaks in tide pools and sunset languages. Currently learning to surf life's waves with grace and wild abandon.",
    vibeTag: "Free Spirit",
    location: "San Diego, CA",
    occupation: "Marine Conservation Photographer",
    emotionalSoundtrack: "Ocean depth: Jack Johnson's warmth meeting the rhythm of breaking waves",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo7",
    photos: [
      "/src/assets/ocean-profile-1.jpg",
      "/src/assets/ocean-profile-2.jpg"
    ],
    interests: ["Ocean conservation", "Surf photography", "Beach cleanups", "Whale watching", "Saltwater therapy"],
    echoStarters: [
      "What does freedom mean to your soul?",
      "How does the ocean make you feel?",
      "What adventure is calling your name?"
    ],
    poeticMicrocopy: "seeking a love as deep as the ocean",
    aestheticPreference: "Ocean blues, natural textures, golden hour warmth",
    personalityType: "ESFP - The Entertainer",
    loveLanguage: "Physical Touch",
    vibeGallery: [
      {
        mood: "adventurous",
        description: "Caught this perfect wave and felt infinite for a moment",
        tags: ["free", "alive", "ocean"],
        image: "/src/assets/vibe-adventurous-7.jpg"
      },
      {
        mood: "protective",
        description: "Documenting the beauty we need to protect",
        tags: ["passionate", "purpose", "conservation"],
        image: "/src/assets/vibe-protective-7.jpg"
      }
    ]
  },
  {
    id: "demo-8",
    name: "Ember Nightingale",
    age: 30,
    bio: "Midnight poet with morning coffee rituals. I write love songs for broken hearts and find beauty in the spaces between words. My soul speaks in metaphors, my heart beats in verses. Seeking someone who isn't afraid of depth or darkness.",
    vibeTag: "Poetic Soul",
    location: "Nashville, TN",
    occupation: "Singer-Songwriter & Creative Writing Teacher",
    emotionalSoundtrack: "Velvet vulnerability: Lana Del Rey's cinematic sadness meets hope",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo8",
    photos: [
      "/src/assets/ember-profile-1.jpg",
      "/src/assets/ember-profile-2.jpg"
    ],
    interests: ["Songwriting", "Poetry slams", "Vintage vinyl", "Late night coffee shops", "Emotional archaeology"],
    echoStarters: [
      "What's a lyric that lives in your bones?",
      "How do you turn pain into art?",
      "What story is your heart trying to tell?"
    ],
    poeticMicrocopy: "love that feels like the perfect verse",
    aestheticPreference: "Moody lighting, rich textures, intimate shadows",
    personalityType: "ISFJ - The Protector",
    loveLanguage: "Words of Affirmation",
    vibeGallery: [
      {
        mood: "creative",
        description: "3AM inspiration hitting different when the world is sleeping",
        tags: ["artistic", "late-night", "inspired"],
        image: "/src/assets/vibe-creative-8.jpg"
      },
      {
        mood: "intimate",
        description: "Sharing my newest song with the coffee shop regular who always listens",
        tags: ["vulnerable", "connecting", "brave"],
        image: "/src/assets/vibe-intimate-8.jpg"
      }
    ]
  },
  {
    id: "demo-9",
    name: "Story Wanderlust",
    age: 26,
    bio: "Travel writer with a permanent address in curiosity. I believe every person is a universe waiting to be explored. My passport is full but my heart has infinite space. Currently writing about the places that change us and the people who feel like home.",
    vibeTag: "Global Heart",
    location: "Nomadic (Currently: Lisbon)",
    occupation: "Travel Writer & Cultural Anthropologist",
    emotionalSoundtrack: "Wandering wonder: World music fusion meets the sound of train stations",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo9",
    photos: [
      "/src/assets/story-profile-1.jpg",
      "/src/assets/story-profile-2.jpg"
    ],
    interests: ["Cultural immersion", "Language learning", "Street food adventures", "Local storytelling", "Border-crossing"],
    echoStarters: [
      "What place has changed you the most?",
      "How do you find home in unfamiliar spaces?",
      "What story does your heart want to tell the world?"
    ],
    poeticMicrocopy: "collecting hearts across continents",
    aestheticPreference: "Global textures, warm earth tones, authentic moments",
    personalityType: "ENFJ - The Protagonist",
    loveLanguage: "Quality Time",
    vibeGallery: [
      {
        mood: "adventurous",
        description: "Lost in Lisbon's backstreets, found in conversation with strangers",
        tags: ["exploration", "connection", "discovery"],
        image: "/src/assets/vibe-adventurous-9.jpg"
      },
      {
        mood: "reflective",
        description: "Writing postcards to my future self from this rooftop in Alfama",
        tags: ["thoughtful", "romantic", "dreaming"],
        image: "/src/assets/vibe-reflective-9.jpg"
      }
    ]
  },
  {
    id: "demo-10",
    name: "Cedar Moonbeam",
    age: 29,
    bio: "Forest keeper with city dreams. I speak tree and understand the language of growing things. My heart is part wild, part wonder, part hope for healing our world. Seeking someone who sees magic in muddy boots and dreams in garden soil.",
    vibeTag: "Earth Guardian",
    location: "Bellingham, WA",
    occupation: "Permaculture Designer & Herbalist",
    emotionalSoundtrack: "Grounded magic: Bon Iver's forest sounds meet the whisper of wind through leaves",
    tiktokUrl: "https://www.tiktok.com/@user/video/demo10",
    photos: [
      "/src/assets/cedar-profile-1.jpg",
      "/src/assets/cedar-profile-2.jpg"
    ],
    interests: ["Permaculture", "Herbal medicine", "Forest restoration", "Mushroom foraging", "Seed saving"],
    echoStarters: [
      "What does the earth whisper to you?",
      "How do you practice gratitude to the natural world?",
      "What would you plant if you knew love would grow?"
    ],
    poeticMicrocopy: "cultivating love that regenerates the world",
    aestheticPreference: "Forest greens, natural textures, organic forms",
    personalityType: "ISFP - The Adventurer",
    loveLanguage: "Acts of Service",
    vibeGallery: [
      {
        mood: "nurturing",
        description: "Teaching kids how to save seeds for next year's garden",
        tags: ["teaching", "hope", "growth"],
        image: "/src/assets/vibe-nurturing-10.jpg"
      },
      {
        mood: "meditative",
        description: "Morning ritual: coffee with the sunrise, gratitude with the trees",
        tags: ["peaceful", "connected", "sacred"],
        image: "/src/assets/vibe-meditative-10.jpg"
      }
    ]
  }
];

export const echoStarters = [
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