import { Question } from './Question';
import { User } from './User';

export type SurveyStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

export interface Survey {
  id: number;
  title: string;
  description: string;
  status: SurveyStatus;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  responseCount?: number;
  averageRating?: number;
}

export interface SurveyFormData {
  title: string;
  description: string;
  status: SurveyStatus;
  questions: {
    text: string;
    type: string;
    required: boolean;
    options: { text: string }[];
  }[];
}

export interface SurveyListParams {
  search?: string;
  status?: SurveyStatus;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}
