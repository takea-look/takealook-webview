import { apiRequest } from './client';

export interface Sticker {
  id: number;
  categoryId?: number;
  name?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

type StickerResponse = Sticker & {
  iconUrl?: string;
  iconImageUrl?: string;
  thumbnailImageUrl?: string;
};

export async function getStickers(params?: { categoryId?: number }): Promise<Sticker[]> {
  const query = params?.categoryId ? `?categoryId=${encodeURIComponent(params.categoryId)}` : '';
  const data = await apiRequest<StickerResponse[]>(`/stickers${query}`, { method: 'GET' });
  return data
    .map(sticker => ({
      ...sticker,
      imageUrl: sticker.imageUrl ?? sticker.iconUrl ?? sticker.iconImageUrl ?? '',
      thumbnailUrl: sticker.thumbnailUrl ?? sticker.thumbnailImageUrl ?? sticker.iconUrl ?? sticker.iconImageUrl ?? sticker.imageUrl,
    }))
    .filter(sticker => Boolean(sticker.imageUrl));
}
