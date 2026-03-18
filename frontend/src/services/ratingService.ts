import api from './api';
import { Rating, RatingRequest, RatingSummary } from '../types/Rating';

interface BackendRating {
  id: number;
  surveyId?: number;
  userId?: number;
  survey?: { id: number };
  user?: { id: number };
  score: number;
  comment?: string;
  createdAt?: string;
}

function mapRating(data: BackendRating, fallbackSurveyId?: number): Rating {
  return {
    id: data.id,
    surveyId: data.surveyId ?? data.survey?.id ?? fallbackSurveyId ?? 0,
    userId: data.userId ?? data.user?.id ?? 0,
    value: data.score,
    comment: data.comment,
    createdAt: data.createdAt ?? '',
  };
}

export const ratingService = {
  async rateSurvey(data: RatingRequest): Promise<Rating> {
    const response = await api.post<BackendRating>(
      `/surveys/${data.surveyId}/ratings`,
      null,
      {
        params: {
          score: data.value,
          ...(data.comment ? { comment: data.comment } : {}),
        },
      }
    );
    return mapRating(response.data, data.surveyId);
  },

  async getSurveyRatings(surveyId: number): Promise<Rating[]> {
    const response = await api.get<BackendRating[]>(`/surveys/${surveyId}/ratings`);
    return response.data.map((rating) => mapRating(rating, surveyId));
  },

  async getSurveySummary(surveyId: number): Promise<RatingSummary> {
    const response = await api.get<{ surveyId: number; averageRating: number }>(`/surveys/${surveyId}/average-rating`);
    return {
      surveyId: response.data.surveyId,
      averageRating: response.data.averageRating,
      totalRatings: 0,
      distribution: [],
    };
  },
};
