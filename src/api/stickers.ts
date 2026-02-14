import { apiRequest } from './client';

export interface Sticker {
  id: number;
  categoryId?: number;
  name?: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getStickers(params?: { categoryId?: number }): Promise<Sticker[]> {
  const query = params?.categoryId ? `?categoryId=${encodeURIComponent(params.categoryId)}` : '';
  return apiRequest<Sticker[]>(`/stickers${query}`, { method: 'GET' });
}
