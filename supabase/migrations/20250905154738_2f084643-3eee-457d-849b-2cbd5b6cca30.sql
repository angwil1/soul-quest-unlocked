-- Add 2 more questions to reach 12 total
INSERT INTO questions ("Text", question_type, options) VALUES 
('How would you describe your social energy?', 'singleSelect', ARRAY['I thrive in large social gatherings', 'I prefer small intimate groups', 'I enjoy both but need alone time to recharge', 'I am most comfortable in one-on-one settings']),
('What are your long-term relationship goals?', 'singleSelect', ARRAY['Marriage and building a family together', 'Long-term committed partnership', 'Taking things one day at a time', 'Focusing on personal growth first']);