export interface Rating {
  id: number;
  surveyId: number;
  userId: number;
  value: number;
  comment?: string;
  createdAt: string;
}

export interface RatingRequest {
  surveyId: number;
  value: number;
  comment?: string;
}

export interface RatingSummary {
  surveyId: number;
  averageRating: number;
  totalRatings: number;
  distribution: { stars: number; count: number }[];
}
