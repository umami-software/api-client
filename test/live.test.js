const { getClient } = require('../dist/cjs/index');

const endpoint = process.env.UMAMI_API_CLIENT_ENDPOINT;
const websiteId = process.env.UMAMI_WEBSITE_ID;
const describeLive = endpoint ? describe : describe.skip;

const END_AT = Date.now();
const START_AT = END_AT - 30 * 24 * 60 * 60 * 1000;
const TIMEZONE = 'UTC';

describeLive('live API', () => {
  let client;

  beforeAll(() => {
    client = getClient();
  });

  async function expectOk(promise) {
    const res = await promise;
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error(res.status, res.error);
    }
    expect(res.ok).toBe(true);
    return res.data;
  }

  test('heartbeat', () => expectOk(client.heartbeat()));

  test('getMe', () => expectOk(client.getMe()));

  test('getWebsites', () => expectOk(client.getWebsites({ pageSize: 5 })));

  const describeWebsite = websiteId ? describe : describe.skip;

  describeWebsite('website', () => {
    test('getWebsite', () => expectOk(client.getWebsite(websiteId)));

    test('getWebsiteStats', () =>
      expectOk(client.getWebsiteStats(websiteId, { startAt: START_AT, endAt: END_AT })));

    test('getWebsiteMetrics type=path', () =>
      expectOk(
        client.getWebsiteMetrics(websiteId, {
          startAt: START_AT,
          endAt: END_AT,
          type: 'path',
          limit: 10,
        }),
      ));

    test('getWebsitePageviews', () =>
      expectOk(
        client.getWebsitePageviews(websiteId, {
          startAt: START_AT,
          endAt: END_AT,
          unit: 'day',
          timezone: TIMEZONE,
        }),
      ));

    test('getWebsiteSessions', () =>
      expectOk(
        client.getWebsiteSessions(websiteId, { startAt: START_AT, endAt: END_AT, pageSize: 5 }),
      ));

    test('runBreakdownReport', () =>
      expectOk(
        client.runBreakdownReport({
          websiteId,
          type: 'breakdown',
          filters: { startAt: START_AT, endAt: END_AT, timezone: TIMEZONE },
          parameters: {
            startDate: new Date(START_AT).toISOString(),
            endDate: new Date(END_AT).toISOString(),
            fields: ['path'],
          },
        }),
      ));
  });
});
