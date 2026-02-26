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

  type RawPresign = PresignedUrlResponse | {
    presignedUrl?: string;
    url?: string;
    key?: string;
    canonicalUrl?: string;
    headers?: Record<string, string>;
    maxUploadBytes?: number;
    expiresInSeconds?: number;
  } | string;

  let raw: RawPresign;
  try {
    // Requested flow: GET presign first.
    raw = await apiRequest<RawPresign>(`/uploads/presign?${qs.toString()}`);
  } catch {
    // Compatibility fallback for older backend contracts.
    raw = await apiRequest<RawPresign>('/uploads/presign', {
      method: 'POST',
      body: JSON.stringify({ roomId, contentType, sizeBytes }),
    });
  }

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

  const ext = raw as {
    presignedUrl?: string;
    url?: string;
    key?: string;
    canonicalUrl?: string;
    headers?: Record<string, string>;
    maxUploadBytes?: number;
    expiresInSeconds?: number;
  };
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
  const contentType = extraHeaders?.['Content-Type'] || getFallbackContentType(file);
  const headers = { ...(extraHeaders ?? {}) } as Record<string, string>;
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === 'content-type') {
      delete headers[key];
    }
  }
  headers['Content-Type'] = contentType;

  const tryFetchUpload = async (method: 'POST' | 'PUT'): Promise<Response> => {
    return fetch(presignedUrl, {
      method,
      body: file,
      headers,
    });
  };

  if (onProgress) {
    // XHR branch for upload progress + method fallback (POST -> PUT)
    const uploadWithMethod = (method: 'POST' | 'PUT') =>
      new Promise<number>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, presignedUrl);
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

        xhr.upload.onprogress = (event) => {
          onProgress({ loaded: event.loaded, total: event.total || undefined });
        };

        xhr.onload = () => resolve(xhr.status);
        xhr.onerror = () => reject(new Error('Failed to upload file to R2'));
        xhr.send(file);
      });

    const postStatus = await uploadWithMethod('POST');
    if (postStatus >= 200 && postStatus < 300) return;

    if (postStatus === 405) {
      const putStatus = await uploadWithMethod('PUT');
      if (putStatus >= 200 && putStatus < 300) return;
      throw new Error(`Failed to upload file to R2: Status ${putStatus}`);
    }

    throw new Error(`Failed to upload file to R2: Status ${postStatus}`);
  }

  // No-progress branch
  let response = await tryFetchUpload('POST');
  if (!response.ok && response.status === 405) {
    response = await tryFetchUpload('PUT');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to upload file to R2: Status ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }
}
