-- Remove duplicate questions and update with focused compatibility questions
DELETE FROM questions WHERE id IN (34, 35, 36, 37);

-- Clear existing questions and create a comprehensive AI compatibility quiz
DELETE FROM questions;

-- Insert focused AI compatibility matching questions
INSERT INTO questions (id, "Text", question_type, options) VALUES
(1, 'How do you prefer to communicate in relationships?', 'singleSelect', ARRAY['Direct and straightforward - I say what I mean', 'Thoughtful and diplomatic - I choose words carefully', 'Expressive and emotional - I share how I feel', 'Patient and listening - I prefer to understand first']),

(2, 'What is your ideal way to spend quality time together?', 'singleSelect', ARRAY['Deep conversations and emotional connection', 'Shared adventures and new experiences', 'Quiet companionship and peaceful moments', 'Fun activities and playful interactions']),

(3, 'How do you handle stress and challenges?', 'singleSelect', ARRAY['I talk through problems with others', 'I need alone time to process and think', 'I stay busy and focus on solutions', 'I seek support from family and friends']),

(4, 'What are your core relationship values?', 'singleSelect', ARRAY['Trust, honesty, and transparency', 'Growth, adventure, and new experiences', 'Stability, security, and commitment', 'Fun, spontaneity, and living in the moment']),

(5, 'How do you prefer to resolve conflicts?', 'singleSelect', ARRAY['Address issues immediately and directly', 'Take time to cool down, then discuss calmly', 'Find creative compromises that work for both', 'Focus on understanding each other''s perspective']),

(6, 'What is your social energy style?', 'singleSelect', ARRAY['I thrive with lots of social interaction', 'I prefer small groups and close friends', 'I enjoy socializing but need quiet time to recharge', 'I''m most comfortable in one-on-one settings']),

(7, 'How important is personal growth in a relationship?', 'singleSelect', ARRAY['Essential - we should grow together constantly', 'Important - supporting each other''s development', 'Moderate - balance growth with stability', 'Natural - growth happens organically over time']),

(8, 'What is your approach to life planning?', 'singleSelect', ARRAY['I like detailed plans and clear goals', 'I prefer flexible plans with room for change', 'I balance planning with spontaneity', 'I live more in the present moment']),

(9, 'How do you express and receive love?', 'singleSelect', ARRAY['Words of affirmation and verbal appreciation', 'Quality time and undivided attention', 'Physical touch and closeness', 'Acts of service and thoughtful gestures']),

(10, 'What role does family play in your ideal relationship?', 'singleSelect', ARRAY['Very close - family is central to our life', 'Important - regular contact and involvement', 'Balanced - connected but independent', 'Flexible - depends on the situation']),

(11, 'How do you approach decision-making as a couple?', 'singleSelect', ARRAY['We discuss everything and decide together', 'We divide decisions based on our strengths', 'We talk it through but trust each other''s judgment', 'We make individual choices and share the results']),

(12, 'What best describes your ideal relationship dynamic?', 'singleSelect', ARRAY['Equal partners supporting each other''s dreams', 'Complementary strengths that balance each other', 'Best friends who share everything together', 'Independent individuals who choose to be together']);

-- Reset the sequence to continue from 13
SELECT setval('questions_id_seq', 12, true);