import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../../../entities/user/model/types';
import { clearSession, refreshSession } from '../../../shared/api/client';
import { authApi, type RegisterData } from '../api';

interface AuthValue {
  user: User | null;
  status: 'loading' | 'ready';
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  // Восстановление сессии при загрузке страницы
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (await refreshSession()) {
          const me = await authApi.me();
          if (active) setUser(me);
        }
      } catch {
        clearSession();
      } finally {
        if (active) setStatus('ready');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    await authApi.login(email, password);
    setUser(await authApi.me());
  };

  const register = async (data: RegisterData) => {
    await authApi.register(data);
    setUser(await authApi.me());
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
