const { UmamiApiClient, buildQuery } = require('../dist/cjs/index');

function mockFetch(responder) {
  const calls = [];
  const fetch = jest.fn(async (url, init) => {
    calls.push({ url: new URL(url), init });
    const res = responder(url, init);
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      statusText: res.statusText || '',
      text: async () => (typeof res.body === 'string' ? res.body : JSON.stringify(res.body)),
    };
  });
  return { fetch, calls };
}

function jsonOk(body) {
  return () => ({ status: 200, body });
}

describe('buildQuery', () => {
  test('drops undefined/null, joins arrays, stringifies booleans and dates', () => {
    const q = new URLSearchParams(
      buildQuery({
        a: undefined,
        b: null,
        ids: ['x', 'y'],
        sortDescending: true,
        includeTeams: false,
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        n: 5,
      }),
    );
    expect(q.has('a')).toBe(false);
    expect(q.has('b')).toBe(false);
    expect(q.get('ids')).toBe('x,y');
    expect(q.get('sortDescending')).toBe('true');
    expect(q.get('includeTeams')).toBe('false');
    expect(q.get('startDate')).toBe('2024-01-01T00:00:00.000Z');
    expect(q.get('n')).toBe('5');
  });
});

describe('UmamiApiClient http', () => {
  test('GET builds url, joins ids and sends auth headers', async () => {
    const { fetch, calls } = mockFetch(jsonOk({ data: {} }));
    const client = new UmamiApiClient({
      apiEndpoint: 'https://example.com/api/',
      apiKey: 'api-key',
      userId: 'u',
      secret: 's',
      fetch,
    });

    const res = await client.getWebsitesCharts({ ids: ['a', 'b'], timezone: 'UTC' });

    expect(res.ok).toBe(true);
    const { url, init } = calls[0];
    expect(init.method).toBe('GET');
    expect(url.origin + url.pathname).toBe('https://example.com/api/websites/charts');
    expect(url.searchParams.get('ids')).toBe('a,b');
    expect(url.searchParams.get('timezone')).toBe('UTC');
    expect(init.headers['x-umami-api-key']).toBe('api-key');
    expect(init.headers.authorization).toMatch(/^Bearer /);
    expect(init.body).toBeUndefined();
  });

  test('sortDescending serialises as string', async () => {
    const { fetch, calls } = mockFetch(jsonOk({ data: [] }));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    await client.getWebsites({ orderBy: 'name', sortDescending: true, page: 2 });

    const { url } = calls[0];
    expect(url.searchParams.get('sortDescending')).toBe('true');
    expect(url.searchParams.get('page')).toBe('2');
  });

  test('POST sends JSON body with content-type', async () => {
    const { fetch, calls } = mockFetch(jsonOk({ id: 'w' }));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    const res = await client.createWebsite({ name: 'Site', domain: 'site.com' });

    expect(res.data).toEqual({ id: 'w' });
    const { init } = calls[0];
    expect(init.method).toBe('POST');
    expect(init.headers['content-type']).toBe('application/json');
    expect(JSON.parse(init.body)).toEqual({ name: 'Site', domain: 'site.com' });
  });

  test('DELETE uses DELETE method', async () => {
    const { fetch, calls } = mockFetch(jsonOk({ ok: true }));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    await client.deleteWebsite('w');

    expect(calls[0].init.method).toBe('DELETE');
    expect(calls[0].url.pathname).toBe('/api/websites/w');
  });

  test('umami error envelope is surfaced', async () => {
    const { fetch } = mockFetch(() => ({
      status: 401,
      body: { error: { message: 'Unauthorized', code: 'unauthorized', status: 401 } },
    }));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    const res = await client.getMe();

    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
    expect(res.error).toMatchObject({ message: 'Unauthorized', code: 'unauthorized' });
  });

  test('non-JSON error bodies become error.message', async () => {
    const { fetch } = mockFetch(() => ({
      status: 502,
      statusText: 'Bad Gateway',
      body: '<html>502</html>',
    }));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    const res = await client.heartbeat();

    expect(res.ok).toBe(false);
    expect(res.status).toBe(502);
    expect(res.error.message).toBe('<html>502</html>');
  });

  test('network failures return status 0 instead of throwing', async () => {
    const fetch = jest.fn(async () => {
      throw new Error('ECONNREFUSED');
    });
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    const res = await client.heartbeat();

    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.error.code).toBe('network-error');
  });

  test('verifyTwoFactor overrides authorization with the partial token', async () => {
    const { fetch, calls } = mockFetch(jsonOk({ token: 't', user: {} }));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    await client.verifyTwoFactor({ token: '123456' }, 'partial');

    expect(calls[0].init.headers.authorization).toBe('Bearer partial');
  });

  test('setToken is used for subsequent requests', async () => {
    const { fetch, calls } = mockFetch(jsonOk({}));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    client.setToken('raw-token');
    await client.getMe();

    expect(calls[0].init.headers.authorization).toBe('Bearer raw-token');
  });

  test('report runners post to reports/{type}', async () => {
    const { fetch, calls } = mockFetch(jsonOk([]));
    const client = new UmamiApiClient({ apiEndpoint: 'https://example.com/api', fetch });

    await client.runBreakdownReport({
      websiteId: 'w',
      type: 'breakdown',
      filters: { startAt: 1, endAt: 2 },
      parameters: { startDate: '2024-01-01', endDate: '2024-01-31', fields: ['path'] },
    });

    expect(calls[0].url.pathname).toBe('/api/reports/breakdown');
    expect(JSON.parse(calls[0].init.body).type).toBe('breakdown');
  });
});
