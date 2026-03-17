import api from './api';
import { Survey, SurveyFormData, SurveyListParams } from '../types/Survey';
import { User } from '../types/User';

interface PageResponse<T> {
  content?: T[];
}

interface BackendQuestion {
  id?: number;
  text: string;
  type: string;
  required: boolean;
  displayOrder?: number;
  options?: string[];
}

interface BackendSurvey {
  id: number;
  title: string;
  description: string;
  active: boolean;
  questions?: BackendQuestion[];
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    username?: string;
    email?: string;
    role?: 'ADMIN' | 'USER';
  };
  responseCount?: number;
  averageRating?: number;
}

function mapBackendSurvey(s: BackendSurvey): Survey {
  const createdBy: User = {
    id: s.createdBy?.id ?? 0,
    name: s.createdBy?.username ?? 'Unknown',
    email: s.createdBy?.email ?? '',
    role: s.createdBy?.role ?? 'USER',
  };

  return {
    id: s.id,
    title: s.title,
    description: s.description,
    status: s.active ? 'ACTIVE' : 'DRAFT',
    questions: (s.questions ?? []).map((q, index) => ({
      id: q.id ?? index,
      text: q.text,
      type: q.type as 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'CHECKBOX',
      required: q.required,
      order: q.displayOrder ?? index + 1,
      options: (q.options ?? []).map((optionText, optionIndex) => ({
        id: optionIndex,
        text: optionText,
        order: optionIndex + 1,
      })),
    })),
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    createdBy,
    responseCount: s.responseCount,
    averageRating: s.averageRating,
  };
}

function normalizeSurveyListResponse(data: BackendSurvey[] | PageResponse<BackendSurvey> | undefined): Survey[] {
  if (Array.isArray(data)) {
    return data.map(mapBackendSurvey);
  }

  if (data && Array.isArray(data.content)) {
    return data.content.map(mapBackendSurvey);
  }

  return [];
}

function applyClientFilters(surveys: Survey[], params?: SurveyListParams): Survey[] {
  if (!params) {
    return surveys;
  }

  let filtered = [...surveys];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((s) =>
      s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
    );
  }

  if (params.status) {
    filtered = filtered.filter((s) => s.status === params.status);
  }

  if (params.sort) {
    filtered.sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return params.sort === 'asc' ? at - bt : bt - at;
    });
  }

  return filtered;
}

function mapSurveyFormToBackend(data: Partial<SurveyFormData>) {
  return {
    title: data.title ?? '',
    description: data.description ?? '',
    active: data.status === 'ACTIVE',
    questions: (data.questions ?? []).map((q, index) => ({
      text: q.text,
      type: q.type,
      required: q.required,
      displayOrder: index + 1,
      options: q.options
        .map((o) => o.text?.trim())
        .filter((o): o is string => Boolean(o)),
    })),
  };
}

export const surveyService = {
  async getSurveys(params?: SurveyListParams): Promise<Survey[]> {
    const response = await api.get<BackendSurvey[] | PageResponse<BackendSurvey>>('/surveys');
    const surveys = normalizeSurveyListResponse(response.data);
    return applyClientFilters(surveys, params);
  },

  async getActiveSurveys(): Promise<Survey[]> {
    return this.getSurveys({ status: 'ACTIVE' });
  },

  async getSurvey(id: number): Promise<Survey> {
    const response = await api.get<BackendSurvey>(`/surveys/${id}`);
    return mapBackendSurvey(response.data);
  },

  async createSurvey(data: SurveyFormData): Promise<Survey> {
    const response = await api.post<BackendSurvey>('/surveys', mapSurveyFormToBackend(data));
    return mapBackendSurvey(response.data);
  },

  async updateSurvey(id: number, data: Partial<SurveyFormData>): Promise<Survey> {
    const response = await api.put<BackendSurvey>(
      `/surveys/${id}`,
      mapSurveyFormToBackend(data)
    );
    return mapBackendSurvey(response.data);
  },

  async deleteSurvey(id: number): Promise<void> {
    await api.delete(`/surveys/${id}`);
  },
};
