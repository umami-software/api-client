import { createSecureToken, hash, type SignOptions } from './crypto';
import { type ApiResponse, buildUrl, type FetchFunction, type QueryParams, request } from './http';
import type * as Umami from './types';

export const API_KEY_HEADER = 'x-umami-api-key';

export interface UmamiApiClientOptions {
  /** User id used to mint an auth token (requires `secret`). */
  userId?: string;
  /** Umami `APP_SECRET`. Hashed on construction, as umami does. */
  secret?: string;
  /** e.g. `https://your-umami/api` or `https://api.umami.is/v1`. */
  apiEndpoint?: string;
  /** Umami Cloud API key. */
  apiKey?: string;
  /** Custom fetch implementation (defaults to `globalThis.fetch`). */
  fetch?: FetchFunction;
  /** Extra headers sent with every request. */
  headers?: Record<string, string>;
}

type Headers = Record<string, string>;
type PageResult<T> = Umami.PageResult<T[]>;

export class UmamiApiClient {
  apiEndpoint: string;
  secret?: string;
  authToken?: string;
  apiKey?: string;
  headers: Headers;
  fetch?: FetchFunction;

  constructor(options: UmamiApiClientOptions = {}) {
    const { userId, secret, apiEndpoint = '', apiKey, fetch, headers = {} } = options;

    this.apiEndpoint = apiEndpoint;
    this.secret = secret ? hash(secret) : undefined;
    this.apiKey = apiKey;
    this.fetch = fetch;
    this.headers = headers;

    if (userId && this.secret) {
      this.setAuthToken({ userId });
    }
  }

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  /** Mint a secure token (same format as umami) from `data`, e.g. `{ userId }`. */
  setAuthToken(data: object, options?: SignOptions) {
    if (!this.secret) {
      throw new Error('A secret is required to create an auth token.');
    }
    this.authToken = createSecureToken(data, this.secret, options);
  }

  /** Use a raw token, e.g. the one returned by `login()` or `verifyTwoFactor()`. */
  setToken(token: string) {
    this.authToken = token;
  }

  clearToken() {
    this.authToken = undefined;
  }

  setSecret(secret: string) {
    this.secret = hash(secret);
  }

  setApiEndPoint(url: string) {
    this.apiEndpoint = url;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getHeaders(headers: Headers = {}): Headers {
    const result: Headers = { ...this.headers };

    if (this.authToken) {
      result.authorization = `Bearer ${this.authToken}`;
    }
    if (this.apiKey) {
      result[API_KEY_HEADER] = this.apiKey;
    }

    return { ...result, ...headers };
  }

  // ---------------------------------------------------------------------------
  // HTTP
  // ---------------------------------------------------------------------------

  get<T = any>(path: string, params?: object, headers?: Headers): Promise<ApiResponse<T>> {
    return request<T>('GET', buildUrl(this.apiEndpoint, path, params as QueryParams), {
      headers: this.getHeaders(headers),
      fetch: this.fetch,
    });
  }

  post<T = any>(path: string, body?: unknown, headers?: Headers): Promise<ApiResponse<T>> {
    return request<T>('POST', buildUrl(this.apiEndpoint, path), {
      headers: this.getHeaders(headers),
      body,
      fetch: this.fetch,
    });
  }

  del<T = any>(path: string, params?: object, headers?: Headers): Promise<ApiResponse<T>> {
    return request<T>('DELETE', buildUrl(this.apiEndpoint, path, params as QueryParams), {
      headers: this.getHeaders(headers),
      fetch: this.fetch,
    });
  }

  // ---------------------------------------------------------------------------
  // Auth / me
  // ---------------------------------------------------------------------------

  login(data: Umami.LoginData) {
    return this.post<Umami.LoginResult>('auth/login', data);
  }

  logout() {
    return this.post<Umami.Ok>('auth/logout');
  }

  sso() {
    return this.post<Umami.SsoResult>('auth/sso');
  }

  verify() {
    return this.post<Umami.VerifyResult>('auth/verify');
  }

  getSubscription(params?: Umami.SubscriptionParams) {
    return this.get<Umami.Subscription>('auth/subscription', params);
  }

  getMe() {
    return this.get<Umami.Auth>('me');
  }

  updateMyPassword(data: Umami.UpdatePasswordData) {
    return this.post<Umami.User>('me/password', data);
  }

  getMyTeams(params?: Umami.PagingParams & Umami.SortingParams) {
    return this.get<PageResult<Umami.Team>>('me/teams', params);
  }

  getMyWebsites(params?: Umami.PagingParams & Umami.SortingParams & { includeTeams?: boolean }) {
    return this.get<PageResult<Umami.Website>>('me/websites', params);
  }

  // ---------------------------------------------------------------------------
  // Two-factor authentication
  // ---------------------------------------------------------------------------

  getTwoFactorStatus() {
    return this.get<Umami.TwoFactorStatus>('2fa/status');
  }

  initiateTwoFactorSetup() {
    return this.post<Umami.TwoFactorSetup>('2fa/setup/initiate');
  }

  confirmTwoFactorSetup(data: Umami.TwoFactorConfirmData) {
    return this.post<Umami.TwoFactorConfirmResult>('2fa/setup/confirm', data);
  }

  cancelTwoFactorSetup() {
    return this.post<Umami.Ok>('2fa/setup/cancel');
  }

  disableTwoFactor(data: Umami.TwoFactorDisableData) {
    return this.post<Umami.Ok>('2fa/disable', data);
  }

  /**
   * Complete a login that returned `requiresTwoFactor`. Pass the `partialToken` from `login()`;
   * when omitted the current auth token is used.
   */
  verifyTwoFactor(data: Umami.TwoFactorVerifyData, partialToken?: string) {
    const headers = partialToken ? { authorization: `Bearer ${partialToken}` } : undefined;

    return this.post<Umami.TwoFactorVerifyResult>('2fa/verify', data, headers);
  }

  // ---------------------------------------------------------------------------
  // Admin
  // ---------------------------------------------------------------------------

  getAdminUsers(params?: Umami.ListParams) {
    return this.get<PageResult<Umami.User>>('admin/users', params);
  }

  getAdminTeams(params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Team>>('admin/teams', params);
  }

  getAdminWebsites(params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Website>>('admin/websites', params);
  }

  setGlobalTwoFactorRequired(data: Umami.TwoFactorRequiredData) {
    return this.post<Umami.Ok & { required: boolean }>('admin/2fa/global', data);
  }

  setTeamTwoFactorRequired(teamId: string, data: Umami.TwoFactorRequiredData) {
    return this.post<Umami.Ok & { teamId: string; twoFactorRequired: boolean }>(
      `admin/teams/${teamId}/2fa`,
      data,
    );
  }

  getUserTwoFactor(userId: string) {
    return this.get<Umami.UserTwoFactorStatus>(`admin/users/${userId}/2fa`);
  }

  setUserTwoFactorRequired(userId: string, data: Umami.TwoFactorRequiredData) {
    return this.post<Umami.Ok & { userId: string; twoFactorRequired: boolean }>(
      `admin/users/${userId}/2fa`,
      data,
    );
  }

  resetUserTwoFactor(userId: string) {
    return this.del<Umami.UserTwoFactorResetResult>(`admin/users/${userId}/2fa`);
  }

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  createUser(data: Umami.CreateUserData) {
    return this.post<Umami.User>('users', data);
  }

  getUser(userId: string) {
    return this.get<Umami.User>(`users/${userId}`);
  }

  updateUser(userId: string, data: Umami.UpdateUserData) {
    return this.post<Umami.User>(`users/${userId}`, data);
  }

  deleteUser(userId: string) {
    return this.del<Umami.Ok>(`users/${userId}`);
  }

  getUserTeams(userId: string, params?: Umami.PagingParams & Umami.SortingParams) {
    return this.get<PageResult<Umami.Team>>(`users/${userId}/teams`, params);
  }

  getUserWebsites(userId: string, params?: Umami.ListParams & { includeTeams?: boolean }) {
    return this.get<PageResult<Umami.Website>>(`users/${userId}/websites`, params);
  }

  // ---------------------------------------------------------------------------
  // Teams
  // ---------------------------------------------------------------------------

  getTeams(params?: Umami.PagingParams & Umami.SortingParams) {
    return this.get<PageResult<Umami.Team>>('teams', params);
  }

  createTeam(data: Umami.CreateTeamData) {
    return this.post<Umami.Team>('teams', data);
  }

  joinTeam(data: Umami.JoinTeamData) {
    return this.post<Umami.TeamUser>('teams/join', data);
  }

  getTeam(teamId: string) {
    return this.get<Umami.Team>(`teams/${teamId}`);
  }

  updateTeam(teamId: string, data: Umami.UpdateTeamData) {
    return this.post<Umami.Team>(`teams/${teamId}`, data);
  }

  deleteTeam(teamId: string) {
    return this.del<Umami.Ok>(`teams/${teamId}`);
  }

  getTeamUsers(teamId: string, params?: Umami.PagingParams & Umami.SearchParams) {
    return this.get<PageResult<Umami.TeamUser>>(`teams/${teamId}/users`, params);
  }

  createTeamUser(teamId: string, data: Umami.CreateTeamUserData) {
    return this.post<Umami.TeamUser>(`teams/${teamId}/users`, data);
  }

  getTeamUser(teamId: string, userId: string) {
    return this.get<Umami.TeamUser>(`teams/${teamId}/users/${userId}`);
  }

  updateTeamUser(teamId: string, userId: string, data: Umami.UpdateTeamUserData) {
    return this.post<Umami.TeamUser>(`teams/${teamId}/users/${userId}`, data);
  }

  deleteTeamUser(teamId: string, userId: string) {
    return this.del<Umami.Ok>(`teams/${teamId}/users/${userId}`);
  }

  getTeamWebsites(teamId: string, params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Website>>(`teams/${teamId}/websites`, params);
  }

  getTeamBoards(teamId: string, params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Board>>(`teams/${teamId}/boards`, params);
  }

  getTeamLinks(teamId: string, params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Link>>(`teams/${teamId}/links`, params);
  }

  getTeamPixels(teamId: string, params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Pixel>>(`teams/${teamId}/pixels`, params);
  }

  // ---------------------------------------------------------------------------
  // Websites
  // ---------------------------------------------------------------------------

  getWebsites(params?: Umami.ListParams & { includeTeams?: boolean }) {
    return this.get<PageResult<Umami.Website>>('websites', params);
  }

  createWebsite(data: Umami.CreateWebsiteData) {
    return this.post<Umami.Website>('websites', data);
  }

  /** Traffic sparklines for up to 20 websites. */
  getWebsitesCharts(params: Umami.ChartsParams) {
    return this.get<Umami.ChartsResult>('websites/charts', params);
  }

  getWebsite(websiteId: string) {
    return this.get<Umami.Website>(`websites/${websiteId}`);
  }

  updateWebsite(websiteId: string, data: Umami.UpdateWebsiteData) {
    return this.post<Umami.Website>(`websites/${websiteId}`, data);
  }

  deleteWebsite(websiteId: string) {
    return this.del<Umami.Ok>(`websites/${websiteId}`);
  }

  resetWebsite(websiteId: string) {
    return this.post<Umami.Ok>(`websites/${websiteId}/reset`);
  }

  transferWebsite(websiteId: string, data: Umami.TransferWebsiteData) {
    return this.post<Umami.Website>(`websites/${websiteId}/transfer`, data);
  }

  getWebsiteActive(websiteId: string) {
    return this.get<Umami.ActiveVisitorsResult>(`websites/${websiteId}/active`);
  }

  getWebsiteDateRange(websiteId: string) {
    return this.get<Umami.DateRangeResult>(`websites/${websiteId}/daterange`);
  }

  getWebsiteValues(websiteId: string, params: Umami.WebsiteValuesParams) {
    return this.get<Umami.WebsiteValueRow[]>(`websites/${websiteId}/values`, params);
  }

  exportWebsite(websiteId: string, params: Umami.WebsiteExportParams) {
    return this.get<Umami.WebsiteExportResult>(`websites/${websiteId}/export`, params);
  }

  getWebsiteRecorderConfig(websiteId: string) {
    return this.get<Umami.RecorderConfig>(`websites/${websiteId}/recorder`);
  }

  getWebsiteReports(websiteId: string, params?: Umami.WebsiteReportsParams) {
    return this.get<PageResult<Umami.Report>>(`websites/${websiteId}/reports`, params);
  }

  getWebsiteShares(websiteId: string, params?: Umami.WebsiteSharesParams) {
    return this.get<PageResult<Umami.Share>>(`websites/${websiteId}/shares`, params);
  }

  createWebsiteShare(websiteId: string, data: Umami.CreateEntityShareData) {
    return this.post<Umami.Share>(`websites/${websiteId}/shares`, data);
  }

  getWebsiteAnnotations(websiteId: string, params?: Umami.WebsiteAnnotationsParams) {
    return this.get<PageResult<Umami.Annotation>>(`websites/${websiteId}/annotations`, params);
  }

  createWebsiteAnnotation(websiteId: string, data: Umami.CreateAnnotationData) {
    return this.post<Umami.Annotation>(`websites/${websiteId}/annotations`, data);
  }

  getWebsiteAnnotation(websiteId: string, annotationId: string) {
    return this.get<Umami.Annotation>(`websites/${websiteId}/annotations/${annotationId}`);
  }

  updateWebsiteAnnotation(
    websiteId: string,
    annotationId: string,
    data: Umami.UpdateAnnotationData,
  ) {
    return this.post<Umami.Annotation>(`websites/${websiteId}/annotations/${annotationId}`, data);
  }

  deleteWebsiteAnnotation(websiteId: string, annotationId: string) {
    return this.del<Umami.Ok>(`websites/${websiteId}/annotations/${annotationId}`);
  }

  getWebsiteSegments(websiteId: string, params: Umami.WebsiteSegmentsParams) {
    return this.get<PageResult<Umami.Segment>>(`websites/${websiteId}/segments`, params);
  }

  createWebsiteSegment(websiteId: string, data: Umami.CreateSegmentData) {
    return this.post<Umami.Segment>(`websites/${websiteId}/segments`, data);
  }

  getWebsiteSegment(websiteId: string, segmentId: string) {
    return this.get<Umami.Segment>(`websites/${websiteId}/segments/${segmentId}`);
  }

  updateWebsiteSegment(websiteId: string, segmentId: string, data: Umami.UpdateSegmentData) {
    return this.post<Umami.Segment>(`websites/${websiteId}/segments/${segmentId}`, data);
  }

  deleteWebsiteSegment(websiteId: string, segmentId: string) {
    return this.del<Umami.Ok>(`websites/${websiteId}/segments/${segmentId}`);
  }

  // ---------------------------------------------------------------------------
  // Website analytics
  // ---------------------------------------------------------------------------

  getWebsiteStats(websiteId: string, params: Umami.WebsiteStatsParams) {
    return this.get<Umami.WebsiteStatsResult>(`websites/${websiteId}/stats`, params);
  }

  getWebsitePageviews(websiteId: string, params: Umami.WebsitePageviewsParams) {
    return this.get<Umami.WebsitePageviewsResult>(`websites/${websiteId}/pageviews`, params);
  }

  getWebsiteMetrics(websiteId: string, params: Umami.WebsiteMetricsParams) {
    return this.get<Umami.WebsiteMetricRow[]>(`websites/${websiteId}/metrics`, params);
  }

  getWebsiteExpandedMetrics(websiteId: string, params: Umami.WebsiteMetricsParams) {
    return this.get<Umami.ExpandedMetricRow[]>(`websites/${websiteId}/metrics/expanded`, params);
  }

  getWebsiteEvents(websiteId: string, params: Umami.WebsiteEventsParams) {
    return this.get<PageResult<Umami.WebsiteEventRow>>(`websites/${websiteId}/events`, params);
  }

  getWebsiteEventSeries(websiteId: string, params: Umami.WebsiteEventSeriesParams) {
    return this.get<Umami.SeriesPoint[]>(`websites/${websiteId}/events/series`, params);
  }

  getWebsiteEventStats(websiteId: string, params: Umami.WebsiteEventStatsParams) {
    return this.get<Umami.WebsiteEventStatsResult>(`websites/${websiteId}/events/stats`, params);
  }

  // Event data

  getEventData(websiteId: string, params: Umami.EventDataParams) {
    return this.get<PageResult<Umami.EventDataRow>>(`websites/${websiteId}/event-data`, params);
  }

  getEventDataById(websiteId: string, eventId: string) {
    return this.get<Umami.EventDataRecord[]>(`websites/${websiteId}/event-data/${eventId}`);
  }

  getEventDataEvents(websiteId: string, params: Umami.EventDataEventsParams) {
    return this.get<Umami.EventDataEvent[]>(`websites/${websiteId}/event-data/events`, params);
  }

  getEventDataFields(websiteId: string, params: Umami.EventDataFieldsParams) {
    return this.get<Umami.EventDataField[]>(`websites/${websiteId}/event-data/fields`, params);
  }

  getEventDataProperties(websiteId: string, params: Umami.EventDataPropertiesParams) {
    return this.get<Umami.EventDataPropertyRow[]>(
      `websites/${websiteId}/event-data/properties`,
      params,
    );
  }

  getEventDataStats(websiteId: string, params: Umami.EventDataStatsParams) {
    return this.get<Umami.EventDataStats>(`websites/${websiteId}/event-data/stats`, params);
  }

  getEventDataValues(websiteId: string, params: Umami.EventDataValuesParams) {
    return this.get<Umami.DataValue[]>(`websites/${websiteId}/event-data/values`, params);
  }

  // Event data pivot

  getEventDataPivot(websiteId: string, params: Umami.EventDataPivotParams) {
    return this.get<PageResult<Umami.EventDataPivotRow>>(
      `websites/${websiteId}/event-data-pivot`,
      params,
    );
  }

  getEventDataArraySeries(websiteId: string, params: Umami.EventDataSeriesParams) {
    return this.get<Umami.SeriesPoint[]>(
      `websites/${websiteId}/event-data-pivot/array-series`,
      params,
    );
  }

  getEventDataDateSeries(websiteId: string, params: Umami.EventDataDateSeriesParams) {
    return this.get<Umami.DateSeriesPoint[]>(
      `websites/${websiteId}/event-data-pivot/date-series`,
      params,
    );
  }

  getEventDataNumericSeries(websiteId: string, params: Umami.EventDataNumericSeriesParams) {
    return this.get<Umami.DateSeriesPoint[]>(
      `websites/${websiteId}/event-data-pivot/numeric-series`,
      params,
    );
  }

  getEventDataNumericStats(websiteId: string, params: Umami.EventDataNumericStatsParams) {
    return this.get<Umami.NumericStats>(
      `websites/${websiteId}/event-data-pivot/numeric-stats`,
      params,
    );
  }

  getEventDataPropertySeries(websiteId: string, params: Umami.EventDataSeriesParams) {
    return this.get<Umami.SeriesPoint[]>(
      `websites/${websiteId}/event-data-pivot/property-series`,
      params,
    );
  }

  // Session data

  getSessionDataPivot(websiteId: string, params: Umami.SessionDataPivotParams) {
    return this.get<PageResult<Umami.SessionDataPivotRow>>(
      `websites/${websiteId}/session-data-pivot`,
      params,
    );
  }

  getSessionDataArraySeries(websiteId: string, params: Umami.SessionDataSeriesParams) {
    return this.get<Umami.SeriesPoint[]>(`websites/${websiteId}/session-data/array-series`, params);
  }

  getSessionDataDateSeries(websiteId: string, params: Umami.SessionDataDateSeriesParams) {
    return this.get<Umami.DateSeriesPoint[]>(
      `websites/${websiteId}/session-data/date-series`,
      params,
    );
  }

  getSessionDataNumericSeries(websiteId: string, params: Umami.SessionDataNumericSeriesParams) {
    return this.get<Umami.DateSeriesPoint[]>(
      `websites/${websiteId}/session-data/numeric-series`,
      params,
    );
  }

  getSessionDataNumericStats(websiteId: string, params: Umami.SessionDataNumericStatsParams) {
    return this.get<Umami.NumericStats>(`websites/${websiteId}/session-data/numeric-stats`, params);
  }

  getSessionDataProperties(websiteId: string, params: Umami.SessionDataPropertiesParams) {
    return this.get<Umami.SessionDataPropertyRow[]>(
      `websites/${websiteId}/session-data/properties`,
      params,
    );
  }

  getSessionDataPropertySeries(websiteId: string, params: Umami.SessionDataSeriesParams) {
    return this.get<Umami.SeriesPoint[]>(
      `websites/${websiteId}/session-data/property-series`,
      params,
    );
  }

  getSessionDataStats(websiteId: string, params: Umami.SessionDataStatsParams) {
    return this.get<Umami.PropertyLeaderboardRow[]>(
      `websites/${websiteId}/session-data/stats`,
      params,
    );
  }

  getSessionDataValues(websiteId: string, params: Umami.SessionDataValuesParams) {
    return this.get<Umami.DataValue[]>(`websites/${websiteId}/session-data/values`, params);
  }

  // Sessions

  getWebsiteSessions(websiteId: string, params: Umami.WebsiteSessionsParams) {
    return this.get<PageResult<Umami.WebsiteSessionRow>>(`websites/${websiteId}/sessions`, params);
  }

  getWebsiteSessionStats(websiteId: string, params: Umami.WebsiteSessionStatsParams) {
    return this.get<Umami.WebsiteSessionStatsResult>(
      `websites/${websiteId}/sessions/stats`,
      params,
    );
  }

  getWebsiteSessionsWeekly(websiteId: string, params: Umami.WebsiteSessionsWeeklyParams) {
    return this.get<Umami.WeeklyTraffic>(`websites/${websiteId}/sessions/weekly`, params);
  }

  getWebsiteSession(websiteId: string, sessionId: string) {
    return this.get<Umami.WebsiteSessionDetail>(`websites/${websiteId}/sessions/${sessionId}`);
  }

  deleteWebsiteSession(websiteId: string, sessionId: string) {
    return this.del<Umami.Ok>(`websites/${websiteId}/sessions/${sessionId}`);
  }

  getWebsiteSessionActivity(
    websiteId: string,
    sessionId: string,
    params: Umami.SessionActivityParams,
  ) {
    return this.get<Umami.SessionActivityRow[]>(
      `websites/${websiteId}/sessions/${sessionId}/activity`,
      params,
    );
  }

  getWebsiteSessionProperties(websiteId: string, sessionId: string) {
    return this.get<Umami.SessionDataRow[]>(
      `websites/${websiteId}/sessions/${sessionId}/properties`,
    );
  }

  getWebsiteSessionReplays(
    websiteId: string,
    sessionId: string,
    params: Umami.SessionReplaysParams,
  ) {
    return this.get<PageResult<Umami.ReplayRow>>(
      `websites/${websiteId}/sessions/${sessionId}/replays`,
      params,
    );
  }

  // Replays

  getWebsiteReplays(websiteId: string, params: Umami.WebsiteReplaysParams) {
    return this.get<PageResult<Umami.ReplayRow>>(`websites/${websiteId}/replays`, params);
  }

  getWebsiteReplay(websiteId: string, replayId: string, params?: Umami.ReplayDetailParams) {
    return this.get<Umami.ReplayDetail>(`websites/${websiteId}/replays/${replayId}`, params);
  }

  getWebsiteSavedReplays(websiteId: string, params?: Umami.SavedReplaysParams) {
    return this.get<PageResult<Umami.SessionReplaySaved>>(
      `websites/${websiteId}/replays/saved`,
      params,
    );
  }

  getWebsiteReplaySaved(websiteId: string, replayId: string) {
    return this.get<Umami.ReplaySavedResult>(`websites/${websiteId}/replays/saved/${replayId}`);
  }

  saveWebsiteReplay(websiteId: string, replayId: string, data: Umami.SaveReplayData) {
    return this.post<Umami.Ok>(`websites/${websiteId}/replays/saved/${replayId}`, data);
  }

  // Revenue

  getWebsiteRevenueChart(websiteId: string, params: Umami.RevenueParams) {
    return this.get<Umami.RevenueChartResult>(`websites/${websiteId}/revenue/chart`, params);
  }

  getWebsiteRevenueMetrics(websiteId: string, params: Umami.RevenueMetricsParams) {
    return this.get<Umami.RevenueMetricRow[]>(`websites/${websiteId}/revenue/metrics`, params);
  }

  getWebsiteRevenueSessions(websiteId: string, params: Umami.RevenueSessionsParams) {
    return this.get<PageResult<Umami.WebsiteSessionRow>>(
      `websites/${websiteId}/revenue/sessions`,
      params,
    );
  }

  getWebsiteRevenueStats(websiteId: string, params: Umami.RevenueParams) {
    return this.get<Umami.RevenueStatsResult>(`websites/${websiteId}/revenue/stats`, params);
  }

  // Realtime

  getRealtime(websiteId: string, params?: Umami.RealtimeParams) {
    return this.get<Umami.RealtimeData>(`realtime/${websiteId}`, params);
  }

  // ---------------------------------------------------------------------------
  // Reports
  // ---------------------------------------------------------------------------

  getReports(params: Umami.ReportsParams) {
    return this.get<PageResult<Umami.Report>>('reports', params);
  }

  createReport(data: Umami.CreateReportData) {
    return this.post<Umami.Report>('reports', data);
  }

  getReport(reportId: string) {
    return this.get<Umami.Report>(`reports/${reportId}`);
  }

  updateReport(reportId: string, data: Umami.UpdateReportData) {
    return this.post<Umami.Report>(`reports/${reportId}`, data);
  }

  deleteReport(reportId: string) {
    return this.del<Umami.Ok>(`reports/${reportId}`);
  }

  /** Generic runner: `POST reports/{type}`. Prefer the typed `run*Report` methods. */
  runReport<T = any>(type: Umami.ReportType, params: Umami.AnyReportParams) {
    return this.post<T>(`reports/${type}`, params);
  }

  runAttributionReport(params: Umami.AttributionReportParams) {
    return this.post<Umami.AttributionResult>('reports/attribution', params);
  }

  runBreakdownReport(params: Umami.BreakdownReportParams) {
    return this.post<Umami.BreakdownResult>('reports/breakdown', params);
  }

  runFunnelReport(params: Umami.FunnelReportParams) {
    return this.post<Umami.FunnelResult>('reports/funnel', params);
  }

  runGoalReport(params: Umami.GoalReportParams) {
    return this.post<Umami.GoalResult>('reports/goal', params);
  }

  runHeatmapReport(params: Umami.HeatmapReportParams) {
    return this.post<Umami.HeatmapResult>('reports/heatmap', params);
  }

  runJourneyReport(params: Umami.JourneyReportParams) {
    return this.post<Umami.JourneyResult>('reports/journey', params);
  }

  runPerformanceReport(params: Umami.PerformanceReportParams) {
    return this.post<Umami.PerformanceResult>('reports/performance', params);
  }

  runRetentionReport(params: Umami.RetentionReportParams) {
    return this.post<Umami.RetentionResult>('reports/retention', params);
  }

  runRevenueReport(params: Umami.RevenueReportParams) {
    return this.post<Umami.RevenueReportResult>('reports/revenue', params);
  }

  runUtmReport(params: Umami.UtmReportParams) {
    return this.post<Umami.UtmResult>('reports/utm', params);
  }

  // ---------------------------------------------------------------------------
  // Boards
  // ---------------------------------------------------------------------------

  getBoards(params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Board>>('boards', params);
  }

  createBoard(data: Umami.CreateBoardData) {
    return this.post<Umami.Board>('boards', data);
  }

  getBoard(boardId: string) {
    return this.get<Umami.Board | null>(`boards/${boardId}`);
  }

  updateBoard(boardId: string, data: Umami.UpdateBoardData) {
    return this.post<Umami.Board>(`boards/${boardId}`, data);
  }

  cloneBoard(boardId: string, data: Umami.CloneBoardData = {}) {
    return this.post<Umami.Board>(`boards/${boardId}/clone`, data);
  }

  getBoardShares(boardId: string, params?: Umami.PagingParams) {
    return this.get<PageResult<Umami.Share>>(`boards/${boardId}/shares`, params);
  }

  createBoardShare(boardId: string, data: Umami.CreateEntityShareData) {
    return this.post<Umami.Share>(`boards/${boardId}/shares`, data);
  }

  getDashboard() {
    return this.get<Umami.Board | null>('dashboard');
  }

  updateDashboard(data: Umami.UpdateDashboardData) {
    return this.post<Umami.Board>('dashboard', data);
  }

  // ---------------------------------------------------------------------------
  // Links
  // ---------------------------------------------------------------------------

  getLinks(params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Link>>('links', params);
  }

  createLink(data: Umami.CreateLinkData) {
    return this.post<Umami.Link>('links', data);
  }

  getLinksCharts(params: Umami.ChartsParams) {
    return this.get<Umami.ChartsResult>('links/charts', params);
  }

  getLink(linkId: string) {
    return this.get<Umami.Link | null>(`links/${linkId}`);
  }

  updateLink(linkId: string, data: Umami.UpdateLinkData) {
    return this.post<Umami.Link>(`links/${linkId}`, data);
  }

  deleteLink(linkId: string) {
    return this.del<Umami.Ok>(`links/${linkId}`);
  }

  getLinkShares(linkId: string, params?: Umami.PagingParams) {
    return this.get<PageResult<Umami.Share>>(`links/${linkId}/shares`, params);
  }

  createLinkShare(linkId: string, data: Umami.CreateEntityShareData) {
    return this.post<Umami.Share>(`links/${linkId}/shares`, data);
  }

  // ---------------------------------------------------------------------------
  // Pixels
  // ---------------------------------------------------------------------------

  getPixels(params?: Umami.ListParams) {
    return this.get<PageResult<Umami.Pixel>>('pixels', params);
  }

  createPixel(data: Umami.CreatePixelData) {
    return this.post<Umami.Pixel>('pixels', data);
  }

  getPixelsCharts(params: Umami.ChartsParams) {
    return this.get<Umami.ChartsResult>('pixels/charts', params);
  }

  getPixel(pixelId: string) {
    return this.get<Umami.Pixel | null>(`pixels/${pixelId}`);
  }

  updatePixel(pixelId: string, data: Umami.UpdatePixelData) {
    return this.post<Umami.Pixel>(`pixels/${pixelId}`, data);
  }

  deletePixel(pixelId: string) {
    return this.del<Umami.Ok>(`pixels/${pixelId}`);
  }

  getPixelShares(pixelId: string, params?: Umami.PagingParams) {
    return this.get<PageResult<Umami.Share>>(`pixels/${pixelId}/shares`, params);
  }

  createPixelShare(pixelId: string, data: Umami.CreateEntityShareData) {
    return this.post<Umami.Share>(`pixels/${pixelId}/shares`, data);
  }

  // ---------------------------------------------------------------------------
  // Shares
  // ---------------------------------------------------------------------------

  createShare(data: Umami.CreateShareData) {
    return this.post<Umami.Share>('share', data);
  }

  /** Public: resolve a share slug to its entity and share token. */
  getShareBySlug(slug: string) {
    return this.get<Umami.SharePublicResult>(`share/${slug}`);
  }

  getShare(shareId: string) {
    return this.get<Umami.Share>(`share/id/${shareId}`);
  }

  updateShare(shareId: string, data: Umami.UpdateShareData) {
    return this.post<Umami.Share>(`share/id/${shareId}`, data);
  }

  deleteShare(shareId: string) {
    return this.del<Umami.Ok>(`share/id/${shareId}`);
  }

  // ---------------------------------------------------------------------------
  // Tracking / misc
  // ---------------------------------------------------------------------------

  send(data: Umami.SendData) {
    return this.post<Umami.SendResult>('send', data);
  }

  /** Send up to 500 events in one request. */
  batch(data: Umami.SendData[]) {
    return this.post<Umami.BatchResult>('batch', data);
  }

  record(data: Umami.RecordData, cacheToken: string) {
    return this.post<Umami.RecordResult>('record', data, { 'x-umami-cache': cacheToken });
  }

  getConfig() {
    return this.get<Umami.Config>('config');
  }

  heartbeat() {
    return this.get<Umami.HeartbeatResult>('heartbeat');
  }
}

export default UmamiApiClient;
