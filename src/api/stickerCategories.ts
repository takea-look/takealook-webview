import { apiRequest } from './client';

export interface StickerCategory {
  id: number;
  name: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

type StickerCategoryResponse = StickerCategory & {
  title?: string;
  thumbnailImageUrl?: string;
  iconImageUrl?: string;
  imageUrl?: string;
};

export async function getStickerCategories(): Promise<StickerCategory[]> {
  const data = await apiRequest<StickerCategoryResponse[]>('/sticker-categories', { method: 'GET' });
  return data.map(category => ({
    ...category,
    name: category.name ?? category.title ?? `category-${category.id}`,
    thumbnailUrl: category.thumbnailUrl ?? category.thumbnailImageUrl ?? category.iconImageUrl ?? category.imageUrl,
  }));
}
