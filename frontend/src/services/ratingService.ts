import api from './api';
import { Rating, RatingRequest, RatingSummary } from '../types/Rating';

export const ratingService = {
  async rateSurvey(data: RatingRequest): Promise<Rating> {
    const response = await api.post<Rating>('/ratings', data);
    return response.data;
  },

  async getSurveyRatings(surveyId: number): Promise<Rating[]> {
    const response = await api.get<Rating[]>(`/ratings/survey/${surveyId}`);
    return response.data;
  },

  async getSurveySummary(surveyId: number): Promise<RatingSummary> {
    const response = await api.get<RatingSummary>(`/ratings/survey/${surveyId}/summary`);
    return response.data;
  },
};
