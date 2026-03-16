-- V4__Create_Responses_Tables.sql
-- Create responses and answers tables

CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (survey_id, user_id)
);

CREATE INDEX idx_responses_survey_id ON responses (survey_id);
CREATE INDEX idx_responses_user_id ON responses (user_id);

CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_response_id ON answers (response_id);
CREATE INDEX idx_answers_question_id ON answers (question_id);
