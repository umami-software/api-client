import debug from 'debug';
import { createSecureToken, hash, apiRequest, buildUrl, ApiResponse } from 'next-basics';
import * as Umami from './types';

const log = debug('umami:api');

export interface UmamiApiClientOptions {
  userId?: string;
  secret?: string;
  apiEndpoint?: string;
}

export class UmamiApiClient {
  apiEndpoint: string;
  secret: string;
  authToken?: string;

  constructor(options: UmamiApiClientOptions) {
    const { userId, secret, apiEndpoint = '' } = options;

    this.apiEndpoint = apiEndpoint;
    this.secret = hash(secret);

    if (userId) {
      this.setAuthToken({ userId });
    }
  }

  setAuthToken(data) {
    this.authToken = createSecureToken(data, this.secret);
  }

  get(url: string, params?: object, headers?: object) {
    log(buildUrl(`GET ${this.apiEndpoint}/${url}`, params));

    return apiRequest('get', buildUrl(`${this.apiEndpoint}/${url}`, params), undefined, {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  del(url: string, params?: object, headers?: object) {
    log(buildUrl(`DELETE ${this.apiEndpoint}/${url}`, params));

    return apiRequest('delete', buildUrl(`${this.apiEndpoint}/${url}`, params), undefined, {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  post(url: string, params?: object, headers?: object) {
    log(`POST ${this.apiEndpoint}/${url}`);

    return apiRequest('post', `${this.apiEndpoint}/${url}`, JSON.stringify(params), {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  put(url: string, params?: object, headers?: object) {
    log(`PUT ${this.apiEndpoint}/${url}`);

    return apiRequest('put', `${this.apiEndpoint}/${url}`, JSON.stringify(params), {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  async createUser(data: { username: string; password: string }): Promise<ApiResponse<Umami.User>> {
    return this.post(`users`, data);
  }

  async getUser(userId: string): Promise<ApiResponse<Umami.User>> {
    return this.get(`users/${userId}`);
  }

  async getUsers(): Promise<ApiResponse<Umami.User[]>> {
    return this.get(`users`);
  }

  async getUserWebsites(userId: string): Promise<ApiResponse<Umami.User[]>> {
    return this.get(`users/${userId}/websites`);
  }

  async getUserTeams(userId: string): Promise<ApiResponse<Umami.User[]>> {
    return this.get(`users/${userId}/teams`);
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

  async updateUserPassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<ApiResponse<Umami.User>> {
    const { currentPassword: current_password, newPassword: new_password } = data;
    return this.post(`users/${userId}/password`, { current_password, new_password });
  }

  async getShare(shareId: string): Promise<ApiResponse<Umami.Share[]>> {
    return this.get(`share/${shareId}`);
  }

  async createWebsite(data: { name: string; domain: string }): Promise<ApiResponse<Umami.Website>> {
    return this.post(`websites`, data);
  }

  async getWebsite(websiteId: string): Promise<ApiResponse<Umami.Website>> {
    return this.get(`websites/${websiteId}`);
  }

  async updateWebsite(
    websiteId: string,
    data: {
      name: string;
      domain: string;
      shareId: string;
    },
  ): Promise<ApiResponse<Umami.Empty>> {
    return this.post(`websites/${websiteId}`, data);
  }

  async deleteWebsite(websiteId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`websites/${websiteId}`);
  }

  async resetWebsite(websiteId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.post(`websites/${websiteId}/reset`);
  }

  async getWebsites(): Promise<ApiResponse<Umami.Website[]>> {
    return this.get(`websites`);
  }

  async getWebsiteActive(websiteId: string): Promise<ApiResponse<Umami.WebsiteActive[]>> {
    return this.get(`websites/${websiteId}/active`);
  }

  async getWebsiteEventData(
    websiteId: string,
    params: {
      startAt: Date;
      endAt: Date;
      timezone: string;
      eventName?: string;
      columns: { [key: string]: 'count' | 'max' | 'min' | 'avg' | 'sum' };
      filters?: { [key: string]: any };
    },
  ): Promise<ApiResponse<Umami.WebsiteMetric[]>> {
    const { startAt, endAt, eventName: event_name, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.post(`websites/${websiteId}/eventdata`, {
      start_at,
      end_at,
      event_name,
      ...rest,
    });
  }

  async getWebsiteEvents(
    websiteId: string,
    params: {
      startAt: Date;
      endAt: Date;
      unit: string;
      timezone: string;
      url?: string;
      eventName?: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteMetric[]>> {
    const { timezone: tz, eventName: event_name, startAt, endAt, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${websiteId}/events`, {
      start_at,
      end_at,
      event_name,
      tz,
      ...rest,
    });
  }

  async getWebsiteMetrics(
    websiteId: string,
    params: {
      type: string;
      startAt: Date;
      endAt: Date;
      url?: string;
      referrer?: string;
      os?: string;
      browser?: string;
      device?: string;
      country?: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteMetric[]>> {
    const { startAt, endAt, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${websiteId}/metrics`, { start_at, end_at, ...rest });
  }

  async getWebsitePageviews(
    websiteId: string,
    params: {
      startAt: Date;
      endAt: Date;
      unit: string;
      timezone: string;
      url: string;
      referrer: string;
      os: string;
      browser: string;
      device: string;
      country: string;
    },
  ): Promise<ApiResponse<Umami.WebsitePageviews>> {
    const { startAt, endAt, timezone: tz, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${websiteId}/pageviews`, { start_at, end_at, tz, ...rest });
  }

  async getWebsiteStats(
    websiteId: string,
    params: {
      type: string;
      startAt: Date;
      endAt: Date;
      url: string;
      referrer: string;
      os: string;
      browser: string;
      device: string;
      country: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteStats>> {
    const { startAt, endAt, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${websiteId}/stats`, { start_at, end_at, ...rest });
  }

  async createTeam(data: { name: string; domain: string }): Promise<ApiResponse<Umami.Team>> {
    return this.post(`teams`, data);
  }

  async getTeam(teamId: string): Promise<ApiResponse<Umami.Team>> {
    return this.get(`teams/${teamId}`);
  }

  async getTeams(): Promise<ApiResponse<Umami.Team[]>> {
    return this.get(`teams`);
  }

  async getTeamUsers(teamId: string): Promise<ApiResponse<Umami.User[]>> {
    return this.get(`teams/${teamId}/users`);
  }

  async getTeamWebsites(teamId: string): Promise<ApiResponse<Umami.Website[]>> {
    return this.get(`teams/${teamId}/websites`);
  }

  async updateTeam(
    teamId: string,
    data: {
      name: string;
      domain: string;
      shareId: string;
    },
  ): Promise<ApiResponse<Umami.Empty>> {
    return this.post(`teams/${teamId}`, data);
  }

  async deleteTeam(teamId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`teams/${teamId}`);
  }

  async getRealtimeInit(): Promise<ApiResponse<Umami.RealtimeInit>> {
    return this.get(`realtime/init`);
  }

  async getRealtimeUpdate(startAt: Date): Promise<ApiResponse<Umami.RealtimeUpdate>> {
    const start_at = startAt.getTime();

    return this.get(`realtime/update`, { start_at });
  }

  async login(username: string, password: string) {
    return this.post('auth/login', { username, password });
  }

  async verify() {
    return this.get('auth/verify');
  }

  async collect(
    websiteId: string,
    data: {
      type: 'event' | 'pageview';
      payload: {
        url: string;
        referrer: string;
        hostname?: string;
        language?: string;
        screen?: string;
        eventData?: { [key: string]: any };
      };
    },
  ) {
    const { type, payload } = data;

    return this.post('collect', { type, payload: { ...payload, website: websiteId } });
  }

  async config() {
    return this.get('config');
  }

  async haertbeat() {
    return this.get('heartbeat');
  }
}

export default UmamiApiClient;
