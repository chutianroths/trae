const DEFAULT_TIMEOUT = 15000;

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    console.warn('EXPO_PUBLIC_API_BASE_URL is not defined, defaulting to http://localhost:3000');
    return 'http://localhost:3000';
  }
  return baseUrl;
};

interface RequestOptions extends RequestInit {
  timeout?: number;
  query?: Record<string, string | number | boolean | undefined>;
}

const buildUrl = (path: string, query?: RequestOptions['query']) => {
  const url = new URL(path, getBaseUrl());
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, query, headers, ...rest } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(buildUrl(path, query), {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(headers ?? {}),
      },
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error ?? `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status);
    }

    if (!data?.data) {
      return data as T;
    }

    return data.data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }
    throw new ApiError((error as Error).message || 'Unknown error', 500);
  } finally {
    clearTimeout(timer);
  }
}
