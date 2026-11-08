import { api, clearSession, getStoredRefreshToken, saveSession, type TokenPair } from '../../shared/api/client';
import type { User } from '../../entities/user/model/types';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<void> {
    const pair = await api<TokenPair>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    saveSession(pair);
  },

  async register(data: RegisterData): Promise<void> {
    const pair = await api<TokenPair>('/auth/register', {
      method: 'POST',
      body: data,
    });
    saveSession(pair);
  },

  me: () => api<User>('/auth/me', { auth: true }),

  async logout(): Promise<void> {
    const refreshToken = getStoredRefreshToken();
    try {
      if (refreshToken) {
        await api('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken } });
      }
    } catch {
      // даже если сервер недоступен, локальную сессию всё равно очищаем
    } finally {
      clearSession();
    }
  },
};
