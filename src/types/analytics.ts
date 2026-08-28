import type {
  DateRangeParams,
  FieldName,
  FilterParams,
  MetricType,
  PagingParams,
  ReplayParams,
  SearchParams,
  TimestampRangeParams,
  TimeUnit,
} from './common';

// ---------------------------------------------------------------------------
// Generic series shapes
// ---------------------------------------------------------------------------

export interface MetricRow {
  x: string;
  y: number;
}

export interface SeriesPoint {
  x: string;
  t: string;
  y: number;
}

export interface DateSeriesPoint {
  t: string;
  y: number;
}

export interface NumericStats {
  total: number;
  average: number;
  median: number;
  max: number;
  min: number;
}

export interface DataValue {
  value: string;
  total: number;
}

// ---------------------------------------------------------------------------
// Website overview
// ---------------------------------------------------------------------------

export type WebsiteStatsParams = DateRangeParams & FilterParams;

export interface WebsiteStatsData {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

export interface WebsiteStatsResult extends WebsiteStatsData {
  comparison: WebsiteStatsData;
  [key: string]: any;
}

export interface ActiveVisitorsResult {
  visitors: number;
}

export type WebsitePageviewsParams = DateRangeParams & FilterParams;

export interface WebsitePageviewsResult {
  pageviews: MetricRow[];
  sessions: MetricRow[];
  startDate?: string;
  endDate?: string;
  compare?: {
    pageviews: MetricRow[];
    sessions: MetricRow[];
    startDate: string;
    endDate: string;
  };
}

export type WebsiteMetricsParams = DateRangeParams &
  FilterParams & {
    type: MetricType;
    limit?: number;
    offset?: number;
    search?: string;
  };

export interface WebsiteMetricRow extends MetricRow {
  /** Present when `type` is `city` or `region`. */
  country?: string;
  /** Present when `type` is `event` (time bucket). */
  t?: string;
}

export interface ExpandedMetricRow {
  name: string;
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

export type WebsiteValuesParams = DateRangeParams &
  FilterParams & {
    type: FieldName | 'segment' | 'cohort';
    search?: string;
  };

export interface WebsiteValueRow {
  value: string;
}

export type WebsiteExportParams = DateRangeParams & PagingParams & FilterParams;

export interface WebsiteExportResult {
  /** Base64 encoded zip archive of CSV files. */
  zip: string;
}

export interface ChartsParams {
  ids: string[];
  startAt?: number;
  endAt?: number;
  timezone?: string;
}

export interface ChartData {
  values: number[];
  total: number;
}

export interface ChartsResult {
  data: Record<string, ChartData>;
}

export type WeeklyTraffic = number[][];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type WebsiteEventsParams = DateRangeParams & FilterParams & PagingParams & SearchParams;

export interface WebsiteEventRow {
  id: string;
  websiteId: string;
  sessionId: string;
  createdAt: string;
  hostname: string | null;
  urlPath: string;
  urlQuery: string | null;
  referrerPath: string | null;
  referrerQuery: string | null;
  referrerDomain: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  os: string | null;
  browser: string | null;
  pageTitle: string | null;
  eventType: number;
  eventName: string | null;
  hasData: boolean;
}

export type WebsiteEventSeriesParams = TimestampRangeParams &
  FilterParams & {
    timezone: string;
    unit?: TimeUnit;
    limit?: number;
  };

export type WebsiteEventStatsParams = DateRangeParams & FilterParams;

export interface WebsiteEventStatsData {
  events: number;
  visitors: number;
  visits: number;
  uniqueEvents: number;
}

export interface WebsiteEventStatsResult {
  data: WebsiteEventStatsData & { comparison: WebsiteEventStatsData; [key: string]: any };
}

// ---------------------------------------------------------------------------
// Event data
// ---------------------------------------------------------------------------

export type EventDataParams = TimestampRangeParams & FilterParams & PagingParams;

export interface EventDataProperty {
  dataKey: string;
  stringValue: string | null;
  numberValue: number | null;
  dateValue: string | null;
  dataType: number;
  createdAt: string;
}

export interface EventDataRow {
  websiteId: string;
  eventId: string;
  eventName: string;
  eventProperties: EventDataProperty[];
}

export interface EventDataRecord extends EventDataProperty {
  websiteId: string;
  eventId: string;
  eventName: string;
}

export type EventDataEventsParams = TimestampRangeParams & FilterParams & { event?: string };

export interface EventDataEvent {
  eventName: string;
  propertyName: string;
  dataType: number;
  propertyValue?: string;
  total: number;
}

export type EventDataFieldsParams = TimestampRangeParams & FilterParams & { eventName?: string };

export interface EventDataField {
  propertyName: string;
  dataType: number;
  total: number;
}

export type EventDataPropertiesParams = TimestampRangeParams & FilterParams;

export interface EventDataPropertyRow {
  eventName: string;
  propertyName: string;
  dataType: number;
  total: number;
}

export type EventDataStatsParams = TimestampRangeParams & FilterParams;

export interface EventDataStats {
  events: number;
  properties: number;
  records: number;
}

export type EventDataValuesParams = TimestampRangeParams &
  FilterParams & {
    propertyName: string;
    eventName?: string;
    dataType?: number;
  };

// ---------------------------------------------------------------------------
// Event data pivot
// ---------------------------------------------------------------------------

export type EventDataPivotParams = TimestampRangeParams &
  FilterParams &
  PagingParams & {
    eventName: string;
    timezone?: string;
    unit?: TimeUnit;
  };

export interface EventDataPivotRow {
  eventId: string;
  sessionId: string;
  eventName: string;
  urlPath: string;
  createdAt: string;
  propertyKeys: string[];
  propertyValues: string[];
}

export type EventDataSeriesParams = TimestampRangeParams &
  FilterParams & {
    eventName: string;
    propertyName: string;
    timezone?: string;
    unit?: TimeUnit;
  };

export type EventDataDateSeriesParams = TimestampRangeParams &
  FilterParams & {
    eventName: string;
    propertyName: string;
    timezone?: string;
  };

export type NumericMetric = 'sum' | 'avg' | 'count';

export type EventDataNumericSeriesParams = EventDataSeriesParams & { metric?: NumericMetric };

export type EventDataNumericStatsParams = TimestampRangeParams &
  FilterParams & {
    eventName: string;
    propertyName: string;
  };

// ---------------------------------------------------------------------------
// Session data
// ---------------------------------------------------------------------------

export type SessionDataPivotParams = TimestampRangeParams &
  FilterParams &
  PagingParams & {
    propertyName: string;
    timezone?: string;
    unit?: TimeUnit;
  };

export interface SessionDataPivotRow {
  sessionId: string;
  distinctId: string;
  createdAt: string;
  propertyKeys: string[];
  propertyValues: string[];
}

export type SessionDataSeriesParams = TimestampRangeParams &
  FilterParams & {
    propertyName: string;
    timezone?: string;
    unit?: TimeUnit;
  };

export type SessionDataDateSeriesParams = TimestampRangeParams &
  FilterParams & {
    propertyName: string;
    timezone?: string;
  };

export type SessionDataNumericSeriesParams = SessionDataSeriesParams & { metric?: NumericMetric };

export type SessionDataNumericStatsParams = SessionDataDateSeriesParams;

export type SessionDataPropertiesParams = TimestampRangeParams &
  FilterParams & { propertyName?: string };

export interface SessionDataPropertyRow {
  propertyName: string;
  dataType: number;
  total: number;
}

export type SessionDataStatsParams = SessionDataSeriesParams;

export interface PropertyLeaderboardRow {
  label: string;
  activity: number;
  sessions: number;
  visits: number;
  views: number;
  events: number;
}

export type SessionDataValuesParams = TimestampRangeParams &
  FilterParams & {
    propertyName?: string;
    dataType?: number;
  };

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export type WebsiteSessionsParams = DateRangeParams & FilterParams & PagingParams & SearchParams;

export interface WebsiteSessionRow {
  id: string;
  websiteId: string;
  hostname: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  screen: string | null;
  language: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  firstAt: string;
  lastAt: string;
  visits: number;
  views: number;
  events: number;
  createdAt: string;
}

export interface WebsiteSessionDetail {
  id: string;
  distinctId: string | null;
  websiteId: string;
  browser: string | null;
  os: string | null;
  device: string | null;
  screen: string | null;
  language: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  firstAt: string;
  lastAt: string;
  visits: number;
  views: number;
  events: number;
  totaltime: number;
  canDelete: boolean;
  stitchedSessionCount: number;
}

export type WebsiteSessionStatsParams = TimestampRangeParams & FilterParams;

export interface WebsiteSessionStatsResult {
  pageviews: { value: number };
  visitors: { value: number };
  visits: { value: number };
  countries: { value: number };
  events: { value: number };
}

export type WebsiteSessionsWeeklyParams = TimestampRangeParams &
  FilterParams & { timezone: string };

export type SessionActivityParams = TimestampRangeParams & { distinctId?: string };

export interface SessionActivityRow {
  createdAt: string;
  urlPath: string;
  urlQuery: string | null;
  referrerDomain: string | null;
  eventId: string;
  eventType: number;
  eventName: string | null;
  visitId: string;
  hostname: string | null;
  hasData: boolean;
}

export interface SessionDataRow {
  websiteId: string;
  sessionId: string;
  dataKey: string;
  dataType: number;
  stringValue: string | null;
  numberValue: number | null;
  dateValue: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Replays
// ---------------------------------------------------------------------------

export type WebsiteReplaysParams = DateRangeParams &
  FilterParams &
  ReplayParams &
  PagingParams &
  SearchParams;

export type SessionReplaysParams = DateRangeParams & PagingParams & SearchParams;

export interface ReplayRow {
  id: string;
  sessionId: string;
  websiteId: string;
  browser: string | null;
  os: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  eventCount: number;
  chunkCount: number;
  startedAt: string;
  endedAt: string;
  /** Duration in milliseconds. */
  duration: number;
  createdAt: string;
}

export interface ReplayDetailParams {
  /** Epoch ms upper bound for events. */
  until?: number;
  chunkIndex?: number;
  eventIndex?: number;
}

export interface ReplayDetail {
  sessionId: string | null;
  events: any[];
  startedAt: string | null;
  endedAt: string | null;
  eventCount: number;
  chunkCount: number;
}

export type SavedReplaysParams = PagingParams & SearchParams;

export interface ReplaySavedResult {
  isSaved: boolean;
}

// ---------------------------------------------------------------------------
// Revenue
// ---------------------------------------------------------------------------

export type RevenueParams = DateRangeParams & FilterParams & { currency: string };

export interface RevenueChartRow {
  x: string;
  t: string;
  y: number;
  count: number;
}

export interface RevenueChartResult {
  chart: RevenueChartRow[];
}

export type RevenueMetricType = 'country' | 'region' | 'referrer' | 'channel';

export type RevenueMetricsParams = RevenueParams & { type: RevenueMetricType };

export interface RevenueMetricRow {
  name: string;
  value: number;
  /** Present when `type` is `region`. */
  country?: string;
}

export type RevenueSessionsParams = RevenueParams & PagingParams & SearchParams;

export interface RevenueStatsData {
  sum: number;
  count: number;
  unique_count: number;
  total_sessions?: number;
  average: number;
  arpu: number;
}

export interface RevenueStatsResult extends RevenueStatsData {
  comparison: RevenueStatsData;
}

// ---------------------------------------------------------------------------
// Realtime
// ---------------------------------------------------------------------------

export type RealtimeParams = FilterParams & {
  timezone?: string;
  unit?: TimeUnit;
};

export interface RealtimeEvent {
  __type: 'session' | 'event' | 'pageview';
  sessionId: string;
  eventName: string | null;
  createdAt: string;
  browser: string | null;
  os: string | null;
  device: string | null;
  country: string | null;
  urlPath: string | null;
  referrerDomain: string | null;
  hostname: string | null;
  [key: string]: any;
}

export interface RealtimeData {
  countries: Record<string, number>;
  urls: Record<string, number>;
  referrers: Record<string, number>;
  events: RealtimeEvent[];
  series: { views: MetricRow[]; visitors: MetricRow[] };
  totals: { views: number; visitors: number; events: number; countries: number };
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Website sub-resources
// ---------------------------------------------------------------------------

export type WebsiteReportsParams = PagingParams & { type?: string };

export type WebsiteSharesParams = PagingParams;

export type WebsiteAnnotationsParams = PagingParams &
  SearchParams & {
    startAt?: number;
    endAt?: number;
  };

export type WebsiteSegmentsParams = SearchParams & { type: 'segment' | 'cohort' };
