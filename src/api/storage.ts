import type { PresignedUrlResponse } from '../types/api';
import { apiRequest } from './client';

export async function getUploadUrl(key: string): Promise<PresignedUrlResponse> {
  return apiRequest<PresignedUrlResponse>(`/storage/upload?key=${encodeURIComponent(key)}`);
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
