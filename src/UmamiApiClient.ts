import {
  createSecureToken,
  hash,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  buildUrl,
  ApiResponse,
} from 'next-basics';
import * as Umami from 'types';
import debug from 'debug';
import { SearchResult } from 'types';

export const log = debug('umami:api-client');

export const API_KEY_HEADER = 'x-umami-api-key';

export interface UmamiApiClientOptions {
  userId?: string;
  secret?: string;
  apiEndpoint?: string;
  apiKey?: string;
}

export class UmamiApiClient {
  apiEndpoint: string;
  secret: string;
  authToken?: string;
  apiKey?: string;

  constructor(options: UmamiApiClientOptions) {
    const { userId, secret, apiEndpoint = '', apiKey } = options;

    this.apiEndpoint = apiEndpoint;
    this.secret = hash(secret);
    this.apiKey = apiKey;

    if (userId) {
      this.setAuthToken({ userId });
    }
  }

  setAuthToken(data: object) {
    this.authToken = createSecureToken(data, this.secret);
  }

  setSecret(secret: string) {
    this.secret = secret;
  }

  setApiEndPoint(url: string) {
    this.apiEndpoint = url;
  }

  getHeaders(headers: any = {}) {
    if (this.authToken) {
      headers.authorization = `Bearer ${this.authToken}`;
    }
    if (this.apiKey) {
      headers[API_KEY_HEADER] = this.apiKey;
    }

    return headers;
  }

  get(url: string, params?: object, headers?: object) {
    const dest = buildUrl(`${this.apiEndpoint}/${url}`, params);

    log(`GET ${dest}`, params, headers);

    return httpGet(dest, undefined, {
      ...this.getHeaders(headers),
    });
  }

  post(url: string, data?: object, headers?: object) {
    const dest = `${this.apiEndpoint}/${url}`;

    log(`POST ${dest}`, data, headers);

    return httpPost(dest, data, this.getHeaders(headers));
  }

  put(url: string, params?: object, headers?: object) {
    const dest = `${this.apiEndpoint}/${url}`;

    log(`PUT ${dest}`, params, headers);

    return httpPut(dest, params, this.getHeaders(headers));
  }

  del(url: string, params?: object, headers?: object) {
    const dest = buildUrl(`${this.apiEndpoint}/${url}`, params);

    log(`DELETE ${dest}`, params, headers);

    return httpDelete(dest, undefined, this.getHeaders(headers));
  }

  async createUser(data: {
    id?: string;
    username: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<Umami.User>> {
    return this.post(`users`, data);
  }

  async getUser(userId: string): Promise<ApiResponse<Umami.User>> {
    return this.get(`users/${userId}`);
  }

  async getUsers(
    params: Umami.UserSearchParams,
  ): Promise<ApiResponse<Umami.SearchResult<Umami.User[]>>> {
    return this.get(`users`, params);
  }

  async getUserUsage(
    userId: string,
    params: {
      startAt: number;
      endAt: number;
    },
  ) {
    return this.get(`users/${userId}/usage`, params);
  }

  async getUserTeams(
    userId: string,
    params?: Umami.TeamSearchParams,
  ): Promise<ApiResponse<Umami.SearchResult<Umami.Team[]>>> {
    return this.get(`users/${userId}/teams`, params);
  }

  async getUserWebsites(
    userId: string,
    params?: Umami.WebsiteSearchParams,
  ): Promise<ApiResponse<Umami.SearchResult<Umami.Website[]>>> {
    return this.get(`users/${userId}/websites`, params);
  }

  async deleteUser(userId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`users/${userId}`);
  }

  async updateUser(
    userId: string,
    data: { username: string; password: string },
  ): Promise<ApiResponse<Umami.User>> {
    return this.post(`users/${userId}`, data);
  }

  async getShare(shareId: string): Promise<ApiResponse<Umami.Share>> {
    return this.get(`share/${shareId}`);
  }

  async getReport(reportId): Promise<ApiResponse<Umami.Report>> {
    return this.get(`reports/${reportId}`);
  }

  async updateReport(
    reportId,
    data: {
      websiteId: string;
      type: string;
      name: string;
      description: string;
      parameters: string;
    },
  ): Promise<ApiResponse<Umami.Report>> {
    return this.post(`reports/${reportId}`, data);
  }

  async deleteReport(reportId): Promise<ApiResponse<Umami.Report>> {
    return this.del(`reports/${reportId}`);
  }

  async getReports(
    params?: Umami.SearchParams,
  ): Promise<ApiResponse<SearchResult<Umami.Report[]>>> {
    return this.get(`reports`, params);
  }

  async createReport(data: {
    websiteId: string;
    name: string;
    type: string;
    description: string;
    parameters: {
      [key: string]: any;
    };
  }): Promise<ApiResponse<Umami.Report>> {
    return this.post(`reports`, data);
  }

  async createWebsite(data: { name: string; domain: string }): Promise<ApiResponse<Umami.Website>> {
    return this.post(`websites`, data);
  }

  async getWebsite(websiteId: string): Promise<ApiResponse<Umami.Website>> {
    return this.get(`websites/${websiteId}`);
  }

  async updateWebsite(
    websiteId: string,
    params: {
      name: string;
      domain: string;
      shareId: string;
    },
  ): Promise<ApiResponse<Umami.Empty>> {
    return this.post(`websites/${websiteId}`, params);
  }

  async deleteWebsite(websiteId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`websites/${websiteId}`);
  }

  async resetWebsite(websiteId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.post(`websites/${websiteId}/reset`);
  }

  async getWebsites(
    params?: Umami.WebsiteSearchParams,
  ): Promise<ApiResponse<Umami.SearchResult<Umami.Website[]>>> {
    return this.get(`websites`, params);
  }

  async getWebsiteActive(websiteId: string): Promise<ApiResponse<Umami.WebsiteActive>> {
    return this.get(`websites/${websiteId}/active`);
  }

  async getWebsiteReports(websiteId: string): Promise<ApiResponse<Umami.Report[]>> {
    return this.get(`websites/${websiteId}/reports`);
  }

  async getWebsiteValues(
    websiteId: string,
    params: { startAt: number; endAt: number },
  ): Promise<ApiResponse<any>> {
    return this.get(`websites/${websiteId}/values`, params);
  }

  async getWebsiteEvents(
    websiteId: string,
    params: {
      startAt: string;
      endAt: string;
      query?: string;
    },
  ): Promise<ApiResponse<SearchResult<Umami.WebsiteEvent[]>>> {
    return this.get(`websites/${websiteId}/events`, params);
  }

  async getWebsiteSessions(
    websiteId: string,
    params: {
      startAt: string;
      endAt: string;
    },
  ): Promise<ApiResponse<SearchResult<Umami.WebsiteSession[]>>> {
    return this.get(`websites/${websiteId}/sessions`, params);
  }

  async getWebsiteSessionStats(
    websiteId: string,
    params: {
      startAt: string;
      endAt: string;
      url?: string;
      referrer?: string;
      title?: string;
      query?: string;
      event?: string;
      host?: string;
      os?: string;
      browser?: string;
      device?: string;
      country?: string;
      region?: string;
      city?: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteSessionStats>> {
    return this.get(`websites/${websiteId}/sessions/stats`, params);
  }

  async getWebsiteSession(
    websiteId: string,
    sessionId: string,
  ): Promise<ApiResponse<SearchResult<Umami.WebsiteSession>>> {
    return this.get(`websites/${websiteId}/sessions/${sessionId}`);
  }

  async getSessionActivity(
    websiteId: string,
    sessionId: string,
    params: {
      startAt: string;
      endAt: string;
    },
  ): Promise<ApiResponse<SearchResult<Umami.SessionActivity[]>>> {
    return this.get(`websites/${websiteId}/sessions/${sessionId}/activity`, params);
  }

  async getSessionData(
    websiteId: string,
    sessionId: string,
  ): Promise<ApiResponse<SearchResult<Umami.SessionData[]>>> {
    return this.get(`websites/${websiteId}/sessions/${sessionId}/properties`);
  }

  async getEventMetrics(
    websiteId: string,
    params: {
      startAt: string;
      endAt: string;
      unit: string;
      timezone: string;
      url?: string;
      referrer?: string;
      title?: string;
      host?: string;
      os?: string;
      browser?: string;
      device?: string;
      country?: string;
      region?: string;
      city?: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteEventMetric[]>> {
    return this.get(`websites/${websiteId}/events/series`, params);
  }

  async getWebsiteMetrics(
    websiteId: string,
    params: {
      type: string;
      startAt: number;
      endAt: number;
      url?: string;
      referrer?: string;
      title?: string;
      query?: string;
      event?: string;
      os?: string;
      browser?: string;
      device?: string;
      country?: string;
      region?: string;
      city?: string;
      limit?: number;
      tag?: string;
    },
  ): Promise<ApiResponse<SearchResult<Umami.WebsiteMetric[]>>> {
    return this.get(`websites/${websiteId}/metrics`, params);
  }

  async getWebsitePageviews(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
      unit: string;
      timezone: string;
      url?: string;
      referrer?: string;
      title?: string;
      os?: string;
      browser?: string;
      device?: string;
      country?: string;
      region?: string;
      city?: string;
      tag?: string;
    },
  ): Promise<ApiResponse<Umami.WebsitePageviews>> {
    return this.get(`websites/${websiteId}/pageviews`, params);
  }

  async getWebsiteStats(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
      url?: string;
      referrer?: string;
      title?: string;
      query?: string;
      event?: string;
      os?: string;
      browser?: string;
      device?: string;
      country?: string;
      region?: string;
      city?: string;
      tag?: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteStats>> {
    return this.get(`websites/${websiteId}/stats`, params);
  }

  async createTeam(data: { name: string; domain: string }): Promise<ApiResponse<Umami.Team>> {
    return this.post(`teams`, data);
  }

  async getTeam(teamId: string): Promise<ApiResponse<Umami.Team>> {
    return this.get(`teams/${teamId}`);
  }

  async getTeams(
    params?: Umami.TeamSearchParams,
  ): Promise<ApiResponse<SearchResult<Umami.Team[]>>> {
    return this.get(`teams`, params);
  }

  async joinTeam(data: { accessCode: string }): Promise<ApiResponse<Umami.Team>> {
    return this.post(`teams/join`, data);
  }

  async getTeamUsers(
    teamId: string,
    params?: Umami.UserSearchParams,
  ): Promise<ApiResponse<SearchResult<Umami.User[]>>> {
    return this.get(`teams/${teamId}/users`, params);
  }

  async getTeamUser(teamId: string, userId: string): Promise<ApiResponse<Umami.User>> {
    return this.get(`teams/${teamId}/users/${userId}`);
  }

  async createTeamUser(
    teamId: string,
    data: { userId: string; role: string },
  ): Promise<ApiResponse<Umami.TeamUser>> {
    return this.post(`teams/${teamId}/users`, data);
  }

  async updateTeamMember(
    teamId: string,
    userId: string,
    data: { role: string },
  ): Promise<ApiResponse<Umami.TeamUser>> {
    return this.post(`teams/${teamId}/users/${userId}`, data);
  }

  async deleteTeamUser(teamId: string, userId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`teams/${teamId}/users/${userId}`);
  }

  async getTeamWebsites(
    teamId: string,
    params?: Umami.WebsiteSearchParams,
  ): Promise<ApiResponse<Umami.SearchResult<Umami.SearchResult<Umami.Website[]>>>> {
    return this.get(`teams/${teamId}/websites`, params);
  }

  async createTeamWebsite(
    teamId: string,
    data: { name: string; domain: string; shareId: string },
  ): Promise<ApiResponse<Umami.Team>> {
    return this.post(`teams/${teamId}/websites`, data);
  }

  async deleteTeamWebsite(teamId: string, websiteId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`teams/${teamId}/websites/${websiteId}`);
  }

  async updateTeam(
    teamId: string,
    data: {
      name: string;
      accessCode: string;
    },
  ): Promise<ApiResponse<Umami.Empty>> {
    return this.post(`teams/${teamId}`, data);
  }

  async deleteTeam(teamId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`teams/${teamId}`);
  }

  async login(username: string, password: string) {
    return this.post('auth/login', { username, password });
  }

  async verify() {
    return this.get('auth/verify');
  }

  async getMe() {
    return this.get('me');
  }

  async getMyWebsites(params?: Umami.WebsiteSearchParams) {
    return this.get('me/websites', params);
  }

  async getMyTeams(params?: Umami.TeamSearchParams) {
    return this.get('me/teams', params);
  }

  async updateMyPassword(data: { currentPassword: string; newPassword: string }) {
    return this.post('me/password', data);
  }

  async getRealtime(
    websiteId: string,
    data: {
      startAt: number;
    },
  ) {
    return this.get(`realtime/${websiteId}`, data);
  }

  async getEventDataEvents(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
      event?: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteEventData[]>> {
    return this.get(`websites/${websiteId}/event-data/events`, { websiteId, ...params });
  }

  async getEventDataStats(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
    },
  ): Promise<ApiResponse<Umami.WebsiteEventDataStats>> {
    return this.get(`websites/${websiteId}/event-data/stats`, { websiteId, ...params });
  }

  async getEventDataValues(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
      eventName: string;
      propertyName: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteDataValue[]>> {
    return this.get(`websites/${websiteId}/event-data/values`, { websiteId, ...params });
  }

  async getEventDataFields(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
    },
  ): Promise<ApiResponse<Umami.WebsiteDataField[]>> {
    return this.get(`websites/${websiteId}/event-data/fields`, { websiteId, ...params });
  }

  async getSessionDataProperties(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
    },
  ): Promise<ApiResponse<Umami.WebsiteSessionData[]>> {
    return this.get(`websites/${websiteId}/session-data/properties`, { websiteId, ...params });
  }

  async getSessionDataValues(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
      eventName: string;
      propertyName: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteDataValue[]>> {
    return this.get(`websites/${websiteId}/session-data/values`, { websiteId, ...params });
  }

  async transferWebsite(
    websiteId: string,
    params: {
      userId?: string;
      teamId?: string;
    },
  ) {
    return this.post(`websites/${websiteId}/transfer`, { websiteId, ...params });
  }

  async runFunnelReport(data: {
    websiteId: string;
    urls: string[];
    window: number;
    dateRange: {
      startDate: string;
      endDate: string;
    };
  }) {
    return this.post(`reports/funnel`, data);
  }

  async runInsightsReport(data: {
    websiteId: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    fields: { name: string; type: string; label: string }[];
    filters: { name: string; type: string; filter: string; value: string }[];
    groups: { name: string; type: string }[];
  }) {
    return this.post(`reports/insights`, data);
  }

  async runRetentionReport(data: {
    websiteId: string;
    dateRange: { startDate: string; endDate: string; timezone: string };
  }) {
    return this.post(`reports/retention`, data);
  }

  async runUTMReport(data: {
    websiteId: string;
    dateRange: { startDate: string; endDate: string };
  }) {
    return this.post(`reports/utm`, data);
  }

  async runGoalsReport(data: {
    websiteId: string;
    dateRange: { startDate: string; endDate: string };
  }) {
    return this.post(`reports/goals`, data);
  }

  async runJourneyReport(data: {
    websiteId: string;
    dateRange: { startDate: string; endDate: string };
  }) {
    return this.post(`reports/journey`, data);
  }

  async runRevenueReport(data: {
    websiteId: string;
    dateRange: { startDate: string; endDate: string };
  }) {
    return this.post(`reports/revenue`, data);
  }

  async send(data: {
    type: 'event';
    payload: {
      data: { [key: string]: any };
      hostname: string;
      language: string;
      referrer: string;
      screen: string;
      title: string;
      url: string;
      website: string;
      name: string;
    };
  }) {
    const { type, payload } = data;

    return this.post('send', { type, payload });
  }

  async config() {
    return this.get('config');
  }

  async heartbeat() {
    return this.get('heartbeat');
  }

  async executeRoute(url: string, method: string, data: any): Promise<ApiResponse<any>> {
    const routes = [
      {
        path: /^admin\/users$/,
        get: async ([]: any, data: Umami.UserSearchParams) => this.getUsers(data),
      },
      {
        path: /^admin\/websites$/,
        get: async ([]: any, data: Umami.UserSearchParams) => this.getWebsites(data),
      },
      {
        path: /^me$/,
        get: async () => this.getMe(),
      },
      {
        path: /^me\/password$/,
        post: async (
          [],
          data: {
            currentPassword: string;
            newPassword: string;
          },
        ) => this.updateMyPassword(data),
      },
      {
        path: /^me\/teams$/,
        get: async ([], data: Umami.TeamSearchParams) => this.getMyTeams(data),
      },
      {
        path: /^me\/websites$/,
        get: async ([], data: Umami.WebsiteSearchParams) => this.getMyWebsites(data),
      },
      {
        path: /^realtime\/[0-9a-f-]+$/,
        get: async ([, id], data: { startAt: number }) => this.getRealtime(id, data),
      },
      {
        path: /^reports\/[0-9a-f-]+$/,
        get: async ([, id]) => this.getReport(id),
        post: async (
          [, id],
          data: {
            websiteId: string;
            type: string;
            name: string;
            description: string;
            parameters: string;
          },
        ) => this.updateReport(id, data),
        delete: async ([, id]) => this.deleteReport(id),
      },
      {
        path: /^reports$/,
        get: async ([], data: Umami.SearchParams) => this.getReports(data),
        post: async (
          [],
          data: {
            websiteId: string;
            name: string;
            type: string;
            description: string;
            parameters: {
              [key: string]: any;
            };
          },
        ) => this.createReport(data),
      },
      {
        path: /^reports\/funnel$/,
        post: async (
          [],
          data: {
            websiteId: string;
            urls: string[];
            window: number;
            dateRange: {
              startDate: string;
              endDate: string;
            };
          },
        ) => this.runFunnelReport(data),
      },
      {
        path: /^reports\/insight$/,
        post: async (
          [],
          data: {
            websiteId: string;
            dateRange: {
              startDate: string;
              endDate: string;
            };
            fields: { name: string; type: string; label: string }[];
            filters: { name: string; type: string; filter: string; value: string }[];
            groups: { name: string; type: string }[];
          },
        ) => this.runInsightsReport(data),
      },
      {
        path: /^reports\/retention$/,
        post: async (
          [],
          data: {
            websiteId: string;
            dateRange: { startDate: string; endDate: string; timezone: string };
          },
        ) => this.runRetentionReport(data),
      },
      {
        path: /^reports\/revenue$/,
        post: async (
          [],
          data: {
            websiteId: string;
            dateRange: { startDate: string; endDate: string };
          },
        ) => this.runRevenueReport(data),
      },
      {
        path: /^reports\/utm$/,
        post: async (
          [],
          data: {
            websiteId: string;
            dateRange: { startDate: string; endDate: string };
          },
        ) => this.runUTMReport(data),
      },
      {
        path: /^reports\/goals$/,
        post: async (
          [],
          data: {
            websiteId: string;
            dateRange: { startDate: string; endDate: string };
          },
        ) => this.runGoalsReport(data),
      },
      {
        path: /^reports\/journey$/,
        post: async (
          [],
          data: {
            websiteId: string;
            dateRange: { startDate: string; endDate: string };
          },
        ) => this.runJourneyReport(data),
      },
      {
        path: /^teams$/,
        get: async ([], data: Umami.TeamSearchParams | undefined) => this.getTeams(data),
        post: async ([], data: { name: string; domain: string }) => this.createTeam(data),
      },
      {
        path: /^teams\/join$/,
        post: async ([]: any, data: { accessCode: string }) => this.joinTeam(data),
      },
      {
        path: /^teams\/[0-9a-f-]+$/,
        get: async ([, id]: any) => this.getTeam(id),
        post: async ([, id]: any, data: { name: string; accessCode: string }) =>
          this.updateTeam(id, data),
        delete: async ([, id]: any) => this.deleteTeam(id),
      },
      {
        path: /^teams\/[0-9a-f-]+\/users$/,
        get: async ([, id]: any, data: Umami.UserSearchParams | undefined) =>
          this.getTeamUsers(id, data),
        post: async ([, id]: any, data: { userId: string; role: string }) =>
          this.createTeamUser(id, data),
      },
      {
        path: /^teams\/[0-9a-f-]+\/users\/[0-9a-f-]+$/,
        get: async ([, teamId, , userId]: any) => this.getTeamUser(teamId, userId),
        post: async ([, teamId, , userId]: any, data: { role: string }) =>
          this.updateTeamMember(teamId, userId, data),
        delete: async ([, teamId, , userId]: any) => this.deleteTeamUser(teamId, userId),
      },
      {
        path: /^teams\/[0-9a-f-]+\/websites$/,
        get: async ([, id]: any, data: Umami.WebsiteSearchParams | undefined) =>
          this.getTeamWebsites(id, data),
        post: async ([, id]: any, data: { name: string; domain: string; shareId: string }) =>
          this.createTeamWebsite(id, data),
      },
      {
        path: /^users$/,
        get: async ([]: any, data: Umami.UserSearchParams) => this.getUsers(data),
        post: async ([]: any, data: { username: string; password: string }) =>
          this.createUser(data),
      },
      {
        path: /^users\/[0-9a-f-]+$/,
        get: async ([, id]: any) => this.getUser(id),
        post: async ([, id]: any, data: { username: string; password: string }) =>
          this.updateUser(id, data),
        delete: async ([, id]: any) => this.deleteUser(id),
      },
      {
        path: /^users\/[0-9a-f-]+\/teams$/,
        get: async ([, id]: any, data: Umami.WebsiteSearchParams) => this.getUserTeams(id, data),
      },
      {
        path: /^users\/[0-9a-f-]+\/websites$/,
        get: async ([, id]: any, data: Umami.WebsiteSearchParams) => this.getUserWebsites(id, data),
      },
      {
        path: /^users\/[0-9a-f-]+\/usage$/,
        get: async ([, id]: any, data: { startAt: number; endAt: number }) =>
          this.getUserUsage(id, data),
      },
      {
        path: /^websites$/,
        get: async ([]: any, data: Umami.WebsiteSearchParams | undefined) => this.getWebsites(data),
        post: async (
          []: any,
          data: { name: string; domain: string; shareId: string; teamId: string },
        ) => this.createWebsite(data),
      },
      {
        path: /^websites\/[0-9a-f-]+$/,
        get: async ([, id]: any) => this.getWebsite(id),
        post: async ([, id]: any, data: { name: string; domain: string; shareId: string }) =>
          this.updateWebsite(id, data),
        delete: async ([, id]: any) => this.deleteWebsite(id),
      },
      {
        path: /^websites\/[0-9a-f-]+\/active$/,
        get: async ([, id]: any) => this.getWebsiteActive(id),
      },
      {
        path: /^websites\/[0-9a-f-]+\/daterange$/,
        get: async ([, id]: any) => this.getWebsiteActive(id),
      },
      {
        path: /^websites\/[0-9a-f-]+\/event-data\/events$/,
        get: async (
          [, id]: any,
          data: {
            startAt: number;
            endAt: number;
            event?: string;
          },
        ) => this.getEventDataEvents(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/event-data\/stats$/,
        get: async (
          [, id]: any,
          data: {
            startAt: number;
            endAt: number;
          },
        ) => this.getEventDataStats(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/event-data\/values$/,
        get: async (
          [, id]: any,
          data: { startAt: number; endAt: number; eventName: string; propertyName: string },
        ) => this.getEventDataValues(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/event-data\/fields$/,
        get: async ([, id]: any, data: { startAt: number; endAt: number }) =>
          this.getEventDataFields(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/events$/,
        get: async (
          [, id]: any,
          data: {
            startAt: string;
            endAt: string;
            query?: string;
          },
        ) => this.getWebsiteEvents(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/events\/series$/,
        get: async (
          [, id]: any,
          data: {
            startAt: string;
            endAt: string;
            unit: string;
            timezone: string;
            url?: string | undefined;
            referrer?: string | undefined;
            title?: string | undefined;
            host?: string | undefined;
            os?: string | undefined;
            browser?: string | undefined;
            device?: string | undefined;
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
          },
        ) => this.getEventMetrics(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/metrics$/,
        get: async (
          [, id]: any,
          data: {
            type: string;
            startAt: number;
            endAt: number;
            url?: string | undefined;
            referrer?: string | undefined;
            title?: string | undefined;
            query?: string | undefined;
            event?: string | undefined;
            os?: string | undefined;
            browser?: string | undefined;
            device?: string | undefined;
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            language?: string | undefined;
            limit?: number | undefined;
            tag?: string | undefined;
          },
        ) => this.getWebsiteMetrics(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/pageviews$/,
        get: async (
          [, id]: any,
          data: {
            startAt: number;
            endAt: number;
            unit: string;
            timezone: string;
            url?: string | undefined;
            referrer?: string | undefined;
            title?: string | undefined;
            os?: string | undefined;
            browser?: string | undefined;
            device?: string | undefined;
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            tag?: string | undefined;
          },
        ) => this.getWebsitePageviews(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/reports$/,
        post: ([, id]: any) => this.getWebsiteReports(id),
      },
      {
        path: /^websites\/[0-9a-f-]+\/reset$/,
        post: ([, id]: any) => this.resetWebsite(id),
      },
      {
        path: /^websites\/[0-9a-f-]+\/session-data\/properties$/,
        get: async (
          [, id]: any,
          data: {
            startAt: number;
            endAt: number;
          },
        ) => this.getSessionDataProperties(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/session-data\/values$/,
        get: async (
          [, id]: any,
          data: { startAt: number; endAt: number; eventName: string; propertyName: string },
        ) => this.getSessionDataValues(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/sessions$/,
        get: async (
          [, id]: any,
          data: {
            startAt: string;
            endAt: string;
          },
        ) => this.getWebsiteSessions(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/sessions\/stats$/,
        get: async (
          [, id]: any,
          data: {
            startAt: string;
            endAt: string;
            url?: string;
            referrer?: string;
            title?: string;
            query?: string;
            event?: string;
            host?: string;
            os?: string;
            browser?: string;
            device?: string;
            country?: string;
            region?: string;
            city?: string;
          },
        ) => this.getWebsiteSessionStats(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/sessions\/[0-9a-f-]+$/,
        get: async ([, websiteId, , sessionId]: any) =>
          this.getWebsiteSession(websiteId, sessionId),
      },
      {
        path: /^websites\/[0-9a-f-]+\/sessions\/[0-9a-f-]+\/activity$/,
        get: async (
          [, websiteId, , sessionId]: any,
          data: {
            startAt: string;
            endAt: string;
          },
        ) => this.getSessionActivity(websiteId, sessionId, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/sessions\/[0-9a-f-]+\/properties$/,
        get: async ([, websiteId, , sessionId]: any) => this.getSessionData(websiteId, sessionId),
      },
      {
        path: /^websites\/[0-9a-f-]+\/stats$/,
        get: async (
          [, id]: any,
          data: {
            startAt: number;
            endAt: number;
            url?: string;
            referrer?: string | undefined;
            title?: string | undefined;
            query?: string | undefined;
            event?: string | undefined;
            os?: string | undefined;
            browser?: string | undefined;
            device?: string | undefined;
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            tag?: string | undefined;
          },
        ) => this.getWebsiteStats(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/transfer$/,
        post: (
          [, id]: any,
          data: {
            userId?: string;
            teamId?: string;
          },
        ) => this.transferWebsite(id, data),
      },
      {
        path: /^websites\/[0-9a-f-]+\/values$/,
        pogetst: (
          [, id]: any,
          data: {
            startAt: number;
            endAt: number;
          },
        ) => this.getWebsiteValues(id, data),
      },
    ];

    const route = routes.find(({ path }) => url.match(path));
    const key = method.toLowerCase();

    if (route && route[key]) {
      return route[key](url.split('/'), data);
    }

    return { ok: false, status: 404, error: { status: 404, message: `Not Found: ${url}` } };
  }
}

export default UmamiApiClient;
