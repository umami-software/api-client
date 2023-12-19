import UmamiApiClient from 'UmamiApiClient';

export function getClient(params?: {
  userId?: string;
  secret?: string;
  apiEndpoint?: string;
  apiKey?: string;
}): UmamiApiClient {
  const {
    userId = process.env.UMAMI_API_CLIENT_USER_ID,
    secret = process.env.UMAMI_API_CLIENT_SECRET,
    apiEndpoint = process.env.UMAMI_API_CLIENT_ENDPOINT,
    apiKey = process.env.UMAMI_API_KEY,
  } = params || {};

  return new UmamiApiClient({
    userId,
    secret,
    apiEndpoint,
    apiKey,
  });
}
