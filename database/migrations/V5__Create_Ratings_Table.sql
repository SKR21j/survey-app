-- V5__Create_Ratings_Table.sql
-- Create ratings table

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (survey_id, user_id)
);

CREATE INDEX idx_ratings_survey_id ON ratings (survey_id);
CREATE INDEX idx_ratings_user_id ON ratings (user_id);
