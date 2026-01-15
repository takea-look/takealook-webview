import type { LoginRequest, LoginResponse, TossLoginRequest, TossUserInfo } from '../types/api';
import { apiRequest } from './client';

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
  return apiRequest<LoginResponse>('/auth/toss/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: token }),
    requiresAuth: false,
  });
}

export async function logout(): Promise<void> {
  return apiRequest<void>('/auth/toss/logout', {
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
