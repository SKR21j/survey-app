export interface Answer {
  questionId: number;
  value: string | string[];
}

export interface SurveyResponse {
  id: number;
  surveyId: number;
  userId: number;
  answers: Answer[];
  submittedAt: string;
}

export interface ResponseSubmission {
  surveyId: number;
  answers: Answer[];
}

export interface ResponseStats {
  questionId: number;
  questionText: string;
  questionType: string;
  answers: { value: string; count: number }[];
  totalResponses: number;
}
