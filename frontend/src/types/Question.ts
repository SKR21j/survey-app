export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'CHECKBOX' | 'SLIDER';

export interface QuestionOption {
  id: number;
  text: string;
  order: number;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  required: boolean;
  order: number;
  options: QuestionOption[];
}

export interface QuestionFormData {
  text: string;
  type: QuestionType;
  required: boolean;
  options: { text: string }[];
}
