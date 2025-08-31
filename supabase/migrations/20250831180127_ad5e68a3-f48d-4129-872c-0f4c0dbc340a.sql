-- Create questions table for the quiz (with correct column names)
CREATE TABLE IF NOT EXISTS public.questions (
  id SERIAL PRIMARY KEY,
  "Text" TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'likert',
  category TEXT NOT NULL,
  options JSONB DEFAULT NULL,
  weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read questions
CREATE POLICY "Everyone can read questions"
ON public.questions
FOR SELECT
USING (true);

-- Insert comprehensive quiz questions
INSERT INTO public.questions ("Text", question_type, category, weight) VALUES
-- Personality & Values
('I enjoy being the center of attention at social gatherings', 'likert', 'personality', 1.0),
('I prefer deep, meaningful conversations over small talk', 'likert', 'personality', 1.2),
('I make decisions based on logic rather than emotions', 'likert', 'personality', 1.0),
('I value stability and routine over spontaneity and adventure', 'likert', 'lifestyle', 1.1),
('Family is the most important thing in my life', 'likert', 'values', 1.3),

-- Communication Style
('I prefer to discuss problems immediately rather than let them simmer', 'likert', 'communication', 1.2),
('I express love through physical touch more than words', 'likert', 'love_language', 1.1),
('I need alone time to recharge after social interactions', 'likert', 'personality', 1.0),
('I am comfortable sharing my deepest thoughts and feelings', 'likert', 'communication', 1.2),
('I prefer to show love through acts of service', 'likert', 'love_language', 1.1),

-- Lifestyle & Goals
('I want to have children someday', 'likert', 'goals', 1.5),
('I prioritize my career over personal relationships', 'likert', 'priorities', 1.2),
('I enjoy trying new restaurants and cuisines regularly', 'likert', 'lifestyle', 0.8),
('I prefer staying in rather than going out on weekends', 'likert', 'lifestyle', 0.9),
('Financial security is more important than following my passion', 'likert', 'values', 1.1),

-- Relationship Style
('I need constant reassurance from my partner', 'likert', 'attachment', 1.3),
('I believe in soulmates and "the one"', 'likert', 'romance', 0.9),
('I am comfortable with my partner having close friends of the opposite gender', 'likert', 'trust', 1.2),
('I prefer to maintain some independence even in committed relationships', 'likert', 'attachment', 1.1),
('I believe couples should share most of their interests and hobbies', 'likert', 'compatibility', 1.0),

-- Conflict Resolution
('I avoid confrontation at all costs', 'likert', 'conflict', 1.2),
('I believe in fighting for what I want in a relationship', 'likert', 'conflict', 1.1),
('I can forgive but I never forget', 'likert', 'forgiveness', 1.0),
('I prefer to resolve conflicts through calm discussion', 'likert', 'conflict', 1.2),
('I need time to cool off before addressing relationship issues', 'likert', 'conflict', 1.0);

-- Multiple choice questions
INSERT INTO public.questions ("Text", question_type, category, options, weight) VALUES
('What is your ideal way to spend a weekend?', 'singleSelect', 'lifestyle', 
 '["Exploring a new city or hiking trail", "Cozy night in with movies and takeout", "Social gathering with friends and family", "Working on personal projects or hobbies", "Attending cultural events like concerts or museums"]', 1.0),

('How do you prefer to receive love?', 'singleSelect', 'love_language',
 '["Words of affirmation and compliments", "Quality time and undivided attention", "Physical touch and affection", "Acts of service and helpful gestures", "Thoughtful gifts and surprises"]', 1.3),

('What matters most in a long-term partner?', 'singleSelect', 'priorities',
 '["Emotional intelligence and empathy", "Shared values and life goals", "Physical attraction and chemistry", "Financial stability and ambition", "Sense of humor and fun personality"]', 1.4),

('How do you handle stress?', 'singleSelect', 'coping',
 '["Talk it out with friends or family", "Exercise or physical activity", "Alone time for reflection", "Distraction through entertainment", "Problem-solving and action plans"]', 1.1),

('What role should religion/spirituality play in a relationship?', 'singleSelect', 'spirituality',
 '["Essential - we must share the same beliefs", "Important - similar spiritual values matter", "Neutral - respect each others beliefs", "Unimportant - focus on other compatibility factors", "Prefer a secular relationship"]', 1.2);