-- Delete existing questions and insert properly formatted ones
DELETE FROM public.questions;

-- Insert questions with proper JSON formatting
INSERT INTO public.questions (Text, question_type, options) VALUES
('How do you prefer to spend your weekends?', 'singleSelect', '["Relaxing at home with a book or movie", "Going out and socializing with friends", "Exploring new places or trying new activities", "Catching up on work or personal projects"]'),
('What is your ideal vacation destination?', 'singleSelect', '["A quiet beach resort", "A bustling city full of culture and nightlife", "A remote mountain retreat", "An adventurous trip like hiking or safaris"]'),
('How do you handle conflicts in a relationship?', 'singleSelect', '["I prefer to talk it out immediately", "I need some time to cool off before discussing", "I avoid confrontation and hope it resolves itself", "I rely on a third party to mediate"]'),
('What is your love language?', 'singleSelect', '["Words of affirmation", "Acts of service", "Receiving gifts", "Quality time or physical touch"]'),
('How do you feel about sharing finances in a relationship?', 'singleSelect', '["I prefer to keep finances separate", "I am open to partial sharing of finances", "I believe in fully combining finances", "I have not thought much about it"]'),
('What is your ideal first date?', 'singleSelect', '["Coffee and conversation", "Dinner at a nice restaurant", "An outdoor activity like hiking", "Something creative like a museum or art gallery"]'),
('How important is it that your partner shares your interests?', 'likert', '["Very important", "Somewhat important", "Neutral", "Not very important", "Not important at all"]'),
('What is your communication style?', 'singleSelect', '["Direct and straightforward", "Thoughtful and diplomatic", "Casual and relaxed", "Expressive and emotional"]'),
('How do you prefer to resolve disagreements?', 'singleSelect', '["Discuss immediately", "Take time to think first", "Find a compromise", "Agree to disagree"]'),
('What role does family play in your life?', 'singleSelect', '["Very close and involved", "Important but independent", "Somewhat distant", "Complicated relationship"]');