const apiClient = require('./dist/cjs/index');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
  console.log(apiClient.client);

  apiClient.client.setAuthToken({ userId: process.env.UMAMI_TEST_USER_ID });

  try {
    const x = await apiClient.runQuery(
      {
        query: { url: ['teams', 'join'] },
        method: 'post',
      },
      {},
    );

    console.log(x);
  } catch (e) {
    console.log('ERROR', { statusCode: e.statusCode, message: e.message, e });
  }
})();
