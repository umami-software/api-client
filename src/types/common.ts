/**
 * Shared enums and parameter types mirroring umami `src/lib/schema.ts` and `src/lib/constants.ts`.
 */

export type Ok = { ok: true };

export interface Empty {}

export interface PageResult<T> {
  data: T;
  count: number;
  page: number;
  pageSize: number;
  orderBy?: string;
  sortDescending?: boolean;
  search?: string;
  isCapped?: boolean;
}

export type UserRole = 'admin' | 'user' | 'view-only';

export type TeamRole = 'team-owner' | 'team-manager' | 'team-member' | 'team-view-only';

/** Roles that can be assigned to a team member via the API. */
export type AssignableTeamRole = 'team-manager' | 'team-member' | 'team-view-only';

export type TimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute';

export type CompareMode = 'prev' | 'yoy';

export type MatchType = 'all' | 'any';

export type SegmentType = 'segment' | 'cohort';

export type BoardType = 'dashboard' | 'mixed' | 'website' | 'pixel' | 'link';

export type CreateBoardType = 'mixed' | 'website' | 'pixel' | 'link' | 'open';

export const SHARE_TYPE = {
  website: 1,
  link: 2,
  pixel: 3,
  board: 4,
} as const;

export type ShareType = (typeof SHARE_TYPE)[keyof typeof SHARE_TYPE];

export const EVENT_TYPE = {
  pageView: 1,
  customEvent: 2,
  linkEvent: 3,
  pixelEvent: 4,
  performance: 5,
} as const;

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

export const DATA_TYPE = {
  string: 1,
  number: 2,
  boolean: 3,
  date: 4,
  array: 5,
} as const;

export type DataType = (typeof DATA_TYPE)[keyof typeof DATA_TYPE];

export type ReportType =
  | 'attribution'
  | 'breakdown'
  | 'funnel'
  | 'goal'
  | 'heatmap'
  | 'journey'
  | 'performance'
  | 'retention'
  | 'revenue'
  | 'utm';

export type Operator =
  | 'eq'
  | 'neq'
  | 's'
  | 'ns'
  | 'c'
  | 'dnc'
  | 're'
  | 'nre'
  | 't'
  | 'f'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'bf'
  | 'af';

/** Field names accepted by `websites/{id}/values` and breakdown reports (`fieldsParam`). */
export type FieldName =
  | 'path'
  | 'referrer'
  | 'title'
  | 'query'
  | 'os'
  | 'browser'
  | 'device'
  | 'country'
  | 'region'
  | 'city'
  | 'tag'
  | 'hostname'
  | 'distinctId'
  | 'language'
  | 'event'
  | 'utmSource'
  | 'utmMedium'
  | 'utmCampaign'
  | 'utmContent'
  | 'utmTerm';

export type EventColumn =
  | 'path'
  | 'fullPath'
  | 'entry'
  | 'exit'
  | 'referrer'
  | 'domain'
  | 'title'
  | 'query'
  | 'event'
  | 'tag'
  | 'hostname'
  | 'utmSource'
  | 'utmMedium'
  | 'utmCampaign'
  | 'utmContent'
  | 'utmTerm';

export type SessionColumn =
  | 'browser'
  | 'os'
  | 'device'
  | 'screen'
  | 'language'
  | 'country'
  | 'city'
  | 'region'
  | 'distinctId';

/** Valid `type` values for `websites/{id}/metrics` and `metrics/expanded`. */
export type MetricType = EventColumn | SessionColumn | 'channel';

export type SortDescending = boolean | 'true' | 'false';

export interface PagingParams {
  page?: number;
  pageSize?: number;
  maxResults?: number;
}

export interface SearchParams {
  search?: string;
}

export interface SortingParams {
  orderBy?: string;
  sortDescending?: SortDescending;
}

export type ListParams = PagingParams & SearchParams & SortingParams;

/**
 * Routes using `withDateRange` accept either `startAt` + `endAt` (epoch ms)
 * or `startDate` + `endDate` (ISO string / Date).
 */
export interface DateRangeParams {
  startAt?: number;
  endAt?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  timezone?: string;
  unit?: TimeUnit;
  compare?: CompareMode;
}

/** Routes with inline schemas require epoch-millisecond `startAt` and `endAt`. */
export interface TimestampRangeParams {
  startAt: number;
  endAt: number;
}

/**
 * Filter params (`filterParams` in umami). Additional dynamic keys are passed through untouched:
 * suffixed filters (`browser1`, `os2`), property filters (`pf_<name>`), and universal
 * event/session property filters (`epf0`, `spf0`).
 */
export interface FilterParams {
  path?: string;
  referrer?: string;
  title?: string;
  query?: string;
  os?: string;
  browser?: string;
  device?: string;
  country?: string;
  region?: string;
  city?: string;
  tag?: string;
  hostname?: string;
  distinctId?: string;
  language?: string;
  event?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  segment?: string;
  cohort?: string;
  eventType?: number;
  excludeBounce?: boolean | string;
  match?: MatchType;
  [key: string]: string | number | boolean | Date | null | undefined | Array<string | number>;
}

export interface ReplayParams {
  /** Minimum replay duration in seconds. */
  minDuration?: number;
}

export interface DateRangeResult {
  startDate: string;
  endDate: string;
}
