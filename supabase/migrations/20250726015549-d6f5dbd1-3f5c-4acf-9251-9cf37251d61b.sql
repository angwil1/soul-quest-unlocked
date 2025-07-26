-- Fix the questions table options data to be proper JSON format
UPDATE public.questions 
SET options = CASE 
  WHEN id = 4 THEN '["Relaxing at home with a book or movie", "Going out and socializing with friends", "Exploring new places or trying new activities", "Catching up on work or personal projects"]'::jsonb
  WHEN id = 5 THEN '["A quiet beach resort", "A bustling city full of culture and nightlife", "A remote mountain retreat", "An adventurous trip like hiking or safaris"]'::jsonb
  WHEN id = 6 THEN '["I prefer to talk it out immediately", "I need some time to cool off before discussing", "I avoid confrontation and hope it resolves itself", "I rely on a third party to mediate"]'::jsonb
  WHEN id = 7 THEN '["Words of affirmation", "Acts of service", "Receiving gifts", "Quality time or physical touch"]'::jsonb
  WHEN id = 8 THEN '["I prefer to keep finances separate", "I'\''m open to partial sharing of finances", "I believe in fully combining finances", "I haven'\''t thought much about it"]'::jsonb
  ELSE options
END
WHERE id IN (4, 5, 6, 7, 8);

-- Add a few more questions to make the questionnaire more comprehensive
INSERT INTO public.questions (Text, question_type, options) VALUES
('What'\''s your ideal first date?', 'singleSelect', '["Coffee and conversation", "Dinner at a nice restaurant", "An outdoor activity like hiking", "Something creative like a museum or art gallery"]'::jsonb),
('How important is it that your partner shares your interests?', 'likert', '["Very important", "Somewhat important", "Neutral", "Not very important", "Not important at all"]'::jsonb),
('What'\''s your communication style?', 'singleSelect', '["Direct and straightforward", "Thoughtful and diplomatic", "Casual and relaxed", "Expressive and emotional"]'::jsonb),
('How do you prefer to resolve disagreements?', 'singleSelect', '["Discuss immediately", "Take time to think first", "Find a compromise", "Agree to disagree"]'::jsonb),
('What role does family play in your life?', 'singleSelect', '["Very close and involved", "Important but independent", "Somewhat distant", "Complicated relationship"]'::jsonb);