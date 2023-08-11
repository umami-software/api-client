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
