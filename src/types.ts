import {
  REPORT_FILTER_TYPES,
  TEAM_FILTER_TYPES,
  USER_FILTER_TYPES,
  WEBSITE_FILTER_TYPES,
} from './constants';

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Website {
  id: string;
  userId: string;
  revId: number;
  name: string;
  domain: string;
  shareId: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  createdAt: string;
}

export interface TeamUser {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  createdAt: Date;
}

export interface Share {
  id: string;
  token: string;
}

export interface WebsiteActive {
  x: number;
}

export interface WebsiteMetric {
  x: string;
  y: number;
}

export interface WebsiteEventMetric {
  x: string;
  t: string;
  y: number;
}

export interface WebsitePageviews {
  pageviews: {
    t: string;
    y: number;
  };
  sessions: {
    t: string;
    y: number;
  };
}

export interface WebsiteStats {
  pageviews: { value: number; change: number };
  uniques: { value: number; change: number };
  bounces: { value: number; change: number };
  totalTime: { value: number; change: number };
}

export interface RealtimeInit {
  websites: Website[];
  token: string;
  data: RealtimeUpdate;
}

export interface RealtimeUpdate {
  pageviews: any[];
  sessions: any[];
  events: any[];
  timestamp: number;
}

export interface WebsiteEventData {
  eventName?: string;
  fieldName: string;
  dataType: number;
  fieldValue?: string;
  total: number;
}

export interface Empty {}

type ObjectValues<T> = T[keyof T];

export type ReportSearchFilterType = ObjectValues<typeof REPORT_FILTER_TYPES>;
export type UserSearchFilterType = ObjectValues<typeof USER_FILTER_TYPES>;
export type WebsiteSearchFilterType = ObjectValues<typeof WEBSITE_FILTER_TYPES>;
export type TeamSearchFilterType = ObjectValues<typeof TEAM_FILTER_TYPES>;

export interface WebsiteSearchFilter extends SearchFilter<WebsiteSearchFilterType> {
  userId?: string;
  teamId?: string;
  includeTeams?: boolean;
}

export interface UserSearchFilter extends SearchFilter<UserSearchFilterType> {
  teamId?: string;
}

export interface TeamSearchFilter extends SearchFilter<TeamSearchFilterType> {
  userId?: string;
}

export interface ReportSearchFilter extends SearchFilter<ReportSearchFilterType> {
  userId?: string;
  websiteId?: string;
}

export interface SearchFilter<T> {
  filter?: string;
  filterType?: T;
  pageSize?: number;
  page?: number;
  orderBy?: string;
}

export interface FilterResult<T> {
  data: T;
  count: number;
  pageSize: number;
  page: number;
  orderBy?: string;
}
