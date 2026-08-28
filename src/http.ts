import debug from 'debug';

export const log = debug('umami:api-client');

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: ApiError;
}

export type QueryValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | Array<string | number | boolean>;

export type QueryParams = Record<string, QueryValue>;

export type HttpMethod = 'GET' | 'POST' | 'DELETE';

export type FetchFunction = typeof fetch;

export interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  fetch?: FetchFunction;
  signal?: AbortSignal;
}

function serializeValue(value: Exclude<QueryValue, null | undefined>): string {
  if (Array.isArray(value)) {
    return value.map(String).join(',');
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
}

export function buildQuery(params?: QueryParams): string {
  if (!params) {
    return '';
  }

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    search.append(key, serializeValue(value));
  }

  return search.toString();
}

export function buildUrl(base: string, path: string, params?: QueryParams): string {
  const root = base.replace(/\/+$/, '');
  const route = path.replace(/^\/+/, '');
  const query = buildQuery(params);

  return `${root}/${route}${query ? `?${query}` : ''}`;
}

function parseBody(text: string): any {
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request<T = any>(
  method: HttpMethod,
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { headers = {}, body, signal } = options;
  const doFetch = options.fetch ?? globalThis.fetch;

  if (typeof doFetch !== 'function') {
    return {
      ok: false,
      status: 0,
      error: { message: 'fetch is not available in this environment', code: 'network-error' },
    };
  }

  const init: RequestInit = {
    method,
    headers: { accept: 'application/json', ...headers },
    signal,
  };

  if (body !== undefined) {
    init.headers = { ...init.headers, 'content-type': 'application/json' };
    init.body = JSON.stringify(body);
  }

  log('%s %s', method, url);

  let res: Response;

  try {
    res = await doFetch(url, init);
  } catch (e: any) {
    log('%s %s -> network error: %s', method, url, e?.message);

    return {
      ok: false,
      status: 0,
      error: { message: e?.message ?? 'Network error', code: 'network-error' },
    };
  }

  const text = await res.text();
  const parsed = parseBody(text);

  log('%s %s -> %d', method, url, res.status);

  if (res.ok) {
    return { ok: true, status: res.status, data: parsed as T };
  }

  const error: ApiError =
    parsed && typeof parsed === 'object' && parsed.error
      ? { status: res.status, ...parsed.error }
      : {
          message:
            typeof parsed === 'string' && parsed ? parsed : res.statusText || 'Request failed',
          status: res.status,
        };

  return { ok: false, status: res.status, error };
}
