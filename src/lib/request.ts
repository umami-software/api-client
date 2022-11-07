import fetch from 'cross-fetch';

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: any;
}

export function apiRequest(
  method: string,
  url: string,
  body,
  headers?: object,
): Promise<ApiResponse<any>> {
  return fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
  }).then(res => {
    if (res.ok) {
      return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
    }

    return res.text().then(text => ({ ok: res.ok, status: res.status, error: text }));
  });
}
