import api from './api';
import { Answer, ResponseStats, ResponseSubmission, SurveyResponse } from '../types/Response';

interface PageResponse<T> {
  content?: T[];
}

interface BackendAnswer {
  value: string;
}

interface BackendResponse {
  id: number;
  submittedAt: string;
  answers?: BackendAnswer[];
  user?: {
    id?: number;
    username?: string;
  };
}

function mapBackendResponse(surveyId: number, item: BackendResponse): SurveyResponse {
  return {
    id: item.id,
    surveyId,
    userId: item.user?.id ?? 0,
    username: item.user?.username,
    submittedAt: item.submittedAt,
    answers: (item.answers ?? []).map((a, index) => ({
      questionId: index,
      value: a.value,
    })),
  };
}

export const responseService = {
  async submitResponse(data: ResponseSubmission): Promise<void> {
    await api.post('/responses', data);
  },

  async getResponses(surveyId: number): Promise<SurveyResponse[]> {
    const response = await api.get<PageResponse<BackendResponse>>(`/surveys/${surveyId}/responses`);
    const content = response.data?.content ?? [];
    return content.map((item) => mapBackendResponse(surveyId, item));
  },

  async getResponseById(id: number): Promise<SurveyResponse> {
    const response = await api.get<SurveyResponse>(`/responses/${id}`);
    return response.data;
  },

  async getResponseStats(surveyId: number): Promise<ResponseStats[]> {
    const response = await api.get<ResponseStats[]>(`/responses/survey/${surveyId}/stats`);
    return response.data;
  },

  async getUserResponse(surveyId: number): Promise<Answer[]> {
    const response = await api.get<Answer[]>(`/responses/survey/${surveyId}/my`);
    return response.data;
  },
};
