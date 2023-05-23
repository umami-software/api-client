const apiClient = require('./dist/cjs/index');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
  apiClient.client = apiClient.getClient();

  try {
    const x = await apiClient.client.getWebsites();

    console.log(x);
  } catch (e) {
    console.log('ERROR', { statusCode: e.statusCode, message: e.message, e });
  }
})();
