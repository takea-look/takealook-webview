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

const getHeaderValue = (headers: Record<string, string> | undefined, headerName: string): string | undefined => {
  if (!headers) return undefined;
  const target = headerName.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target) return value;
  }
  return undefined;
};

const buildUploadHeaders = (file: File, extraHeaders?: Record<string, string>): Record<string, string> => {
  const headers = { ...(extraHeaders ?? {}) } as Record<string, string>;
  const providedContentType = getHeaderValue(headers, 'Content-Type');

  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === 'content-type') {
      delete headers[key];
    }
  }

  headers['Content-Type'] = providedContentType || getFallbackContentType(file);
  return headers;
};

const getUploadMethod = (presignedUrl: string): 'PUT' | 'POST' => {
  try {
    const u = new URL(presignedUrl);
    const operation = u.searchParams.get('x-id')?.toLowerCase();
    if (operation === 'postobject') return 'POST';
    if (operation === 'putobject') return 'PUT';
  } catch {
    // Default method below.
  }
  return 'PUT';
};

export async function uploadToR2(
  presignedUrl: string,
  file: File,
  onProgress?: UploadProgressHandler,
  extraHeaders?: Record<string, string>,
): Promise<void> {
  const uploadUrlInfo = (() => {
    try {
      const u = new URL(presignedUrl);
      return {
        host: u.host,
        scheme: u.protocol.replace(':', ''),
      };
    } catch {
      return { host: 'invalid-url', scheme: 'unknown' };
    }
  })();

  const online = typeof navigator !== 'undefined' ? String(navigator.onLine) : 'unknown';
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  const uaBrief = ua.length > 80 ? `${ua.slice(0, 80)}...` : ua;
  const headers = buildUploadHeaders(file, extraHeaders);
  const method = getUploadMethod(presignedUrl);

  if (onProgress) {
    // XHR branch for upload progress.
    const upload = () =>
      new Promise<number>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, presignedUrl);
        xhr.timeout = 15000;
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

        xhr.upload.onprogress = (event) => {
          onProgress({ loaded: event.loaded, total: event.total || undefined });
        };

        xhr.onload = () => resolve(xhr.status);
        xhr.onerror = () => reject(new Error(`xhr-error status=${xhr.status || 0}`));
        xhr.ontimeout = () => reject(new Error(`xhr-timeout status=${xhr.status || 0}`));
        xhr.onabort = () => reject(new Error(`xhr-abort status=${xhr.status || 0}`));
        xhr.send(file);
      });

    try {
      const status = await upload();
      if (status >= 200 && status < 300) return;
      throw new Error(`status=${status}`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to upload file to R2: ${method}/headers=${reason} | host=${uploadUrlInfo.host} scheme=${uploadUrlInfo.scheme} online=${online} ua=${uaBrief}`);
    }
  }

  // No-progress branch
  try {
    const response = await fetch(presignedUrl, {
      method,
      body: file,
      headers,
    });
    if (response.ok) return;
    const body = await response.text().catch(() => '');
    throw new Error(`${method}/headers=${response.status}${body ? `:${body.slice(0, 120)}` : ''}`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to upload file to R2: ${reason} | host=${uploadUrlInfo.host} scheme=${uploadUrlInfo.scheme} online=${online} ua=${uaBrief}`);
  }
}
