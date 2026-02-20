const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://s1.takealook.my';
const TOKEN_KEY = 'takealook_access_token';
const REFRESH_TOKEN_KEY = 'takealook_refresh_token';
const UNAUTHORIZED_THROTTLE_MS = 500;
const DEBUG_AUTH_FLOW = import.meta.env.VITE_DEBUG_AUTH_FLOW === 'true';


const debugAuthLog = (...args: unknown[]) => {
  if (!DEBUG_AUTH_FLOW) return;
  // eslint-disable-next-line no-console
  console.debug('[takealook/auth-debug]', ...args);
};

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

let refreshInFlight: Promise<void> | null = null;

export interface ApiErrorType extends Error {
  status: number;
  code?: string;
  details?: unknown;
}

function createApiError(status: number, message: string, code?: string, details?: unknown): ApiErrorType {
  const error = new Error(message) as ApiErrorType;
  error.status = status;
  error.name = 'ApiError';
  error.code = code;
  error.details = details;
  return error;
}

export function isApiError(error: unknown): error is ApiErrorType {
  return error instanceof Error && (error as ApiErrorType).name === 'ApiError' && typeof (error as ApiErrorType).status === 'number';
}

type ParsedErrorBody = {
  message?: string;
  error?: string;
  code?: string;
  errorCode?: string;
  status?: number;
} & Record<string, unknown>;

async function parseErrorResponse(response: Response): Promise<{ message: string; code?: string; details?: unknown }> {
  const text = await response.text().catch(() => 'Unknown error');

  if (!text) {
    return { message: `Request failed (${response.status})` };
  }

  try {
    const json = JSON.parse(text) as ParsedErrorBody;
    const message =
      (typeof json.message === 'string' && json.message) ||
      (typeof json.error === 'string' && json.error) ||
      text;
    const code =
      (typeof json.code === 'string' && json.code) ||
      (typeof json.errorCode === 'string' && json.errorCode) ||
      undefined;
    return { message, code, details: json };
  } catch {
    return { message: text };
  }
}

export function getAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return null;
  }
  return token;
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

let lastUnauthorizedAt = 0;

function emitUnauthorized(): void {
  const now = Date.now();
  if (now - lastUnauthorizedAt < UNAUTHORIZED_THROTTLE_MS) {
    debugAuthLog('emitUnauthorized skipped', { reason: 'throttle' });
    return;
  }
  lastUnauthorizedAt = now;
  debugAuthLog('emitUnauthorized', { path: window.location.pathname + window.location.search });
  window.dispatchEvent(new CustomEvent('takealook:unauthorized'));
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<void> {
  const token = getRefreshToken();
  if (!token) {
    throw createApiError(401, 'Unauthorized');
  }

  debugAuthLog('refresh start', { hasRefreshToken: true });
  const endpoints = ['/auth/toss/refresh', '/auth/refresh'];
  let response: Response | null = null;

  for (const endpoint of endpoints) {
    debugAuthLog('refresh request', { endpoint });
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (response.ok || (response.status !== 404 && response.status !== 405)) {
      break
    }

    debugAuthLog('refresh fallback', { endpoint, status: response.status });
    response = null
  }

  if (!response || !response.ok) {
    const parsedError = response
      ? await parseErrorResponse(response)
      : { message: 'Unable to refresh token' };

    debugAuthLog('refresh fail', { status: response?.status, message: parsedError.message });
    throw createApiError(response?.status || 401, parsedError.message, parsedError.code, parsedError.details);
  }

  const data = (await response.json()) as RefreshResponse;
  debugAuthLog('refresh success', { hasAccessToken: !!data?.accessToken, hasRefreshToken: !!data?.refreshToken });
  if (!data?.accessToken) {
    throw createApiError(500, 'Invalid refresh response');
  }

  setAccessToken(data.accessToken);
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken);
  }
}

async function refreshAccessTokenOnce(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const buildHeaders = (): Record<string, string> => {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        requestHeaders[key] = value;
      }
    });

    if (requiresAuth) {
      const token = getAccessToken();
      if (token) {
        // Preferred standard header
        requestHeaders['Authorization'] = `Bearer ${token}`;
        // Legacy compatibility header
        requestHeaders['accessToken'] = token;
      }
    }

    return requestHeaders;
  };

  const request = async (): Promise<Response> => {
    return fetch(url, {
      ...restOptions,
      headers: buildHeaders(),
    });
  };

  const startTime = Date.now();
  const headersForLog = buildHeaders();
  debugAuthLog('apiRequest start', {
    endpoint,
    method: restOptions.method || 'GET',
    requiresAuth,
    hasAuthorization: !!headersForLog.Authorization,
    hasAccessTokenHeader: !!headersForLog.accessToken,
    authorizationPreview: headersForLog.Authorization ? `${headersForLog.Authorization.slice(0, 18)}...` : null,
  });

  let response = await request();

  debugAuthLog('apiRequest first response', { endpoint, status: response.status, elapsedMs: Date.now() - startTime });

  if (response.status === 401 && requiresAuth) {
    try {
      await refreshAccessTokenOnce();
      response = await request();
    } catch (error) {
      debugAuthLog('apiRequest refresh fail', { endpoint, error: String(error) });
      clearAccessToken();
      emitUnauthorized();
      throw createApiError(401, 'Unauthorized');
    }
  }

  if (response.status === 401) {
    // Avoid redirect loops during unauthenticated flows (e.g., login/signin endpoints).
    debugAuthLog('apiRequest unauthorized', { endpoint, requiresAuth });
    if (requiresAuth) {
      clearAccessToken();
      emitUnauthorized();
    }
    throw createApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    const parsedError = await parseErrorResponse(response);
    debugAuthLog('apiRequest error', {
      endpoint,
      status: response.status,
      code: parsedError.code,
      message: parsedError.message,
    });
    throw createApiError(response.status, parsedError.message, parsedError.code, parsedError.details);
  }

  if (response.status === 204) {
    debugAuthLog('apiRequest success', { endpoint, status: response.status });
    return {} as T;
  }

  debugAuthLog('apiRequest success', { endpoint, status: response.status });
  return response.json();
}

