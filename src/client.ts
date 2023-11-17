import UmamiApiClient from 'UmamiApiClient';
import debug from 'debug';

export const log = debug('umami:api');

export function getClient(params?: {
  userId?: string;
  secret?: string;
  apiEndpoint?: string;
  apiKey?: string;
}): UmamiApiClient {
  const {
    userId = process.env.UMAMI_API_USER_ID,
    secret = process.env.UMAMI_API_CLIENT_SECRET,
    apiEndpoint = process.env.UMAMI_API_CLIENT_ENDPOINT,
    apiKey = process.env.UMAMI_API_KEY,
  } = params || {};

  log('Client Init: ', {
    userId,
    secret,
    apiEndpoint,
    apiKey,
  });

  const apiClient = new UmamiApiClient({
    userId,
    secret,
    apiEndpoint,
    apiKey,
  });

  return apiClient;
}
