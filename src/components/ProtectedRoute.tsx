import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../api/client';
import { getMyProfile } from '../api/user';
import { LoadingView } from './LoadingView';

const NICKNAME_UPDATE_ENABLED = import.meta.env.VITE_ENABLE_NICKNAME_UPDATE === 'true';

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = !!getAccessToken();
  const [loading, setLoading] = useState(true);
  const [hasNickname, setHasNickname] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkProfile() {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const me = await getMyProfile();
        setHasNickname(!!me.nickname);
      } catch (e) {
        // If profile fetch fails, don't hard-block app navigation.
        console.error('Failed to load profile in ProtectedRoute:', e);
        setHasNickname(true);
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
