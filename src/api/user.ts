import type { UserProfile } from '../types/api';
import { apiRequest } from './client';

export async function getMyProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/user/profile/me');
}

export async function getUserProfile(userId: number): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/user/profile?userId=${userId}`);
}

export async function updateMyNickname(nickname: string): Promise<void> {
  // NOTE: Not exposed in current Swagger spec yet.
  // Expected BE contract: PATCH /user/profile/me { nickname }
  await apiRequest<void>('/user/profile/me', {
    method: 'PATCH',
    body: JSON.stringify({ nickname }),
  });
}
