-- V6__Insert_Test_Data.sql
-- Insert test data for development and testing purposes

-- Test users (passwords are bcrypt hashes of 'password123')
INSERT INTO users (id, username, email, password, role) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@survey-app.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'john_doe', 'john@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'jane_smith', 'jane@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER');

-- Test surveys
INSERT INTO surveys (id, title, description, creator_id, status) VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'Customer Satisfaction Survey',
   'Help us improve our services by answering a few questions.',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PUBLISHED'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'Employee Feedback Survey',
   'Annual employee satisfaction and engagement survey.',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PUBLISHED'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'Product Feature Request',
   'Tell us which features you would like to see next.',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'DRAFT');

-- Test questions for Customer Satisfaction Survey
INSERT INTO questions (id, survey_id, question_text, question_type, required, question_order) VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
   'How satisfied are you with our service overall?', 'RATING', TRUE, 1),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12',
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
   'What did you like most about our service?', 'TEXT', FALSE, 2),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13',
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
   'How likely are you to recommend us to a friend?', 'MULTIPLE_CHOICE', TRUE, 3);

-- Test questions for Employee Feedback Survey
INSERT INTO questions (id, survey_id, question_text, question_type, required, question_order) VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c21',
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12',
   'How satisfied are you with your current role?', 'RATING', TRUE, 1),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22',
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12',
   'Do you feel your work is recognized and valued?', 'MULTIPLE_CHOICE', TRUE, 2);

-- Test question options for multiple choice questions
INSERT INTO question_options (id, question_id, option_text, option_order) VALUES
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'Very likely', 1),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'Somewhat likely', 2),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'Unlikely', 3),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'Always', 1),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d15',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'Sometimes', 2),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d16',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'Rarely', 3),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d17',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'Never', 4);

-- Test responses
INSERT INTO responses (id, survey_id, user_id) VALUES
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12',
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');

-- Test answers
INSERT INTO answers (response_id, question_id, answer_text, rating_value) VALUES
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', NULL, 5),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'Great service and friendly staff!', NULL),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', NULL, 4),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12',
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'Good value for money.', NULL);

-- Test ratings
INSERT INTO ratings (survey_id, user_id, rating) VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 5),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 4),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12',
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 3);
