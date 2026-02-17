import type { LoginRequest, LoginResponse, TossLoginRequest, TossUserInfo } from '../types/api';
import { apiRequest, isApiError } from './client';

export async function signin(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
    requiresAuth: false,
  });
}

export async function tossSignin(credentials: TossLoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/toss/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
    requiresAuth: false,
  });
}

export async function getTossUserInfo(): Promise<TossUserInfo> {
  return apiRequest<TossUserInfo>('/auth/toss/userinfo', {
    method: 'GET',
    requiresAuth: true,
  });
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  try {
    return await apiRequest<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
      requiresAuth: false,
    });
  } catch (error) {
    if (!isApiError(error) || (error.status !== 404 && error.status !== 405)) {
      throw error;
    }

    // Backward compatibility for legacy Toss-only backend.
    return apiRequest<LoginResponse>('/auth/toss/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
      requiresAuth: false,
    });
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>('/auth/logout', {
      method: 'POST',
      requiresAuth: true,
    });
    return;
  } catch (error) {
    if (!isApiError(error) || (error.status !== 404 && error.status !== 405)) {
      throw error;
    }
  }

  // Backward compatibility for legacy Toss-only backend.
  await apiRequest<void>('/auth/toss/logout', {
    method: 'POST',
    requiresAuth: true,
  });
}

export async function logoutByUserKey(userKey: number): Promise<void> {
  return apiRequest<void>('/auth/toss/logout/user-key', {
    method: 'POST',
    body: JSON.stringify({ userKey }),
    requiresAuth: false,
  });
}
