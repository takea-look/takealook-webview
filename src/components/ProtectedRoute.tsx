import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../api/client';

export function ProtectedRoute() {
  const isAuthenticated = !!getAccessToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
