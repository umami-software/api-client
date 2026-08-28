import type {
  CompareMode,
  FieldName,
  FilterParams,
  PagingParams,
  ReportType,
  TimeUnit,
} from './common';

/**
 * Filters for report runners. Umami reads `startAt`/`endAt` (epoch ms) plus any
 * `filterParams` from here. Extra keys (`timezone`, `unit`, suffixed filters, `epf0`…) pass through.
 */
export type ReportFilters = FilterParams & {
  startAt: number;
  endAt: number;
  timezone?: string;
  unit?: TimeUnit;
  compare?: CompareMode;
};

export interface ReportDateRange {
  startDate: string | Date;
  endDate: string | Date;
}

export interface RunReportParams<TType extends ReportType, TParameters> {
  websiteId: string;
  type: TType;
  filters: ReportFilters;
  parameters: TParameters;
}

export type ReportsParams = PagingParams & { websiteId: string; type?: ReportType };

// ---------------------------------------------------------------------------
// Goal
// ---------------------------------------------------------------------------

export interface GoalReportParameters extends ReportDateRange {
  type: string;
  value: string;
}

export type GoalReportParams = RunReportParams<'goal', GoalReportParameters>;

export interface GoalResult {
  num: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

export interface FunnelStepFilter {
  property: string;
  operator: 'eq' | 'neq' | 'c' | 'dnc';
  value: string;
}

export interface FunnelStep {
  type: 'path' | 'event';
  value: string;
  filters?: FunnelStepFilter[];
}

export interface FunnelReportParameters extends ReportDateRange {
  window: number;
  /** 2 to 8 steps. */
  steps: FunnelStep[];
}

export type FunnelReportParams = RunReportParams<'funnel', FunnelReportParameters>;

export interface FunnelResultRow {
  type: string;
  value: string;
  filters?: FunnelStepFilter[];
  visitors: number;
  previous: number;
  dropped: number;
  dropoff: number;
  remaining: number;
}

export type FunnelResult = FunnelResultRow[];

// ---------------------------------------------------------------------------
// Journey
// ---------------------------------------------------------------------------

export interface JourneyReportParameters extends ReportDateRange {
  /** 2 to 7. */
  steps: number;
  startStep?: string;
  endStep?: string;
  eventType?: number;
}

export type JourneyReportParams = RunReportParams<'journey', JourneyReportParameters>;

export interface JourneyResultRow {
  e1?: string;
  e2?: string;
  e3?: string;
  e4?: string;
  e5?: string;
  e6?: string;
  e7?: string;
  count: number;
}

export type JourneyResult = JourneyResultRow[];

// ---------------------------------------------------------------------------
// Retention
// ---------------------------------------------------------------------------

export interface RetentionReportParameters extends ReportDateRange {
  timezone?: string;
}

export type RetentionReportParams = RunReportParams<'retention', RetentionReportParameters>;

export interface RetentionResultRow {
  date: string;
  day: number;
  visitors: number;
  returnVisitors: number;
  percentage: number;
}

export type RetentionResult = RetentionResultRow[];

// ---------------------------------------------------------------------------
// UTM
// ---------------------------------------------------------------------------

export type UtmReportParameters = ReportDateRange;

export type UtmReportParams = RunReportParams<'utm', UtmReportParameters>;

export interface UtmResultRow {
  utm: string;
  views: number;
}

export interface UtmResult {
  utm_source: UtmResultRow[];
  utm_medium: UtmResultRow[];
  utm_campaign: UtmResultRow[];
  utm_term: UtmResultRow[];
  utm_content: UtmResultRow[];
}

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

export type WebVital = 'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb';

export interface PerformanceReportParameters extends ReportDateRange {
  unit?: TimeUnit;
  timezone?: string;
  metric?: WebVital;
}

export type PerformanceReportParams = RunReportParams<'performance', PerformanceReportParameters>;

export interface Percentiles {
  p50: number;
  p75: number;
  p95: number;
}

export interface PerformanceMetricsRow extends Percentiles {
  name: string;
  count: number;
}

export interface PerformanceResult {
  chart: Array<Percentiles & { t: string }>;
  summary: Record<WebVital, Percentiles> & { count: number };
  pages: PerformanceMetricsRow[];
  pageTitles: PerformanceMetricsRow[];
  devices: PerformanceMetricsRow[];
  browsers: PerformanceMetricsRow[];
}

// ---------------------------------------------------------------------------
// Revenue
// ---------------------------------------------------------------------------

export interface RevenueReportParameters extends ReportDateRange {
  currency: string;
  unit?: TimeUnit;
  timezone?: string;
  compare?: CompareMode;
}

export type RevenueReportParams = RunReportParams<'revenue', RevenueReportParameters>;

export interface RevenueReportTotal {
  sum: number;
  count: number;
  average: number;
  unique_count: number;
  arpu: number;
}

export interface RevenueReportResult {
  chart: Array<{ x: string; t: string; y: number; count: number }>;
  total: RevenueReportTotal & { comparison: RevenueReportTotal };
  country: Array<{ name: string; value: number }>;
  region: Array<{ name: string; value: number; country: string }>;
  referrer: Array<{ name: string; value: number }>;
  channel: Array<{ name: string; value: number }>;
}

// ---------------------------------------------------------------------------
// Attribution
// ---------------------------------------------------------------------------

export interface AttributionReportParameters extends ReportDateRange {
  model: 'first-click' | 'last-click';
  type: 'path' | 'event';
  step: string;
  currency?: string;
}

export type AttributionReportParams = RunReportParams<'attribution', AttributionReportParameters>;

export interface NameValue {
  name: string;
  value: number;
}

export interface AttributionResult {
  referrer: NameValue[];
  paidAds: NameValue[];
  utm_source: NameValue[];
  utm_medium: NameValue[];
  utm_campaign: NameValue[];
  utm_content: NameValue[];
  utm_term: NameValue[];
  total: { pageviews: number; visitors: number; visits: number };
}

// ---------------------------------------------------------------------------
// Breakdown
// ---------------------------------------------------------------------------

export interface BreakdownReportParameters extends ReportDateRange {
  fields: FieldName[];
}

export type BreakdownReportParams = RunReportParams<'breakdown', BreakdownReportParameters>;

export interface BreakdownResultRow {
  views: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  /** One column per requested field. */
  [field: string]: string | number;
}

export type BreakdownResult = BreakdownResultRow[];

// ---------------------------------------------------------------------------
// Heatmap
// ---------------------------------------------------------------------------

export type HeatmapMode = 'click' | 'scroll';

export interface HeatmapReportParameters extends ReportDateRange {
  urlPath?: string;
  mode?: HeatmapMode;
}

export type HeatmapReportParams = RunReportParams<'heatmap', HeatmapReportParameters>;

export interface HeatmapPoint {
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  pageW: number;
  pageH: number;
  viewportW: number;
  viewportH: number;
  count: number;
}

export interface HeatmapResult {
  mode: HeatmapMode;
  pages: Array<{ urlPath: string; count: number; sessions: number }>;
  points: HeatmapPoint[];
  snapshot: {
    kind: 'iframe';
    id: string;
    url: string;
    pageW: number;
    pageH: number;
    viewportW: number;
    viewportH: number;
  } | null;
  scroll: {
    buckets: Array<{
      depth: number;
      sessions: number;
      pageW: number;
      pageH: number;
      viewportW: number;
      viewportH: number;
    }>;
    totalSessions: number;
    pageW: number | null;
    pageH: number | null;
    viewportW: number | null;
    viewportH: number | null;
  };
}

// ---------------------------------------------------------------------------
// Union helpers
// ---------------------------------------------------------------------------

export type AnyReportParams =
  | AttributionReportParams
  | BreakdownReportParams
  | FunnelReportParams
  | GoalReportParams
  | HeatmapReportParams
  | JourneyReportParams
  | PerformanceReportParams
  | RetentionReportParams
  | RevenueReportParams
  | UtmReportParams;
