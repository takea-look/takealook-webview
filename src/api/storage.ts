import type { PresignedUrlResponse } from '../types/api';
import { apiRequest } from './client';

const getExtensionFromFileName = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() ?? '';
};

const getFallbackContentType = (file: File): string => {
  const type = (file.type || '').toLowerCase().trim();
  if (type) return type;

  const ext = getExtensionFromFileName(file.name);
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://img.takealook.my';

export async function getUploadUrl(roomId: number, contentType: string, sizeBytes?: number): Promise<PresignedUrlResponse> {
  const qs = new URLSearchParams({
    roomId: String(roomId),
    contentType,
    ...(typeof sizeBytes === 'number' ? { sizeBytes: String(sizeBytes) } : {}),
  });

  // Backend contract: get presigned URL via GET, then upload file to that URL with POST.
  const raw = await apiRequest<PresignedUrlResponse | { presignedUrl?: string; url?: string; key?: string; canonicalUrl?: string; headers?: Record<string, string> } | string>(`/uploads/presign?${qs.toString()}`);

  if (typeof raw === 'string') {
    return {
      url: raw,
      key: '',
      canonicalUrl: '',
      headers: {},
      maxUploadBytes: 0,
      expiresInSeconds: 0,
    };
  }

  const ext = raw as { presignedUrl?: string; url?: string; key?: string; canonicalUrl?: string; headers?: Record<string, string>; maxUploadBytes?: number; expiresInSeconds?: number };
  const url = ext.url || ext.presignedUrl || '';
  return {
    url,
    key: ext.key ?? '',
    canonicalUrl: ext.canonicalUrl ?? '',
    headers: ext.headers ?? {},
    maxUploadBytes: ext.maxUploadBytes ?? 0,
    expiresInSeconds: ext.expiresInSeconds ?? 0,
  };
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
      const contentType = extraHeaders?.['Content-Type'] || getFallbackContentType(file);
      xhr.open('POST', presignedUrl);
      if (extraHeaders) {
        Object.entries(extraHeaders).forEach(([key, value]) => {
          if (key.toLowerCase() === 'content-type') return;
          xhr.setRequestHeader(key, value);
        });
      }
      xhr.setRequestHeader('Content-Type', contentType);

      xhr.upload.onprogress = (event) => {
        onProgress({ loaded: event.loaded, total: event.total || undefined });
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          const details = `Status ${xhr.status}: ${xhr.statusText}`;
          reject(new Error(`Failed to upload file to R2: ${details}`));
        }
      };

      xhr.onerror = () => reject(new Error('Failed to upload file to R2'));

      xhr.send(file);
    });

    return;
  }

  const contentType = extraHeaders?.['Content-Type'] || getFallbackContentType(file);
  const headers = { ...(extraHeaders ?? {}) } as Record<string, string>;
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === 'content-type') {
      delete headers[key];
    }
  }
  headers['Content-Type'] = contentType;

  const response = await fetch(presignedUrl, {
    method: 'POST',
    body: file,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to upload file to R2: Status ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }
}
