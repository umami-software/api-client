import debug from 'debug';
import { createSecureToken, hash } from 'lib/crypto';
import { apiRequest } from 'lib/request';
import { buildUrl } from 'lib/url';
import { ApiResponse } from 'lib/request';
import * as UmamiApi from 'models';

const log = debug('umami:api');

export interface UmamiApiClientOptions {
  userId: string;
  secret: string;
  baseUrl?: string;
}

export class UmamiApiClient {
  baseUrl: string;
  authToken: string;

  constructor(options: UmamiApiClientOptions) {
    const { userId, secret, baseUrl = '' } = options;

    this.baseUrl = baseUrl;
    this.authToken = createSecureToken({ userId, isAdmin: true }, hash(secret));
  }

  get(url: string, params?: object, headers?: object) {
    log(buildUrl(`get: ${this.baseUrl}/${url}`, params));

    return apiRequest('get', buildUrl(`${this.baseUrl}/${url}`, params), undefined, {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  del(url: string, params?: object, headers?: object) {
    log(buildUrl(`del: ${this.baseUrl}/${url}`, params));

    return apiRequest('delete', buildUrl(`${this.baseUrl}/${url}`, params), undefined, {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  post(url: string, params?: object, headers?: object) {
    log(`post: ${this.baseUrl}/${url}`);

    return apiRequest('post', `${this.baseUrl}/${url}`, JSON.stringify(params), {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  put(url: string, params?: object, headers?: object) {
    log(`put: ${this.baseUrl}/${url}`);

    return apiRequest('put', `${this.baseUrl}/${url}`, JSON.stringify(params), {
      ...headers,
      authorization: `Bearer ${this.authToken}`,
    });
  }

  // user
  async createUser(data: {
    username: string;
    password: string;
  }): Promise<ApiResponse<UmamiApi.User>> {
    return this.post(`users`, data);
  }

  async getUser(id: string): Promise<ApiResponse<[UmamiApi.User]>> {
    return this.get(`users/${id}`);
  }

  async deleteUser(id: string): Promise<ApiResponse<UmamiApi.Empty>> {
    return this.del(`users/${id}`);
  }

  async updateUser(
    id: string,
    data: { username: string; password: string },
  ): Promise<ApiResponse<UmamiApi.User>> {
    return this.post(`users/${id}`, data);
  }

  async updateUserPassword(
    id: string,
    data: {
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<ApiResponse<UmamiApi.User>> {
    const { currentPassword: current_password, newPassword: new_password } = data;
    return this.post(`users/${id}/password`, { current_password, new_password });
  }

  async getUsers(): Promise<ApiResponse<[UmamiApi.User]>> {
    return this.get(`users`);
  }

  // share
  async getShare(id: string): Promise<ApiResponse<[UmamiApi.Share]>> {
    return this.get(`share/${id}`);
  }

  // website
  async createWebsite(data: {
    name: string;
    domain: string;
    enableShareUrl: boolean;
  }): Promise<ApiResponse<UmamiApi.Website>> {
    return this.post(`websites`, data);
  }

  async getWebsite(id: string): Promise<ApiResponse<UmamiApi.Website>> {
    return this.get(`websites/${id}`);
  }

  async updateWebsite(
    id: string,
    data: {
      name: string;
      domain: string;
      shareId;
    },
  ): Promise<ApiResponse<UmamiApi.Empty>> {
    const { shareId: share_id, ...rest } = data;

    return this.post(`websites/${id}`, { share_id, ...rest });
  }

  async deleteWebsite(id: string): Promise<ApiResponse<UmamiApi.Empty>> {
    return this.del(`websites/${id}`);
  }

  async resetWebsite(id: string): Promise<ApiResponse<UmamiApi.Empty>> {
    return this.post(`websites/${id}/reset`);
  }

  async getWebsites(includeAll: boolean = false): Promise<ApiResponse<[UmamiApi.Website]>> {
    return this.get(`websites`, { include_all: includeAll });
  }

  async getWebsiteActive(id: string): Promise<ApiResponse<[UmamiApi.WebsiteActive]>> {
    return this.get(`websites/${id}/active`);
  }

  async getWebsiteEventData(
    id: string,
    params: {
      startAt: Date;
      endAt: Date;
      timezone: string;
      eventName?: string;
      columns: { [key: string]: 'count' | 'max' | 'min' | 'avg' | 'sum' };
      filters?: { [key: string]: any };
    },
  ): Promise<ApiResponse<[UmamiApi.WebsiteMetric]>> {
    const { startAt, endAt, eventName: event_name, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.post(`websites/${id}/eventdata`, {
      start_at,
      end_at,
      event_name,
      ...rest,
    });
  }

  async getWebsiteEvents(
    id: string,
    params: {
      startAt: Date;
      endAt: Date;
      unit: string;
      timezone: string;
      url?: string;
      eventName?: string;
    },
  ): Promise<ApiResponse<[UmamiApi.WebsiteMetric]>> {
    const { timezone: tz, eventName: event_name, startAt, endAt, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${id}/events`, {
      start_at,
      end_at,
      event_name,
      tz,
      ...rest,
    });
  }

  async getWebsiteMetrics(
    id: string,
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
  ): Promise<ApiResponse<[UmamiApi.WebsiteMetric]>> {
    const { startAt, endAt, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${id}/metrics`, { start_at, end_at, ...rest });
  }

  async getWebsitePageviews(
    id: string,
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
  ): Promise<ApiResponse<UmamiApi.WebsitePageviews>> {
    const { startAt, endAt, timezone: tz, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${id}/pageviews`, { start_at, end_at, tz, ...rest });
  }

  async getWebsiteStats(
    id: string,
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
  ): Promise<ApiResponse<UmamiApi.WebsiteStats>> {
    const { startAt, endAt, ...rest } = params;

    const start_at = startAt.getTime();
    const end_at = endAt.getTime();

    return this.get(`websites/${id}/stats`, { start_at, end_at, ...rest });
  }

  // realtime
  async getRealtimeInit(): Promise<ApiResponse<UmamiApi.RealtimeInit>> {
    return this.get(`realtime/init`);
  }

  async getRealtimeUpdate(startAt: Date): Promise<ApiResponse<UmamiApi.RealtimeUpdate>> {
    const start_at = startAt.getTime();

    return this.get(`realtime/update`, { start_at });
  }

  // auth
  async login(username: string, password: string) {
    return this.post('auth/login', { username, password });
  }

  async verify() {
    return this.get('auth/verify');
  }

  // generic
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
