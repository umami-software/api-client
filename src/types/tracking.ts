export type SendType = 'event' | 'identify' | 'performance';

/**
 * Payload for `POST send`. Exactly one of `website`, `link`, or `pixel` must be set.
 */
export interface SendPayload {
  website?: string;
  link?: string;
  pixel?: string;
  data?: Record<string, any>;
  hostname?: string;
  language?: string;
  screen?: string;
  title?: string;
  referrer?: string;
  url?: string;
  /** Event name. Must not start with `=`, `+`, `-`, `@`, tab or CR. */
  name?: string;
  tag?: string;
  ip?: string;
  userAgent?: string;
  /** Unix timestamp in seconds. */
  timestamp?: number;
  /** Distinct id. */
  id?: string;
  browser?: string;
  os?: string;
  device?: string;
  lcp?: number;
  inp?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  [key: string]: any;
}

export interface SendData {
  type: SendType;
  payload: SendPayload;
}

export interface SendResult {
  cache: string;
  sessionId: string;
  visitId: string;
}

export interface BatchResult {
  size: number;
  processed: number;
  errors: number;
  details: Array<{ index: number; response: any }>;
  cache: string | null;
}

export interface HeatmapClickEvent {
  type: 'click';
  url: string;
  x?: number;
  y?: number;
  pageX?: number;
  pageY?: number;
  pageW?: number;
  pageH?: number;
  viewportW?: number;
  viewportH?: number;
  timestamp?: number;
}

export interface HeatmapScrollEvent {
  type: 'scroll';
  url: string;
  scrollPct?: number;
  pageW?: number;
  pageH?: number;
  viewportW?: number;
  viewportH?: number;
  timestamp?: number;
}

export type RecordData =
  | {
      type: 'record';
      payload: { website: string; events: any[]; timestamp?: number };
    }
  | {
      type: 'heatmap';
      payload: {
        website: string;
        events: Array<HeatmapClickEvent | HeatmapScrollEvent>;
        timestamp?: number;
      };
    };

export interface RecordResult {
  ok: boolean;
  reason?: 'recorder_disabled' | 'replay_disabled' | 'heatmap_disabled';
}

export interface HeartbeatResult {
  ok: true;
}
