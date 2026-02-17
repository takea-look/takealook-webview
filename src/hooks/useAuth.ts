import { useState, useCallback } from 'react';
import { signinWithProvider, logout as apiLogout, refreshToken as apiRefreshToken } from '../api/auth';
import { getAccessToken, setAccessToken, clearAccessToken, setRefreshToken, getRefreshToken } from '../api/client';
import type { LoginRequest } from '../types/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (_credentials: LoginRequest) => {
    throw new Error('ID/PW login is deprecated. Use social provider login flow.');
  };

  const tossLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { appLogin } = await import('@apps-in-toss/web-framework');
      const { authorizationCode, referrer } = await appLogin();

      // Keep compatibility path by mapping Toss app login to kakao provider signin.
      const response = await signinWithProvider('kakao', { authorizationCode, referrer });
      setAccessToken(response.accessToken);

      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }

      setIsAuthenticated(true);
    } catch (err) {
      setError('SNS 로그인에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const tryRefreshToken = useCallback(async (): Promise<boolean> => {
    const token = getRefreshToken();
    if (!token) return false;

    try {
      const response = await apiRefreshToken(token);
      setAccessToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    clearAccessToken();
    setIsAuthenticated(false);
  };

  const logoutByUserKey = async (_userKey: number) => {
    await logout();
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    tossLogin,
    logout,
    logoutByUserKey,
    tryRefreshToken,
  };
}
