export interface AuthUser {
  email: string;
  name?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export type OAuthProvider = "google" | "linkedin" | "microsoft" | "github";

export interface OAuthCredentials {
  provider: OAuthProvider;
  token?: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  enrolledAt?: string;
  lastVerifiedAt?: string;
}

export interface TwoFactorEnrollResponse {
  otpauthUrl: string;
  qrCodeDataUrl: string;
  recoveryCodes: string[];
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface TwoFactorVerifyResponse extends TwoFactorStatus {
  recoveryCodes?: string[];
}

export interface TwoFactorDisableRequest {
  code: string;
  confirm: boolean;
}

export interface TwoFactorDisableResponse extends TwoFactorStatus {}

export interface TwoFactorRecoveryCodesResponse {
  recoveryCodes: string[];
}
