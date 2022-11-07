const { UmamiApiClient } = require('./dist/cjs/index');

const websiteId = '';
const adminUserId = '';
const salt = '';
const baseUrl = 'http://localhost:3000/api';

const client = new UmamiApiClient(baseUrl, salt, adminUserId);

async function testUser() {
  // users
  const user = await client.getUser(adminUserId);
  console.log(user);

  const newUser = await client.createUser({ username: 'test.js', password: 'umami' });
  console.log(newUser);

  const users = await client.getUsers();
  console.log(users);

  const updateUserPassword = await client.updateUserPassword(newUser.data.id, {
    currentPassword: 'umami',
    newPassword: 'umami',
  });
  console.log(updateUserPassword);

  const updateUser = await client.updateUser(newUser.data.id, {
    username: 'test-update.js',
    password: 'umami',
  });
  console.log(updateUser);

  const deleteUser = await client.deleteUser(newUser.data.id);
  console.log(deleteUser);

  return {
    user,
    newUser,
    users,
    updateUserPassword,
    updateUser,
    deleteUser,
  };
}

async function testWebsite() {
  // website
  const websites = await client.getWebsites(true);
  console.log(websites);
  const newWebsite = await client.createWebsite({
    name: 'test2',
    domain: 'test2.com',
    enableShareUrl: true,
  });
  console.log(newWebsite);
  const websiteActive = await client.getWebsiteActive(newWebsite.data.id);

  console.log(websiteActive);
  const updateWebsite = await client.updateWebsite(newWebsite.data.id, {
    name: 'test',
    domain: 'test.com',
    shareId: 'gza5YfNO',
  });
  console.log(updateWebsite);

  const share = await client.getShare('gza5YfNO');
  console.log(share);

  const website = await client.getWebsite(newWebsite.data.id);
  console.log(website);

  const websiteEventData = await client.getWebsiteEventData(newWebsite.data.id, {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
    timezone: 'America/Los_Angeles',
    columns: { test: 'count' },
    filters: {},
  });
  console.log(websiteEventData);

  const websiteEvents = await client.getWebsiteEvents(newWebsite.data.id, {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
    timezone: 'America/Los_Angeles',
    unit: 'hour',
  });
  console.log(websiteEvents);

  const websiteMetrics = await client.getWebsiteMetrics(newWebsite.data.id, {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
    type: 'url',
  });
  console.log(websiteMetrics);
  const websitePageviews = await client.getWebsitePageviews(newWebsite.data.id, {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
    unit: 'day',
    timezone: 'America/Los_Angeles',
  });
  console.log(websitePageviews);
  const websiteStats = await client.getWebsiteStats(newWebsite.data.id, {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
  });
  console.log(websiteStats);

  const resetWebsite = await client.resetWebsite(newWebsite.data.id);
  console.log(resetWebsite);

  const deleteWebsite = await client.deleteWebsite(newWebsite.data.id);
  console.log(deleteWebsite);
}

async function testRealTime() {
  const realtimeInit = await client.getRealtimeInit();
  console.log(realtimeInit);

  const realtimeUpdate = await client.getRealtimeUpdate(new Date(1667113200000));
  console.log(realtimeUpdate);
}

async function testMisc() {
  const collect = await client.collect(websiteId, {
    type: 'pageview',
    payload: {
      hostname: 'localhosttest',
      language: 'en-US',
      referrer: '',
      screen: '3840x1600',
      url: '/',
    },
  });
  console.log(collect);
}

(async () => {
  await testUser();
  await testWebsite();
  await testRealTime();
})();
