import UmamiApiClient from 'UmamiApiClient';

const API = Symbol();

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

  const apiClient = new UmamiApiClient({
    userId,
    secret,
    apiEndpoint,
    apiKey,
  });

  global[API] = apiClient;

  return apiClient;
}

export const client: UmamiApiClient = global[API] || getClient();
