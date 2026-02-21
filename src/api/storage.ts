import type { PresignedUrlResponse } from '../types/api';
import { apiRequest } from './client';

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://img.takealook.my';

export async function getUploadUrl(roomId: number, contentType: string, sizeBytes?: number): Promise<PresignedUrlResponse> {
  return apiRequest<PresignedUrlResponse>('/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({ roomId, contentType, sizeBytes }),
  });
}

export function getPublicImageUrl(key: string): string {
  return `${IMAGE_BASE_URL.replace(/\/$/, '')}/${key}`;
}

export type UploadProgressHandler = (progress: { loaded: number; total?: number }) => void;

export async function uploadToR2(
  presignedUrl: string,
  file: File,
  onProgress?: UploadProgressHandler,
  extraHeaders?: Record<string, string>,
): Promise<void> {
  if (onProgress) {
    // Prefer XHR for upload progress.
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      if (extraHeaders) {
        Object.entries(extraHeaders).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.upload.onprogress = (event) => {
        onProgress({ loaded: event.loaded, total: event.total || undefined });
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error('Failed to upload file to R2'));
        }
      };

      xhr.onerror = () => reject(new Error('Failed to upload file to R2'));

      xhr.send(file);
    });

    return;
  }

  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
      ...(extraHeaders ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to R2');
  }
}
