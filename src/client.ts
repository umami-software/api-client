import UmamiApiClient from 'UmamiApiClient';
import { ApiResponse } from 'next-basics';

const API = Symbol();

export const queryMap = [
  {
    path: /^teams/,
    get: async () => client.getTeams(),
    post: async (args, data) => client.createTeam(data),
  },
  {
    path: /^teams\/join/,
    post: async (args, data) => client.joinTeam(data),
  },
  {
    path: /^teams\/[0-9-]+/,
    get: async ([, id]) => client.getTeam(id),
    post: async ([, id], data) => client.updateTeam(id, data),
    delete: async ([, id]) => client.deleteTeam(id),
  },
  { path: /^teams\/[0-9-]+\/users/, get: async ([, id]) => client.getTeamUsers(id) },
  {
    path: /^team\/[0-9-]+\/users\/[0-9-]+/,
    delete: async ([, teamId, , userId]) => client.deleteTeamUser(teamId, userId),
  },
  {
    path: /^teams\/[0-9-]+\/websites/,
    get: async ([, id]) => client.getTeamWebsites(id),
    post: async ([, id], data) => client.createTeamWebsites(id, data),
  },
  {
    path: /^teams\/[0-9-]+\/websites\/[0-9-]+/,
    delete: async ([, teamId, , websiteId]) => client.deleteTeamWebsite(teamId, websiteId),
  },
  {
    path: /^websites/,
    get: async () => client.getWebsites(),
    post: async (args, data) => client.createWebsite(data),
  },
  {
    path: /^websites\/[0-9-]+/,
    get: async ([, id]) => client.getWebsite(id),
    post: async ([, id], data) => client.updateWebsite(id, data),
    delete: async ([, id]) => client.deleteWebsite(id),
  },
  {
    path: /^websites\/[0-9-]+\/active/,
    get: async ([, id]) => client.getWebsiteActive(id),
  },
  {
    path: /^websites\/[0-9-]+\/eventdata/,
    get: async ([, id], data) => client.getWebsiteEventData(id, data),
  },
  {
    path: /^websites\/[0-9-]+\/events/,
    get: async ([, id], data) => client.getWebsiteEvents(id, data),
  },
  {
    path: /^websites\/[0-9-]+\/metrics/,
    get: async ([, id], data) => client.getWebsiteMetrics(id, data),
  },
  {
    path: /^websites\/[0-9-]+\/pageviews/,
    get: async ([, id], data) => client.getWebsitePageviews(id, data),
  },
  {
    path: /^websites\/[0-9-]+\/reset/,
    post: ([, id]) => client.resetWebsite(id),
  },
  {
    path: /^websites\/[0-9-]+\/stats/,
    get: async ([, id], data) => client.getWebsiteStats(id, data),
  },
  {
    path: /^users/,
    get: async () => client.getUsers(),
    post: async (args, data) => client.createUser(data),
  },
  {
    path: /^users\/[0-9-]+/,
    get: async ([, id]) => client.getUser(id),
    post: async ([, id], data) => client.updateUser(id, data),
    delete: async ([, id]) => client.deleteUser(id),
  },
  {
    path: /^users\/[0-9-]+\/password/,
    post: async ([, id], data) => client.updateUserPassword(id, data),
  },
  {
    path: /^users\/[0-9-]+\/websites/,
    get: async ([, id]) => client.getUserWebsites(id),
  },
  {
    path: /^users\/[0-9-]+\/teams/,
    get: async ([, id]) => client.getUserTeams(id),
  },
];

export function getClient() {
  const apiClient = new UmamiApiClient({
    userId: process.env.UMAMI_API_USER_ID,
    secret: process.env.UMAMI_API_CLIENT_SECRET,
    apiEndpoint: process.env.UMAMI_API_CLIENT_ENDPOINT,
    apiKey: process.env.UMAMI_API_KEY,
  });

  global[API] = apiClient;

  return apiClient;
}

export async function runQuery(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data: any,
): Promise<ApiResponse<any>> {
  const route = queryMap.find(({ path }) => url.match(path));
  const key = method.toLowerCase();

  if (route && route[key]) {
    return route[key](url.split('/'), data);
  }
  return { ok: false, status: 404, error: { status: 404, message: `Not Found: ${url}` } };
}

export const client = global[API] || getClient();
