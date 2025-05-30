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
  }[];
  sessions: {
    t: string;
    y: number;
  }[];
}

export interface WebsiteStats {
  pageviews: { value: number; prev: number };
  visitors: { value: number; prev: number };
  visits: { value: number; prev: number };
  bounces: { value: number; prev: number };
  totaltime: { value: number; prev: number };
}

export type WebsiteSessionWeekly = number[][];

export interface WebsiteSessionStats {
  countries: { value: number };
  events: { value: number };
  pageviews: { value: number };
  visitors: { value: number };
  visits: { value: number };
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

export interface SessionActivity {
  createdAt: Date;
  urlPath: string;
  urlQuery: string;
  referrerDomain: string;
  eventId: string;
  eventType: number;
  eventName: string;
  visitId: string;
}

export interface SessionData {
  websiteId: string;
  sessionId: string;
  dataKey: string;
  dataType: string;
  stringValue: string;
  numberValue: number;
  dateValue: Date;
  createdAt: Date;
}

export interface WebsiteEvent {
  id: string;
  websiteId: string;
  sessionId: string;
  createdAt: Date;
  urlPath: string;
  urlQuery: string;
  referrerPath: string;
  referrerQuery: string;
  referrerDomain: string;
  pageTitle: string;
  eventType: number;
  eventName: string;
}

export interface WebsiteSession {
  id: string;
  websiteId: string;
  hostname: string;
  browser: string;
  os: string;
  device: string;
  screen: string;
  language: string;
  country: string;
  subdivision1: string;
  city: string;
  firstAt: Date;
  lastAt: Date;
  visits: number;
  views: number;
  events?: number;
  toataltime?: number;
  createdAt: Date;
}

export interface WebsiteEventData {
  eventName: string;
  propertyName: string;
  dataType: number;
  propertyValue?: string;
  total: number;
}

export interface WebsiteEventDataStats {
  events: number;
  properties: number;
  records: number;
}

export interface WebsiteSessionData {
  propertyName: string;
  total: number;
}

export interface WebsiteDataField {
  propertyName: string;
  dataType: number;
  value: string;
  total: number;
}

export interface WebsiteDataValue {
  value: string;
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
  search?: string;
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
