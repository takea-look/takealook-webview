import type { LoginResponse } from '../types/api';
import { apiRequest, isApiError } from './client';

export type SNSProvider = 'google' | 'apple' | 'kakao';

export type SocialSigninRequest = {
  authorizationCode: string;
  referrer?: 'DEFAULT' | 'SANDBOX' | string;
};

export async function signinWithProvider(provider: SNSProvider, payload: SocialSigninRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(`/auth/${provider}/signin`, {
    method: 'POST',
    body: JSON.stringify(payload),
    requiresAuth: false,
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
