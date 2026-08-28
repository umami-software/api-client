import type {
  AssignableTeamRole,
  BoardType,
  CreateBoardType,
  MatchType,
  Operator,
  ReportType,
  SegmentType,
  ShareType,
  TeamRole,
  UserRole,
} from './common';

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  username: string;
  role: UserRole | string;
  logoUrl?: string | null;
  displayName?: string | null;
  twoFactorRequired?: boolean;
  createdAt: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  _count?: { websites: number };
}

export interface CreateUserData {
  id?: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  username?: string;
  password?: string;
  role?: UserRole;
}

// ---------------------------------------------------------------------------
// Websites
// ---------------------------------------------------------------------------

export interface ReplayConfig {
  replayEnabled?: boolean;
  heatmapEnabled?: boolean;
  sampleRate?: number;
  heatmapSampleRate?: number;
  maskLevel?: 'strict' | 'moderate';
  maxDuration?: number;
  blockSelector?: string;
}

export interface Website {
  id: string;
  name: string;
  domain: string | null;
  shareId?: string | null;
  resetAt: string | null;
  userId: string | null;
  teamId: string | null;
  createdBy: string | null;
  recorderEnabled?: boolean;
  replayConfig?: ReplayConfig | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  user?: { id: string; username: string };
  team?: Team;
}

export interface CreateWebsiteData {
  name: string;
  domain: string;
  shareId?: string | null;
  teamId?: string | null;
  id?: string | null;
}

export interface UpdateWebsiteData {
  name?: string;
  domain?: string;
  /** `null` removes all shares; a string creates a share with that slug. */
  shareId?: string | null;
  /** `null` resets recorder config to defaults. */
  replayConfig?: ReplayConfig | null;
}

export type TransferWebsiteData =
  | { userId: string; teamId?: never }
  | { teamId: string; userId?: never };

export interface RecorderConfig {
  enabled: boolean;
  replayEnabled?: boolean;
  heatmapEnabled?: boolean;
  sampleRate?: number;
  heatmapSampleRate?: number;
  maskLevel?: 'strict' | 'moderate';
  maxDuration?: number;
  blockSelector?: string;
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export interface Team {
  id: string;
  name: string;
  accessCode: string | null;
  logoUrl?: string | null;
  twoFactorRequired?: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  members?: TeamUser[];
  _count?: { websites: number; members: number };
}

export interface TeamUser {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole | string;
  createdAt: string | null;
  updatedAt: string | null;
  user?: { id: string; username: string };
}

export interface CreateTeamData {
  name: string;
  /** Only honoured when the caller is an admin. */
  ownerId?: string;
}

export interface UpdateTeamData {
  name?: string;
  accessCode?: string;
}

export interface JoinTeamData {
  accessCode: string;
}

export interface CreateTeamUserData {
  userId: string;
  role: AssignableTeamRole;
}

export interface UpdateTeamUserData {
  role: AssignableTeamRole;
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export interface Report {
  id: string;
  userId: string;
  websiteId: string;
  type: ReportType | string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateReportData {
  websiteId: string;
  type: ReportType;
  name: string;
  description?: string;
  parameters: Record<string, any>;
}

export type UpdateReportData = CreateReportData;

// ---------------------------------------------------------------------------
// Boards
// ---------------------------------------------------------------------------

export interface BoardComponentConfig {
  type: string;
  entityType?: 'website' | 'pixel' | 'link';
  entityId?: string;
  websiteId?: string;
  title?: string;
  description?: string;
  props?: Record<string, any>;
}

export interface BoardColumn {
  id: string;
  component?: BoardComponentConfig;
  size?: number;
}

export interface BoardRow {
  id: string;
  columns: BoardColumn[];
  size?: number;
}

export interface BoardParameters {
  websiteId?: string;
  pixelId?: string;
  linkId?: string;
  rows?: BoardRow[];
  [key: string]: any;
}

export interface Board {
  id: string;
  type: BoardType | string;
  name: string;
  description: string;
  parameters: BoardParameters;
  userId: string | null;
  teamId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateBoardData {
  type: CreateBoardType;
  name: string;
  description?: string;
  userId?: string | null;
  teamId?: string | null;
  parameters?: BoardParameters;
}

export interface UpdateBoardData {
  type?: BoardType | 'open';
  name?: string;
  description?: string;
  parameters?: BoardParameters;
}

export interface CloneBoardData {
  name?: string;
  description?: string;
  parameters?: BoardParameters;
}

export interface UpdateDashboardData {
  name?: string;
  description?: string;
  parameters?: BoardParameters;
}

// ---------------------------------------------------------------------------
// Links / Pixels
// ---------------------------------------------------------------------------

export interface Link {
  id: string;
  name: string;
  url: string;
  slug: string;
  userId: string | null;
  teamId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CreateLinkData {
  name: string;
  url: string;
  slug: string;
  teamId?: string | null;
  id?: string | null;
}

export interface UpdateLinkData {
  name?: string;
  url?: string;
  slug?: string;
}

export interface Pixel {
  id: string;
  name: string;
  slug: string;
  userId: string | null;
  teamId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CreatePixelData {
  name: string;
  slug: string;
  teamId?: string | null;
  id?: string | null;
}

export interface UpdatePixelData {
  name?: string;
  slug?: string;
}

// ---------------------------------------------------------------------------
// Shares
// ---------------------------------------------------------------------------

export type ShareTheme = 'light' | 'dark';

export interface ShareParameters {
  allowFilter?: boolean;
  theme?: ShareTheme;
  [key: string]: any;
}

export interface Share {
  id: string;
  entityId: string;
  name: string;
  shareType: ShareType | number;
  slug: string;
  parameters: ShareParameters;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateShareData {
  entityId: string;
  shareType: ShareType;
  name: string;
  slug?: string;
  parameters: ShareParameters;
}

/** Body for `POST {websites|boards|links|pixels}/{id}/shares`. */
export interface CreateEntityShareData {
  name: string;
  parameters?: ShareParameters;
}

export interface UpdateShareData {
  name: string;
  slug: string;
  parameters: ShareParameters;
}

export interface WhiteLabel {
  displayName: string;
  domainName: string;
  logoUrl: string;
}

/** Response of the public `GET share/{slug}`. */
export interface SharePublicResult {
  shareId: string;
  shareType: ShareType | number;
  parameters: ShareParameters;
  token: string;
  websiteId?: string;
  websiteIds?: string[];
  boardId?: string;
  pixelId?: string;
  pixelIds?: string[];
  linkId?: string;
  linkIds?: string[];
  whiteLabel?: WhiteLabel;
}

// ---------------------------------------------------------------------------
// Segments
// ---------------------------------------------------------------------------

export interface SegmentFilter {
  name: string;
  operator: Operator;
  value: string;
}

export interface SegmentParameters {
  filters?: SegmentFilter[];
  match?: MatchType;
  dateRange?: string;
  action?: { type: string; value: string };
  [key: string]: any;
}

export interface Segment {
  id: string;
  websiteId: string;
  type: SegmentType | string;
  name: string;
  parameters: SegmentParameters;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateSegmentData {
  type: SegmentType;
  name: string;
  parameters: SegmentParameters;
}

export type UpdateSegmentData = CreateSegmentData;

// ---------------------------------------------------------------------------
// Annotations
// ---------------------------------------------------------------------------

export interface Annotation {
  id: string;
  websiteId: string;
  userId: string | null;
  date: string;
  allDay: boolean;
  note: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AnnotationData {
  date: string | Date;
  allDay?: boolean;
  note: string;
}

export type CreateAnnotationData = AnnotationData;
export type UpdateAnnotationData = AnnotationData;

// ---------------------------------------------------------------------------
// Replays
// ---------------------------------------------------------------------------

export interface SessionReplaySaved {
  id: string;
  name: string;
  websiteId: string;
  visitId: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SaveReplayData {
  isSaved: boolean;
  name?: string;
}
