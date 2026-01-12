import { useState } from 'react';
import { signin } from '../api/auth';
import { getAccessToken, setAccessToken, clearAccessToken } from '../api/client';
import type { LoginRequest } from '../types/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());
  const isLoading = false;

  const login = async (credentials: LoginRequest) => {
    const response = await signin(credentials);
    setAccessToken(response.accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAccessToken();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
