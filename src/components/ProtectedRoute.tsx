import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../api/client';
import { getMyProfile } from '../api/user';
import { LoadingView } from './LoadingView';
import { logAuthDebug } from '../utils/authDebug';

const debugAuthLog = (message: string, data: Record<string, unknown> = {}) => {
  logAuthDebug(message, data);
};

const NICKNAME_UPDATE_ENABLED = import.meta.env.VITE_ENABLE_NICKNAME_UPDATE === 'true';

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = !!getAccessToken();
  const [loading, setLoading] = useState(true);
  const [hasNickname, setHasNickname] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkProfile() {
      if (!isAuthenticated) {
        debugAuthLog('ProtectedRoute missing token', { path: location.pathname });
        return;
      }

      try {
        setLoading(true);
        const me = await getMyProfile();
        debugAuthLog('ProtectedRoute getMyProfile ok', { hasNickname: !!me.nickname });
        setHasNickname(!!me.nickname);
      } catch (e) {
        // If profile fetch fails, don't hard-block app navigation.
        debugAuthLog('ProtectedRoute getMyProfile fail', { error: String(e) });
        console.error('Failed to load profile in ProtectedRoute:', e);
        setHasNickname(true);
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, [isAuthenticated, location.pathname, location.search]);

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    const params = new URLSearchParams({ next });
    debugAuthLog('ProtectedRoute redirect to login', { next });
    return <Navigate to={`/login?${params.toString()}`} replace />;
  }

  if (loading) {
    return <LoadingView />;
  }

  const isOnboardingPath = location.pathname.startsWith('/onboarding/nickname');
  if (NICKNAME_UPDATE_ENABLED && hasNickname === false && !isOnboardingPath) {
    const next = `${location.pathname}${location.search}`;
    const params = new URLSearchParams({ next });
    return <Navigate to={`/onboarding/nickname?${params.toString()}`} replace />;
  }

  return <Outlet />;
}
