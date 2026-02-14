import { apiRequest } from './client';

export interface StickerCategory {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getStickerCategories(): Promise<StickerCategory[]> {
  return apiRequest<StickerCategory[]>('/sticker-categories', { method: 'GET' });
}
