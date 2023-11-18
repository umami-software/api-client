import UmamiApiClient from 'UmamiApiClient';
import { log } from './log';

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

  log({
    userId,
    secret,
    apiEndpoint,
    apiKey,
  });

  return new UmamiApiClient({
    userId,
    secret,
    apiEndpoint,
    apiKey,
  });
}
