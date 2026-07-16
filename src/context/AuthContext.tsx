import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export type Page = 'landing' | 'login' | 'setup' | 'settings' | 'dashboard';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isSetupRequired: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  checkStatus: () => Promise<void>;
  setupRoot: (username: string, email: string, password: string) => Promise<void>;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  updateSettings: (username: string, email: string, currentPassword?: string, newPassword?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSetupRequired, setIsSetupRequired] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  // Clear session helper
  const performLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
  }, []);

  // Fetch status of the setup page
  const checkStatus = useCallback(async () => {
    try {
      const response = await api.get<{ setupRequired: boolean }>('/api/auth/status');
      setIsSetupRequired(response.data.setupRequired);
      if (response.data.setupRequired) {
        // If setup is required, ensure we are sent there
        setCurrentPage('setup');
      }
    } catch (error) {
      console.error('Failed to fetch auth status:', error);
    }
  }, []);

  // Load token and user from localStorage on initialization
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
      setIsLoading(false);
    } else {
      // If no session, check if setup is required
      checkStatus().finally(() => setIsLoading(false));
    }
  }, [checkStatus]);

  // Set up Axios interceptors dynamically
  useEffect(() => {
    // Request interceptor
    const reqInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    // Response interceptor
    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          performLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [token, performLogout]);

  // Setup admin user
  const setupRoot = async (username: string, email: string, password: string) => {
    await api.post('/api/auth/setup', { username, email, password });
    setIsSetupRequired(false);
    setCurrentPage('login');
  };

  // Login handler
  const login = async (usernameOrEmail: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/api/auth/login', {
      usernameOrEmail,
      password
    });
    const { token: receivedToken, user: receivedUser } = response.data;
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    setCurrentPage('dashboard');
  };

  // Update Settings handler
  const updateSettings = async (
    username: string,
    email: string,
    currentPassword?: string,
    newPassword?: string
  ) => {
    const response = await api.put<{ message: string; token: string; user: User }>('/api/auth/settings', {
      username,
      email,
      currentPassword,
      newPassword
    });
    const { token: updatedToken, user: updatedUser } = response.data;
    localStorage.setItem('token', updatedToken);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setToken(updatedToken);
    setUser(updatedUser);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isSetupRequired,
        isAuthenticated,
        isLoading,
        currentPage,
        setCurrentPage,
        checkStatus,
        setupRoot,
        login,
        logout: performLogout,
        updateSettings
      }}
    >
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
