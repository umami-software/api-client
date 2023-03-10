import * as uuid from 'uuid';
import UmamiApiClient from 'UmamiApiClient';
import { badRequest, ok } from 'next-basics';

const API = Symbol();

export const notFoundError = { status: 404, message: 'Not Found' };

export const queryMap = [
  {
    path: 'teams',
    get: async () => client.getTeams(),
    post: async ({ data }) => client.createTeam(data),
  },
  {
    path: 'teams/join',
    post: async ({ data }) => client.joinTeam(data),
  },
  {
    path: 'teams/{id}',
    get: async ({ id }) => client.getTeam(id),
    post: async ({ id, data }) => client.updateTeam(id, data),
    delete: async ({ id }) => client.deleteTeam(id),
  },
  { path: 'teams/{id}/users', get: async ({ id }) => client.getTeamUsers(id) },
  { path: 'teamUsers/{id}', get: async ({ id }) => client.deleteTeamUser(id) },
  {
    path: 'teams/{id}/websites',
    get: async ({ id }) => client.getTeamWebsites(id),
    post: async ({ id, data }) => client.createTeamWebsites(id, data),
  },
  {
    path: 'teamWebsites/{id}',
    delete: async ({ id }) => client.deleteTeamWebsite(id),
  },
  {
    path: 'websites',
    get: async () => client.getWebsites(),
    post: async ({ data }) => client.createWebsite(data),
  },
  {
    path: 'websites/{id}',
    get: async ({ id }) => client.getWebsite(id),
    post: async ({ id, data }) => client.updateWebsite(id, data),
    delete: async ({ id }) => client.deleteWebsite(id),
  },
  {
    path: 'websites/{id}/active',
    get: async ({ id }) => client.getWebsiteActive(id),
  },
  {
    path: 'websites/{id}/eventdata',
    get: async ({ id, data }) => client.getWebsiteEventData(id, data),
  },
  {
    path: 'websites/{id}/events',
    get: async ({ id, data }) => client.getWebsiteEvents(id, data),
  },
  {
    path: 'websites/{id}/metrics',
    get: async ({ id, data }) => client.getWebsiteMetrics(id, data),
  },
  {
    path: 'websites/{id}/pageviews',
    get: async ({ id, data }) => client.getWebsitePageviews(id, data),
  },
  {
    path: 'websites/{id}/reset',
    post: ({ id }) => client.resetWebsite(id),
  },
  {
    path: 'websites/{id}/stats',
    get: async ({ id, data }) => client.getWebsiteStats(id, data),
  },
  {
    path: 'users',
    get: async () => client.getUsers(),
    post: async ({ data }) => client.createUser(data),
  },
  {
    path: 'users/{id}',
    get: async ({ id }) => client.getUser(id),
    post: async ({ id, data }) => client.updateUser(id, data),
    delete: async ({ id }) => client.deleteUser(id),
  },
  {
    path: 'users/{id}/password',
    post: async ({ id, data }) => client.updateUserPassword(id, data),
  },
  {
    path: 'users/{id}/websites',
    get: async ({ id }) => client.getUserWebsites(id),
  },
  {
    path: 'users/{id}/teams',
    get: async ({ id }) => client.getUserTeams(id),
  },
];

export interface QueryResult {
  query: (() => Promise<any>) | null;
  error: typeof notFoundError | null;
}

export function getQuery(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  data: any,
): QueryResult {
  const { path, id } = getQueryPath(url.split('/'));
  const route = queryMap.find(a => a.path === path);

  const result: QueryResult = {
    query: null,
    error: null,
  };

  if (route) {
    const key = method.toLowerCase();

    if (route[key]) {
      result.query = async () => route[key]({ id, data });
    } else {
      result.error = notFoundError;
    }
  } else {
    result.error = notFoundError;
  }

  return result;
}

export function getQueryPath(segments: string[]): {
  path: string;
  id: string;
} {
  return segments.reduce(
    (obj, segment) => {
      if (uuid.validate(segment)) {
        obj.path += '/{id}';
        obj.id = segment;
      } else {
        obj.path += obj.path ? `/${segment}` : segment;
      }

      return obj;
    },
    { path: '', id: '' },
  );
}

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

export async function runQuery(req, res) {
  const url = req.query.url.join('/');
  const method = req.method.toLowerCase();

  const { query, error } = getQuery(url, method, req.body);

  if (error) {
    return res.status(error.status).end(error.message);
  }

  if (query) {
    const { data, error: queryError } = await query();

    if (queryError) {
      return res.status(queryError.status).end(queryError.message);
    }

    return ok(res, data);
  }

  return badRequest(res);
}

export const client = global[API] || getClient();
