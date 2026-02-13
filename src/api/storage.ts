import type { PresignedUrlResponse } from '../types/api';
import { apiRequest } from './client';

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://img.takealook.my';

export async function getUploadUrl(key: string, sizeBytes?: number): Promise<PresignedUrlResponse> {
  const query = new URLSearchParams({ key });
  if (sizeBytes != null) {
    query.set('sizeBytes', String(sizeBytes));
  }
  return apiRequest<PresignedUrlResponse>(`/storage/upload?${query.toString()}`);
}

export function getPublicImageUrl(key: string): string {
  return `${IMAGE_BASE_URL.replace(/\/$/, '')}/${key}`;
}

export async function uploadToR2(presignedUrl: string, file: File): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to R2');
  }
}
