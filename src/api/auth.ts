import type { LoginRequest, LoginResponse } from '../types/api';
import { apiRequest } from './client';

export async function signin(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
    requiresAuth: false,
  });
}
