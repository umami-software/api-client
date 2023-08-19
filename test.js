require('cross-fetch/polyfill');
const apiClient = require('./dist/cjs/index');
const dotenv = require('dotenv');
dotenv.config();

describe('Testing all get functions', () => {
  beforeAll(() => {
    apiClient.client = apiClient.getClient();
    return;
  });

  async function testGetWebsites() {
    const results = await apiClient.client.getWebsites();

    return results.ok;
  }

  test('Testing: getWebsites', () => {
    return expect(testGetWebsites()).resolves.toBeTruthy();
  });

  async function testGetMe() {
    const results = await apiClient.client.getMe();
    return results.ok;
  }

  test('Testing: getMe', () => {
    return expect(testGetMe()).resolves.toBeTruthy();
  });

  async function testGetWebsiteMetrics() {
    const results = await apiClient.client.getWebsiteMetrics(process.env.UMAMI_WEBSITE_ID, {
      startAt: 1685566800000,
      endAt: 1686916052440,
      type: 'url',
    });

    return results.ok;
  }

  test('Testing: getWebsiteMetrics', () => {
    return expect(testGetWebsiteMetrics()).resolves.toBeTruthy();
  });

  async function testGetWebsitePageviews() {
    const results = await apiClient.client.getWebsitePageviews(process.env.UMAMI_WEBSITE_ID, {
      startAt: 1685566800000,
      endAt: 1686916052440,
      url: '/',
      timezone: 'America/Los_Angeles',
    });

    return results.ok;
  }

  test('Testing: getWebsitePageviews', () => {
    return expect(testGetWebsitePageviews()).resolves.toBeTruthy();
  });

  async function testGetWebsitesStats() {
    const results = await apiClient.client.getWebsiteStats(process.env.UMAMI_WEBSITE_ID, {
      startAt: 1685566800000,
      endAt: 1686916052440,
      url: '/',
    });

    return results.ok;
  }

  test('Testing: getWebsitesStats', () => {
    return expect(testGetWebsitesStats()).resolves.toBeTruthy();
  });
});
