import api from './api';
import { Answer, ResponseStats, ResponseSubmission, SurveyResponse } from '../types/Response';

export const responseService = {
  async submitResponse(data: ResponseSubmission): Promise<SurveyResponse> {
    const response = await api.post<SurveyResponse>('/responses', data);
    return response.data;
  },

  async getResponses(surveyId: number): Promise<SurveyResponse[]> {
    const response = await api.get<SurveyResponse[]>(`/responses/survey/${surveyId}`);
    return response.data;
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
