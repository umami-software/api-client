require('cross-fetch/polyfill');
const apiClient = require('./dist/cjs/index');
const dotenv = require('dotenv');
dotenv.config();

const START_AT = 1682924400000;
const END_AT = 1696143599999;

describe('Testing all get functions', () => {
  beforeAll(() => {
    apiClient.client = apiClient.getClient();
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
      startAt: START_AT,
      endAt: END_AT,
      unit: 'hour',
      type: 'url',
    });

    return results.ok;
  }

  test('Testing: getWebsiteMetrics', () => {
    return expect(testGetWebsiteMetrics()).resolves.toBeTruthy();
  });

  async function testGetWebsitePageviews() {
    const results = await apiClient.client.getWebsitePageviews(process.env.UMAMI_WEBSITE_ID, {
      startAt: START_AT,
      endAt: END_AT,
      unit: 'hour',
      url: '/',
      timezone: 'America/Los_Angeles',
      unit: 'day',
    });

    return results.ok;
  }

  test('Testing: getWebsitePageviews', () => {
    return expect(testGetWebsitePageviews()).resolves.toBeTruthy();
  });

  async function testGetWebsitesStats() {
    const results = await apiClient.client.getWebsiteStats(process.env.UMAMI_WEBSITE_ID, {
      startAt: START_AT,
      endAt: END_AT,
      url: '/',
    });

    return results.ok;
  }

  test('Testing: getWebsitesStats', () => {
    return expect(testGetWebsitesStats()).resolves.toBeTruthy();
  });
});
