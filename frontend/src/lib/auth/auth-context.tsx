'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginCredentials } from '@/types/auth';
import { authApi } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: LoginCredentials & { name: string; companyName?: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const normalizeUser = (value: Partial<User> | null | undefined): User | null => {
  if (!value) {
    return null;
  }

  return {
    ...value,
    status: value.status ?? 'ACTIVE',
    client: value.client ?? null,
  } as User;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await authApi.me();
          if (isMounted) {
            const normalizedUser = normalizeUser(response.data);
            setUser(normalizedUser);
            // Store clientId for template filtering
            if (normalizedUser?.client?.id) {
              localStorage.setItem('clientId', normalizedUser.client.id);
            }
            // Also store token for backward compatibility
            localStorage.setItem('token', token);
          }
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        localStorage.removeItem('clientId');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void checkAuth();

    const handleUserUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<User | null>;
      setUser(normalizeUser(customEvent.detail));
    };

    window.addEventListener('auth:user-updated', handleUserUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:user-updated', handleUserUpdate);
    };
  }, []);

  const syncUserState = (nextUser: User | null) => {
    const normalizedUser = normalizeUser(nextUser);
    setUser(normalizedUser);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:user-updated', { detail: normalizedUser }));
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApi.login(credentials);
    const { user: nextUser, accessToken, refreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('token', accessToken); // For backward compatibility
    // Store clientId for template filtering
    if (nextUser.client?.id) {
      localStorage.setItem('clientId', nextUser.client.id);
    }
    syncUserState(nextUser);

    return response.data;
  };

  const register = async (credentials: LoginCredentials & { name: string; companyName?: string }): Promise<AuthResponse> => {
    const response = await authApi.register(credentials);
    const { user: nextUser, accessToken, refreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('token', accessToken); // For backward compatibility
    // Store clientId for template filtering
    if (nextUser.client?.id) {
      localStorage.setItem('clientId', nextUser.client.id);
    }
    syncUserState(nextUser);

    return response.data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Silent logout on error
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      localStorage.removeItem('clientId');
      syncUserState(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      syncUserState(response.data);
    } catch {
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}