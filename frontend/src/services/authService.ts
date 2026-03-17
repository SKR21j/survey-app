import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/User';

interface BackendLoginResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

function mapUserFromBackend(data: BackendLoginResponse): User {
  return {
    id: data.userId,
    name: data.username,
    email: data.email,
    role: data.role,
  };
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<BackendLoginResponse>('/auth/login', data);
    return {
      token: response.data.token,
      user: mapUserFromBackend(response.data),
    };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await api.post('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
    });

    return this.login({
      username: data.username,
      password: data.password,
    });
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
