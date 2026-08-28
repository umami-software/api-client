import { UmamiApiClient, type UmamiApiClientOptions } from './UmamiApiClient';

/**
 * Create a client, falling back to environment variables:
 * `UMAMI_API_CLIENT_USER_ID`, `UMAMI_API_CLIENT_SECRET`, `UMAMI_API_CLIENT_ENDPOINT`, `UMAMI_API_KEY`.
 */
export function getClient(params?: UmamiApiClientOptions): UmamiApiClient {
  const {
    userId = process.env.UMAMI_API_CLIENT_USER_ID,
    secret = process.env.UMAMI_API_CLIENT_SECRET,
    apiEndpoint = process.env.UMAMI_API_CLIENT_ENDPOINT,
    apiKey = process.env.UMAMI_API_KEY,
    ...rest
  } = params || {};

  return new UmamiApiClient({
    userId,
    secret,
    apiEndpoint,
    apiKey,
    ...rest,
  });
}
