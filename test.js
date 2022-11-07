const { UmamiApiClient } = require('./dist/cjs/index');

const client = new UmamiApiClient('http://localhost:3000/api', 'mySalt!!~');

async function testUser() {
  // users
  const user = await client.getUser('41e2b680-648e-4b09-bcd7-3e2b10c06264');
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

  const updateWebsite = await client.updateWebsite('41e2b680-648e-4b09-bcd7-3e2b10c06264', {
    name: 'test',
    domain: 'test.com',
    shareId: '1234asdf',
  });
  console.log(updateWebsite);

  const share = await client.getShare('1234asdf');
  console.log(share);

  const website = await client.getWebsite(newWebsite.data.id);
  console.log(website);

  const websiteEventData = await client.getWebsiteEventData(
    'b84b5258-306a-4ba6-91e5-2ae90e3fc029',
    {
      startAt: new Date(1667113200000),
      endAt: new Date(1667717999999),
      timezone: 'America/Los_Angeles',
      columns: { test: 'count' },
      filters: {},
    },
  );
  console.log(websiteEventData);

  const websiteEvents = await client.getWebsiteEvents('b84b5258-306a-4ba6-91e5-2ae90e3fc029', {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
    timezone: 'America/Los_Angeles',
    unit: 'hour',
  });
  console.log(websiteEvents);

  const websiteMetrics = await client.getWebsiteMetrics('b84b5258-306a-4ba6-91e5-2ae90e3fc029', {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
    type: 'url',
  });
  console.log(websiteMetrics);

  const websitePageviews = await client.getWebsitePageviews(
    'b84b5258-306a-4ba6-91e5-2ae90e3fc029',
    {
      startAt: new Date(1667113200000),
      endAt: new Date(1667717999999),
      type: 'url',
    },
  );
  console.log(websitePageviews);

  const websiteStats = await client.getWebsiteStats('b84b5258-306a-4ba6-91e5-2ae90e3fc029', {
    startAt: new Date(1667113200000),
    endAt: new Date(1667717999999),
  });
  console.log(websiteStats);
}

async function testRealTime() {
  const realtimeInit = await client.getRealtimeInit();
  console.log(realtimeInit);

  const realtimeUpdate = await client.getRealtimeUpdate('b84b5258-306a-4ba6-91e5-2ae90e3fc029', {
    startAt: new Date(1667113200000),
  });
  console.log(realtimeUpdate);
}

async function testMisc() {
  const collect = await client.collect('b84b5258-306a-4ba6-91e5-2ae90e3fc029', {
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
