import { createSecureToken, hash, get, post, put, del, buildUrl, ApiResponse } from 'next-basics';
import * as Umami from './types';
import { log } from 'utils';

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

  setAuthToken(data) {
    this.authToken = createSecureToken(data, this.secret);
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

    log(`GET ${dest}`);

    return get(dest, undefined, this.getHeaders(headers));
  }

  post(url: string, params?: object, headers?: object) {
    const dest = `${this.apiEndpoint}/${url}`;

    log(`POST ${dest}`);

    return post(dest, params, this.getHeaders(headers));
  }

  put(url: string, params?: object, headers?: object) {
    const dest = `${this.apiEndpoint}/${url}`;

    log(`PUT ${dest}`);

    return put(dest, params, this.getHeaders(headers));
  }

  del(url: string, params?: object, headers?: object) {
    const dest = buildUrl(`${this.apiEndpoint}/${url}`, params);

    log(`DELETE ${dest}`);

    return del(dest, undefined, this.getHeaders(headers));
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

  async getUserUsage(
    userId: string,
    params: {
      startAt: number;
      endAt: number;
    },
  ) {
    return this.get(`users/${userId}/usage`, params);
  }

  async getUserWebsites(userId: string): Promise<ApiResponse<Umami.User[]>> {
    return this.get(`users/${userId}/websites`);
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

  async getWebsites(): Promise<ApiResponse<Umami.Website[]>> {
    return this.get(`websites`);
  }

  async getWebsiteActive(websiteId: string): Promise<ApiResponse<Umami.WebsiteActive[]>> {
    return this.get(`websites/${websiteId}/active`);
  }

  async getWebsiteEventData(
    websiteId: string,
    params: {
      startAt: string;
      endAt: string;
      eventName?: string;
      urlPath?: string;
      timeSeries?: {
        unit: string;
        timezone: string;
      };
      filters: [
        {
          eventKey?: string;
          eventValue?: string | number | boolean | Date;
        },
      ];
    },
  ): Promise<ApiResponse<Umami.WebsiteMetric[]>> {
    return this.post(`websites/${websiteId}/eventdata`, params);
  }

  async getWebsiteEvents(
    websiteId: string,
    params: {
      startAt: string;
      endAt: string;
      unit: string;
      timezone: string;
      url: string;
      eventName: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteMetric[]>> {
    return this.get(`websites/${websiteId}/events`, params);
  }

  async getWebsiteMetrics(
    websiteId: string,
    params: {
      type: string;
      startAt: number;
      endAt: number;
      url: string;
      referrer: string;
      title: string;
      query: string;
      event: string;
      os: string;
      browser: string;
      device: string;
      country: string;
      region: string;
      city: string;
    },
  ): Promise<ApiResponse<Umami.WebsiteMetric[]>> {
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
      region: string;
      city?: string;
    },
  ): Promise<ApiResponse<Umami.WebsitePageviews>> {
    return this.get(`websites/${websiteId}/pageviews`, params);
  }

  async getWebsiteStats(
    websiteId: string,
    params: {
      startAt: number;
      endAt: number;
      url: string;
      referrer: string;
      title: string;
      query: string;
      event: string;
      os: string;
      browser: string;
      device: string;
      country: string;
      region: string;
      city: string;
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

  async getTeams(): Promise<ApiResponse<Umami.Team[]>> {
    return this.get(`teams`);
  }

  async joinTeam(data: { accessCode: string }): Promise<ApiResponse<Umami.Team>> {
    return this.post(`teams/join`, data);
  }

  async getTeamUsers(teamId: string): Promise<ApiResponse<Umami.User[]>> {
    return this.get(`teams/${teamId}/users`);
  }

  async deleteTeamUser(teamId: string, userId: string): Promise<ApiResponse<Umami.Empty>> {
    return this.del(`teams/${teamId}/users/${userId}`);
  }

  async getTeamWebsites(teamId: string): Promise<ApiResponse<Umami.Website[]>> {
    return this.get(`teams/${teamId}/websites`);
  }

  async createTeamWebsites(
    teamId: string,
    data: { websiteIds: string[] },
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
      domain: string;
      shareId: string;
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

  async getMyWebsites() {
    return this.post('me/websites');
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

    return this.post('collect', { type, payload });
  }

  async config() {
    return this.get('config');
  }

  async heartbeat() {
    return this.get('heartbeat');
  }
}

export default UmamiApiClient;
