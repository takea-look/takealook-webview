import type { UserProfile } from '../types/api';
import { apiRequest } from './client';

export async function getMyProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/user/profile/me');
}

export async function getUserProfile(userId: number): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/user/profile?userId=${userId}`);
}
