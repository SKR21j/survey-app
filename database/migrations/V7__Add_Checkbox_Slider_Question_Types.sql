-- V7__Add_Checkbox_Slider_Question_Types.sql
-- Extend the questions type CHECK constraint to include CHECKBOX and SLIDER

ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check;

ALTER TABLE questions ADD CONSTRAINT questions_type_check
  CHECK (type IN ('TEXT', 'MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'RATING', 'YES_NO', 'CHECKBOX', 'SLIDER'));
