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

export interface Report {
  id: string;
  userId: string;
  websiteId: string;
  type: string;
  name: string;
  description: string;
  parameters: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface WebsiteSearchParams extends SearchParams {
  userId?: string;
  teamId?: string;
  includeTeams?: boolean;
}

export interface UserSearchParams extends SearchParams {
  teamId?: string;
}

export interface TeamSearchParams extends SearchParams {
  userId?: string;
}

export interface ReportSearchParams extends SearchParams {
  userId?: string;
  websiteId?: string;
}

export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  sortDescending?: boolean;
}

export interface SearchResult<T> {
  data: T;
  count: number;
  pageSize: number;
  page: number;
  orderBy?: string;
}
