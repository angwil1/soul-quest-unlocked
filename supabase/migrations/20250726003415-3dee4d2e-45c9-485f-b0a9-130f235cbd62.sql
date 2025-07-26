-- Update questions table to support both types
ALTER TABLE public.questions 
ADD COLUMN question_type text DEFAULT 'likert',
ADD COLUMN options jsonb DEFAULT NULL;

-- Clear existing questions
DELETE FROM public.questions;

-- Insert the new multiple choice questions
INSERT INTO public.questions (text, question_type, options) VALUES 
('How do you prefer to spend your weekends?', 'singleSelect', '["Relaxing at home with a book or movie", "Going out and socializing with friends", "Exploring new places or trying new activities", "Catching up on work or personal projects"]'),
('What is your ideal vacation destination?', 'singleSelect', '["A quiet beach resort", "A bustling city full of culture and nightlife", "A remote mountain retreat", "An adventurous trip like hiking or safaris"]'),
('How do you handle conflicts in a relationship?', 'singleSelect', '["I prefer to talk it out immediately", "I need some time to cool off before discussing", "I avoid confrontation and hope it resolves itself", "I rely on a third party to mediate"]'),
('What is your love language?', 'singleSelect', '["Words of affirmation", "Acts of service", "Receiving gifts", "Quality time or physical touch"]'),
('How do you feel about sharing finances in a relationship?', 'singleSelect', '["I prefer to keep finances separate", "I''m open to partial sharing of finances", "I believe in fully combining finances", "I haven''t thought much about it"]'),
('What is your approach to planning for the future?', 'singleSelect', '["I like to plan everything in detail", "I prefer to go with the flow", "I have a general idea but stay flexible", "I don''t think much about the future"]'),
('How do you prefer to celebrate special occasions?', 'singleSelect', '["A big party with friends and family", "A quiet, intimate celebration", "A spontaneous adventure", "I don''t usually celebrate much"]'),
('What is your stance on having children?', 'singleSelect', '["I definitely want children", "I''m not sure yet", "I don''t want children", "I''m open to either option"]'),
('How do you usually spend your free time?', 'singleSelect', '["Engaging in hobbies or personal interests", "Spending time with friends or family", "Relaxing and doing nothing in particular", "Working on self-improvement or learning"]'),
('How do you feel about pets in a relationship?', 'singleSelect', '["I love pets and want them in my life", "I''m okay with pets but don''t want to own one", "I''m not a fan of pets", "I''m allergic or have other concerns about pets"]'),
('What is your preferred way to communicate in a relationship?', 'singleSelect', '["Frequent texting or calling throughout the day", "Checking in once or twice a day", "Communicating only when necessary", "I prefer in-person communication over digital"]'),
('How do you feel about long-distance relationships?', 'singleSelect', '["I''m open to them if necessary", "I prefer to avoid them", "I think they can work with effort", "I don''t believe in long-distance relationships"]'),
('What is your approach to health and fitness?', 'singleSelect', '["I prioritize regular exercise and healthy eating", "I try to stay active but don''t stress about it", "I''m not very focused on health and fitness", "I''m actively working on improving my health"]'),
('How do you feel about sharing household responsibilities?', 'singleSelect', '["I believe in splitting tasks equally", "I prefer to take on specific tasks I enjoy", "I''m okay with one person doing more if agreed upon", "I don''t think much about it"]'),
('What is your attitude toward personal space in a relationship?', 'singleSelect', '["I need a lot of personal space", "I enjoy spending most of my time with my partner", "I like a balance between personal space and togetherness", "I haven''t thought much about it"]'),
-- Add some Likert scale questions
('I value deep emotional connections in relationships', 'likert', NULL),
('I prefer planned activities over spontaneous ones', 'likert', NULL),
('Physical attraction is very important to me', 'likert', NULL),
('I believe in traditional relationship roles', 'likert', NULL),
('I am comfortable expressing my emotions', 'likert', NULL);