import api from './api';
import { Survey, SurveyFormData, SurveyListParams } from '../types/Survey';

export const surveyService = {
  async getSurveys(params?: SurveyListParams): Promise<Survey[]> {
    const response = await api.get<Survey[]>('/surveys', { params });
    return response.data;
  },

  async getActiveSurveys(): Promise<Survey[]> {
    const response = await api.get<Survey[]>('/surveys', { params: { status: 'ACTIVE' } });
    return response.data;
  },

  async getSurvey(id: number): Promise<Survey> {
    const response = await api.get<Survey>(`/surveys/${id}`);
    return response.data;
  },

  async createSurvey(data: SurveyFormData): Promise<Survey> {
    const response = await api.post<Survey>('/surveys', data);
    return response.data;
  },

  async updateSurvey(id: number, data: Partial<SurveyFormData>): Promise<Survey> {
    const response = await api.put<Survey>(`/surveys/${id}`, data);
    return response.data;
  },

  async deleteSurvey(id: number): Promise<void> {
    await api.delete(`/surveys/${id}`);
  },
};
