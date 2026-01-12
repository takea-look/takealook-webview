const API_BASE_URL = 'https://s1.takealook.my';
const TOKEN_KEY = 'takealook_access_token';

interface ApiErrorType extends Error {
  status: number;
}

function createApiError(status: number, message: string): ApiErrorType {
  const error = new Error(message) as ApiErrorType;
  error.status = status;
  error.name = 'ApiError';
  return error;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

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
      requestHeaders['accessToken'] = token;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  if (response.status === 401) {
    clearAccessToken();
    throw createApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw createApiError(response.status, errorText);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
