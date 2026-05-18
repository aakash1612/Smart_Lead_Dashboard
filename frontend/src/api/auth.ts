import apiClient from './client';
import { ApiResponse, AuthTokens, User } from '@/types';

interface LoginInput { email: string; password: string; }
interface RegisterInput { name: string; email: string; password: string; role?: 'admin' | 'sales'; }

export const authApi = {
  login: async (data: LoginInput) => {
    const res = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterInput) => {
    const res = await apiClient.post<ApiResponse<AuthTokens>>('/auth/register', data);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
