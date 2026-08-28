import type { UserRole } from './common';

export interface AuthTeam {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole | string;
  isAdmin: boolean;
  createdAt?: string | null;
  logoUrl?: string | null;
  displayName?: string | null;
  twoFactorRequired?: boolean;
  [key: string]: any;
}

export interface ShareToken {
  shareType?: number;
  websiteId?: string;
  websiteIds?: string[];
  boardId?: string;
  pixelId?: string;
  pixelIds?: string[];
  linkId?: string;
  linkIds?: string[];
  parameters?: Record<string, any>;
  [key: string]: any;
}

/** Response of `GET me`. */
export interface Auth {
  token?: string;
  authKey?: string;
  shareToken?: ShareToken | null;
  user?: AuthUser | null;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginSuccessResult {
  token: string;
  user: AuthUser & { teams: AuthTeam[] };
  requiresTwoFactor?: undefined;
}

export interface LoginTwoFactorResult {
  requiresTwoFactor: true;
  partialToken: string;
  token?: undefined;
}

export type LoginResult = LoginSuccessResult | LoginTwoFactorResult;

export interface SsoResult {
  token: string;
  user: AuthUser;
}

export type VerifyResult = AuthUser & { teams: AuthTeam[] };

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface SubscriptionParams {
  teamId?: string;
}

export type Subscription = Record<string, any>;

// ---------------------------------------------------------------------------
// Two-factor authentication
// ---------------------------------------------------------------------------

export interface TwoFactorStatus {
  isEnabled: boolean;
  isRequired: boolean;
  requiredReason: 'global' | 'user' | 'team' | null;
  isConfigured: boolean;
  globalRequired: boolean;
}

export interface TwoFactorSetup {
  qrCodeDataUrl: string;
  manualKey: string;
}

export interface TwoFactorConfirmData {
  token: string;
}

export interface TwoFactorConfirmResult {
  backupCodes: string[];
}

export interface TwoFactorDisableData {
  password: string;
  token: string;
}

export type TwoFactorVerifyData =
  | { token: string; backupCode?: never }
  | { backupCode: string; token?: never };

export interface TwoFactorVerifyResult {
  token: string;
  user: AuthUser & { teams: AuthTeam[] };
}

export interface TwoFactorRequiredData {
  required: boolean;
}

export interface UserTwoFactorStatus {
  isEnabled: boolean;
}

export interface UserTwoFactorResetResult {
  ok: true;
  userId: string;
  reset: {
    twoFactorAuth: number;
    backupCodes: number;
    otpUsed: number;
    rateLimit: number;
  };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface Config {
  cloudMode: boolean;
  faviconUrl?: string;
  linksUrl?: string;
  pixelsUrl?: string;
  privateMode: boolean;
  sessionDeletionEnabled: boolean;
  telemetryDisabled: boolean;
  trackerScriptName?: string;
  updatesDisabled: boolean;
  [key: string]: any;
}
