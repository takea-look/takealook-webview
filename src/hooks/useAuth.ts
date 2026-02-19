import { useState, useCallback } from 'react';
import { signin, tossSignin, logout as apiLogout, refreshToken as apiRefreshToken } from '../api/auth';
import { getAccessToken, setAccessToken, clearAccessToken, setRefreshToken, getRefreshToken } from '../api/client';
import type { LoginRequest } from '../types/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await signin(credentials);
      setAccessToken(response.accessToken);

      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }

      setIsAuthenticated(true);
    } catch (err) {
      setError('아이디/비밀번호 로그인에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const tossLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { appLogin } = await import('@apps-in-toss/web-framework');
      const { authorizationCode, referrer } = await appLogin();

      const response = await tossSignin({ authorizationCode, referrer });
      setAccessToken(response.accessToken);

      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }

      setIsAuthenticated(true);
    } catch (err) {
      setError('토스 로그인에 실패했습니다.');
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
    } catch {
      // Ignore: logout failure shouldn't block local token clear.
    }
    clearAccessToken();
    setIsAuthenticated(false);
  };

  const logoutByUserKey = async (userKey: number) => {
    // Placeholder for future server-side logout-by-userKey support.
    void userKey;
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
